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

// Define filter options
const vehicleTypes = ["All", "Sedan", "SUV", "Truck", "Van", "Hatchback", "Coupe", "Convertible"];
const transmissionTypes = ["All", "Automatic", "Manual"];
const seatOptions = ["All", "2", "4", "5", "6", "7+"];
const currentYear = new Date().getFullYear();
const yearOptions = ["All", ...Array.from({ length: 20 }, (_, i) => (currentYear - i).toString())];
const features = ["Air Conditioning", "GPS", "Bluetooth", "Heated Seats", "Backup Camera", "Sunroof"];

export default function BrowseCarsPage() {
  // Fetch vehicles using the Convex query
  const allVehicles = useQuery(api.vehicles.getAllVehicles);
  const isLoading = allVehicles === undefined;

  // Filter states
  const [vehicleType, setVehicleType] = useState("All");
  const [make, setMake] = useState("All");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("All");
  const [transmission, setTransmission] = useState("All");
  const [seats, setSeats] = useState("All");
  const [mileageRange, setMileageRange] = useState([0, 150000]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Doc<"vehicles">[] | undefined>(undefined);
  const [filteredCount, setFilteredCount] = useState<number>(0);

  // Check if any filter is active
  const hasActiveFilters = vehicleType !== "All" || make !== "All" || model || year !== "All" || 
    transmission !== "All" || seats !== "All" || selectedFeatures.length > 0 || 
    mileageRange[0] > 0 || mileageRange[1] < 150000;

  // Extract unique makes from the data
  const uniqueMakes = allVehicles 
    ? [...new Set(allVehicles.map(vehicle => vehicle.make))]
    : [];

  // Apply filters when allVehicles or filter state changes
  useEffect(() => {
    if (!allVehicles) {
      setFilteredVehicles(undefined);
      setFilteredCount(0);
      return;
    }

    let result = [...allVehicles];

    // Filter by vehicle type
    if (vehicleType !== "All") {
      result = result.filter(v => v.bodyType.toLowerCase().includes(vehicleType.toLowerCase()));
    }

    // Filter by make
    if (make !== "All") {
      result = result.filter(v => v.make === make);
    }

    // Filter by model (case insensitive partial match)
    if (model) {
      result = result.filter(v => 
        v.model.toLowerCase().includes(model.toLowerCase())
      );
    }

    // Filter by year
    if (year !== "All") {
      result = result.filter(v => v.year.toString() === year);
    }

    // Filter by transmission
    if (transmission !== "All") {
      result = result.filter(v => v.transmission === transmission);
    }

    // Filter by seats
    if (seats !== "All") {
      if (seats === "7+") {
        result = result.filter(v => v.seats >= 7);
      } else {
        result = result.filter(v => v.seats === parseInt(seats));
      }
    }

    // Filter by mileage range
    result = result.filter(v => 
      v.mileage >= mileageRange[0] && v.mileage <= mileageRange[1]
    );

    // Filter by features
    if (selectedFeatures.length > 0) {
      result = result.filter(v => {
        // Check if vehicle has A/C and GPS as specific properties
        const hasAC = selectedFeatures.includes("Air Conditioning") ? v.hasAirConditioning : true;
        const hasGPS = selectedFeatures.includes("GPS") ? v.hasGps : true;
        
        // For other features, check the features array
        const otherFeatures = selectedFeatures.filter(f => 
          f !== "Air Conditioning" && f !== "GPS"
        );
        
        const hasOtherFeatures = otherFeatures.length === 0 || 
          otherFeatures.every(feature => v.features?.includes(feature));
        
        return hasAC && hasGPS && hasOtherFeatures;
      });
    }

    setFilteredVehicles(result);
    setFilteredCount(result.length);
  }, [allVehicles, vehicleType, make, model, year, transmission, seats, mileageRange, selectedFeatures]);

  // Handle feature selection
  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setVehicleType("All");
    setMake("All");
    setModel("");
    setYear("All");
    setTransmission("All");
    setSeats("All");
    setMileageRange([0, 150000]);
    setSelectedFeatures([]);
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-4xl font-bold">Browse All Cars</h1>
        
        {/* Filter Sheet Dialog */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="mt-4 md:mt-0 gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filter Cars
              {hasActiveFilters && (
                <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col sm:max-w-md" side="right">
            <SheetHeader>
              <SheetTitle>Filter Cars</SheetTitle>
              <SheetDescription>
                Apply filters to find your perfect car
              </SheetDescription>
            </SheetHeader>
            
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto py-6 pr-1 mr-1">
              <div className="grid gap-6">
                {/* Vehicle Type Filter */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Vehicle Type</h3>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Make & Model Filters */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Make & Model</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Select value={make} onValueChange={setMake}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">Any Make</SelectItem>
                        {uniqueMakes.map(make => (
                          <SelectItem key={make} value={make}>
                            {make}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      placeholder="Model (e.g. Civic, Camry)"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Year Filter */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Year</h3>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map(year => (
                        <SelectItem key={year} value={year}>
                          {year === "All" ? "Any Year" : year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Transmission Filter */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Transmission</h3>
                  <Select value={transmission} onValueChange={setTransmission}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissionTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type === "All" ? "Any Transmission" : type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Seats Filter */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Number of Seats</h3>
                  <Select value={seats} onValueChange={setSeats}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select seats" />
                    </SelectTrigger>
                    <SelectContent>
                      {seatOptions.map(option => (
                        <SelectItem key={option} value={option}>
                          {option === "All" ? "Any Seats" : option === "7+" ? "7 or more" : option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Mileage Range Filter */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Mileage Range</h3>
                    <span className="text-sm text-muted-foreground">
                      {mileageRange[0].toLocaleString()} - {mileageRange[1].toLocaleString()} miles
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={150000}
                    step={5000}
                    value={mileageRange}
                    onValueChange={setMileageRange}
                    className="py-4"
                  />
                </div>
                
                {/* Features Filter */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {features.map(feature => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`feature-${feature}`} 
                          checked={selectedFeatures.includes(feature)}
                          onCheckedChange={() => toggleFeature(feature)}
                        />
                        <Label htmlFor={`feature-${feature}`} className="text-sm">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add extra padding at the bottom to prevent footer overlap */}
                <div className="h-20"></div>
              </div>
            </div>
            
            {/* Fixed position footer */}
            <div className="sticky bottom-0 left-0 right-0 bg-background border-t mt-auto pt-4 pb-4">
              {/* Show results count when filters are active */}
              {hasActiveFilters && (
                <div className="mb-4 text-center">
                  <p className="text-sm font-medium">
                    {filteredCount} {filteredCount === 1 ? 'car' : 'cars'} match your filters
                  </p>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
                <SheetClose asChild>
                  <Button variant="gold">Apply Filters</Button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Filter summary */}
      {filteredVehicles && allVehicles && (
        <div className="mb-6 flex items-center text-sm text-muted-foreground">
          <p>
            Showing {filteredVehicles.length} of {allVehicles.length} cars
            {hasActiveFilters && (
              <span> with applied filters</span>
            )}
          </p>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="ml-2 h-auto p-1"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      )}

      {isLoading ? (
        // Show loading skeletons
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredVehicles && filteredVehicles.length > 0 ? (
        // Pass filtered vehicles to the CarGrid
        <CarGrid vehicles={filteredVehicles} /> 
      ) : (
        // Handle case where there are no matching vehicles
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-4">No cars match your filter criteria.</p>
          <Button onClick={resetFilters} variant="outline">Clear Filters</Button>
        </div>
      )}
    </div>
  );
} 