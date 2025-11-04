import { useQuery } from "@tanstack/react-query";
import { useRoutine } from "../_provider/RoutineProvider";
import { getRoutineForDate } from "../actions";
import TaskCard from "./TaskCard";
import TasksSkeleton from "./TasksSkeleton";
import InfoMessage from "@/components/message/InfoMessage";
import { formatDate } from "@/lib/format";

const Tasks = ({
    showStartDate = false,
    date,
}: {
    showStartDate?: boolean;
    date: Date;
}) => {
    const { routine } = useRoutine(date);

    const { data, isLoading } = useQuery({
        queryKey: ["routine", routine.id, formatDate(date)],
        queryFn: () => getRoutineForDate(routine.id, date ?? new Date()),
    });

    return (
        <section className="mb-16">
            {isLoading ? (
                <TasksSkeleton />
            ) : (
                <>
                    {data?.tasks.length === 0 && (
                        <InfoMessage message="No tasks yet" />
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
