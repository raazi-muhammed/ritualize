import { Task } from "@prisma/client";
import { useRoutine } from "../_provider/RoutineProvider";
import TaskCard from "./TaskCard";
import { showOnCurrentDate } from "@/lib/utils";

const Tasks = ({
    selectedDate,
    tasks,
}: {
    selectedDate: Date;
    tasks: Task[];
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
                <>
                    {showOnCurrentDate(selectedDate, task) && (
                        <TaskCard
                            key={task.id}
                            task={task}
                            routineId={routine.id}
                        />
                    )}
                </>
            ))}
        </section>
    );
};

export default Tasks;
