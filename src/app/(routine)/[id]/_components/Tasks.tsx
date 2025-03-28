import { CompletionStatus, Task } from "@prisma/client";
import { useRoutine } from "../_provider/RoutineProvider";
import TaskCard from "./TaskCard";
import { useQuery } from "@tanstack/react-query";
import { getTaskCompletions } from "@/app/(routine)/[id]/(tasks)/actions";

const Tasks = ({
    tasks,
    showStartDate = false,
    date,
}: {
    tasks: Task[];
    showStartDate?: boolean;
    date: Date;
}) => {
    const { routine } = useRoutine();
    const { data: taskCompletions } = useQuery({
        queryKey: ["taskCompletions", routine.id, date],
        queryFn: () => getTaskCompletions(routine.id, date),
    });

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
                    date={date}
                    status={
                        taskCompletions?.find(
                            (completion) => completion.task_id === task.id
                        )?.status ?? CompletionStatus.skipped
                    }
                />
            ))}
        </section>
    );
};

export default Tasks;
