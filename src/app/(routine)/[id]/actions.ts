"use server";

import { prisma } from "@/lib/prisma";
import { Frequency, Task } from "@prisma/client";

function shouldShowTaskToday(
    currentDate: Date,
    startDate: Date,
    frequency: Frequency,
    everyFrequency: number,
    daysInFrequency?: number[]
): boolean {
    const start = new Date(startDate);
    const current = new Date(currentDate);

    // Normalize time to midnight for date-only comparison
    start.setHours(0, 0, 0, 0);
    current.setHours(0, 0, 0, 0);

    if (start > current) return false;

    const diffInDays = Math.floor(
        (current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (frequency === "daily") {
        return diffInDays % everyFrequency === 0;
    }

    if (frequency === "weekly") {
        const startWeekDay = start.getDay(); // 0 (Sunday) to 6 (Saturday)
        const currentWeekDay = current.getDay();

        if (!daysInFrequency || daysInFrequency.length === 0) return false;

        return (
            diffInDays % (everyFrequency * 7) < 7 && // Within a valid week cycle
            daysInFrequency.includes(currentWeekDay)
        );
    }

    if (frequency === "monthly") {
        const startDay = start.getDate();
        const currentDay = current.getDate();
        const monthsDiff =
            (current.getFullYear() - start.getFullYear()) * 12 +
            (current.getMonth() - start.getMonth());

        return (
            monthsDiff % everyFrequency === 0 && // Within a valid month cycle
            currentDay === startDay
        );
    }

    return false;
}

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

    if (!routine) throw new Error("Routine not found");

    const filteredTasks = routine.tasks.filter((task) =>
        shouldShowTaskToday(
            date,
            task.start_date,
            task.frequency,
            task.every_frequency,
            task.days_in_frequency
        )
    );

    return {
        ...routine,
        tasks: filteredTasks.map((task) => ({
            ...task,
            status: task.completions[0]?.status || "skipped",
            completions: undefined, // Remove the completions array
        })),
    };
}
