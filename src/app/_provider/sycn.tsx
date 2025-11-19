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
      <p>{isSyncing ? "Syncing..." : "Synced"}</p>
      {children}
    </div>
  );
}
