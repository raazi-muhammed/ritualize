"use client";

export const dynamic = "force-static";

import RoutineCard from "../[id]/_components/RoutineCard";
import InfoMessage from "@/components/message/InfoMessage";
import RoutineSkeleton from "../_components/RoutineSkeleton";
import ContentStateTemplate from "@/components/layout/ContentStateTemplate";
import {
  getRoutine,
  routineKeys,
  useGetRoutines,
} from "@/queries/routine.query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function RoutineList() {
  const { data: routines, isLoading } = useGetRoutines();
  const queryClient = useQueryClient();

  useEffect(() => {
    routines?.forEach((routine) => {
      if (routine.is_favorite) {
        queryClient.prefetchQuery({
          queryKey: routineKeys.detail(routine.id, new Date()),
          queryFn: () => getRoutine(routine.id, new Date()),
        });
      }
    });
  }, [routines, queryClient]);

  return (
    <ContentStateTemplate isLoading={isLoading} skeleton={<RoutineSkeleton />}>
      <section className="flex flex-col gap-4 mb-12">
        <section className="grid grid-cols-2 gap-4">
          {routines
            ?.filter((r) => r.is_favorite)
            .map((routine) => (
              <RoutineCard key={routine.id} isList={true} routine={routine} />
            ))}
        </section>
        {routines
          ?.filter((r) => !r.is_favorite)
          .map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
          ))}
        {routines?.length === 0 && <InfoMessage message="No routines yet" />}
      </section>
    </ContentStateTemplate>
  );
}
