"use client";

export const dynamic = "force-static";

import RoutinePage from "./_components/RoutinePage";
import InfoMessage from "@/components/message/InfoMessage";
import { useStore } from "@/stores";
import DateSelector from "@/app/_components/DateSelector";
import { useQuery } from "@tanstack/react-query";
import { RoutineWithTasks } from "@/types/entities";
import RoutineSkeleton from "../_components/RoutineSkeleton";

export default function Page({ params }: { params: { id: string } }) {
  const routineId = params.id;
  const { selectedDate } = useStore((state) => state);

  const { data: routine, isFetching } = useQuery({
    queryKey: ["routine", routineId, selectedDate],
    queryFn: async () => {
      const response = await fetch(
        `/api/routines/${routineId}?date=${
          selectedDate ? selectedDate.toISOString() : new Date().toISOString()
        }`
      );
      if (!response.ok) return null;
      return (await response.json()) as RoutineWithTasks;
    },
  });

  if (isFetching) return <RoutineSkeleton />;

  return (
    <>
      {!routine?.id ? (
        <InfoMessage message="Routine not found" />
      ) : (
        <div>
          <RoutinePage routine={routine} />
          <DateSelector />
        </div>
      )}
    </>
  );
}
