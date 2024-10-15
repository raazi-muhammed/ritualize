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

        await prisma.task.create({
            data: {
                name: formData.get("name") as string,
                routineId: params.id,
                duration: Number(formData.get("duration")) || 1,
                order: Number(formData.get("order")) || 1,
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
                <Input type="number" name="duration" placeholder="duration" />
                <Input type="number" name="order" placeholder="order" />
                <Button>Submit</Button>
            </form>
        </div>
    );
}

export default AddRoutine;
