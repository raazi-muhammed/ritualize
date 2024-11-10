import { Routine, Task } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ReactNode, useContext, useOptimistic } from "react";
import { createContext } from "react";
import { deleteTask, moveTo } from "../(tasks)/actions";
import { toast } from "@/components/ui/use-toast";

export const RoutineContext = createContext<{
    tasks: Task[];
    updateTasks?: (action: (state: Task[]) => Task[]) => void;
    routine?: any;
}>({ tasks: [] });

const RoutineProvider = ({
    children,
    routine,
}: {
    children: ReactNode;
    routine: Routine & {
        tasks: Task[];
    };
}) => {
    const [tasks, updateTasks] = useOptimistic<Task[]>(routine.tasks);

    return (
        <RoutineContext.Provider value={{ tasks, updateTasks, routine }}>
            {children}
        </RoutineContext.Provider>
    );
};

export default RoutineProvider;

export const useRoutine = () => {
    const { tasks, routine, updateTasks } = useContext(RoutineContext);

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

    const handleMoveTask = async ({
        moveToTask,
        taskToMoveId,
    }: {
        moveToTask: Task;
        taskToMoveId: string;
    }) => {
        if (!updateTasks) return;

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
        if (!updateTasks) return;
        updateTasks((state) => {
            return state.filter((t) => t.id != taskId);
        });
        await handleDelete({
            id: taskId,
        });
    };

    return { tasks, routine, handleMoveTask, handleDeleteTask };
};
