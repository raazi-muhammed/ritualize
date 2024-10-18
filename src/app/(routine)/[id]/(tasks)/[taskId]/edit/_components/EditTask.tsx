"use client";

import { Frequency, Task } from "@prisma/client";
import React from "react";
import TaskForm, { taskSchema } from "../../../_forms/TaskForm";
import { useMutation } from "@tanstack/react-query";
import { updateTask } from "../../../actions";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useRouter } from "next/navigation";

function EditTask({ task }: { task: Task }) {
    const router = useRouter();

    const { mutateAsync } = useMutation({
        mutationFn: updateTask,
        onSuccess: (task) => {
            toast({
                description: `${task?.name ?? "Task"} updated`,
            });
        },
    });

    async function onSubmit(values: z.infer<typeof taskSchema>) {
        await mutateAsync({
            id: task.id,
            routine_id: task.routine_id,
            duration: values.duration,
            frequency: values.frequency as Frequency,
            name: values.name,
        });
        router.push(`/${task.routine_id}`);
        router.refresh();
    }

    return (
        <TaskForm
            onSubmit={onSubmit}
            defaultValues={{
                duration: task.duration,
                frequency: task.frequency,
                name: task.name,
            }}
        />
    );
}

export default EditTask;
