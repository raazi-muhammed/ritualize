"use client";

import React, { ReactNode } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Heading from "./Heading";
import { X } from "lucide-react";
import ButtonTemplate from "./ButtonTemplate";

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
          className="max-h-[calc(100vh-10rem)] overflow-auto sm:rounded-5xl bg-popover border-none shadow-sm p-3 pt-1"
        >
          <DialogHeader className="flex flex-row justify-between items-center">
            <Heading className="text-2xl mt-2 ms-3">{title}</Heading>
            <DialogClose className="mb-auto mt-0">
              <ButtonTemplate
                icon="X"
                onClick={() => {}}
                variant="secondaryNoOutline"
              />
            </DialogClose>
          </DialogHeader>
          {content}
        </DialogContent>
        {children}
      </Dialog>
    );
  return (
    <Drawer open={open} onOpenChange={setOpen} preventScrollRestoration fixed>
      <DrawerContent className="h-[95vh] px-4 sm:px-12 rounded-4xl bg-popover border-none">
        <DrawerHeader className="px-0 py-2 flex flex-row justify-between items-center">
          <Heading className="text-2xl text-start ms-3">{title}</Heading>
          <DrawerClose>
            <ButtonTemplate
              icon="X"
              onClick={() => {}}
              variant="secondaryNoOutline"
            />
          </DrawerClose>
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
