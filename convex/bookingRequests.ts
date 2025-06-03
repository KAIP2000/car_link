import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Create a new booking request
export const createBookingRequest = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Authenticate the user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to request a booking");
    }

    // 2. Get the renter user ID from their Clerk ID
    const renterUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!renterUser) {
      throw new Error("User not found in database");
    }

    // 3. Get the vehicle details and owner
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }

    // 4. Get the owner's user ID
    const ownerUser = await ctx.db.get(vehicle.userId);
    if (!ownerUser) {
      throw new Error("Vehicle owner not found");
    }

    // 5. Calculate the duration in days
    const startDate = new Date(args.startDate);
    const endDate = new Date(args.endDate);
    const durationDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // 6. Check if this would be a valid booking (not already booked, dates make sense, etc.)
    if (durationDays < 1) {
      throw new Error("Booking must be for at least 1 day");
    }

    // 7. Create the booking request
    const now = new Date().toISOString();
    const bookingRequestId = await ctx.db.insert("bookingRequests", {
      vehicleId: args.vehicleId,
      renterUserId: renterUser._id,
      ownerUserId: vehicle.userId,
      startDate: args.startDate,
      endDate: args.endDate,
      durationDays,
      status: "request_sent",
      statusUpdatedAt: now,
      messages: [{
        sender: renterUser._id,
        text: `Booking request created for ${durationDays} days from ${args.startDate} to ${args.endDate}`,
        timestamp: now
      }],
      createdAt: now,
      updatedAt: now,
    });

    return {
      bookingRequestId,
      status: "request_sent"
    };
  },
});

// Update the status of a booking request
export const updateBookingRequestStatus = mutation({
  args: {
    bookingRequestId: v.id("bookingRequests"),
    newStatus: v.string(), // "in_progress", "accepted", "rejected"
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Authenticate the user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to update a booking request");
    }

    // 2. Get the user ID from their Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found in database");
    }

    // 3. Get the booking request
    const bookingRequest = await ctx.db.get(args.bookingRequestId);
    if (!bookingRequest) {
      throw new Error("Booking request not found");
    }

    // 4. Verify the user is the owner of the vehicle (only owners can update status)
    if (bookingRequest.ownerUserId !== user._id) {
      throw new Error("Only the vehicle owner can update booking request status");
    }

    // 5. Check if the status transition is valid
    const validStatusTransitions = {
      "request_sent": ["in_progress", "rejected"],
      "in_progress": ["accepted", "rejected"],
      "accepted": [],
      "rejected": []
    };

    // @ts-ignore - We know these status values exist in our system
    if (!validStatusTransitions[bookingRequest.status].includes(args.newStatus)) {
      throw new Error(`Cannot transition from ${bookingRequest.status} to ${args.newStatus}`);
    }

    // 6. Update the booking request status
    const now = new Date().toISOString();
    const messages = bookingRequest.messages || [];
    
    if (args.message) {
      messages.push({
        sender: user._id,
        text: args.message,
        timestamp: now
      });
    }
    
    messages.push({
      sender: user._id,
      text: `Status updated from ${bookingRequest.status} to ${args.newStatus}`,
      timestamp: now
    });

    await ctx.db.patch(args.bookingRequestId, {
      status: args.newStatus,
      statusUpdatedAt: now,
      messages,
      updatedAt: now,
    });

    return {
      bookingRequestId: args.bookingRequestId,
      status: args.newStatus
    };
  },
});

// Add a message to a booking request
export const addBookingRequestMessage = mutation({
  args: {
    bookingRequestId: v.id("bookingRequests"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Authenticate the user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to send a message");
    }

    // 2. Get the user ID from their Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found in database");
    }

    // 3. Get the booking request
    const bookingRequest = await ctx.db.get(args.bookingRequestId);
    if (!bookingRequest) {
      throw new Error("Booking request not found");
    }

    // 4. Verify the user is either the renter or the owner
    if (bookingRequest.renterUserId !== user._id && bookingRequest.ownerUserId !== user._id) {
      throw new Error("Only the renter or owner can add messages to this booking request");
    }

    // 5. Add the message
    const now = new Date().toISOString();
    const messages = bookingRequest.messages || [];
    
    messages.push({
      sender: user._id,
      text: args.message,
      timestamp: now
    });

    await ctx.db.patch(args.bookingRequestId, {
      messages,
      updatedAt: now,
    });

    return {
      bookingRequestId: args.bookingRequestId,
      messageAdded: true
    };
  },
});

