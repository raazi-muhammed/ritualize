import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { RoutineWithTasks } from "@/types/entities";
import { Routine } from "@prisma/client";
import { formatDateForInput } from "@/lib/format";

export const routineKeys = {
  all: ["routines"] as const,
  lists: () => [...routineKeys.all, "list"] as const,
  details: () => [...routineKeys.all, "detail"] as const,
  detail: (id: string, date: Date) =>
    [...routineKeys.details(), id, formatDateForInput(date)] as const,
};

export const useGetRoutines = () => {
  return useQuery({
    queryKey: routineKeys.lists(),
    queryFn: async () => {
      const response = await fetch(`/api/routines`);
      if (!response.ok) throw new Error("Failed to fetch routines");
      return (await response.json()) as RoutineWithTasks[];
    },
  });
};

export const useGetRoutine = (id: string, date?: Date) => {
  return useQuery({
    queryKey: routineKeys.detail(id, date || new Date()),
    queryFn: async () => {
      const response = await fetch(
        `/api/routines/${id}?date=${
          date ? date.toISOString() : new Date().toISOString()
        }`
      );
      if (!response.ok) throw new Error("Failed to fetch routine");
      return (await response.json()) as RoutineWithTasks;
    },
    enabled: !!id,
  });
};

export const useCreateRoutine = (
  options?: UseMutationOptions<
    RoutineWithTasks,
    Error,
    Omit<Routine, "id" | "user_id">
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (routine) => {
      const response = await fetch("/api/routines", {
        method: "POST",
        body: JSON.stringify(routine),
      });
      if (!response.ok) throw new Error("Failed to create routine");
      return (await response.json()) as RoutineWithTasks;
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateRoutine = (
  id: string,
  options?: UseMutationOptions<
    RoutineWithTasks,
    Error,
    Partial<Omit<Routine, "id" | "user_id">>
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (routine) => {
      const response = await fetch(`/api/routines/${id}`, {
        method: "PUT",
        body: JSON.stringify(routine),
      });
      if (!response.ok) throw new Error("Failed to update routine");
      return (await response.json()) as RoutineWithTasks;
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteRoutine = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/routines/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete routine");
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};

export const useUncheckAllTasks = (
  id: string,
  options?: UseMutationOptions<void, Error, void>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/routines/${id}/tasks`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to uncheck all tasks");
    },
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: routineKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};
