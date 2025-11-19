import TaskCard from "./TaskCard";
import InfoMessage from "@/components/message/InfoMessage";
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
    <section className="mb-16">
      {!routine ? (
        <InfoMessage message="No tasks yet" />
      ) : (
        <>
          {routine?.tasks.length === 0 && (
            <InfoMessage message="No tasks yet" />
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
