"use client";

export const dynamic = "force-static";

import RoutineCard from "../[id]/_components/RoutineCard";
import RoutineSkeleton from "../_components/RoutineSkeleton";
import ContentStateTemplate from "@/components/layout/ContentStateTemplate";
import { useGetRoutines } from "@/queries/routine.query";
import { EmptyTemplate } from "@/components/layout/EmptyTemplate";

export default function RoutineList() {
  const { data: routines, isLoading } = useGetRoutines();

  return (
    <ContentStateTemplate isLoading={isLoading} skeleton={<RoutineSkeleton />}>
      <section className="flex flex-col gap-4 mb-12">
        <section className="grid grid-cols-2 gap-4">
          {routines
            ?.filter((r) => r.isFavorite)
            .map((routine) => (
              <RoutineCard
                key={routine._id}
                isList={true}
                routine={routine}
              />
            ))}
        </section>
        {routines
          ?.filter((r) => !r.isFavorite)
          .map((routine) => (
            <RoutineCard
              key={routine._id}
              routine={routine}
            />
          ))}
        {routines?.length === 0 && (
          <EmptyTemplate
            title="No routines yet"
            description="Create a routine to get started"
          />
        )}
      </section>
    </ContentStateTemplate>
  );
}
