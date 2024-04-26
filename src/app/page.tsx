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
        <main className="container bg-gradient-to-tl from-[#0B0B0B] to-[#231705] min-h-screen pt-4">
            <section className="flex justify-end">
                <AddRoutine />
            </section>
            <h1 style={{ fontFamily: "Bodoni" }} className="text-3xl">
                Routine
            </h1>
            <section className="space-y-4">
                {routines.map((routine) => (
                    <Card
                        className="relative overflow-hidden -z-0"
                        /* style={{
                            backgroundImage: `url(${routine.cover})`,
                            backgroundSize: "cover",
                        }} */
                    >
                        <img
                            className="absolute inset-0 opacity-50 -z-10 blur-sm"
                            src={routine.cover}
                            alt=""
                        />
                        <CardHeader className="z-10">
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
