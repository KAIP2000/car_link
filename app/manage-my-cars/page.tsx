"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Pencil, Plus, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Authenticated } from "convex/react";

export default function ManageMyCarsPage() {
  return (
    <Authenticated>
      <ManageMyCarsContent />
    </Authenticated>
  );
}

function ManageMyCarsContent() {
  const userVehicles = useQuery(api.vehicles.getVehiclesByCurrentUser);
  const isLoading = userVehicles === undefined;

  const getVerificationBadge = (status?: string) => {
    if (!status || status === "pending") {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending Review
        </Badge>
      );
    } else if (status === "verified") {
      return (
        <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Verified
        </Badge>
      );
    } else if (status === "unsuccessful") {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Needs Attention
        </Badge>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Vehicles</h1>
            <p className="text-gray-600">Manage your listed vehicles and track their status</p>
          </div>
          <Button asChild size="lg" className="bg-[#e6ddca] hover:bg-[#d4ccb8] text-black w-full sm:w-auto">
            <Link href="/vehicle-registration">
              <Plus className="h-5 w-5 mr-2" />
              Add New Vehicle
            </Link>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-[16/10] w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Vehicle Grid */}
        {!isLoading && userVehicles && userVehicles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {userVehicles.map((vehicle) => {
              // Handle both string and object photo formats
              const imageUrl = vehicle.photos && vehicle.photos.length > 0 
                ? (typeof vehicle.photos[0] === 'string' 
                    ? vehicle.photos[0] 
                    : vehicle.photos[0].url) 
                : "/placeholder.svg";
              
              return (
                <Card key={vehicle._id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                  {/* Vehicle Image */}
                  <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden">
                    {imageUrl === "/placeholder.svg" ? (
                      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-200 to-gray-300">
                        <Car className="w-16 h-16 text-gray-400" />
                      </div>
                    ) : (
                      <Image
                        src={imageUrl}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                    {/* Verification Badge Overlay */}
                    <div className="absolute top-3 right-3">
                      {getVerificationBadge(vehicle.verificationStatus)}
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-bold text-gray-900 line-clamp-1">
                      {`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    </CardTitle>
                    <p className="text-sm text-gray-500 line-clamp-1">{vehicle.carType}</p>
                  </CardHeader>

                  <CardContent className="flex-grow pb-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Daily Rate:</span>
                        <span className="font-semibold text-gray-900">TTD ${vehicle.dailyPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Transmission:</span>
                        <span className="font-medium text-gray-900">{vehicle.transmission}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-gray-900 truncate max-w-[150px]" title={vehicle.pickupLocation}>
                          {vehicle.pickupLocation.split(',')[0]}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  {/* Actions */}
                  <CardFooter className="border-t bg-gray-50 pt-4">
                    <Button variant="outline" size="sm" asChild className="w-full hover:bg-gray-100">
                      <Link href={`/manage-my-cars/${vehicle._id}/edit`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Details
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!userVehicles || userVehicles.length === 0) && (
          <div className="text-center py-16 px-4">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No vehicles yet</h3>
              <p className="text-gray-600 mb-6">
                Start earning by listing your first vehicle on Car Link. It only takes a few minutes!
              </p>
              <Button asChild size="lg" className="bg-[#e6ddca] hover:bg-[#d4ccb8] text-black">
                <Link href="/vehicle-registration">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Vehicle
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 