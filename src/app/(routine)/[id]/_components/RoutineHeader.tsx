"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
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
import { ChevronLeft, CircleEllipsis } from "lucide-react";
import { IoAddCircle as AddIcon } from "react-icons/io5";
import { Frequency } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { deleteRoutine } from "../../actions";
import TaskForm, { taskSchema } from "../(tasks)/_forms/TaskForm";
import { date, z } from "zod";
import RoutineForm, { routineSchema } from "../../_forms/RoutineForm";
import { useRouter } from "next/navigation";
import Tasks from "./Tasks";
import { useModal } from "@/providers/ModelProvider";
import { createTask } from "../(tasks)/actions";
import { useRoutine } from "../_provider/RoutineProvider";
import { RoutineWithTasks } from "@/types/entities";

const RoutineHeader = ({ date }: { date: Date }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { openModal, closeModal } = useModal();

    const { routine } = useRoutine();
    const { mutateAsync: handleAddTask } = useMutation({
        mutationFn: createTask,
        onMutate: async (task) => {
            await queryClient.cancelQueries({
                queryKey: ["routine", routine.id, date],
            });

            const previousQueryData = queryClient.getQueryData([
                "routine",
                routine.id,
                date,
            ]);

            queryClient.setQueryData(
                ["routine", routine.id, date],
                (old: RoutineWithTasks) => {
                    return {
                        ...old,
                        tasks: [...(old?.tasks ?? []), task],
                    };
                }
            );

            return { previousQueryData };
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["routine", routine.id, date],
            });
        },
    });

    function handleAddTaskSubmit(values: z.infer<typeof taskSchema>) {
        if (!values.createNew) closeModal();
        handleAddTask({
            routine_id: routine.id,
            name: values.name,
            duration: values.duration,
            frequency: values.frequency as Frequency,
            every_frequency: values.everyFrequency,
            days_in_frequency: values.daysInFrequency || [0],
            start_date: new Date(values.startDate),
            end_date: null,
        });
    }

    const { mutateAsync: handleDeleteRoutine } = useMutation({
        mutationFn: deleteRoutine,
        onSuccess: (routine) => {
            // toast({
            //     description: `${routine?.name ?? "Routine"} deleted`,
            // });
        },
    });

    async function handleEditRoutineSubmit(
        values: z.infer<typeof routineSchema>
    ) {
        closeModal();
        //  handleEditRoutine(values);
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
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                        openModal({
                            title: "Add Task",
                            content: (
                                <TaskForm onSubmit={handleAddTaskSubmit} />
                            ),
                        });
                    }}>
                    <AddIcon />
                    Add
                </Button>
                <AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="secondary">
                                <CircleEllipsis
                                    size="1.3em"
                                    className="-mx-1"
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onSelect={() => {
                                    openModal({
                                        title: "All tasks",
                                        content: (
                                            <Tasks
                                                showStartDate
                                                date={new Date()}
                                            />
                                        ),
                                    });
                                }}>
                                All tasks
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => {
                                    openModal({
                                        title: "Edit Routine",
                                        content: (
                                            <RoutineForm
                                                onSubmit={
                                                    handleEditRoutineSubmit
                                                }
                                            />
                                        ),
                                    });
                                }}>
                                Edit
                            </DropdownMenuItem>
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
                                permanently delete your account and remove your
                                data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={async () => {
                                    // await handleDeleteRoutine({
                                    //     id: routine.id,
                                    // });
                                    queryClient.invalidateQueries({
                                        queryKey: ["routines"],
                                    });
                                    router.push("/");
                                }}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </header>
    );
};

export default RoutineHeader;
