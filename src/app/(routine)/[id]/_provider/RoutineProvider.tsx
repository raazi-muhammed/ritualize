"use client";

import { CompletionStatus, Routine, Task } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useContext, useState } from "react";
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
import { RoutineWithTasks, TaskWithStatus } from "@/types/entities";
import { updateRoutine } from "../../actions";
import { uncheckAllTasks } from "../../actions";
export const RoutineContext = createContext<{
    routine?: any;
    setRoutine?: any;
    isPending?: any;
    setIsPending?: any;
}>({});

const RoutineProvider = ({ children }: { children: ReactNode }) => {
    const [routine, setRoutine] = useState<RoutineWithTasks>();

    return (
        <RoutineContext.Provider
            value={{
                routine,
                setRoutine,
            }}>
            {children}
        </RoutineContext.Provider>
    );
};

export default RoutineProvider;

export const useRoutine = (date: Date) => {
    const router = useRouter();
    const { routine, setRoutine } = useContext(RoutineContext);
    const queryClient = useQueryClient();

    const { mutateAsync: deleteTaskMutation } = useMutation({
        mutationFn: deleteTask,
        onMutate: async ({ id }) => {
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
                (old: { tasks: TaskWithStatus[] }) => {
                    return {
                        ...old,
                        tasks: old.tasks.filter((t) => t.id !== id),
                    };
                }
            );

            return { previousQueryData };
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["routine"],
            });
        },
    });

    const { mutateAsync: changeTaskStatusMutation } = useMutation({
        mutationFn: changeTaskStatus,
        onMutate: async ({ status, task_id }) => {
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
                (old: { tasks: TaskWithStatus[] }) => {
                    return {
                        ...old,
                        tasks: old.tasks.map((t) =>
                            t.id === task_id ? { ...t, status } : t
                        ),
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

    const { mutateAsync: moveTaskMutation } = useMutation({
        mutationFn: moveTo,
        onMutate: async ({ task_to_move_id, move_to }) => {
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
                (old: { tasks: TaskWithStatus[] }) => {
                    return {
                        ...old,
                        tasks: old.tasks
                            .map((t) => {
                                if (t.id == task_to_move_id) {
                                    return {
                                        ...t,
                                        order: move_to.order,
                                    };
                                }
                                if (t.order >= move_to.order) {
                                    return {
                                        ...t,
                                        order: t.order + 1,
                                    };
                                }
                                return t;
                            })
                            .toSorted((a, b) => a.order - b.order),
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
    const { mutateAsync: editTaskMutation } = useMutation({
        mutationFn: updateTask,
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
                (old: { tasks: TaskWithStatus[] }) => {
                    return {
                        ...old,
                        tasks: old.tasks.map((t) =>
                            t.id === task.id ? task : t
                        ),
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

    const { mutateAsync: addTaskMutation } = useMutation({
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

    const { mutateAsync: editRoutineMutation } = useMutation({
        mutationFn: updateRoutine,
        onMutate: async (routine) => {
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
                    return { ...old, ...routine };
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

    const { mutateAsync: uncheckAllTasksMutation } = useMutation({
        mutationFn: uncheckAllTasks,
        onMutate: async () => {
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
                        tasks: old.tasks.map((t) => ({
                            ...t,
                            status: CompletionStatus.skipped,
                        })),
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

    const handleMoveTask = async ({
        moveToTask,
        taskToMoveId,
    }: {
        moveToTask: Task;
        taskToMoveId: string;
    }) => {
        moveTaskMutation({
            task_to_move_id: taskToMoveId,
            move_to: moveToTask,
            routine_id: routine.id,
        });
    };

    const handleDeleteTask = async ({ taskId }: { taskId: string }) => {
        deleteTaskMutation({
            id: taskId,
        });
    };

    const handleAddTask = async (task: Omit<Task, "id" | "order">) => {
        addTaskMutation(task);
    };
    const handleEditTask = async (task: Task) => {
        editTaskMutation(task);
    };

    const handleEditRoutine = async (r: Omit<Routine, "id" | "user_id">) => {
        editRoutineMutation({
            id: routine.id,
            ...r,
        });
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
        changeTaskStatusMutation({
            task_id: taskId,
            status,
            date,
            routine_id: routine.id,
        });
    };

    const handleUncheckAllTasks = async () => {
        uncheckAllTasksMutation({
            routineId: routine.id,
            date,
        });
    };

    return {
        routine,
        setRoutine,
        handleMoveTask,
        handleDeleteTask,
        handleEditTask,
        handleAddTask,
        handleEditRoutine,
        handleChangeTaskStatus,
        handleUncheckAllTasks,
    };
};
