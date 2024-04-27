"use client";
import Heading from "@/components/layout/Heading";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux";
import { Task } from "@/types/entities";
import React, { useEffect, useState } from "react";
import { IoPlayCircle as StartIcon } from "react-icons/io5";

export default function Start() {
    const routine = useAppSelector((state) => state.routineReducer.routines[0]);
    const task: Task = routine.tasks[0];
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setProgress(80), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="container relative flex h-screen flex-col justify-around overflow-hidden">
            <img
                className="absolute inset-0 -z-10 h-screen scale-110 opacity-50 blur-xl"
                src={routine.cover}
                alt=""
            />
            <header>
                <section className="flex justify-between">
                    <Heading className="text-lg">{routine.name}</Heading>
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
                    <Heading>{task.name}</Heading>
                    <small>{task.duration} minutes</small>
                </section>
                <section className="flex h-14 w-full justify-start rounded-full bg-[#66645A] p-1 align-middle">
                    <section
                        key={progress}
                        className={`flex w-[calc(${progress}%+3rem)] justify-end rounded-full bg-[#4b4a44] p-1`}>
                        <Button className="aspect-square h-full rounded-full bg-white">
                            <StartIcon size="1.75em" className="absolute" />
                        </Button>
                    </section>
                </section>
            </footer>
        </main>
    );
}
