import { CompletionStatus, Routine, Task } from "@prisma/client";

export type TaskWithStatus = Task & {
    status: CompletionStatus;
};

export type RoutineWithTasks = Routine & {
    tasks: TaskWithStatus[];
};
