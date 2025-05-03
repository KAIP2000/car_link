"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-semibold">
                  Home
                </Link>
                <Link href="#" className="text-lg font-semibold">
                  Browse Cars
                </Link>
                <SignedOut>
                  <Link href="#" className="text-lg font-semibold">
                    Sign In
                  </Link>
                  <Link href="#" className="text-lg font-semibold">
                    Sign Up
                  </Link>
                </SignedOut>
                <SignedIn>
                  <Link href="#" className="text-lg font-semibold">
                    My Rentals
                  </Link>
                  <Link href="#" className="text-lg font-semibold">
                    Account Settings
                  </Link>
                </SignedIn>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <div className="bg-black text-white px-3 py-1 font-bold">Car Link</div>
            <span className="sr-only">Car Link Car Rentals</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#" className="text-sm font-medium hover:text-purple-600 transition-colors">
            Browse Cars
          </Link>
          <SignedIn>
            <Link href="#" className="text-sm font-medium hover:text-purple-600 transition-colors">
              My Rentals
            </Link>
          </SignedIn>
        </nav>

        <div className="flex items-center gap-4">
          <SignedOut>
            <div className="hidden md:flex gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10"
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
