import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { User as UserType } from "../App";

interface Booking {
  id: string;
  tutorId: string;
  studentId: string;
  tutorName: string;
  studentName: string;
  subject: string;
  date: string;
  time: string;
  location: "online" | "in-person";
  city?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  pricePerHour: number;
}

// Mock data
const mockBookings: Booking[] = [
  {
    id: "1",
    tutorId: "1",
    studentId: "3",
    tutorName: "Sarah Johnson",
    studentName: "Emma Davis",
    subject: "Mathematics",
    date: "2025-11-20",
    time: "17:00-18:00",
    location: "online",
    status: "confirmed",
    pricePerHour: 45,
  },
  {
    id: "2",
    tutorId: "4",
    studentId: "3",
    tutorName: "Alex Chen",
    studentName: "Emma Davis",
    subject: "Programming",
    date: "2025-11-18",
    time: "18:00-19:00",
    location: "online",
    status: "pending",
    pricePerHour: 60,
  },
  {
    id: "3",
    tutorId: "1",
    studentId: "6",
    tutorName: "Sarah Johnson",
    studentName: "John Smith",
    subject: "Mathematics",
    date: "2025-11-15",
    time: "17:00-18:00",
    location: "online",
    status: "completed",
    pricePerHour: 45,
  },
];

interface MyBookingsProps {
  user: UserType;
}

export function MyBookings({ user }: MyBookingsProps) {
  const [bookings] = useState<Booking[]>(mockBookings);

  const userBookings = bookings;

  const pendingBookings = userBookings.filter((b) => b.status === "pending");
  const confirmedBookings = userBookings.filter(
    (b) => b.status === "confirmed"
  );
  const pastBookings = userBookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleAccept = (bookingId: string) => {
    alert(`Booking ${bookingId} accepted! (This is a demo)`);
  };

  const handleDecline = (bookingId: string) => {
    alert(`Booking ${bookingId} declined! (This is a demo)`);
  };

  const BookingCard = ({ booking }: { booking: Booking }) => {
    const otherPersonName = booking.tutorName;

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  {otherPersonName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{otherPersonName}</CardTitle>
                <Card>{booking.subject}</Card>
              </div>
            </div>
            <Badge className={getStatusColor(booking.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(booking.status)}
                {booking.status}
              </span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(booking.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{booking.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="capitalize">{booking.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span>${booking.pricePerHour}/hour</span>
            </div>
          </div>

          {booking.status === "pending" && (
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => handleAccept(booking.id)}
              >
                Accept
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleDecline(booking.id)}
              >
                Decline
              </Button>
            </div>
          )}

          {booking.status === "confirmed" && (
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          )}

          {booking.status === "completed" && (
            <Button variant="outline" className="w-full">
              Leave a Review
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-full overflow-auto bg-gray-900">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl mb-2">My Bookings</h1>
          <p className="text-gray-400">
            View and manage your scheduled lessons
          </p>
        </div>

        <Tabs defaultValue="confirmed" className="space-y-6">
          <TabsList>
            <TabsTrigger value="confirmed">
              Confirmed ({confirmedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="confirmed" className="space-y-4">
            {confirmedBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-400">No confirmed bookings yet</p>
                </CardContent>
              </Card>
            ) : (
              confirmedBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-400">No pending bookings</p>
                </CardContent>
              </Card>
            ) : (
              pendingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-400">No past bookings</p>
                </CardContent>
              </Card>
            ) : (
              pastBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
