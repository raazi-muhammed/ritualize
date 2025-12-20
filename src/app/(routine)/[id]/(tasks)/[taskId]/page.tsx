"use client";

import PageTemplate from "@/components/layout/PageTemplate";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, formatDateForInput } from "@/lib/format";
import { TaskWithCompletions, TaskWithStatus } from "@/types/entities";
import { deleteTaskCompletion, getTask } from "@/services/routines";
import ContentStateTemplate from "@/components/layout/ContentStateTemplate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoTrash } from "react-icons/io5";
import TaskForm, { taskSchema } from "../_forms/TaskForm";
import { useModal } from "@/providers/ModelProvider";
import { z } from "zod";
import { Frequency, Task } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function Page({
  params,
}: {
  params: { taskId: string; id: string };
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
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
      router.back();
    },
  });

  function onSubmit(values: z.infer<typeof taskSchema>) {
    closeModal();
    updateTask({
      name: values.name,
      duration: values.duration,
      frequency: values.frequency as Frequency,
      every_frequency: values.everyFrequency,
      days_in_frequency: values.daysInFrequency || [0],
      start_date: new Date(values.startDate),
      type: values.type,
      end_date: null,
    });
  }

  return (
    <PageTemplate
      title={task?.name || "Tasks"}
      actions={
        task
          ? [
              {
                label: "Edit",
                onClick: () => {
                  openModal({
                    title: "Edit Task",
                    content: (
                      <TaskForm
                        hideCreateNew
                        onSubmit={onSubmit}
                        defaultValues={{
                          duration: task.duration,
                          frequency: task.frequency,
                          name: task.name,
                          everyFrequency: task.every_frequency,
                          startDate: formatDateForInput(task.start_date),
                          daysInFrequency: task.days_in_frequency,
                          type: task.type,
                        }}
                      />
                    ),
                  });
                },
              },
              {
                label: "Delete",
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
                    <DropdownMenu>
                      <DropdownMenuTrigger>...</DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={async () => {
                            await deleteCompletion(completion.id);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
