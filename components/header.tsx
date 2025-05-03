"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isSignedIn, user } = useUser()

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
                {isSignedIn && (
                  <Link href="#" className="text-lg font-semibold">
                    Become a Host
                  </Link>
                )}
                <Link href="#" className="text-lg font-semibold">
                  How it Works
                </Link>
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
          {isSignedIn && (
            <Link href="#" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Become a Host
            </Link>
          )}
          <Link href="#" className="text-sm font-medium hover:text-purple-600 transition-colors">
            How it Works
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="outline">Sign Up</Button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Button variant="outline" className="hidden md:flex">
                Become a host
              </Button>
              <UserButton afterSignOutUrl="/" />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
