import { RoutineWithTasks, TaskWithStatus } from "@/types/entities";
import { CompletionStatus, Routine, Task } from "@prisma/client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Example store interface - customize based on your needs
interface StoreState {
  // Add your state properties here
  routines: RoutineWithTasks[];
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
}

// Create the store with Zustand
export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        routines: [],

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
          initializeRoutines();
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
          initializeRoutines();
          return updated;
        },
        deleteRoutine: async (id: string) => {
          const response = await fetch(`/api/routines/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) throw new Error("Failed to delete routine");
          initializeRoutines();
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
          initializeRoutines();
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
              body: JSON.stringify({ status }),
            }
          );
          if (!response.ok) throw new Error("Failed to update task status");
          const updated: TaskWithStatus = await response.json();
          initializeRoutines();
          return updated;
        },
        handleUncheckAllTasks: async (routineId: string) => {
          const response = await fetch(`/api/routines/${routineId}/tasks`, {
            method: "DELETE",
          });
          if (!response.ok) throw new Error("Failed to uncheck all tasks");
          initializeRoutines();
        },
      }),
      {
        name: "routine-storage", // Name for localStorage key
      }
    ),
    {
      name: "RoutineStore", // Name for Redux DevTools
    }
  )
);
/**
 * Fetch routines from the API and initialize the store.
 * Returns a promise resolving to the fetched routines.
 */
export async function initializeRoutines() {
  try {
    const response = await fetch("/api/routines");
    if (!response.ok) throw new Error("Failed to fetch routines");
    const routines: RoutineWithTasks[] = await response.json();
    useStore.getState().setRoutines(routines);
    return routines;
  } catch (error) {
    // Handle error accordingly, or rethrow
    console.error("Error initializing routines:", error);
    return [];
  }
}
