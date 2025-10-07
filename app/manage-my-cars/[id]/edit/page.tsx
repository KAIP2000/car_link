"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Id } from "@/convex/_generated/dataModel";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

// New, simplified Zod schema for updating only price and color
const editVehicleSchema = z.object({
  dailyPrice: z.coerce.number().min(1, "Daily price is required"),
  color: z.string().min(1, "Color is required"),
});

type VehicleEditFormData = z.infer<typeof editVehicleSchema>;

export default function EditVehiclePage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as Id<"vehicles">;

  // Fetch existing vehicle data - still needed for context and initial values
  const existingVehicle = useQuery(api.vehicles.getVehicleById, { vehicleId });
  // Use the new, restricted mutation
  const updateVehicle = useMutation(api.vehicles.updateVehiclePriceAndColor);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<VehicleEditFormData>({
    resolver: zodResolver(editVehicleSchema),
  });

  // Effect to populate form once existingVehicle data is loaded
  React.useEffect(() => {
    if (existingVehicle) {
      form.reset({
        dailyPrice: existingVehicle.dailyPrice,
        color: existingVehicle.color,
      });
    }
  }, [existingVehicle, form.reset]);

  const onSubmit = async (data: VehicleEditFormData) => {
    setIsSubmitting(true);
    try {
      await updateVehicle({ 
        vehicleId, 
        dailyPrice: data.dailyPrice,
        color: data.color,
      });
      toast.success("Vehicle updated successfully!");
      router.push("/manage-my-cars"); // Go back to the list
    } catch (error: any) {
      console.error("Failed to update vehicle:", error);
      toast.error(`Update failed: ${error.message || "Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDataLoading = existingVehicle === undefined;

  if (isDataLoading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2"/>
            <Skeleton className="h-4 w-3/4"/>
          </CardHeader>
          <CardContent className="space-y-8">
            <Skeleton className="h-10 w-full"/>
            <Skeleton className="h-10 w-full"/>
            <Skeleton className="h-12 w-32"/>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (existingVehicle === null) {
    return <div className="container mx-auto py-12 px-4 md:px-6 text-center">Vehicle not found or you don't have permission to edit it.</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Vehicle</CardTitle>
          <CardDescription>
            Update the price and color for your {`${existingVehicle.year} ${existingVehicle.make} ${existingVehicle.model}`}.
          </CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="dailyPrice">Daily Price (TTD)</Label>
              <Input 
                id="dailyPrice" 
                type="number" 
                {...form.register("dailyPrice")} 
                placeholder="e.g., 250"
              />
              {form.formState.errors.dailyPrice && <p className="text-red-500 text-sm mt-1">{form.formState.errors.dailyPrice.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input 
                id="color" 
                {...form.register("color")} 
                placeholder="e.g., Silver"
              />
              {form.formState.errors.color && <p className="text-red-500 text-sm mt-1">{form.formState.errors.color.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/manage-my-cars")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 