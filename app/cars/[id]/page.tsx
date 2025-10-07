"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Car, MapPin, Gauge, Users, GitBranch, Droplet, Settings, 
  Snowflake, Check, Phone, ArrowLeft, CheckCircle2, Calendar, Fuel 
} from 'lucide-react';
import { useAuth } from "@clerk/nextjs";

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const vehicleId = params.id as Id<"vehicles">;
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch vehicle with owner information
  const vehicleWithOwner = useQuery(api.vehicles.getVehicleWithOwner, { vehicleId });
  const isLoading = vehicleWithOwner === undefined;

  if (isLoading) {
    return <VehicleDetailSkeleton />;
  }

  if (!vehicleWithOwner) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Vehicle Not Found</h1>
        <p className="text-gray-600 mb-6">The vehicle you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/browse-cars')}>Browse Vehicles</Button>
      </div>
    );
  }

  const vehicle = vehicleWithOwner;
  const photos = vehicle.photos && vehicle.photos.length > 0 
    ? vehicle.photos.map(p => typeof p === 'string' ? p : p.url)
    : ["/placeholder.svg"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={photos[selectedImageIndex]}
                alt={`${vehicle.make} ${vehicle.model}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              {vehicle.verificationStatus === "verified" && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified Host
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {photos.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                      selectedImageIndex === index 
                        ? 'ring-2 ring-black' 
                        : 'ring-1 ring-gray-200 hover:ring-gray-300'
                    }`}
                  >
                    <Image
                      src={photo}
                      alt={`${vehicle.make} ${vehicle.model} - Photo ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Vehicle Specifications */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Vehicle Specifications</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <DetailItem icon={Car} label="Make & Model" value={`${vehicle.make} ${vehicle.model}`} />
                  <DetailItem icon={Calendar} label="Year" value={vehicle.year.toString()} />
                  <DetailItem icon={Settings} label="Transmission" value={vehicle.transmission} />
                  <DetailItem icon={Fuel} label="Fuel Type" value={vehicle.fuelType} />
                  <DetailItem icon={Users} label="Seats" value={`${vehicle.seats} passengers`} />
                  <DetailItem icon={Gauge} label="Mileage" value={`${vehicle.mileage.toLocaleString()} km`} />
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {vehicle.hasAirConditioning && (
                      <div className="flex items-center gap-2">
                        <Snowflake className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Air Conditioning</span>
                      </div>
                    )}
                    {vehicle.hasGps && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-500" />
                        <span className="text-sm">GPS Navigation</span>
                      </div>
                    )}
                    {vehicle.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Pickup Location</h2>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-gray-900">{vehicle.pickupLocation}</p>
                    {vehicle.deliveryAvailable && (
                      <Badge variant="secondary" className="mt-2">
                        Delivery Available
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 shadow-xl">
              <CardContent className="p-6 space-y-6">
                {/* Title and Price */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h1>
                  <p className="text-gray-600 mb-4">{vehicle.carType}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">
                      TTD ${vehicle.dailyPrice}
                    </span>
                    <span className="text-gray-600">/day</span>
                  </div>
                </div>

                {/* Host Information */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3">Hosted by</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={vehicle.owner?.pictureUrl} />
                      <AvatarFallback className="bg-[#e6ddca] text-black">
                        {vehicle.owner?.name?.[0] || 'H'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{vehicle.owner?.name || "Car Link Host"}</p>
                      <p className="text-sm text-gray-600">{vehicle.owner?.email || ""}</p>
                    </div>
                  </div>
                </div>

                {/* Contact CTA */}
                <div className="space-y-3 border-t pt-6">
                  <Button 
                    size="lg" 
                    className="w-full bg-[#e6ddca] hover:bg-[#d4ccb8] text-black font-semibold gap-2"
                    onClick={() => {
                      // In a real app, this would open a contact modal or messaging interface
                      window.location.href = `tel:${vehicle.owner?.email || ''}`;
                    }}
                  >
                    <Phone className="h-5 w-5" />
                    Contact Host Now
                  </Button>
                  <p className="text-xs text-center text-gray-600">
                    Get in touch to discuss availability and booking details
                  </p>
                </div>

                {/* Quick Info */}
                <div className="border-t pt-6 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Instant booking available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>24/7 customer support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Flexible cancellation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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