"use client";
import Heading from "@/components/layout/Heading";
import { Button } from "@/components/ui/button";
import { useStopwatch } from "@/hooks/stop-watch";
import { Routine, Task } from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react"


function StartComponent({
    routine,
}: {
    routine: Routine & {
        tasks: Task[];
    };
}) {
    const myRef = useRef(null);

    const router = useRouter();
    const tasks = routine?.tasks;
    const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
    const { time, reset } = useStopwatch();
    const [moveBy, setMoveBy] = useState(0 + 200)

    useEffect(()=>{
        const item = document.getElementById("active-task")
        item?.scrollIntoView({
            block: "start",
            behavior: "smooth",
        })
    }, [currentTaskIndex])
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
            <main className="h-[calc(100vh-20rem)] overflow-scroll" ref={myRef}>
            <section className="flex flex-col gap-2 h-[calc(100vh-30rem)] py-30 mt-24 mb-32" >
                {routine.tasks.map((task, index) => (
                            <motion.div
                            key={task.id}
                            className="scroll-mt-[20vh]"
                            id={currentTaskIndex==index ? "active-task" : "in-active-task"}
                             initial={{
                                scale:.75,
                                originX: 0,
                                opacity: .10
                            }}
                            animate={{
                                scale: currentTaskIndex==index ? 1 : .75,
                                originX: 0,
                                opacity: currentTaskIndex==index ? 1 : .25,
                            }}
                            transition={{
                                duration: .45, 
                                
                            }}
                            onClick={()=>{
                                setCurrentTaskIndex(index)
                            }}
                            >

                            <Heading >  {task.name}
                            </Heading>
                            <motion.small
                            initial={{
                                opacity: 0
                            }} animate={{
                                opacity: currentTaskIndex==index ? 1 : 0,
                            }}
                            transition={{
                                duration: .75
                            }}
                            
                            >{tasks[currentTaskIndex].duration} minutes</motion.small>

                            </motion.div>
                        
                    ))}
                </section>
            </main>
            <footer>
                
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
