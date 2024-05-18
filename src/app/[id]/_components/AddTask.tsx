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
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { AddTaskForm } from "../_forms/AddTaskForm";
import { IoAddCircle as AddIcon } from "react-icons/io5";
import Heading from "@/components/layout/Heading";
import { Routine } from "@/types/entities";

export function AddTask({ routine }: { routine: Routine }) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const closeForm = () => setOpen(false);

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button size="sm">
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

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button size="sm">
                    <AddIcon size="1.3em" className="-ms-1 me-1" />
                    Add
                </Button>
            </DrawerTrigger>
            <DrawerContent className="min-h-[90vh]">
                <DrawerHeader className="text-left">
                    <Heading>Add task</Heading>
                </DrawerHeader>
                <div className="mx-4 h-full">
                    <AddTaskForm routine={routine} closeForm={closeForm} />
                </div>
                <DrawerFooter className="mt-0 h-fit pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
