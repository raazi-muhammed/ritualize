"use client";

import RoutineForm, { routineSchema } from "@/app/(routine)/_forms/RoutineForm";
import { updateRoutine } from "@/app/(routine)/actions";
import { toast } from "@/hooks/use-toast";
import { Routine } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { z } from "zod";

function EditRoutine({ routine }: { routine: Routine }) {
    const router = useRouter();
    const { mutateAsync } = useMutation({
        mutationFn: updateRoutine,
        onSuccess: (routine) => {
            toast({
                description: `${routine?.name ?? "Task"} created`,
            });
        },
    });

    async function onSubmit(values: z.infer<typeof routineSchema>) {
        await mutateAsync({
            id: routine.id,
            name: values.name,
            duration: values.duration,
        });
        router.push(`/${routine.id}`);
        router.refresh();
    }

    return (
        <RoutineForm
            onSubmit={onSubmit}
            defaultValues={{
                name: routine.name,
                duration: routine.duration ?? undefined,
            }}
        />
    );
}

export default EditRoutine;
