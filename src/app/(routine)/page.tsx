import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Heading from "@/components/layout/Heading";
import { IoPlayCircle as StartIcon } from "react-icons/io5";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { IoAddCircle as AddIcon } from "react-icons/io5";
import { UserButton } from "@clerk/nextjs";

export const dynamic = "auto";

async function getRoutines() {
    return await prisma.routine.findMany();
}

export default async function Home() {
    const routines = await getRoutines();
    return (
        <main className="container min-h-screen pt-4">
            <section className="flex justify-end gap-4">
                <Link href={"/add"}>
                    <Button size="sm" variant="secondary">
                        <AddIcon className="-ms-1 me-1" />
                        Add
                    </Button>
                </Link>
                <UserButton />
            </section>
            <Heading className="my-4">Routines</Heading>
            <section className="flex flex-col gap-4">
                {routines.map((routine) => (
                    <Link href={`/${routine.id}`} key={routine.name}>
                        <Card className="relative -z-0 overflow-hidden border-none">
                            <CardHeader className="z-10 p-4">
                                <CardTitle>{routine.name}</CardTitle>
                                <CardDescription>
                                    {routine.duration} min
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-end p-2">
                                <Link href={`${routine.id}/start`}>
                                    <Button size="sm">
                                        <StartIcon
                                            size="1.3em"
                                            className="-ms-1 me-1"
                                        />
                                        Start
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </section>
        </main>
    );
}
