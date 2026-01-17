"use client";

import Heading from "@/components/layout/Heading";
import { useStopwatch } from "@/hooks/stop-watch";
import { CompletionStatus, TaskType } from "@prisma/client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RoutineWithTasks, TaskWithStatus } from "@/types/entities";
import PageTemplate from "@/components/layout/PageTemplate";

function getStartFrom(
  tasks: TaskWithStatus[] | undefined,
  startFrom?: number
): number | null {
  if (!tasks) return null;

  const found = tasks
    .slice(startFrom || 0)
    .findIndex((t) => t.status !== CompletionStatus.completed);
  if (found == -1) return null;

  return found + (startFrom || 0);
}

import { useTransitionRouter } from "next-view-transitions";
import { pageSlideBackAnimation } from "@/lib/animations";
import { IconName } from "@/components/ui/icon-picker";
import { EmptyTemplate } from "@/components/layout/EmptyTemplate";

function StartComponent({
  routine,
  date,
}: {
  routine: RoutineWithTasks;
  date: Date;
}) {
  const { time, reset } = useStopwatch();
  const queryClient = useQueryClient();
  const router = useTransitionRouter();

  const handleBack = () => {
    router.push(`/${routine.id}`, {
      onTransitionReady: pageSlideBackAnimation,
    });
  };

  const { mutateAsync: updateTaskStatus } = useMutation({
    mutationFn: async ({
      taskId,
      status,
    }: {
      taskId: string;
      status: CompletionStatus;
    }) => {
      const response = await fetch(
        `/api/routines/${routine.id}/tasks/${taskId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
            date: date,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update task status");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["routine", routine.id],
      });
      queryClient.invalidateQueries({ queryKey: ["routines"] });
    },
  });

  const { mutateAsync: uncheckAllTasks } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/routines/${routine.id}/tasks`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to uncheck all tasks");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["routine", routine.id],
      });
      queryClient.invalidateQueries({ queryKey: ["routines"] });
    },
  });

  const startFrom = getStartFrom(routine?.tasks);

  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(
    startFrom || 0
  );

  useEffect(() => {
    const item = document.getElementById("active-task");
    item?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [currentTaskIndex]);

  async function completedTask() {
    await updateTaskStatus({
      taskId: routine?.tasks[currentTaskIndex].id,
      status: CompletionStatus.completed,
    });
    // Invalidation in onSuccess
  }

  async function skipTask() {
    await updateTaskStatus({
      taskId: routine?.tasks[currentTaskIndex].id,
      status: CompletionStatus.skipped,
    });
  }

  function moveToNextPossibleTask() {
    setCurrentTaskIndex((cti) => {
      const startFrom = getStartFrom(routine?.tasks, cti + 1);
      if (startFrom === null) handleBack();
      return startFrom || 0;
    });
  }

  const showUncheckAll = startFrom == null;
  return (
    <PageTemplate
      title={routine?.name || "Routine"}
      bottomActions={
        !showUncheckAll
          ? [
              {
                label: "Prev",
                placement: "left",
                icon: "ChevronLeft",
                disabled: currentTaskIndex <= 0,
                onClick: () => {
                  setCurrentTaskIndex((cti) => --cti);
                  reset();
                },
              },
              ...(currentTaskIndex >= (routine?.tasks.length || 0) - 1
                ? [
                    {
                      label: "Done",
                      placement: "right" as any,
                      icon: "Check" as IconName,
                      onClick: async () => {
                        handleBack();
                        await completedTask();
                      },
                    },
                  ]
                : [
                    {
                      icon: "Forward" as IconName,
                      placement: "right" as any,
                      onClick: async () => {
                        moveToNextPossibleTask();
                        reset();
                        await skipTask();
                      },
                    },
                    {
                      label: "Next",
                      placement: "right" as any,
                      icon: "ChevronRight" as IconName,
                      onClick: async () => {
                        moveToNextPossibleTask();
                        reset();
                        await completedTask();
                      },
                      disabled:
                        currentTaskIndex >= (routine?.tasks.length || 0) - 1,
                    },
                  ]),
            ]
          : []
      }
    >
      {showUncheckAll ? (
        <EmptyTemplate
          title="No tasks to complete"
          description="All of tasks are completed"
          actions={[
            {
              label: "Uncheck all",
              onClick: () => {
                handleBack();
                uncheckAllTasks();
              },
              icon: "CheckCheck",
            },
          ]}
        />
      ) : (
        <>
          <header className="sticky top-16 border">
            <small className="my-auto font-mono">{time}</small>
            <section className="flex gap-1">
              {routine?.tasks.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-full rounded bg-white ${
                    index >= currentTaskIndex ? "opacity-50" : "opacity-100"
                  }`}
                ></div>
              ))}
            </section>
          </header>
          <section className="grid z-0">
            <div className="h-[30vh]" />
            {routine?.tasks.map((task, index) => (
              <motion.div
                key={task.id}
                className="scroll-mt-[20vh]"
                id={
                  currentTaskIndex == index ? "active-task" : "in-active-task"
                }
                initial={{
                  scale: 0.75,
                  originX: 0,
                  opacity: 0.1,
                }}
                animate={{
                  scale: currentTaskIndex == index ? 1 : 0.75,
                  originX: 0,
                  opacity: currentTaskIndex == index ? 1 : 0.25,
                }}
                transition={{
                  duration: 0.45,
                }}
                onClick={() => {
                  setCurrentTaskIndex(index);
                }}
              >
                <Heading
                  className={
                    task.type == TaskType.checkpoint ? "text-primary" : ""
                  }
                >
                  {task.name}
                </Heading>
                <motion.small
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: currentTaskIndex == index ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.75,
                  }}
                >
                  {routine?.tasks[currentTaskIndex].duration} minutes
                </motion.small>
              </motion.div>
            ))}
            <div className="flex h-[30vh]" />
          </section>
        </>
      )}
    </PageTemplate>
  );
}

export default StartComponent;
