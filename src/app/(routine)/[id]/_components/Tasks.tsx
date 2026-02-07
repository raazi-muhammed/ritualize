import { EmptyTemplate } from "@/components/layout/EmptyTemplate";
import { Fragment, useMemo, useRef, useState } from "react";
import TaskCard, { TaskCardPreview } from "./TaskCard";
import { RoutineWithTasks } from "@/types/entities";
import { useReorderTasks } from "@/queries/routine.query";

const Tasks = ({
  showStartDate = false,
  date,
  routine,
}: {
  showStartDate?: boolean;
  date: Date;
  routine: RoutineWithTasks;
}) => {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [overTaskId, setOverTaskId] = useState<string | null>(null);
  const activeTaskIdRef = useRef<string | null>(null);
  const dropHandledRef = useRef(false);
  const dragEndTimeoutRef = useRef<number | null>(null);
  const { mutateAsync: reorderTasks } = useReorderTasks();

  const draggedTask = useMemo(
    () => routine?.tasks?.find((task) => task._id === activeTaskId) ?? null,
    [activeTaskId, routine?.tasks],
  );

  const handleDropToEnd = async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dropHandledRef.current = true;
    if (dragEndTimeoutRef.current) {
      window.clearTimeout(dragEndTimeoutRef.current);
      dragEndTimeoutRef.current = null;
    }
    const draggedTaskId =
      e.dataTransfer.getData("taskId") ||
      e.dataTransfer.getData("text/plain") ||
      activeTaskIdRef.current ||
      activeTaskId ||
      "";
    if (!draggedTaskId) return;
    const taskIds = routine?.tasks?.map((task) => task._id) ?? [];
    const fromIndex = taskIds.indexOf(draggedTaskId);
    if (fromIndex === -1) return;
    const newIds = [...taskIds];
    const [movedId] = newIds.splice(fromIndex, 1);
    newIds.push(movedId);
    await reorderTasks(newIds);
    setActiveTaskId(null);
    setOverTaskId(null);
    activeTaskIdRef.current = null;
  };

  const handleDropByOver = async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    dropHandledRef.current = true;
    if (dragEndTimeoutRef.current) {
      window.clearTimeout(dragEndTimeoutRef.current);
      dragEndTimeoutRef.current = null;
    }
    if (!overTaskId) return;
    if (overTaskId === "__end__") {
      await handleDropToEnd(e);
      return;
    }
    const draggedTaskId =
      e.dataTransfer.getData("taskId") ||
      e.dataTransfer.getData("text/plain") ||
      activeTaskIdRef.current ||
      activeTaskId ||
      "";
    if (!draggedTaskId) return;
    const taskIds = routine?.tasks?.map((task) => task._id) ?? [];
    const fromIndex = taskIds.indexOf(draggedTaskId);
    const toIndex = taskIds.indexOf(overTaskId);
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;
    const newIds = [...taskIds];
    const [movedId] = newIds.splice(fromIndex, 1);
    const insertIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
    newIds.splice(insertIndex, 0, movedId);
    await reorderTasks(newIds);
    setActiveTaskId(null);
    setOverTaskId(null);
    activeTaskIdRef.current = null;
  };

  return (
    <section
      className="mb-36"
      onDragOver={(e) => {
        if (!activeTaskId) return;
        e.preventDefault();
      }}
      onDrop={handleDropByOver}
    >
      {!routine ? (
        <EmptyTemplate
          title="No tasks yet"
          description="Please add some tasks to get started"
        />
      ) : (
        <>
          {routine?.tasks.length === 0 && (
            <EmptyTemplate
              title="No tasks yet"
              description="Please add some tasks to get started"
            />
          )}
          {routine?.tasks?.map((task) => {
            const showPreview =
              draggedTask &&
              overTaskId === task._id &&
              draggedTask._id !== task._id;

            return (
              <Fragment key={task._id}>
                {showPreview ? (
                  <TaskCardPreview
                    task={draggedTask}
                    showStartDate={showStartDate}
                  />
                ) : null}
                <TaskCard
                  task={task}
                  showStartDate={showStartDate}
                  date={date ?? new Date()}
                  isHidden={activeTaskId === task._id}
                  onDragStartId={(taskId) => {
                    setActiveTaskId(taskId);
                    setOverTaskId(taskId);
                    activeTaskIdRef.current = taskId;
                    dropHandledRef.current = false;
                    if (dragEndTimeoutRef.current) {
                      window.clearTimeout(dragEndTimeoutRef.current);
                      dragEndTimeoutRef.current = null;
                    }
                  }}
                  onDragOverId={setOverTaskId}
                  onDragEnd={() => {
                    // Safari can fire dragend before drop. Delay cleanup.
                    if (dragEndTimeoutRef.current) {
                      window.clearTimeout(dragEndTimeoutRef.current);
                    }
                    dragEndTimeoutRef.current = window.setTimeout(() => {
                      if (dropHandledRef.current) return;
                      setActiveTaskId(null);
                      setOverTaskId(null);
                      activeTaskIdRef.current = null;
                      dragEndTimeoutRef.current = null;
                    }, 150);
                  }}
                />
              </Fragment>
            );
          })}
          {draggedTask ? (
            <div
              className={overTaskId === "__end__" ? "h-24" : "h-24"}
              onDragOver={(e) => {
                e.preventDefault();
                setOverTaskId("__end__");
              }}
              onDrop={handleDropToEnd}
            >
              {overTaskId === "__end__" ? (
                <TaskCardPreview
                  task={draggedTask}
                  showStartDate={showStartDate}
                />
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
};

export default Tasks;
