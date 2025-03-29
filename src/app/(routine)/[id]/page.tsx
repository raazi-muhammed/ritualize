"use client";

import React, { useState } from "react";
import RoutinePage from "./_components/RoutinePage";
import { useQuery } from "@tanstack/react-query";
import { getRoutineForDate } from "./actions";
import LoadingIndicator from "@/components/layout/LoadingIndicator";

export default function Page({ params }: { params: { id: string } }) {
    const routineId = params.id;
    const [selectedDate, setSelectedDate] = useState(new Date());

    const { data: routine, isLoading } = useQuery({
        queryKey: ["routine", routineId, selectedDate],
        queryFn: () => getRoutineForDate(routineId, selectedDate),
    });

    return (
        <>
            {isLoading ? (
                <LoadingIndicator />
            ) : (
                routine && (
                    <RoutinePage
                        routine={routine}
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                    />
                )
            )}
        </>
    );
}
