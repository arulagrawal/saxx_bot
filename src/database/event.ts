import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"
import { time_range } from "../enums/timeRanges";
import { time } from "../interfaces/time";
import { prisma } from "./db";

dayjs.extend(utc);

export async function createSession(snowflake: string, username: string, startTime: Date) {
    const c = await prisma.currentSession.create({
        data: {
            user: {
                connectOrCreate: {
                    where: {
                        snowflake: snowflake,
                    },
                    create: {
                        snowflake: snowflake,
                        name: username,
                    },
                },
            },
            joinTime: startTime,
        },
    });
    return c;
}

export async function updateSession(snowflake: string, endTime: Date) {
    // we can assume that the user has a corresponding session in currentsessions.

    // we can delete the current session and create a completed session.
    let id: number | undefined;
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                snowflake: snowflake,
            },
            include: {
                CurrentSession: true,
            }
        });
        id = user?.CurrentSession?.id;
    } catch (e) { return }

    if (!id) {
        // there is no current session, the user was already connected when the bot joined :(
        // in the future the bot could look at who is connected when the bot joins?
        return
    }
    const currentSession = await prisma.currentSession.delete({
        where: {
            id: id
        },
    });

    const completedSession = await prisma.completedSession.create({
        data: {
            user: {
                connect: {
                    snowflake: snowflake,
                },
            },
            joinTime: currentSession.joinTime,
            leaveTime: endTime,
        },
    });

    return completedSession;
}

// this function looks at a user's current session and returns the time between when the session was started and the current time
async function getCurrentSessionTime(snowflake: string) {
    const now = dayjs.utc().toDate();

    try {
        const currentSession = await prisma.currentSession.findFirstOrThrow({
            where: {
                user: {
                    snowflake: snowflake,
                },
            },
        });
        return now.valueOf() - currentSession.joinTime.valueOf()
    } catch (e) { return 0 }
}

export async function getTimeSpentTotal(snowflake: string) {
    const sessions = await prisma.completedSession.findMany({
        where: {
            user: {
                snowflake: snowflake,
            },
        },
    });

    let totalTime = 0;

    totalTime += await getCurrentSessionTime(snowflake);

    sessions.forEach(session => {
        const duration = session.leaveTime.valueOf() - session.joinTime.valueOf();
        totalTime += duration;
    });

    return totalTime;
}

export async function getTimeSpentInTimeRange(snowflake: string, time_period: time_range) {

    if (time_period == "today") {
        return getTimeSpentToday(snowflake);
    } else if (time_period == "total") {
        return getTimeSpentTotal(snowflake);
    }

    const now = dayjs.utc().toDate();
    // TODO: make it actually go back the specified duration instead of calender month or w/e 
    const start = dayjs.utc().startOf(time_period as dayjs.OpUnitType).toDate();

    const sessions = await prisma.completedSession.findMany({
        where: {
            user: {
                snowflake: snowflake,
            },
            leaveTime: {
                gte: start,
                lte: now,
            },
        },
    });

    let totalTime = 0;

    totalTime += await getCurrentSessionTime(snowflake);

    // add the durations for all the other sessions 
    sessions.forEach(session => {
        const duration = session.leaveTime.valueOf() - session.joinTime.valueOf();
        totalTime += duration;
    });

    return totalTime;
}

export async function getTimeSpentToday(snowflake: string) {
    const start = dayjs.utc().startOf('day').toDate();
    const end = dayjs.utc().endOf('day').toDate();


    const sessions = await prisma.completedSession.findMany({
        where: {
            user: {
                snowflake: snowflake,
            },
            leaveTime: {
                gte: start,
                lte: end,
            },
        },
    });

    let totalTime = 0;

    totalTime += await getCurrentSessionTime(snowflake);

    // add the durations for all the other sessions 
    sessions.forEach(session => {
        const duration = session.leaveTime.valueOf() - session.joinTime.valueOf();
        totalTime += duration;
    });

    return totalTime;
}

// TODO: what if there are no users in the db?
export async function getTotalTimeForAllUsers() {
    const users = await prisma.user.findMany();

    const times: time[] = [];
    for await (const user of users) {
        const total = await getTimeSpentTotal(user.snowflake);
        times.push({ snowflake: user.snowflake, username: user.name, timeSpent: total });
    }

    return times
}