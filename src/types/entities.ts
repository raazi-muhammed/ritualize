import { CompletionStatus, Task } from "@prisma/client";

export type TaskWithStatus = Task & {
    status: CompletionStatus;
};
