import { Skeleton } from "@/components/ui/skeleton";

const TaskSkeleton = () => {
    return (
        <div className="p-4 border rounded-lg mb-4">
            <Skeleton className="h-4 w-full mb-2" />
            <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
            </div>
        </div>
    );
};
const TasksSkeleton = () => {
    return (
        <>
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
            <TaskSkeleton />
        </>
    );
};

export default TasksSkeleton;
