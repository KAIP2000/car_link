import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add a new driver
export const registerDriver = mutation({
  args: {
    fullName: v.string(),
    licenseNumber: v.string(),
    licenseExpiryDate: v.string(),
    address: v.string(),
    dateOfBirth: v.string(),
    transmissionPreference: v.string(),
    frontLicenseImageId: v.id("_storage"),
    backLicenseImageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Get the current authenticated user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to register as a driver");
    }

    // Check if user exists in our database
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found in database");
    }

    // Check if driver profile already exists
    const existingDriver = await ctx.db
      .query("drivers")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    if (existingDriver) {
      throw new Error("Driver profile already exists for this user");
    }

    // Create a new driver profile
    const driverId = await ctx.db.insert("drivers", {
      userId: user._id,
      clerkUserId: identity.subject,
      fullName: args.fullName,
      licenseNumber: args.licenseNumber,
      licenseExpiryDate: args.licenseExpiryDate,
      address: args.address,
      dateOfBirth: args.dateOfBirth,
      transmissionPreference: args.transmissionPreference,
      frontLicenseImageStorageId: args.frontLicenseImageId,
      backLicenseImageStorageId: args.backLicenseImageId,
      isVerified: false,
      status: "pending",
      createdAt: Date.now(),
    });

    return { driverId };
  },
});

// Get driver information for the current user
export const getMyDriverProfile = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return null;
    }

    return await ctx.db
      .query("drivers")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
  },
}); 