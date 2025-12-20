"use client";

import { useIsFetching } from "@tanstack/react-query";

export default function Syncing({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isSyncing = useIsFetching() > 0;

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-10 transition-all duration-300 pointer-events-none">
        <div
          className={`mx-auto flex w-fit bg-secondary/80 backdrop-blur-sm px-3 py-1 rounded-b-md shadow-sm transition-all duration-300 ${
            isSyncing
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0"
          }`}
        >
          <p className="text-xs font-medium text-foreground">Syncing...</p>
        </div>
      </div>
      {children}
    </div>
  );
}
