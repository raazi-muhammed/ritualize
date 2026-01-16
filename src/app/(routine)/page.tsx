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
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
          architecto quo consectetur mollitia cumque. Distinctio ut autem
          ducimus quasi suscipit corrupti in esse, cum blanditiis. Eaque
          eligendi est doloribus consectetur?
        </p>
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
