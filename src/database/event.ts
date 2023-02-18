import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"
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
    const user = await prisma.user.findUnique({
        where: {
            snowflake: snowflake,
        },
        include: {
            CurrentSession: true,
        }
    });

    const id = user?.CurrentSession?.id;
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

export async function getTimeSpentTotal(snowflake: string) {
    const sessions = await prisma.completedSession.findMany({
        where: {
            user: {
                snowflake: snowflake,
            },
        },
    });

    let totalTime = 0;
    const now = dayjs.utc().toDate();

    // try to incorporate the current session
    try {
        const currentSession = await prisma.currentSession.findFirstOrThrow({
            where: {
                user: {
                    snowflake: snowflake,
                },
            },
        });
        totalTime += now.valueOf() - currentSession.joinTime.valueOf()
    } catch (e) { }

    sessions.forEach(session => {
        const duration = session.leaveTime.valueOf() - session.joinTime.valueOf();
        totalTime += duration;
    });

    return totalTime;
}

export async function getTimeSpentToday(snowflake: string) {
    const now = dayjs.utc().toDate();
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

    // try to incorporate the current session
    try {
        const currentSession = await prisma.currentSession.findFirstOrThrow({
            where: {
                user: {
                    snowflake: snowflake,
                },
            },
        });
        totalTime += now.valueOf() - currentSession.joinTime.valueOf()
    } catch (e) { }

    // add the durations for all the other sessions 
    sessions.forEach(session => {
        const duration = session.leaveTime.valueOf() - session.joinTime.valueOf();
        totalTime += duration;
    });

    return totalTime;
}

interface time {
    snowflake: string;
    username: string;
    timeSpent: number;
}

export async function getTotalTimeForAllUsers() {
    const users = await prisma.user.findMany();

    let times: time[] = [];
    for await (const user of users) {
        const total = await getTimeSpentTotal(user.snowflake);
        times.push({ snowflake: user.snowflake, username: user.name, timeSpent: total });
    }

    return times
}