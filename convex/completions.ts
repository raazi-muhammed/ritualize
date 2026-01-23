import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const toggle = mutation({
  args: {
    taskId: v.id("tasks"),
    date: v.string(), // YYYY-MM-DD
    status: v.union(
      v.literal("completed"),
      v.literal("skipped"),
      v.literal("failed"),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    const routine = await ctx.db.get(task.routineId);
    if (!routine || routine.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const existing = await ctx.db
      .query("taskCompletions")
      .withIndex("by_task_date", (q) =>
        q.eq("taskId", args.taskId).eq("date", args.date),
      )
      .unique();

    if (existing) {
      if (existing.status === args.status) {
        // If same status, toggle off (delete)
        await ctx.db.delete(existing._id);
      } else {
        // Update status
        await ctx.db.patch(existing._id, { status: args.status });
      }
    } else {
      // Create new completion
      await ctx.db.insert("taskCompletions", {
        taskId: args.taskId,
        date: args.date,
        status: args.status,
      });
    }
  },
});

export const removeAllForRoutine = mutation({
  args: { routineId: v.id("routines") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const routine = await ctx.db.get(args.routineId);
    if (!routine || routine.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_routine", (q) => q.eq("routineId", args.routineId))
      .collect();

    for (const task of tasks) {
      const completions = await ctx.db
        .query("taskCompletions")
        .withIndex("by_task_date", (q) => q.eq("taskId", task._id))
        .collect();

      for (const completion of completions) {
        await ctx.db.delete(completion._id);
      }
    }
  },
});

export const remove = mutation({
  args: { id: v.id("taskCompletions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const completion = await ctx.db.get(args.id);
    if (!completion) throw new Error("Completion not found");

    const task = await ctx.db.get(completion.taskId);
    if (!task) throw new Error("Task not found");

    const routine = await ctx.db.get(task.routineId);
    if (!routine || routine.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});
