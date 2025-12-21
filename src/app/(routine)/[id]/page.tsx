"use client";

export const dynamic = "force-static";

import RoutinePage from "./_components/RoutinePage";
import { useStore } from "@/stores";
import DateSelector from "@/app/_components/DateSelector";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RoutineWithTasks } from "@/types/entities";
import RoutineSkeleton from "../_components/RoutineSkeleton";
import PageTemplate from "@/components/layout/PageTemplate";
import ContentStateTemplate from "@/components/layout/ContentStateTemplate";
import { IoAddCircle, IoTrash } from "react-icons/io5";
import { useModal } from "@/providers/ModelProvider";
import RoutineForm, { routineSchema } from "../_forms/RoutineForm";
import { z } from "zod";
import { createRoutine } from "@/services/routines";
import AllTasks from "./_components/AllTasks";
import { toast } from "@/hooks/use-toast";
import { useTransitionRouter } from "next-view-transitions";
import { useSearchParams } from "next/navigation";
import { pageSlideBackAnimation } from "@/lib/animations";
import { Routine } from "@prisma/client";
import { formatDateForInput } from "@/lib/format";

export default function Page({ params }: { params: { id: string } }) {
  const routineId = params.id;
  const searchParams = useSearchParams();
  const nameQueryParam = searchParams.get("name");
  const { selectedDate } = useStore((state) => state);
  const { openModal, closeModal } = useModal();
  const queryClient = useQueryClient();
  const router = useTransitionRouter();
  const { data: routine, isLoading } = useQuery({
    queryKey: ["routine", routineId, formatDateForInput(selectedDate)],
    queryFn: async () => {
      const response = await fetch(
        `/api/routines/${routineId}?date=${
          selectedDate ? selectedDate.toISOString() : new Date().toISOString()
        }`
      );
      if (!response.ok) return null;
      return (await response.json()) as RoutineWithTasks;
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: createRoutine,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["routines"],
      });
    },
  });

  function onSubmit(values: z.infer<typeof routineSchema>) {
    closeModal();
    mutateAsync(values);
  }

  const { mutateAsync: uncheckAllTasks } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/routines/${routineId}/tasks`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to uncheck all tasks");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      queryClient.invalidateQueries({ queryKey: ["routine", routineId] });
    },
  });

  const { mutateAsync: handleDeleteRoutine } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/routines/${routineId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete routine");
    },
    onSuccess: () => {
      toast({
        description: `${routine?.name ?? "Routine"} deleted`,
      });
      queryClient.invalidateQueries({
        queryKey: ["routines"],
      });
      queryClient.invalidateQueries({ queryKey: ["routine", routineId] });
      router.push("/", {
        onTransitionReady: pageSlideBackAnimation,
      });
    },
  });

  const { mutateAsync: updateRoutine } = useMutation({
    mutationFn: async (values: Partial<Omit<Routine, "id" | "user_id">>) => {
      const response = await fetch(`/api/routines/${routineId}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to update routine");
      return (await response.json()) as RoutineWithTasks;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      queryClient.invalidateQueries({ queryKey: ["routine", routineId] });
    },
  });

  function handleEditRoutineSubmit(values: z.infer<typeof routineSchema>) {
    closeModal();
    updateRoutine(values);
  }

  return (
    <PageTemplate
      backUrl="/"
      title={routine?.name || nameQueryParam || "Routine"}
      actions={
        routine
          ? [
              {
                label: "Add",
                icon: IoAddCircle,
                onClick: () => {
                  openModal({
                    title: "Add Routine",
                    content: <RoutineForm onSubmit={onSubmit} />,
                  });
                },
              },
              {
                label: "All Task",
                onClick: () => {
                  openModal({
                    title: "All tasks",
                    content: <AllTasks showStartDate routine={routine} />,
                  });
                },
              },
              {
                label: "Edit",
                onClick: () => {
                  openModal({
                    title: "Edit Routine",
                    content: (
                      <RoutineForm
                        onSubmit={handleEditRoutineSubmit}
                        defaultValues={{
                          name: routine.name,
                          icon: routine.icon || "List",
                          duration: routine.duration || undefined,
                          is_favorite: routine.is_favorite,
                          type: routine.type,
                        }}
                      />
                    ),
                  });
                },
              },
              {
                label: "Uncheck all",
                onClick: () => uncheckAllTasks(),
              },
              {
                label: "Delete",
                icon: IoTrash,
                onClick: () => handleDeleteRoutine(),
              },
            ]
          : []
      }
    >
      <ContentStateTemplate
        isLoading={isLoading}
        skeleton={<RoutineSkeleton />}
      >
        {routine && <RoutinePage routine={routine} />}
        <DateSelector />
      </ContentStateTemplate>
    </PageTemplate>
  );
}
