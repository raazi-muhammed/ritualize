import { Skeleton } from "@/components/ui/skeleton";

function RoutineSkeleton() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-14 w-96 mt-12" />
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="h-36 w-full" />
      ))}
    </div>
  );
}

export default RoutineSkeleton;
