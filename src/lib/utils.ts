import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate } from "./format";
import { Task } from "@/types/entities";

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
  return `${options?.showStartDate ? `from ${formatDate(new Date(task.startDate))}` : ""}`;
};
