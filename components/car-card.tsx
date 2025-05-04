import Image from "next/image";
import Link from "next/link";
import type { Doc } from "@/convex/_generated/dataModel"; // Import Doc type
import { Badge } from "@/components/ui/badge"; // For displaying features/tags
import { Car } from 'lucide-react'; // Placeholder icon

interface CarCardProps {
  vehicle: Doc<"vehicles">; // Use the specific type from Convex
}

export function CarCard({ vehicle }: CarCardProps) {
  // Use the first photo as the main image, or a placeholder
  // Handle both string and object photo formats
  const imageUrl = vehicle.photos && vehicle.photos.length > 0 
    ? (typeof vehicle.photos[0] === 'string' 
        ? vehicle.photos[0] 
        : vehicle.photos[0].url) 
    : "/placeholder.svg";
  // TODO: Replace placeholder URL with actual storage URL once file upload is implemented

  return (
    <Link href={`/cars/${vehicle._id}`} className="group block overflow-hidden rounded-lg border hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100"> {/* Use 4/3 aspect ratio */} 
        {imageUrl === "/placeholder.svg" ? (
          <div className="flex items-center justify-center h-full w-full bg-gray-200">
             <Car className="w-12 h-12 text-gray-400" />
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</h3>
        <p className="text-sm text-gray-500 mb-2">{vehicle.bodyType} &bull; {vehicle.seats} Seats</p>
         {/* Optional: Add Price/Rate here later */}
         {/* <p className="text-md font-semibold mb-2">£{vehicle.dailyRate || 'N/A'} / day</p> */}
        <div className="flex flex-wrap gap-1 mt-2">
          {vehicle.features?.slice(0, 3).map((feature) => (
             <Badge key={feature} variant="secondary" className="text-xs">{feature}</Badge>
          ))}
          {vehicle.features && vehicle.features.length > 3 && (
             <Badge variant="secondary" className="text-xs">...</Badge>
          )}
        </div>
      </div>
    </Link>
  );
} 