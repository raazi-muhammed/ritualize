"use client";

export const dynamic = "force-static";

import RoutinePage from "./_components/RoutinePage";
import InfoMessage from "@/components/message/InfoMessage";
import { useStore } from "@/stores";
import DateSelector from "@/app/_components/DateSelector";

export default function Page({ params }: { params: { id: string } }) {
  const routineId = params.id;
  const routine = useStore((state) => state.getRoutine(routineId));

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
