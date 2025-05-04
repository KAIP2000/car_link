// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Define the 'users' table
  users: defineTable({
    // Clerk User ID (e.g., user_2c4h...) - This will be the primary identifier from Clerk
    clerkId: v.string(),
    // User's email address
    email: v.string(),
    // User's full name (optional, might not always be available)
    name: v.optional(v.string()),
    // URL of the user's profile picture (optional)
    pictureUrl: v.optional(v.string()),
  })
    // Index the table by Clerk ID for efficient lookups
    .index("by_clerk_id", ["clerkId"])
    // Optionally, index by email if you need to query by email frequently
    .index("by_email", ["email"]),

  // Define the 'vehicles' table
  vehicles: defineTable({
    // Link to the user who owns the vehicle
    userId: v.id("users"),
    // Basic Info
    make: v.string(),
    model: v.string(),
    year: v.number(),
    bodyType: v.string(), // e.g., Sedan, SUV
    transmission: v.string(), // e.g., Automatic, Manual
    fuelType: v.string(), // e.g., Petrol, Diesel, Electric
    seats: v.number(),
    color: v.string(),
    licensePlateNumber: v.optional(v.string()), // Optional
    // Performance & Features
    engineSize: v.optional(v.string()), // e.g., 2.0L
    mileage: v.number(), // in km or miles
    features: v.array(v.string()), // e.g., ["Bluetooth", "GPS"]
    hasAirConditioning: v.boolean(),
    hasGps: v.boolean(),
    // Location
    pickupLocation: v.string(), // Address string for now
    deliveryAvailable: v.boolean(),
    // Media (Storing URLs or placeholder text for now, actual file handling requires Convex file storage integration)
    photos: v.array(v.string()),
    registrationDocumentUrl: v.optional(v.string()),
    insuranceDocumentUrl: v.optional(v.string()),
  })
  .index("by_userId", ["userId"]), // Index by user for efficient lookup of user's vehicles

  // ... you can define other tables here later (e.g., rentals)
}); 