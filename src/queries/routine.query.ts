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

// TODO: useImportRoutine migration would require a custom Convex action for handling FormData
// For now, let's keep it commented out or as a placeholder
export const useImportRoutine = (options?: { onSuccess?: () => void }) => {
  return {
    mutate: async (formData: FormData) => {
      console.warn("Import Routine migration pending (requires Convex Action)");
    },
    mutateAsync: async (formData: FormData) => {
      console.warn("Import Routine migration pending (requires Convex Action)");
    },
  };
};
