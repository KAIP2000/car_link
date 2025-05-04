import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

// Define the Props interface using the Convex document type
interface CarCardProps {
  vehicle: Doc<"vehicles">;
}

export function CarCard({ vehicle }: CarCardProps) {
  // Default image if no photos are available
  const defaultImage = "/placeholder-car.png";
  
  // Handle photo object structure from Convex
  const imageUrl = vehicle.photos && vehicle.photos.length > 0 
    ? vehicle.photos[0].url  // Access the URL property of the photo object
    : defaultImage;

  // Set a placeholder price since it's not in the schema yet
  const price = 50; // Placeholder daily rate

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/cars/${vehicle._id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="font-medium">
              ${price}/day
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-1">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          {vehicle.bodyType && (
            <p className="text-sm text-muted-foreground mb-2">
              {vehicle.bodyType}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {vehicle.pickupLocation?.split(',')[0]}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
            <span className="text-sm font-medium">
              New
            </span>
          </div>
          <div className="flex items-center gap-1">
            {vehicle.features?.slice(0, 2).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
} 