import { useNavigate } from "react-router-dom";
import type { Ad } from "../App";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { DollarSign, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { FloatingCreateAd } from "./FloatingCreateAd";
import { getAdById } from "../services/adApi";

interface AdCardProps {
  ad: Ad;
  onAdUpdated?: () => void;
}
export const AdCard = ({ ad: initialAd, onAdUpdated }: AdCardProps) => {
  const navigate = useNavigate();
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const { currentUser: user } = useAuth();
  const [ad, setAd] = useState<Ad>(initialAd);

  // Update local state when prop changes
  useEffect(() => {
    setAd(initialAd);
  }, [initialAd]);

  const handleAdUpdated = async () => {
    // Refetch the ad to get updated data
    try {
      const updatedAd = await getAdById(ad.id);
      setAd(updatedAd);
    } catch (error) {
      console.error("Failed to refetch ad:", error);
    }

    // Call parent callback if provided
    if (onAdUpdated) {
      onAdUpdated();
    }
  };

  return (
    <>
      <Card
        key={ad.id}
        onClick={() => navigate(`/ads/${ad.id}`)}
        className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer"
      >
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="flex gap-2 flex-wrap">
              <Badge variant={ad.type === "tutor" ? "default" : "secondary"}>
                {ad.type === "tutor" ? "👨‍🏫 Tutor" : "🎓 Student"}
              </Badge>
              {user && user.id === ad.userId && (
                <Badge
                  variant="outline"
                  className="bg-green-500/20 text-green-400 border-green-500/50"
                >
                  ✨ Your Ad
                </Badge>
              )}
            </div>
            {ad.pricePerHour && (
              <div className="flex items-center gap-1 text-green-400">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold">{ad.pricePerHour}/hr</span>
              </div>
            )}
          </div>
          <CardTitle className="text-xl">{ad.subject}</CardTitle>
          <CardDescription>
            <div className="flex items-center gap-1 mt-1">
              <span className="font-medium text-gray-300">{ad.user.name}</span>
              {ad.user.experience && (
                <span className="text-gray-500">
                  • {ad.user.experience}y exp
                </span>
              )}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            {ad.areas.slice(0, 3).map((area: string) => (
              <Badge key={area} variant="outline" className="text-xs">
                {area}
              </Badge>
            ))}
            {ad.areas.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{ad.areas.length - 3} more
              </Badge>
            )}
          </div>

          <p className="text-sm text-gray-400 line-clamp-2 mb-3">
            {ad.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span>📚 {ad.level}</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {ad.location === "online" && "Online"}
              {ad.location === "in-person" && (ad.city || "In-person")}
              {ad.location === "both" && "Online & In-person"}
            </span>
          </div>

          {user && user.id !== ad.userId ? (
            <Button
              className="w-full cursor-pointer"
              variant="outline"
              size="sm"
            >
              View Details
            </Button>
          ) : (
            <Button
              className="w-full cursor-pointer"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditPanelOpen(true);
              }}
            >
              Edit
            </Button>
          )}
        </CardContent>
      </Card>
      {isEditPanelOpen && (
        <FloatingCreateAd
          mode="edit"
          adId={ad.id}
          onClose={() => setIsEditPanelOpen(false)}
          onAdCreated={handleAdUpdated}
        />
      )}
    </>
  );
};
export default AdCard;
