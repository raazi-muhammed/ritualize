import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getMany = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const routines = await ctx.db
      .query("routines")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Fetch tasks for each routine to match RoutineWithTasks type if needed
    // or just return routines. Usually for lists we might not need all tasks.
    // But the existing API returns RoutineWithTasks[].

    const routinesWithTasks = await Promise.all(
      routines.map(async (routine) => {
        const tasks = await ctx.db
          .query("tasks")
          .withIndex("by_routine", (q) => q.eq("routineId", routine._id))
          .collect();

        // For the list view, we might not need status for a specific date,
        // but let's see what the frontend expects.
        return {
          ...routine,
          tasks: tasks.map((t) => ({ ...t, status: "skipped" })), // Default status
        };
      }),
    );

    return routinesWithTasks;
  },
});

export const get = query({
  args: {
    id: v.id("routines"),
    date: v.string(), // ISO date string YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const routine = await ctx.db.get(args.id);
    if (!routine || routine.userId !== userId) return null;

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_routine", (q) => q.eq("routineId", args.id))
      .collect();

    const tasksWithStatus = await Promise.all(
      tasks
        .sort((a, b) => a.order - b.order)
        .map(async (task) => {
          const completion = await ctx.db
            .query("taskCompletions")
            .withIndex("by_task_date", (q) =>
              q.eq("taskId", task._id).eq("date", args.date),
            )
            .unique();

          return {
            ...task,
            status: completion?.status || "skipped",
          };
        }),
    );

    return {
      ...routine,
      tasks: tasksWithStatus,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    icon: v.optional(v.string()),
    isFavorite: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const routineId = await ctx.db.insert("routines", {
      name: args.name,
      icon: args.icon,
      isFavorite: args.isFavorite ?? false,
      userId,
    });

    return routineId;
  },
});

export const update = mutation({
  args: {
    id: v.id("routines"),
    name: v.optional(v.string()),
    icon: v.optional(v.string()),
    isFavorite: v.optional(v.boolean()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const routine = await ctx.db.get(id);
    if (!routine || routine.userId !== userId) {
      throw new Error("Routine not found or unauthorized");
    }

    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("routines") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const routine = await ctx.db.get(args.id);
    if (!routine || routine.userId !== userId) {
      throw new Error("Routine not found or unauthorized");
    }

    // Delete tasks and their completions
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_routine", (q) => q.eq("routineId", args.id))
      .collect();

    for (const task of tasks) {
      const completions = await ctx.db
        .query("taskCompletions")
        .withIndex("by_task_date", (q) => q.eq("taskId", task._id))
        .collect();

      for (const completion of completions) {
        await ctx.db.delete(completion._id);
      }
      await ctx.db.delete(task._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const bulkImport = mutation({
  args: {
    data: v.array(
      v.object({
        routineName: v.string(),
        routineIcon: v.string(),
        routineDuration: v.number(),
        isFavorite: v.boolean(),
        tasks: v.array(
          v.object({
            name: v.string(),
            duration: v.number(),
            order: v.number(),
            type: v.union(v.literal("task"), v.literal("checkpoint")),
            completions: v.array(
              v.object({
                date: v.string(),
                status: v.union(
                  v.literal("completed"),
                  v.literal("skipped"),
                  v.literal("failed"),
                ),
                notes: v.optional(v.string()),
              }),
            ),
          }),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    for (const item of args.data) {
      const routineId = await ctx.db.insert("routines", {
        name: item.routineName,
        icon: item.routineIcon,
        duration: item.routineDuration,
        isFavorite: item.isFavorite,
        userId,
      });

      for (const t of item.tasks) {
        const taskId = await ctx.db.insert("tasks", {
          name: t.name,
          duration: t.duration,
          order: t.order,
          type: t.type,
          routineId,
          startDate: Date.now(),
        });

        for (const c of t.completions) {
          await ctx.db.insert("taskCompletions", {
            taskId,
            date: c.date,
            status: c.status,
            notes: c.notes,
          });
        }
      }
    }
  },
});
