"use client";

import { useStore, initializeRoutines } from "@/stores";
import { useEffect } from "react";

export default function Syncing({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isSyncing } = useStore();

  useEffect(() => {
    initializeRoutines();
  }, []);

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-10">
        <div className="mx-auto flex w-fit bg-secondary px-2 rounded-md">
          <p className="text-xs">{isSyncing ? "Syncing..." : "Synced"}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
