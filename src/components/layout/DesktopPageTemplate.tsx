"use client";

import RoutineList from "@/app/(routine)/_components/RoutineList";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import React from "react";
import PageTemplate from "./PageTemplate";
import { UserButton } from "@clerk/nextjs";
import { useModal } from "@/providers/ModelProvider";
import { useCreateRoutine } from "@/queries/routine.query";
import { routineSchema } from "@/app/(routine)/_forms/schema";
import { z } from "zod";
import dynamic from "next/dynamic";

const RoutineForm = dynamic(
  () => import("@/app/(routine)/_forms/RoutineForm"),
  {
    ssr: false,
  }
);

const DesktopPageTemplate = ({ children }: { children: React.ReactNode }) => {
  const { openModal, closeModal } = useModal();
  const { mutateAsync } = useCreateRoutine();
  function onSubmit(values: z.infer<typeof routineSchema>) {
    closeModal();
    mutateAsync(values);
  }

  return (
    <SidebarProvider>
      <Sidebar variant="floating">
        <SidebarContent>
          <PageTemplate
            hideBack
            isOnSidebar
            actions={[
              <UserButton
                key="user-button"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8",
                  },
                }}
              />,
            ]}
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
            <div className="h-2" />
            <RoutineList />
          </PageTemplate>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default DesktopPageTemplate;
