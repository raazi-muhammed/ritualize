import { EmptyTemplate } from "@/components/layout/EmptyTemplate";
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
        <EmptyTemplate
          title="No tasks yet"
          description="Please add some tasks to get started"
        />
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
