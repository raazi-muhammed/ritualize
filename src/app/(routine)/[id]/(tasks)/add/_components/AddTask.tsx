"use client";

import Heading from "@/components/layout/Heading";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { createTask } from "../../actions";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Frequency } from "@prisma/client";
import TaskForm, { taskSchema } from "../../_forms/TaskForm";
import { useRouter } from "next/navigation";

function AddTask({ routineId }: { routineId: string }) {
    const router = useRouter();

    const { mutateAsync } = useMutation({
        mutationFn: createTask,
        onSuccess: (task) => {
            toast({
                description: `${task?.name ?? "Task"} created`,
            });
            router.push(`/${routineId}`);
        },
    });

    async function onSubmit(values: z.infer<typeof taskSchema>) {
        await mutateAsync({
            routine_id: routineId,
            days_of_week: [],
            duration: values.duration,
            frequency: values.frequency as Frequency,
            name: values.name,
        });
    }

    return (
        <div className="container grid gap-4 py-8">
            <Heading>Add Task</Heading>
            <TaskForm onSubmit={onSubmit} />
        </div>
    );
}

export default AddTask;
