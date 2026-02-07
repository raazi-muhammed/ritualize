"use client";

import Tasks from "./Tasks";
import { RoutineWithTasks, CompletionStatus, TaskType } from "@/types/entities";
import { useStore } from "@/stores";
import { useTransitionRouter } from "next-view-transitions";
import { useEffect, useMemo, useRef, useState } from "react";
import ConfettiBurst from "./ConfettiBurst";

function RoutinePage({ routine }: { routine: RoutineWithTasks }) {
  const { selectedDate } = useStore();
  const router = useTransitionRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const wasAllDoneRef = useRef(false);

  const isAllDone = useMemo(() => {
    const actionableTasks = routine?.tasks?.filter(
      (task) => task.type === TaskType.task,
    );
    if (!actionableTasks || actionableTasks.length === 0) return false;
    return actionableTasks.every(
      (task) => task.status === CompletionStatus.completed,
    );
  }, [routine?.tasks]);

  useEffect(() => {
    const wasAllDone = wasAllDoneRef.current;
    if (isAllDone && !wasAllDone) {
      setShowConfetti(true);
      setConfettiKey((current) => current + 1);
    }
    wasAllDoneRef.current = isAllDone;
  }, [isAllDone]);

  if (!selectedDate) return null;

  return (
    <>
      <section className="relative gap-4">
        {showConfetti ? (
          <ConfettiBurst
            key={confettiKey}
            onComplete={() => setShowConfetti(false)}
          />
        ) : null}
        <Tasks date={selectedDate} routine={routine} />
      </section>
    </>
  );
}

export default RoutinePage;
