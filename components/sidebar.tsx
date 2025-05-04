"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { 
  Home, Car, CarFront, Wrench, LogIn, UserPlus, User,
  Settings, X, Heart, MessageSquare, FileText
} from "lucide-react";
import {
  Authenticated, 
  Unauthenticated, 
  useConvexAuth
} from "convex/react";
import {
  UserButton, 
  SignInButton, 
  SignUpButton
} from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// Sidebar items - mimicking Turo's structure
const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/trips", label: "Trips", icon: Car },
  { href: "/messages", label: "Messages", icon: MessageSquare },
];

const hostNavItems = [
  { href: "/manage-my-cars", label: "Manage My Cars", icon: Settings },
  { href: "/account-settings", label: "Account Settings", icon: User },
  { href: "/how-car-link-works", label: "How It Works", icon: Wrench },
  { href: "/browse-cars", label: "Browse Cars", icon: CarFront },
];

// Define props for Sidebar
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { isLoading: isAuthLoading } = useConvexAuth();

  return (
    <>
      {/* Overlay for mobile - shown when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          // Base styles
          "fixed inset-y-0 left-0 z-50 flex flex-col w-[280px] bg-white overflow-y-auto",
          // Transition for mobile slide in/out
          "transition-transform duration-300 ease-in-out",
          // Mobile: transform based on isOpen
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: always visible
          "md:translate-x-0 md:max-w-[300px] md:border-r md:shadow-none"
        )}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" className="font-bold text-xl">Car Link</Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {/* Top Navigation Items */}
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname !== item.href && "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                pathname === item.href && "bg-gray-100 text-gray-900"
              )}
              asChild
            >
              <Link href={item.href} onClick={() => {
                // Close sidebar on mobile when a nav item is clicked
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}>
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            </Button>
          ))}
          
          <Separator className="my-4" />
          
          {/* Host Navigation Section */}
          <Authenticated>
            <div className="mb-2 text-sm font-medium text-gray-500">Host</div>
            {hostNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname !== item.href && "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  pathname === item.href && "bg-gray-100 text-gray-900"
                )}
                asChild
              >
                <Link href={item.href} onClick={() => {
                  // Close sidebar on mobile when a nav item is clicked
                  if (window.innerWidth < 768) {
                    onClose();
                  }
                }}>
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </Authenticated>
          
          {/* Unauthenticated View */}
          <Unauthenticated>
            <div className="space-y-2">
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
        </nav>
        
        {/* Footer Links */}
        <div className="p-4 border-t">
          <div className="flex flex-col space-y-2 text-sm">
            <Link href="/support" className="text-gray-600 hover:text-gray-900">Contact support</Link>
            <Link href="/legal" className="text-gray-600 hover:text-gray-900">Legal</Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link>
            
            {/* Show user button when authenticated */}
            <Authenticated>
              <div className="flex items-center py-2 mt-4">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10",
                      userButtonPopoverCard: "bg-white border-gray-200 text-gray-900",
                      userButtonPopoverActionButton: "text-gray-700 hover:bg-gray-100",
                      userButtonPopoverFooter: "hidden",
                    }
                  }}
                  showName={true}
                />
                <span className="ml-2">View Profile</span>
              </div>
            </Authenticated>
          </div>
        </div>
      </aside>
    </>
  );
} 