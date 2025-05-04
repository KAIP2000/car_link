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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

// Re-use the Zod schema (or define a partial one if needed for updates)
const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1900, "Invalid year").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  bodyType: z.string().min(1, "Body type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  seats: z.coerce.number().min(1, "At least 1 seat required").max(20, "Too many seats"),
  color: z.string().min(1, "Color is required"),
  licensePlateNumber: z.string().optional(),
  engineSize: z.string().optional(),
  mileage: z.coerce.number().min(0, "Mileage cannot be negative"),
  features: z.array(z.string()).optional().default([]),
  hasAirConditioning: z.boolean().default(false),
  hasGps: z.boolean().default(false),
  pickupLocation: z.string().min(1, "Pickup location is required"),
  deliveryAvailable: z.boolean().default(false),
  // Media handled separately
  photos: z.array(z.string()).optional().default([]),
  registrationDocumentUrl: z.string().optional(),
  insuranceDocumentUrl: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

export default function EditVehiclePage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as Id<"vehicles">;

  // Fetch existing vehicle data
  const existingVehicle = useQuery(api.vehicles.getVehicleById, { vehicleId });
  const updateVehicle = useMutation(api.vehicles.updateVehicle);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    // Default values will be set once data is loaded
  });

  // Effect to populate form once existingVehicle data is loaded
  React.useEffect(() => {
    if (existingVehicle) {
      // Map Convex data to form fields
      form.reset({
        make: existingVehicle.make,
        model: existingVehicle.model,
        year: existingVehicle.year,
        bodyType: existingVehicle.bodyType,
        transmission: existingVehicle.transmission,
        fuelType: existingVehicle.fuelType,
        seats: existingVehicle.seats,
        color: existingVehicle.color,
        licensePlateNumber: existingVehicle.licensePlateNumber || "",
        engineSize: existingVehicle.engineSize || "",
        mileage: existingVehicle.mileage,
        features: existingVehicle.features || [],
        hasAirConditioning: existingVehicle.hasAirConditioning,
        hasGps: existingVehicle.hasGps,
        pickupLocation: existingVehicle.pickupLocation,
        deliveryAvailable: existingVehicle.deliveryAvailable,
        photos: existingVehicle.photos || [], // Keep placeholder
        registrationDocumentUrl: existingVehicle.registrationDocumentUrl || undefined, // Keep placeholder
        insuranceDocumentUrl: existingVehicle.insuranceDocumentUrl || undefined, // Keep placeholder
      });
    }
  }, [existingVehicle, form]);

  const onSubmit = async (data: VehicleFormData) => {
    setIsLoading(true);
    try {
      // Prepare data for update (omit media placeholders for now)
      const updateData = { 
        ...data,
        photos: undefined, // Don't update photo array yet
        registrationDocumentUrl: undefined, // Don't update URLs yet
        insuranceDocumentUrl: undefined, 
      };
      
      await updateVehicle({ vehicleId, ...updateData });
      toast.success("Vehicle updated successfully!");
      router.push("/manage-my-cars"); // Go back to the list
    } catch (error: any) {
      console.error("Failed to update vehicle:", error);
      toast.error(`Update failed: ${error.message || "Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for form state errors
  const getError = (fieldName: keyof VehicleFormData) => {
    return form.formState.errors[fieldName]?.message;
  };
  
  const isDataLoading = existingVehicle === undefined;

  if (isDataLoading) {
      return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            {/* Simple form skeleton */}
            <Card>
                 <CardHeader>
                    <Skeleton className="h-8 w-1/2"/>
                    <Skeleton className="h-4 w-3/4"/>
                 </CardHeader>
                 <CardContent className="space-y-8">
                    <Skeleton className="h-10 w-full"/>
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
      <Card>
        <CardHeader>
          <CardTitle>Edit Vehicle: {`${existingVehicle.year} ${existingVehicle.make} ${existingVehicle.model}`}</CardTitle>
          <CardDescription>
            Update the details for this vehicle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Re-use the exact same form structure as onboarding page */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
             {/* Basic Vehicle Info Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2 mb-4">🚗 Basic Vehicle Info</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="make">Make</Label>
                    <Input id="make" {...form.register("make")} />
                    {getError("make") && <p className="text-red-500 text-xs mt-1">{getError("make")}</p>}
                  </div>
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" {...form.register("model")} />
                    {getError("model") && <p className="text-red-500 text-xs mt-1">{getError("model")}</p>}
                  </div>
                   <div>
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" type="number" {...form.register("year")} />
                    {getError("year") && <p className="text-red-500 text-xs mt-1">{getError("year")}</p>}
                  </div>
                   <div>
                    <Label htmlFor="bodyType">Body Type</Label>
                    <Input id="bodyType" {...form.register("bodyType")} placeholder="e.g., Sedan, SUV" />
                    {getError("bodyType") && <p className="text-red-500 text-xs mt-1">{getError("bodyType")}</p>}
                  </div>
                  <div>
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select onValueChange={(value) => form.setValue("transmission", value)} defaultValue={form.getValues("transmission")}>
                      <SelectTrigger id="transmission">
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                     {getError("transmission") && <p className="text-red-500 text-xs mt-1">{getError("transmission")}</p>}
                  </div>
                   <div>
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select onValueChange={(value) => form.setValue("fuelType", value)} defaultValue={form.getValues("fuelType")}>
                      <SelectTrigger id="fuelType">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    {getError("fuelType") && <p className="text-red-500 text-xs mt-1">{getError("fuelType")}</p>}
                  </div>
                   <div>
                    <Label htmlFor="seats">Number of Seats</Label>
                    <Input id="seats" type="number" {...form.register("seats")} />
                    {getError("seats") && <p className="text-red-500 text-xs mt-1">{getError("seats")}</p>}
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" {...form.register("color")} />
                    {getError("color") && <p className="text-red-500 text-xs mt-1">{getError("color")}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="licensePlateNumber">License Plate Number (Optional)</Label>
                    <Input id="licensePlateNumber" {...form.register("licensePlateNumber")} />
                  </div>
                </div>
              </section>

              {/* Performance & Features Section */}
              <section className="space-y-4">
                 <h3 className="text-lg font-medium border-b pb-2 mb-4">⚙️ Performance & Features</h3>
                 <div className="grid md:grid-cols-2 gap-4">
                   <div>
                    <Label htmlFor="engineSize">Engine Size (Optional)</Label>
                    <Input id="engineSize" {...form.register("engineSize")} placeholder="e.g., 2.0L"/>
                  </div>
                  <div>
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input id="mileage" type="number" {...form.register("mileage")} placeholder="e.g., 50000"/>
                    {getError("mileage") && <p className="text-red-500 text-xs mt-1">{getError("mileage")}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Features (Select all that apply)</Label>
                    <div className="flex flex-wrap gap-4">
                       {[ "Bluetooth", "Air Conditioning", "GPS", "Backup Camera", "Sunroof", "Heated Seats"].map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`feature-${feature}`}
                            checked={form.watch("features")?.includes(feature)}
                            onCheckedChange={(checked) => {
                              const currentFeatures = form.getValues("features") || [];
                              if (checked) {
                                form.setValue("features", [...currentFeatures, feature]);
                              } else {
                                form.setValue("features", currentFeatures.filter(f => f !== feature));
                              }
                            }}
                          />
                          <Label htmlFor={`feature-${feature}`} className="font-normal">
                            {feature}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                   <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="hasAirConditioning"
                        {...form.register("hasAirConditioning")} 
                        checked={form.watch("hasAirConditioning")}
                        onCheckedChange={(checked) => form.setValue("hasAirConditioning", Boolean(checked))}
                    />
                    <Label htmlFor="hasAirConditioning" className="font-normal">
                      Has Air Conditioning?
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="hasGps"
                        {...form.register("hasGps")} 
                         checked={form.watch("hasGps")}
                        onCheckedChange={(checked) => form.setValue("hasGps", Boolean(checked))}
                    />
                    <Label htmlFor="hasGps" className="font-normal">
                      Has GPS?
                    </Label>
                  </div>
                 </div>
              </section>

              {/* Location Section */}
              <section className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2 mb-4">📍 Location</h3>
                 <div className="space-y-4">
                   <div>
                    <Label htmlFor="pickupLocation">Pickup Location Address</Label>
                    <Textarea 
                        id="pickupLocation"
                        {...form.register("pickupLocation")} 
                        placeholder="Enter the full address where drivers will pick up the car"
                    />
                    {getError("pickupLocation") && <p className="text-red-500 text-xs mt-1">{getError("pickupLocation")}</p>}
                  </div>
                   <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="deliveryAvailable"
                        {...form.register("deliveryAvailable")} 
                         checked={form.watch("deliveryAvailable")}
                        onCheckedChange={(checked) => form.setValue("deliveryAvailable", Boolean(checked))}
                    />
                    <Label htmlFor="deliveryAvailable" className="font-normal">
                      Delivery Available?
                    </Label>
                  </div>
                 </div>
              </section>

              {/* Media Section (Placeholder) */}
              <section className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2 mb-4">🖼️ Media (Coming Soon)</h3>
                <p className="text-sm text-gray-500">
                  Photo and document uploads will be available soon.
                </p>
                {/* TODO: Add file upload/management components here */}
              </section>

            <div className="flex justify-end gap-2">
               <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
               </Button>
               <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
                 {isLoading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 