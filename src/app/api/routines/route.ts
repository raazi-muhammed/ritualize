import { getCurrentUser } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  const routines = await prisma.routine.findMany({
    where: {
      user_id: user.id,
    },
    include: {
      tasks: true,
    },
  });
  return NextResponse.json(routines, { status: 200 });
}
