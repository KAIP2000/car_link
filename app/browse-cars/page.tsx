"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CarGrid } from "@/components/car-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, X, Car, Truck, Package } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { useSearchParams, useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { SearchForm } from "@/components/search-form";

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12">
        <SearchForm 
          onSearch={handleSearch} 
          initialStartDate={startDate ? new Date(startDate) : undefined}
          initialEndDate={endDate ? new Date(endDate) : undefined}
          isSearching={isSearching}
        />
      </div>

      <div className="flex gap-8">
        {/* Filters */}
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-4 space-y-6">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            
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
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-serif mb-4">
            {startDate && endDate ? "Available Cars" : "Browse Cars"}
          </h1>

          {startDate && endDate ? (
            <div className="mb-4">
              <p className="text-muted-foreground">
                Showing cars available from {new Date(startDate).toLocaleDateString()} to{" "}
                {new Date(endDate).toLocaleDateString()}
                {make && ` for ${make}`}
              </p>
            </div>
          ) : (
            <div className="mb-4">
              <p className="text-muted-foreground">
                Showing all cars. Select dates to check availability.
              </p>
            </div>
          )}

          {isSearching || isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="rounded-lg border overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="relative aspect-[4/3] bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                    <div className="flex gap-2 mt-2">
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVehicles && filteredVehicles.length > 0 ? (
            <CarGrid vehicles={filteredVehicles} />
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {startDate && endDate 
                  ? "No cars available for the selected dates"
                  : "No cars found matching your criteria"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 