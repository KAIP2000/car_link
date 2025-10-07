"use client"

import * as React from "react"
import { useMutation } from "convex/react"
import { useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Upload, X, Check, ChevronRight, ChevronLeft, Camera, Loader2, Plus } from "lucide-react"
import Image from "next/image"

import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Id } from "@/convex/_generated/dataModel"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

// Define required vehicle photos
const requiredPhotos = [
  { id: "front-left", label: "Front & Left Side", placeholder: "/images/vehicle-front-left.svg" },
  { id: "back-right", label: "Back & Right Side", placeholder: "/images/vehicle-back-right.svg" },
  { id: "interior-front", label: "Front Interior", placeholder: "/images/vehicle-interior-front.svg" },
  { id: "interior-back", label: "Back Interior", placeholder: "/images/vehicle-interior-back.svg" },
];

// Define Zod schema for form validation, matching Convex args
const vehicleSchema = z.object({
  // Basic Info
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1900, "Invalid year").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  carType: z.string().min(1, "Car type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  seats: z.coerce.number().min(1, "At least 1 seat required").max(20, "Too many seats"),
  color: z.string().min(1, "Color is required"),
  licensePlateNumber: z.string().min(1, "License plate number is required"),
  personalNumber: z.string().min(1, "Personal number (phone number) is required"),
  chassisNumber: z.string().min(1, "Chassis number is required"),
  engineNumber: z.string().min(1, "Engine number is required"),
  
  // Performance & Features
  engineSize: z.string().optional(),
  mileage: z.coerce.number().min(0, "Mileage is required"),
  features: z.array(z.string()).optional().default([]),
  hasAirConditioning: z.boolean().default(false),
  hasGps: z.boolean().default(false),
  
  // Location
  pickupLocation: z.string().min(1, "Pickup location is required"),
  deliveryAvailable: z.boolean().default(false),
  
  // Media - now required
  photos: z.array(z.object({
    url: z.string(),
    description: z.string()
  })).min(4, "At least 4 photos required"),
  
  // Terms acceptance
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
  dailyPrice: z.coerce.number().min(1, "Daily price is required"),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

export default function VehicleRegistrationPage() {
  const { user } = useUser();
  const router = useRouter();
  const addVehicle = useMutation(api.vehicles.addVehicle);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const updateVehicleImage = useMutation(api.storage.updateVehicleImage);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [tempVehicleId, setTempVehicleId] = React.useState<string | null>(null);
  
  // For photo uploads
  const [photos, setPhotos] = React.useState<Array<{
    url: string, 
    description: string, 
    photoType: string,
    file?: File, // Store actual file for later upload
    storageId?: string
  }>>([]);
  
  const [customPhotos, setCustomPhotos] = React.useState<Array<{
    url: string, 
    description: string, 
    photoType: string,
    file?: File, // Store actual file for later upload
    storageId?: string
  }>>([]);
  
  const [uploadingPhoto, setUploadingPhoto] = React.useState<string | null>(null);

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: "",
      model: "",
      year: undefined,
      carType: "",
      transmission: "",
      fuelType: "",
      seats: undefined,
      color: "",
      licensePlateNumber: "",
      personalNumber: "",
      chassisNumber: "",
      engineNumber: "",
      engineSize: "",
      mileage: undefined,
      features: [],
      hasAirConditioning: false,
      hasGps: false,
      pickupLocation: "",
      deliveryAvailable: false,
      photos: [],
      termsAccepted: false,
      dailyPrice: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof vehicleSchema>) => {
    try {
      if (currentStep < 3) {
        // Go to next step without submitting yet
        setCurrentStep(prev => prev + 1);
        return;
      }

      // Final submission - upload photos to Convex and submit the full form
      setIsLoading(true);
      
      // Upload all photos to Convex and get their permanent URLs
      const uploadedPhotos = await uploadAllPhotosToConvex();
      
      // Omit termsAccepted as it's not part of the database schema
      const { termsAccepted, ...vehicleData } = values;
      
      // Add the vehicle with the uploaded photos
      if (uploadedPhotos.length > 0) {
        const processedData = {
          ...vehicleData,
          // Explicitly convert to numbers to satisfy Convex validation
          mileage: Number(vehicleData.mileage),
          year: Number(vehicleData.year),
          seats: Number(vehicleData.seats),
          dailyPrice: Number(vehicleData.dailyPrice) // Ensure dailyPrice is a number
        };
        
        const addedVehicle = await addVehicle({
          ...processedData,
          photos: uploadedPhotos
        });
        
        toast.success("Vehicle added successfully!");
        router.push('/manage-my-cars');
      } else {
        toast.error("Failed to upload photos. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for form state errors
  const getError = (fieldName: keyof VehicleFormData) => {
    return form.formState.errors[fieldName]?.message;
  };
  
  // File upload handler - now just stores locally instead of sending to Convex immediately
  const handleFileUpload = async (file: File, description: string, photoType: string) => {
    if (!file) return;
    
    try {
      setUploadingPhoto(description);
      
      // Create a local URL for display
      const localUrl = URL.createObjectURL(file);
      
      // Create a new photo object with local URL and save the file for later upload
      const newPhoto = {
        url: localUrl,
        description,
        photoType,
        file: file // Store the actual file for later upload
      };
      
      if (requiredPhotos.some(p => p.id === photoType)) {
        // Replace or add to the required photos
        const existing = photos.findIndex(p => p.photoType === photoType);
        if (existing >= 0) {
          const updatedPhotos = [...photos];
          updatedPhotos[existing] = newPhoto;
          setPhotos(updatedPhotos);
        } else {
          setPhotos([...photos, newPhoto]);
        }
      } else {
        // Add to custom photos
        setCustomPhotos([...customPhotos, newPhoto]);
      }
      
      toast.success(`Added ${description} successfully`);
    } catch (error) {
      console.error("Error handling photo:", error);
      toast.error(`Failed to add ${description}`);
    } finally {
      setUploadingPhoto(null);
    }
  };
  
  // File input change handler
  const handlePhotoSelect = async (description: string, photoType: string) => {
    // Create an invisible file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    // Listen for file selection
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleFileUpload(file, description, photoType);
      }
    };
    
    // Trigger file selection dialog
    input.click();
  };
  
  const removePhoto = (photoType: string, isCustom: boolean) => {
    if (isCustom) {
      setCustomPhotos(customPhotos.filter(p => p.photoType !== photoType));
    } else {
      setPhotos(photos.filter(p => p.photoType !== photoType));
    }
  };
  
  // Update form value whenever photos change
  React.useEffect(() => {
    form.setValue('photos', [...photos, ...customPhotos].map(photo => ({
      url: photo.url,
      description: photo.description
    })));
  }, [photos, customPhotos, form]);

  // Custom description input for additional photos
  const [customDescription, setCustomDescription] = React.useState("");
  
  // Next step handler
  const handleNextStep = async () => {
    if (currentStep === 1) {
      // Validate only the fields in step 1
      const result = await form.trigger([
        'make', 'model', 'year', 'carType', 'transmission', 
        'fuelType', 'seats', 'color', 'licensePlateNumber',
        'engineSize', 'mileage', 'features', 'hasAirConditioning', 
        'hasGps', 'pickupLocation', 'deliveryAvailable'
      ]);
      
      if (result) {
        setCurrentStep(2);
        window.scrollTo(0, 0);
      }
    } else if (currentStep === 2) {
      // Validate photos
      const result = await form.trigger(['photos']);
      
      if (result) {
        setCurrentStep(3);
        window.scrollTo(0, 0);
      }
    }
  };
  
  // Previous step handler
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Add custom photo
  const handleAddCustomPhoto = () => {
    if (customDescription.trim()) {
      handlePhotoSelect(customDescription, "custom");
      setCustomDescription("");
    } else {
      toast.error("Please enter a description for your photo");
    }
  };

  // Function to upload all photos to Convex
  const uploadAllPhotosToConvex = async () => {
    const allPhotos = [...photos, ...customPhotos];
    const uploadedPhotos: string[] = []; // Change to string[] to match schema
    
    for (const photo of allPhotos) {
      if (photo.file) {
        try {
          // 1. Generate upload URL
          const uploadUrl = await generateUploadUrl();
          
          // 2. Upload the file
          const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": photo.file.type },
            body: photo.file,
          });
          
          if (!result.ok) {
            throw new Error(`Failed to upload image: ${result.statusText}`);
          }
          
          // 3. Get storage ID
          const { storageId } = await result.json();
          
          // 4. Get permanent URL
          const finalResult = await updateVehicleImage({
            vehicleId: "temp",
            storageId,
            description: photo.description,
            photoType: photo.photoType,
          });
          
          // Add just the URL to the uploadedPhotos array
          uploadedPhotos.push(finalResult.url);
          
        } catch (error) {
          console.error("Error uploading photo to Convex:", error);
          // Continue with other photos even if one fails
        }
      }
    }
    
    return uploadedPhotos;
  };

  // Handle final form submission
  const handleFinalSubmit = async () => {
    if (!form.watch("termsAccepted")) {
      toast.error("You must accept the terms and conditions to proceed");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 1. Upload all photos to Convex and get their permanent URLs
      const uploadedPhotos = await uploadAllPhotosToConvex();
      
      // 2. Get the form data but exclude termsAccepted
      const formData = form.getValues();
      const { termsAccepted, ...vehicleData } = formData;
      
      // Ensure numeric fields are properly converted to numbers
      const processedData = {
        ...vehicleData,
        // Explicitly convert to numbers to satisfy Convex validation
        mileage: Number(vehicleData.mileage),
        year: Number(vehicleData.year),
        seats: Number(vehicleData.seats),
        dailyPrice: Number(vehicleData.dailyPrice) // Ensure dailyPrice is a number
      };
      
      // 3. Add the vehicle with the uploaded photos
      if (uploadedPhotos.length > 0) {
        const addedVehicle = await addVehicle({
          ...processedData,
          photos: uploadedPhotos
        });
        
        toast.success("Vehicle added successfully!");
        router.push('/manage-my-cars');
      } else {
        toast.error("Failed to upload photos. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Form step navigation
  const onNext = async () => {
    if (currentStep === 1) {
      const basicInfoFields: (keyof VehicleFormData)[] = [
        'make', 'model', 'year', 'carType', 'transmission', 
        'fuelType', 'seats', 'color', 'chassisNumber', 'engineNumber',
        'licensePlateNumber', 'dailyPrice', 'mileage', 'pickupLocation'
      ];
      const isValid = await form.trigger(basicInfoFields);
      if (isValid) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    } else if (currentStep < 3) { 
      if (canProceedToNext()) { 
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    }
  };
  
  const onPrevious = () => {
    if (currentStep > 1) { 
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Check if can proceed to next step
  const canProceedToNext = () => {
    if (currentStep === 0) {
      // Basic info validation
      return form.watch("make") && form.watch("model") && form.watch("year") && 
             form.watch("carType") && form.watch("transmission") && 
             form.watch("fuelType");
    } else if (currentStep === 1) {
      // Features validation
      return true; // Optional fields, can proceed
    } else if (currentStep === 2) {
      // Photos validation 
      return photos.length >= 1; // At least one photo required
    }
    return true;
  };
  
  // Form navigation buttons
  const renderNavigationButtons = () => (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1 || isLoading}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
      
      {currentStep < 3 ? (
        <Button
          type="button"
          onClick={onNext}
          disabled={
            isLoading ||
            // For Basic Info (step 1), allow click to trigger validation in onNext.
            // Button is only disabled by isLoading.
            // For other steps (step 2), use canProceedToNext for disabled state.
            (currentStep === 1 ? false : !canProceedToNext())
          }
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={handleFinalSubmit}
          disabled={isLoading || !form.watch("termsAccepted")}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      )}
    </div>
  );

  // Define steps for the multi-step form
  const steps = [
    { id: "basic-info", label: "Basic Info" },
    { id: "features", label: "Features & Specs" },
    { id: "photos", label: "Upload Photos" },
    { id: "terms", label: "Review & Submit" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12">
      <div className="w-full md:max-w-4xl mx-auto px-0 sm:px-2">
        <Card className="w-full rounded-none sm:rounded-md shadow-none sm:shadow-lg">
          <CardHeader className="text-center pt-6 sm:pt-6">
            <CardTitle className="text-2xl font-semibold sm:text-3xl">List Your Car</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Fill out the form below to list your car for rental.
            </CardDescription>
            
            {/* Steps Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-1">
                {steps.map((step, index) => (
                  <span key={step.id} className={`text-sm font-medium ${
                    currentStep >= index + 1 ? 'text-black' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                  style={{ 
                    width: `${(currentStep / steps.length) * 100}%`,
                    backgroundColor: "#e6ddca" 
                  }}
                ></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {currentStep === 1 && (
                  <div className="space-y-8">
                    {/* Basic Vehicle Info Section */}
                    <section className="space-y-4">
                      <h3 className="text-lg font-medium border-b pb-2 mb-4">🚗 Basic Vehicle Info</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="make" className="text-base">Make</Label>
                          <Input id="make" {...form.register("make")} placeholder="e.g., Toyota" />
                          {getError("make") && <p className="text-red-500 text-sm mt-1">{getError("make")}</p>}
                        </div>
                        <div>
                          <Label htmlFor="model" className="text-base">Model</Label>
                          <Input id="model" {...form.register("model")} placeholder="e.g., Corolla" />
                          {getError("model") && <p className="text-red-500 text-sm mt-1">{getError("model")}</p>}
                        </div>
                        <FormField
                          control={form.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem className="w-full md:w-1/3">
                              <FormLabel className="text-base">Year</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="e.g., 2022" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage className="text-sm" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="carType"
                          render={({ field }) => (
                            <FormItem className="w-full md:w-1/3">
                              <FormLabel className="text-base">Car Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select car type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Basic Cars">Basic Cars</SelectItem>
                                  <SelectItem value="SUVs & Mid-Size Vehicles">SUVs & Mid-Size Vehicles</SelectItem>
                                  <SelectItem value="Luxury & Premium Vehicles">Luxury & Premium Vehicles</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-sm" />
                            </FormItem>
                          )}
                        />
                        <div>
                          <Label htmlFor="transmission" className="text-base">Transmission</Label>
                          <Select onValueChange={(value) => form.setValue("transmission", value)} defaultValue={form.getValues("transmission")}>
                            <SelectTrigger id="transmission">
                              <SelectValue placeholder="Select transmission" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Automatic">Automatic</SelectItem>
                              <SelectItem value="Manual">Manual</SelectItem>
                            </SelectContent>
                          </Select>
                          {getError("transmission") && <p className="text-red-500 text-sm mt-1">{getError("transmission")}</p>}
                        </div>
                        <div>
                          <Label htmlFor="fuelType" className="text-base">Fuel Type</Label>
                          <Select onValueChange={(value) => form.setValue("fuelType", value)} defaultValue={form.getValues("fuelType")}>
                            <SelectTrigger id="fuelType">
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Super Unleaded">Super Unleaded</SelectItem>
                              <SelectItem value="Premium Unleaded">Premium Unleaded</SelectItem>
                              <SelectItem value="Electric">Electric</SelectItem>
                              <SelectItem value="Hybrid">Hybrid</SelectItem>
                              <SelectItem value="CNG">CNG</SelectItem>
                            </SelectContent>
                          </Select>
                          {getError("fuelType") && <p className="text-red-500 text-sm mt-1">{getError("fuelType")}</p>}
                        </div>
                        <div>
                          <Label htmlFor="seats" className="text-base">Number of Seats</Label>
                          <Input id="seats" type="number" {...form.register("seats")} placeholder="e.g., 5" />
                          {getError("seats") && <p className="text-red-500 text-sm mt-1">{getError("seats")}</p>}
                        </div>
                        <div>
                          <Label htmlFor="color" className="text-base">Color</Label>
                          <Input id="color" {...form.register("color")} placeholder="e.g., Silver" />
                          {getError("color") && <p className="text-red-500 text-sm mt-1">{getError("color")}</p>}
                        </div>
                        <div>
                          <Label htmlFor="chassisNumber" className="text-base">Chassis Number (VIN)</Label>
                          <Input id="chassisNumber" {...form.register("chassisNumber")} placeholder="e.g., JN1AZ0000U0000000" />
                          {getError("chassisNumber") && <p className="text-red-500 text-sm mt-1">{getError("chassisNumber")}</p>}
                        </div>
                        <div>
                          <Label htmlFor="engineNumber" className="text-base">Engine Number</Label>
                          <Input id="engineNumber" {...form.register("engineNumber")} placeholder="e.g., 1NZ0000000" />
                          {getError("engineNumber") && <p className="text-red-500 text-sm mt-1">{getError("engineNumber")}</p>}
                        </div>
                        <div>
                          <Label htmlFor="licensePlateNumber" className="text-base">License Plate Number</Label>
                          <Input id="licensePlateNumber" {...form.register("licensePlateNumber")} placeholder="e.g., PAB 1234" />
                          {getError("licensePlateNumber") && <p className="text-red-500 text-sm mt-1">{getError("licensePlateNumber")}</p>}
                        </div>
                        <div>
                          <Label htmlFor="personalNumber" className="text-base">Personal Number (Phone Number)</Label>
                          <Input id="personalNumber" {...form.register("personalNumber")} placeholder="e.g., +1-XXX-XXX-XXXX" />
                          {getError("personalNumber") && <p className="text-red-500 text-sm mt-1">{getError("personalNumber")}</p>}
                        </div>
                        <FormField
                          control={form.control}
                          name="dailyPrice"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="text-base">Daily Price (TTD)</FormLabel>
                              <FormControl>
                                <Input type="number" min={1} step={1} placeholder="e.g., 250" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage className="text-sm" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </section>

                    {/* Performance & Features Section */}
                    <section className="space-y-4">
                      <h3 className="text-lg font-medium border-b pb-2 mb-4">⚙️ Performance & Features</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="engineSize" className="text-base">Engine Size (Optional)</Label>
                          <Input id="engineSize" {...form.register("engineSize")} placeholder="e.g., 1.6L"/>
                        </div>
                        <FormField
                          control={form.control}
                          name="mileage"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="text-base">Mileage</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="e.g., 45000" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage className="text-sm" />
                            </FormItem>
                          )}
                        />
                        <div className="md:col-span-2 space-y-2">
                          <Label className="text-base">Features (Select all that apply)</Label>
                          <div className="flex flex-wrap gap-4">
                            {[ "Bluetooth", "Infotainment System", "Backup Camera", "Sunroof", "Pet-Friendly","Wheelchair Accessible"].map((feature) => (
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
                                <Label htmlFor={`feature-${feature}`} className="font-normal text-base">
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
                          <Label htmlFor="hasAirConditioning" className="font-normal text-base">
                            Has Air Conditioning?
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                              id="hasGps"
                              {...form.register("hasGps")} 
                          />
                          <Label htmlFor="hasGps" className="font-normal text-base">
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
                          <Label htmlFor="pickupLocation" className="text-base">Pickup Location Address</Label>
                          <Textarea 
                              id="pickupLocation"
                              {...form.register("pickupLocation")} 
                              placeholder="Enter the full address where drivers will pick up the car"
                          />
                          {getError("pickupLocation") && <p className="text-red-500 text-sm mt-1">{getError("pickupLocation")}</p>}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                              id="deliveryAvailable"
                              {...form.register("deliveryAvailable")} 
                          />
                          <Label htmlFor="deliveryAvailable" className="font-normal text-base">
                            Delivery Available?
                          </Label>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-8">
                    {/* Photo Upload Form */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Upload Your Car Photos</h3>
                      <p className="text-gray-600 mb-6">
                        High-quality photos increase your car's appeal to potential renters. Please upload clear images of your vehicle.
                      </p>
                      
                      {/* Required Photos Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {requiredPhotos.map((photoType) => (
                          <div key={photoType.id} className="mb-4">
                            <h5 className="font-medium mb-2">{photoType.label}</h5>
                            
                            {photos.some(p => p.photoType === photoType.id) ? (
                              <div className="relative">
                                <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
                                  <Image 
                                    src={photos.find(p => p.photoType === photoType.id)?.url || ''}
                                    alt={photoType.label}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"
                                  onClick={() => removePhoto(photoType.id, false)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div 
                                className="aspect-video bg-gray-100 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors relative overflow-hidden group"
                                onClick={() => uploadingPhoto !== photoType.label && handlePhotoSelect(photoType.label, photoType.id)}
                              >
                                {/* Placeholder image in the background */}
                                <div className="absolute inset-0 opacity-30 group-hover:opacity-20 transition-opacity">
                                  <Image 
                                    src={photoType.placeholder}
                                    alt={`${photoType.label} example`}
                                    fill
                                    className="object-contain p-2"
                                  />
                                </div>

                                {uploadingPhoto === photoType.label ? (
                                  <>
                                    <Loader2 className="h-8 w-8 text-gray-400 mb-2 animate-spin relative z-10" />
                                    <p className="text-sm text-gray-500 relative z-10">Uploading...</p>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-8 w-8 text-gray-400 mb-2 relative z-10" />
                                    <p className="text-sm text-gray-500 relative z-10">Upload {photoType.label}</p>

                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Custom Photos Section */}
                      <div className="mb-4">
                        <h5 className="font-medium mb-2">Add Additional Photos (Optional)</h5>
                        <div className="flex flex-wrap gap-4">
                          {customPhotos.map((photo, index) => (
                            <div key={index} className="relative">
                              <div className="w-32 h-32 bg-gray-100 rounded-md overflow-hidden relative">
                                <Image 
                                  src={photo.url} 
                                  alt={photo.description} 
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="absolute top-2 right-2 rounded-full w-6 h-6 p-0"
                                onClick={() => removePhoto(photo.photoType, true)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          
                          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center">
                            <div className="flex flex-col space-y-2 items-center">
                              <div className="flex items-center space-x-2">
                                <Input 
                                  className="w-24 h-8 text-xs" 
                                  placeholder="Description" 
                                  value={customDescription}
                                  onChange={(e) => setCustomDescription(e.target.value)}
                                />
                                <Button 
                                  size="sm" 
                                  className="h-8 w-8 p-0" 
                                  variant="ghost"
                                  onClick={handleAddCustomPhoto}
                                  disabled={!customDescription.trim()}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-8">
                    {/* Vehicle Summary Section */}
                    <section className="space-y-6 border rounded-md p-6 bg-gray-50 mb-8">
                      <h3 className="text-lg font-medium mb-4 text-gray-800 flex items-center">
                        <span className="bg-black text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">1</span>
                        Vehicle Summary
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Please review all information about your vehicle before submitting.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <div>
                          <h4 className="font-medium mb-3 text-gray-800">Vehicle Details</h4>
                          <div className="space-y-2">
                            <p className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">Make:</span> 
                              <span className="text-gray-900">{form.watch("make")}</span>
                            </p>
                            <p className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">Model:</span> 
                              <span className="text-gray-900">{form.watch("model")}</span>
                            </p>
                            <p className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">Year:</span> 
                              <span className="text-gray-900">{form.watch("year")}</span>
                            </p>
                            <p className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">Color:</span> 
                              <span className="text-gray-900">{form.watch("color")}</span>
                            </p>
                            <p className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">Car Type:</span> 
                              <span className="text-gray-900">{form.watch("carType")}</span>
                            </p>
                            <p className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">Transmission:</span> 
                              <span className="text-gray-900">{form.watch("transmission")}</span>
                            </p>
                            <p className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">Fuel Type:</span> 
                              <span className="text-gray-900">{form.watch("fuelType")}</span>
                            </p>
                            <p className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">Seats:</span> 
                              <span className="text-gray-900">{form.watch("seats")}</span>
                            </p>
                            <p className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">Chassis Number (VIN):</span> 
                              <span className="text-gray-900">{form.watch("chassisNumber")}</span>
                            </p>
                            <p className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">Engine Number:</span> 
                              <span className="text-gray-900">{form.watch("engineNumber")}</span>
                            </p>
                          </div>
                        </div>
                        
                        {/* Additional Info */}
                        <div>
                          <h4 className="font-medium mb-3 text-gray-800">Features & Location</h4>
                          <div className="space-y-2">
                            <p className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">Mileage:</span> 
                              <span className="text-gray-900">{form.watch("mileage").toLocaleString()} miles</span>
                            </p>
                            {form.watch("engineSize") && (
                              <p className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700">Engine Size:</span> 
                                <span className="text-gray-900">{form.watch("engineSize")}</span>
                              </p>
                            )}
                            <p className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">Air Conditioning:</span> 
                              <span className="text-gray-900">{form.watch("hasAirConditioning") ? "Yes" : "No"}</span>
                            </p>
                            <p className="flex justify-between text-sm">
                              <span className="font-medium text-gray-700">GPS:</span> 
                              <span className="text-gray-900">{form.watch("hasGps") ? "Yes" : "No"}</span>
                            </p>
                            
                            <div className="pt-2">
                              <span className="font-medium text-gray-700 text-sm">Features:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {form.watch("features").length > 0 ? (
                                  form.watch("features").map((feature) => (
                                    <span key={feature} className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs">{feature}</span>
                                  ))
                                ) : (
                                  <span className="text-gray-500 text-xs">No additional features specified</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="pt-2">
                              <span className="font-medium text-gray-700 text-sm">Pickup Location:</span>
                              <p className="text-gray-900 text-sm mt-1">{form.watch("pickupLocation")}</p>
                            </div>
                            
                            <p className="flex justify-between text-sm pt-2">
                              <span className="font-medium text-gray-700">Delivery Available:</span> 
                              <span className="text-gray-900">{form.watch("deliveryAvailable") ? "Yes" : "No"}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Photo Summary */}
                      <div className="mt-6">
                        <h4 className="font-medium mb-3 text-gray-800">Vehicle Photos</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {photos.map((photo, i) => (
                            <div key={i} className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                              <Image
                                src={photo.url}
                                alt={photo.description}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1">
                                {photo.description}
                              </div>
                            </div>
                          ))}
                          {customPhotos.map((photo, i) => (
                            <div key={`custom-${i}`} className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                              <Image
                                src={photo.url}
                                alt={photo.description}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1">
                                {photo.description}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Total photos: {photos.length + customPhotos.length}</p>
                      </div>
                    </section>
                  
                    {/* Terms and Conditions */}
                    <section className="space-y-6 border rounded-md p-6">
                      <h3 className="text-lg font-medium mb-4 text-gray-800 flex items-center">
                        <span className="bg-black text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">2</span>
                        Terms and Conditions
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Please review and accept our terms and conditions before listing your vehicle.
                      </p>
                      
                      <div className="border rounded-md p-4 h-48 overflow-y-auto text-sm mb-4 bg-gray-50">
                        <h4 className="font-medium mb-2">Car Link Vehicle Listing Agreement</h4>
                        <p className="mb-2">By listing your vehicle on Car Link, you agree to the following terms:</p>
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>You confirm that you are the legal owner of the vehicle or authorized to list it.</li>
                          <li>The information provided about your vehicle is accurate and complete.</li>
                          <li>You agree to maintain your vehicle in a safe, clean, and operational condition.</li>
                          <li>You will maintain valid insurance coverage for your vehicle during the entire listing period.</li>
                          <li>You agree to the commission structure outlined in our service agreement.</li>
                          <li>You will respond to booking requests in a timely manner.</li>
                          <li>You authorize Car Link to verify the provided information, including vehicle condition and documents.</li>
                          <li>You understand you can remove your listing at any time, subject to existing rental commitments.</li>
                          <li>You agree to indemnify Car Link against any claims arising from the use of your vehicle.</li>
                          <li>You consent to our Privacy Policy and the handling of your personal information.</li>
                        </ol>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms-conditions"
                          checked={form.watch("termsAccepted")}
                          onCheckedChange={(checked) => {
                            form.setValue("termsAccepted", checked === true);
                          }}
                        />
                        <label 
                          htmlFor="terms-conditions" 
                          className="text-sm leading-tight cursor-pointer"
                        >
                          I have read and agree to the Terms and Conditions, and I understand my responsibilities as a vehicle host.
                        </label>
                      </div>
                    </section>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
                      <p className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Once submitted, your listing will be reviewed by our team and typically approved within 24-48 hours.
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {renderNavigationButtons()}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 