import moment from "moment";

export const formatDuration = (minutes: number | null) => {
    if (minutes == null) return "";
    return `${minutes} min`;
};

export const formatDateForInput = (date: Date | null) => {
    return moment(date).format("YYYY-MM-DD");
};

export const formatDate = (date: Date | null) => {
    return moment(date).format("MMM, Do YYYY");
};
