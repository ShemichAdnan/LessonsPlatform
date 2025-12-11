import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import type { User } from "../App";
import { createAd } from "../services/adApi";

interface FloatingCreateAdProps {
  user: User;
  onAdCreated?: () => void;
}

export function FloatingCreateAd({ user, onAdCreated }: FloatingCreateAdProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [adType, setAdType] = useState<"tutor" | "student">("tutor");
  const [subject, setSubject] = useState("");
  const [areas, setAreas] = useState<string[]>([]);
  const [currentArea, setCurrentArea] = useState("");
  const [level, setLevel] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAddArea = () => {
    if (currentArea.trim() && !areas.includes(currentArea.trim())) {
      setAreas([...areas, currentArea.trim()]);
      setCurrentArea("");
    }
  };

  const handleRemoveArea = (area: string) => {
    setAreas(areas.filter((a) => a !== area));
  };

  const handleAddTime = () => {
    if (currentTime.trim() && !availableTimes.includes(currentTime.trim())) {
      setAvailableTimes([...availableTimes, currentTime.trim()]);
      setCurrentTime("");
    }
  };

  const handleRemoveTime = (time: string) => {
    setAvailableTimes(availableTimes.filter((t) => t !== time));
  };

  const resetForm = () => {
    setSubject("");
    setAreas([]);
    setLevel("");
    setPricePerHour("");
    setLocation("");
    setCity("");
    setDescription("");
    setAvailableTimes([]);
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (areas.length === 0) {
        throw new Error("Please add at least one specific area.");
      }
      if (!level) {
        throw new Error("Please select a level.");
      }
      if (!location) {
        throw new Error("Please select a location type.");
      }
      if (description.trim().length < 20) {
        throw new Error("Description must be at least 20 characters long.");
      }

      const adData = {
        type: adType,
        subject: subject.trim(),
        areas,
        level,
        pricePerHour: pricePerHour ? parseInt(pricePerHour) : undefined,
        location,
        city,
        description,
        availableTimes,
      };

      await createAd(adData);
      setSuccess(true);
      resetForm();

      if (onAdCreated) {
        onAdCreated();
      }

      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 1000);
    } catch (err: any) {
      console.error("Error creating ad:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to create ad."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="bg-gray-800 text-white border-gray-700 w-[500px] overflow-auto no-scrollbar"
        >
          <SheetHeader>
            <SheetTitle className="text-white text-xl">Create an Ad</SheetTitle>
            <SheetDescription className="text-gray-400">
              {adType === "tutor"
                ? "Let students know about your tutoring services"
                : "Describe what kind of tutor you are looking for"}
            </SheetDescription>
          </SheetHeader>

          {success && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg">
              <p className="text-green-400 text-center text-sm font-medium">
                ✓ Ad created successfully!
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5 pl-5 pr-5 pb-10"
          >
            <div className="space-y-2">
              <Label>I want to...</Label>
              <Select
                value={adType}
                onValueChange={(v: "tutor" | "student") => setAdType(v)}
              >
                <SelectTrigger className="bg-gray-900 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tutor">
                    Offer lessons (I'm a tutor)
                  </SelectItem>
                  <SelectItem value="student">
                    Find a tutor (I'm looking for lessons)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics, English, Programming"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-gray-900 border-gray-600"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="areas">Specific Areas *</Label>
              <div className="flex gap-2">
                <Input
                  id="areas"
                  placeholder="e.g., Calculus, Algebra"
                  value={currentArea}
                  onChange={(e) => setCurrentArea(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddArea();
                    }
                  }}
                  className="bg-gray-900 border-gray-600"
                />
                <Button
                  type="button"
                  onClick={handleAddArea}
                  size="icon"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {areas.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {areas.map((area) => (
                    <Badge
                      key={area}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {area}
                      <button
                        type="button"
                        onClick={() => handleRemoveArea(area)}
                        className="hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select value={level} onValueChange={setLevel} required>
                <SelectTrigger className="bg-gray-900 border-gray-600">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Elementary">Elementary</SelectItem>
                  <SelectItem value="High School">High School</SelectItem>
                  <SelectItem value="College">College</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Hour (USD)</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g., 45"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
                min="0"
                className="bg-gray-900 border-gray-600"
              />
            </div>

            {adType === "tutor" && (
              <div className="space-y-2">
                <Label htmlFor="times">Available Times</Label>
                <div className="flex gap-2">
                  <Input
                    id="times"
                    placeholder="e.g., Mon 17:00-19:00"
                    value={currentTime}
                    onChange={(e) => setCurrentTime(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTime();
                      }
                    }}
                    className="bg-gray-900 border-gray-600"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTime}
                    size="icon"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {availableTimes.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {availableTimes.map((time) => (
                      <Badge
                        key={time}
                        variant="outline"
                        className="flex items-center gap-2 justify-between w-full"
                      >
                        {time}
                        <button
                          type="button"
                          onClick={() => handleRemoveTime(time)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="location">Location Type *</Label>
              <Select value={location} onValueChange={setLocation} required>
                <SelectTrigger className="bg-gray-900 border-gray-600">
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online only</SelectItem>
                  <SelectItem value="in-person">In-person only</SelectItem>
                  <SelectItem value="both">
                    Both online and in-person
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(location === "in-person" || location === "both") && (
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="e.g., New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-gray-900 border-gray-600"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder={
                  adType === "tutor"
                    ? "Describe your teaching experience, approach, and what makes you a great tutor..."
                    : "Describe what you are looking for, your current level, and your learning goals..."
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="bg-gray-900 border-gray-600 resize-none"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-center text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Creating Ad..." : "Create Ad"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
