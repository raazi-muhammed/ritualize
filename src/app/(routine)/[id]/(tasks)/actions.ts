"use server";

import { prisma } from "@/lib/prisma";
import { Task } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createTask = async ({
    routine_id,
    name,
    duration,
}: Omit<Task, "order" | "id">) => {
    const lastTask = await prisma.task.findFirst({
        where: {
            routine_id,
        },
        orderBy: {
            order: "desc",
        },
    });
    const created = await prisma.task.create({
        data: {
            name,
            routine_id,
            duration,
            order: lastTask?.order ? lastTask?.order + 1 : 1,
        },
    });
    revalidatePath(`/${routine_id}`);
    return created;
};

export const updateTask = async ({
    id,
    routine_id,
    name,
    duration,
    frequency,
}: Partial<Task> & { id: string; routine_id: string }) => {
    const updated = await prisma.task.update({
        where: {
            id,
            routine_id,
        },
        data: {
            name,
            duration,
            frequency,
        },
    });
    revalidatePath(`/${routine_id}`);
    return updated;
};

export const deleteTask = async ({ id }: { id: string }) => {
    return await prisma.task.delete({
        where: {
            id,
        },
    });
};

export const moveTo = async ({
    routine_id,
    move_to,
    task_to_move_id,
}: {
    routine_id: string;
    move_to: Task;
    task_to_move_id: string;
}) => {
    await prisma.task.updateMany({
        where: {
            routine_id: routine_id,
            order: {
                gte: move_to.order,
            },
        },
        data: {
            order: {
                increment: 1,
            },
        },
    });
    await prisma.task.update({
        where: {
            routine_id: routine_id,
            id: task_to_move_id,
        },
        data: {
            order: move_to.order,
        },
    });
    revalidatePath(`/${routine_id}`);
};
