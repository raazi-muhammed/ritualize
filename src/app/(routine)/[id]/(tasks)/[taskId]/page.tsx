"use client";

import PageTemplate from "@/components/layout/PageTemplate";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { formatDate, formatDateForInput } from "@/lib/format";
import {
  useDeleteCompletion,
  useDeleteTask,
  useGetTask,
  useUpdateTask,
} from "@/queries/routine.query";
import ContentStateTemplate from "@/components/layout/ContentStateTemplate";
import TaskForm, { taskSchema } from "../_forms/TaskForm";
import { useModal } from "@/providers/ModelProvider";
import { z } from "zod";
import { useTransitionRouter } from "next-view-transitions";
import { pageSlideBackAnimation } from "@/lib/animations";
import { useSearchParams } from "next/navigation";
import DropdownTemplate from "@/components/layout/DropdownTemplate";
import { EmptyTemplate } from "@/components/layout/EmptyTemplate";

export default function Page({
  params,
}: {
  params: { taskId: string; id: string };
}) {
  const router = useTransitionRouter();
  const searchParams = useSearchParams();
  const nameQueryParam = searchParams.get("name");
  const { openModal, closeModal } = useModal();

  const { data: task, isLoading } = useGetTask(params.taskId);

  const { mutateAsync: deleteCompletion } = useDeleteCompletion();

  const { mutateAsync: updateTask } = useUpdateTask(params.taskId);

  const { mutateAsync: deleteTask } = useDeleteTask({
    onSuccess: () => {
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
      type: values.type,
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
                          startDate: formatDateForInput(
                            new Date(task.startDate),
                          ),
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
                  deleteTask(params.taskId);
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
            {task.completions.length === 0 ? (
              <EmptyTemplate
                title="No records yet"
                description="Complete this task to start building a record history."
              />
            ) : (
              <ul className="space-y-2">
                {task.completions.map((completion) => (
                  <li key={completion._id}>
                    <Card className="py-2 px-4 flex justify-between items-center">
                      <div>
                        <p className="text-lg">
                          {formatDate(new Date(completion.date))}
                        </p>
                        <p>{completion.status}</p>
                      </div>
                      <DropdownTemplate
                        actions={[
                          {
                            label: "Delete",
                            icon: "Trash",
                            variant: "destructive",
                            onClick: async () => {
                              await deleteCompletion(completion._id);
                            },
                          },
                        ]}
                      />
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </ContentStateTemplate>
    </PageTemplate>
  );
}
