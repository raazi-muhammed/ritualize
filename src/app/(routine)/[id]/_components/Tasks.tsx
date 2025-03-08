import { Task } from "@prisma/client";
import { useRoutine } from "../_provider/RoutineProvider";
import TaskCard from "./TaskCard";

const Tasks = ({
    tasks,
    showStartDate = false,
}: {
    tasks: Task[];
    showStartDate?: boolean;
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
                    routineId={routine.id}
                    showStartDate={showStartDate}
                />
            ))}
        </section>
    );
};

export default Tasks;
