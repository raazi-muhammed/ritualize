"use client";

import Heading from "@/components/layout/Heading";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { z } from "zod";
import { createRoutine } from "../actions";
import { toast } from "@/hooks/use-toast";
import RoutineForm, { routineSchema } from "../_forms/RoutineForm";
import { useRouter } from "next/navigation";

function AddRoutine() {
    const router = useRouter();
    const { mutateAsync } = useMutation({
        mutationFn: createRoutine,
        onSuccess: (routine) => {
            toast({
                description: `${routine?.name ?? "Task"} created`,
            });
        },
    });

    async function onSubmit(values: z.infer<typeof routineSchema>) {
        await mutateAsync({
            name: values.name,
            duration: values.duration,
        });
        router.push(`/`);
        router.refresh();
    }

    return (
        <div className="container grid gap-4 py-8">
            <Heading>Add Routine</Heading>
            <RoutineForm onSubmit={onSubmit} />
        </div>
    );
}

export default AddRoutine;
