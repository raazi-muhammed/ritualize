import { format } from "date-fns";

export const formatDuration = (minutes: number | null) => {
  if (minutes == null) return "";
  return `${minutes} min`;
};

export const formatDateForInput = (date: Date | null) => {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
};

export const formatDate = (date: Date | null) => {
  if (!date) return "";
  return format(date, "MMM, do yyyy");
};
