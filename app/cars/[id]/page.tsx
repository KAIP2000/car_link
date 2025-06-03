"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Car, MapPin, Gauge, Users, GitBranch, Droplet, Zap, Snowflake, Check, Star, MessageSquare, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    // Immediately redirect any user trying to access this page
    router.replace('/manage-my-cars');
  }, [router]); // router dependency ensures effect runs if router changes, though unlikely here

  // The rest of the component will likely not render due to immediate redirect.
  // However, to prevent flash of content or errors, we can return a loading/null state.
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 text-center">
      <p>Redirecting...</p>
      {/* You could also use a skeleton or loading spinner here */}
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