import Heading from "@/components/layout/Heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import React from "react";

async function getTask(id: string) {
    return await prisma.task.findFirstOrThrow({
        where: {
            id,
        },
    });
}

async function AddRoutine({
    params,
}: {
    params: { id: string; taskId: string };
}) {
    const task = await getTask(params.taskId);

    const addTodo = async (formData: FormData) => {
        "use server";

        await prisma.task.update({
            where: {
                id: params.taskId,
            },
            data: {
                name: formData.get("name") as string,
                duration: Number(formData.get("duration")) || 1,
                order: Number(formData.get("order")) || 1,
            },
        });
        revalidatePath(`/${params.id}`);
        redirect(`/${params.id}`);
    };
    return (
        <div className="container grid gap-4 py-8">
            <Heading>Edit Task</Heading>
            <form action={addTodo} className="space-y-4">
                <Input
                    defaultValue={task.name}
                    required
                    name="name"
                    placeholder="name"
                />
                <Input
                    defaultValue={task.duration}
                    type="number"
                    name="duration"
                    placeholder="duration"
                />
                <Input
                    defaultValue={task.order}
                    type="number"
                    name="order"
                    placeholder="order"
                />
                <Button>Submit</Button>
            </form>
        </div>
    );
}

export default AddRoutine;
