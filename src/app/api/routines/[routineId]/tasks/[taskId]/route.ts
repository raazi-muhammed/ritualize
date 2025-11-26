import { getCurrentUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { routineId: string; taskId: string } }
) {
  const { routineId, taskId } = params;
  const user = await getCurrentUser();
  const task = await prisma.task.findUnique({
    where: { id: taskId, routine_id: routineId },
    include: {
      completions: {
        orderBy: {
          date: "desc",
        },
      },
    },
  });
  return NextResponse.json(task);
}

export async function PATCH(
  request: Request,
  { params }: { params: { routineId: string; taskId: string } }
) {
  const { taskId } = params;
  const body = await request.json();
  const user = await getCurrentUser();
  const newDate = new Date(new Date(body.date).setHours(0, 0, 0, 0));

  const completion = await prisma.taskCompletion.upsert({
    where: {
      task_id_date: {
        task_id: taskId,
        date: newDate,
      },
    },
    update: {
      task_id: taskId,
      date: newDate,
      status: body.status,
    },
    create: {
      task_id: taskId,
      date: newDate,
      status: body.status,
    },
  });

  return NextResponse.json(completion);
}

export async function PUT(
  request: Request,
  { params }: { params: { routineId: string; taskId: string } }
) {
  const { routineId, taskId } = params;
  const user = await getCurrentUser();
  const body = await request.json();

  const updated = await prisma.task.update({
    where: {
      id: taskId,
      routine_id: routineId,
    },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: { routineId: string; taskId: string } }
) {
  const { routineId, taskId } = params;
  const user = await getCurrentUser();

  await prisma.taskCompletion.deleteMany({
    where: {
      task_id: taskId,
    },
  });

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  return NextResponse.json({ message: "Task deleted" });
}