// Get booking requests for the current user (as renter)
export const getMyRentalRequests = query({
  handler: async (ctx) => {
    // 1. Authenticate the user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to view your booking requests");
    }

    // 2. Get the user ID from their Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found in database");
    }

    // 3. Get all booking requests where the user is the renter
    const bookingRequests = await ctx.db
      .query("bookingRequests")
      .withIndex("by_renterUserId", (q) => q.eq("renterUserId", user._id))
      .collect();

    // 4. Get vehicle details for each booking request
    const requestsWithDetails = await Promise.all(
      bookingRequests.map(async (request) => {
        const vehicle = await ctx.db.get(request.vehicleId);
        const owner = await ctx.db.get(request.ownerUserId);
        
        return {
          ...request,
          vehicle: vehicle ? {
            _id: vehicle._id,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            color: vehicle.color,
            photos: vehicle.photos,
          } : null,
          owner: owner ? {
            _id: owner._id,
            name: owner.name,
            email: owner.email,
            pictureUrl: owner.pictureUrl,
          } : null,
        };
      })
    );

    return requestsWithDetails;
  },
});

// Get booking requests for the current user's vehicles (as owner)
export const getMyVehicleBookingRequests = query({
  handler: async (ctx) => {
    // 1. Authenticate the user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to view booking requests for your vehicles");
    }

    // 2. Get the user ID from their Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found in database");
    }

    // 3. Get all booking requests where the user is the owner
    const bookingRequests = await ctx.db
      .query("bookingRequests")
      .withIndex("by_ownerUserId", (q) => q.eq("ownerUserId", user._id))
      .collect();

    // 4. Get vehicle and renter details for each booking request
    const requestsWithDetails = await Promise.all(
      bookingRequests.map(async (request) => {
        const vehicle = await ctx.db.get(request.vehicleId);
        const renter = await ctx.db.get(request.renterUserId);
        
        return {
          ...request,
          vehicle: vehicle ? {
            _id: vehicle._id,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            color: vehicle.color,
            photos: vehicle.photos,
          } : null,
          renter: renter ? {
            _id: renter._id,
            name: renter.name,
            email: renter.email,
            pictureUrl: renter.pictureUrl,
          } : null,
        };
      })
    );

    return requestsWithDetails;
  },
});

// Get booking request by ID with all details
export const getBookingRequestById = query({
  args: { 
    bookingRequestId: v.id("bookingRequests") 
  },
  handler: async (ctx, args) => {
    // 1. Authenticate the user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to view booking request details");
    }

    // 2. Get the user ID from their Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found in database");
    }

    // 3. Get the booking request
    const request = await ctx.db.get(args.bookingRequestId);
    if (!request) {
      throw new Error("Booking request not found");
    }

    // 4. Verify the user is either the renter or the owner
    if (request.renterUserId !== user._id && request.ownerUserId !== user._id) {
      throw new Error("You don't have permission to view this booking request");
    }

    // 5. Get vehicle, owner, and renter details
    const vehicle = await ctx.db.get(request.vehicleId);
    const owner = await ctx.db.get(request.ownerUserId);
    const renter = await ctx.db.get(request.renterUserId);
    
    // 6. Get user details for all message senders
    const messages = request.messages || [];
    const uniqueSenderIds = [...new Set(messages.map(m => m.sender))];
    
    const senders = await Promise.all(
      uniqueSenderIds.map(async (senderId) => {
        const sender = await ctx.db.get(senderId as Id<"users">);
        return {
          _id: senderId,
          name: sender?.name,
          email: sender?.email,
          pictureUrl: sender?.pictureUrl,
        };
      })
    );

    const sendersMap = Object.fromEntries(
      senders.map(s => [s._id, s])
    );

    const messagesWithSenders = messages.map(msg => ({
      ...msg,
      sender: sendersMap[msg.sender as unknown as string],
    }));
    
    return {
      ...request,
      vehicle: vehicle ? {
        _id: vehicle._id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        photos: vehicle.photos,
      } : null,
      owner: owner ? {
        _id: owner._id,
        name: owner.name,
        email: owner.email,
        pictureUrl: owner.pictureUrl,
      } : null,
      renter: renter ? {
        _id: renter._id,
        name: renter.name,
        email: renter.email,
        pictureUrl: renter.pictureUrl,
      } : null,
      messages: messagesWithSenders,
    };
  },
}); 