import moment from "moment";

export const formatDuration = (minutes: number | null) => {
    if (minutes == null) return "";
    return `${minutes} minutes`;
};

export const formatDateForInput = (date: Date | null) => {
    return moment(date).format("YYYY-MM-DD");
};
