"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Heading from "@/components/layout/Heading";
import { IoPlayCircle as StartIcon } from "react-icons/io5";
import Link from "next/link";
import { IoAddCircle as AddIcon } from "react-icons/io5";
import { UserButton } from "@clerk/nextjs";
import { formatDuration } from "@/lib/format";
import { createRoutine, getRoutines } from "./actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingIndicator from "@/components/layout/LoadingIndicator";
import ResponsiveModel, {
    ResponsiveModelTrigger,
} from "@/components/layout/ResponsiveModel";
import { useState } from "react";
import RoutineForm, { routineSchema } from "./_forms/RoutineForm";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";

export default async function Home() {
    const queryClient = useQueryClient();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const {
        data: routines,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["routines"],
        queryFn: () => getRoutines(),
    });

    const { mutateAsync } = useMutation({
        mutationFn: createRoutine,
        onSuccess: (routine) => {
            toast({
                description: `${routine?.name ?? "Routine"} created`,
            });
        },
    });

    async function onSubmit(values: z.infer<typeof routineSchema>) {
        await mutateAsync({
            name: values.name,
            duration: values.duration,
        });
        setIsAddOpen(false);
        queryClient.invalidateQueries({
            queryKey: ["routines"],
        });
        refetch();
    }

    return (
        <main className="container min-h-screen pt-4">
            {isLoading ? (
                <LoadingIndicator />
            ) : (
                <>
                    <ResponsiveModel
                        title="Add Routine"
                        open={isAddOpen}
                        setOpen={setIsAddOpen}
                        content={<RoutineForm onSubmit={onSubmit} />}>
                        <section className="flex justify-end gap-4">
                            <ResponsiveModelTrigger asChild>
                                <Button size="sm" variant="secondary">
                                    <AddIcon className="-ms-1 me-1" />
                                    Add
                                </Button>
                            </ResponsiveModelTrigger>
                            <UserButton />
                        </section>
                    </ResponsiveModel>
                    <Heading className="my-4">Routines</Heading>
                    <section className="flex flex-col gap-4">
                        {routines?.map((routine) => (
                            <Link href={`/${routine.id}`} key={routine.name}>
                                <Card className="relative -z-0 overflow-hidden border-none">
                                    <CardHeader className="z-10 p-4">
                                        <CardTitle>{routine.name}</CardTitle>
                                        <CardDescription>
                                            {formatDuration(routine.duration)}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex justify-end p-2">
                                        <Button size="sm" asChild>
                                            <Link href={`${routine.id}/start`}>
                                                <StartIcon
                                                    size="1.3em"
                                                    className="-ms-1 me-1"
                                                />
                                                Start
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                        {routines?.length === 0 && <p>No routines yet</p>}
                    </section>
                </>
            )}
        </main>
    );
}
