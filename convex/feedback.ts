import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitFeedback = mutation({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("User must be authenticated to submit feedback.");
    }

    if (!args.message.trim()) {
      throw new Error("Feedback message cannot be empty.");
    }

    await ctx.db.insert("feedback", {
      clerkUserId: identity.subject, // Using subject as clerkUserId
      message: args.message,
      createdAt: Date.now(),
    });

    return { success: true };
  },
}); 