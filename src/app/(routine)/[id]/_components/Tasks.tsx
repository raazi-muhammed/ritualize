import { useQuery } from "@tanstack/react-query";
import { useRoutine } from "../_provider/RoutineProvider";
import { getRoutineForDate } from "../actions";
import TaskCard from "./TaskCard";
import TasksSkeleton from "./TasksSkeleton";
import InfoMessage from "@/components/message/InfoMessage";
import { TaskWithStatus } from "@/types/entities";
import { DragEvent } from "react";

const Tasks = ({
    showStartDate = false,
    date,
}: {
    showStartDate?: boolean;
    date: Date;
}) => {
    const { routine, showGroupedTasks, handleEditTask } = useRoutine(date);

    const { data, isLoading } = useQuery({
        queryKey: ["routine", routine.id, date],
        queryFn: () => getRoutineForDate(routine.id, date ?? new Date()),
    });

    const groupedTasks = data?.tasks.reduce((acc, task) => {
        const tag = task.tags.join(",") || "Others";
        if (!acc[tag]) {
            acc[tag] = [];
        }
        acc[tag].push(task);
        return acc;
    }, {} as Record<string, TaskWithStatus[]>);

    const handleDrop = async (e: DragEvent<HTMLDivElement>, tags: string[]) => {
        const taskId = e.dataTransfer.getData("taskId");
        const task = data?.tasks.find((task) => task.id === taskId);
        handleEditTask({
            id: taskId,
            name: task?.name || "",
            duration: task?.duration || 0,
            order: task?.order || 0,
            routine_id: task?.routine_id || "",
            frequency: task?.frequency || "daily",
            every_frequency: task?.every_frequency || 1,
            days_in_frequency: task?.days_in_frequency || [],
            start_date: task?.start_date || new Date(),
            end_date: task?.end_date || null,
            tags: tags,
        });
    };

    return (
        <section className="mb-16">
            {isLoading ? (
                <TasksSkeleton />
            ) : (
                <>
                    {showGroupedTasks && groupedTasks ? (
                        Object.entries(groupedTasks).map(([tag, tasks]) => (
                            <div key={tag}>
                                <p
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) =>
                                        handleDrop(e, tag.split(","))
                                    }
                                    className="text-lg font-bold mt-4">
                                    {tag}
                                </p>
                                {tasks.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        showStartDate={showStartDate}
                                        date={date ?? new Date()}
                                    />
                                ))}
                            </div>
                        ))
                    ) : (
                        <>
                            {data?.tasks?.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    showStartDate={showStartDate}
                                    date={date ?? new Date()}
                                />
                            ))}
                        </>
                    )}
                    {data?.tasks.length === 0 && (
                        <InfoMessage message="No tasks yet" />
                    )}
                </>
            )}
        </section>
    );
};

export default Tasks;
