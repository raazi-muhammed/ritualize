"use client";

import React, { ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTrigger,
} from "@/components/ui/drawer";
import Heading from "./Heading";

const ResponsiveModel = ({
    children,
    open,
    setOpen,
    content,
    title,
}: {
    children: ReactNode;
    open: boolean;
    setOpen: (open: boolean) => any;
    content: ReactNode;
    title: string;
}) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop)
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <Heading>{title}</Heading>
                    </DialogHeader>
                    {content}
                </DialogContent>
                {children}
            </Dialog>
        );
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="h-[calc(100vh-4rem)] px-4 sm:px-12">
                <DrawerHeader className="px-0">
                    <Heading>{title}</Heading>
                </DrawerHeader>
                {content}
            </DrawerContent>
            {children}
        </Drawer>
    );
};

export default ResponsiveModel;

export const ResponsiveModelTrigger = ({
    children,
    asChild = false,
    className,
}: {
    children: ReactNode;
    asChild?: boolean;
    className?: string;
}) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    if (isDesktop)
        return (
            <DialogTrigger className={className} asChild={asChild}>
                {children}
            </DialogTrigger>
        );

    return (
        <DrawerTrigger className={className} asChild={asChild}>
            {children}
        </DrawerTrigger>
    );
};
