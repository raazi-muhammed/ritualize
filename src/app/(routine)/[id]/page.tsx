import Heading from "@/components/layout/Heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import {
    IoPencil as EditIcon,
    IoPlayCircle as StartIcon,
} from "react-icons/io5";
import { redirect } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { IoAddCircle as AddIcon } from "react-icons/io5";
import { revalidatePath } from "next/cache";

async function getRoutine(id: string) {
    return await prisma.routine.findFirst({
        where: {
            id,
        },
        include: {
            tasks: {
                orderBy: {
                    order: "asc",
                },
            },
        },
    });
}

export default async function Page({ params }: { params: { id: string } }) {
    const routine = await getRoutine(params.id);

    async function deleteRoutine() {
        "use server";
        await prisma.task.deleteMany({
            where: {
                routineId: params.id,
            },
        });
        await prisma.routine.delete({
            where: {
                id: params.id,
            },
        });
        revalidatePath(`${params.id}`);
        redirect("/");
    }

    async function deleteTask(formData: FormData) {
        "use server";
        await prisma.task.delete({
            where: {
                id: formData.get("id") as string,
            },
        });
        revalidatePath(`${params.id}`);
    }

    async function moveUp(formData: FormData) {
        "use server";
        const id = formData.get("id") as string;
        const order = Number(formData.get("order"));

        const toReplace = await prisma.task.findFirst({
            where: {
                routineId: params.id,
                order: { lt: order },
            },
            orderBy: {
                order: "desc",
            },
        });

        if (toReplace) {
            await prisma.task.update({
                where: {
                    id,
                },
                data: {
                    order: toReplace.order,
                },
            });
            await prisma.task.update({
                where: {
                    id: toReplace.id,
                },
                data: {
                    order,
                },
            });
        }
        revalidatePath(`${params.id}`);
    }

    async function moveDown(formData: FormData) {
        "use server";
        const id = formData.get("id") as string;
        const order = Number(formData.get("order"));

        const toReplace = await prisma.task.findFirst({
            where: {
                routineId: params.id,
                order: { gt: order },
            },
            orderBy: {
                order: "asc",
            },
        });

        if (toReplace) {
            await prisma.task.update({
                where: {
                    id,
                },
                data: {
                    order: toReplace.order,
                },
            });
            await prisma.task.update({
                where: {
                    id: toReplace.id,
                },
                data: {
                    order,
                },
            });
        }
        revalidatePath(`${params.id}`);
    }

    return (
        <main className="container py-4">
            <header className="flex justify-between gap-3">
                <Link href="/">
                    <ChevronLeft />
                </Link>
                <div className="flex gap-3">
                    <Link href={`${params.id}/add`}>
                        <Button size="sm" variant="secondary">
                            <AddIcon />
                            Add
                        </Button>
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="secondary">
                                <EditIcon size="1.3em" className="-mx-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link href={`${params.id}/edit`}>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                            </Link>
                            <form action={deleteRoutine}>
                                <DropdownMenuItem asChild>
                                    <Button>Delete</Button>
                                </DropdownMenuItem>
                            </form>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            {!!routine && (
                <>
                    <section className="my-4 bg-background py-4">
                        <Heading>{routine.name}</Heading>
                    </section>
                    <section className="mb-16 space-y-2">
                        {routine?.tasks.length < 1 && <p>No tasks yet</p>}
                        {routine?.tasks?.map((task, index) => (
                            <Card key={task.name}>
                                <CardContent className="flex justify-between p-4">
                                    <section>
                                        <p>{task.name}</p>
                                        <small>d: {task.duration}</small>
                                        <span className="mx-2 text-xs">|</span>
                                        <small>o: {task?.order}</small>
                                    </section>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            ...
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <form action={moveUp}>
                                                <input
                                                    name="id"
                                                    className="hidden"
                                                    value={task.id}
                                                />
                                                <input
                                                    name="order"
                                                    className="hidden"
                                                    value={task.order}
                                                />
                                                <DropdownMenuItem asChild>
                                                    <Button className="w-full">
                                                        Move up
                                                    </Button>
                                                </DropdownMenuItem>
                                            </form>
                                            <form action={moveDown}>
                                                <input
                                                    name="id"
                                                    className="hidden"
                                                    value={task.id}
                                                />
                                                <input
                                                    name="order"
                                                    className="hidden"
                                                    value={task.order}
                                                />
                                                <DropdownMenuItem asChild>
                                                    <Button className="w-full">
                                                        Move down
                                                    </Button>
                                                </DropdownMenuItem>
                                            </form>
                                            <Link
                                                href={`/${params.id}/${task.id}/edit`}>
                                                <DropdownMenuItem>
                                                    Edit
                                                </DropdownMenuItem>
                                            </Link>
                                            <form action={deleteTask}>
                                                <input
                                                    name="id"
                                                    className="hidden"
                                                    value={task.id}
                                                />
                                                <DropdownMenuItem asChild>
                                                    <Button className="w-full">
                                                        Delete
                                                    </Button>
                                                </DropdownMenuItem>
                                            </form>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardContent>
                            </Card>
                        ))}
                    </section>
                    <footer className="fixed bottom-0 left-0 flex w-[100vw] justify-center py-4">
                        <Link href={`${routine.id}/start`}>
                            <Button size="lg" className="w-fit px-5">
                                <StartIcon
                                    size="1.3em"
                                    className="-ms-1 me-1"
                                />
                                Start
                            </Button>
                        </Link>
                    </footer>
                </>
            )}
        </main>
    );
}
