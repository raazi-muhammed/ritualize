"use client";

import PageTemplate from "@/components/layout/PageTemplate";
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
        className="w-full"
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
          month: "space-y-4 w-full",
          table: "w-full border-collapse space-y-1",
          head_row: "flex w-full justify-between",
          row: "flex w-full mt-2 justify-between",
        }}
        numberOfMonths={3}
        mode="multiple"
        selected={task.completions.map((c) => new Date(c.date))}
      />

      <p className="text-xl font-bold mt-4 ps-2">Records</p>
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
