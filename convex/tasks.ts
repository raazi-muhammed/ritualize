import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Returns the task plus a lightweight summary of its completions (a count
// and the bare dates, for the calendar view). The full completion records
// (used by the "Records" list) are loaded separately via `getCompletions`,
// which is paginated — a daily habit tracked for months/years can build up
// hundreds of completions, and this page is re-fetched on every realtime
// update, so we don't want to ship every full record just to render a count
// and a calendar.
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
      completionCount: completions.length,
      completionDates: completions.map((c) => c.date),
    };
  },
});

export const getCompletions = query({
  args: {
    taskId: v.id("tasks"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { page: [], isDone: true, continueCursor: "" };

    const task = await ctx.db.get(args.taskId);
    if (!task) return { page: [], isDone: true, continueCursor: "" };

    const routine = await ctx.db.get(task.routineId);
    if (!routine || routine.userId !== userId) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    return await ctx.db
      .query("taskCompletions")
      .withIndex("by_task_date", (q) => q.eq("taskId", args.taskId))
      .order("desc")
      .paginate(args.paginationOpts);
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

    // existingTasks.length is the true count regardless of whether
    // taskCount was already in sync, so this also backfills routines that
    // predate the field.
    await ctx.db.patch(args.routineId, {
      taskCount: existingTasks.length + 1,
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

    await Promise.all(completions.map((completion) => ctx.db.delete(completion._id)));

    await ctx.db.delete(args.id);

    // Recount (rather than decrementing routine.taskCount) so this also
    // self-heals routines whose taskCount had drifted or predates the field.
    const remainingTasks = await ctx.db
      .query("tasks")
      .withIndex("by_routine", (q) => q.eq("routineId", task.routineId))
      .collect();

    await ctx.db.patch(task.routineId, { taskCount: remainingTasks.length });
  },
});

export const reorder = mutation({
  args: {
    taskIds: v.array(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await Promise.all(
      args.taskIds.map(async (taskId, i) => {
        const task = await ctx.db.get(taskId);
        if (!task) return;

        const routine = await ctx.db.get(task.routineId);
        if (!routine || routine.userId !== userId) return;

        await ctx.db.patch(taskId, { order: i });
      }),
    );
  },
});
