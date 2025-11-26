import {
  CompletionStatus,
  Routine,
  Task,
  TaskCompletion,
} from "@prisma/client";

export type TaskWithStatus = Task & {
  status: CompletionStatus;
};

export type RoutineWithTasks = Routine & {
  tasks: TaskWithStatus[];
};

export type TaskWithCompletions = Task & {
  completions: TaskCompletion[];
};
