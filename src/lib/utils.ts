import { Frequency, Task } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate } from "./format";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function shouldShowTaskToday(
    currentDate: Date,
    startDate: Date,
    frequency: "daily" | "weekly" | "monthly",
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
            monthsDiff % everyFrequency === 0 &&
            (!daysInFrequency || daysInFrequency.includes(currentDay))
        );
    }

    return false;
}

const getWeekday = (day: number) => {
    switch (day) {
        case 0:
            return "Su";
        case 1:
            return "Mo";
        case 2:
            return "Tu";
        case 3:
            return "We";
        case 4:
            return "Th";
        case 5:
            return "Fr";
        case 6:
            return "Sa";
    }
};

export const showOnCurrentDate = (selectedDate: Date, task: Task) => {
    return shouldShowTaskToday(
        selectedDate,
        task.start_date,
        task.frequency,
        task.every_frequency,
        task.days_in_frequency
    );
};

type Options = {
    showStartDate?: boolean;
};
export const generateCardDescription = (task: Task, options: Options) => {
    return `Every ${
        task.every_frequency > 1 ? task.every_frequency : ""
    } ${task.frequency.replace("ly", "").replace("dai", "day")}${
        task.every_frequency > 1 ? "s" : ""
    } ${
        task.frequency === Frequency.weekly
            ? "on " +
              task.days_in_frequency.map((day) => getWeekday(day)).join(", ")
            : ""
    } ${options?.showStartDate ? `from ${formatDate(task.start_date)}` : ""}`;
};
