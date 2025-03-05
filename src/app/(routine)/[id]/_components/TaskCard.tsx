"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Task } from "@prisma/client";
import { useRoutine } from "../_provider/RoutineProvider";
import { DragEvent, useState } from "react";
import Alert from "@/components/ui-wrapper/Alert";
import { CircleEllipsis } from "lucide-react";
import { useRouter } from "next/navigation";

const TaskCard = ({ routineId, task }: { routineId: string; task: Task }) => {
    const { handleMoveTask, handleDeleteTask } = useRoutine();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const router = useRouter();

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
    return (
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
                    <small>d: {task.duration}</small>
                    <span className="mx-2 text-xs">|</span>
                    <small>o: {task?.order}</small>
                </section>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <CircleEllipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <Link href={`/${routineId}/${task.id}/edit`}>
                            <DropdownMenuItem className="p-0">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="w-full">
                                    <p className="w-full text-start">Edit</p>
                                </Button>
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                            onClick={() => setIsDeleteOpen(true)}
                            className="p-0">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="w-full">
                                <p className="w-full text-start">Delete</p>
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardContent>
            <Alert
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                onSubmit={async () => {
                    await handleDeleteTask({
                        taskId: task.id,
                    });
                }}
            />
        </Card>
    );
};

export default TaskCard;
