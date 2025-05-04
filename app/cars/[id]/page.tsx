"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Car, MapPin, Gauge, Users, GitBranch, Droplet, Zap, Snowflake, Check, Star, MessageSquare } from 'lucide-react'; // Icons

export default function VehicleDetailPage() {
  const params = useParams();
  const vehicleId = params.id as Id<"vehicles">; // Get ID from URL

  // Fetch the specific vehicle with owner details
  const vehicleWithOwner = useQuery(api.vehicles.getVehicleWithOwner, {
    vehicleId: vehicleId,
  });

  const isLoading = vehicleWithOwner === undefined;
  const vehicleNotFound = vehicleWithOwner === null;

  if (isLoading) {
    return <VehicleDetailSkeleton />; // Show loading state
  }

  if (vehicleNotFound || !vehicleWithOwner) {
    return <div className="container mx-auto py-12 px-4 md:px-6 text-center">Vehicle not found.</div>;
  }

  const vehicle = vehicleWithOwner;
  const owner = vehicle.owner;

  // Use the first photo URL or a placeholder
  const primaryImageUrl = vehicle.photos && vehicle.photos.length > 0 
    ? (typeof vehicle.photos[0] === 'string' 
        ? vehicle.photos[0] 
        : vehicle.photos[0].url)
    : "/placeholder.svg";
  // TODO: Update with actual image URLs from storage

  // Get owner initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const ownerInitials = owner?.name ? getInitials(owner.name) : "CH"; // CH for "Car Host" 

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery (Simple for now) */}
        <div className="space-y-4">
           <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-gray-100">
             {primaryImageUrl === "/placeholder.svg" ? (
              <div className="flex items-center justify-center h-full w-full bg-gray-200">
                 <Car className="w-24 h-24 text-gray-400" />
              </div>
            ) : (
              <Image
                src={primaryImageUrl}
                alt={`${vehicle.make} ${vehicle.model} primary image`}
                fill
                className="object-cover"
                 priority
              />
            )}
          </div>
          {/* TODO: Add thumbnail gallery if multiple photos exist */}
        </div>

        {/* Vehicle Details & Booking */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">{`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</h1>
            <p className="text-lg text-gray-600">{vehicle.color} &bull; {vehicle.bodyType}</p>
             {/* Add Price later */}
             {/* <p className="text-2xl font-semibold mt-4">£{vehicle.dailyRate || 'N/A'} <span className="text-sm font-normal text-gray-500">/ day</span></p> */}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-6">
             <DetailItem icon={MapPin} label="Pickup Location" value={vehicle.pickupLocation} />
             <DetailItem icon={Users} label="Seats" value={`${vehicle.seats}`} />
             <DetailItem icon={Gauge} label="Mileage" value={`${vehicle.mileage.toLocaleString()} miles`} />
             <DetailItem icon={GitBranch} label="Transmission" value={vehicle.transmission} />
             <DetailItem icon={Droplet} label="Fuel Type" value={vehicle.fuelType} />
             {vehicle.engineSize && <DetailItem icon={Zap} label="Engine" value={vehicle.engineSize} />}
          </div>

          {vehicle.features && vehicle.features.length > 0 && (
             <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-3">Features</h2>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map(feature => (
                   <Badge key={feature} variant="outline" className="text-sm">
                    {feature === 'Air Conditioning' && <Snowflake className="h-4 w-4 mr-1.5" />}
                    {feature === 'GPS' && <MapPin className="h-4 w-4 mr-1.5" />} 
                    {/* Add other relevant icons */} 
                    {feature}
                   </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="border-t pt-6 space-y-2">
             <DetailItem 
                icon={Check} 
                label="Delivery Available?" 
                value={vehicle.deliveryAvailable ? "Yes" : "No"} 
             />
          </div>

          {/* Host Information */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-3">Meet Your Host</h2>
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                {owner?.pictureUrl ? (
                  <AvatarImage src={owner.pictureUrl} alt={owner?.name || "Car Host"} />
                ) : null}
                <AvatarFallback>{ownerInitials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{owner?.name || "Car Link Host"}</div>
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  <span>4.9 • 24 trips • Joined 2023</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-x-2">
              <Button variant="outline" size="sm" className="rounded-full border-amber-100">
                <MessageSquare className="h-4 w-4 mr-2 text-amber-600" />
                Message Host
              </Button>
            </div>
          </div>

          {/* Call to Action Button */} 
          <div className="pt-6">
             <Button size="lg" variant="gold" className="w-full text-lg">
                Book Now
             </Button>
             {/* TODO: Add booking logic/modal trigger here */}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Skeleton Component --- 
function VehicleDetailSkeleton() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            <Skeleton className="aspect-square w-full rounded" />
            <Skeleton className="aspect-square w-full rounded" />
            <Skeleton className="aspect-square w-full rounded" />
            <Skeleton className="aspect-square w-full rounded" />
          </div>
        </div>
        {/* Details Skeleton */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-8 w-1/4" />
          </div>
          <div className="grid grid-cols-2 gap-4 border-t pt-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            ))}
          </div>
           <div className="border-t pt-6 space-y-3">
             <Skeleton className="h-6 w-1/4 mb-3" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                 <Skeleton className="h-6 w-20 rounded-full" />
                 <Skeleton className="h-6 w-28 rounded-full" />
              </div>
           </div>
           
           {/* Host Information Skeleton */}
           <div className="border-t pt-6 space-y-3">
             <Skeleton className="h-6 w-1/3 mb-3" />
             <div className="flex items-center">
               <Skeleton className="h-12 w-12 rounded-full mr-4" />
               <div className="space-y-2">
                 <Skeleton className="h-5 w-32" />
                 <Skeleton className="h-4 w-40" />
               </div>
             </div>
             <div className="mt-2">
               <Skeleton className="h-9 w-36 rounded-full" />
             </div>
           </div>
           
            <div className="pt-6">
              <Skeleton className="h-12 w-full" />
           </div>
        </div>
      </div>
    </div>
  );
}

// --- Detail Item Helper --- 
function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) {
  return (
    <div className="flex flex-col space-y-1">
      <span className="text-sm font-medium text-gray-500 flex items-center">
        <Icon className="h-4 w-4 mr-1.5 flex-shrink-0" />
        {label}
      </span>
      <span className="text-md font-semibold">{value}</span>
    </div>
  );
} 