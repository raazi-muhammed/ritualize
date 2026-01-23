import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { stringify } from "csv-stringify/sync";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    const routines = await prisma.routine.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        tasks: {
          include: {
            completions: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const csvData: any[] = [];

    routines.forEach((routine) => {
      // If routine has no tasks
      if (routine.tasks.length === 0) {
        csvData.push({
          "Routine Name": routine.name,
          "Routine Icon": routine.icon || "",
          "Routine Duration": routine.duration || "",
          "Is Favorite": routine.is_favorite ? "true" : "false",
          "Task Name": "",
          "Task Duration": "",
          "Task Order": "",
          "Task Type": "",
          "Completion Date": "",
          "Completion Status": "",
          "Completion Notes": "",
        });
      } else {
        routine.tasks.forEach((task) => {
          if (task.completions.length === 0) {
            // Task with no completions -> single row
            csvData.push({
              "Routine Name": routine.name,
              "Routine Icon": routine.icon || "",
              "Routine Duration": routine.duration || "",
              "Is Favorite": routine.is_favorite ? "true" : "false",
              "Task Name": task.name,
              "Task Duration": task.duration,
              "Task Order": task.order,
              "Task Type": task.type,
              "Completion Date": "",
              "Completion Status": "",
              "Completion Notes": "",
            });
          } else {
            // Task with completions -> row per completion
            task.completions.forEach((completion) => {
              csvData.push({
                "Routine Name": routine.name,
                "Routine Icon": routine.icon || "",
                "Routine Duration": routine.duration || "",
                "Is Favorite": routine.is_favorite ? "true" : "false",
                "Task Name": task.name,
                "Task Duration": task.duration,
                "Task Order": task.order,
                "Task Type": task.type,
                "Completion Date": completion.date.toISOString(),
                "Completion Status": completion.status,
                "Completion Notes": completion.notes || "",
              });
            });
          }
        });
      }
    });

    const csvString = stringify(csvData, {
      header: true,
      columns: [
        "Routine Name",
        "Routine Icon",
        "Routine Duration",
        "Is Favorite",
        "Task Name",
        "Task Duration",
        "Task Order",
        "Task Type",
        "Completion Date",
        "Completion Status",
        "Completion Notes",
      ],
    });

    const headers = new Headers();
    headers.set("Content-Type", "text/csv");
    headers.set(
      "Content-Disposition",
      `attachment; filename="all_routines_export.csv"`
    );

    return new NextResponse(csvString, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error("Error exporting routines:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
