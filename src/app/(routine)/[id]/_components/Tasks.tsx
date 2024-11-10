import { useRoutine } from "../_provider/RoutineProvider";
import TaskCard from "./TaskCard";

const Tasks = () => {
    const { tasks, routine } = useRoutine();

    return (
        <section className="mb-16">
            {tasks.length < 1 && <p>No tasks yet</p>}
            {tasks?.map((task) => (
                <TaskCard key={task.id} task={task} routineId={routine.id} />
            ))}
        </section>
    );
};

export default Tasks;
