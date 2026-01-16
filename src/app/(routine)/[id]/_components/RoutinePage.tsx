"use client";

import Tasks from "./Tasks";
import { RoutineWithTasks } from "@/types/entities";
import { useStore } from "@/stores";
import { useTransitionRouter } from "next-view-transitions";

function RoutinePage({ routine }: { routine: RoutineWithTasks }) {
  const { selectedDate } = useStore();
  const router = useTransitionRouter();

  if (!selectedDate) return null;

  return (
    <>
      <section className="gap-4">
        <Tasks date={selectedDate} routine={routine} />
      </section>
    </>
  );
}

export default RoutinePage;
