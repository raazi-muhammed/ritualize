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
      <div className="fixed bottom-12 left-12 border border-muted px-2 rounded-md">
        <p>{isSyncing ? "Syncing..." : "Synced"}</p>
      </div>
      {children}
    </div>
  );
}
