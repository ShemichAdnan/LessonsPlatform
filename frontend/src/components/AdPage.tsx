import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAdById, getAds } from "../services/adApi";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  MapPin,
  Mail,
  DollarSign,
  ArrowLeft,
  UserIcon,
  BookOpen,
  Clock,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import AdCard from "./AdCard";
import { useAuth } from "../contexts/AuthContext";
import { startConversation } from "../services/messageServices";
import defaultAvatar from "../assets/images/defaultAvatar.png";

export const AdPage = () => {
  const { adId } = useParams<{ adId: string }>();
  const { currentUser: user } = useAuth();
  const [ad, setAd] = useState<any>(null);
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startingChat, setStartingChat] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAd = async () => {
      if (!adId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getAdById(adId);
        setAd(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch ad");
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [adId]);

  const fetchAds = async () => {
    if (!adId) return;
    try {
      const adsData = await getAds({});
      const filteredAds = adsData.filter((a: any) => a.id !== adId);
      setAds(filteredAds);
    } catch (err: any) {
      console.error("Failed to fetch other ads:", err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [adId]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sunglow-400"></div>
          <p className="mt-4 text-sunglow-200/70">Loading ad...</p>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="bg-background min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/browse")}
            className="mb-4 text-sunglow-200 hover:text-sunglow-300 hover:bg-gray1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Button>
          <Card className="bg-sunglow-500/10 border-sunglow-500/30">
            <CardContent className="pt-6 text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sunglow-500/10 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-sunglow-400" />
              </div>
              <p className="text-sunglow-300">{error || "Ad not found"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isTutor = ad.type === "tutor";

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/browse")}
          className="mb-6 hover:bg-gray1 text-sunglow-200/70 hover:text-sunglow-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>

        <Card className="bg-gray2 border-gray1 gap-0 overflow-hidden mb-8 backdrop-blur-sm">
          <div className="h-1 bg-gradient-to-r from-sunglow-500 to-sunglow-400" />

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="flex flex-col items-center ">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-sunglow-500 to-sunglow-400 opacity-75 blur-sm" />
                  <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full ring-2 ring-sunglow-500/50 overflow-hidden bg-background">
                    <img
                      src={ad.user.avatarUrl || defaultAvatar}
                      alt={ad.user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultAvatar;
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 text-center flex justify-center items-center flex-col ">
                  <h3 className="text-lg font-semibold text-sunglow-50">
                    {ad.user.name}
                  </h3>
                  {ad.user.experience != null && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ad.user.experience}y experience
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-sunglow-500/20 text-sunglow-300 border-sunglow-500/30 px-3 py-1">
                      {isTutor ? (
                        <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                      ) : (
                        <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                      )}
                      {isTutor ? "Tutor" : "Student"}
                    </Badge>
                    {user && user.id === ad.userId && (
                      <Badge className="bg-gradient-to-r from-sunglow-500 to-sunglow-600 text-sunglow-950 border-0 shadow-lg shadow-sunglow-500/20 font-semibold">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Your Ad
                      </Badge>
                    )}
                  </div>
                  {ad.pricePerHour && (
                    <div className="flex items-center gap-1 text-sunglow-300 font-bold text-xl">
                      <DollarSign className="w-5 h-5" />
                      <span>{ad.pricePerHour}</span>
                      <span className="text-sunglow-200/50 text-sm font-normal">
                        /hr
                      </span>
                    </div>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-sunglow-50 mb-4">
                  {ad.subject}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sunglow-100 mb-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sunglow-500/10">
                    <BookOpen className="w-4 h-4 text-sunglow-400" />
                    <span className="font-medium">{ad.level}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray1">
                    <MapPin className="w-4 h-4 text-sunglow-400" />
                    <span>
                      {ad.location === "online" && "Online"}
                      {ad.location === "in-person" && (ad.city || "In-person")}
                      {ad.location === "both" &&
                        `Online & In-person${ad.city ? ` (${ad.city})` : ""}`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => navigate(`/profiles/${ad.userId}`)}
                    variant="outline"
                    className="border-gray1 text-sunglow-200 hover:bg-gray1 hover:border-sunglow-500/30 hover:text-sunglow-300"
                  >
                    <UserIcon className="w-4 h-4" />
                    View Profile
                  </Button>
                  {user && user.id !== ad.userId && (
                    <Button
                      disabled={startingChat}
                      onClick={async () => {
                        try {
                          setStartingChat(true);
                          const conversation = await startConversation(
                            ad.userId
                          );
                          navigate(
                            `/messages?conversationId=${conversation.id}`,
                            {
                              state: {
                                conversation,
                                conversationId: conversation.id,
                              },
                            }
                          );
                        } catch (err) {
                          console.error("Failed to start conversation", err);
                        } finally {
                          setStartingChat(false);
                        }
                      }}
                      className="bg-gradient-to-r from-sunglow-500 to-sunglow-400 text-background hover:from-sunglow-400 hover:to-sunglow-300 shadow-lg shadow-sunglow-500/20"
                    >
                      <Mail className="w-4 h-4" />
                      {startingChat ? "Opening..." : "Contact"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray1" />
          <div className="p-6 md:p-8 space-y-6">
            {ad.areas && ad.areas.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-sunglow-200/50 mb-3 uppercase tracking-wider">
                  Areas of Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ad.areas.map((area: string) => (
                    <Badge
                      key={area}
                      variant="outline"
                      className="border-sunglow-500/30 text-sunglow-200 bg-sunglow-500/5 px-3 py-1"
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs font-semibold text-sunglow-200/50 mb-3 uppercase tracking-wider">
                Description
              </h3>
              <p className="text-sunglow-100/80 leading-relaxed">
                {ad.description}
              </p>
            </div>
          </div>
        </Card>

        {ads.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-sunglow-50 mb-6">
              Other Available Ads
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((otherAd) => (
                <AdCard key={otherAd.id} ad={otherAd} onAdUpdated={fetchAds} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
