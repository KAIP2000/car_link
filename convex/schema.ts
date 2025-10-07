// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define the photo object type for vehicle photos
const photoObject = v.object({
  storageId: v.string(),
  url: v.string(),
  description: v.string(),
  photoType: v.optional(v.string()) // e.g., "front-left", "back", "custom"
});

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
    carType: v.string(), // Renamed from bodyType, e.g., "Basic incl small Hatchback", "SUV"
    transmission: v.string(), // e.g., Automatic, Manual
    fuelType: v.string(), // e.g., Petrol, Diesel, Electric
    seats: v.number(),
    color: v.string(),
    licensePlateNumber: v.optional(v.string()), // Optional
    personalNumber: v.string(), // New: Mandatory personal number (phone number)
    chassisNumber: v.optional(v.string()), // Temporarily optional
    engineNumber: v.optional(v.string()), // Temporarily optional
    dailyPrice: v.number(), // Added dailyPrice
    // Performance & Features
    engineSize: v.optional(v.string()), // e.g., 2.0L
    mileage: v.number(), // in km or miles
    features: v.array(v.string()), // e.g., ["Bluetooth", "GPS"]
    hasAirConditioning: v.boolean(),
    hasGps: v.boolean(),
    // Location
    pickupLocation: v.string(), // Address string for now
    deliveryAvailable: v.boolean(),
    // Media - Updated to include storageId, URL, and description for each photo
    photos: v.optional(v.array(photoObject)),
    registrationDocumentUrl: v.optional(v.string()),
    insuranceDocumentUrl: v.optional(v.string()),
    // Verification Status
    verificationStatus: v.optional(v.union(v.literal("pending"), v.literal("verified"), v.literal("unsuccessful"))), // Default: "pending"
  })
  .index("by_userId", ["userId"]), // Index by user for efficient lookup of user's vehicles

  // Define the 'drivers' table
  drivers: defineTable({
    // Link to the user who is the driver
    userId: v.id("users"), // This should be clerkId to match the users table or a direct convex user ID
    clerkUserId: v.optional(v.string()), // <<<< MADE THIS OPTIONAL
    // Driver Information
    fullName: v.string(),
    licenseNumber: v.string(),
    licenseExpiryDate: v.string(), // Store as ISO string
    address: v.string(),
    dateOfBirth: v.string(), // Store as ISO string
    transmissionPreference: v.string(), // "Automatic" or "Manual" or v.union(v.literal("Automatic"), v.literal("Manual"))
    
    // License Image Storage IDs
    frontLicenseImageStorageId: v.optional(v.id("_storage")),
    backLicenseImageStorageId: v.optional(v.id("_storage")),

    // Status and verification
    isVerified: v.boolean(), // Should default to false
    status: v.string(), // "pending", "approved", "rejected", etc.
    createdAt: v.number(), // Use v.number() for timestamps (Date.now())
  })
  .index("by_userId", ["userId"]) // If userId is convex user id
  .index("by_clerkUserId", ["clerkUserId"]), // Index by clerkUserId for efficient lookup

  // Define the 'bookingRequests' table
  bookingRequests: defineTable({
    // Related entities
    vehicleId: v.id("vehicles"),               // The car being requested
    renterUserId: v.id("users"),               // User requesting the rental
    ownerUserId: v.id("users"),                // Owner of the vehicle
    
    // Booking details
    startDate: v.string(),                     // ISO date string
    endDate: v.string(),                       // ISO date string
    durationDays: v.number(),                  // Number of days
    
    // Status tracking
    status: v.string(),                        // "request_sent", "in_progress", "accepted", "rejected"
    statusUpdatedAt: v.string(),               // ISO datetime string
    
    // Communication
    messages: v.optional(v.array(v.object({
      sender: v.id("users"),
      text: v.string(),
      timestamp: v.string()                    // ISO datetime string
    }))),
    
    // Metadata
    createdAt: v.string(),                     // ISO datetime string
    updatedAt: v.string(),                     // ISO datetime string
  })
  .index("by_renterUserId", ["renterUserId"])  // Look up requests by renter
  .index("by_ownerUserId", ["ownerUserId"])    // Look up requests by owner
  .index("by_vehicleId", ["vehicleId"])        // Look up requests by vehicle
  .index("by_status", ["status"]),             // Look up requests by status

  // Define the 'unavailablePeriods' table
  unavailablePeriods: defineTable({
    vehicleId: v.id("vehicles"),
    startDate: v.string(), // ISO date string
    endDate: v.string(),   // ISO date string
    bookingRequestId: v.optional(v.id("bookingRequests")), // Optional link to booking request
    reason: v.string(),    // e.g., "booked", "maintenance", "owner_use"
    createdAt: v.string(), // ISO datetime string
  })
  .index("by_vehicleId", ["vehicleId"])
  .index("by_date_range", ["startDate", "endDate"]),

  // Define the 'feedback' table
  feedback: defineTable({
    clerkUserId: v.string(), // Link to the user who submitted feedback
    message: v.string(),     // The feedback message
    createdAt: v.number(),   // Timestamp of when feedback was submitted
  }).index("by_clerkUserId", ["clerkUserId"]),

  // ... you can define other tables here later (e.g., rentals)
}); 