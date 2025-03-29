import { useQuery } from "@tanstack/react-query";
import { useRoutine } from "../_provider/RoutineProvider";
import { getRoutineForDate } from "../actions";
import TaskCard from "./TaskCard";
import { TaskWithStatus } from "@/types/entities";

const Tasks = ({
    showStartDate = false,
    date,
}: {
    showStartDate?: boolean;
    date: Date;
}) => {
    const { routine } = useRoutine(date);

    const { data, isLoading } = useQuery({
        queryKey: ["routine", routine.id, date],
        queryFn: () => getRoutineForDate(routine.id, date),
    });

    return (
        <section className="mb-16">
            {!!data?.tasks.length && (
                <p className="text-center text-muted-foreground mt-4">
                    No tasks yet
                </p>
            )}
            {data?.tasks?.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    showStartDate={showStartDate}
                    date={date}
                />
            ))}
        </section>
    );
};

export default Tasks;
