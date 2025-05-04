import Image from "next/image"
import Link from "next/link"
import type { Doc } from "@/convex/_generated/dataModel"
import { CarCard } from "./car-card"

// Define props for CarGrid
interface CarGridProps {
  vehicles: Doc<"vehicles">[]
}

// Add default empty array for vehicles prop
export function CarGrid({ vehicles = [] }: CarGridProps) {
  // Optional: Add a check for empty array if you want to display a message here too
  // if (!vehicles || vehicles.length === 0) {
  //   return <p className="text-center text-gray-500 col-span-full">No cars available.</p>;
  // }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {vehicles.map((vehicle) => (
        <CarCard key={vehicle._id} vehicle={vehicle} />
      ))}
    </div>
  )
}
