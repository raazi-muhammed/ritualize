import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  }).index("email", ["email"]),
  routines: defineTable({
    name: v.string(),
    icon: v.optional(v.string()),
    duration: v.optional(v.number()),
    userId: v.id("users"), // Changed from clerk user id string to convex user id
    isFavorite: v.boolean(),
  }).index("by_user", ["userId"]),
  tasks: defineTable({
    name: v.string(),
    duration: v.number(),
    order: v.number(),
    routineId: v.id("routines"),
    startDate: v.number(), // timestamp
    endDate: v.optional(v.number()),
    type: v.union(v.literal("task"), v.literal("checkpoint")),
  }).index("by_routine", ["routineId"]),
  taskCompletions: defineTable({
    taskId: v.id("tasks"),
    date: v.string(), // ISO date string YYYY-MM-DD to easily check completion for a day
    status: v.union(
      v.literal("completed"),
      v.literal("skipped"),
      v.literal("failed")
    ),
    notes: v.optional(v.string()),
  }).index("by_task_date", ["taskId", "date"]),
});
