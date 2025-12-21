import { Task } from "@prisma/client";
import { TaskWithCompletions } from "@/types/entities";

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
