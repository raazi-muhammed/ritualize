"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { AddRoutineForm } from "../_forms/AddRoutineFrom";
import { IoAddCircle as AddIcon } from "react-icons/io5";
import Heading from "@/components/layout/Heading";

export function AddRoutine() {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const closeForm = () => setOpen(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="secondary">
                    <AddIcon className="-ms-1 me-1" />
                    Add
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <Heading>Add Routine</Heading>
                </DialogHeader>
                <AddRoutineForm closeForm={closeForm} />
            </DialogContent>
        </Dialog>
    );
}
