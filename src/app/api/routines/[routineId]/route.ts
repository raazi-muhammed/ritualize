import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { RoutineWithTasks } from "@/types/entities";

export async function GET(
  request: Request,
  { params }: { params: { routineId: string } }
) {
  const { routineId } = params;
  const url = new URL(request.url);
  const dateStr = url.searchParams.get("date") || new Date().toISOString();
  const date = new Date(dateStr);
  const user = await getCurrentUser();

  const routine = await prisma.routine.findUnique({
    where: {
      id: routineId,
      user_id: user.id,
    },
    include: {
      tasks: {
        orderBy: {
          order: "asc",
        },
        include: {
          completions: {
            where: {
              date: new Date(date.setHours(0, 0, 0, 0)),
            },
          },
        },
      },
    },
  });

  if (!routine) {
    return new NextResponse("Routine not found", { status: 404 });
  }

  const formattedRoutine: RoutineWithTasks = {
    ...routine,
    tasks: routine.tasks.map((task) => ({
      ...task,
      status: task.completions[0]?.status || "skipped",
    })),
  };

  return NextResponse.json(formattedRoutine);
}
export async function PUT(
  request: Request,
  { params }: { params: { routineId: string } }
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
  { params }: { params: { routineId: string } }
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
