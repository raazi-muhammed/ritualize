"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";
import ResponsiveModel from "@/components/layout/ResponsiveModel";

interface ModalContextType {
  openModal: ({}: { title: string; content: ReactNode }) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<ReactNode>(null);

  const openModal = useCallback(
    ({ title, content }: { title: string; content: ReactNode }) => {
      setTitle(title);
      setContent(content);
      setOpen(true);
    },
    [],
  );

  const closeModal = useCallback(() => {
    setOpen(false);
    setTitle("");
    setContent(null);
  }, []);

  const value = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      <ResponsiveModel
        open={open}
        setOpen={setOpen}
        title={title}
        content={content}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
