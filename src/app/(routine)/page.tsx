"use client";

export const dynamic = "force-static";

import { UserButton } from "@clerk/nextjs";
import RoutineForm from "./_forms/RoutineForm";
import { routineSchema } from "./_forms/schema";
import { z } from "zod";
import { useModal } from "@/providers/ModelProvider";
import PageTemplate from "@/components/layout/PageTemplate";
import { useCreateRoutine } from "@/queries/routine.query";
import RoutineList from "./_components/RoutineList";
import DesktopPageTemplate from "@/components/layout/DesktopPageTemplate";
import { useIsMobile } from "@/hooks/use-mobile";
import { EmptyTemplate } from "@/components/layout/EmptyTemplate";

export default function Home() {
  const { openModal, closeModal } = useModal();
  const { mutateAsync } = useCreateRoutine();
  function onSubmit(values: z.infer<typeof routineSchema>) {
    closeModal();
    mutateAsync(values);
  }
  const isMobile = useIsMobile();

  if (!isMobile)
    return (
      <DesktopPageTemplate>
        <EmptyTemplate
          title="No routine Selected"
          description="Please select a routine to view its details"
        />
      </DesktopPageTemplate>
    );

  return (
    <PageTemplate
      title="Routines"
      hideBack
      actions={[<UserButton key="user-button" />]}
      bottomActions={[
        {
          label: "Add",
          icon: "Plus",
          onClick: () => {
            openModal({
              title: "Add Routine",
              content: <RoutineForm onSubmit={onSubmit} />,
            });
          },
          placement: "right",
        },
      ]}
    >
      <RoutineList />
    </PageTemplate>
  );
}
