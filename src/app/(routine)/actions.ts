"use server";

import { getCurrentUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { Routine } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createRoutine = async ({
    name,
    duration,
}: Omit<Routine, "id" | "user_id">) => {
    const user = await getCurrentUser();

    const created = await prisma.routine.create({
        data: {
            name,
            duration,
            user_id: user.id,
        },
    });
    revalidatePath("/");
    return created;
};
export const updateRoutine = async ({
    id,
    ...data
}: Partial<Routine> & { id: string }) => {
    const user = await getCurrentUser();

    const updated = await prisma.routine.update({
        where: {
            id,
            user_id: user.id,
        },
        data: data,
    });
    revalidatePath("/");
    return updated;
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
    revalidatePath("/");
    return routine;
};

export async function getRoutines() {
    const user = await getCurrentUser();

    return await prisma.routine.findMany({
        where: {
            user_id: user.id,
        },
        orderBy: {
            is_favorite: "desc",
        },
    });
}
