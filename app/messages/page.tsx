"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Clock, Check, X, Car, Calendar, User, MessageSquare, AlertCircle, 
  CheckCircle, XCircle, Hourglass
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function MessagesPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [activeTab, setActiveTab] = useState("received");
  
  // Get booking requests
  const myVehicleRequests = useQuery(api.bookingRequests.getMyVehicleBookingRequests);
  const myRentalRequests = useQuery(api.bookingRequests.getMyRentalRequests);
  
  // Update status mutation
  const updateRequestStatus = useMutation(api.bookingRequests.updateBookingRequestStatus);
  
  // Loading states
  const isLoading = myVehicleRequests === undefined || myRentalRequests === undefined || !isLoaded;
  
  // Empty states
  const noVehicleRequests = myVehicleRequests && myVehicleRequests.length === 0;
  const noRentalRequests = myRentalRequests && myRentalRequests.length === 0;
  
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
            You need to sign in to view your messages and booking requests.
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
  
  // Handle status update
  const handleStatusUpdate = async (requestId, newStatus, message = "") => {
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
  
  // Status badge renderer
  const StatusBadge = ({ status }) => {
    const variants = {
      "request_sent": { color: "bg-blue-100 text-blue-800", icon: <Clock className="h-3.5 w-3.5 mr-1" /> },
      "in_progress": { color: "bg-amber-100 text-amber-800", icon: <Hourglass className="h-3.5 w-3.5 mr-1" /> },
      "accepted": { color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-3.5 w-3.5 mr-1" /> },
      "rejected": { color: "bg-red-100 text-red-800", icon: <XCircle className="h-3.5 w-3.5 mr-1" /> }
    };
    
    const variant = variants[status] || variants["request_sent"];
    
    return (
      <Badge className={`flex items-center font-medium ${variant.color}`}>
        {variant.icon}
        {status.replace("_", " ")}
      </Badge>
    );
  };
  
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-gray-600 mt-2">
          Manage your car rental requests and bookings.
        </p>
      </div>
      
      <Tabs defaultValue="received" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full mb-8">
          <TabsTrigger value="received">Received Requests</TabsTrigger>
          <TabsTrigger value="sent">My Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="received">
          {isLoading ? (
            <RequestsLoading />
          ) : noVehicleRequests ? (
            <EmptyState 
              title="No Booking Requests" 
              description="You haven't received any booking requests for your vehicles yet."
              icon={Car}
            />
          ) : (
            <div className="space-y-6">
              {myVehicleRequests.map((request) => (
                <Card key={request._id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b pb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <Car className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {request.vehicle?.year} {request.vehicle?.make} {request.vehicle?.model}
                          </CardTitle>
                          <CardDescription>
                            Requested by {request.renter?.name || "Unknown User"}
                          </CardDescription>
                        </div>
                      </div>
                      <StatusBadge status={request.status} />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Start Date
                        </div>
                        <div className="font-medium">
                          {format(new Date(request.startDate), "PPP")}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          End Date
                        </div>
                        <div className="font-medium">
                          {format(new Date(request.endDate), "PPP")}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Duration
                        </div>
                        <div className="font-medium">
                          {request.durationDays} days
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 border-t pt-6">
                      <div className="flex items-center mb-4">
                        <User className="h-5 w-5 mr-2 text-gray-500" />
                        <h3 className="font-medium">Renter Information</h3>
                      </div>
                      
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4">
                          {request.renter?.pictureUrl ? (
                            <AvatarImage src={request.renter.pictureUrl} />
                          ) : null}
                          <AvatarFallback>
                            {request.renter?.name?.substring(0, 2).toUpperCase() || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{request.renter?.name || "Unknown User"}</div>
                          <div className="text-sm text-gray-500">{request.renter?.email || "No email provided"}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Optional: Show the most recent message */}
                    {request.messages && request.messages.length > 0 && (
                      <div className="mt-4 border-t pt-4">
                        <div className="flex items-center mb-2">
                          <MessageSquare className="h-5 w-5 mr-2 text-gray-500" />
                          <h3 className="font-medium">Latest Message</h3>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <p className="text-sm">{request.messages[request.messages.length - 1].text}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="bg-gray-50 border-t pt-4 flex justify-between">
                    <div className="flex space-x-2">
                      {request.status === "request_sent" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(request._id, "in_progress", "I'm reviewing your request.")}
                          >
                            <Hourglass className="h-4 w-4 mr-2" />
                            In Progress
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleStatusUpdate(request._id, "rejected", "Sorry, this vehicle is not available for the requested dates.")}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {request.status === "in_progress" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(request._id, "accepted", "Your booking request has been accepted!")}
                          >
                            <Check className="h-4 w-4 mr-2 text-green-600" />
                            Accept
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleStatusUpdate(request._id, "rejected", "After review, I cannot accommodate this booking request.")}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="sent">
          {isLoading ? (
            <RequestsLoading />
          ) : noRentalRequests ? (
            <EmptyState 
              title="No Bookings" 
              description="You haven't made any car rental requests yet."
              icon={Car}
            />
          ) : (
            <div className="space-y-6">
              {myRentalRequests.map((request) => (
                <Card key={request._id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b pb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <Car className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {request.vehicle?.year} {request.vehicle?.make} {request.vehicle?.model}
                          </CardTitle>
                          <CardDescription>
                            Owned by {request.owner?.name || "Unknown Host"}
                          </CardDescription>
                        </div>
                      </div>
                      <StatusBadge status={request.status} />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Start Date
                        </div>
                        <div className="font-medium">
                          {format(new Date(request.startDate), "PPP")}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          End Date
                        </div>
                        <div className="font-medium">
                          {format(new Date(request.endDate), "PPP")}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Duration
                        </div>
                        <div className="font-medium">
                          {request.durationDays} days
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Timeline */}
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="text-sm font-medium mb-4">Request Status</h3>
                      <div className="space-y-4">
                        <StatusItem 
                          title="Request Sent" 
                          date={format(new Date(request.createdAt), "PPp")}
                          isActive={true}
                          isCompleted={true}
                        />
                        
                        <StatusItem 
                          title="In Progress" 
                          date={request.status === "in_progress" || request.status === "accepted" || request.status === "rejected"
                            ? format(new Date(request.statusUpdatedAt), "PPp") : null}
                          isActive={request.status === "in_progress"}
                          isCompleted={request.status === "in_progress" || request.status === "accepted" || request.status === "rejected"}
                        />
                        
                        <StatusItem 
                          title={request.status === "rejected" ? "Rejected" : "Accepted"} 
                          date={request.status === "accepted" || request.status === "rejected"
                            ? format(new Date(request.statusUpdatedAt), "PPp") : null}
                          isActive={request.status === "accepted" || request.status === "rejected"}
                          isCompleted={request.status === "accepted" || request.status === "rejected"}
                          isRejected={request.status === "rejected"}
                        />
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="bg-gray-50 border-t pt-4">
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Status Item component for the timeline
function StatusItem({ title, date, isActive, isCompleted, isRejected = false }) {
  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        <div className={`rounded-full p-1 ${
          isRejected 
            ? "bg-red-100 text-red-600" 
            : isActive 
              ? "bg-amber-100 text-amber-600" 
              : isCompleted 
                ? "bg-green-100 text-green-600" 
                : "bg-gray-100 text-gray-400"
        }`}>
          {isRejected ? (
            <X className="h-4 w-4" />
          ) : isCompleted ? (
            <Check className="h-4 w-4" />
          ) : (
            <Clock className="h-4 w-4" />
          )}
        </div>
        {!isActive && <div className="h-full w-0.5 bg-gray-200 my-1 ml-[0.1rem]"></div>}
      </div>
      
      <div className="pb-5">
        <p className={`font-medium ${
          isRejected 
            ? "text-red-600" 
            : isActive 
              ? "text-amber-600" 
              : isCompleted 
                ? "text-green-600" 
                : "text-gray-400"
        }`}>
          {title}
        </p>
        {date && <p className="text-xs text-gray-500">{date}</p>}
      </div>
    </div>
  );
}

// Loading state
function RequestsLoading() {
  return (
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24 mt-1" />
                </div>
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <Skeleton className="h-4 w-48 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex">
                    <Skeleton className="h-6 w-6 rounded-full mr-4" />
                    <div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-4">
            <Skeleton className="h-9 w-full rounded" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

// Empty state
function EmptyState({ title, description, icon: Icon }) {
  return (
    <Card className="text-center p-12 space-y-4">
      <div className="flex justify-center">
        <div className="bg-amber-100 p-4 rounded-full">
          <Icon className="h-12 w-12 text-amber-600" />
        </div>
      </div>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        {description}
      </p>
    </Card>
  );
} 