"use client";

import React from "react";
import RoutinePage from "./_components/RoutinePage";
import { useQuery } from "@tanstack/react-query";
import { getRoutine } from "./actions";
import LoadingIndicator from "@/components/layout/LoadingIndicator";

export default function Page({ params }: { params: { id: string } }) {
    const routineId = params.id;
    const { data: routine, isLoading } = useQuery({
        queryKey: ["routine", routineId],
        queryFn: () => getRoutine(routineId),
    });

    return (
        <>
            {isLoading ? (
                <LoadingIndicator />
            ) : (
                routine && <RoutinePage routine={routine} />
            )}
        </>
    );
}
