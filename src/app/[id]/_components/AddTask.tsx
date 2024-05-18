"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { AddTaskForm } from "../_forms/AddTaskForm";
import { IoAddCircle as AddIcon } from "react-icons/io5";
import Heading from "@/components/layout/Heading";
import { Routine } from "@/types/entities";

export function AddTask({ routine }: { routine: Routine }) {
    const [open, setOpen] = React.useState(false);
    const closeForm = () => setOpen(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="secondary">
                    <AddIcon />
                    Add
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <Heading>Add task</Heading>
                </DialogHeader>
                <AddTaskForm routine={routine} closeForm={closeForm} />
            </DialogContent>
        </Dialog>
    );
}
