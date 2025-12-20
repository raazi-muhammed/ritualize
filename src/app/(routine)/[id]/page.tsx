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
import { IoAddCircle } from "react-icons/io5";
import { useModal } from "@/providers/ModelProvider";
import RoutineForm, { routineSchema } from "../_forms/RoutineForm";
import { z } from "zod";
import { createRoutine } from "@/services/routines";

export default function Page({ params }: { params: { id: string } }) {
  const routineId = params.id;
  const { selectedDate } = useStore((state) => state);
  const { openModal, closeModal } = useModal();
  const queryClient = useQueryClient();
  const { data: routine, isFetching } = useQuery({
    queryKey: ["routine", routineId, selectedDate],
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

  return (
    <PageTemplate
      title={routine?.name || "Routine"}
      actions={[
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
      ]}
    >
      <ContentStateTemplate
        isLoading={isFetching}
        skeleton={<RoutineSkeleton />}
      >
        {routine && <RoutinePage routine={routine} />}
        <DateSelector />
      </ContentStateTemplate>
    </PageTemplate>
  );
}
