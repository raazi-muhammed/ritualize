import { Icon } from "@/components/ui/icon-picker";
import { pageSlideAnimation } from "@/lib/animations";
import { RoutineWithTasks } from "@/types/entities";
import { cn } from "@/lib/utils";
import { useTransitionRouter } from "next-view-transitions";
import Link from "next/link";

const RoutineListRow = ({
  routine,
  isLast,
}: {
  routine: RoutineWithTasks;
  isLast?: boolean;
}) => {
  const router = useTransitionRouter();
  const taskCount = routine.tasks?.length ?? 0;

  return (
    <Link
      href={`/${routine._id}?name=${encodeURIComponent(routine.name)}`}
      onClick={(e) => {
        e.preventDefault();
        router.push(`/${routine._id}?name=${encodeURIComponent(routine.name)}`, {
          onTransitionReady: pageSlideAnimation,
        });
      }}
      className={cn(
        "flex items-center gap-3 px-3 py-3 hover:bg-muted transition-colors",
        !isLast && "border-b border-border"
      )}
    >
      <div className="size-10 shrink-0 grid place-items-center rounded-full bg-secondary shadow-inner shadow-border">
        <Icon name={routine.icon as any} size="1.25rem" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium line-clamp-1">
          {routine.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {taskCount} {taskCount === 1 ? "task" : "tasks"}
        </span>
      </div>
    </Link>
  );
};

export default RoutineListRow;
