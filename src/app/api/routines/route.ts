import { getCurrentUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  const routines = await prisma.routine.findMany({
    where: {
      user_id: user.id,
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

  return NextResponse.json(routines, { status: 200 });
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
