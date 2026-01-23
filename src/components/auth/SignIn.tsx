"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export function SignIn() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (step === "signIn") {
        await signIn("password", {
          email,
          password,
          flow: "signIn",
          redirectTo: "/",
        });
      } else {
        await signIn("password", {
          email,
          password,
          flow: "signUp",
          redirectTo: "/",
        });
      }
      router.push("/");
    } catch (err) {
      setError("Authentication failed");
      console.error(err);
    }
  };

  return (
    <div className="max-w-sm w-full mx-auto p-4 border rounded-md bg-card">
      <h2 className="text-xl font-bold mb-4">
        {step === "signIn" ? "Sign In" : "Sign Up"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button type="submit" className="w-full">
          {step === "signIn" ? "Sign In" : "Sign Up"}
        </Button>
      </form>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full flex items-center gap-2"
        onClick={() => signIn("google", { redirectTo: "/" })}
      >
        <FcGoogle className="h-5 w-5" />
        Google
      </Button>
      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={() => setStep(step === "signIn" ? "signUp" : "signIn")}
        >
          {step === "signIn"
            ? "Need an account? Sign Up"
            : "Already have an account? Sign In"}
        </Button>
      </div>
    </div>
  );
}
