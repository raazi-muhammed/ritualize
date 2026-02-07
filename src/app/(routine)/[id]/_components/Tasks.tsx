import { EmptyTemplate } from "@/components/layout/EmptyTemplate";
import { Fragment, useMemo, useRef, useState } from "react";
import TaskCard, { TaskCardPreview } from "./TaskCard";
import { RoutineWithTasks } from "@/types/entities";
import { useReorderTasks } from "@/queries/routine.query";

const END_DROP_ID = "__end__";

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

  const taskIds = useMemo(
    () => routine?.tasks?.map((task) => task._id) ?? [],
    [routine?.tasks],
  );
  const tasksById = useMemo(() => {
    const map = new Map<string, RoutineWithTasks["tasks"][number]>();
    routine?.tasks?.forEach((task) => map.set(task._id, task));
    return map;
  }, [routine?.tasks]);

  const getCheckpointBlockIds = (checkpointId: string) => {
    const startIndex = taskIds.indexOf(checkpointId);
    if (startIndex === -1) return [];
    let endIndex = taskIds.length;
    for (let i = startIndex + 1; i < taskIds.length; i += 1) {
      const task = tasksById.get(taskIds[i]);
      if (task?.type === "checkpoint") {
        endIndex = i;
        break;
      }
    }
    return taskIds.slice(startIndex, endIndex);
  };

  const draggedTask = useMemo(
    () => routine?.tasks?.find((task) => task._id === activeTaskId) ?? null,
    [activeTaskId, routine?.tasks],
  );
  const draggedBlockIds = useMemo(() => {
    if (!draggedTask || draggedTask.type !== "checkpoint") return [];
    return getCheckpointBlockIds(draggedTask._id);
  }, [draggedTask, taskIds, tasksById]);
  const draggedBlockIdSet = useMemo(
    () => new Set(draggedBlockIds),
    [draggedBlockIds],
  );

  const clearDragState = () => {
    setActiveTaskId(null);
    setOverTaskId(null);
    activeTaskIdRef.current = null;
  };

  const cancelDragEndCleanup = () => {
    if (!dragEndTimeoutRef.current) return;
    window.clearTimeout(dragEndTimeoutRef.current);
    dragEndTimeoutRef.current = null;
  };

  const getDraggedTaskId = (e: React.DragEvent<HTMLElement>) =>
    e.dataTransfer.getData("taskId") ||
    e.dataTransfer.getData("text/plain") ||
    activeTaskIdRef.current ||
    activeTaskId ||
    "";

  const buildReorderedIds = (fromId: string, toId: string) => {
    const fromIndex = taskIds.indexOf(fromId);
    const toIndex = taskIds.indexOf(toId);
    if (fromIndex === -1 || toIndex === -1) return null;
    if (fromIndex === toIndex) return null;

    const dragged = tasksById.get(fromId);
    if (dragged?.type === "checkpoint") {
      const blockIds = getCheckpointBlockIds(fromId);
      if (blockIds.length === 0) return null;
      const blockEnd = fromIndex + blockIds.length;
      if (toIndex >= fromIndex && toIndex < blockEnd) return null;

      const remaining = taskIds.filter((id) => !blockIds.includes(id));
      let insertIndex = toIndex;
      if (toIndex > fromIndex) {
        insertIndex -= blockIds.length;
      }
      remaining.splice(insertIndex, 0, ...blockIds);
      return remaining;
    }

    const nextIds = [...taskIds];
    const [movedId] = nextIds.splice(fromIndex, 1);
    const insertIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
    nextIds.splice(insertIndex, 0, movedId);
    return nextIds;
  };

  const handleDropToEnd = async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dropHandledRef.current = true;
    cancelDragEndCleanup();
    const draggedTaskId = getDraggedTaskId(e);
    if (!draggedTaskId) return;
    const fromIndex = taskIds.indexOf(draggedTaskId);
    if (fromIndex === -1) return;
    const dragged = tasksById.get(draggedTaskId);
    const newIds = [...taskIds];
    if (dragged?.type === "checkpoint") {
      const blockIds = getCheckpointBlockIds(draggedTaskId);
      if (blockIds.length === 0) return;
      const remaining = newIds.filter((id) => !blockIds.includes(id));
      remaining.push(...blockIds);
      await reorderTasks(remaining);
      clearDragState();
      return;
    }
    const [movedId] = newIds.splice(fromIndex, 1);
    newIds.push(movedId);
    await reorderTasks(newIds);
    clearDragState();
  };

  const handleDropByOver = async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    dropHandledRef.current = true;
    cancelDragEndCleanup();
    if (!overTaskId) return;
    if (overTaskId === END_DROP_ID) {
      await handleDropToEnd(e);
      return;
    }
    const draggedTaskId = getDraggedTaskId(e);
    if (!draggedTaskId) return;
    const newIds = buildReorderedIds(draggedTaskId, overTaskId);
    if (!newIds) return;
    await reorderTasks(newIds);
    clearDragState();
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
            const isInDraggedBlock = draggedBlockIdSet.has(task._id);

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
                  isHidden={
                    activeTaskId === task._id ||
                    (draggedTask?.type === "checkpoint" && isInDraggedBlock)
                  }
                  onDragStartId={(taskId) => {
                    setActiveTaskId(taskId);
                    setOverTaskId(taskId);
                    activeTaskIdRef.current = taskId;
                    dropHandledRef.current = false;
                    cancelDragEndCleanup();
                  }}
                  onDragOverId={setOverTaskId}
                  onDragEnd={() => {
                    // Safari can fire dragend before drop. Delay cleanup.
                    cancelDragEndCleanup();
                    dragEndTimeoutRef.current = window.setTimeout(() => {
                      if (dropHandledRef.current) return;
                      clearDragState();
                      dragEndTimeoutRef.current = null;
                    }, 150);
                  }}
                />
              </Fragment>
            );
          })}
          {draggedTask ? (
            <div
              className="h-24"
              onDragOver={(e) => {
                e.preventDefault();
                setOverTaskId(END_DROP_ID);
              }}
              onDrop={handleDropToEnd}
            >
              {overTaskId === END_DROP_ID ? (
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
