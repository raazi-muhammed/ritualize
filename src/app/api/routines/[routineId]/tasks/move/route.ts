import { getCurrentUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { routineId: string } },
) {
  const { routineId } = params;
  const body = await request.json();
  const user = await getCurrentUser();

  const moveToTask = await prisma.task.findUnique({
    where: {
      id: body.moveToTaskId,
    },
  });

  if (!moveToTask) {
    return NextResponse.json(
      { error: "Move to task not found" },
      { status: 404 },
    );
  }

  await prisma.task.updateMany({
    where: {
      routine_id: routineId,
      order: {
        gte: moveToTask.order,
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
      routine_id: routineId,
      id: body.taskToMoveId,
    },
    data: {
      order: moveToTask.order,
    },
  });

  return NextResponse.json({ message: "Task moved" });
}
