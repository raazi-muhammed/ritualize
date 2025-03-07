"use client";

import Heading from "@/components/layout/Heading";
import Link from "next/link";
import { IoPlayCircle as StartIcon } from "react-icons/io5";
import { Routine, Task } from "@prisma/client";
import RoutineHeader from "./RoutineHeader";
import { useRoutine } from "../_provider/RoutineProvider";
import Tasks from "./Tasks";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function RoutinePage({
    routine: r,
}: {
    routine: Routine & {
        tasks: Task[];
    };
}) {
    const { setRoutine, routine } = useRoutine();
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        setRoutine(() => r);
    }, [r, setRoutine]);

    const getLast7DaysFromSunday = () => {
        const days = [];
        const today = new Date();
        const lastSunday = new Date(today);
        lastSunday.setDate(today.getDate() - today.getDay());

        for (let i = 0; i < 7; i++) {
            const date = new Date(lastSunday);
            date.setDate(lastSunday.getDate() + i);
            days.push(date);
        }
        return days;
    };

    return (
        <main className="container py-4">
            {!!routine && (
                <>
                    <RoutineHeader />
                    <section className="my-4 bg-background py-4">
                        <Heading>{routine.name}</Heading>
                        <div className="flex space-x-2 mt-2">
                            {getLast7DaysFromSunday().map((date, index) => (
                                <Button
                                    key={index}
                                    onClick={() => setSelectedDate(date)}
                                    variant={
                                        selectedDate.toDateString() ===
                                        date.toDateString()
                                            ? "default"
                                            : "ghost"
                                    }>
                                    {date.toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </Button>
                            ))}
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Select a Custom Date:
                            </label>
                            <input
                                type="date"
                                value={selectedDate.toISOString().split("T")[0]}
                                onChange={(e) =>
                                    setSelectedDate(new Date(e.target.value))
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </section>
                    <Tasks selectedDate={selectedDate} />
                    <footer className="fixed bottom-0 left-0 flex w-[100vw] justify-center py-4">
                        <Button size="lg" className="w-fit px-5" asChild>
                            <Link href={`${routine.id}/start`} prefetch={true}>
                                <StartIcon
                                    size="1.3em"
                                    className="-ms-1 me-1"
                                />
                                Start
                            </Link>
                        </Button>
                    </footer>
                </>
            )}
        </main>
    );
}

export default RoutinePage;
