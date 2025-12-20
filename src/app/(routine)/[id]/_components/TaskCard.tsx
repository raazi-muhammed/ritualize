"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

import { CompletionStatus, Frequency, TaskType } from "@prisma/client";
import { DragEvent } from "react";
import { CircleEllipsis } from "lucide-react";
import { formatDateForInput } from "@/lib/format";
import TaskForm, { taskSchema } from "../(tasks)/_forms/TaskForm";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { generateCardDescription } from "@/lib/utils";
import { useModal } from "@/providers/ModelProvider";
import { TaskWithStatus } from "@/types/entities";
import { useStore } from "@/stores";
import { useRouter } from "next/navigation";
import { PRESSABLE_ANIMATION_CLASSES } from "@/lib/animations";

const TaskCard = ({
  task,
  showStartDate = false,
  date,
}: {
  task: TaskWithStatus;
  showStartDate?: boolean;
  date: Date;
}) => {
  const { openModal, closeModal } = useModal();
  const { deleteTask, updateTask, updateTaskStatus, moveTask } = useStore();
  const router = useRouter();

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    const taskId = e.dataTransfer.getData("taskId");
    moveTask(task.routine_id, {
      taskToMoveId: taskId,
      moveToTaskId: task.id,
    });
  };

  function onSubmit(values: z.infer<typeof taskSchema>) {
    closeModal();
    updateTask(task.routine_id, task.id, {
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
    updateTaskStatus(task.routine_id, task.id, status);
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
        task.type == TaskType.checkpoint ? "bg-transparent my-0" : "my-2"
      } ${task.id == "" ? "opacity-50" : ""}`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <CardContent className="flex justify-between p-4">
        {task.type == TaskType.task ? (
          <section className="flex items-start gap-2">
            {showCheckbox() ? (
              <Checkbox
                checked={task.status === CompletionStatus.completed}
                onCheckedChange={(checked) => {
                  handleToggleCompletion(
                    checked
                      ? CompletionStatus.completed
                      : CompletionStatus.skipped,
                  );
                }}
                className="mt-1"
              />
            ) : null}
            <div>
              <p>{task.name}</p>
              <p className="text-muted-foreground text-xs">
                {`${task.duration} min • ${generateCardDescription(task, {
                  showStartDate,
                })} • ${task.type}`}
              </p>
            </div>
          </section>
        ) : (
          <section className="flex items-end gap-2">
            <p className="text-lg font-bold">{task.name}</p>
          </section>
        )}
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size="icon" className="my-auto">
                <CircleEllipsis size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => {
                  router.push(`/${task.routine_id}/${task.id}`);
                }}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
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
                }}
              >
                Edit
              </DropdownMenuItem>
              <AlertDialogTrigger className="w-full">
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    deleteTask(task.routine_id, task.id);
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </DropdownMenu>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
