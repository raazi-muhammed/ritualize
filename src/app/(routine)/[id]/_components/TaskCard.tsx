"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import {
  useDeleteTask,
  useUpdateTask,
  useUpdateTaskStatus,
} from "@/queries/routine.query";
import { taskSchema } from "../(tasks)/_forms/TaskForm";
import { z } from "zod";
import { generateCardDescription } from "@/lib/utils";
import { useModal } from "@/providers/ModelProvider";
import { TaskWithStatus, CompletionStatus, TaskType } from "@/types/entities";
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
  const router = useRouter();
  const tRouter = useTransitionRouter();
  const [localStatus, setLocalStatus] = useState<CompletionStatus | undefined>(
    task.status,
  );

  const { mutateAsync: updateTask } = useUpdateTask(task._id);
  const { mutateAsync: updateTaskStatus } = useUpdateTaskStatus();
  const { mutateAsync: deleteTask } = useDeleteTask();

  useEffect(() => {
    setLocalStatus(task.status);
  }, [task.status]);

  function onSubmit(values: z.infer<typeof taskSchema>) {
    closeModal();
    updateTask({
      name: values.name,
      duration: values.duration,
      type: values.type,
    });
  }

  async function handleToggleCompletion(status: CompletionStatus) {
    const previousStatus = localStatus;
    setLocalStatus(status);
    try {
      await updateTaskStatus(task._id, status, date);
    } catch {
      setLocalStatus(previousStatus);
    }
  }

  function showCheckbox() {
    if (!task._id) return true;
    if (localStatus) return true;
    return false;
  }

  return (
    <Card
      key={task._id}
      className={`${
        task.type == TaskType.checkpoint
          ? "bg-transparent my-0"
          : "my-2 has-[.task-card-action:active]:scale-95 transition-transform"
      } ${task._id == "" ? "opacity-50" : ""}`}
    >
      <CardContent className="flex justify-between p-0">
        {task.type == TaskType.task ? (
          <section className="flex items-start gap-0 w-full">
            {showCheckbox() ? (
              <Checkbox
                checked={localStatus === CompletionStatus.completed}
                onCheckedChange={(checked) => {
                  void handleToggleCompletion(
                    checked
                      ? CompletionStatus.completed
                      : CompletionStatus.skipped,
                  );
                }}
                className={`m-3 ${CHECKBOX_ANIMATION_CLASSES}`}
              />
            ) : null}
            <div
              onClick={() =>
                tRouter.push(
                  `/${task.routineId}/${task._id}?name=${encodeURIComponent(
                    task.name,
                  )}`,
                  {
                    onTransitionReady: pageSlideAnimation,
                  },
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
                `/${task.routineId}/${task._id}?name=${encodeURIComponent(
                  task.name,
                )}`,
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
