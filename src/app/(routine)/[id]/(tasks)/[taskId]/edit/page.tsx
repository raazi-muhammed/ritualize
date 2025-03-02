import Heading from "@/components/layout/Heading";
import { prisma } from "@/lib/prisma";
import React from "react";
import EditTask from "./_components/EditTask";

async function getTask(id: string) {
    return await prisma.task.findFirstOrThrow({
        where: {
            id,
        },
    });
}

async function EditTaskPage({
    params,
}: {
    params: { id: string; taskId: string };
}) {
    const task = await getTask(params.taskId);

    return (
        <div className="container grid gap-4 py-8">
            <Heading>Edit Task</Heading>
            <EditTask task={task} />
        </div>
    );
}

export default EditTaskPage;
