import TaskCard from "./TaskCard";
import { RoutineWithTasks, TaskWithStatus } from "@/types/entities";

const AllTasks = ({
  showStartDate = false,
  date,
  routine,
}: {
  showStartDate?: boolean;
  date?: Date;
  routine: RoutineWithTasks;
}) => {
  return (
    <section className="mb-16">
      {routine?.tasks.length === 0 && (
        <p className="text-center text-muted-foreground mt-4">No tasks yet</p>
      )}
      {routine?.tasks?.map((task) => (
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
