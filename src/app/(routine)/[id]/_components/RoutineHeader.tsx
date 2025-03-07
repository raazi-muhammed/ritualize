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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronLeft } from "lucide-react";
import { IoAddCircle as AddIcon } from "react-icons/io5";
import { Frequency } from "@prisma/client";
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
import RoutineForm, { routineSchema } from "../../_forms/RoutineForm";
import { useRouter } from "next/navigation";

const RoutineHeader = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const { handleAddTask, handleEditRoutine, routine } = useRoutine();
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [isEditRoutineOpen, setIsEditRoutineOpen] = useState(false);

    async function handleAddTaskSubmit(values: z.infer<typeof taskSchema>) {
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

    async function handleEditRoutineSubmit(
        values: z.infer<typeof routineSchema>
    ) {
        setIsEditRoutineOpen(false);
        handleEditRoutine(values);
        queryClient.invalidateQueries({
            queryKey: ["routine"],
        });
    }

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
                    content={<TaskForm onSubmit={handleAddTaskSubmit} />}>
                    <ResponsiveModelTrigger asChild>
                        <Button size="sm" variant="secondary">
                            <AddIcon />
                            Add
                        </Button>
                    </ResponsiveModelTrigger>
                </ResponsiveModel>
                <AlertDialog>
                    <ResponsiveModel
                        open={isEditRoutineOpen}
                        setOpen={setIsEditRoutineOpen}
                        title="Edit Routine"
                        content={
                            <RoutineForm
                                onSubmit={handleEditRoutineSubmit}
                                defaultValues={{
                                    name: routine.name,
                                    duration: routine.duration ?? undefined,
                                }}
                            />
                        }>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="secondary">
                                    <EditIcon size="1.3em" className="-mx-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <ResponsiveModelTrigger>
                                    <DropdownMenuItem className="w-full">
                                        Edit
                                    </DropdownMenuItem>
                                </ResponsiveModelTrigger>
                                <AlertDialogTrigger className="w-full">
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your account and remove
                                    your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        handleDeleteRoutine({
                                            id: routine.id,
                                        });
                                        router.push("/");
                                    }}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </ResponsiveModel>
                </AlertDialog>
            </div>
        </header>
    );
};

export default RoutineHeader;
