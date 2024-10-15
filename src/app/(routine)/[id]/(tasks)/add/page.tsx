import Heading from "@/components/layout/Heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import React from "react";

function AddRoutine({ params }: { params: { id: string } }) {
    const addTodo = async (formData: FormData) => {
        "use server";

        const order = await prisma.task.findFirst({
            where: {
                routineId: params.id,
            },
            orderBy: {
                order: "desc",
            },
        });
        await prisma.task.create({
            data: {
                name: formData.get("name") as string,
                routineId: params.id,
                duration: Number(formData.get("duration")) || 1,
                order: order?.order ? order?.order + 1 : 1,
            },
        });
        revalidatePath(`/${params.id}`);
        redirect(`/${params.id}`);
    };
    return (
        <div className="container grid gap-4 py-8">
            <Heading>Add Task</Heading>
            <form action={addTodo}>
                <Input required name="name" placeholder="name" />
                <Input
                    defaultValue={2}
                    type="number"
                    name="duration"
                    placeholder="duration"
                />
                <Button>Submit</Button>
            </form>
        </div>
    );
}

export default AddRoutine;
