"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Task } from "@prisma/client";
import { useRoutine } from "../_provider/RoutineProvider";
import { DragEvent, useState } from "react";
import { CircleEllipsis } from "lucide-react";
import { formatDateForInput, formatDuration } from "@/lib/format";
import ResponsiveModel, {
    ResponsiveModelTrigger,
} from "@/components/layout/ResponsiveModel";
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
import moment from "moment";

const TaskCard = ({ task }: { routineId: string; task: Task }) => {
    const queryClient = useQueryClient();
    const { handleMoveTask, handleDeleteTask, handleEditTask } = useRoutine();
    const [open, setOpen] = useState(false);

    const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("taskId", task.id);
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        const taskId = e.dataTransfer.getData("taskId");
        await handleMoveTask({
            moveToTask: task,
            taskToMoveId: taskId,
        });
    };

    async function onSubmit(values: z.infer<typeof taskSchema>) {
        setOpen(false);
        await handleEditTask({
            ...task,
            ...{
                ...values,
                every_frequency: values.everyFrequency,
                start_date: new Date(values.startDate),
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

    return (
        <>
            <Card
                key={task.id}
                className={`my-2 ${task.id == "" ? "opacity-50" : ""}`}
                draggable
                onDragStart={handleDragStart}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}>
                <CardContent className="flex justify-between p-4">
                    <section>
                        <p>{task.name}</p>
                        <small className="text-muted-foreground">
                            {formatDuration(task.duration)}
                        </small>
                        <small className="text-muted-foreground">
                            {`, every ${task.every_frequency} ${
                                task.frequency
                            }, from ${moment(task.start_date).format(
                                "DD, MMM, YYYY"
                            )}`}
                        </small>
                    </section>
                    <ResponsiveModel
                        open={open}
                        setOpen={setOpen}
                        title="Edit Task"
                        content={
                            <TaskForm
                                hideCreateNew
                                onSubmit={onSubmit}
                                defaultValues={{
                                    duration: task.duration,
                                    frequency: task.frequency,
                                    name: task.name,
                                    everyFrequency: task.every_frequency,
                                    startDate: formatDateForInput(
                                        task.start_date
                                    ),
                                }}
                            />
                        }>
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
                                    <ResponsiveModelTrigger className="w-full">
                                        <DropdownMenuItem>
                                            Edit
                                        </DropdownMenuItem>
                                    </ResponsiveModelTrigger>
                                    <AlertDialogTrigger className="w-full">
                                        <DropdownMenuItem>
                                            Delete
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This
                                            will permanently delete your account
                                            and remove your data from our
                                            servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}>
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </DropdownMenu>
                        </AlertDialog>
                    </ResponsiveModel>
                </CardContent>
            </Card>
        </>
    );
};

export default TaskCard;
