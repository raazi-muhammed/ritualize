"use client";
import Heading from "@/components/layout/Heading";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Start() {
    const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
    const params = useParams<{ id: string }>();
    const routineId = params.id;
    const router = useRouter();

    const routines = useAppSelector((state) => state.routineReducer.routines);
    const routine = routines.find((r) => r.name == routineId);
    if (!routine) return <p>no routnie foudn</p>;

    const tasks = routine.tasks;

    return (
        <main className="container relative flex h-screen flex-col justify-around overflow-hidden">
            <img
                className="absolute inset-0 -z-10 h-screen scale-110 opacity-50 blur-xl"
                src={routine.cover}
                alt=""
            />
            <header>
                <section className="flex justify-between">
                    <div onClick={() => router.back()}>
                        <Heading className="text-lg">{routine.name}</Heading>
                    </div>

                    <small className="my-auto">
                        {routine.duration} minutes
                    </small>
                </section>
                <section className="flex gap-1">
                    <div className="h-1 w-full rounded bg-muted"></div>
                    <div className="h-1 w-full rounded bg-muted"></div>
                    <div className="h-1 w-full rounded bg-muted"></div>
                    <div className="h-1 w-full rounded bg-muted"></div>
                </section>
            </header>
            <section>
                <img
                    className="aspect-square rounded-sm"
                    src={routine.cover}
                    alt=""
                />
            </section>
            <footer>
                <section className="my-8">
                    <Heading>{tasks[currentTaskIndex].name}</Heading>
                    <small>{tasks[currentTaskIndex].duration} minutes</small>
                </section>
                <section className="flex justify-between">
                    <Button
                        disabled={currentTaskIndex <= 0}
                        onClick={() => setCurrentTaskIndex((cti) => --cti)}>
                        Previous
                    </Button>
                    <Button
                        disabled={currentTaskIndex >= tasks.length - 1}
                        onClick={() => setCurrentTaskIndex((cti) => ++cti)}>
                        Next
                    </Button>
                </section>
            </footer>
        </main>
    );
}
