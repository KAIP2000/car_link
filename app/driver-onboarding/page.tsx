"use client"

import * as React from "react"
import { useMutation, useQuery } from "convex/react"
import { useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { LicenseUploadForm } from "@/components/LicenseUploadForm"

// Define Zod schema for form validation, matching Convex args
const driverSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseExpiryDay: z.string().min(1, "Day is required"),
  licenseExpiryMonth: z.string().min(1, "Month is required"),
  licenseExpiryYear: z.string().min(1, "Year is required"),
  addressLine1: z.string().min(5, "Address line 1 is required"),
  addressLine2: z.string().optional().default(""),
  city: z.string().min(1, "City is required"),
  country: z.string().min(2, "Country is required"),
  birthDay: z.string().min(1, "Day is required"),
  birthMonth: z.string().min(1, "Month is required"),
  birthYear: z.string().min(1, "Year is required"),
  transmissionPreference: z.enum(["Automatic", "Manual"], {
    required_error: "Transmission preference is required",
  }),
});

type DriverFormData = z.infer<typeof driverSchema>;

// Helper function to get days array (1-31)
const getDays = () => {
  return Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
};

// Helper function to get months array
const getMonths = () => {
  return [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" } ,
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
};

// Helper function to get license expiry years (current year + 20 years)
const getLicenseYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 21 }, (_, i) => (currentYear + i).toString());
};

// Helper function to get birth years (18-100 years ago)
const getBirthYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 83 }, (_, i) => (currentYear - 18 - i).toString());
};

export default function DriverOnboardingPage() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const registerDriverMutation = useMutation(api.drivers.registerDriver);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  
  // Query for existing driver profile
  const myDriverProfile = useQuery(api.drivers.getMyDriverProfile);
  const isDriverProfileLoading = myDriverProfile === undefined;
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [frontLicenseFile, setFrontLicenseFile] = React.useState<File | null>(null);
  const [backLicenseFile, setBackLicenseFile] = React.useState<File | null>(null);
  const [showConfirmationScreen, setShowConfirmationScreen] = React.useState(false);

  const form = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      licenseNumber: "",
      licenseExpiryDay: "",
      licenseExpiryMonth: "",
      licenseExpiryYear: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      country: "TT",
      birthDay: "",
      birthMonth: "",
      birthYear: "",
      transmissionPreference: "Automatic",
    },
  });

  // Reset form if user changes (e.g., logs out and logs in as another user)
  React.useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || "",
        licenseNumber: "",
        licenseExpiryDay: "",
        licenseExpiryMonth: "",
        licenseExpiryYear: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        country: "TT",
        birthDay: "",
        birthMonth: "",
        birthYear: "",
        transmissionPreference: "Automatic",
      });
    }
  }, [user, form.reset]);

  const onSubmit = async (values: DriverFormData) => {
    if (!isSignedIn || !user) {
      toast.error("You must be signed in to register as a driver");
      return;
    }

    if (!frontLicenseFile || !backLicenseFile) {
      toast.error("Please upload both front and back images of your license.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Upload front image
      const frontUploadUrl = await generateUploadUrl();
      const frontResult = await fetch(frontUploadUrl, {
        method: "POST",
        headers: { "Content-Type": frontLicenseFile.type },
        body: frontLicenseFile,
      });
      const { storageId: frontLicenseImageId } = await frontResult.json();
      if (!frontLicenseImageId) {
        throw new Error("Failed to get front license image ID.");
      }

      // 2. Upload back image
      const backUploadUrl = await generateUploadUrl();
      const backResult = await fetch(backUploadUrl, {
        method: "POST",
        headers: { "Content-Type": backLicenseFile.type },
        body: backLicenseFile,
      });
      const { storageId: backLicenseImageId } = await backResult.json();
      if (!backLicenseImageId) {
        throw new Error("Failed to get back license image ID.");
      }
      
      // Format dates and address
      const licenseExpiryDate = `${values.licenseExpiryYear}-${values.licenseExpiryMonth.padStart(2, '0')}-${values.licenseExpiryDay.padStart(2, '0')}T00:00:00.000Z`;
      const dateOfBirth = `${values.birthYear}-${values.birthMonth.padStart(2, '0')}-${values.birthDay.padStart(2, '0')}T00:00:00.000Z`;
      const address = `${values.addressLine1}${values.addressLine2 ? ", " + values.addressLine2 : ''}, ${values.city}, ${values.country}`;

      // 3. Call the mutation with the correct, specific fields
      await registerDriverMutation({
        fullName: values.fullName,
        licenseNumber: values.licenseNumber,
        licenseExpiryDate: licenseExpiryDate,
        address: address,
        dateOfBirth: dateOfBirth,
        transmissionPreference: values.transmissionPreference,
        frontLicenseImageId: frontLicenseImageId,
        backLicenseImageId: backLicenseImageId,
      });
      
      setShowConfirmationScreen(true);

    } catch (error) {
      console.error("Error registering driver:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error(`Error registering as a driver: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state for the driver profile query
  if (isDriverProfileLoading) {
    return (
      <div className="container max-w-2xl py-10">
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-1/3 ml-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user already has a driver profile
  if (myDriverProfile && !showConfirmationScreen) { // Ensure confirmation screen takes precedence if active
    return (
      <div className="container max-w-md py-10 flex flex-col items-center text-center">
        <Card className="w-full p-6">
          <CardHeader>
            <CheckCircle2 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Already Registered</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You are already registered as a driver.
            </p>
            <Link href="/vehicle-registration">
              <Button className="w-full">Register a Vehicle</Button>
            </Link>
            <Button variant="outline" onClick={() => router.push("/")} className="w-full">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showConfirmationScreen) {
    return (
      <div className="container max-w-md py-10 flex flex-col items-center text-center">
        <Card className="w-full p-6">
          <CardHeader>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Registration Submitted!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Thank you for registering. Your driver profile and documents are now under review. 
              We will notify you once the review process is complete.
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-10">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Driver Registration</CardTitle>
            <CardDescription>
              Enter your details to register as a driver on Car Link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name field */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* License Number field */}
                <FormField
                  control={form.control}
                  name="licenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver Permit Number</FormLabel>
                      <FormControl>
                        <Input placeholder="DL12345678" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* License Expiry Date fields */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="licenseExpiryDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Day</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getDays().map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="licenseExpiryMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Month</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getMonths().map(month => <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="licenseExpiryYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Year</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getLicenseYears().map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Address fields */}
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2 (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Apartment, studio, or floor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Port of Spain" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        {/* This could be a Select as well if you have a predefined list */}
                        <FormControl>
                          <Input placeholder="Trinidad and Tobago" {...field} /> 
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Date of Birth fields */}
                 <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="birthDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Day</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getDays().map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Month</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getMonths().map(month => <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Year</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getBirthYears().map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Transmission Preference field */}
                <FormField
                  control={form.control}
                  name="transmissionPreference"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Transmission Preference</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Automatic" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Automatic
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Manual" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Manual
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* License Upload Form Integration */}
                <div className="space-y-4 rounded-lg border p-4 shadow-sm">
                  <h3 className="text-lg font-medium">Driver's License Photos</h3>
                  <p className="text-sm text-muted-foreground">
                    Please upload clear images of the front and back of your driver's license.
                  </p>
                  <LicenseUploadForm 
                    onFrontImageSelect={setFrontLicenseFile} 
                    onBackImageSelect={setBackLicenseFile} 
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Registration
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
    </div>
  );
} 