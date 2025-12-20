"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface AlertContextType {
  openAlert: ({}: {
    title: string;
    description: string;
    onConfirm: () => void;
  }) => void;
  closeAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});

  const openAlert = ({
    title,
    description,
    onConfirm,
  }: {
    title: string;
    description: string;
    onConfirm: () => void;
  }) => {
    setTitle(title);
    setDescription(description);
    setOnConfirm(() => onConfirm);
    setOpen(true);
  };

  const closeAlert = () => {
    setOpen(false);
    setTitle("");
    setDescription("");
    setOnConfirm(() => () => {});
  };

  return (
    <AlertContext.Provider value={{ openAlert, closeAlert }}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeAlert}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                onConfirm();
                closeAlert();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
