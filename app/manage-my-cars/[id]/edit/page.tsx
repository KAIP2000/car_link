"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2, Upload, X, Plus } from "lucide-react";
import Image from "next/image";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// 1. Simplified Zod schema for editing
const updateVehicleSchema = z.object({
  color: z.string().min(1, "Color is required"),
  dailyPrice: z.coerce.number().min(1, "Daily price is required"),
  // Photos are managed via state, not direct form validation here
  photos: z.array(z.object({
    url: z.string(),
    description: z.string()
  })).min(4, "At least 4 photos required"),
});

type UpdateVehicleFormData = z.infer<typeof updateVehicleSchema>;

// Re-usable photo type for state management
type PhotoState = {
  url: string;
  description: string;
  file?: File;
  photoType: string;
};

// Define required vehicle photos
const requiredPhotos = [
  { id: "front-left", label: "Front & Left Side", placeholder: "/images/vehicle-front-left.svg" },
  { id: "back-right", label: "Back & Right Side", placeholder: "/images/vehicle-back-right.svg" },
  { id: "interior-front", label: "Front Interior", placeholder: "/images/vehicle-interior-front.svg" },
  { id: "interior-back", label: "Back Interior", placeholder: "/images/vehicle-interior-back.svg" },
];

export default function EditVehiclePage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as Id<"vehicles">;

  // 2. Updated Convex hooks
  const existingVehicle = useQuery(api.vehicles.getVehicleById, { vehicleId });
  const updateVehicleDetails = useMutation(api.vehicles.updateVehicleDetails);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const updateVehicleImage = useMutation(api.storage.updateVehicleImage);

  const [isLoading, setIsLoading] = React.useState(false);
  const [uploadingPhoto, setUploadingPhoto] = React.useState<string | null>(null);

  // 3. State for photos
  const [photos, setPhotos] = React.useState<PhotoState[]>([]);
  const [customPhotos, setCustomPhotos] = React.useState<PhotoState[]>([]);
  const [customDescription, setCustomDescription] = React.useState("");

  const form = useForm<UpdateVehicleFormData>({
    resolver: zodResolver(updateVehicleSchema),
    defaultValues: {
      color: "",
      dailyPrice: undefined,
      photos: [],
    },
  });

  // 4. Effect to populate form and photo state
  React.useEffect(() => {
    if (existingVehicle) {
      form.reset({
        color: existingVehicle.color,
        dailyPrice: existingVehicle.dailyPrice,
      });

      const required: PhotoState[] = [];
      const custom: PhotoState[] = [];

      existingVehicle.photos?.forEach(p => {
        const photo = { ...p, photoType: p.photoType || 'custom' };
        if (requiredPhotos.some(rp => rp.id === photo.photoType)) {
          required.push(photo);
        } else {
          custom.push(photo);
        }
      });

      setPhotos(required);
      setCustomPhotos(custom);
    }
  }, [existingVehicle, form]);

  React.useEffect(() => {
    form.setValue('photos', [...photos, ...customPhotos]);
  }, [photos, customPhotos, form]);

  const handleFileUpload = async (file: File, description: string, photoType: string) => {
    if (!file) return;

    setUploadingPhoto(description);
    const localUrl = URL.createObjectURL(file);
    const newPhoto = { url: localUrl, description, photoType, file };

    if (requiredPhotos.some(p => p.id === photoType)) {
      setPhotos(prev => {
        const existing = prev.findIndex(p => p.photoType === photoType);
        const updated = [...prev];
        if (existing !== -1) updated[existing] = newPhoto;
        else updated.push(newPhoto);
        return updated;
      });
    } else {
      setCustomPhotos(prev => [...prev, newPhoto]);
    }

    setUploadingPhoto(null);
    toast.success(`Updated ${description}`);
  };

  const handlePhotoSelect = (description: string, photoType: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileUpload(file, description, photoType);
    };
    input.click();
  };

  const removePhoto = (photoType: string, isCustom: boolean) => {
    if (isCustom) {
      setCustomPhotos(customPhotos.filter(p => p.photoType !== photoType));
    } else {
      setPhotos(photos.filter(p => p.photoType !== photoType));
    }
  };
  
  const handleAddCustomPhoto = () => {
    if (customDescription.trim()) {
      handlePhotoSelect(customDescription, `custom-${Date.now()}`);
      setCustomDescription("");
    } else {
      toast.error("Please enter a description for your photo");
    }
  };

  const onSubmit = async (data: UpdateVehicleFormData) => {
    setIsLoading(true);
    try {
      let uploadedPhotoUrls: { url: string; description: string; }[] = [];

      // Process existing photos that weren't changed
      const allCurrentPhotos = [...photos, ...customPhotos];
      const photosToKeep = allCurrentPhotos.filter(p => !p.file).map(p => ({ url: p.url, description: p.description }));
      
      // Process new/updated photos
      const photosToUpload = allCurrentPhotos.filter(p => p.file);
      const uploadPromises = photosToUpload.map(async (photo) => {
        if (!photo.file) return null;
        
        // 1. Get upload URL
        const uploadUrl = await generateUploadUrl();

        // 2. POST the file and get the storageId from the response
        const postResponse = await fetch(uploadUrl, { 
          method: "POST", 
          headers: { "Content-Type": photo.file.type }, 
          body: photo.file 
        });

        if (!postResponse.ok) {
          toast.error(`Failed to upload ${photo.description}`);
          return null;
        }

        const { storageId } = await postResponse.json();

        // 3. Get the permanent URL from the storageId via a mutation
        const finalResult = await updateVehicleImage({
          vehicleId, // Pass the actual vehicle ID
          storageId,
          description: photo.description,
          photoType: photo.photoType,
        });

        if (!finalResult.url) {
          toast.error(`Could not get URL for ${photo.description}`);
          return null;
        }
        
        // 4. Return the object that updateVehicleDetails expects
        return { url: finalResult.url, description: photo.description };
      });

      const newUrls = (await Promise.all(uploadPromises)).filter(Boolean) as { url: string, description: string }[];
      uploadedPhotoUrls = [...photosToKeep, ...newUrls];

      await updateVehicleDetails({
        id: vehicleId,
        color: data.color,
        dailyPrice: data.dailyPrice,
        photos: uploadedPhotoUrls,
      });

      toast.success("Vehicle updated successfully!");
      router.push("/manage-my-cars");
    } catch (error: any) {
      console.error("Failed to update vehicle:", error);
      toast.error(`Update failed: ${error.message || "Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (existingVehicle === undefined) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
          <Card>
               <CardHeader><Skeleton className="h-8 w-1/2"/><Skeleton className="h-4 w-3/4"/></CardHeader>
               <CardContent className="space-y-8"><Skeleton className="h-10 w-full"/><Skeleton className="h-10 w-full"/><Skeleton className="h-12 w-32"/></CardContent>
          </Card>
      </div>
    );
  }

  if (existingVehicle === null) {
      return <div className="container mx-auto py-12 px-4 md:px-6 text-center">Vehicle not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12">
      <div className="w-full md:max-w-4xl mx-auto px-0 sm:px-2">
        <Card className="w-full rounded-none sm:rounded-md shadow-none sm:shadow-lg">
          <CardHeader className="text-center pt-6 sm:pt-6">
            <CardTitle className="text-2xl font-semibold sm:text-3xl">Edit Vehicle</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Update your vehicle's price, color, and photos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Simplified fields */}
                <section className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2 mb-4">📝 Vehicle Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dailyPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Daily Price (TTD)</FormLabel>
                          <FormControl><Input type="number" placeholder="e.g., 250" {...field} value={field.value ?? ''} /></FormControl>
                          <FormMessage className="text-sm" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Color</FormLabel>
                          <FormControl><Input placeholder="e.g., Silver" {...field} /></FormControl>
                          <FormMessage className="text-sm" />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>
                
                {/* Re-used Photo Upload UI */}
                <section className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2 mb-4">📷 Vehicle Photos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {requiredPhotos.map((photoType) => {
                      const photo = photos.find(p => p.photoType === photoType.id);
                      return (
                        <div key={photoType.id} className="mb-4">
                          <h5 className="font-medium mb-2">{photoType.label}</h5>
                          {photo ? (
                            <div className="relative">
                              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
                                <Image src={photo.url} alt={photoType.label} fill className="object-cover"/>
                              </div>
                              <Button variant="ghost" size="sm" className="absolute top-2 right-2 rounded-full w-8 h-8 p-0" onClick={() => removePhoto(photoType.id, false)}><X className="h-4 w-4" /></Button>
                            </div>
                          ) : (
                            <div className="aspect-video bg-gray-100 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors relative overflow-hidden group" onClick={() => uploadingPhoto !== photoType.label && handlePhotoSelect(photoType.label, photoType.id)}>
                              <div className="absolute inset-0 opacity-30 group-hover:opacity-20 transition-opacity">
                                <Image src={photoType.placeholder} alt={`${photoType.label} example`} fill className="object-contain p-2"/>
                              </div>
                              {uploadingPhoto === photoType.label ? (
                                <><Loader2 className="h-8 w-8 text-gray-400 mb-2 animate-spin z-10" /><p className="text-sm text-gray-500 z-10">Uploading...</p></>
                              ) : (
                                <><Upload className="h-8 w-8 text-gray-400 mb-2 z-10" /><p className="text-sm text-gray-500 z-10">Upload {photoType.label}</p></>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="font-medium mb-2">Additional Photos</h5>
                    <div className="flex flex-wrap gap-4">
                      {customPhotos.map((photo, index) => (
                        <div key={index} className="relative">
                          <div className="w-32 h-32 bg-gray-100 rounded-md overflow-hidden relative">
                            <Image src={photo.url} alt={photo.description} fill className="object-cover"/>
                          </div>
                          <Button variant="ghost" size="sm" className="absolute top-2 right-2 rounded-full w-6 h-6 p-0" onClick={() => removePhoto(photo.photoType, true)}><X className="h-3 w-3" /></Button>
                        </div>
                      ))}
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center">
                        <div className="flex flex-col space-y-2 items-center">
                          <div className="flex items-center space-x-2">
                            <Input className="w-24 h-8 text-xs" placeholder="Description" value={customDescription} onChange={(e) => setCustomDescription(e.target.value)} />
                            <Button size="sm" className="h-8 w-8 p-0" variant="ghost" onClick={handleAddCustomPhoto} disabled={!customDescription.trim()}><Plus className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Vehicle
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 