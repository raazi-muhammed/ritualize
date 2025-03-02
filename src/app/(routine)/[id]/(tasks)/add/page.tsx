"use client";

import React from "react";
import Heading from "@/components/layout/Heading";
import { z } from "zod";
import { Frequency } from "@prisma/client";
import TaskForm, { taskSchema } from "../_forms/TaskForm";
import { useRoutine } from "../../_provider/RoutineProvider";
import { useRouter } from "next/navigation";

const AddTaskPage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const { handleAddTask } = useRoutine();

    async function onSubmit(values: z.infer<typeof taskSchema>) {
        router.push(`/${params.id}`);
        handleAddTask({
            routine_id: params.id,
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
};
export default AddTaskPage;
