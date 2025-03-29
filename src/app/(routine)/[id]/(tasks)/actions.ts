"use server";

import { prisma } from "@/lib/prisma";
import { CompletionStatus, Task } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createTask = async ({
    routine_id,
    name,
    duration,
    frequency,
    every_frequency,
    days_in_frequency,
    start_date,
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
            frequency,
            every_frequency,
            days_in_frequency,
            start_date,
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
    every_frequency,
    days_in_frequency,
    start_date,
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
            every_frequency,
            days_in_frequency,
            start_date,
        },
    });
    revalidatePath(`/${routine_id}`);
    return updated;
};

export const deleteTask = async ({ id }: { id: string }) => {
    await prisma.taskCompletion.deleteMany({
        where: {
            task_id: id,
        },
    });

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

export const changeTaskStatus = async ({
    task_id,
    routine_id,
    date,
    status,
}: {
    task_id: string;
    routine_id: string;
    date?: Date;
    status: CompletionStatus;
}) => {
    const newDate = date
        ? new Date(date.setHours(0, 0, 0, 0))
        : new Date(new Date().setHours(0, 0, 0, 0));

    const completion = await prisma.taskCompletion.upsert({
        where: {
            task_id_date: {
                task_id,
                date: newDate,
            },
        },
        update: {
            task_id,
            date: newDate,
            status,
        },
        create: {
            task_id,
            date: newDate,
            status,
        },
    });
    revalidatePath(`/${routine_id}`);
    return completion;
};

export const getTaskCompletions = async (routine_id: string, date: Date) => {
    return await prisma.taskCompletion.findMany({
        where: {
            task: {
                routine_id,
            },
            date: new Date(date.setHours(0, 0, 0, 0)),
        },
    });
};
