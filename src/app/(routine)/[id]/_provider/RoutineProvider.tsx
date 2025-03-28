"use client";

import { CompletionStatus, Routine, Task } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ReactNode, useContext, useOptimistic, useState } from "react";
import { createContext } from "react";
import {
    changeTaskStatus,
    createTask,
    deleteTask,
    moveTo,
    updateTask,
} from "../(tasks)/actions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { updateRoutine } from "../../actions";

export const RoutineContext = createContext<{
    tasks: Task[];
    updateTasks?: (action: (state: Task[]) => Task[]) => void;
    routine?: any;
    setRoutine?: any;
    isPending?: any;
    setIsPending?: any;
}>({ tasks: [] });

const RoutineProvider = ({ children }: { children: ReactNode }) => {
    const [routine, setRoutine] = useState({ tasks: [] });
    const [tasks, updateTasks] = useOptimistic<Task[]>(routine?.tasks || []);

    return (
        <RoutineContext.Provider
            value={{
                tasks,
                updateTasks,
                routine,
                setRoutine,
            }}>
            {children}
        </RoutineContext.Provider>
    );
};

export default RoutineProvider;

export const useRoutine = () => {
    const router = useRouter();
    const { tasks, routine, updateTasks, setRoutine } =
        useContext(RoutineContext);

    const { mutateAsync: handleDelete } = useMutation({
        mutationFn: deleteTask,
        onSuccess: (task) => {
            toast({
                description: `${task?.name ?? "Task"} deleted`,
            });
        },
    });

    const { mutateAsync: handleMoveTo } = useMutation({
        mutationFn: moveTo,
    });

    const { mutateAsync: addTask } = useMutation({
        mutationFn: createTask,
        onSuccess: (task) => {
            toast({
                description: `${task?.name ?? "Task"} created`,
            });
            router.push(`/${task.routine_id}`);
        },
    });

    const handleMoveTask = async ({
        moveToTask,
        taskToMoveId,
    }: {
        moveToTask: Task;
        taskToMoveId: string;
    }) => {
        if (!updateTasks) return alert("No updated function");

        updateTasks((state) => {
            const updated = state.map((t) => {
                if (t.id == taskToMoveId) {
                    return {
                        ...t,
                        order: moveToTask.order,
                    };
                }
                if (t.order >= moveToTask.order) {
                    return {
                        ...t,
                        order: t.order + 1,
                    };
                }
                return t;
            });
            return updated.toSorted((a, b) => a.order - b.order);
        });
        await handleMoveTo({
            routine_id: routine.id,
            move_to: moveToTask,
            task_to_move_id: taskToMoveId,
        });
    };

    const handleDeleteTask = async ({ taskId }: { taskId: string }) => {
        if (!updateTasks) return alert("No updated function");
        updateTasks((state) => {
            return state.filter((t) => t.id != taskId);
        });
        await handleDelete({
            id: taskId,
        });
    };

    const handleAddTask = async (task: Omit<Task, "id" | "order">) => {
        if (!updateTasks) return alert("No updated function");
        updateTasks((state) => [
            ...state,
            {
                order: (tasks?.[tasks?.length - 1]?.order || 1000) + 1,
                id: "",
                ...task,
            },
        ]);
        await addTask(task);
    };
    const handleEditTask = async (task: Task) => {
        if (!updateTasks) return alert("No updated function");
        updateTasks((state) => {
            return state.map((t) => {
                if (t.id == task.id) {
                    return {
                        ...t,
                        ...task,
                    };
                }
                return t;
            });
        });

        await updateTask(task);
    };

    const handleEditRoutine = async (r: Omit<Routine, "id" | "user_id">) => {
        setRoutine(() => ({ ...routine, ...r }));
        await updateRoutine({ id: routine.id, ...r });
    };

    const handleChangeTaskStatus = async ({
        taskId,
        date,
        status,
    }: {
        taskId: string;
        date?: Date;
        status: CompletionStatus;
    }) => {
        await changeTaskStatus({
            task_id: taskId,
            routine_id: routine.id,
            date,
            status,
        });
    };

    return {
        tasks,
        routine,
        handleMoveTask,
        handleDeleteTask,
        handleEditTask,
        setRoutine,
        updateTasks,
        handleAddTask,
        handleEditRoutine,
        handleChangeTaskStatus,
    };
};
