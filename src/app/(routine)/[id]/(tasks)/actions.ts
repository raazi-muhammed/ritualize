"use server";

import { prisma } from "@/lib/prisma";
import { Task } from "@prisma/client";

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
    return await prisma.task.create({
        data: {
            name,
            routine_id,
            duration,
            order: lastTask?.order ? lastTask?.order + 1 : 1,
        },
    });
};

export const updateTask = async ({
    id,
    routine_id,
    name,
    duration,
    frequency,
}: Partial<Task> & { id: string; routine_id: string }) => {
    return await prisma.task.update({
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
};
