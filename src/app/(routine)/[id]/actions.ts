"use server";

import { prisma } from "@/lib/prisma";

export async function getRoutine(id: string) {
    return await prisma.routine.findFirst({
        where: {
            id,
        },
        include: {
            tasks: {
                orderBy: {
                    order: "asc",
                },
            },
        },
    });
}

export async function getRoutineForDate(id: string, date: Date) {
    const routine = await prisma.routine.findFirst({
        where: {
            id,
        },
        include: {
            tasks: {
                orderBy: {
                    order: "asc",
                },
                include: {
                    completions: {
                        where: {
                            date: new Date(date.setHours(0, 0, 0, 0)),
                        },
                    },
                },
            },
        },
    });

    if (!routine) return null;

    return {
        ...routine,
        tasks: routine.tasks.map((task) => ({
            ...task,
            status: task.completions[0]?.status || "skipped",
            completions: undefined, // Remove the completions array
        })),
    };
}
