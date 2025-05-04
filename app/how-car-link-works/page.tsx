import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function HowCarLinkWorks() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 text-center max-w-7xl mx-auto">
        <h1 className="font-serif text-5xl md:text-6xl font-normal tracking-tight mb-6">How Car Link works</h1>
        <p className="text-xl md:text-2xl mb-10 text-gray-700 max-w-3xl mx-auto font-sans">
          Skipping the Counters and Driving in Style
        </p>
        <Button variant="gold" size="xl" className="px-10">
          Find the perfect car
        </Button>
        
        <div className="mt-16 relative rounded-lg overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
            alt="Person using Car Link mobile app"
            width={800}
            height={500}
            className="w-full object-cover aspect-video"
          />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#e6ddca] opacity-80 rounded-full"></div>
        </div>
      </section>

      {/* Car Link vs Car Rentals */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl font-normal text-center mb-12">Car Link vs. car rental</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-normal mb-4">Car Link</h3>
              
              <div className="flex items-start gap-3">
                <div className="text-green-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className="text-lg font-sans">App-based experience</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-green-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className="text-lg font-sans">No waiting in line</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-green-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className="text-lg font-sans">1,600+ unique makes & models</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-green-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className="text-lg font-sans">Get the exact car you choose</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-green-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className="text-lg font-sans">Delivery options & thousands of pickup locations</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-green-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className="text-lg font-sans">Cars shared by local small businesses</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-green-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className="text-lg font-sans">Vehicles and hosts rated by guests</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-normal mb-4">Car rental</h3>
              
              <div className="flex items-start gap-3">
                <div className="text-red-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <p className="text-lg font-sans">Standard rental counter experience</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-red-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <p className="text-lg font-sans">Waiting in line</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-red-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <p className="text-lg font-sans">Limited car selection</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-red-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <p className="text-lg font-sans">Get one type of car "or similar"</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-red-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <p className="text-lg font-sans">Pickup at retail locations</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-red-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <p className="text-lg font-sans">Cars owned by large corporations</p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="text-red-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <p className="text-lg font-sans">No vehicle ratings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Book a Car */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl font-normal text-center mb-12">How to book a car</h2>
          
          <div className="flex flex-col md:flex-row gap-12 items-center justify-center mb-16">
            <div className="bg-amber-50 rounded-full p-8 md:p-12 relative">
              <Image 
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                alt="Booking flow illustration"
                width={300}
                height={500}
                className="w-full h-auto max-w-[300px] object-contain"
              />
              <div className="absolute top-1/4 -left-6 w-12 h-1 bg-[#e6ddca] rounded"></div>
              <div className="absolute top-1/2 -right-6 w-12 h-1 bg-[#e6ddca] rounded"></div>
              <div className="absolute bottom-1/4 -left-6 w-12 h-1 bg-[#e6ddca] rounded"></div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="font-serif text-2xl font-normal mb-2">1. Find the perfect car</div>
              <p className="text-gray-700 font-sans">
              Just enter the date when you need the car and the filter will find the best vehicle for you.               </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="font-serif text-2xl font-normal mb-2">2. Request your car</div>
              <p className="text-gray-700 font-sans">
                Submit your request while the host reviews your profile to accept the booking.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="font-serif text-2xl font-normal mb-2">3. Collect your car and hit the road</div>
              <p className="text-gray-700 font-sans">
                Once the host accepts your request, you and the host will agree on the method of payment, pick up details and you're all set. If you have any questions/issues you can easily chat with the host or contact support.
              </p> 
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <Image 
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Person renting a car"
              width={600}
              height={400}
              className="rounded-lg w-full max-w-3xl object-cover"
            />
          </div>
        </div>
      </section>

     {/* Why Choose Car Link */}
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-[#e6ddca] text-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-4xl font-normal text-center mb-12">Why choose Car Link?</h2>

        <div className="space-y-12">
          <div className="flex flex-row items-start gap-4">
            <div className="bg-white p-3 rounded-full shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-serif text-xl font-normal mb-2">Enjoy a streamlined airport experience</h3>
              <p className="text-black font-sans">
                100+ airports across the US and Canada let Car Link hosts bring cars to airport parking lots and garages. Some smaller airports even allow curbside pickup at the terminal.*
              </p>
            </div>
          </div>

          <div className="flex flex-row items-start gap-4">
            <div className="bg-white p-3 rounded-full shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                <circle cx="12" cy="8" r="5"></circle>
                <path d="M20 21v-2a7 7 0 0 0-14 0v2"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-serif text-xl font-normal mb-2">Get personalized service from a local host</h3>
              <p className="text-black font-sans">
                Car Link hosts are everyday entrepreneurs who share cars in their communities.
              </p>
            </div>
          </div>

          <div className="flex flex-row items-start gap-4">
            <div className="bg-white p-3 rounded-full shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-serif text-xl font-normal mb-2">Relax with support & damage protection</h3>
              <p className="text-black font-sans">
                24/7 support and roadside assistance mean help is just a call away, plus you can choose from a range of protection plans.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button variant="gold" size="xl" className="px-10">
            Find the perfect car
          </Button>
        </div>
      </div>
    </section>


      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl font-normal text-center mb-12">Frequently asked questions</h2>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg p-2">
              <AccordionTrigger className="font-serif text-xl font-normal hover:no-underline">Where is Car Link available?</AccordionTrigger>
              <AccordionContent className="text-gray-700 font-sans">
                Car Link is available in major cities across the United States and is rapidly expanding to new locations. Check the app for availability in your area.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border rounded-lg p-2">
              <AccordionTrigger className="font-serif text-xl font-normal hover:no-underline">What is the cancellation policy on Car Link?</AccordionTrigger>
              <AccordionContent className="text-gray-700 font-sans">
                Cancellation policies vary by host. When booking, you'll see the specific cancellation terms for your reservation. Most hosts offer flexible policies with full refunds available up to 24 hours before your trip starts.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border rounded-lg p-2">
              <AccordionTrigger className="font-serif text-xl font-normal hover:no-underline">What do I need to book a car on Car Link?</AccordionTrigger>
              <AccordionContent className="text-gray-700 font-sans">
                You'll need a valid driver's license, be at least 21 years old (25+ for some luxury vehicles), and have a clean driving record. International licenses are accepted with proper verification.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border rounded-lg p-2">
              <AccordionTrigger className="font-serif text-xl font-normal hover:no-underline">What happens if I have an emergency or issue with the car?</AccordionTrigger>
              <AccordionContent className="text-gray-700 font-sans">
                Car Link offers 24/7 customer support and roadside assistance. In case of an emergency or car issue, you can contact support through the app or call our emergency hotline for immediate assistance.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border rounded-lg p-2">
              <AccordionTrigger className="font-serif text-xl font-normal hover:no-underline">Do I need my own insurance?</AccordionTrigger>
              <AccordionContent className="text-gray-700 font-sans">
                Car Link offers insurance coverage options when you book a car. Your personal auto insurance may also provide coverage, but we recommend checking with your insurance provider for details about coverage when renting.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6" className="border rounded-lg p-2">
              <AccordionTrigger className="font-serif text-xl font-normal hover:no-underline">Can I get my car delivered to me?</AccordionTrigger>
              <AccordionContent className="text-gray-700 font-sans">
                Yes, many Car Link hosts offer delivery to your location, whether that's your home, hotel, or the airport. Delivery options and fees vary by host and will be clearly displayed during the booking process.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7" className="border rounded-lg p-2">
              <AccordionTrigger className="font-serif text-xl font-normal hover:no-underline">Can other people drive a car that I booked?</AccordionTrigger>
              <AccordionContent className="text-gray-700 font-sans">
                Additional drivers must be approved before your trip begins. They need to meet the same eligibility requirements as the primary driver and be added to your booking through the app.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8" className="border rounded-lg p-2">
              <AccordionTrigger className="font-serif text-xl font-normal hover:no-underline">How do I get discounts when booking a car?</AccordionTrigger>
              <AccordionContent className="text-gray-700 font-sans">
                Car Link offers various promotions for new users, referrals, and extended bookings. Look for discount codes in the app, subscribe to our newsletter for special offers, and book longer trips for better daily rates.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  )
} 