import { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  DollarSign,
  Calendar,
  Star,
  MessageSquare,
  Filter,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import type { User, Ad } from "../App";

// Mock data
const mockAds: Ad[] = [
  {
    id: "1",
    userId: "1",
    type: "tutor",
    subject: "Mathematics",
    areas: ["Calculus", "Linear Algebra", "Statistics"],
    level: "College",
    pricePerHour: 45,
    availableTimes: ["Mon 17:00-19:00", "Wed 17:00-19:00", "Fri 15:00-17:00"],
    location: "both",
    city: "New York",
    description:
      "Experienced math tutor with 5 years of teaching. Specializing in college-level mathematics. Patient and results-oriented approach.",
    createdAt: "2025-11-10",
    rating: 4.8,
    reviews: 24,
    user: {
      id: "1",
      email: "sarah@example.com",
      name: "Sarah Johnson",
      role: "tutor",
      experience: 5,
      subjects: ["Mathematics"],
    },
  },
  {
    id: "2",
    userId: "2",
    type: "tutor",
    subject: "English",
    areas: ["Grammar", "Writing", "Literature", "TOEFL Prep"],
    level: "High School",
    pricePerHour: 35,
    availableTimes: ["Tue 16:00-20:00", "Thu 16:00-20:00", "Sat 10:00-14:00"],
    location: "online",
    description:
      "Native English speaker with teaching certification. Help students improve their writing, reading comprehension, and exam preparation.",
    createdAt: "2025-11-12",
    rating: 4.9,
    reviews: 18,
    user: {
      id: "2",
      email: "mike@example.com",
      name: "Mike Anderson",
      role: "tutor",
      experience: 3,
      subjects: ["English"],
    },
  },
  {
    id: "3",
    userId: "3",
    type: "student",
    subject: "Physics",
    areas: ["Mechanics", "Thermodynamics"],
    level: "College",
    pricePerHour: 40,
    location: "online",
    description:
      "Looking for a physics tutor to help with college-level mechanics and thermodynamics. Prefer online sessions twice a week.",
    createdAt: "2025-11-14",
    user: {
      id: "3",
      email: "emma@example.com",
      name: "Emma Davis",
      role: "student",
    },
  },
  {
    id: "4",
    userId: "4",
    type: "tutor",
    subject: "Programming",
    areas: ["Python", "JavaScript", "React", "Data Structures"],
    level: "College",
    pricePerHour: 60,
    availableTimes: ["Mon 18:00-21:00", "Wed 18:00-21:00", "Sat 14:00-18:00"],
    location: "online",
    description:
      "Senior software engineer offering programming tutoring. Real-world experience in web development and algorithms. Perfect for beginners to intermediate learners.",
    createdAt: "2025-11-13",
    rating: 5.0,
    reviews: 31,
    user: {
      id: "4",
      email: "alex@example.com",
      name: "Alex Chen",
      role: "tutor",
      experience: 7,
      subjects: ["Programming", "Computer Science"],
    },
  },
  {
    id: "5",
    userId: "5",
    type: "tutor",
    subject: "Chemistry",
    areas: ["Organic Chemistry", "Inorganic Chemistry", "Lab Techniques"],
    level: "High School",
    pricePerHour: 40,
    availableTimes: ["Mon 15:00-18:00", "Thu 15:00-18:00"],
    location: "in-person",
    city: "Boston",
    description:
      "PhD student in Chemistry. Passionate about making chemistry fun and understandable. Available for in-person sessions in Boston area.",
    createdAt: "2025-11-11",
    rating: 4.7,
    reviews: 12,
    user: {
      id: "5",
      email: "lisa@example.com",
      name: "Lisa Martinez",
      role: "tutor",
      experience: 2,
      subjects: ["Chemistry"],
    },
  },
  {
    id: "6",
    userId: "6",
    type: "student",
    subject: "Spanish",
    areas: ["Conversation", "Grammar"],
    level: "Elementary",
    pricePerHour: 25,
    location: "online",
    description:
      "Beginner looking to learn conversational Spanish. Prefer native speaker for online lessons 2-3 times per week.",
    createdAt: "2025-11-15",
    user: {
      id: "6",
      email: "john@example.com",
      name: "John Smith",
      role: "student",
    },
  },
];

interface BrowseAdsProps {
  user: User;
}

export function BrowseAds({ user }: BrowseAdsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "tutor" | "student">(
    "all"
  );
  const [filterLocation, setFilterLocation] = useState<
    "all" | "online" | "in-person" | "both"
  >("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);

  const filteredAds = useMemo(() => {
    return mockAds.filter((ad) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        ad.subject.toLowerCase().includes(searchLower) ||
        ad.areas.some((area) => area.toLowerCase().includes(searchLower)) ||
        ad.user.name.toLowerCase().includes(searchLower) ||
        ad.description.toLowerCase().includes(searchLower);

      // Type filter
      const matchesType = filterType === "all" || ad.type === filterType;

      // Location filter
      const matchesLocation =
        filterLocation === "all" ||
        ad.location === filterLocation ||
        ad.location === "both";

      // Level filter
      const matchesLevel = filterLevel === "all" || ad.level === filterLevel;

      // Price filter
      const price = ad.pricePerHour || 0;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      return (
        matchesSearch &&
        matchesType &&
        matchesLocation &&
        matchesLevel &&
        matchesPrice
      );
    });
  }, [searchQuery, filterType, filterLocation, filterLevel, priceRange]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <h1 className="text-3xl mb-2">Browse Lessons</h1>
        <p className="text-gray-400">
          Find the perfect tutor or connect with students
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 border-b border-gray-700 p-3 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by subject, area, or tutor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Options</DialogTitle>
                <DialogDescription>
                  Refine your search results
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-2 ">
                  <Label>Location</Label>
                  <Select
                    value={filterLocation}
                    onValueChange={(v: any) => setFilterLocation(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Elementary">Elementary</SelectItem>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="College">College</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>
                    Price Range: ${priceRange[0]} - ${priceRange[1]}/hour
                  </Label>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={filterType} onValueChange={(v: any) => setFilterType(v)}>
          <TabsList className="gap-3">
            <TabsTrigger
              value="all"
              className="hover:bg-gray-700  data-[state=active]:bg-gray-700 text-gray-100 cursor-pointer"
            >
              All Ads
            </TabsTrigger>
            <TabsTrigger
              value="tutor"
              className="hover:bg-gray-700  data-[state=active]:bg-gray-700 text-gray-100 cursor-pointer"
            >
              Tutors
            </TabsTrigger>
            <TabsTrigger
              value="student"
              className="hover:bg-gray-700  data-[state=active]:bg-gray-700 text-gray-100 cursor-pointer"
            >
              Students
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto p-6 bg-gray-900 overflow-scroll no-scrollbar">
        <div className="mb-4 text-gray-400">
          {filteredAds.length} {filteredAds.length === 1 ? "result" : "results"}{" "}
          found
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAds.map((ad) => (
            <Card
              key={ad.id}
              className="bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border-gray-700 hover:shadow-lg hover:border-blue-500 hover:from-gray-750 hover:via-gray-750 hover:to-gray-850 transition-all cursor-pointer flex flex-col"
              onClick={() => setSelectedAd(ad)}
            >
              <CardHeader>
                <div className="flex items-start gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src={ad.user.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                      {ad.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg truncate">
                        {ad.user.name}
                      </CardTitle>
                      <Badge
                        variant={ad.type === "tutor" ? "default" : "secondary"}
                      >
                        {ad.type}
                      </Badge>
                    </div>
                    <CardDescription className="truncate">
                      {ad.subject}
                    </CardDescription>
                  </div>
                </div>
                <div className="h-6">
                  {ad.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{ad.rating}</span>
                      <span className="text-gray-400">
                        ({ad.reviews} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 flex flex-col">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {ad.areas.slice(0, 3).map((area) => (
                      <Badge key={area} variant="outline">
                        {area}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {ad.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    {ad.pricePerHour && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${ad.pricePerHour}/hr</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="capitalize">
                        {ad.location === "both"
                          ? "Online & In-person"
                          : ad.location}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full cursor-pointer bg-gradient-to-br from-blue-600 to-purple-600 mt-auto"
                  variant="outline"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Ad Details Dialog */}
      {selectedAd && (
        <Dialog open={!!selectedAd} onOpenChange={() => setSelectedAd(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedAd.user.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xl">
                    {selectedAd.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <DialogTitle className="text-2xl">
                      {selectedAd.user.name}
                    </DialogTitle>
                    <Badge
                      variant={
                        selectedAd.type === "tutor" ? "default" : "secondary"
                      }
                    >
                      {selectedAd.type}
                    </Badge>
                  </div>
                  <DialogDescription className="text-lg">
                    {selectedAd.subject}
                  </DialogDescription>
                  {selectedAd.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg">{selectedAd.rating}</span>
                      <span className="text-gray-400">
                        ({selectedAd.reviews} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-white">Areas Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAd.areas.map((area) => (
                    <Badge key={area} variant="outline">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-white">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <DollarSign className="w-5 h-5" />
                    <span>${selectedAd.pricePerHour || "N/A"}/hour</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-5 h-5" />
                    <span className="capitalize">{selectedAd.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-5 h-5" />
                    <span>{selectedAd.level}</span>
                  </div>
                  {selectedAd.city && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-5 h-5" />
                      <span>{selectedAd.city}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedAd.availableTimes &&
                selectedAd.availableTimes.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-white">Available Times</h3>
                    <div className="space-y-2">
                      {selectedAd.availableTimes.map((time, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-gray-400"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div>
                <h3 className="mb-3 text-white">Description</h3>
                <p className="text-gray-400">{selectedAd.description}</p>
              </div>

              <Button className="w-full bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
