import { Doc } from "../../convex/_generated/dataModel";

export type CompletionStatus = "completed" | "skipped" | "failed";
export const CompletionStatus = {
  completed: "completed" as const,
  skipped: "skipped" as const,
  failed: "failed" as const,
};

export const ROUTINE_COLORS = [
  "indigo",
  "violet",
  "rose",
  "amber",
  "emerald",
  "cyan",
] as const;
export type RoutineColor = (typeof ROUTINE_COLORS)[number];

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
