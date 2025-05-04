"use client"

import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { SearchForm } from "@/components/search-form"
import { CarGrid } from "@/components/car-grid"
import { CarCard } from "@/components/car-card"
import { BrandSection } from "@/components/brand-section"
import { Button } from "@/components/ui/button"

export default function Home() {
  // Fetch vehicles from Convex database
  const vehicles = useQuery(api.vehicles.getAllVehicles)
  
  // Get unique makes from vehicles
  const uniqueMakes = vehicles 
    ? [...new Set(vehicles.map(vehicle => vehicle.make))]
    : []
    
  // Sort vehicles by creation time (newest first)
  const sortedVehicles = vehicles
    ? [...vehicles].sort((a, b) => b._creationTime - a._creationTime)
    : []

  return (
    <>
      {/* Hero Section */}
      <section className="relative">
        {/* Hero Background */}
        <div className="relative h-[500px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/car-sharing.jpg')",
              backgroundPosition: "center 40%",
            }}
          >
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>

        {/* Search Form Over Hero */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-5xl mx-auto mb-16">
            <SearchForm />
          </div>

          <div className="text-center text-white">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal mb-4">Find cars for your next trip conveniently</h1>
            <p className="text-xl md:text-2xl font-sans">Rent your favorite car, and travel with ease</p>
          </div>
        </div>
      </section>

      {/* Car Grid Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl font-normal mb-2">Rent cars for any occasion</h2>
              <p className="text-muted-foreground font-sans">
                Browse an incredible selection of cars, from the everyday to the extraordinary.
              </p>
            </div>
            <Button variant="gold" className="mt-4 md:mt-0" asChild>
              <Link href="/browse-cars">Explore cars</Link>
            </Button>
          </div>

          {/* Show 4 most recent vehicles or fallback to CarGrid */}
          {sortedVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedVehicles.slice(0, 4).map((vehicle) => (
                <CarCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <CarGrid />
          )}
        </div>
      </section>

      {/* Browse by Brand - Dynamic from database */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-normal">Browse by make</h2>
          </div>

          {/* Show actual makes from the database or fall back to common makes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {uniqueMakes.length > 0 ? (
              uniqueMakes.map((make, index) => (
                <Link key={index} href={`/browse-cars?make=${make}`}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 text-center">
                    <div className="text-3xl mb-2 text-amber-700">
                      {make.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-medium">{make}</h3>
                  </div>
                </Link>
              ))
            ) : (
              // Fallback to common car makes
              ["Toyota", "Honda", "Ford", "BMW", "Mercedes", "Audi", "Tesla", "Nissan", "Volkswagen", "Hyundai"].map((make, index) => (
                <Link key={index} href={`/browse-cars?make=${make}`}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 text-center">
                    <div className="text-3xl mb-2 text-amber-700">
                      {make.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-medium">{make}</h3>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  )
}
