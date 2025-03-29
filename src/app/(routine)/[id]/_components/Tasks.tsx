import { useRoutine } from "../_provider/RoutineProvider";
import TaskCard from "./TaskCard";
import { TaskWithStatus } from "@/types/entities";

const Tasks = ({
    tasks,
    showStartDate = false,
    date,
}: {
    tasks: TaskWithStatus[];
    showStartDate?: boolean;
    date: Date;
}) => {
    const { routine } = useRoutine();

    return (
        <section className="mb-16">
            {tasks.length < 1 && (
                <p className="text-center text-muted-foreground mt-4">
                    No tasks yet
                </p>
            )}
            {tasks?.map((task) => (
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
