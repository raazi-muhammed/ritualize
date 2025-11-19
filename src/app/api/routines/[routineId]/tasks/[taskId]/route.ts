import { getCurrentUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { routineId: string; taskId: string } }
) {
  const { routineId, taskId } = params;
  const body = await request.json();
  const user = await getCurrentUser();

  const newDate = new Date(new Date().setHours(0, 0, 0, 0));

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
