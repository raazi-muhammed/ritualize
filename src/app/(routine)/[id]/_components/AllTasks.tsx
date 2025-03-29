import { useQuery } from "@tanstack/react-query";
import { useRoutine } from "../_provider/RoutineProvider";
import { getRoutine } from "../actions";
import TaskCard from "./TaskCard";
import { TaskWithStatus } from "@/types/entities";

const AllTasks = ({
    showStartDate = false,
    date,
}: {
    showStartDate?: boolean;
    date?: Date;
}) => {
    const { routine } = useRoutine(date ?? new Date());

    const { data, isLoading } = useQuery({
        queryKey: ["routine-all", routine.id],
        queryFn: () => getRoutine(routine.id),
    });

    return (
        <section className="mb-16">
            {data?.tasks.length === 0 && (
                <p className="text-center text-muted-foreground mt-4">
                    No tasks yet
                </p>
            )}
            {data?.tasks?.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task as TaskWithStatus}
                    showStartDate={showStartDate}
                    date={date ?? new Date()}
                />
            ))}
        </section>
    );
};

export default AllTasks;
