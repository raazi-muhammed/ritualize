"use client";

import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  children?: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => any;
  content: ReactNode;
  title: string;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen} modal={false}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="max-h-[calc(100vh-10rem)] overflow-auto sm:rounded-5xl bg-popover border-none shadow-sm"
        >
          <DialogHeader>
            <Heading className="text-2xl">{title}</Heading>
          </DialogHeader>
          {content}
        </DialogContent>
        {children}
      </Dialog>
    );
  return (
    <Drawer open={open} onOpenChange={setOpen} preventScrollRestoration fixed>
      <DrawerContent className="h-[90vh] px-4 sm:px-12 rounded-4xl bg-popover border-none">
        <DrawerHeader className="px-0 py-2">
          <Heading className="text-base font-normal">{title}</Heading>
        </DrawerHeader>
        <div className="h-[calc(100vh-4rem)] overflow-auto pb-12">
          {content}
        </div>
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
