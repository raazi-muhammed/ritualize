"use server";

import { getCurrentUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { Routine } from "@prisma/client";

export const createRoutine = async ({
    name,
    duration,
}: Omit<Routine, "id" | "user_id">) => {
    const user = await getCurrentUser();

    return await prisma.routine.create({
        data: {
            name,
            duration,
            user_id: user.id,
        },
    });
};
export const updateRoutine = async ({
    id,
    name,
    duration,
}: Partial<Routine> & { id: string }) => {
    const user = await getCurrentUser();

    return await prisma.routine.update({
        where: {
            id,
            user_id: user.id,
        },
        data: {
            name,
            duration,
        },
    });
};

export const deleteRoutine = async ({ id }: { id: string }) => {
    const user = await getCurrentUser();
    const [_, routine] = await Promise.all([
        await prisma.task.deleteMany({
            where: {
                routine_id: id,
            },
        }),
        await prisma.routine.delete({
            where: {
                id,
                user_id: user.id,
            },
        }),
    ]);
    return routine;
};
