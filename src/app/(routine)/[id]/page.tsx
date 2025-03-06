"use client";

import React from "react";
import RoutinePage from "./_components/RoutinePage";
import { useQuery } from "@tanstack/react-query";
import { getRoutine } from "./actions";

export default function Page({ params }: { params: { id: string } }) {
    const routineId = params.id;
    const { data: routine } = useQuery({
        queryKey: ["routine", routineId],
        queryFn: () => getRoutine(routineId),
    });

    return <>{routine && <RoutinePage routine={routine} />}</>;
}
