export const formatDuration = (minutes: number | null) => {
    if (minutes == null) return "";
    return `${minutes} minutes`;
};
