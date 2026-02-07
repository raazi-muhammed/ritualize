import { EmptyTemplate } from "@/components/layout/EmptyTemplate";
import TaskCard from "./TaskCard";
import { TaskWithStatus } from "@/types/entities";
import { useGetRoutine } from "@/queries/routine.query";
import RoutineSkeleton from "../../_components/RoutineSkeleton";

const AllTasks = ({
  showStartDate = false,
  date,
  routineId,
}: {
  showStartDate?: boolean;
  date: Date;
  routineId: string;
}) => {
  const { data: routine, isLoading } = useGetRoutine(routineId, date);

  if (isLoading) return <RoutineSkeleton />;
  if (!routine) return null;

  return (
    <section className="mb-16">
      {routine.tasks.length === 0 && (
        <EmptyTemplate
          title="No tasks yet"
          description="Please add some tasks to get started"
        />
      )}
      {routine.tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task as TaskWithStatus}
          showStartDate={showStartDate}
          date={date}
        />
      ))}
    </section>
  );
};

export default AllTasks;
