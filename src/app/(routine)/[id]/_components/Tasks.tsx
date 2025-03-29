import { useQuery } from "@tanstack/react-query";
import { useRoutine } from "../_provider/RoutineProvider";
import { getRoutineForDate } from "../actions";
import TaskCard from "./TaskCard";
import TasksSkeleton from "./TasksSkeleton";

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
        queryFn: () => getRoutineForDate(routine.id, date ?? new Date()),
    });

    return (
        <section className="mb-16">
            {isLoading ? (
                <TasksSkeleton />
            ) : (
                <>
                    {data?.tasks.length === 0 && (
                        <p className="text-center text-muted-foreground mt-4">
                            No tasks yet
                        </p>
                    )}
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
        </section>
    );
};

export default Tasks;
