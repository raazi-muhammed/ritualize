"use client";

import { formatDate } from "@/lib/format";
import { useStore } from "@/stores";
import { TaskWithCompletions } from "@/types/entities";
import { useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: { taskId: string; id: string };
}) {
  const taskId = params.taskId;
  const { getTask } = useStore();
  const [task, setTask] = useState<TaskWithCompletions | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      const task = await getTask(params.id, params.taskId);
      setTask(task);
    };
    fetchTask();
  }, [params.id, params.taskId]);

  if (!task) return <div>Loading...</div>;

  return (
    <div>
      <h1>Task {taskId}</h1>
      <h1>{task.name}</h1>

      <p> {task.completions.length} completions</p>

      <ul>
        {task.completions.map((completion) => (
          <li key={completion.id}>{formatDate(completion.date)}</li>
        ))}
      </ul>
    </div>
  );
}
