"use client";

import Heading from "@/components/layout/Heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import Link from "next/link";
import React from "react";
import {
    IoPencil as EditIcon,
    IoPlayCircle as StartIcon,
} from "react-icons/io5";
import { AddTask } from "./_components/AddTask";
import { useParams } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    deleteRoutine,
    deleteTask,
    moveTaskDown,
    moveTaskUp,
} from "@/redux/features/routineSlice";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function Page() {
    const params = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const routineId = params.id;
    const router = useRouter();
    const routines = useAppSelector((state) => state.routineReducer.routines);
    const routine = routines.find((r) => r.name == routineId);
    if (!routine) return <p>no routnie foudn</p>;

    function handleDeleteRoutine() {
        dispatch(deleteRoutine(routine?.name || ""));
        router.push("/");
    }

    function handleMoveTaskUp(index: number) {
        dispatch(moveTaskUp({ routine: routine?.name || "", index }));
    }
    function handleMoveTaskDown(index: number) {
        dispatch(moveTaskDown({ routine: routine?.name || "", index }));
    }
    function handleDeleteTask(index: number) {
        dispatch(deleteTask({ routine: routine?.name || "", index }));
    }

    return (
        <main className="container py-4">
            <header className="flex justify-between gap-3">
                <Link href="/">
                    <ChevronLeft />
                </Link>
                <div className="flex gap-3">
                    <AddTask routine={routine} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="secondary">
                                <EditIcon size="1.3em" className="-mx-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleDeleteRoutine}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            {!!routine && (
                <>
                    <section className="my-4 bg-background py-4">
                        <Heading>{routine.name}</Heading>
                    </section>
                    <section className="mb-16 space-y-2">
                        {routine.tasks.map((task, index) => (
                            <Card key={task.name}>
                                <CardContent className="flex justify-between p-4">
                                    <section>
                                        <p>{task.name}</p>
                                        <small>{task.duration}</small>
                                    </section>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            ...
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleMoveTaskUp(index)
                                                }>
                                                Move up
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleMoveTaskDown(index)
                                                }>
                                                Move down
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleDeleteTask(index)
                                                }>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardContent>
                            </Card>
                        ))}
                    </section>
                </>
            )}
            <footer className="fixed bottom-0 left-0 flex w-[100vw] justify-center py-4">
                <Link href={`${routine.name}/start`}>
                    <Button size="lg" className="w-fit px-5">
                        <StartIcon size="1.3em" className="-ms-1 me-1" />
                        Start
                    </Button>
                </Link>
            </footer>
        </main>
    );
}
