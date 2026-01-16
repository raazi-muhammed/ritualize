import { EmptyTemplate } from "@/components/layout/EmptyTemplate";
import TaskCard from "./TaskCard";
import { RoutineWithTasks } from "@/types/entities";

const Tasks = ({
  showStartDate = false,
  date,
  routine,
}: {
  showStartDate?: boolean;
  date: Date;
  routine: RoutineWithTasks;
}) => {
  return (
    <section className="mb-36">
      {!routine ? (
        <EmptyTemplate
          title="No tasks yet"
          description="Please add some tasks to get started"
        />
      ) : (
        <>
          {routine?.tasks.length === 0 && (
            <EmptyTemplate
              title="No tasks yet"
              description="Please add some tasks to get started"
            />
          )}
          {routine?.tasks?.map((task) => (
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
