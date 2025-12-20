import { Routine, Task } from "@prisma/client";
import {
  RoutineWithTasks,
  TaskWithCompletions,
  TaskWithStatus,
} from "@/types/entities";

export const createRoutine = async (
  routine: Omit<Routine, "id" | "user_id">
) => {
  const response = await fetch("/api/routines", {
    method: "POST",
    body: JSON.stringify(routine),
  });
  if (!response.ok) throw new Error("Failed to create routine");
  const created: RoutineWithTasks = await response.json();
  return created;
};

export const getTask = async (routineId: string, taskId: string) => {
  const response = await fetch(`/api/routines/${routineId}/tasks/${taskId}`);
  if (!response.ok) throw new Error("Failed to get task");
  const task: TaskWithCompletions = await response.json();
  return task;
};

export const deleteTaskCompletion = async (
  routineId: string,
  taskId: string,
  completionId: string
) => {
  const response = await fetch(
    `/api/routines/${routineId}/tasks/${taskId}/complitions/${completionId}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) throw new Error("Failed to delete task completion");
};
