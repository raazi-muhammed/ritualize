import { getCurrentUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { routineId: string } },
) {
  const { routineId } = params;
  const body = await request.json();
  const user = await getCurrentUser();

  const updated = await prisma.routine.update({
    where: {
      id: routineId,
      user_id: user.id,
    },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: { routineId: string } },
) {
  const { routineId } = params;
  const user = await getCurrentUser();

  const prevRoutine = await prisma.routine.findUnique({
    where: {
      id: routineId,
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
        routine_id: routineId,
      },
    }),
    await prisma.routine.delete({
      where: {
        id: routineId,
        user_id: user.id,
      },
    }),
  ]);

  return NextResponse.json({ message: "Routine deleted" });
}
