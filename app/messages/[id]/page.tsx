"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, Check, X, Car, Calendar, User, MessageSquare, AlertCircle, 
  ArrowLeft, CheckCircle, XCircle, Hourglass, Send
} from "lucide-react";
import { toast } from "sonner";
import { format, formatDistance } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function BookingRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const requestId = params.id as Id<"bookingRequests">;
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get booking request details
  const bookingRequest = useQuery(api.bookingRequests.getBookingRequestById, {
    bookingRequestId: requestId
  });
  
  // Mutations
  const addMessage = useMutation(api.bookingRequests.addBookingRequestMessage);
  const updateRequestStatus = useMutation(api.bookingRequests.updateBookingRequestStatus);
  
  // Loading states
  const isLoading = bookingRequest === undefined || !isLoaded;
  
  // If request not found
  const requestNotFound = bookingRequest === null;
  
  // If not signed in
  if (isLoaded && !isSignedIn) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <Card className="text-center p-12 space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold">Please Sign In</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            You need to sign in to view booking request details.
          </p>
          <div className="pt-4">
            <Button variant="default" size="lg" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  if (isLoading) {
    return <RequestDetailSkeleton />;
  }
  
  if (requestNotFound) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <Card className="text-center p-12 space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold">Request Not Found</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            The booking request you are looking for does not exist or you don't have permission to view it.
          </p>
          <div className="pt-4">
            <Button variant="outline" size="lg" asChild>
              <Link href="/messages">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bookings
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  // Determine if user is the owner of the vehicle
  const isOwner = bookingRequest && bookingRequest.ownerUserId === bookingRequest.owner?._id;

  if (!isOwner) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <Card className="text-center p-12 space-y-4">
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold">Not Authorized</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            You do not have permission to view this booking request.
          </p>
          <div className="pt-4">
            <Button variant="outline" size="lg" asChild>
              <Link href="/messages">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bookings
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  // Status badge renderer
  const StatusBadge = ({ status }: { status: "request_sent" | "in_progress" | "accepted" | "rejected" }) => {
    const variants = {
      "request_sent": { color: "bg-blue-100 text-blue-800", icon: <Clock className="h-3.5 w-3.5 mr-1" /> },
      "in_progress": { color: "bg-amber-100 text-amber-800", icon: <Hourglass className="h-3.5 w-3.5 mr-1" /> },
      "accepted": { color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-3.5 w-3.5 mr-1" /> },
      "rejected": { color: "bg-red-100 text-red-800", icon: <XCircle className="h-3.5 w-3.5 mr-1" /> }
    };
    
    const variant = variants[status as keyof typeof variants] || variants["request_sent"];
    
    return (
      <Badge className={`flex items-center font-medium ${variant.color}`}>
        {variant.icon}
        {status.replace("_", " ")}
      </Badge>
    );
  };
  
  // Handle message submission
  const handleMessageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      await addMessage({
        bookingRequestId: requestId,
        message: message.trim()
      });
      
      setMessage("");
      toast.success("Message sent");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle status update
  const handleStatusUpdate = async (newStatus: "request_sent" | "in_progress" | "accepted" | "rejected", message = "") => {
    try {
      await updateRequestStatus({
        bookingRequestId: requestId,
        newStatus,
        message
      });
      
      toast.success(`Request status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating request status:", error);
      toast.error("Failed to update request status");
    }
  };
  
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {bookingRequest.vehicle?.year} {bookingRequest.vehicle?.make} {bookingRequest.vehicle?.model}
              </CardTitle>
              <CardDescription>
                {bookingRequest.vehicle?.color}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video rounded-md overflow-hidden mb-4">
                {bookingRequest.vehicle?.photos && bookingRequest.vehicle.photos.length > 0 ? (
                  <Image
                    src={typeof bookingRequest.vehicle.photos[0] === 'string' 
                      ? bookingRequest.vehicle.photos[0] 
                      : bookingRequest.vehicle.photos[0].url}
                    alt={`${bookingRequest.vehicle.make} ${bookingRequest.vehicle.model}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200">
                    <Car className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Start Date: <span className="ml-2 font-medium">{format(new Date(bookingRequest.startDate), "PPP")}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  End Date: <span className="ml-2 font-medium">{format(new Date(bookingRequest.endDate), "PPP")}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  Duration: <span className="ml-2 font-medium">{bookingRequest.durationDays} days</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-amber-600" />
                Renter Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-4">
                  {bookingRequest.renter?.pictureUrl ? <AvatarImage src={bookingRequest.renter.pictureUrl} /> : null}
                  <AvatarFallback>
                    {bookingRequest.renter?.name?.substring(0, 2).toUpperCase() || "??"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{bookingRequest.renter?.name || "Unknown Renter"}</div>
                  <div className="text-sm text-gray-500">{bookingRequest.renter?.email || "No email provided"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2 text-amber-600" />
                Booking Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingRequest.status === "request_sent" && (
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleStatusUpdate("in_progress", "I'm reviewing your request.")}
                  >
                    <Hourglass className="h-4 w-4 mr-2" />
                    Mark as In Progress
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="destructive"
                    onClick={() => handleStatusUpdate("rejected", "Sorry, this vehicle is not available for the requested dates.")}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Request
                  </Button>
                </div>
              )}
              {bookingRequest.status === "in_progress" && (
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    variant="default"
                    onClick={() => handleStatusUpdate("accepted", "Your booking request has been accepted!")}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accept Request
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="destructive"
                    onClick={() => handleStatusUpdate("rejected", "After review, I cannot accommodate this booking request.")}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Request
                  </Button>
                </div>
              )}
              {bookingRequest.status === "accepted" && (
                <div className="text-green-700 font-semibold">This booking has been accepted.</div>
              )}
              {bookingRequest.status === "rejected" && (
                <div className="text-red-700 font-semibold">This booking has been rejected.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton
function RequestDetailSkeleton() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="mb-8 flex justify-between items-center">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-video w-full rounded-md mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-24 mb-6" />
              
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-full mr-4" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4 py-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${i % 2 === 0 ? 'bg-amber-50' : 'bg-gray-50'} p-3 rounded-lg`}>
                      <div className="flex items-center mb-1">
                        <Skeleton className="h-6 w-6 rounded-full mr-2" />
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16 ml-2" />
                      </div>
                      <Skeleton className="h-4 w-full mt-1" />
                      <Skeleton className="h-4 w-32 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="border-t pt-4">
              <div className="w-full flex space-x-2">
                <Skeleton className="h-20 flex-grow rounded" />
                <Skeleton className="h-10 w-20 rounded" />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 