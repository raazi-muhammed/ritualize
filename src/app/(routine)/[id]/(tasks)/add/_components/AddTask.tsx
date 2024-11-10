"use client";

import Heading from "@/components/layout/Heading";
import { z } from "zod";
import { Frequency } from "@prisma/client";
import TaskForm, { taskSchema } from "../../_forms/TaskForm";
import { useRoutine } from "../../../_provider/RoutineProvider";
import { useRouter } from "next/navigation";

function AddTask({ routineId }: { routineId: string }) {
    const router = useRouter();
    const { handleAddTask } = useRoutine();

    async function onSubmit(values: z.infer<typeof taskSchema>) {
        router.push(`/${routineId}`);
        handleAddTask({
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
