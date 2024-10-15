import Heading from "@/components/layout/Heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import React from "react";

function AddRoutine() {
    const addTodo = async (formData: FormData) => {
        "use server";

        await prisma.routine.create({
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
            <Heading>Add Routine</Heading>
            <form action={addTodo}>
                <Input required name="name" placeholder="name" />
                <Input type="number" name="duration" placeholder="duration" />
                <Button>Submit</Button>
            </form>
        </div>
    );
}

export default AddRoutine;
