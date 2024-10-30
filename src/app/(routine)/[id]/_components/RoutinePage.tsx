"use client";

import Heading from "@/components/layout/Heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import {
    IoPencil as EditIcon,
    IoPlayCircle as StartIcon,
} from "react-icons/io5";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronLeft } from "lucide-react";
import { IoAddCircle as AddIcon } from "react-icons/io5";
import { Routine, Task } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { deleteTask, moveAfter } from "../(tasks)/actions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { deleteRoutine } from "../../actions";

function RoutinePage({
    routine,
}: {
    routine: Routine & {
        tasks: Task[];
    };
}) {
    const router = useRouter();

    const { mutateAsync: handleDeleteTask } = useMutation({
        mutationFn: deleteTask,
        onSuccess: (task) => {
            toast({
                description: `${task?.name ?? "Task"} deleted`,
            });
            router.refresh();
        },
    });

    const { mutateAsync: handleDeleteRoutine } = useMutation({
        mutationFn: deleteRoutine,
        onSuccess: (task) => {
            toast({
                description: `${task?.name ?? "Routine"} deleted`,
            });
            router.push("/");
            router.refresh();
        },
    });

    const { mutateAsync: handleMoveAfter } = useMutation({
        mutationFn: moveAfter,
        onSuccess: () => {
            router.refresh();
        },
    });

    return (
        <main className="container py-4">
            <header className="flex justify-between gap-3">
                <Link href="/">
                    <ChevronLeft />
                </Link>
                <div className="flex gap-3">
                    <Link href={`${routine.id}/add`}>
                        <Button size="sm" variant="secondary">
                            <AddIcon />
                            Add
                        </Button>
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="secondary">
                                <EditIcon size="1.3em" className="-mx-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link href={`${routine.id}/edit`}>
                                <DropdownMenuItem className="p-0">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="w-full">
                                        <p className="w-full text-start">
                                            Edit
                                        </p>
                                    </Button>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                                className="p-0"
                                onClick={() => {
                                    handleDeleteRoutine({ id: routine.id });
                                }}>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="w-full">
                                    <p className="w-full text-start">Delete</p>
                                </Button>
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
                        {routine?.tasks.length < 1 && <p>No tasks yet</p>}
                        {routine?.tasks?.map((task, index) => (
                            <Card key={task.name}>
                                <CardContent className="flex justify-between p-4">
                                    <section>
                                        <p>{task.name}</p>
                                        <small>d: {task.duration}</small>
                                        <span className="mx-2 text-xs">|</span>
                                        <small>o: {task?.order}</small>
                                    </section>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            ...
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {routine?.tasks?.map(
                                                (menu_task, index) => (
                                                    <DropdownMenuItem
                                                        key={index}
                                                        className="p-0"
                                                        onClick={() => {
                                                            handleMoveAfter({
                                                                routine_id:
                                                                    routine.id,
                                                                move_after:
                                                                    menu_task,
                                                                task_to_move:
                                                                    task,
                                                            });
                                                        }}>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="w-full">
                                                            <p className="w-full text-start">
                                                                Move after{" "}
                                                                {menu_task.name}
                                                            </p>
                                                        </Button>
                                                    </DropdownMenuItem>
                                                )
                                            )}
                                            <Link
                                                href={`/${routine.id}/${task.id}/edit`}>
                                                <DropdownMenuItem className="p-0">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="w-full">
                                                        <p className="w-full text-start">
                                                            Edit
                                                        </p>
                                                    </Button>
                                                </DropdownMenuItem>
                                            </Link>

                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleDeleteTask({
                                                        id: task.id,
                                                    })
                                                }
                                                className="p-0">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="w-full">
                                                    <p className="w-full text-start">
                                                        Delete
                                                    </p>
                                                </Button>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardContent>
                            </Card>
                        ))}
                    </section>
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
