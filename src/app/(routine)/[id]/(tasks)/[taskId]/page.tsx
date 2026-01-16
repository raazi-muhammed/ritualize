"use client";

import PageTemplate from "@/components/layout/PageTemplate";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { formatDate, formatDateForInput } from "@/lib/format";
import { TaskWithStatus } from "@/types/entities";
import { deleteTaskCompletion, getTask } from "@/services/routines";
import ContentStateTemplate from "@/components/layout/ContentStateTemplate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TaskForm, { taskSchema } from "../_forms/TaskForm";
import { useModal } from "@/providers/ModelProvider";
import { z } from "zod";
import { Task } from "@prisma/client";
import { useTransitionRouter } from "next-view-transitions";
import { pageSlideBackAnimation } from "@/lib/animations";
import { useSearchParams } from "next/navigation";
import DropdownTemplate from "@/components/layout/DropdownTemplate";

export default function Page({
  params,
}: {
  params: { taskId: string; id: string };
}) {
  const queryClient = useQueryClient();
  const router = useTransitionRouter();
  const searchParams = useSearchParams();
  const nameQueryParam = searchParams.get("name");
  const { openModal, closeModal } = useModal();
  const { data: task, isLoading } = useQuery({
    queryKey: ["task", params.id, params.taskId],
    queryFn: () => getTask(params.id, params.taskId),
  });

  const { mutateAsync: deleteCompletion } = useMutation({
    mutationFn: (completionId: string) =>
      deleteTaskCompletion(params.id, params.taskId, completionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task", params.id, params.taskId],
      });
    },
  });

  const { mutateAsync: updateTask } = useMutation({
    mutationFn: async (
      taskUpdate: Partial<Omit<Task, "id" | "order" | "routine_id">>
    ) => {
      const response = await fetch(
        `/api/routines/${params.id}/tasks/${params.taskId}`,
        {
          method: "PUT",
          body: JSON.stringify(taskUpdate),
        }
      );
      if (!response.ok) throw new Error("Failed to update task");
      return (await response.json()) as TaskWithStatus;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      queryClient.invalidateQueries({ queryKey: ["routine", params.id] });
    },
  });

  const { mutateAsync: deleteTask } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/routines/${params.id}/tasks/${params.taskId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete task");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      queryClient.invalidateQueries({ queryKey: ["routine", params.id] });
      router.push(`/${params.id}`, {
        onTransitionReady: pageSlideBackAnimation,
      });
    },
  });

  function onSubmit(values: z.infer<typeof taskSchema>) {
    closeModal();
    updateTask({
      name: values.name,
      duration: values.duration,

      start_date: new Date(values.startDate),
      type: values.type,
      end_date: null,
    });
  }

  return (
    <PageTemplate
      backUrl={`/${params.id}`}
      title={task?.name || nameQueryParam || "Tasks"}
      actions={
        task
          ? [
              {
                label: "Edit",
                icon: "Pencil",
                onClick: () => {
                  openModal({
                    title: "Edit Task",
                    content: (
                      <TaskForm
                        hideCreateNew
                        onSubmit={onSubmit}
                        defaultValues={{
                          duration: task.duration,
                          name: task.name,
                          startDate: formatDateForInput(task.start_date),
                          type: task.type,
                        }}
                      />
                    ),
                  });
                },
              },
              {
                label: "Delete",
                icon: "Trash",
                variant: "destructive",
                onClick: () => {
                  deleteTask();
                },
              },
            ]
          : []
      }
    >
      <ContentStateTemplate isLoading={isLoading}>
        {task && (
          <>
            <p className="text-xl font-bold">{`${task.completions.length} Completions`}</p>
            <Calendar
              className="w-full"
              classNames={{
                months:
                  "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                month: "space-y-4 w-full",
                table: "w-full border-collapse space-y-1",
                head_row: "flex w-full justify-between",
                row: "flex w-full mt-2 justify-between",
              }}
              numberOfMonths={3}
              mode="multiple"
              selected={task.completions.map((c) => new Date(c.date))}
            />

            <p className="text-xl font-bold mt-4 ps-2">Records</p>
            <ul className="space-y-2">
              {task.completions.map((completion) => (
                <li key={completion.id}>
                  <Card className="py-2 px-4 flex justify-between items-center">
                    <div>
                      <p className="text-lg">{formatDate(completion.date)}</p>
                      <p>{completion.status}</p>
                    </div>
                    <DropdownTemplate
                      actions={[
                        {
                          label: "Delete",
                          icon: "Trash",
                          variant: "destructive",
                          onClick: async () => {
                            await deleteCompletion(completion.id);
                          },
                        },
                      ]}
                    />
                  </Card>
                </li>
              ))}
            </ul>
          </>
        )}
      </ContentStateTemplate>
    </PageTemplate>
  );
}
