import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "./ui/button";
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
import {
  createAd,
  getAdById,
  updateAd,
  type CreateAdData,
} from "../services/adApi";

interface FloatingCreateAdProps {
  onAdCreated?: () => void;
  mode: "create" | "edit";
  adId?: string;
  onClose?: () => void;
}

export function FloatingCreateAd({
  onAdCreated,
  mode,
  adId,
  onClose,
}: FloatingCreateAdProps) {
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
  const [currentTime, setCurrentTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadAdData = async () => {
      if (mode === "edit" && adId) {
        try {
          setLoading(true);
          const ad = await getAdById(adId);
          setAdType(ad.type);
          setSubject(ad.subject);
          setAreas(ad.areas);
          setLevel(ad.level);
          setPricePerHour(ad.pricePerHour ? ad.pricePerHour.toString() : "");
          setLocation(ad.location);
          setCity(ad.city || "");
          setDescription(ad.description);
        } catch (err: any) {
          console.error("Error loading ad:", err);
          setError("Failed to load ad data.");
        } finally {
          setLoading(false);
        }
      }
    };
    loadAdData();
  }, [mode, adId]);

  useEffect(() => {
    if (isOpen || mode === "edit") {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen]);

  const handleAddArea = () => {
    if (currentArea.trim() && !areas.includes(currentArea.trim())) {
      setAreas([...areas, currentArea.trim()]);
      setCurrentArea("");
    }
  };

  const handleRemoveArea = (area: string) => {
    setAreas(areas.filter((a) => a !== area));
  };




  const resetForm = () => {
    setSubject("");
    setAreas([]);
    setLevel("");
    setPricePerHour("");
    setLocation("");
    setCity("");
    setDescription("");
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    if (mode === "edit" && onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
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

      const adData: CreateAdData = {
        type: adType,
        subject: subject.trim(),
        areas,
        level,
        pricePerHour: pricePerHour ? parseInt(pricePerHour) : undefined,
        location: location as "online" | "in-person" | "both",
        city: city.trim() || undefined,
        description: description.trim(),
      };

      if (mode === "edit" && adId) {
        await updateAd(adId, adData);
      } else {
        await createAd(adData);
      }

      handleClose();

      if (onAdCreated) {
        onAdCreated();
      }
    } catch (err: any) {
      console.error(
        mode === "edit" ? "Error updating ad:" : "Error creating ad:",
        err
      );
      setError(
        err.response?.data?.message ||
          err.message ||
          (mode === "edit" ? "Failed to update ad." : "Failed to create ad.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {mode === "create" && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg shadow-sunglow-500/20 bg-gradient-to-br from-sunglow-400 to-sunglow-600 hover:from-sunglow-300 hover:to-sunglow-500 flex items-center justify-center text-background transition-all hover:scale-105"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {(mode === "edit" || isOpen) && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={handleClose} />

          <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 max-w-md bg-gray2 text-sunglow-50 border-l border-gray1 z-50 flex flex-col overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-gray1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sunglow-100 text-xl font-semibold">
                  {mode === "edit" ? "Edit Ad" : "Create an Ad"}
                </h2>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    onClose?.()
                  }}
                  className="text-sunglow-200/60 hover:text-sunglow-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sunglow-200/60 text-sm">
                {adType === "tutor"
                  ? "Let students know about your tutoring services"
                  : "Describe what kind of tutor you are looking for"}
              </p>
            </div>

            {success && (
              <div className="mt-4 mx-5 p-3 bg-sunglow-500/10 border border-sunglow-400/30 rounded-lg">
                <p className="text-sunglow-300 text-center text-sm font-medium">Ad created successfully!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5 pl-5 pr-5 pb-10">
              <div className="space-y-2">
                <Label className="text-sunglow-100">I want to...</Label>
                <Select
                  value={adType}
                  onValueChange={(v: "tutor" | "student") => setAdType(v)}
                  disabled={mode === "edit"}
                >
                  <SelectTrigger className="bg-background border-gray1 text-sunglow-100 focus:border-sunglow-400 focus:ring-sunglow-400/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray2 border-gray1">
                    <SelectItem
                      value="tutor"
                      className="text-sunglow-100 focus:bg-sunglow-500/10 focus:text-sunglow-200"
                    >
                      Offer lessons (I'm a tutor)
                    </SelectItem>
                    <SelectItem
                      value="student"
                      className="text-sunglow-100 focus:bg-sunglow-500/10 focus:text-sunglow-200"
                    >
                      Find a tutor (I'm looking for lessons)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sunglow-100">
                  Subject *
                </Label>
                <Input
                  id="subject"
                  placeholder="e.g., Mathematics, English, Programming"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-background border-gray1 text-sunglow-100 placeholder:text-sunglow-200/40 focus:border-sunglow-400 focus:ring-sunglow-400/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="areas" className="text-sunglow-100">
                  Specific Areas *
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="areas"
                    placeholder="e.g., Calculus, Algebra"
                    value={currentArea}
                    onChange={(e) => setCurrentArea(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddArea()
                      }
                    }}
                    className="bg-background border-gray1 text-sunglow-100 placeholder:text-sunglow-200/40 focus:border-sunglow-400 focus:ring-sunglow-400/20"
                  />
                  <Button
                    type="button"
                    onClick={handleAddArea}
                    size="icon"
                    className="bg-sunglow-500 hover:bg-sunglow-400 text-background"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {areas.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {areas.map((area) => (
                      <Badge
                        key={area}
                        className="flex items-center gap-1 bg-sunglow-500/15 text-sunglow-300 border border-sunglow-400/30 hover:bg-sunglow-500/20"
                      >
                        {area}
                        <button
                          type="button"
                          onClick={() => handleRemoveArea(area)}
                          className="hover:text-sunglow-100 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="level" className="text-sunglow-100">
                  Level *
                </Label>
                <Select value={level} onValueChange={setLevel} required>
                  <SelectTrigger className="bg-background border-gray1 text-sunglow-100 focus:border-sunglow-400 focus:ring-sunglow-400/20">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray2 border-gray1">
                    <SelectItem
                      value="Elementary"
                      className="text-sunglow-100 focus:bg-sunglow-500/10 focus:text-sunglow-200"
                    >
                      Elementary
                    </SelectItem>
                    <SelectItem
                      value="High School"
                      className="text-sunglow-100 focus:bg-sunglow-500/10 focus:text-sunglow-200"
                    >
                      High School
                    </SelectItem>
                    <SelectItem
                      value="College"
                      className="text-sunglow-100 focus:bg-sunglow-500/10 focus:text-sunglow-200"
                    >
                      College
                    </SelectItem>
                    <SelectItem
                      value="Professional"
                      className="text-sunglow-100 focus:bg-sunglow-500/10 focus:text-sunglow-200"
                    >
                      Professional
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-sunglow-100">
                  Price per Hour (USD)
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 45"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(e.target.value)}
                  min="0"
                  className="bg-background border-gray1 text-sunglow-100 placeholder:text-sunglow-200/40 focus:border-sunglow-400 focus:ring-sunglow-400/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sunglow-100">
                  Location Type *
                </Label>
                <Select value={location} onValueChange={setLocation} required>
                  <SelectTrigger className="bg-background border-gray1 text-sunglow-100 focus:border-sunglow-400 focus:ring-sunglow-400/20">
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray2 border-gray1">
                    <SelectItem
                      value="online"
                      className="text-sunglow-100 focus:bg-sunglow-500/10 focus:text-sunglow-200"
                    >
                      Online only
                    </SelectItem>
                    <SelectItem
                      value="in-person"
                      className="text-sunglow-100 focus:bg-sunglow-500/10 focus:text-sunglow-200"
                    >
                      In-person only
                    </SelectItem>
                    <SelectItem
                      value="both"
                      className="text-sunglow-100 focus:bg-sunglow-500/10 focus:text-sunglow-200"
                    >
                      Both online and in-person
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(location === "in-person" || location === "both") && (
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sunglow-100">
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="e.g., New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-background border-gray1 text-sunglow-100 placeholder:text-sunglow-200/40 focus:border-sunglow-400 focus:ring-sunglow-400/20"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sunglow-100">
                  Description *
                </Label>
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
                  className="bg-background border-gray1 text-sunglow-100 placeholder:text-sunglow-200/40 resize-none focus:border-sunglow-400 focus:ring-sunglow-400/20"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-sunglow-500/10 border border-sunglow-400/30 rounded-lg">
                  <p className="text-sunglow-300 text-center text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-sunglow-500 to-sunglow-600 hover:from-sunglow-400 hover:to-sunglow-500 text-background font-semibold cursor-pointer transition-all"
                disabled={loading}
              >
                {loading
                  ? mode === "edit"
                    ? "Saving Changes..."
                    : "Creating Ad..."
                  : mode === "edit"
                    ? "Save Changes"
                    : "Create Ad"}
              </Button>
            </form>
          </div>
        </>
      )}
    </>
  )
}
