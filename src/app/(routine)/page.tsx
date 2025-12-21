"use client";

export const dynamic = "force-static";

import { IoAddCircle as AddIcon } from "react-icons/io5";
import { UserButton } from "@clerk/nextjs";

import RoutineForm, { routineSchema } from "./_forms/RoutineForm";
import { z } from "zod";
import RoutineCard from "./[id]/_components/RoutineCard";
import { useModal } from "@/providers/ModelProvider";
import InfoMessage from "@/components/message/InfoMessage";
import DateSelector from "../_components/DateSelector";
import RoutineSkeleton from "./_components/RoutineSkeleton";
import PageTemplate from "@/components/layout/PageTemplate";
import ContentStateTemplate from "@/components/layout/ContentStateTemplate";
import { useCreateRoutine, useGetRoutines } from "@/queries/routine.query";

export default function Home() {
  const { openModal, closeModal } = useModal();

  const { data: routines, isLoading } = useGetRoutines();
  const { mutateAsync } = useCreateRoutine();

  function onSubmit(values: z.infer<typeof routineSchema>) {
    closeModal();
    mutateAsync(values);
  }

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
        isLoading={isLoading}
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
