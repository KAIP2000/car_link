"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, User, Heart, Menu, X, LogIn, UserPlus, Car, Building2, MessageSquare, Settings, FileText, Home } from "lucide-react";
import { 
  SignInButton, 
  SignUpButton, 
  UserButton, 
  useAuth
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";

import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";

export function Header() {
  const { isSignedIn } = useAuth();
  const { isLoading: isAuthLoading } = useConvexAuth();
  const pathname = usePathname();

  // Navigation items - migrated from sidebar
  const navItems = [
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/trips", label: "Trips", icon: Car },
    { href: "/messages", label: "Messages", icon: MessageSquare },
  ];

  const hostNavItems = [
    { href: "/manage-my-cars", label: "Manage My Cars", icon: Settings },
    { href: "/account-settings", label: "Account Settings", icon: User },
    { href: "/how-car-link-works", label: "How It Works", icon: FileText },
    { href: "/browse-cars", label: "Browse Cars", icon: Car },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="mr-4 flex items-center space-x-2">
          <span className="font-serif text-xl font-bold tracking-tight">Car Link</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
          <Link 
            href="/browse-cars"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/browse-cars" 
                ? "text-primary" 
                : "text-muted-foreground"
            )}
          >
            Browse Cars
          </Link>
          <Link 
            href="/become-driver"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/become-driver" 
                ? "text-primary" 
                : "text-muted-foreground"
            )}
          >
            Rent Your Car
          </Link>
          <Link 
            href="/how-car-link-works"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/how-car-link-works" 
                ? "text-primary" 
                : "text-muted-foreground"
            )}
          >
            How It Works
          </Link>
        </nav>

        {/* Search */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-center md:px-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="City, airport, address or hotel"
              className="w-full pl-9 md:w-[300px] lg:w-[400px]"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Mobile menu (Sheet) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80%] sm:w-[350px]">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="font-serif">Car Link</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <div className="grid gap-2">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center rounded-md px-3 py-2",
                          pathname === item.href 
                            ? "bg-gray-100 text-gray-900" 
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                  
                  <Separator className="my-2" />
                  
                  <Authenticated>
                    <div className="px-3 py-1 text-sm font-medium text-gray-500">Host</div>
                    {hostNavItems.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center rounded-md px-3 py-2",
                            pathname === item.href 
                              ? "bg-gray-100 text-gray-900" 
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          )}
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </Authenticated>
                  
                  <Unauthenticated>
                    <div className="p-3 space-y-3">
                      <SignInButton mode="modal">
                        <Button variant="outline" className="w-full">
                          <LogIn className="mr-2 h-5 w-5" />
                          Sign In
                        </Button>
                      </SignInButton>
                      
                      <SignUpButton mode="modal">
                        <Button variant="gold" className="w-full">
                          <UserPlus className="mr-2 h-5 w-5" />
                          Become a host
                        </Button>
                      </SignUpButton>
                    </div>
                  </Unauthenticated>
                </div>
              </div>
              <SheetFooter className="pt-4 border-t text-sm">
                <div className="flex flex-col space-y-2 text-gray-600">
                  <Link href="/support" className="hover:text-gray-900">Contact support</Link>
                  <Link href="/legal" className="hover:text-gray-900">Legal</Link>
                  <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          
          {/* Favorites Button (Desktop) */}
          {isSignedIn && (
            <Button variant="ghost" size="icon" asChild className="hidden md:flex">
              <Link href="/favorites">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Favorites</span>
              </Link>
            </Button>
          )}
          
          {/* Desktop User Menu or Auth Buttons */}
          <Authenticated>
            {/* Full Navigation Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserButton afterSignOutUrl="/" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex w-full cursor-pointer">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Host</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {hostNavItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex w-full cursor-pointer">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/support" className="flex w-full cursor-pointer">
                    Contact Support
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Authenticated>

          {/* Sign In/Up Buttons for Unauthenticated Users */}
          <Unauthenticated>
            <div className="hidden md:block">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Sign In</Button>
              </SignInButton>
            </div>
            <SignUpButton mode="modal">
              <Button variant="gold" size="sm" className="hidden md:inline-flex">Become a host</Button>
            </SignUpButton>
          </Unauthenticated>
        </div>
      </div>
    </header>
  );
} 