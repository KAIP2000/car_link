import Image from "next/image"
import Link from "next/link"
import type { Doc } from "@/convex/_generated/dataModel"
import { CarCard } from "./car-card"
import { Skeleton } from "./ui/skeleton"

// Define props for CarGrid
interface CarGridProps {
  vehicles?: Doc<"vehicles">[]
}

// Add default empty array for vehicles prop
export function CarGrid({ vehicles = [] }: CarGridProps) {
  // Display placeholder data on home page when no vehicles are provided
  if (vehicles.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-lg border overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="relative aspect-[4/3] bg-gray-200">
              <div className="flex items-center justify-center h-full w-full">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-12 w-12 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="p-4">
              <div className="h-6 mb-2 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 mb-3 bg-gray-200 rounded w-1/2"></div>
              <div className="flex gap-1 mt-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {vehicles.map((vehicle) => (
        <CarCard key={vehicle._id} vehicle={vehicle} />
      ))}
    </div>
  )
}
