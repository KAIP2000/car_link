import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel"; // Import Id type

// Define validation schema for vehicle data, matching the table schema
const vehicleArgs = {
  // Basic Info
  make: v.string(),
  model: v.string(),
  year: v.number(),
  bodyType: v.string(),
  transmission: v.string(),
  fuelType: v.string(),
  seats: v.number(),
  color: v.string(),
  licensePlateNumber: v.optional(v.string()),
  // Performance & Features
  engineSize: v.optional(v.string()),
  mileage: v.number(),
  features: v.array(v.string()),
  hasAirConditioning: v.boolean(),
  hasGps: v.boolean(),
  // Location
  pickupLocation: v.string(),
  deliveryAvailable: v.boolean(),
  // Media (Placeholders for now)
  photos: v.array(v.string()),
  registrationDocumentUrl: v.optional(v.string()),
  insuranceDocumentUrl: v.optional(v.string()),
};

export const addVehicle = mutation({
  args: vehicleArgs, // Use the defined validation schema
  handler: async (ctx, args) => {
    console.log("addVehicle mutation started."); // Log start

    // 1. Get user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.error("addVehicle: User not authenticated.");
      throw new Error("User must be authenticated to add a vehicle.");
    }
    console.log(`addVehicle: Authenticated user identity found: ${identity.subject}`);

    // 2. Get the user's internal Convex ID directly using the Clerk ID (subject)
    console.log(`addVehicle: Querying for user with Clerk ID: ${identity.subject}`);
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      // This case should ideally not happen if the webhook is working correctly,
      // but it's good practice to handle it.
      console.error(`addVehicle: User not found in Convex DB for Clerk ID: ${identity.subject}`);
      throw new Error("User not found in Convex database. Please ensure user profile is synced.");
    }
    console.log(`addVehicle: Found Convex user ID: ${user._id}`);

    // 3. Insert the new vehicle
    console.log(`addVehicle: Attempting to insert vehicle data for user: ${user._id}`);
    const vehicleId = await ctx.db.insert("vehicles", {
      userId: user._id, // Link to the authenticated user
      ...args, // Spread the validated vehicle arguments
    });

    console.log(`addVehicle: Successfully added vehicle ${vehicleId} for user ${user._id}`); // Log success

    // 4. Return the ID of the newly created vehicle
    return vehicleId;
  },
});

// +++ Query to get all vehicles +++
export const getAllVehicles = query({
  handler: async (ctx) => {
    // Fetch all documents from the 'vehicles' table
    const vehicles = await ctx.db.query("vehicles").collect();
    
    // Optional: You might want to join with user data later if needed
    // e.g., to show owner info
    
    console.log(`getAllVehicles: Found ${vehicles.length} vehicles.`);
    return vehicles;
  },
});

// +++ Query to get a single vehicle by ID +++
export const getVehicleById = query({
  args: { vehicleId: v.id("vehicles") }, // Expect the document ID
  handler: async (ctx, args) => {
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle) {
      console.warn(`getVehicleById: Vehicle not found for ID: ${args.vehicleId}`);
      // Consider throwing an error or returning null based on how you want to handle not found
    }
    return vehicle;
  },
});

// +++ Query to get vehicles for the current authenticated user +++
export const getVehiclesByCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    
    // Throw error if not authenticated - ensures query only runs when Convex auth is ready
    if (!identity) { 
      throw new Error("Unauthenticated call to getVehiclesByCurrentUser");
    }

    // Get the user's internal Convex ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      console.warn(`getVehiclesByCurrentUser: User not found in DB for Clerk ID: ${identity.subject}`);
      // Return empty array if user record doesn't exist (e.g., webhook hasn't run yet)
      return []; 
    }

    // Fetch vehicles belonging to this user
    const vehicles = await ctx.db
      .query("vehicles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
      
    console.log(`getVehiclesByCurrentUser: Found ${vehicles.length} vehicles for user ${user._id}.`);
    return vehicles;
  },
});

// +++ Mutation to update a vehicle +++
// Define args: require vehicle ID and accept partial vehicle data
const updateVehicleArgs = {
  vehicleId: v.id("vehicles"),
  // Use partial validation - allow any subset of fields to be updated
  // Optional: Make specific fields required for update if needed
  make: v.optional(v.string()),
  model: v.optional(v.string()),
  year: v.optional(v.number()),
  bodyType: v.optional(v.string()),
  transmission: v.optional(v.string()),
  fuelType: v.optional(v.string()),
  seats: v.optional(v.number()),
  color: v.optional(v.string()),
  licensePlateNumber: v.optional(v.string()),
  engineSize: v.optional(v.string()),
  mileage: v.optional(v.number()),
  features: v.optional(v.array(v.string())), 
  hasAirConditioning: v.optional(v.boolean()),
  hasGps: v.optional(v.boolean()),
  pickupLocation: v.optional(v.string()),
  deliveryAvailable: v.optional(v.boolean()),
  photos: v.optional(v.array(v.string())), // Placeholder
  registrationDocumentUrl: v.optional(v.string()), // Placeholder
  insuranceDocumentUrl: v.optional(v.string()), // Placeholder
};

export const updateVehicle = mutation({
  args: updateVehicleArgs,
  handler: async (ctx, args) => {
    console.log(`updateVehicle: Mutation started for ID: ${args.vehicleId}`);
    
    // 1. Authenticate User
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.error("updateVehicle: User not authenticated.");
      throw new Error("Authentication required to update vehicle.");
    }

    // 2. Get User's Convex ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) {
      console.error(`updateVehicle: User not found in DB for Clerk ID: ${identity.subject}`);
      throw new Error("User profile not found.");
    }

    // 3. Get the vehicle to update
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle) {
      console.error(`updateVehicle: Vehicle not found with ID: ${args.vehicleId}`);
      throw new Error("Vehicle not found.");
    }

    // 4. **Verify Ownership**
    if (vehicle.userId !== user._id) {
      console.error(`updateVehicle: User ${user._id} does not own vehicle ${args.vehicleId}`);
      throw new Error("You do not have permission to update this vehicle.");
    }

    // 5. Prepare update data (excluding the vehicleId itself)
    const { vehicleId, ...updateData } = args;
    console.log(`updateVehicle: Applying update for vehicle ${vehicleId}`, updateData);

    // 6. Patch the vehicle document
    await ctx.db.patch(vehicleId, updateData);

    console.log(`updateVehicle: Successfully updated vehicle ${vehicleId}`);
    return { success: true }; // Indicate success
  },
}); 