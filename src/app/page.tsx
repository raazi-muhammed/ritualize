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
import Heading from "@/components/layout/Heading";
import { IoPlayCircle } from "react-icons/io5";

export default function Home() {
    const routines = useAppSelector((stat) => stat.routineReducer.routines);
    return (
        <main className="container min-h-screen bg-gradient-to-tl from-[#0B0B0B] to-[#231705] pt-4">
            <section className="flex justify-end">
                <AddRoutine />
            </section>
            <Heading className="my-4">Routines</Heading>
            <section className="space-y-4">
                {routines.map((routine) => (
                    <Card className="relative -z-0 overflow-hidden border-none">
                        <img
                            className="absolute inset-0 -z-10 scale-105 opacity-50 blur-sm"
                            src={routine.cover}
                            alt=""
                        />
                        <CardHeader className="z-10 p-4">
                            <CardTitle>{routine.name}</CardTitle>
                            <CardDescription>
                                {routine.duration} min
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-end p-2">
                            <Button size="sm">
                                <IoPlayCircle
                                    size="1.3em"
                                    className="-ms-1 me-1"
                                />
                                Start
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </main>
    );
}
("");
