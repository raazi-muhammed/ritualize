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

import { CompletionStatus, Frequency, Task, TaskType } from "@prisma/client";
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
import { resourceUsage } from "process";

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
        console.log(values);
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
    function showCheckbox() {
        if (!task.id) return true; // If task is new, show checkbox
        if (task?.status) return true; // If task is completed, show checkbox

        return false;
    }

    return (
        <Card
            key={task.id}
            className={`${
                task.type == TaskType.checkpoint
                    ? "bg-transparent border-none my-0"
                    : "my-2"
            } ${task.id == "" ? "opacity-50" : ""}`}
            draggable
            onDragStart={handleDragStart}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}>
            <CardContent className="flex justify-between p-4">
                {task.type == TaskType.task ? (
                    <section className="flex items-start gap-2">
                        {showCheckbox() ? (
                            <Checkbox
                                checked={
                                    task.status === CompletionStatus.completed
                                }
                                onCheckedChange={(checked) => {
                                    handleToggleCompletion(
                                        checked
                                            ? CompletionStatus.completed
                                            : CompletionStatus.skipped
                                    );
                                }}
                                className="mt-1"
                            />
                        ) : null}
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
                            <small className="text-muted-foreground">
                                {task.type}
                            </small>
                        </div>
                    </section>
                ) : (
                    <section className="flex items-end gap-2">
                        <p className="text-lg font-bold">{task.name}</p>
                    </section>
                )}
                <AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={"ghost"}
                                size="icon"
                                className="my-auto">
                                <CircleEllipsis size={18} />
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
                                                    type: task.type,
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
