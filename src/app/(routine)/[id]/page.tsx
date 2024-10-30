import React from "react";
import { prisma } from "@/lib/prisma";
import RoutinePage from "./_components/RoutinePage";

async function getRoutine(id: string) {
    return await prisma.routine.findFirst({
        where: {
            id,
        },
        include: {
            tasks: {
                orderBy: {
                    order: "asc",
                },
            },
        },
    });
}

export default async function Page({ params }: { params: { id: string } }) {
    const routine = await getRoutine(params.id);

    return <>{routine && <RoutinePage routine={routine} />}</>;
}
