import { prisma } from "./db";

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
