"use client";
import Heading from "@/components/layout/Heading";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
        <main className="container relative flex h-[100svh] w-full flex-col justify-around">
            <img
                className="absolute inset-0 -z-10 h-[100svh] w-full scale-110 opacity-50 blur-xl"
                src={routine.cover}
                alt=""
            />
            <header>
                <section className="flex justify-between">
                    <div onClick={() => router.back()} className="flex gap-0">
                        <ChevronLeft size="1em" className="m-0 my-auto" />
                        <Heading className="my-auto mb-1 text-lg">
                            {routine.name}
                        </Heading>
                    </div>

                    <small className="my-auto">
                        {routine.duration} minutes
                    </small>
                </section>
                <section className="flex gap-1">
                    {routine.tasks.map((task, index) => (
                        <div
                            className={`h-1 w-full rounded bg-white ${
                                index >= currentTaskIndex
                                    ? "opacity-50"
                                    : "opacity-100"
                            }`}></div>
                    ))}
                </section>
            </header>
            <section>
                <img
                    className="m-auto aspect-square w-full max-w-96 rounded-sm"
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
                        variant="secondary"
                        disabled={currentTaskIndex <= 0}
                        onClick={() => setCurrentTaskIndex((cti) => --cti)}>
                        <ChevronLeft className="-ms-2" />
                        Prev
                    </Button>
                    {currentTaskIndex >= tasks.length - 1 ? (
                        <Button onClick={() => router.back()}>
                            Done
                            <ChevronRight className="-me-2" />
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            disabled={currentTaskIndex >= tasks.length - 1}
                            onClick={() => setCurrentTaskIndex((cti) => ++cti)}>
                            Next
                            <ChevronRight className="-me-2" />
                        </Button>
                    )}
                </section>
            </footer>
        </main>
    );
}
