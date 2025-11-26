"use client";

import { ReactNode } from "react";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Heading from "./Heading";

const PageTemplate = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  const router = useRouter();
  return (
    <main className="px-5 container-xl py-4">
      <header className="flex justify-between gap-3">
        <Button onClick={() => router.back()} variant="ghost">
          <ChevronLeft />
        </Button>
      </header>
      <section className="my-4 bg-background">
        <Heading>{title}</Heading>
      </section>

      {children}
    </main>
  );
};

export default PageTemplate;
