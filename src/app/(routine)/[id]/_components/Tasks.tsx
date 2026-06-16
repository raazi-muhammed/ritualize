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
    const container = containerRef.current;
    if (!container) return;

    // Lock each slot wrapper's height before Swapy lifts items out of flow,
    // so the layout doesn't compress when a slot goes position: absolute.
    const lockHeights = () => {
      container
        .querySelectorAll<HTMLElement>(".swapy-slot-wrapper")
        .forEach((el) => {
          el.style.minHeight = `${el.getBoundingClientRect().height}px`;
        });
    };
    const clearHeights = () => {
      container
        .querySelectorAll<HTMLElement>(".swapy-slot-wrapper")
        .forEach((el) => {
          el.style.minHeight = "";
        });
    };

    container.addEventListener("pointerdown", lockHeights);
    document.addEventListener("pointerup", clearHeights);

    swapyRef.current = createSwapy(container, {
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
      container.removeEventListener("pointerdown", lockHeights);
      document.removeEventListener("pointerup", clearHeights);
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
        // Wrapper stays in normal flow and holds the measured height while
        // the inner [data-swapy-slot] may become position:absolute during drag.
        <div key={slotId} className="relative swapy-slot-wrapper">
          <div data-swapy-slot={slotId}>
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
        </div>
      ))}
    </section>
  );
};

export default Tasks;
