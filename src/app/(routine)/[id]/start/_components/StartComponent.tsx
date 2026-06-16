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

import { useTransitionRouter } from "next-view-transitions";
import { pageSlideBackAnimation } from "@/lib/animations";
import { IconName } from "@/components/ui/icon-picker";
import { EmptyTemplate } from "@/components/layout/EmptyTemplate";

function SegmentedCircularProgress({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  const radius = 18;
  const stroke = 18;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const gap = 0;
  const segmentLength = (circumference - total * gap) / total;

  const safeSegmentLength = Math.max(segmentLength, 0);
  const safeGap = segmentLength > 0 ? gap : 0;

  const activeDashArray =
    Array.from({ length: current })
      .map(() => `${safeSegmentLength} ${safeGap}`)
      .join(" ") + ` 0 ${circumference}`;

  return (
    <div className="relative flex items-center justify-center outline rounded-full outline-1 outline-secondary-border">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="-rotate-90 transform"
      >
        <circle
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={`${safeSegmentLength} ${safeGap}`}
          className="text-secondary"
        />
        <circle
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          strokeDasharray={activeDashArray}
          strokeLinecap="butt"
          className="text-primary transition-all duration-300"
        />
      </svg>
    </div>
  );
}

function StartComponent({
  routine,
  date,
}: {
  routine: RoutineWithTasks;
  date: Date;
}) {
  const { time, reset } = useStopwatch();
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
      actions={[
        <div className="w-fit flex items-center gap-2" key="progress">
          <small className="text-base">{time}</small>
          <SegmentedCircularProgress
            total={routine?.tasks.length || 0}
            current={currentTaskIndex}
          />
        </div>,
      ]}
      bottomActions={
        !showUncheckAll
          ? [
              {
                label: "Prev",
                placement: "left",
                icon: "ChevronLeft",
                disabled: !routine?.tasks
                  .slice(0, currentTaskIndex)
                  .some((t) => t.type !== TaskType.checkpoint),
                onClick: () => {
                  setCurrentTaskIndex((cti) => {
                    for (let i = cti - 1; i >= 0; i--) {
                      if (routine.tasks[i].type !== TaskType.checkpoint)
                        return i;
                    }
                    return cti;
                  });
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
