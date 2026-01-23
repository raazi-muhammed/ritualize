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
import { UserMenu } from "@/components/auth/UserMenu";
import { useModal } from "@/providers/ModelProvider";
import { useCreateRoutine } from "@/queries/routine.query";
import { routineSchema } from "@/app/(routine)/_forms/schema";
import { z } from "zod";
import dynamic from "next/dynamic";
import ImportRoutineForm from "@/app/(routine)/_forms/ImportRoutineForm";

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
              <UserMenu key="user-button" />,
              {
                label: "Export",
                icon: "Download",
                onClick: () => {
                  window.location.href = `/api/export`;
                },
                placement: "left",
              },
              {
                label: "Import",
                icon: "Upload",
                onClick: () => {
                  openModal({
                    title: "Import Routine",
                    content: <ImportRoutineForm onSubmit={closeModal} />,
                  });
                },
                placement: "left",
              },
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
