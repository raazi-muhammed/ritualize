"use client";

import { IoPlayCircle as StartIcon } from "react-icons/io5";
import Tasks from "./Tasks";
import { Button } from "@/components/ui/button";
import { RoutineWithTasks } from "@/types/entities";
import { useStore } from "@/stores";
import { useTransitionRouter } from "next-view-transitions";
import { pageSlideAnimation } from "@/lib/animations";

function RoutinePage({ routine }: { routine: RoutineWithTasks }) {
  const { selectedDate } = useStore();
  const router = useTransitionRouter();

  if (!selectedDate) return null;

  return (
    <>
      <section className="gap-4">
        <Tasks date={selectedDate} routine={routine} />
      </section>
      <footer className="fixed bottom-20 left-0 flex w-[100vw] justify-center py-4">
        <Button
          size="lg"
          className="w-fit px-5"
          onClick={() => {
            router.push(`/${routine.id}/start`, {
              onTransitionReady: pageSlideAnimation,
            });
          }}
        >
          <StartIcon size="1.3em" className="-ms-1 me-1" />
          Start
        </Button>
      </footer>
    </>
  );
}

export default RoutinePage;
