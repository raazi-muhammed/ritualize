import { getCurrentUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { RoutineWithTasks } from "@/types/entities";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const date = new Date(
    url.searchParams.get("date") || new Date().toISOString()
  );

  const user = await getCurrentUser();
  const routines = await prisma.routine.findMany({
    where: {
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
    orderBy: [
      {
        is_favorite: "desc",
      },
      {
        name: "asc",
      },
    ],
  });

  const formattedRoutines: RoutineWithTasks[] = routines.map((routine) => ({
    ...routine,
    tasks: routine.tasks.map((task) => ({
      ...task,
      status: task.completions[0]?.status || "skipped",
    })),
  }));

  return NextResponse.json(formattedRoutines, { status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await getCurrentUser();

  const created = await prisma.routine.create({
    data: {
      ...body,
      user_id: user.id,
    },
  });

  return NextResponse.json(created);
}
