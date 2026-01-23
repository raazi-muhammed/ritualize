import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  {
    params,
  }: { params: { routineId: string; taskId: string; complitionId: string } }
) {
  const user = await getCurrentUser();
  const { routineId, taskId, complitionId } = params;

  const routine = await prisma.routine.findUnique({
    where: {
      id: routineId,
      user_id: user.id,
    },
    include: {
      tasks: true,
    },
  });

  if (!routine) {
    return NextResponse.json({ message: "Routine not found" }, { status: 404 });
  }

  const task = routine.tasks.find((task) => task.id === taskId);
  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  const complition = await prisma.taskCompletion.findUnique({
    where: {
      id: complitionId,
    },
  });
  if (!complition) {
    return NextResponse.json(
      { message: "Complition not found" },
      { status: 404 }
    );
  }

  await prisma.taskCompletion.delete({
    where: {
      id: complitionId,
    },
  });

  return NextResponse.json({ message: "Complition deleted" });
}
