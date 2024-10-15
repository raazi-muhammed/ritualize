import React from "react";
import StartComponent from "./_components/StartComponent";
import { prisma } from "@/lib/prisma";

async function getRoutine(id: string) {
    return await prisma.routine.findFirstOrThrow({
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

async function Start({ params }: { params: { id: string } }) {
    const routine = await getRoutine(params.id);

    return <StartComponent routine={routine} />;
}

export default Start;
