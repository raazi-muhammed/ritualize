import Heading from "@/components/layout/Heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import React from "react";

async function getRoutine(id: string) {
    return await prisma.routine.findFirstOrThrow({
        where: {
            id,
        },
    });
}

async function AddRoutine({ params }: { params: { id: string } }) {
    const routine = await getRoutine(params.id);

    const addTodo = async (formData: FormData) => {
        "use server";

        await prisma.routine.update({
            where: {
                id: params.id,
            },
            data: {
                name: formData.get("name") as string,
                duration: Number(formData.get("duration")) || 1,
            },
        });
        revalidatePath("/");
        redirect("/");
    };
    return (
        <div className="container grid gap-4 py-8">
            <Heading>Edit Routine</Heading>
            <form action={addTodo}>
                <Input
                    defaultValue={routine.name}
                    required
                    name="name"
                    placeholder="name"
                />
                <Input
                    defaultValue={routine.duration ?? ""}
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
