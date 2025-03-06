"use server";

import { prisma } from "@/lib/prisma";

export async function getRoutine(id: string) {
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
