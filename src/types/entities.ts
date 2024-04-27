export type Routine = {
    name: string;
    duration: number;
    cover: string;
    tasks: Task[];
};

export type Task = {
    name: string;
    duration: number;
};
