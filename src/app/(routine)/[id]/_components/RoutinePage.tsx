"use client";

import Heading from "@/components/layout/Heading";
import { IoPlayCircle as StartIcon } from "react-icons/io5";
import { Routine, Task } from "@prisma/client";
import RoutineHeader from "./RoutineHeader";
import { useRoutine } from "../_provider/RoutineProvider";
import Tasks from "./Tasks";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { showOnCurrentDate } from "@/lib/utils";
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

function RoutinePage({
    routine: r,
}: {
    routine: Routine & {
        tasks: Task[];
    };
}) {
    const { setRoutine, routine, tasks } = useRoutine();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [running, setRunning] = useState(false);
    const [mainTasks, setMainTasks] = useState<Task[]>([]);
    const [showWeekSelector, setShowWeekSelector] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 1200px)");

    useEffect(() => {
        setRoutine(() => r);
    }, [r, setRoutine]);

    const getLast7DaysFromSunday = () => {
        const days = [];
        const today = selectedDate;
        const lastSunday = new Date(today);
        lastSunday.setDate(today.getDate() - today.getDay());

        for (let i = 0; i < 7; i++) {
            const date = new Date(lastSunday);
            date.setDate(lastSunday.getDate() + i);
            days.push(date);
        }
        return days;
    };

    useEffect(() => {
        setMainTasks(
            tasks.filter((task) => showOnCurrentDate(selectedDate, task))
        );
    }, [selectedDate, tasks]);

    if (running) {
        return (
            <StartComponent
                routine={routine}
                tasks={mainTasks}
                setRunning={setRunning}
            />
        );
    }

    return (
        <main className="px-6 container-xl py-4">
            {!!routine && (
                <>
                    <RoutineHeader />
                    <section className="my-4 bg-background">
                        <Heading>{routine.name}</Heading>
                        <section className="flex mt-2 gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        size={"sm"}
                                        variant={"outline"}
                                        className={cn(
                                            "w-fit justify-start text-left font-normal",
                                            !selectedDate &&
                                                "text-muted-foreground"
                                        )}>
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
                                            if (date)
                                                setSelectedDate(new Date(date));
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <Toggle
                                pressed={showWeekSelector}
                                onPressedChange={setShowWeekSelector}
                                variant={"outline"}
                                size={"sm"}
                                className="h-8">
                                <ChevronDown />
                            </Toggle>
                        </section>
                        {(showWeekSelector || isDesktop) && (
                            <div className="grid grid-cols-7 mt-4">
                                {getLast7DaysFromSunday().map((date, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => setSelectedDate(date)}
                                        variant={
                                            selectedDate.toDateString() ===
                                            date.toDateString()
                                                ? "default"
                                                : new Date().toDateString() ===
                                                  date.toDateString()
                                                ? "outline"
                                                : "ghost"
                                        }>
                                        <p className="flex flex-col gap-0">
                                            {date.toLocaleDateString("en-US", {
                                                day: "numeric",
                                            })}
                                            <small>
                                                {date.toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        weekday: "short",
                                                    }
                                                )}
                                            </small>
                                        </p>
                                    </Button>
                                ))}
                            </div>
                        )}
                    </section>
                    {isDesktop ? (
                        <section className="gap-4 grid grid-cols-7">
                            {getLast7DaysFromSunday().map((date, index) => (
                                <Tasks
                                    key={index}
                                    tasks={tasks.filter((task) =>
                                        showOnCurrentDate(date, task)
                                    )}
                                />
                            ))}
                        </section>
                    ) : (
                        <section className="gap-4">
                            <Tasks tasks={mainTasks} />
                        </section>
                    )}
                    <footer className="fixed bottom-0 left-0 flex w-[100vw] justify-center py-4">
                        <Button
                            size="lg"
                            className="w-fit px-5"
                            onClick={() => setRunning(true)}>
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
