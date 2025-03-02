"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoPencil as EditIcon } from "react-icons/io5";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronLeft } from "lucide-react";
import { IoAddCircle as AddIcon } from "react-icons/io5";
import { Routine } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { deleteRoutine } from "../../actions";

const RoutineHeader = ({ routine }: { routine: Routine }) => {
    const router = useRouter();

    const { mutateAsync: handleDeleteRoutine } = useMutation({
        mutationFn: deleteRoutine,
        onSuccess: (routine) => {
            toast({
                description: `${routine?.name ?? "Routine"} deleted`,
            });
            router.push("/");
            router.refresh();
        },
    });

    return (
        <header className="flex justify-between gap-3">
            <Link href="/">
                <ChevronLeft />
            </Link>
            <div className="flex gap-3">
                <Button size="sm" variant="secondary" asChild>
                    <Link href={`/${routine.id}/add`}>
                        <AddIcon />
                        Add
                    </Link>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="secondary">
                            <EditIcon size="1.3em" className="-mx-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <Link href={`${routine.id}/edit`}>
                            <DropdownMenuItem className="p-0">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="w-full">
                                    <p className="w-full text-start">Edit</p>
                                </Button>
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                            className="p-0"
                            onClick={() => {
                                handleDeleteRoutine({ id: routine.id });
                            }}>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="w-full">
                                <p className="w-full text-start">Delete</p>
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default RoutineHeader;
