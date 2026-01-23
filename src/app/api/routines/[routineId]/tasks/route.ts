import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { routineId: string } }
) {
  const { routineId } = params;
  const body = await request.json();
  const user = await getCurrentUser();

  const lastTask = await prisma.task.findFirst({
    where: {
      routine_id: routineId,
    },
    orderBy: {
      order: "desc",
    },
  });
  const created = await prisma.task.create({
    data: {
      ...body,
      routine_id: routineId,
      order: lastTask?.order ? lastTask?.order + 1 : 1,
    },
  });

  return NextResponse.json(created);
}

export async function DELETE(
  request: Request,
  { params }: { params: { routineId: string } }
) {
  const { routineId } = params;
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
      date: new Date(new Date().setHours(0, 0, 0, 0)),
    },
  });

  return NextResponse.json({ message: "Tasks deleted" });
}
