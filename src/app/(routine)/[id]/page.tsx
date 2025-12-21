"use client";

export const dynamic = "force-static";

import RoutinePage from "./_components/RoutinePage";
import { useStore } from "@/stores";
import DateSelector from "@/app/_components/DateSelector";
import RoutineSkeleton from "../_components/RoutineSkeleton";
import PageTemplate from "@/components/layout/PageTemplate";
import ContentStateTemplate from "@/components/layout/ContentStateTemplate";
import { IoAddCircle, IoTrash } from "react-icons/io5";
import { useModal } from "@/providers/ModelProvider";
import RoutineForm, { routineSchema } from "../_forms/RoutineForm";
import { z } from "zod";
import AllTasks from "./_components/AllTasks";
import { toast } from "@/hooks/use-toast";
import { useTransitionRouter } from "next-view-transitions";
import { useSearchParams } from "next/navigation";
import { pageSlideBackAnimation } from "@/lib/animations";
import {
  useCreateRoutine,
  useDeleteRoutine,
  useGetRoutine,
  useUncheckAllTasks,
  useUpdateRoutine,
} from "@/queries/routine.query";

export default function Page({ params }: { params: { id: string } }) {
  const routineId = params.id;
  const searchParams = useSearchParams();
  const nameQueryParam = searchParams.get("name");
  const { selectedDate } = useStore((state) => state);
  const { openModal, closeModal } = useModal();
  const router = useTransitionRouter();

  const { data: routine, isLoading } = useGetRoutine(
    routineId,
    selectedDate || undefined
  );

  const { mutateAsync } = useCreateRoutine();

  function onSubmit(values: z.infer<typeof routineSchema>) {
    closeModal();
    mutateAsync(values);
  }

  const { mutateAsync: uncheckAllTasks } = useUncheckAllTasks(routineId);

  const { mutateAsync: handleDeleteRoutine } = useDeleteRoutine({
    onSuccess: () => {
      toast({
        description: `${routine?.name ?? "Routine"} deleted`,
      });
      router.push("/", {
        onTransitionReady: pageSlideBackAnimation,
      });
    },
  });

  const { mutateAsync: updateRoutine } = useUpdateRoutine(routineId);

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
                onClick: () => handleDeleteRoutine(routineId),
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
