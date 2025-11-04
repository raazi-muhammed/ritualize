"use client";

import React, { useState } from "react";
import RoutinePage from "./_components/RoutinePage";
import { useQuery } from "@tanstack/react-query";
import { getRoutineForDate } from "./actions";
import LoadingIndicator from "@/components/layout/LoadingIndicator";
import InfoMessage from "@/components/message/InfoMessage";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/format";

export default function Page({ params }: { params: { id: string } }) {
    const routineId = params.id;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const router = useRouter();
    const {
        data: routine,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["routine", routineId, formatDate(selectedDate)],
        queryFn: () => getRoutineForDate(routineId, selectedDate),
    });

    return (
        <>
            {isLoading ? (
                <LoadingIndicator />
            ) : isError ? (
                <InfoMessage
                    type="error"
                    message="Error loading routine"
                    actions={[
                        <Button
                            key="back"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                router.push("/");
                            }}>
                            Back
                        </Button>,
                    ]}
                />
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
