"use client";

import Heading from "@/components/layout/Heading";
import { Button } from "@/components/ui/button";
import { useStopwatch } from "@/hooks/stop-watch";
import { CompletionStatus, TaskType } from "@prisma/client";
import {
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  SkipForward,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RoutineWithTasks, TaskWithStatus } from "@/types/entities";
import InfoMessage from "@/components/message/InfoMessage";
import { formatDateForInput } from "@/lib/format";
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

  if (startFrom == null) {
    return (
      <div className="flex flex-col items-center justify-center h-full mt-16">
        <InfoMessage
          message="No tasks to complete"
          actions={[
            <Button key="back" size="sm" variant="outline" onClick={handleBack}>
              <ChevronLeft className="-ms-2" />
              Back
            </Button>,
            <Button
              key="uncheck-all"
              size="sm"
              variant="outline"
              onClick={() => {
                handleBack();
                uncheckAllTasks();
              }}
            >
              <CheckCheck className="-ms-2" />
              Uncheck all
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <PageTemplate hideBack>
      <main className="container relative flex h-[100svh] w-full flex-col justify-around">
        <header className="fixed top-0 left-8 right-8 pt-8 z-10 bg-gradient-to-b from-40% from-background">
          <section className="flex justify-between">
            <div onClick={handleBack} className="flex gap-0">
              <ChevronLeft size="1em" className="m-0 my-auto" />
              <Heading className="my-auto mb-1 text-lg">{routine.name}</Heading>
            </div>

            <small className="my-auto font-mono">{time}</small>
          </section>
          <section className="flex gap-1">
            {routine?.tasks.map((task, index) => (
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
              id={currentTaskIndex == index ? "active-task" : "in-active-task"}
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
        <footer className="fixed bottom-0 left-0 right-0 container z-10 bg-gradient-to-t from-40% from-background pb-8 pt-28">
          <section className="flex justify-between">
            <div className="grid gap-1">
              <Button
                className="me-auto w-fit"
                variant="secondary"
                disabled={currentTaskIndex <= 0}
                onClick={() => {
                  setCurrentTaskIndex((cti) => --cti);
                  reset();
                }}
              >
                <ChevronLeft className="-ms-2" />
                Prev
              </Button>
              <small className="text-start text-muted-foreground">
                {routine?.tasks?.[currentTaskIndex - 1]?.name}
              </small>
            </div>

            {currentTaskIndex >= (routine?.tasks.length || 0) - 1 ? (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="ms-auto w-fit"
                  onClick={async () => {
                    handleBack();
                    await skipTask();
                  }}
                >
                  <SkipForward />
                </Button>
                <Button
                  onClick={async () => {
                    handleBack();
                    await completedTask();
                  }}
                >
                  Done
                  <ChevronRight className="-me-2" />
                </Button>
              </div>
            ) : (
              <div className="grid gap-1">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    className="ms-auto w-fit"
                    onClick={async () => {
                      moveToNextPossibleTask();
                      reset();
                      await skipTask();
                    }}
                  >
                    <SkipForward />
                  </Button>
                  <Button
                    variant="secondary"
                    className="ms-auto w-fit"
                    disabled={
                      currentTaskIndex >= (routine?.tasks.length || 0) - 1
                    }
                    onClick={async () => {
                      moveToNextPossibleTask();
                      reset();
                      await completedTask();
                    }}
                  >
                    Next
                    <ChevronRight className="-me-2" />
                  </Button>
                </div>
                <small className="text-end text-muted-foreground">
                  {routine?.tasks?.[currentTaskIndex + 1]?.name}
                </small>
              </div>
            )}
          </section>
        </footer>
      </main>
    </PageTemplate>
  );
}

export default StartComponent;
