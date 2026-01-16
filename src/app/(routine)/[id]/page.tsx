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
import { routineSchema } from "../_forms/schema";
import nextDynamic from "next/dynamic";

const RoutineForm = nextDynamic(() => import("../_forms/RoutineForm"), {
  ssr: false,
});
import TaskForm, {
  DEFAULT_TASK_VALUES,
  taskSchema,
} from "./(tasks)/_forms/TaskForm";
import { z } from "zod";
import AllTasks from "./_components/AllTasks";
import { toast } from "@/hooks/use-toast";
import { useTransitionRouter } from "next-view-transitions";
import { useSearchParams } from "next/navigation";
import { pageSlideAnimation, pageSlideBackAnimation } from "@/lib/animations";
import {
  useDeleteRoutine,
  useGetRoutine,
  useUncheckAllTasks,
  useUpdateRoutine,
  useCreateTask,
} from "@/queries/routine.query";
import { formatDateForInput } from "@/lib/format";

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

  const { mutateAsync: uncheckAllTasks } = useUncheckAllTasks(routineId);

  const { mutateAsync: addTaskToRoutine } = useCreateTask(routineId);

  function handleAddTaskSubmit(values: z.infer<typeof taskSchema>) {
    if (!values.createNew) closeModal();
    addTaskToRoutine({
      name: values.name,
      duration: values.duration,

      start_date: new Date(values.startDate),
      end_date: null,
      type: values.type,
    });
  }

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
                icon: "Plus",
                onClick: () => {
                  openModal({
                    title: "Add Task",
                    content: (
                      <TaskForm
                        onSubmit={handleAddTaskSubmit}
                        defaultValues={{
                          ...DEFAULT_TASK_VALUES,
                          startDate: formatDateForInput(
                            selectedDate || new Date()
                          ),
                        }}
                      />
                    ),
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
                icon: "Pencil",
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
                        }}
                      />
                    ),
                  });
                },
              },
              {
                label: "Uncheck all",
                icon: "CheckCheck",
                onClick: () => uncheckAllTasks(),
              },
              {
                label: "Delete",
                icon: "Trash",
                onClick: () => handleDeleteRoutine(routineId),
              },
            ]
          : []
      }
      bottomActions={[
        {
          label: "Start",
          icon: "Play",
          placement: "right",
          onClick: () => {
            router.push(`/${routine?.id}/start`, {
              onTransitionReady: pageSlideAnimation,
            });
          },
        },
      ]}
    >
      <DateSelector />
      <ContentStateTemplate
        isLoading={isLoading}
        skeleton={<RoutineSkeleton />}
      >
        {routine && <RoutinePage routine={routine} />}
      </ContentStateTemplate>
    </PageTemplate>
  );
}
