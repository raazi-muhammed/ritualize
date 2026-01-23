"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignIn } from "./SignIn";
import { ReactNode } from "react";

export function AuthWrapper({
  children,
  model,
}: {
  children: ReactNode;
  model: ReactNode;
}) {
  return (
    <>
      <Unauthenticated>
        <div className="grid place-items-center h-[100svh]">
          <SignIn />
        </div>
      </Unauthenticated>
      <Authenticated>
        {children}
        {model}
      </Authenticated>
      <AuthLoading>
        {/* Optional: Add a loading state */}
        <div className="grid place-items-center h-[100svh]">Loading...</div>
      </AuthLoading>
    </>
  );
}
