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

import { CompletionStatus, Frequency, Task } from "@prisma/client";
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
import { TaskWithStatus } from "@/types/entities";

const TaskCard = ({
    task,
    showStartDate = false,
    date,
}: {
    task: TaskWithStatus;
    showStartDate?: boolean;
    date: Date;
}) => {
    const queryClient = useQueryClient();
    const { openModal, closeModal } = useModal();
    const {
        routine,
        handleDeleteTask,
        handleChangeTaskStatus,
        handleMoveTask,
        handleEditTask,
    } = useRoutine(date);

    const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("taskId", task.id);
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        const taskId = e.dataTransfer.getData("taskId");
        handleMoveTask({
            taskToMoveId: taskId,
            moveToTask: task,
        });
    };

    function onSubmit(values: z.infer<typeof taskSchema>) {
        closeModal();
        handleEditTask({
            ...task,
            ...{
                ...values,
                every_frequency: values.everyFrequency,
                start_date: new Date(values.startDate),
                frequency: values.frequency as Frequency,
            },
        });
    }

    function handleToggleCompletion(status: CompletionStatus) {
        handleChangeTaskStatus({
            taskId: task.id,
            status,
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
                    {task?.status && (
                        <Checkbox
                            checked={task.status === CompletionStatus.completed}
                            onCheckedChange={(checked) => {
                                handleToggleCompletion(
                                    checked
                                        ? CompletionStatus.completed
                                        : CompletionStatus.skipped
                                );
                            }}
                            className="mt-1"
                        />
                    )}
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
                                <AlertDialogAction
                                    onClick={() => {
                                        handleDeleteTask({
                                            taskId: task.id,
                                        });
                                    }}>
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
