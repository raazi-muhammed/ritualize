"use client";

export const dynamic = 'force-static';

import { useState } from "react";
import RoutinePage from "./_components/RoutinePage";
import InfoMessage from "@/components/message/InfoMessage";
import { useStore } from "@/stores";

export default function Page({ params }: { params: { id: string } }) {
  const routineId = params.id;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const routine = useStore((state) => state.getRoutine(routineId));

  return (
    <>
      {!routine?.id ? (
        <InfoMessage message="Routine not found" />
      ) : (
        <div>
          <RoutinePage
            routine={routine}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
      )}
    </>
  );
}
