import { SearchForm } from "@/components/search-form"
import { CarGrid } from "@/components/car-grid"
import { BrandSection } from "@/components/brand-section"
import { DestinationSection } from "@/components/destination-section"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function Home() {
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Find cars for your next trip conveniently</h1>
            <p className="text-xl md:text-2xl">Rent your favorite car, and travel with ease</p>
          </div>
        </div>
      </section>

      {/* Car Grid Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Rent cars for any occasion</h2>
              <p className="text-muted-foreground">
                Browse an incredible selection of cars, from the everyday to the extraordinary.
              </p>
            </div>
            <Button className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700 text-white">Explore cars</Button>
          </div>

          <CarGrid />
        </div>
      </section>

      {/* Browse by Brand */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Browse by make</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <span className="sr-only">Previous</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>
              <Button variant="outline" size="icon">
                <span className="sr-only">Next</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
            </div>
          </div>

          <BrandSection />
        </div>
      </section>

      {/* Browse by Destination */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Browse by destination</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <span className="sr-only">Previous</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>
              <Button variant="outline" size="icon">
                <span className="sr-only">Next</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
            </div>
          </div>

          <DestinationSection />
        </div>
      </section>

      <Footer />
    </>
  )
}
