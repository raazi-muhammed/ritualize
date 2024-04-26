"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AddRoutine } from "./_components/AddRoutine";
import { useAppSelector } from "@/hooks/redux";

export default function Home() {
    const routines = useAppSelector((stat) => stat.routineReducer.routines);
    return (
        <main className="container">
            <section className="mt-4 flex justify-end">
                <AddRoutine />
            </section>
            <h1 style={{ fontFamily: "Bodoni" }} className="text-3xl">
                Routine
            </h1>
            <section className="space-y-4">
                {routines.map((routine) => (
                    <Card>
                        <CardHeader>
                            <CardTitle>{routine.name}</CardTitle>
                            <CardDescription>
                                {routine.duration} min
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-end">
                            <Button size="sm">Start</Button>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </main>
    );
}
("");
