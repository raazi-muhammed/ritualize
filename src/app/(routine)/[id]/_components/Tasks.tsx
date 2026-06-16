"use client";

import { EmptyTemplate } from "@/components/layout/EmptyTemplate";
import { useEffect, useMemo, useRef, useState } from "react";
import TaskCard from "./TaskCard";
import { RoutineWithTasks } from "@/types/entities";
import { useReorderTasks } from "@/queries/routine.query";
import { Id } from "../../../../../convex/_generated/dataModel";
import { createSwapy, utils } from "swapy";

const Tasks = ({
  showStartDate = false,
  date,
  routine,
}: {
  showStartDate?: boolean;
  date: Date;
  routine: RoutineWithTasks;
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const swapyRef = useRef<ReturnType<typeof createSwapy> | null>(null);
  const { mutateAsync: reorderTasks } = useReorderTasks();

  const tasks = useMemo(() => routine?.tasks ?? [], [routine?.tasks]);

  const [slotItemMap, setSlotItemMap] = useState(() =>
    utils.initSlotItemMap(tasks, "_id"),
  );

  const slottedItems = useMemo(
    () => utils.toSlottedItems(tasks, "_id", slotItemMap),
    [tasks, slotItemMap],
  );

  useEffect(() => {
    if (!containerRef.current) return;
    swapyRef.current = createSwapy(containerRef.current, {
      manualSwap: true,
      animation: "dynamic",
    });

    swapyRef.current.onSwap((event) => {
      const newMap = event.newSlotItemMap.asArray;
      setSlotItemMap(newMap);
      const newIds = [...newMap]
        .sort((a, b) => parseInt(a.slot) - parseInt(b.slot))
        .filter((entry) => entry.item !== null)
        .map((entry) => entry.item as Id<"tasks">);
      reorderTasks(newIds);
    });

    return () => {
      swapyRef.current?.destroy();
    };
  }, []);

  useEffect(
    () =>
      utils.dynamicSwapy(
        swapyRef.current,
        tasks,
        "_id",
        slotItemMap,
        setSlotItemMap,
      ),
    [tasks],
  );

  if (!routine || tasks.length === 0) {
    return (
      <EmptyTemplate
        title="No tasks yet"
        description="Please add some tasks to get started"
      />
    );
  }

  return (
    <section ref={containerRef} className="mb-36">
      {slottedItems.map(({ slotId, itemId, item: task }) => (
        <div key={slotId} data-swapy-slot={slotId}>
          {task ? (
            <div key={itemId} data-swapy-item={itemId}>
              <TaskCard
                task={task}
                showStartDate={showStartDate}
                date={date ?? new Date()}
              />
            </div>
          ) : null}
        </div>
      ))}
    </section>
  );
};

export default Tasks;
