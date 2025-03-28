"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

import { CompletionStatus, Task } from "@prisma/client";
import { useRoutine } from "../_provider/RoutineProvider";
import { DragEvent } from "react";
import { CircleEllipsis } from "lucide-react";
import { formatDateForInput } from "@/lib/format";
import { useQueryClient } from "@tanstack/react-query";
import TaskForm, { taskSchema } from "../(tasks)/_forms/TaskForm";
import { z } from "zod";
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
import { generateCardDescription } from "@/lib/utils";
import { useModal } from "@/providers/ModelProvider";
import React from "react";

const TaskCard = ({
    task,
    showStartDate = false,
    date,
    status,
}: {
    routineId: string;
    task: Task;
    showStartDate?: boolean;
    date: Date;
    status: CompletionStatus;
}) => {
    const queryClient = useQueryClient();
    const {
        handleMoveTask,
        handleDeleteTask,
        handleEditTask,
        handleChangeTaskStatus,
    } = useRoutine();
    const { openModal, closeModal } = useModal();

    const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("taskId", task.id);
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        const taskId = e.dataTransfer.getData("taskId");
        await handleMoveTask({
            moveToTask: task,
            taskToMoveId: taskId,
        });
        queryClient.invalidateQueries({
            queryKey: ["routine"],
        });
    };

    async function onSubmit(values: z.infer<typeof taskSchema>) {
        closeModal();
        await handleEditTask({
            ...task,
            ...{
                ...values,
                every_frequency: values.everyFrequency,
                start_date: new Date(values.startDate),
                days_in_frequency: values.daysInFrequency,
            },
        } as any);
        queryClient.invalidateQueries({
            queryKey: ["routine"],
        });
    }

    async function handleDelete() {
        await handleDeleteTask({
            taskId: task.id,
        });
        queryClient.invalidateQueries({
            queryKey: ["routine"],
        });
    }

    async function handleToggleCompletion(status: CompletionStatus) {
        await handleChangeTaskStatus({
            taskId: task.id,
            date,
            status,
        });

        queryClient.invalidateQueries({
            queryKey: ["routine", "taskCompletions"],
        });
    }

    return (
        <Card
            key={task.id}
            className={`my-2 ${task.id == "" ? "opacity-50" : ""}`}
            draggable
            onDragStart={handleDragStart}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}>
            <CardContent className="flex justify-between p-4">
                <section className="flex items-start gap-2">
                    <Checkbox
                        checked={status === CompletionStatus.completed}
                        onCheckedChange={(checked) => {
                            handleToggleCompletion(
                                checked
                                    ? CompletionStatus.completed
                                    : CompletionStatus.skipped
                            );
                        }}
                        className="mt-1"
                    />
                    <div>
                        <p>{task.name}</p>
                        <small className="text-muted-foreground">
                            {`${task.duration} min`}
                        </small>
                        <br />
                        <small className="text-muted-foreground">
                            {generateCardDescription(task, {
                                showStartDate,
                            })}
                        </small>
                    </div>
                </section>
                <AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={"ghost"}
                                size="icon"
                                className="my-auto">
                                <CircleEllipsis />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onSelect={() => {
                                    openModal({
                                        title: "Edit Task",
                                        content: (
                                            <TaskForm
                                                hideCreateNew
                                                onSubmit={onSubmit}
                                                defaultValues={{
                                                    duration: task.duration,
                                                    frequency: task.frequency,
                                                    name: task.name,
                                                    everyFrequency:
                                                        task.every_frequency,
                                                    startDate:
                                                        formatDateForInput(
                                                            task.start_date
                                                        ),
                                                    daysInFrequency:
                                                        task.days_in_frequency,
                                                }}
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
                                <AlertDialogAction onClick={handleDelete}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </DropdownMenu>
                </AlertDialog>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
