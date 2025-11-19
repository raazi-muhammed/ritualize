"use client";

import { useStore } from "@/stores";

export default function Syncing({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isSyncing } = useStore();

  return (
    <div>
      <p>{isSyncing ? "Syncing..." : "Synced"}</p>
      {children}
    </div>
  );
}
