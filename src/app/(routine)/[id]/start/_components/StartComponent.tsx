"use client";

import Heading from "@/components/layout/Heading";
import { useStopwatch } from "@/hooks/stop-watch";
import { useEffect, useState, ReactNode } from "react";
import { motion } from "motion/react";
import {
  RoutineWithTasks,
  TaskWithStatus,
  CompletionStatus,
  TaskType,
} from "@/types/entities";
import PageTemplate from "@/components/layout/PageTemplate";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon-picker";
import { getRoutineColorVar } from "@/lib/routine-colors";
import {
  useUncheckAllTasks,
  useUpdateTaskStatus,
} from "@/queries/routine.query";

function getStartFrom(
  tasks: TaskWithStatus[] | undefined,
  startFrom?: number,
): number | null {
  if (!tasks) return null;

  const found = tasks
    .slice(startFrom || 0)
    .findIndex(
      (t) =>
        t.status !== CompletionStatus.completed &&
        t.type !== TaskType.checkpoint,
    );
  if (found == -1) return null;

  return found + (startFrom || 0);
}

function getCurrentSection(
  tasks: TaskWithStatus[],
  currentIndex: number,
): TaskWithStatus | null {
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (tasks[i].type === TaskType.checkpoint) return tasks[i];
  }
  return null;
}

function formatMinSec(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

import { useTransitionRouter } from "next-view-transitions";
import { pageSlideBackAnimation } from "@/lib/animations";
import { EmptyTemplate } from "@/components/layout/EmptyTemplate";

function StartComponent({
  routine,
  date,
}: {
  routine: RoutineWithTasks;
  date: Date;
}) {
  const { elapsedMs, reset } = useStopwatch();
  const router = useTransitionRouter();

  const handleBack = () => {
    router.push(`/${routine._id}`, {
      onTransitionReady: pageSlideBackAnimation,
    });
  };

  const { mutateAsync: uncheckAllTasks } = useUncheckAllTasks(routine._id);
  const { mutateAsync: updateTaskStatus } = useUpdateTaskStatus();

  const startFrom = getStartFrom(routine?.tasks);

  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(
    startFrom || 0,
  );

  const currentSection = getCurrentSection(
    routine?.tasks ?? [],
    currentTaskIndex,
  );

  const currentTask = routine?.tasks[currentTaskIndex];
  const currentTaskDurationMs = (currentTask?.duration ?? 0) * 60 * 1000;
  const taskProgress =
    currentTaskDurationMs > 0
      ? Math.min(elapsedMs / currentTaskDurationMs, 1)
      : 0;
  const isLastTask = currentTaskIndex >= (routine?.tasks.length || 0) - 1;

  useEffect(() => {
    const item = document.getElementById("active-task");
    item?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [currentTaskIndex]);

  async function completedTask() {
    await updateTaskStatus(
      routine?.tasks[currentTaskIndex]._id,
      CompletionStatus.completed,
      date,
    );
  }

  async function skipTask() {
    await updateTaskStatus(
      routine?.tasks[currentTaskIndex]._id,
      CompletionStatus.skipped,
      date,
    );
  }

  function moveToNextPossibleTask() {
    setCurrentTaskIndex((cti: number) => {
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
              <div key="transport" className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center gap-6">
                  <div className="flex flex-col items-center gap-1.5">
                    <Button
                      aria-label="Undo"
                      variant="card"
                      size="icon"
                      className="size-14 rounded-full"
                      disabled={
                        !routine?.tasks
                          .slice(0, currentTaskIndex)
                          .some((t) => t.type !== TaskType.checkpoint)
                      }
                      onClick={() => {
                        setCurrentTaskIndex((cti) => {
                          for (let i = cti - 1; i >= 0; i--) {
                            if (routine.tasks[i].type !== TaskType.checkpoint)
                              return i;
                          }
                          return cti;
                        });
                        reset();
                      }}
                    >
                      <Icon name="Undo" className="size-6" />
                    </Button>
                    <span className="text-xs text-muted-foreground">Undo</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <Button
                      aria-label={isLastTask ? "Done" : "Complete"}
                      size="icon"
                      className="size-16 rounded-full"
                      style={{
                        backgroundColor: getRoutineColorVar(routine?.color),
                      }}
                      onClick={async () => {
                        if (isLastTask) {
                          handleBack();
                          await completedTask();
                        } else {
                          moveToNextPossibleTask();
                          reset();
                          await completedTask();
                        }
                      }}
                    >
                      <Icon name="CheckIcon" className="size-7" />
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {isLastTask ? "Done" : "Complete"}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <Button
                      aria-label="Skip"
                      variant="card"
                      size="icon"
                      className="size-14 rounded-full"
                      disabled={isLastTask}
                      onClick={async () => {
                        moveToNextPossibleTask();
                        reset();
                        await skipTask();
                      }}
                    >
                      <Icon name="Forward" className="size-6" />
                    </Button>
                    <span className="text-xs text-muted-foreground">Skip</span>
                  </div>
                </div>
                <div className="flex w-full items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatMinSec(elapsedMs)}</span>
                  <div className="h-1.5 flex-1 rounded-full bg-card overflow-hidden">
                    <div
                      className="h-full rounded-full transition-[width] duration-150 ease-linear"
                      style={{
                        width: `${taskProgress * 100}%`,
                        backgroundColor: getRoutineColorVar(routine?.color),
                      }}
                    />
                  </div>
                  <span>{formatMinSec(currentTaskDurationMs)}</span>
                </div>
              </div>,
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
          <section className="grid z-0">
            <div className="h-[30vh]" />
            {routine?.tasks.map((task, index) => (
              <motion.div
                key={task._id}
                className="scroll-mt-[20vh]"
                id={
                  currentTaskIndex == index ? "active-task" : "in-active-task"
                }
                initial={{
                  scale: 0.75,
                  originX: 0,
                  opacity: 0.1,
                  filter: "blur(4px)",
                }}
                animate={{
                  scale: currentTaskIndex == index ? 1 : 0.75,
                  originX: 0,
                  opacity: currentTaskIndex == index ? 1 : 0.25,
                  filter: currentTaskIndex == index ? "blur(0px)" : "blur(4px)",
                }}
                transition={{
                  duration: 0.45,
                }}
                onClick={() => {
                  if (task.type === TaskType.checkpoint) {
                    const next = getStartFrom(routine?.tasks, index + 1);
                    if (next !== null) setCurrentTaskIndex(next);
                  } else {
                    setCurrentTaskIndex(index);
                  }
                }}
              >
                <Heading
                  className={
                    task.type === TaskType.checkpoint
                      ? "text-primary text-xl"
                      : ""
                  }
                >
                  {task.name}
                </Heading>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: currentTaskIndex == index ? 1 : 0 }}
                  transition={{ duration: 0.75 }}
                  className="flex flex-col gap-0.5"
                >
                  <small>
                    {routine?.tasks[currentTaskIndex].duration} minutes
                  </small>
                </motion.div>
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
