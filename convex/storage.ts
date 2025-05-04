import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { action } from "./_generated/server";

// Define the photo type for vehicle schema
export interface Photo {
  url: string;
  description: string;
  storageId: string; // Required in database
  photoType: string; // e.g., "front-left", "back", "custom", etc.
}

// Generate a pre-signed URL for uploading an image
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Get the authenticated user ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized. Please log in to upload files.");
    }

    // Generate a storage URL for upload
    return await ctx.storage.generateUploadUrl();
  },
});

// Update a vehicle's image after upload
export const updateVehicleImage = mutation({
  args: {
    vehicleId: v.union(v.id("vehicles"), v.string()), // Accept both ID and string for temp usage
    storageId: v.string(),
    description: v.string(),
    photoType: v.string(), // Add photoType parameter
  },
  handler: async (ctx, args) => {
    // Get the authenticated user ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized. Please log in to upload images.");
    }

    // Get the URL for the uploaded file
    const url = await ctx.storage.getUrl(args.storageId);
    
    if (!url) {
      throw new Error("Failed to get URL for uploaded file");
    }
    
    // If we have an actual vehicle ID (not a temp frontend ID)
    // Note: We're treating "temp" as a special string ID for photos that haven't been linked yet
    if (typeof args.vehicleId === "object" && args.vehicleId !== "temp") {
      // Update the vehicle with the new image - only for real vehicle IDs
      const vehicleId = args.vehicleId as Id<"vehicles">;
      
      // Fetch the existing vehicle data
      const vehicle = await ctx.db.get(vehicleId);
      if (!vehicle) {
        throw new Error("Vehicle not found");
      }
      
      // Make sure the user owns this vehicle
      if (vehicle.userId !== identity.subject) {
        throw new Error("You don't have permission to update this vehicle");
      }
      
      // Get existing photos or initialize as empty array
      const existingPhotos = vehicle.photos || [];
      
      // Add the new photo information - ensure all properties required for Photo type
      const newPhoto: Photo = {
        url,
        description: args.description,
        storageId: args.storageId,
        photoType: args.photoType,
      };
      
      // Update the vehicle with the new photo
      await ctx.db.patch(vehicleId, {
        photos: [...existingPhotos, newPhoto],
      });
    }
    
    // Return the URL and storage ID for frontend use
    return {
      url,
      storageId: args.storageId,
      photoType: args.photoType,
    };
  },
});

// Delete a vehicle image
export const deleteVehicleImage = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the authenticated user ID
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized. Please log in to delete images.");
    }
    
    // Fetch the existing vehicle data
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }
    
    // Make sure the user owns this vehicle
    if (vehicle.userId !== identity.subject) {
      throw new Error("You don't have permission to update this vehicle");
    }
    
    // Get existing photos
    const existingPhotos = vehicle.photos || [];
    
    // Filter out the photo to delete
    const updatedPhotos = existingPhotos.filter(
      (photo) => photo.storageId !== args.storageId
    );
    
    // Update the vehicle with the filtered photos
    await ctx.db.patch(args.vehicleId, {
      photos: updatedPhotos,
    });
    
    // Delete the file from storage
    await ctx.storage.delete(args.storageId);
    
    return { success: true };
  },
});

// Get a vehicle's images with descriptions
export const getVehicleImages = query({
  args: {
    vehicleId: v.id("vehicles"),
  },
  handler: async (ctx, args) => {
    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle) {
      throw new Error("Vehicle not found");
    }
    
    return vehicle.photos || [];
  },
}); 