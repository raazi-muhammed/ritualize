"use client";

import Heading from "@/components/layout/Heading";
import { IoPlayCircle as StartIcon } from "react-icons/io5";
import RoutineHeader from "./RoutineHeader";
import Tasks from "./Tasks";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import StartComponent from "../start/_components/StartComponent";
import { RoutineWithTasks } from "@/types/entities";
import { useStore } from "@/stores";

function RoutinePage({ routine }: { routine: RoutineWithTasks }) {
  const [running, setRunning] = useState(false);
  const { selectedDate } = useStore();

  if (running) {
    return (
      <StartComponent
        routine={routine}
        setRunning={setRunning}
        date={selectedDate}
      />
    );
  }

  return (
    <main className="px-5 container-xl py-4">
      {!!routine && (
        <>
          <RoutineHeader date={selectedDate} routine={routine} />
          <section className="my-4 bg-background">
            <Heading>{routine.name}</Heading>
          </section>
          <section className="gap-4">
            <Tasks date={selectedDate} routine={routine} />
          </section>
          <footer className="fixed bottom-2 left-0 flex w-[100vw] justify-center py-4">
            <Button
              size="lg"
              className="w-fit px-5"
              onClick={() => setRunning(true)}
            >
              <StartIcon size="1.3em" className="-ms-1 me-1" />
              Start
            </Button>
          </footer>
        </>
      )}
    </main>
  );
}

export default RoutinePage;
