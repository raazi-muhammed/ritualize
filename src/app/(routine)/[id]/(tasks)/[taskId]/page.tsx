"use client";

import { useMemo } from "react";
import PageTemplate from "@/components/layout/PageTemplate";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { formatDate, formatDateForInput } from "@/lib/format";
import {
  useDeleteCompletion,
  useDeleteTask,
  useGetTask,
  useGetTaskCompletions,
  useUpdateTask,
} from "@/queries/routine.query";
import ContentStateTemplate from "@/components/layout/ContentStateTemplate";
import TaskForm, { taskSchema } from "../_forms/TaskForm";
import { useModal } from "@/providers/ModelProvider";
import { useAlert } from "@/providers/AlertProvider";
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
  const { openAlert } = useAlert();

  const { data: task, isLoading } = useGetTask(params.taskId);
  const {
    completions,
    canLoadMore,
    isLoadingMore,
    loadMore,
  } = useGetTaskCompletions(task ? params.taskId : undefined);

  const calendarDates = useMemo(
    () => task?.completionDates.map((date) => new Date(date)) ?? [],
    [task?.completionDates],
  );

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
                icon: "PencilEdit01Icon",
                iconOnly: true,
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
                iconOnly: true,
                onClick: () => {
                  openAlert({
                    title: "Delete task",
                    description: `Are you sure you want to delete "${task.name}"? This cannot be undone.`,
                    onConfirm: () => deleteTask(params.taskId),
                  });
                },
              },
            ]
          : []
      }
    >
      <ContentStateTemplate isLoading={isLoading}>
        {task && (
          <>
            <p className="text-xl font-bold">{`${task.completionCount} Completions`}</p>
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
              selected={calendarDates}
            />

            <p className="text-xl font-bold mt-4 ps-2">Records</p>
            {completions.length === 0 ? (
              <EmptyTemplate
                title="No records yet"
                description="Complete this task to start building a record history."
              />
            ) : (
              <>
                <ul className="space-y-2">
                  {completions.map((completion) => (
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
                {canLoadMore && (
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    disabled={isLoadingMore}
                    onClick={() => loadMore()}
                  >
                    {isLoadingMore ? "Loading..." : "Load more"}
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </ContentStateTemplate>
    </PageTemplate>
  );
}
