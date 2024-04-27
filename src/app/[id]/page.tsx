"use client";

import Heading from "@/components/layout/Heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/hooks/redux";
import Link from "next/link";
import React from "react";
import {
    IoPencil as EditIcon,
    IoPlayCircle as StartIcon,
    IoAddCircle as AddIcon,
} from "react-icons/io5";

export default function page() {
    const routine = useAppSelector((state) => state.routineReducer.routines[0]);

    return (
        <main className="container py-4">
            <header className="flex justify-end gap-3">
                <Button size="sm">
                    <AddIcon size="1.3em" className="-ms-1 me-1" />
                    Add
                </Button>
                <Button size="sm">
                    <EditIcon size="1.3em" className="-mx-1" />
                </Button>
            </header>
            {!!routine && (
                <>
                    <section className="my-4">
                        <Heading>{routine.name}</Heading>
                    </section>
                    <section className="space-y-2">
                        {routine.tasks.map((task) => (
                            <Card>
                                <CardContent className="p-4">
                                    <p>{task.name}</p>
                                    <small>{task.duration}</small>
                                </CardContent>
                            </Card>
                        ))}
                    </section>
                </>
            )}
            <footer className="fixed bottom-0 left-0 flex w-[100vw] justify-center py-4">
                <Link href={`${routine.name}/start`}>
                    <Button size="sm">
                        <StartIcon size="1.3em" className="-ms-1 me-1" />
                        Start
                    </Button>
                </Link>
            </footer>
        </main>
    );
}
