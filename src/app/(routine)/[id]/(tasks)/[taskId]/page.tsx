"use client";

import Heading from "@/components/layout/Heading";
import PageTemplate from "@/components/layout/PageTemplate";
import { Card } from "@/components/ui/card";
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
    <PageTemplate title={task.name}>
      <p className="text-xl font-bold">{`${task.completions.length} Completions`}</p>
      <ul className="space-y-2">
        {task.completions.map((completion) => (
          <li key={completion.id}>
            <Card className="p-2">
              <p className="text-lg">{formatDate(completion.date)}</p>
              <p>{completion.status}</p>
            </Card>
          </li>
        ))}
      </ul>
    </PageTemplate>
  );
}
