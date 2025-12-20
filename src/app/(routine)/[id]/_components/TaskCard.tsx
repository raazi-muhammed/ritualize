"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CompletionStatus, Frequency, Task, TaskType } from "@prisma/client";
import { DragEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskSchema } from "../(tasks)/_forms/TaskForm";
import { z } from "zod";
import { generateCardDescription } from "@/lib/utils";
import { useModal } from "@/providers/ModelProvider";
import { TaskWithStatus } from "@/types/entities";
import { useRouter } from "next/navigation";
import {
  CHECKBOX_ANIMATION_CLASSES,
  pageSlideAnimation,
} from "@/lib/animations";
import { useTransitionRouter } from "next-view-transitions";

const TaskCard = ({
  task,
  showStartDate = false,
  date,
}: {
  task: TaskWithStatus;
  showStartDate?: boolean;
  date: Date;
}) => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const router = useRouter();
  const tRouter = useTransitionRouter();

  const { mutateAsync: moveTask } = useMutation({
    mutationFn: async (body: {
      taskToMoveId: string;
      moveToTaskId: string;
    }) => {
      const response = await fetch(
        `/api/routines/${task.routine_id}/tasks/move`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) throw new Error("Failed to move task");
      return (await response.json()) as TaskWithStatus;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      queryClient.invalidateQueries({ queryKey: ["routine", task.routine_id] });
    },
  });

  const { mutateAsync: updateTask } = useMutation({
    mutationFn: async (
      taskUpdate: Partial<Omit<Task, "id" | "order" | "routine_id">>
    ) => {
      const response = await fetch(
        `/api/routines/${task.routine_id}/tasks/${task.id}`,
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
      queryClient.invalidateQueries({ queryKey: ["routine", task.routine_id] });
    },
  });

  const { mutateAsync: updateTaskStatus } = useMutation({
    mutationFn: async (status: CompletionStatus) => {
      const response = await fetch(
        `/api/routines/${task.routine_id}/tasks/${task.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
            date: date,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update task status");
      return (await response.json()) as TaskWithStatus;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      queryClient.invalidateQueries({ queryKey: ["routine", task.routine_id] });
    },
  });

  const { mutateAsync: deleteTask } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/routines/${task.routine_id}/tasks/${task.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete task");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routines"] });
      queryClient.invalidateQueries({ queryKey: ["routine", task.routine_id] });
      router.refresh(); // Optional, but invalidation should handle it
    },
  });

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    const taskId = e.dataTransfer.getData("taskId");
    moveTask({
      taskToMoveId: taskId,
      moveToTaskId: task.id,
    });
  };

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

  function handleToggleCompletion(status: CompletionStatus) {
    updateTaskStatus(status);
  }
  function showCheckbox() {
    if (!task.id) return true; // If task is new, show checkbox
    if (task?.status) return true; // If task is completed, show checkbox

    return false;
  }

  return (
    <Card
      key={task.id}
      className={`${
        task.type == TaskType.checkpoint
          ? "bg-transparent my-0"
          : "my-2 has-[.task-card-action:active]:scale-95 transition-transform"
      } ${task.id == "" ? "opacity-50" : ""}`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <CardContent className="flex justify-between p-0">
        {task.type == TaskType.task ? (
          <section className="flex items-start gap-0 w-full">
            {showCheckbox() ? (
              <Checkbox
                checked={task.status === CompletionStatus.completed}
                onCheckedChange={(checked) => {
                  handleToggleCompletion(
                    checked
                      ? CompletionStatus.completed
                      : CompletionStatus.skipped
                  );
                }}
                className={`m-3 ${CHECKBOX_ANIMATION_CLASSES}`}
              />
            ) : null}
            <div
              onClick={() =>
                tRouter.push(
                  `/${task.routine_id}/${task.id}?name=${encodeURIComponent(
                    task.name
                  )}`,
                  {
                    onTransitionReady: pageSlideAnimation,
                  }
                )
              }
              className="w-full py-2 task-card-action"
            >
              <p>{task.name}</p>
              <p className="text-muted-foreground text-xs">
                {`${task.duration} min • ${generateCardDescription(task, {
                  showStartDate,
                })} • ${task.type}`}
              </p>
            </div>
          </section>
        ) : (
          <section
            className="flex items-end gap-2"
            onClick={() =>
              router.push(
                `/${task.routine_id}/${task.id}?name=${encodeURIComponent(
                  task.name
                )}`
              )
            }
          >
            <p className="text-lg font-bold">{task.name}</p>
          </section>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
