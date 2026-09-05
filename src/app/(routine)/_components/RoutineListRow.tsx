import { Icon } from "@/components/ui/icon-picker";
import { pageSlideAnimation } from "@/lib/animations";
import { getRoutineColorClass, getRoutineColorVar } from "@/lib/routine-colors";
import { RoutineWithTaskCount } from "@/types/entities";
import { cn } from "@/lib/utils";
import { useTransitionRouter } from "next-view-transitions";
import Link from "next/link";
import { useParams } from "next/navigation";
import { memo, type CSSProperties } from "react";

const RoutineListRow = ({
  routine,
  isLast,
}: {
  routine: RoutineWithTaskCount;
  isLast?: boolean;
}) => {
  const router = useTransitionRouter();
  const params = useParams<{ id?: string }>();
  const isActive = params?.id === routine._id;
  const taskCount = routine.taskCount ?? 0;

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
        "relative flex items-center gap-3 px-3 py-3 hover:bg-muted/50 transition-colors",
        isActive &&
          "bg-accent/30 before:absolute before:left-0 before:top-1/2 before:h-1/2 before:-translate-y-1/2 before:w-1 before:rounded-full before:bg-[var(--routine-accent)]",
        !isLast &&
          "after:absolute after:inset-x-3 after:bottom-0 after:border-b after:border-border"
      )}
      style={
        isActive
          ? ({
              "--routine-accent": getRoutineColorVar(routine.color),
            } as CSSProperties)
          : undefined
      }
    >
      <div
        className={cn(
          getRoutineColorClass(routine.color),
          "size-8 shrink-0 grid place-items-center rounded-full"
        )}
      >
        <Icon name={routine.icon as any} size="1rem" />
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

export default memo(RoutineListRow);
