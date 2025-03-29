import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate } from "./format";
import { Task, Frequency } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
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
