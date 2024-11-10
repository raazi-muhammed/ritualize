"use client";

import Heading from "@/components/layout/Heading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoPlayCircle as StartIcon } from "react-icons/io5";
import { Routine, Task } from "@prisma/client";
import RoutineHeader from "./RoutineHeader";
import RoutineProvider, { useRoutine } from "../_provider/RoutineProvider";
import Tasks from "./Tasks";
import { useEffect } from "react";

function RoutinePage({
    routine,
}: {
    routine: Routine & {
        tasks: Task[];
    };
}) {
    const { setRoutine } = useRoutine();

    useEffect(() => {
        setRoutine(routine);
    }, [routine, setRoutine]);

    return (
        <main className="container py-4">
            <RoutineHeader routine={routine} />
            {!!routine && (
                <>
                    <section className="my-4 bg-background py-4">
                        <Heading>{routine.name}</Heading>
                    </section>
                    <Tasks />
                    <footer className="fixed bottom-0 left-0 flex w-[100vw] justify-center py-4">
                        <Link href={`${routine.id}/start`} prefetch={true}>
                            <Button size="lg" className="w-fit px-5">
                                <StartIcon
                                    size="1.3em"
                                    className="-ms-1 me-1"
                                />
                                Start
                            </Button>
                        </Link>
                    </footer>
                </>
            )}
        </main>
    );
}

export default RoutinePage;
