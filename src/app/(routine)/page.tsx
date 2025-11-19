"use client";

export const dynamic = "force-static";

import { Button } from "@/components/ui/button";
import Heading from "@/components/layout/Heading";
import Link from "next/link";
import { IoAddCircle as AddIcon } from "react-icons/io5";
import { UserButton } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import LoadingIndicator from "@/components/layout/LoadingIndicator";
import RoutineForm, { routineSchema } from "./_forms/RoutineForm";
import { z } from "zod";
import RoutineCard from "./[id]/_components/RoutineCard";
import { useModal } from "@/providers/ModelProvider";
import InfoMessage from "@/components/message/InfoMessage";
import { useStore } from "@/stores";

export default function Home() {
  const { openModal, closeModal } = useModal();
  const { routines, createRoutine, isSyncing } = useStore((state) => state);

  const { mutateAsync } = useMutation({
    mutationFn: createRoutine,
  });

  function onSubmit(values: z.infer<typeof routineSchema>) {
    closeModal();
    mutateAsync(values);
  }

  return (
    <main className="px-5 md:container py-4 min-h-screen bg-background">
      {routines.length === 0 && isSyncing ? (
        <LoadingIndicator />
      ) : (
        <>
          <section className="flex justify-end gap-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                openModal({
                  title: "Add Routine",
                  content: <RoutineForm onSubmit={onSubmit} />,
                });
              }}
            >
              <AddIcon className="-ms-1 me-1" />
              Add
            </Button>
            <UserButton />
          </section>
          <Heading className="my-4">Routines</Heading>
          <section className="flex flex-col gap-4">
            <section className="grid grid-cols-2 gap-4">
              {routines
                ?.filter((r) => r.is_favorite)
                .map((routine) => (
                  <Link href={`/${routine.id}`} key={routine.name}>
                    <RoutineCard isList={true} routine={routine} />
                  </Link>
                ))}
            </section>
            {routines
              ?.filter((r) => !r.is_favorite)
              .map((routine) => (
                <Link href={`/${routine.id}`} key={routine.name}>
                  <RoutineCard routine={routine} />
                </Link>
              ))}
            {routines?.length === 0 && (
              <InfoMessage message="No routines yet" />
            )}
          </section>
        </>
      )}
    </main>
  );
}
