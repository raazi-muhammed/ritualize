"use client";
import Heading from "@/components/layout/Heading";
import { Button } from "@/components/ui/button";
import { useStopwatch } from "@/hooks/stop-watch";
import { Routine, Task } from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function StartComponent({
    routine,
}: {
    routine: Routine & {
        tasks: Task[];
    };
}) {
    const router = useRouter();
    const tasks = routine?.tasks;
    const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
    const { time, reset } = useStopwatch();
    return (
        <main className="container relative flex h-[100svh] w-full flex-col justify-around">
            <header>
                <section className="flex justify-between">
                    <div onClick={() => router.back()} className="flex gap-0">
                        <ChevronLeft size="1em" className="m-0 my-auto" />
                        <Heading className="my-auto mb-1 text-lg">
                            {routine.name}
                        </Heading>
                    </div>

                    <small className="my-auto font-mono">{time}</small>
                </section>
                <section className="flex gap-1">
                    {routine.tasks.map((task, index) => (
                        <div
                            key={index}
                            className={`h-1 w-full rounded bg-white ${
                                index >= currentTaskIndex
                                    ? "opacity-50"
                                    : "opacity-100"
                            }`}></div>
                    ))}
                </section>
            </header>
            <footer>
                <section className="my-8">
                    <Heading>{tasks[currentTaskIndex].name}</Heading>
                    <small>{tasks[currentTaskIndex].duration} minutes</small>
                </section>
                <section className="flex justify-between">
                    <div className="grid gap-1">
                        <Button
                            className="me-auto w-fit"
                            variant="secondary"
                            disabled={currentTaskIndex <= 0}
                            onClick={() => {
                                setCurrentTaskIndex((cti) => --cti);
                                reset();
                            }}>
                            <ChevronLeft className="-ms-2" />
                            Prev
                        </Button>
                        <small className="text-start text-muted-foreground">
                            {tasks?.[currentTaskIndex - 1]?.name}
                        </small>
                    </div>

                    {currentTaskIndex >= tasks.length - 1 ? (
                        <Button onClick={() => router.back()}>
                            Done
                            <ChevronRight className="-me-2" />
                        </Button>
                    ) : (
                        <div className="grid gap-1">
                            <Button
                                variant="secondary"
                                className="ms-auto w-fit"
                                disabled={currentTaskIndex >= tasks.length - 1}
                                onClick={() => {
                                    setCurrentTaskIndex((cti) => ++cti);
                                    reset();
                                }}>
                                Next
                                <ChevronRight className="-me-2" />
                            </Button>
                            <small className="text-end text-muted-foreground">
                                {tasks?.[currentTaskIndex + 1]?.name}
                            </small>
                        </div>
                    )}
                </section>
            </footer>
        </main>
    );
}

export default StartComponent;
