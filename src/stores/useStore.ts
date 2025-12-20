import {
  RoutineWithTasks,
  TaskWithCompletions,
  TaskWithStatus,
} from "@/types/entities";
import { CompletionStatus, Routine, Task } from "@prisma/client";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Example store interface - customize based on your needs
interface StoreState {
  // Add your state properties here
  routines: RoutineWithTasks[];
  isSyncing: boolean;
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  setIsSyncing: (isSyncing: boolean) => void;
  setRoutines: (routines: RoutineWithTasks[]) => void;
  getRoutine: (routineId: string) => RoutineWithTasks | null;
  createRoutine: (
    routine: Omit<Routine, "id" | "user_id">
  ) => Promise<RoutineWithTasks>;
  updateRoutine: (
    id: string,
    routine: Partial<Omit<Routine, "id" | "user_id">>
  ) => Promise<RoutineWithTasks>;
  deleteRoutine: (id: string) => Promise<void>;
  addTaskToRoutine: (
    routineId: string,
    task: Omit<Task, "id" | "order" | "routine_id">
  ) => Promise<TaskWithStatus>;
  updateTaskStatus: (
    routineId: string,
    taskId: string,
    status: CompletionStatus
  ) => Promise<TaskWithStatus>;
  handleUncheckAllTasks: (routineId: string) => Promise<void>;
  deleteTask: (routineId: string, taskId: string) => Promise<void>;
  updateTask: (
    routineId: string,
    taskId: string,
    task: Partial<Omit<Task, "id" | "order" | "routine_id">>
  ) => Promise<TaskWithStatus>;
  moveTask: (
    routineId: string,
    body: { taskToMoveId: string; moveToTaskId: string }
  ) => Promise<TaskWithStatus>;
  getTask: (routineId: string, taskId: string) => Promise<TaskWithCompletions>;
  deleteTaskCompletion: (
    routineId: string,
    taskId: string,
    completionId: string
  ) => Promise<void>;
}

// Create the store with Zustand
// ... (imports)

// ... (StoreState interface)

export const useStore = create<StoreState>()(
  devtools(
    (set, get) => ({
      // Initial state
      routines: [],
      isSyncing: false,
      selectedDate: null,
      setSelectedDate: (date: Date) => {
        set({ selectedDate: date });
        // initializeRoutines removed
      },
      setIsSyncing: (isSyncing: boolean) => set({ isSyncing }),

      // Actions
      setRoutines: (routines: RoutineWithTasks[]) => set({ routines }),
      getRoutine: (routineId: string) => {
        return (
          get().routines.find((r: RoutineWithTasks) => r.id === routineId) ??
          null
        );
      },
      createRoutine: async (routine: Omit<Routine, "id" | "user_id">) => {
        const response = await fetch("/api/routines", {
          method: "POST",
          body: JSON.stringify(routine),
        });
        if (!response.ok) throw new Error("Failed to create routine");
        const created: RoutineWithTasks = await response.json();
        // initializeRoutines removed
        return created;
      },
      updateRoutine: async (
        id: string,
        routine: Partial<Omit<Routine, "id" | "user_id">>
      ) => {
        const response = await fetch(`/api/routines/${id}`, {
          method: "PUT",
          body: JSON.stringify(routine),
        });
        if (!response.ok) throw new Error("Failed to update routine");
        const updated: RoutineWithTasks = await response.json();
        // initializeRoutines removed
        return updated;
      },
      deleteRoutine: async (id: string) => {
        const response = await fetch(`/api/routines/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete routine");
        // initializeRoutines removed
      },
      addTaskToRoutine: async (
        routineId: string,
        task: Omit<Task, "id" | "order" | "routine_id">
      ) => {
        const response = await fetch(`/api/routines/${routineId}/tasks`, {
          method: "POST",
          body: JSON.stringify(task),
        });
        if (!response.ok) throw new Error("Failed to add task to routine");
        const created: TaskWithStatus = await response.json();
        // initializeRoutines removed
        return created;
      },
      updateTaskStatus: async (
        routineId: string,
        taskId: string,
        status: CompletionStatus
      ) => {
        const response = await fetch(
          `/api/routines/${routineId}/tasks/${taskId}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              status,
              date: get().selectedDate ?? new Date(),
            }),
          }
        );
        if (!response.ok) throw new Error("Failed to update task status");
        const updated: TaskWithStatus = await response.json();
        // initializeRoutines removed
        return updated;
      },
      handleUncheckAllTasks: async (routineId: string) => {
        const response = await fetch(`/api/routines/${routineId}/tasks`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to uncheck all tasks");
        // initializeRoutines removed
      },
      deleteTask: async (routineId: string, taskId: string) => {
        const response = await fetch(
          `/api/routines/${routineId}/tasks/${taskId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Failed to delete task");
        // initializeRoutines removed
      },
      updateTask: async (
        routineId: string,
        taskId: string,
        task: Partial<Omit<Task, "id" | "order" | "routine_id">>
      ) => {
        const response = await fetch(
          `/api/routines/${routineId}/tasks/${taskId}`,
          {
            method: "PUT",
            body: JSON.stringify(task),
          }
        );
        if (!response.ok) throw new Error("Failed to update task");
        const updated: TaskWithStatus = await response.json();
        // initializeRoutines removed
        return updated;
      },
      moveTask: async (
        routineId: string,
        body: { taskToMoveId: string; moveToTaskId: string }
      ) => {
        const response = await fetch(`/api/routines/${routineId}/tasks/move`, {
          method: "POST",
          body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error("Failed to move task");
        const updated: TaskWithStatus = await response.json();
        // initializeRoutines removed
        return updated;
      },
      getTask: async (routineId: string, taskId: string) => {
        const response = await fetch(
          `/api/routines/${routineId}/tasks/${taskId}`
        );
        if (!response.ok) throw new Error("Failed to get task");
        const task: TaskWithCompletions = await response.json();
        return task;
      },
      deleteTaskCompletion: async (
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
        // initializeRoutines removed
      },
    }),
    {
      name: "RoutineStore", // Name for Redux DevTools
    }
  )
);

export function initializeRoutines() {
  // No-op
}
