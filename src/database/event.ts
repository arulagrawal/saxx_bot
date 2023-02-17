import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"
import { prisma } from "./db";

dayjs.extend(utc);

export async function createSession(username: string, startTime: Date) {
    const c = await prisma.currentSession.create({
        data: {
            user: {
                connectOrCreate: {
                    where: {
                        name: username,
                    },
                    create: {
                        name: username,
                    },
                },
            },
            joinTime: startTime,
        },
    });
    return c;
}

export async function updateSession(username: string, endTime: Date) {
    // we can assume that the user has a corresponding session in currentsessions.

    // we can delete the current session and create a completed session.
    const user = await prisma.user.findUnique({
        where: {
            name: username,
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
                connectOrCreate: {
                    where: {
                        name: username,
                    },
                    create: {
                        name: username,
                    },
                },
            },
            joinTime: currentSession.joinTime,
            leaveTime: endTime,
        },
    });

    return completedSession;
}

export async function getTimeSpentTotal(username: string) {
    const sessions = await prisma.completedSession.findMany({
        where: {
            user: {
                name: username,
            },
        },
    });

    let totalTime = 0;

    sessions.forEach(session => {
        const duration = session.leaveTime.valueOf() - session.joinTime.valueOf();
        totalTime += duration;
    });

    return totalTime;
}

export async function getTimeSpentToday(username: string) {
    const now = dayjs.utc().toDate();
    const end = dayjs.utc().endOf('day').toDate();
    const start = dayjs.utc().startOf('day').toDate();
    const sessions = await prisma.completedSession.findMany({
        where: {
            user: {
                name: username,
            },
            leaveTime: {
                gte: start,
                lte: end,
            },
        },
    });

    let totalTime = 0;

    try {
        const currentSession = await prisma.currentSession.findFirstOrThrow({
            where: {
                user: {
                    name: username,
                },
            },
        });
        totalTime += now.valueOf() - currentSession.joinTime.valueOf()
    } catch (e) {}

    sessions.forEach(session => {
        const duration = session.leaveTime.valueOf() - session.joinTime.valueOf();
        totalTime += duration;
    });

    return totalTime;
}