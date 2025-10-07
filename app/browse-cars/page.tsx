"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, Phone, MapPin, Users, Fuel, CheckCircle2 } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchForm } from "@/components/search-form";
import Image from "next/image";
import Link from "next/link";

// Define filter options
const vehicleTypes = ["All", "Sedan", "SUV", "Truck", "Van", "Hatchback", "Coupe", "Convertible"];
const transmissionTypes = ["All", "Automatic", "Manual"];
const seatOptions = ["All", "2", "4", "5", "6", "7+"];
const currentYear = new Date().getFullYear();
const yearOptions = ["All", ...Array.from({ length: 20 }, (_, i) => (currentYear - i).toString())];
const features = ["Air Conditioning", "GPS", "Bluetooth", "Heated Seats", "Backup Camera", "Sunroof"];

export default function BrowseCars() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const make = searchParams.get("make");
  const [isSearching, setIsSearching] = useState(false);

  // Filter states
  const [selectedType, setSelectedType] = useState("All");
  const [selectedTransmission, setSelectedTransmission] = useState("All");
  const [selectedSeats, setSelectedSeats] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);

  // Fetch all vehicles or available vehicles based on date range
  const allVehicles = useQuery(api.vehicles.getAllVehicles);
  const availableVehicles = useQuery(
    api.unavailablePeriods.getAvailableVehicles,
    startDate && endDate
      ? {
          startDate,
          endDate,
        }
      : {
          startDate: "",
          endDate: "",
        }
  );

  // Use available vehicles if dates are selected, otherwise use all vehicles
  const vehicles = availableVehicles;
  const isLoading = vehicles === undefined;

  // Apply filters
  const filteredVehicles = vehicles
    ?.filter((vehicle): vehicle is Doc<"vehicles"> => {
      if (!vehicle) return false;
      
      // Make filter
      if (make && vehicle.make.toLowerCase() !== make.toLowerCase()) return false;
      
      // Type filter
      if (selectedType !== "All" && vehicle.bodyType !== selectedType) return false;
      
      // Transmission filter
      if (selectedTransmission !== "All" && vehicle.transmission !== selectedTransmission) return false;
      
      // Seats filter
      if (selectedSeats !== "All" && vehicle.seats !== parseInt(selectedSeats)) return false;
      
      // Year filter
      if (selectedYear !== "All" && vehicle.year !== parseInt(selectedYear)) return false;
      
      // Features filter
      if (selectedFeatures.length > 0) {
        const hasAllFeatures = selectedFeatures.every(feature => 
          vehicle.features.includes(feature)
        );
        if (!hasAllFeatures) return false;
      }
      
      return true;
    });

  const handleSearch = ({ startDate, endDate }: { startDate: Date | undefined; endDate: Date | undefined }) => {
    if (startDate && endDate) {
      setIsSearching(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set("startDate", startDate.toISOString());
      params.set("endDate", endDate.toISOString());
      if (make) params.set("make", make);
      
      router.push(`/browse-cars?${params.toString()}`);
    }
  };

  // Reset isSearching when vehicles data changes
  useEffect(() => {
    if (vehicles !== undefined) {
      setIsSearching(false);
    }
  }, [vehicles]);

  // Filter component
  const FilterSheet = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Vehicles</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Vehicle Type */}
          <div className="space-y-2">
            <Label>Vehicle Type</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transmission */}
          <div className="space-y-2">
            <Label>Transmission</Label>
            <Select value={selectedTransmission} onValueChange={setSelectedTransmission}>
              <SelectTrigger>
                <SelectValue placeholder="Select transmission" />
              </SelectTrigger>
              <SelectContent>
                {transmissionTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Seats */}
          <div className="space-y-2">
            <Label>Seats</Label>
            <Select value={selectedSeats} onValueChange={setSelectedSeats}>
              <SelectTrigger>
                <SelectValue placeholder="Select seats" />
              </SelectTrigger>
              <SelectContent>
                {seatOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year */}
          <div className="space-y-2">
            <Label>Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Features</Label>
            <div className="space-y-2">
              {features.map(feature => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={selectedFeatures.includes(feature)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedFeatures(prev => [...prev, feature]);
                      } else {
                        setSelectedFeatures(prev => prev.filter(f => f !== feature));
                      }
                    }}
                  />
                  <label htmlFor={feature} className="text-sm">{feature}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Filters */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSelectedType("All");
              setSelectedTransmission("All");
              setSelectedSeats("All");
              setSelectedYear("All");
              setSelectedFeatures([]);
              setPriceRange([0, 500]);
            }}
          >
            Reset All Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Search Section */}
        <div className="mb-8">
          <SearchForm 
            onSearch={handleSearch} 
            initialStartDate={startDate ? new Date(startDate) : undefined}
            initialEndDate={endDate ? new Date(endDate) : undefined}
            isSearching={isSearching}
          />
        </div>

        {/* Header with Filter Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {startDate && endDate ? "Available Vehicles" : "Browse All Vehicles"}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {filteredVehicles ? `${filteredVehicles.length} vehicles found` : "Loading..."}
            </p>
          </div>
          <FilterSheet />
        </div>

        {/* Vehicle Grid */}
        {isSearching || isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredVehicles && filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredVehicles.map((vehicle) => {
              const imageUrl = vehicle.photos && vehicle.photos.length > 0 
                ? (typeof vehicle.photos[0] === 'string' 
                    ? vehicle.photos[0] 
                    : vehicle.photos[0].url) 
                : "/placeholder.svg";
              
              return (
                <Card 
                  key={vehicle._id} 
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(`/cars/${vehicle._id}`)}
                >
                  {/* Vehicle Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={imageUrl}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {vehicle.verificationStatus === "verified" && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">{vehicle.carType}</p>
                    </div>

                    {/* Vehicle Features */}
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {vehicle.seats} seats
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="h-3 w-3" />
                        {vehicle.transmission}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {vehicle.pickupLocation.split(',')[0]}
                      </div>
                    </div>

                    {/* Price and Contact */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <p className="text-xs text-gray-600">Daily Rate</p>
                        <p className="text-xl font-bold text-gray-900">
                          TTD ${vehicle.dailyPrice}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-[#e6ddca] hover:bg-[#d4ccb8] text-black gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Contact host functionality - for now navigate to detail page
                          router.push(`/cars/${vehicle._id}`);
                        }}
                      >
                        <Phone className="h-3 w-3" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-600 mb-6">
                {startDate && endDate 
                  ? "No vehicles available for the selected dates. Try different dates or adjust your filters."
                  : "No vehicles match your current filters. Try adjusting your search criteria."}
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSelectedType("All");
                  setSelectedTransmission("All");
                  setSelectedSeats("All");
                  setSelectedYear("All");
                  setSelectedFeatures([]);
                  setPriceRange([0, 500]);
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 