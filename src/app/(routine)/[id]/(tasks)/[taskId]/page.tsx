"use client";

import Heading from "@/components/layout/Heading";
import PageTemplate from "@/components/layout/PageTemplate";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/format";
import { useStore } from "@/stores";
import { TaskWithCompletions } from "@/types/entities";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: { taskId: string; id: string };
}) {
  const { getTask, deleteTaskCompletion } = useStore();
  const [task, setTask] = useState<TaskWithCompletions | null>(null);

  const fetchTask = async () => {
    const task = await getTask(params.id, params.taskId);
    setTask(task);
  };

  useEffect(() => {
    fetchTask();
  }, [params.id, params.taskId]);

  if (!task) return <div>Loading...</div>;

  return (
    <PageTemplate title={task.name}>
      <p className="text-xl font-bold">{`${task.completions.length} Completions`}</p>
      <Calendar
        numberOfMonths={1}
        mode="multiple"
        selected={task.completions.map((c) => new Date(c.date))}
      />
      <ul className="space-y-2">
        {task.completions.map((completion) => (
          <li key={completion.id}>
            <Card className="py-2 px-4 flex justify-between items-center">
              <div>
                <p className="text-lg">{formatDate(completion.date)}</p>
                <p>{completion.status}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>...</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={async () => {
                      await deleteTaskCompletion(
                        params.id,
                        params.taskId,
                        completion.id
                      );
                      fetchTask();
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Card>
          </li>
        ))}
      </ul>
    </PageTemplate>
  );
}
