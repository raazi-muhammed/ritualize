"use server";

import { getCurrentUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { RoutineWithTasks } from "@/types/entities";
import { Routine } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createRoutine = async (data: Omit<Routine, "id" | "user_id">) => {
  const user = await getCurrentUser();

  const created = await prisma.routine.create({
    data: {
      ...data,
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
  const prevRoutine = await prisma.routine.findUnique({
    where: {
      id,
      user_id: user.id,
    },
    include: {
      tasks: true,
    },
  });
  const [_, routine] = await Promise.all([
    await prisma.taskCompletion.deleteMany({
      where: {
        task_id: {
          in: prevRoutine?.tasks.map((task) => task.id) ?? [],
        },
      },
    }),
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

export async function getRoutines(): Promise<RoutineWithTasks[]> {
  const user = await getCurrentUser();
  const date = new Date();

  const routines = await prisma.routine.findMany({
    where: {
      user_id: user.id,
    },
    include: {
      tasks: {
        include: {
          completions: {
            where: {
              date: new Date(date.setHours(0, 0, 0, 0)),
            },
          },
        },
      },
    },
    orderBy: [
      {
        is_favorite: "desc",
      },
      {
        name: "asc",
      },
    ],
  });
  return routines.map((routine) => ({
    ...routine,
    tasks: routine.tasks.map((task) => ({
      ...task,
      status: task.completions[0]?.status || "skipped",
    })),
  }));
}

export const uncheckAllTasks = async ({
  routineId,
  date,
}: {
  routineId: string;
  date: Date;
}) => {
  const user = await getCurrentUser();
  const routine = await prisma.routine.findUnique({
    where: {
      id: routineId,
      user_id: user.id,
    },
    include: {
      tasks: true,
    },
  });
  await prisma.taskCompletion.deleteMany({
    where: {
      task_id: {
        in: routine?.tasks.map((task) => task.id) ?? [],
      },
      date: new Date(date.setHours(0, 0, 0, 0)),
    },
  });
  revalidatePath("/");
  return routine;
};
