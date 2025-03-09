"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/layout/Heading";
import Link from "next/link";
import { IoAddCircle as AddIcon } from "react-icons/io5";
import { UserButton } from "@clerk/nextjs";
import { createRoutine, getRoutines } from "./actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingIndicator from "@/components/layout/LoadingIndicator";
import RoutineForm, { routineSchema } from "./_forms/RoutineForm";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import RoutineCard from "./[id]/_components/RoutineCard";
import { useModal } from "@/providers/ModelProvider";

export default async function Home() {
    const queryClient = useQueryClient();
    const { openModal, closeModal } = useModal();
    const { data: routines, isLoading } = useQuery({
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
        closeModal();
        await mutateAsync(values);
        queryClient.invalidateQueries({
            queryKey: ["routines"],
        });
    }

    return (
        <main className="container min-h-screen pt-4">
            {isLoading ? (
                <LoadingIndicator />
            ) : (
                <>
                    <section className="flex justify-end gap-4">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                                openModal({
                                    title: "Add Routine",
                                    content: (
                                        <RoutineForm onSubmit={onSubmit} />
                                    ),
                                });
                            }}>
                            <AddIcon className="-ms-1 me-1" />
                            Add
                        </Button>
                        <UserButton />
                    </section>
                    <Heading className="my-4">Routines</Heading>
                    <section className="flex flex-col gap-4">
                        <section className="grid grid-cols-2 gap-4">
                            {routines
                                ?.filter((r) => r.is_favorite)
                                .map((routine) => (
                                    <Link
                                        href={`/${routine.id}`}
                                        key={routine.name}>
                                        <RoutineCard
                                            isList={true}
                                            routine={routine}
                                        />
                                    </Link>
                                ))}
                        </section>
                        {routines
                            ?.filter((r) => !r.is_favorite)
                            .map((routine) => (
                                <Link
                                    href={`/${routine.id}`}
                                    key={routine.name}>
                                    <RoutineCard routine={routine} />
                                </Link>
                            ))}
                        {routines?.length === 0 && <p>No routines yet</p>}
                    </section>
                </>
            )}
        </main>
    );
}
