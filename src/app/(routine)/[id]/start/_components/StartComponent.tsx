"use client";

import Heading from "@/components/layout/Heading";
import { Button } from "@/components/ui/button";
import { useStopwatch } from "@/hooks/stop-watch";
import { Routine, Task } from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

function StartComponent({
    routine,
    tasks,
    setRunning,
}: {
    routine: Routine;
    tasks: Task[];
    setRunning: (running: boolean) => void;
}) {
    const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
    const { time, reset } = useStopwatch();

    useEffect(() => {
        const item = document.getElementById("active-task");
        item?.scrollIntoView({
            block: "start",
            behavior: "smooth",
        });
    }, [currentTaskIndex]);
    return (
        <main className="container relative flex h-[100svh] w-full flex-col justify-around">
            <header className="sticky top-0 pt-8 pb-28 z-10 bg-gradient-to-b from-40% from-background">
                <section className="flex justify-between">
                    <div
                        onClick={() => setRunning(false)}
                        className="flex gap-0">
                        <ChevronLeft size="1em" className="m-0 my-auto" />
                        <Heading className="my-auto mb-1 text-lg">
                            {routine.name}
                        </Heading>
                    </div>

                    <small className="my-auto font-mono">{time}</small>
                </section>
                <section className="flex gap-1">
                    {tasks.map((task, index) => (
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
            <section className="grid z-0">
                <div className="h-[100vh]" />
                {tasks.map((task, index) => (
                    <motion.div
                        key={task.id}
                        className="scroll-mt-[40vh]"
                        id={
                            currentTaskIndex == index
                                ? "active-task"
                                : "in-active-task"
                        }
                        initial={{
                            scale: 0.75,
                            originX: 0,
                            opacity: 0.1,
                        }}
                        animate={{
                            scale: currentTaskIndex == index ? 1 : 0.75,
                            originX: 0,
                            opacity: currentTaskIndex == index ? 1 : 0.25,
                        }}
                        transition={{
                            duration: 0.45,
                        }}
                        onClick={() => {
                            setCurrentTaskIndex(index);
                        }}>
                        <Heading> {task.name}</Heading>
                        <motion.small
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: currentTaskIndex == index ? 1 : 0,
                            }}
                            transition={{
                                duration: 0.75,
                            }}>
                            {tasks[currentTaskIndex].duration} minutes
                        </motion.small>
                    </motion.div>
                ))}
                <div className="flex h-[30vh]" />
            </section>
            <footer className="fixed bottom-0 left-0 right-0 container z-10 bg-gradient-to-t from-40% from-background pb-8 pt-28">
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
                        <Button onClick={() => setRunning(false)}>
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
