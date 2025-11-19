"use client";

import Heading from "@/components/layout/Heading";
import { IoPlayCircle as StartIcon } from "react-icons/io5";
import RoutineHeader from "./RoutineHeader";
import { useRoutine } from "../_provider/RoutineProvider";
import Tasks from "./Tasks";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import StartComponent from "../start/_components/StartComponent";
import { RoutineWithTasks } from "@/types/entities";
import { RoutineTypes } from "@prisma/client";

function RoutinePage({
  routine,
  selectedDate,
  onDateChange,
}: {
  routine: RoutineWithTasks;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}) {
  const [running, setRunning] = useState(false);

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
            {routine.type == RoutineTypes.recurring && (
              <section className="flex mt-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      className={cn(
                        "w-fit justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) onDateChange(new Date(date));
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </section>
            )}
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
