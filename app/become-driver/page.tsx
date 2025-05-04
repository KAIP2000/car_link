"use client"

// import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/footer"
import { User, Building2, Car, HandshakeIcon } from "lucide-react"

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
              variant="gold"
              className="text-lg px-8"
              onClick={handleGetStarted}
            >
              Get started
            </Button>
          </div>
        </section>

        {/* Car Collection Image Section */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                alt="Person collecting a car"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#e6ddca] rounded-full">
                    <User className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold">3.2M+</div>
                <div className="text-gray-600 text-sm">active guests¹</div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#e6ddca] rounded-full">
                    <Building2 className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold">12,000+</div>
                <div className="text-gray-600 text-sm">cities¹</div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#e6ddca] rounded-full">
                    <Car className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold">350,000+</div>
                <div className="text-gray-600 text-sm">active vehicles¹</div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-[#e6ddca] rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                    </svg>
                  </div>
                </div>
                <div className="font-serif text-3xl font-bold">175,000+</div>
                <div className="text-gray-600 text-sm">active hosts¹</div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section - Centered */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-normal mb-8 text-gray-900">What is Car Link?</h2>
            <div className="max-w-3xl mx-auto space-y-6 text-gray-600">
              <p className="text-lg">
                Car Link is the UK's largest car sharing marketplace where you can rent out your car when you're not using it.
              </p>
              <p className="text-lg">
                Whether you have one car or a fleet, Car Link provides you with the tools, support, and protection to build a successful car sharing business.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex flex-row items-start gap-4">
                    <div className="bg-[#e6ddca] p-3 rounded-full shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                        <path d="M9 12H5.5a2.5 2.5 0 0 1 0-5H9"></path>
                        <path d="M15 12h3.5a2.5 2.5 0 0 0 0-5H15"></path>
                        <path d="M9 12h6"></path>
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold mb-1">Comprehensive insurance</h3>
                      <p>Protection for your vehicle when rented</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex flex-row items-start gap-4">
                    <div className="bg-[#e6ddca] p-3 rounded-full shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold mb-1">24/7 customer support</h3>
                      <p>Help whenever you need it</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex flex-row items-start gap-4">
                    <div className="bg-[#e6ddca] p-3 rounded-full shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                        <rect width="20" height="12" x="2" y="6" rx="2"></rect>
                        <path d="M14 2v4"></path>
                        <path d="M10 2v4"></path>
                        <path d="M10 16v2"></path>
                        <path d="M14 16v2"></path>
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold mb-1">Secure payments</h3>
                      <p>Fast and reliable payment processing</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex flex-row items-start gap-4">
                    <div className="bg-[#e6ddca] p-3 rounded-full shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                        <line x1="3" x2="21" y1="9" y2="9"></line>
                        <line x1="3" x2="21" y1="15" y2="15"></line>
                        <line x1="9" x2="9" y1="3" y2="21"></line>
                        <line x1="15" x2="15" y1="3" y2="21"></line>
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold mb-1">Flexible scheduling</h3>
                      <p>Rent your car only when it works for you</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif font-normal mb-12 text-gray-900">Getting started on Car Link</h2>
            
            <div className="space-y-10 max-w-3xl mx-auto">
              {/* Step 1 */}
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-full border-2 border-gray-800 flex items-center justify-center shrink-0 mt-1">
                  <span className="font-medium">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Sign up</h3>
                  <p className="text-gray-700">
                    Listing your car takes about ten minutes. There are no sign-up fees or monthly charges. All you need are your car's details to get the ball rolling.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-full border-2 border-gray-800 flex items-center justify-center shrink-0 mt-1">
                  <span className="font-medium">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Set up your profile</h3>
                  <p className="text-gray-700">
                    Set your preferences, including when your car is available and your daily price. Add some photos and a description, and you're good to go.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-full border-2 border-gray-800 flex items-center justify-center shrink-0 mt-1">
                  <span className="font-medium">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Welcome your guests</h3>
                  <p className="text-gray-700">
                    When a guest books your car, you'll get in touch with the details. The Car Link app walks you through everything you need to do.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-full border-2 border-gray-800 flex items-center justify-center shrink-0 mt-1">
                  <span className="font-medium">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Sit back and earn</h3>
                  <p className="text-gray-700">
                    You'll get paid by direct deposit within three days of each trip. You'll earn 65% or 75% of the trip price, depending on the level of trip protection you choose.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* We've Got Your Back Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif font-normal mb-12 text-center text-gray-900">We've got your back</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Safe & trusted community */}
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="flex justify-center mb-5">
                  <div className="p-3 bg-[#e6ddca] rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" x2="22" y1="12" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Safe & trusted community</h3>
                <p className="text-gray-700">
                  Every guest is screened and verified and must meet minimum driver standards, so you can have complete confidence when you hand over your keys
                </p>
              </div>
              
              {/* Card 2: Support along the way */}
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="flex justify-center mb-5">
                  <div className="p-3 bg-[#e6ddca] rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      <circle cx="12" cy="2" r="1"></circle>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Support along the way</h3>
                <p className="text-gray-700">
                  Our dedicated 24/7 customer support is just a click away, and your guests have easy access to Car Link roadside assistance when they need it
                </p>
              </div>
              
              {/* Card 3: An easy-to-use app */}
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="flex justify-center mb-5">
                  <div className="p-3 bg-[#e6ddca] rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">An easy-to-use app</h3>
                <p className="text-gray-700">
                  Manage your business and bookings seamlessly on your smartphone—everything you need to run your car rental business is right in your pocket
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 px-4 bg-[#e6ddca]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-normal mb-6">Ready to start earning with your car?</h2>
            <Button 
              size="xl" 
              variant="gold"
              className="px-10"
              onClick={handleGetStarted}
            >
              Get started now
            </Button>
          </div>
        </section>

        {/* Footer Note */}
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-8 bg-white text-center">
          <p className="text-sm text-gray-500">
            ¹Statistics based on global platform data from 2023. Individual results may vary.
          </p>
        </div>
        
        <Footer />
      </>
    // </main>
    // <Footer />
    // </div>
  )
} 