import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";
import {
  RoutineWithTasks,
  TaskWithStatus,
  Routine,
  Task,
  CompletionStatus,
} from "@/types/entities";
import { formatDateForInput } from "@/lib/format";
import { useState } from "react";

export const useGetRoutines = () => {
  const data = useQuery(api.routines.getMany);
  return {
    data: data as RoutineWithTasks[] | undefined,
    isLoading: data === undefined,
  };
};

export const useGetTask = (id: string) => {
  const data = useQuery(api.tasks.getWithCompletions, {
    id: id as Id<"tasks">,
  });
  return {
    data: data as
      | (Task & { completions: Doc<"taskCompletions">[] })
      | null
      | undefined,
    isLoading: data === undefined,
  };
};

export const useGetRoutine = (id: string, date?: Date) => {
  const data = useQuery(api.routines.get, {
    id: id as Id<"routines">,
    date: formatDateForInput(date || new Date()),
  });
  return {
    data: data as RoutineWithTasks | null | undefined,
    isLoading: data === undefined,
  };
};

export const useCreateRoutine = (options?: {
  onSuccess?: (id: string) => void;
}) => {
  const createRoutine = useMutation(api.routines.create);

  const mutate = async (
    routine: Omit<Routine, "_id" | "_creationTime" | "userId">,
  ) => {
    const id = await createRoutine({
      name: routine.name,
      icon: routine.icon,
      isFavorite: routine.isFavorite,
    });
    options?.onSuccess?.(id);
    return id;
  };

  return { mutate, mutateAsync: mutate };
};

export const useUpdateRoutine = (
  id: string,
  options?: { onSuccess?: () => void },
) => {
  const updateRoutine = useMutation(api.routines.update);

  const mutate = async (
    routine: Partial<Omit<Routine, "_id" | "_creationTime" | "userId">>,
  ) => {
    await updateRoutine({
      id: id as Id<"routines">,
      ...routine,
    });
    options?.onSuccess?.();
  };

  return { mutate, mutateAsync: mutate };
};

export const useDeleteRoutine = (options?: { onSuccess?: () => void }) => {
  const deleteRoutine = useMutation(api.routines.remove);

  const mutate = async (id: string) => {
    await deleteRoutine({ id: id as Id<"routines"> });
    options?.onSuccess?.();
  };

  return { mutate, mutateAsync: mutate };
};

export const useUncheckAllTasks = (
  id: string,
  options?: { onSuccess?: () => void },
) => {
  const removeCompletions = useMutation(api.completions.removeAllForRoutine);

  const mutate = async () => {
    await removeCompletions({ routineId: id as Id<"routines"> });
    options?.onSuccess?.();
  };

  return { mutate, mutateAsync: mutate };
};

export const useCreateTask = (
  routineId: string,
  options?: { onSuccess?: (id: string) => void },
) => {
  const createTask = useMutation(api.tasks.create);

  const mutate = async (
    task: Omit<
      Task,
      "_id" | "_creationTime" | "order" | "routineId" | "startDate" | "endDate"
    >,
  ) => {
    const id = await createTask({
      routineId: routineId as Id<"routines">,
      name: task.name,
      duration: task.duration,
      type: task.type,
    });
    options?.onSuccess?.(id);
    return id;
  };

  return { mutate, mutateAsync: mutate };
};

export const useUpdateTask = (
  id: string,
  options?: { onSuccess?: () => void },
) => {
  const updateTask = useMutation(api.tasks.update);

  const mutate = async (
    task: Partial<Omit<Task, "_id" | "_creationTime" | "routineId">>,
  ) => {
    await updateTask({
      id: id as Id<"tasks">,
      ...task,
    });
    options?.onSuccess?.();
  };

  return { mutate, mutateAsync: mutate };
};

export const useUpdateTaskStatus = (options?: { onSuccess?: () => void }) => {
  const toggleCompletion = useMutation(api.completions.toggle);

  const mutate = async (
    taskId: string,
    status: CompletionStatus,
    date: Date,
  ) => {
    await toggleCompletion({
      taskId: taskId as Id<"tasks">,
      date: formatDateForInput(date),
      status,
    });
    options?.onSuccess?.();
  };

  return { mutate, mutateAsync: mutate };
};

export const useDeleteCompletion = (options?: { onSuccess?: () => void }) => {
  const deleteCompletion = useMutation(api.completions.remove);

  const mutate = async (id: string) => {
    await deleteCompletion({ id: id as Id<"taskCompletions"> });
    options?.onSuccess?.();
  };

  return { mutate, mutateAsync: mutate };
};

export const useDeleteTask = (options?: { onSuccess?: () => void }) => {
  const deleteTask = useMutation(api.tasks.remove);

  const mutate = async (id: string) => {
    await deleteTask({ id: id as Id<"tasks"> });
    options?.onSuccess?.();
  };

  return { mutate, mutateAsync: mutate };
};

export const useReorderTasks = (options?: { onSuccess?: () => void }) => {
  const reorder = useMutation(api.tasks.reorder);

  const mutate = async (taskIds: string[]) => {
    await reorder({ taskIds: taskIds as Id<"tasks">[] });
    options?.onSuccess?.();
  };

  return { mutate, mutateAsync: mutate };
};

import Papa from "papaparse";

export const useImportRoutine = (options?: { onSuccess?: () => void }) => {
  const bulkImport = useMutation(api.routines.bulkImport);
  const [isPending, setIsPending] = useState(false);

  const mutate = async (formData: FormData) => {
    const file = formData.get("file") as File;
    if (!file) return;

    setIsPending(true);
    try {
      const text = await file.text();
      const result = Papa.parse(text, { header: true });
      const rows = result.data as any[];

      const routinesMap = new Map<string, any>();

      rows.forEach((row) => {
        const routineName = row["Routine Name"];
        if (!routineName) return;

        if (!routinesMap.has(routineName)) {
          routinesMap.set(routineName, {
            routineName,
            routineIcon: row["Routine Icon"] || "List",
            routineDuration: parseInt(row["Routine Duration"]) || 0,
            isFavorite: row["Is Favorite"] === "true",
            tasks: [],
          });
        }

        const routine = routinesMap.get(routineName);
        const taskName = row["Task Name"];
        if (taskName) {
          let task = routine.tasks.find((t: any) => t.name === taskName);
          if (!task) {
            task = {
              name: taskName,
              duration: parseInt(row["Task Duration"]) || 0,
              order: parseInt(row["Task Order"]) || 0,
              type: row["Task Type"] === "checkpoint" ? "checkpoint" : "task",
              completions: [],
            };
            routine.tasks.push(task);
          }

          const completionDate = row["Completion Date"];
          if (completionDate) {
            task.completions.push({
              date: completionDate.split("T")[0],
              status:
                row["Completion Status"] === "completed"
                  ? "completed"
                  : row["Completion Status"] === "skipped"
                    ? "skipped"
                    : "failed",
              notes: row["Completion Notes"],
            });
          }
        }
      });

      await bulkImport({ data: Array.from(routinesMap.values()) });
      options?.onSuccess?.();
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, mutateAsync: mutate, isPending };
};
