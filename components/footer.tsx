import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-[#e6ddca] mt-auto">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-black">Car Link</h3>
            <p className="text-sm text-black">Car Rental Redefined.</p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4 text-black">Quick Links</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/" className="text-black hover:text-gray-800 transition-colors">Home</Link>
              <Link href="/browse-cars" className="text-black hover:text-gray-800 transition-colors">Browse Cars</Link>
              <Link href="/become-driver" className="text-black hover:text-gray-800 transition-colors">Rent Your Car</Link>
              <Link href="/how-car-link-works" className="text-black hover:text-gray-800 transition-colors">How It Works</Link>
              <Link href="#" className="text-black hover:text-gray-800 transition-colors">Support</Link>
              <Link href="#" className="text-black hover:text-gray-800 transition-colors">Privacy Policy</Link>
            </nav>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4 text-black">Contact Us</h4>
            <p className="text-sm text-black">
              Email: support@carlink.example
            </p>
            {/* Add social media icons or other contact info if needed */}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-300 text-center text-sm text-black">
          &copy; {new Date().getFullYear()} Car Link. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
