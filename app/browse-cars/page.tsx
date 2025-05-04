"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CarGrid } from "@/components/car-grid"; // Reuse existing grid
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

export default function BrowseCarsPage() {
  // Fetch vehicles using the Convex query
  const vehicles = useQuery(api.vehicles.getAllVehicles);

  const isLoading = vehicles === undefined;

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold mb-8">Browse All Cars</h1>

      {isLoading ? (
        // Show loading skeletons
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      ) : vehicles && vehicles.length > 0 ? (
        // Pass fetched vehicles to the CarGrid
        <CarGrid vehicles={vehicles} /> 
      ) : (
        // Handle case where there are no vehicles
        <p className="text-center text-gray-500">No cars found.</p>
      )}
    </div>
  );
} 