import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (!records || records.length === 0) {
      return new NextResponse("No records found in CSV", { status: 400 });
    }

    // Group by Routine Name
    const routinesMap = new Map<string, any[]>();
    records.forEach((record: any) => {
      const routineName = record["Routine Name"];
      if (routineName) {
        if (!routinesMap.has(routineName)) {
          routinesMap.set(routineName, []);
        }
        routinesMap.get(routineName)?.push(record);
      }
    });

    await prisma.$transaction(
      async (tx) => {
        for (const [routineName, routineRecords] of Array.from(
          routinesMap.entries()
        )) {
          // Assume first record has routine details
          const firstRecord = routineRecords[0];

          const routine = await tx.routine.create({
            data: {
              name: routineName,
              user_id: user.id,
              icon: firstRecord["Routine Icon"] || "List",
              duration: parseInt(firstRecord["Routine Duration"]) || null,
              is_favorite: firstRecord["Is Favorite"] === "true",
            },
          });

          // Deduplicate tasks based on name + order
          const uniqueTasksMap = new Map<string, any>();
          routineRecords.forEach((record: any) => {
            if (record["Task Name"]) {
              const key = `${record["Task Name"]}-${record["Task Order"]}`;
              if (!uniqueTasksMap.has(key)) {
                uniqueTasksMap.set(key, record);
              }
            }
          });

          // Create Tasks
          for (const [key, record] of Array.from(uniqueTasksMap.entries())) {
            const task = await tx.task.create({
              data: {
                name: record["Task Name"],
                duration: parseInt(record["Task Duration"]) || 0,
                order: parseInt(record["Task Order"]) || 0,
                type:
                  record["Task Type"] === "checkpoint" ||
                  record["Task Type"] === "task"
                    ? record["Task Type"]
                    : "task",
                routine_id: routine.id,
              },
            });

            // Find all records for this task (to get completions)
            const taskRecords = routineRecords.filter(
              (r: any) =>
                r["Task Name"] === task.name &&
                parseInt(r["Task Order"]) === task.order
            );

            const completionsToCreate = taskRecords
              .filter((r: any) => r["Completion Date"])
              .map((r: any) => ({
                task_id: task.id,
                date: new Date(r["Completion Date"]),
                status:
                  r["Completion Status"] === "completed" ||
                  r["Completion Status"] === "skipped" ||
                  r["Completion Status"] === "failed"
                    ? r["Completion Status"]
                    : "completed",
                notes: r["Completion Notes"] || null,
              }));

            if (completionsToCreate.length > 0) {
              await tx.taskCompletion.createMany({
                data: completionsToCreate,
              });
            }
          }
        }
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 20000, // default: 5000
      }
    );

    return NextResponse.json(
      { success: true, count: routinesMap.size },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error importing routines:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
