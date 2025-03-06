"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoPencil as EditIcon } from "react-icons/io5";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import { ChevronLeft } from "lucide-react";
import { IoAddCircle as AddIcon } from "react-icons/io5";
import { Frequency, Routine } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { deleteRoutine } from "../../actions";
import TaskForm, { taskSchema } from "../(tasks)/_forms/TaskForm";
import { z } from "zod";
import { useRoutine } from "../_provider/RoutineProvider";
import { useState } from "react";
import ResponsiveModel, {
    ResponsiveModelTrigger,
} from "@/components/layout/ResponsiveModel";

const RoutineHeader = ({ routine }: { routine: Routine }) => {
    const queryClient = useQueryClient();
    const { handleAddTask } = useRoutine();
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

    async function onSubmit(values: z.infer<typeof taskSchema>) {
        if (!values.createNew) setIsAddTaskOpen(false);
        await handleAddTask({
            routine_id: routine.id,
            days_of_week: [],
            duration: values.duration,
            frequency: values.frequency as Frequency,
            name: values.name,
        });
        queryClient.invalidateQueries({
            queryKey: ["routine"],
        });
    }

    const { mutateAsync: handleDeleteRoutine } = useMutation({
        mutationFn: deleteRoutine,
        onSuccess: (routine) => {
            toast({
                description: `${routine?.name ?? "Routine"} deleted`,
            });
        },
    });

    return (
        <header className="flex justify-between gap-3">
            <Link href="/">
                <ChevronLeft />
            </Link>
            <div className="flex gap-3">
                <ResponsiveModel
                    open={isAddTaskOpen}
                    setOpen={setIsAddTaskOpen}
                    title="Add Task"
                    content={<TaskForm onSubmit={onSubmit} />}>
                    <ResponsiveModelTrigger asChild>
                        <Button size="sm" variant="secondary">
                            <AddIcon />
                            Add
                        </Button>
                    </ResponsiveModelTrigger>
                </ResponsiveModel>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="secondary">
                            <EditIcon size="1.3em" className="-mx-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="p-0">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="w-full"
                                asChild>
                                <Link href={`/${routine.id}/edit`}>
                                    <p className="w-full text-start">Edit</p>
                                </Link>
                            </Button>
                        </DropdownMenuItem>
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
    );
};

export default RoutineHeader;
