"use client"

// import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Upload } from "lucide-react"
import { useRouter } from "next/navigation"
// import { Footer } from "@/components/footer"

export default function BecomeDriverPage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/driver-onboarding")
  }

  return (
    // <div className="min-h-screen bg-white flex flex-col">
    //  <Header />
      
      <>
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-serif font-bold mb-6 text-gray-900">
            Turn your car into income with Car Link
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Link with drivers in your area and start earning today!!!
            </p>
            <Button 
              size="lg" 
              className="bg-[#6C5DD3] hover:bg-[#5648B9] text-lg px-8"
              onClick={handleGetStarted}
            >
              Get started
            </Button>
          </div>
        </section>

        {/* Car Upload Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2">Upload Your Car Photos</h2>
                  <p className="text-gray-600">
                    Great photos can help you earn more. Show your car's best angles!
                  </p>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Input
                    type="file"
                    id="car-photos"
                    className="hidden"
                    accept="image/*"
                    multiple
                  />
                  <Label
                    htmlFor="car-photos"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <span className="text-lg font-medium mb-1">Drop your photos here</span>
                    <span className="text-sm text-gray-500">or click to upload</span>
                  </Label>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-semibold mb-6 text-gray-900">What is Car Link?</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Car Link is the UK's largest car sharing marketplace where you can rent out your car when you're not using it.
                  </p>
                  <p>
                    Whether you have one car or a fleet, Car Link provides you with the tools, support, and protection to build a successful car sharing business.
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Comprehensive insurance coverage</li>
                    <li>24/7 customer support</li>
                    <li>Secure payments</li>
                    <li>Flexible scheduling</li>
                  </ul>
                </div>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="/car-sharing.jpg"
                  alt="Car sharing on Car Link"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <div className="max-w-4xl mx-auto px-4 pb-16 bg-white">
          <p className="text-sm text-gray-500">
            *Average annual host earnings in 2023. Individual earnings may vary.
          </p>
        </div>
      </>
    // </main>
    // <Footer />
    // </div>
  )
} 