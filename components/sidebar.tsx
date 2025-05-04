"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { 
  Home, Car, CarFront, Wrench, LogIn, UserPlus, User,
  ChevronsLeft, ChevronsRight,
  Settings // Added Settings icon
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
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"; // Import Tooltip
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse-cars", label: "Browse Cars", icon: CarFront },
  { href: "/become-driver", label: "Rent Your Car", icon: Car },
];

const signedInNavItems = [
  { href: "/my-rentals", label: "My Rentals", icon: Wrench }, // Example signed-in link
  { href: "/manage-my-cars", label: "Manage My Cars", icon: Settings }, // Added Manage My Cars link
  { href: "/account-settings", label: "Account Settings", icon: User }, // Example signed-in link
];

// Define props for Sidebar
interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { isLoading } = useConvexAuth();

  return (
    // Add transition for width, adjust width based on state
    <aside 
      className={cn(
        "hidden md:flex md:flex-col md:fixed md:inset-y-0 md:z-50 bg-white text-gray-900 border-r border-gray-200 transition-[width] duration-300 ease-in-out",
        isCollapsed ? "md:w-20" : "md:w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Link href="/" className={cn("flex items-center gap-2 font-bold", isCollapsed ? "text-lg justify-center w-full" : "text-xl")}>
          {/* Show only initials or small icon when collapsed */} 
          {isCollapsed ? "CL" : "Car Link"} 
        </Link>
      </div>

      {/* Navigation - Wrap with TooltipProvider */} 
      <TooltipProvider delayDuration={0}>
        <nav className="flex-1 py-6 px-2 space-y-2"> {/* Adjust padding */} 
          {navItems.map((item) => (
             <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      pathname !== item.href && "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                      pathname === item.href && "bg-gray-100 text-gray-900",
                      isCollapsed && "justify-center"
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                      <span className={cn(isCollapsed && "sr-only")}>{item.label}</span> {/* Hide label visually */} 
                    </Link>
                  </Button>
              </TooltipTrigger>
              {isCollapsed && (
                  <TooltipContent side="right">
                      {item.label}
                  </TooltipContent>
              )}
            </Tooltip>
          ))}

          <Authenticated>
            <Separator className="my-4 bg-gray-200" />
            {signedInNavItems.map((item) => (
                <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                    <Button
                        key={item.href}
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className={cn(
                        "w-full justify-start",
                        pathname !== item.href && "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                        pathname === item.href && "bg-gray-100 text-gray-900",
                        isCollapsed && "justify-center"
                        )}
                        asChild
                    >
                        <Link href={item.href}>
                        <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                         <span className={cn(isCollapsed && "sr-only")}>{item.label}</span>
                        </Link>
                    </Button>
                </TooltipTrigger>
                 {isCollapsed && (
                    <TooltipContent side="right">
                        {item.label}
                    </TooltipContent>
                 )}
                </Tooltip>
            ))}
          </Authenticated>
        </nav>
      </TooltipProvider>

      {/* Collapse Button & Clerk Auth Section */} 
      <div className="mt-auto border-t border-gray-200">
        {/* Collapse Button */} 
        <div className="p-2 border-b border-gray-200">
          <Button 
            onClick={onToggle} 
            variant="ghost" 
            size="icon" 
            className="w-full h-10 hover:bg-gray-100"
          >
            {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
            <span className="sr-only">{isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}</span>
          </Button>
        </div>

        {/* Clerk Auth */} 
        <div className="p-4">
          {isLoading ? (
            <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
              <Skeleton className="h-10 w-10 rounded-full" />
              {!isCollapsed && <Skeleton className="h-6 w-24" />} 
            </div>
          ) : (
            <>
              <Unauthenticated>
                {isCollapsed ? (
                  <div className="space-y-2 flex flex-col items-center">
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SignInButton mode="modal">
                            <Button variant="ghost" size="icon">
                              <LogIn className="h-5 w-5" />
                            </Button>
                          </SignInButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">Sign In</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SignUpButton mode="modal">
                            <Button variant="ghost" size="icon">
                              <UserPlus className="h-5 w-5" />
                            </Button>
                          </SignUpButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">Sign Up</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full">
                        <LogIn className="mr-2 h-4 w-4" /> Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button variant="default" className="w-full bg-purple-600 hover:bg-purple-700">
                        <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                      </Button>
                    </SignUpButton>
                  </div>
                )}
              </Unauthenticated>
              <Authenticated>
                <div className={cn(
                  "flex items-center gap-3 p-2 rounded", 
                  !isCollapsed && "hover:bg-gray-100",
                  isCollapsed && "justify-center"
                )}>
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
                    showName={!isCollapsed}
                  />
                </div>
              </Authenticated>
            </>
          )}
        </div>
      </div>
    </aside>
  );
} 