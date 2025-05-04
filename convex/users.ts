import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Internal mutation to create or update a user record in the Convex database.
 * This function is intended to be called by a Clerk webhook when a user is created or updated.
 * It uses the Clerk user ID to uniquely identify the user.
 */
export const createOrUpdateUser = internalMutation({
  // Define the arguments expected by the mutation
  args: {
    // Clerk User ID (e.g., user_2c4h...)
    clerkId: v.string(),
    // User's primary email address
    email: v.string(),
    // User's full name (optional)
    name: v.optional(v.string()),
    // URL of the user's profile picture (optional)
    pictureUrl: v.optional(v.string()),
  },
  // The handler function that executes the database operations
  handler: async (ctx, args) => {
    // Try to find an existing user with the provided Clerk ID
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique(); // Expect at most one user with this Clerk ID

    // If a user with this Clerk ID already exists...
    if (existingUser !== null) {
      // Update the existing user record if necessary data has changed
      // Check if email, name, or pictureUrl is different
      if (
        existingUser.email !== args.email ||
        existingUser.name !== args.name ||
        existingUser.pictureUrl !== args.pictureUrl
      ) {
        console.log(`Updating user: ${args.clerkId}`);
        await ctx.db.patch(existingUser._id, {
          email: args.email,
          name: args.name,
          pictureUrl: args.pictureUrl,
        });
      }
      // Return the ID of the existing (potentially updated) user
      return existingUser._id;
    } else {
      // If the user does not exist, create a new user record
      console.log(`Creating new user: ${args.clerkId}`);
      const userId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        pictureUrl: args.pictureUrl,
      });
      // Return the ID of the newly created user
      return userId;
    }
  },
});

/**
 * Helper query to retrieve a user's internal Convex ID based on their Clerk ID.
 * This can be used in other mutations/queries to link data to a specific user.
 */
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    return user;
  },
});

// Keep the internal mutation for the webhook
export const internalCreateOrUpdateUser = internalMutation({
  // Define the arguments expected by the mutation
  args: {
    // Clerk User ID (e.g., user_2c4h...)
    clerkId: v.string(),
    // User's primary email address
    email: v.string(),
    // User's full name (optional)
    name: v.optional(v.string()),
    // URL of the user's profile picture (optional)
    pictureUrl: v.optional(v.string()),
  },
  // The handler function that executes the database operations
  handler: async (ctx, args) => {
    // Try to find an existing user with the provided Clerk ID
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique(); // Expect at most one user with this Clerk ID

    // If a user with this Clerk ID already exists...
    if (existingUser !== null) {
      // Update the existing user record if necessary data has changed
      // Check if email, name, or pictureUrl is different
      if (
        existingUser.email !== args.email ||
        existingUser.name !== args.name ||
        existingUser.pictureUrl !== args.pictureUrl
      ) {
        console.log(`Updating user: ${args.clerkId}`);
        await ctx.db.patch(existingUser._id, {
          email: args.email,
          name: args.name,
          pictureUrl: args.pictureUrl,
        });
      }
      // Return the ID of the existing (potentially updated) user
      return existingUser._id;
    } else {
      // If the user does not exist, create a new user record
      console.log(`Creating new user: ${args.clerkId}`);
      const userId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        pictureUrl: args.pictureUrl,
      });
      // Return the ID of the newly created user
      return userId;
    }
  },
}); 