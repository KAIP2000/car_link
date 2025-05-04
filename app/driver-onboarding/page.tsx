"use client"

import * as React from "react"
import { useMutation } from "convex/react"
import { useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

// Define Zod schema for form validation, matching Convex args
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
  // Media - handled separately for now
  photos: z.array(z.string()).optional().default([]), // Placeholder
  registrationDocumentUrl: z.string().optional(), // Placeholder
  insuranceDocumentUrl: z.string().optional(), // Placeholder
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

export default function DriverOnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const addVehicle = useMutation(api.vehicles.addVehicle);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: "Toyota",
      model: "Corolla",
      year: 2021,
      bodyType: "Sedan",
      transmission: "Automatic", 
      fuelType: "Petrol", 
      seats: 5,
      color: "White",
      licensePlateNumber: "",
      engineSize: "",
      mileage: 45000,
      features: ["Air Conditioning", "Bluetooth", "GPS"],
      hasAirConditioning: true,
      hasGps: true,
      pickupLocation: "123 Main St, San Francisco, CA",
      deliveryAvailable: false,
      photos: [],
      registrationDocumentUrl: undefined,
      insuranceDocumentUrl: undefined,
    },
  });

  const onSubmit = async (data: VehicleFormData) => {
    if (!user) {
      toast.error("You must be logged in to add a vehicle.");
      return;
    }

    setIsLoading(true);
    try {
      const vehicleData = {
        ...data,
        photos: [], // Replace with actual URLs later
        registrationDocumentUrl: undefined, // Replace with actual URL later
        insuranceDocumentUrl: undefined, // Replace with actual URL later
      };
      
      await addVehicle(vehicleData);
      toast.success("Vehicle added successfully!");
      // Redirect to the homepage after successful submission
      router.push("/"); // Changed from /dashboard
    } catch (error) { 
      console.error("Failed to add vehicle:", error);
      toast.error("Failed to add vehicle. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for form state errors
  const getError = (fieldName: keyof VehicleFormData) => {
    return form.formState.errors[fieldName]?.message;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Driver Onboarding - Add Your Vehicle</CardTitle>
            <CardDescription>
              Fill in the details about the vehicle you want to list on Car Link.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                    />
                    <Label htmlFor="hasAirConditioning" className="font-normal">
                      Has Air Conditioning?
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                        id="hasGps"
                        {...form.register("hasGps")} 
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
                  Photo and document uploads will be available soon. For now, please focus on the vehicle details.
                </p>
                {/* Add file input components here later */}
              </section>

              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? "Adding Vehicle..." : "Add Vehicle"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 