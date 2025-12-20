"use client";

export const dynamic = "force-static";

import { IoAddCircle as AddIcon } from "react-icons/io5";
import { UserButton } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import RoutineForm, { routineSchema } from "./_forms/RoutineForm";
import { z } from "zod";
import RoutineCard from "./[id]/_components/RoutineCard";
import { useModal } from "@/providers/ModelProvider";
import InfoMessage from "@/components/message/InfoMessage";
import { useStore } from "@/stores";
import { useEffect } from "react";
import DateSelector from "../_components/DateSelector";
import { RoutineWithTasks } from "@/types/entities";
import RoutineSkeleton from "./_components/RoutineSkeleton";
import { createRoutine } from "@/services/routines";
import PageTemplate from "@/components/layout/PageTemplate";
import ContentStateTemplate from "@/components/layout/ContentStateTemplate";

export default function Home() {
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModal();
  const { selectedDate, setSelectedDate } = useStore((state) => state);

  const { data: routines = [], isFetching } = useQuery({
    queryKey: ["routines", selectedDate],
    queryFn: async () => {
      const response = await fetch(
        `/api/routines?date=${
          selectedDate ? selectedDate.toISOString() : new Date().toISOString()
        }`
      );
      if (!response.ok) throw new Error("Failed to fetch routines");
      return (await response.json()) as RoutineWithTasks[];
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

  useEffect(() => {
    setSelectedDate(new Date());
  }, [setSelectedDate]);

  return (
    <PageTemplate
      title="Routines"
      hideBack
      actions={[
        {
          label: "Add",
          icon: AddIcon,
          onClick: () => {
            openModal({
              title: "Add Routine",
              content: <RoutineForm onSubmit={onSubmit} />,
            });
          },
        },
        <UserButton key="user-button" />,
      ]}
    >
      <ContentStateTemplate
        isLoading={isFetching}
        skeleton={<RoutineSkeleton />}
      >
        <section className="flex flex-col gap-4 mb-12">
          <section className="grid grid-cols-2 gap-4">
            {routines
              ?.filter((r) => r.is_favorite)
              .map((routine) => (
                <RoutineCard key={routine.id} isList={true} routine={routine} />
              ))}
          </section>
          {routines
            ?.filter((r) => !r.is_favorite)
            .map((routine) => (
              <RoutineCard key={routine.id} routine={routine} />
            ))}
          {routines?.length === 0 && <InfoMessage message="No routines yet" />}
        </section>
        <DateSelector />
      </ContentStateTemplate>
    </PageTemplate>
  );
}
