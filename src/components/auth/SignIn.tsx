"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

export function SignIn() {
  const { signIn } = useAuthActions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signIn("google", { redirectTo: "/" });
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-10 px-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/icon.png"
          alt=""
          width={64}
          height={64}
          priority
          className="rounded-2xl"
        />
        <div className="flex flex-col gap-1">
          <h1 className="font-mono text-2xl font-bold">Ritualize</h1>
          <p className="text-sm text-muted-foreground">
            Build routines that stick.
          </p>
        </div>
      </div>
      <Button
        variant="card-outline"
        size="lg"
        className="w-full gap-2"
        disabled={isSubmitting}
        onClick={handleGoogleSignIn}
      >
        <FcGoogle className="size-5" />
        Continue with Google
      </Button>
    </div>
  );
}
