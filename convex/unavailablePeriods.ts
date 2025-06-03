import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Add an unavailable period
export const addUnavailablePeriod = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    startDate: v.string(),
    endDate: v.string(),
    bookingRequestId: v.optional(v.id("bookingRequests")),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("unavailablePeriods", {
      ...args,
      createdAt: now,
    });
  },
});

// Get unavailable periods for a vehicle
export const getUnavailablePeriodsForVehicle = query({
  args: { vehicleId: v.id("vehicles") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("unavailablePeriods")
      .withIndex("by_vehicleId", (q) => q.eq("vehicleId", args.vehicleId))
      .collect();
  },
});

// Check if a vehicle is available for a date range
export const isVehicleAvailable = query({
  args: {
    vehicleId: v.id("vehicles"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const unavailablePeriods = await ctx.db
      .query("unavailablePeriods")
      .withIndex("by_vehicleId", (q) => q.eq("vehicleId", args.vehicleId))
      .collect();

    const requestedStart = new Date(args.startDate);
    const requestedEnd = new Date(args.endDate);

    // Check if any unavailable period overlaps with the requested dates
    for (const period of unavailablePeriods) {
      const periodStart = new Date(period.startDate);
      const periodEnd = new Date(period.endDate);

      if (
        (requestedStart <= periodEnd && requestedEnd >= periodStart) ||
        (periodStart <= requestedEnd && periodEnd >= requestedStart)
      ) {
        return false; // Vehicle is not available
      }
    }

    return true; // Vehicle is available
  },
});

// Get all available vehicles for a date range
export const getAvailableVehicles = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all vehicles
    const allVehicles = await ctx.db.query("vehicles").collect();
    
    // If no dates are provided, return all vehicles
    if (!args.startDate || !args.endDate) {
      return allVehicles;
    }
    
    // Filter vehicles that are available for the requested dates
    const availableVehicles = await Promise.all(
      allVehicles.map(async (vehicle) => {
        const unavailablePeriods = await ctx.db
          .query("unavailablePeriods")
          .withIndex("by_vehicleId", (q) => q.eq("vehicleId", vehicle._id))
          .collect();

        const requestedStart = new Date(args.startDate);
        const requestedEnd = new Date(args.endDate);

        // Check if any unavailable period overlaps with the requested dates
        for (const period of unavailablePeriods) {
          const periodStart = new Date(period.startDate);
          const periodEnd = new Date(period.endDate);

          if (
            (requestedStart <= periodEnd && requestedEnd >= periodStart) ||
            (periodStart <= requestedEnd && periodEnd >= requestedStart)
          ) {
            return null; // Vehicle is not available
          }
        }

        return vehicle; // Vehicle is available
      })
    );

    // Remove null values (unavailable vehicles)
    return availableVehicles.filter((vehicle): vehicle is typeof vehicle => vehicle !== null);
  },
}); 