"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Pencil } from 'lucide-react';
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

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold">Manage My Cars</h1>
         <Button asChild>
             <Link href="/driver-onboarding">Add New Car</Link>
         </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="aspect-video w-full rounded" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && userVehicles && userVehicles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userVehicles.map((vehicle) => {
            const imageUrl = vehicle.photos && vehicle.photos.length > 0 ? vehicle.photos[0] : "/placeholder.svg";
            return (
              <Card key={vehicle._id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="truncate">{`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</CardTitle>
                  {/* Optional: Add status badge here */} 
                </CardHeader>
                <CardContent className="flex-grow flex flex-col items-center justify-center">
                  <div className="relative aspect-video w-full max-w-xs mx-auto mb-4 bg-gray-100 rounded overflow-hidden">
                     {imageUrl === "/placeholder.svg" ? (
                       <div className="flex items-center justify-center h-full w-full bg-gray-200">
                          <Car className="w-16 h-16 text-gray-400" />
                       </div>
                    ) : (
                       <Image
                          src={imageUrl}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                       />
                     )}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/manage-my-cars/${vehicle._id}/edit`}>
                      <Pencil className="h-4 w-4 mr-2" /> Edit
                    </Link>
                  </Button>
                  {/* Optional: Add View / Delete buttons */}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {!isLoading && (!userVehicles || userVehicles.length === 0) && (
        <div className="text-center py-10 border rounded-lg bg-gray-50">
           <p className="text-gray-500 mb-4">You haven't added any cars yet.</p>
           <Button asChild>
             <Link href="/driver-onboarding">Add Your First Car</Link>
           </Button>
        </div>
      )}
    </div>
  );
} 