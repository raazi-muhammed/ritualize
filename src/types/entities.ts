import { Doc } from "../../convex/_generated/dataModel";

export type CompletionStatus = "completed" | "skipped" | "failed";
export const CompletionStatus = {
  completed: "completed" as const,
  skipped: "skipped" as const,
  failed: "failed" as const,
};

export type Routine = Doc<"routines">;
export type Task = Doc<"tasks">;
export type TaskType = "task" | "checkpoint";
export const TaskType = {
  task: "task" as const,
  checkpoint: "checkpoint" as const,
};

export type TaskWithStatus = Task & {
  status: CompletionStatus;
};

export type RoutineWithTasks = Routine & {
  tasks: TaskWithStatus[];
};

export type TaskWithCompletions = Task & {
  completions: Doc<"taskCompletions">[];
};
