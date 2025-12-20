import {
  RoutineWithTasks,
  TaskWithCompletions,
  TaskWithStatus,
} from "@/types/entities";
import { CompletionStatus, Routine, Task } from "@prisma/client";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import debounce from "lodash.debounce";

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
export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        routines: [],
        isSyncing: false,
        selectedDate: null,
        setSelectedDate: (date: Date) => {
          set({ selectedDate: date });
          initializeRoutines();
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
          // optimistic updates
          set({
            routines: get().routines.map((r) =>
              r.id === routineId
                ? {
                    ...r,
                    tasks: r.tasks.map((t) =>
                      t.id === taskId ? { ...t, status: status } : t
                    ),
                  }
                : r
            ),
          });

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
          initializeRoutines();
          return updated;
        },
        handleUncheckAllTasks: async (routineId: string) => {
          // optimistic updates
          set({
            routines: get().routines.map((r) =>
              r.id === routineId
                ? {
                    ...r,
                    tasks: r.tasks.map((t) => ({ ...t, status: "skipped" })),
                  }
                : r
            ),
          });

          const response = await fetch(`/api/routines/${routineId}/tasks`, {
            method: "DELETE",
          });
          if (!response.ok) throw new Error("Failed to uncheck all tasks");
          initializeRoutines();
        },
        deleteTask: async (routineId: string, taskId: string) => {
          // optimistic updates
          set({
            routines: get().routines.map((r) =>
              r.id === routineId
                ? { ...r, tasks: r.tasks.filter((t) => t.id !== taskId) }
                : r
            ),
          });
          const response = await fetch(
            `/api/routines/${routineId}/tasks/${taskId}`,
            {
              method: "DELETE",
            }
          );
          if (!response.ok) throw new Error("Failed to delete task");
          initializeRoutines();
        },
        updateTask: async (
          routineId: string,
          taskId: string,
          task: Partial<Omit<Task, "id" | "order" | "routine_id">>
        ) => {
          // optimistic updates
          set({
            routines: get().routines.map((r) =>
              r.id === routineId
                ? {
                    ...r,
                    tasks: r.tasks.map((t) =>
                      t.id === taskId ? { ...t, ...task } : t
                    ),
                  }
                : r
            ),
          });

          const response = await fetch(
            `/api/routines/${routineId}/tasks/${taskId}`,
            {
              method: "PUT",
              body: JSON.stringify(task),
            }
          );
          if (!response.ok) throw new Error("Failed to update task");
          const updated: TaskWithStatus = await response.json();
          initializeRoutines();
          return updated;
        },
        moveTask: async (
          routineId: string,
          body: { taskToMoveId: string; moveToTaskId: string }
        ) => {
          // optimistic updates
          const moveToTask = get()
            .routines.find((r) => r.id === routineId)
            ?.tasks.find((t) => t.id === body.moveToTaskId);
          if (!moveToTask) throw new Error("Move to task not found");

          set({
            routines: get().routines.map((r) =>
              r.id === routineId
                ? {
                    ...r,
                    tasks: r.tasks
                      .map((t) =>
                        t.id === body.taskToMoveId
                          ? {
                              ...t,
                              order: moveToTask.order,
                            }
                          : {
                              ...t,
                              order: t.order > t.order ? t.order : t.order + 1,
                            }
                      )
                      .toSorted((a, b) => a.order - b.order),
                  }
                : r
            ),
          });

          const response = await fetch(
            `/api/routines/${routineId}/tasks/move`,
            {
              method: "POST",
              body: JSON.stringify(body),
            }
          );
          if (!response.ok) throw new Error("Failed to move task");
          const updated: TaskWithStatus = await response.json();
          initializeRoutines();
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
          initializeRoutines();
        },
      }),
      {
        name: "routine-storage", // Name for localStorage key
        partialize: (state) => ({
          routines: state.routines,
        }),
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
async function _initializeRoutines() {
  // Skip if already syncing to prevent duplicate calls
  if (useStore.getState().isSyncing) {
    return;
  }

  try {
    useStore.getState().setIsSyncing(true);
    const date = useStore.getState().selectedDate ?? new Date();
    const response = await fetch(`/api/routines?date=${date.toISOString()}`);
    if (!response.ok) throw new Error("Failed to fetch routines");
    const routines: RoutineWithTasks[] = await response.json();
    useStore.getState().setRoutines(routines);
    return routines;
  } catch (error) {
    // Handle error accordingly, or rethrow
    console.error("Error initializing routines:", error);
    return [];
  } finally {
    useStore.getState().setIsSyncing(false);
  }
}

/**
 * Debounced version of initializeRoutines to prevent excessive API calls.
 * Waits 800ms after the last call before executing.
 * This ensures that rapid consecutive calls (like clicking "Next" multiple times)
 * will only result in a single API call once the user stops clicking.
 */
const debouncedInitializeRoutines = debounce(_initializeRoutines, 800);

/**
 * Wrapper to ensure we cancel any pending calls if a sync is already in progress
 */
export function initializeRoutines() {
  // Cancel any pending debounced calls if we're already syncing
  if (useStore.getState().isSyncing) {
    debouncedInitializeRoutines.cancel();
    return;
  }
  debouncedInitializeRoutines();
}
