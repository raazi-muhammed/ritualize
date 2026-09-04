"use client";

import RoutineCard from "../[id]/_components/RoutineCard";
import RoutineListRow from "./RoutineListRow";
import RoutineSkeleton from "../_components/RoutineSkeleton";
import ContentStateTemplate from "@/components/layout/ContentStateTemplate";
import { useGetRoutines } from "@/queries/routine.query";
import { EmptyTemplate } from "@/components/layout/EmptyTemplate";
import { RoutineWithTaskCount } from "@/types/entities";

function RoutineListSection({
  routines,
}: {
  routines: RoutineWithTaskCount[];
}) {
  if (routines.length === 0) return null;

  return (
    <div className="rounded-lg bg-card overflow-hidden">
      {routines.map((routine, index) => (
        <RoutineListRow
          key={routine._id}
          routine={routine}
          isLast={index === routines.length - 1}
        />
      ))}
    </div>
  );
}

function RoutineGroup({
  title,
  routines,
}: {
  title: string;
  routines: RoutineWithTaskCount[];
}) {
  if (routines.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground px-1">
        {title}
      </p>
      <RoutineListSection routines={routines} />
    </div>
  );
}

export default function RoutineList({
  variant = "grid",
}: {
  variant?: "grid" | "grouped";
}) {
  const { data: routines, isLoading } = useGetRoutines();

  if (variant === "grouped") {
    const favorites = routines?.filter((r) => r.isFavorite) ?? [];
    const others = routines?.filter((r) => !r.isFavorite) ?? [];

    return (
      <ContentStateTemplate isLoading={isLoading} skeleton={<RoutineSkeleton />}>
        <section className="flex flex-col gap-6 mb-12">
          <RoutineGroup title="Favorites" routines={favorites} />
          <RoutineGroup title="Routines" routines={others} />
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

  const favorites = routines?.filter((r) => r.isFavorite) ?? [];
  const others = routines?.filter((r) => !r.isFavorite) ?? [];

  return (
    <ContentStateTemplate isLoading={isLoading} skeleton={<RoutineSkeleton />}>
      <section className="flex flex-col gap-4 mb-12">
        <section className="grid grid-cols-2 gap-4">
          {favorites.map((routine) => (
            <RoutineCard key={routine._id} isList={true} routine={routine} />
          ))}
        </section>
        <RoutineListSection routines={others} />
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
