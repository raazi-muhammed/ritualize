import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getWithCompletions = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const task = await ctx.db.get(args.id);
    if (!task) return null;

    const routine = await ctx.db.get(task.routineId);
    if (!routine || routine.userId !== userId) return null;

    const completions = await ctx.db
      .query("taskCompletions")
      .withIndex("by_task_date", (q) => q.eq("taskId", args.id))
      .collect();

    return {
      ...task,
      completions,
    };
  },
});

export const create = mutation({
  args: {
    routineId: v.id("routines"),
    name: v.string(),
    duration: v.number(),
    type: v.union(v.literal("task"), v.literal("checkpoint")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const routine = await ctx.db.get(args.routineId);
    if (!routine || routine.userId !== userId) {
      throw new Error("Routine not found or unauthorized");
    }

    // Get the current max order
    const existingTasks = await ctx.db
      .query("tasks")
      .withIndex("by_routine", (q) => q.eq("routineId", args.routineId))
      .collect();

    const maxOrder = existingTasks.reduce(
      (max, t) => Math.max(max, t.order),
      -1,
    );

    const taskId = await ctx.db.insert("tasks", {
      routineId: args.routineId,
      name: args.name,
      duration: args.duration,
      order: maxOrder + 1,
      type: args.type,
      startDate: Date.now(),
    });

    return taskId;
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    name: v.optional(v.string()),
    duration: v.optional(v.number()),
    order: v.optional(v.number()),
    type: v.optional(v.union(v.literal("task"), v.literal("checkpoint"))),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const task = await ctx.db.get(id);
    if (!task) throw new Error("Task not found");

    const routine = await ctx.db.get(task.routineId);
    if (!routine || routine.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");

    const routine = await ctx.db.get(task.routineId);
    if (!routine || routine.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Delete completions
    const completions = await ctx.db
      .query("taskCompletions")
      .withIndex("by_task_date", (q) => q.eq("taskId", args.id))
      .collect();

    for (const completion of completions) {
      await ctx.db.delete(completion._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const reorder = mutation({
  args: {
    taskIds: v.array(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    for (let i = 0; i < args.taskIds.length; i++) {
      const taskId = args.taskIds[i];
      const task = await ctx.db.get(taskId);
      if (!task) continue;

      const routine = await ctx.db.get(task.routineId);
      if (!routine || routine.userId !== userId) continue;

      await ctx.db.patch(taskId, { order: i });
    }
  },
});
