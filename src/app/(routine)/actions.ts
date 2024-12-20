"use server";

import { prisma } from "@/lib/prisma";
import { Routine } from "@prisma/client";

export const createRoutine = async ({
    name,
    duration,
}: Omit<Routine, "id">) => {
    return await prisma.routine.create({
        data: {
            name,
            duration,
        },
    });
};
export const updateRoutine = async ({
    id,
    name,
    duration,
}: Partial<Routine> & { id: string }) => {
    return await prisma.routine.update({
        where: {
            id,
        },
        data: {
            name,
            duration,
        },
    });
};

export const deleteRoutine = async ({ id }: { id: string }) => {
    await prisma.task.deleteMany({
        where: {
            routine_id: id,
        },
    });
    return await prisma.routine.delete({
        where: {
            id,
        },
    });
};
