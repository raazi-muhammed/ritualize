import { Task } from "@prisma/client";
import { useRoutine } from "../_provider/RoutineProvider";
import TaskCard from "./TaskCard";

const Tasks = ({ selectedDate }: { selectedDate: Date }) => {
    const { tasks, routine } = useRoutine();

    function shouldShowTaskToday(
        currentDate: Date,
        startDate: Date,
        frequency: "daily" | "weekly" | "monthly",
        everyFrequency: number,
        daysInFrequency?: number[]
    ): boolean {
        const start = new Date(startDate);
        const current = new Date(currentDate);

        // Normalize time to midnight for date-only comparison
        start.setHours(0, 0, 0, 0);
        current.setHours(0, 0, 0, 0);

        if (start > current) return false;

        const diffInDays = Math.floor(
            (current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (frequency === "daily") {
            return diffInDays % everyFrequency === 0;
        }

        if (frequency === "weekly") {
            const startWeekDay = start.getDay(); // 0 (Sunday) to 6 (Saturday)
            const currentWeekDay = current.getDay();

            if (!daysInFrequency || daysInFrequency.length === 0) return false;

            return (
                diffInDays % (everyFrequency * 7) < 7 && // Within a valid week cycle
                daysInFrequency.includes(currentWeekDay)
            );
        }

        if (frequency === "monthly") {
            const startDay = start.getDate();
            const currentDay = current.getDate();
            const monthsDiff =
                (current.getFullYear() - start.getFullYear()) * 12 +
                (current.getMonth() - start.getMonth());

            return (
                monthsDiff % everyFrequency === 0 &&
                (!daysInFrequency || daysInFrequency.includes(currentDay))
            );
        }

        return false;
    }

    const showOnCurrentDate = (task: Task) => {
        return shouldShowTaskToday(
            selectedDate,
            task.start_date,
            task.frequency,
            task.every_frequency,
            task.days_in_frequency
        );
    };

    return (
        <section className="mb-16">
            {tasks.length < 1 && <p>No tasks yet</p>}
            {tasks?.map((task) => (
                <>
                    {showOnCurrentDate(task) && (
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
