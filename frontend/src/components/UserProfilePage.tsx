import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  AlertCircle,
  MapPin,
  Calendar,
  Briefcase,
  Mail,
  BookOpen,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { AdCard } from "./AdCard";
import { getAds } from "../services/adApi";

import type { User, Ad } from "../App";
import { getProfileById } from "../services/profileServices";
import { Button } from "./ui/button";
import defaultAvatar from "../assets/images/defaultAvatar.png";
import { useAuth } from "../contexts/AuthContext";
import { startConversation } from "../services/messageServices";

export const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { currentUser: user } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startingChat, setStartingChat] = useState(false);

  const fetchData = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);

      const profileResponse = await getProfileById(userId);
      setProfile(profileResponse);

      const adsResponse = await getAds({});
      const filteredAds = adsResponse.filter((ad) => ad.userId === userId);

      setAds(filteredAds);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sunglow-400"></div>
          <p className="mt-4 text-sunglow-200/70">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-background min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/profiles")}
            className="mb-4 text-sunglow-200 hover:text-sunglow-300 hover:bg-gray1  "
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Profiles
          </Button>
          <Card className="bg-sunglow-500/10 border-sunglow-500/30">
            <CardContent className="pt-6 text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sunglow-500/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-sunglow-400" />
              </div>
              <p className="text-sunglow-300">{error || "Profile not found"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/profiles")}
          className="mb-6 hover:bg-gray1 text-sunglow-200/70 hover:text-sunglow-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Profiles
        </Button>

        <Card className="relative bg-gray2 border-gray1 gap-0 overflow-hidden mb-8 backdrop-blur-sm">
          <div className="h-1 bg-gradient-to-r from-sunglow-500 to-sunglow-400" />

          <div className="p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute -inset-1.5 bg-gradient-to-br from-sunglow-500 to-sunglow-400 opacity-75 rounded-full blur-sm" />
                  <div className="relative w-36 h-36 rounded-full overflow-hidden ring-2 ring-sunglow-500/50 bg-background">
                    <img
                      src={profile.avatarUrl || defaultAvatar}
                      className="w-full h-full object-cover"
                      alt={profile.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultAvatar;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl font-bold text-sunglow-50 mb-1">
                  {profile.name}
                </h1>

                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-3 mb-5">
                  <div className="flex items-center gap-1.5 text-sunglow-200/70 text-sm">
                    <Mail className="w-4 h-4 text-sunglow-400" />
                    <span>{profile.email}</span>
                  </div>

                  {profile.city && (
                    <div className="flex items-center gap-1.5 text-sunglow-200/70 text-sm">
                      <MapPin className="w-4 h-4 text-sunglow-400" />
                      <span>{profile.city}</span>
                    </div>
                  )}

                  {profile.experience !== null && (
                    <div className="flex items-center gap-1.5 text-sunglow-200/70 text-sm">
                      <Briefcase className="w-4 h-4 text-sunglow-400" />
                      <span>{profile.experience} years experience</span>
                    </div>
                  )}

                  {profile.createdAt && (
                    <div className="flex items-center gap-1.5 text-sunglow-200/70 text-sm">
                      <Calendar className="w-4 h-4 text-sunglow-400" />
                      <span>Member since {formatDate(profile.createdAt)}</span>
                    </div>
                  )}
                </div>
                {profile.subjects && profile.subjects.length > 0 && (
                  <div className="mb-5">
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                      {profile.subjects.map((subject, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm rounded-full bg-sunglow-500/15 text-sunglow-300 border border-sunglow-500/30"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.bio ? (
                  <div className="rounded-lg p-4 border-transparent border bg-gray1/50">
                    <p className="text-xs uppercase tracking-wider text-sunglow-200/50 mb-2">
                      About
                    </p>
                    <p className="text-sunglow-100/80 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray1 rounded-lg p-4 border border-sunglow-500/20">
                    <p className="text-sunglow-200/50 italic">
                      This user hasn't added a bio yet.
                    </p>
                  </div>
                )}

                {user && user.id !== profile.id && (
                  <div className="mt-5 flex justify-center lg:justify-start">
                    <Button
                      disabled={startingChat}
                      onClick={async () => {
                        try {
                          setStartingChat(true);
                          const conversation = await startConversation(
                            profile.id
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
        {ads.length > 0 && (
          <div className="flex items-center gap-3 mb-6 max-w-6xl mx-auto">
            <div className="p-2 rounded-xl bg-sunglow-500/15 border border-sunglow-500/30">
              <BookOpen className="w-5 h-5 text-sunglow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-sunglow-50">
                Found <span className="text-sunglow-400">({ads.length})</span>{" "}
                {ads.length === 1 ? "ad" : "ads"}
              </h2>
              <p className="text-sunglow-200/60 text-sm">
                All active ads from this user
              </p>
            </div>
          </div>
        )}

        {ads.length === 0 ? (
          <Card className="bg-gray2 border-gray1">
            <CardContent className="py-16">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sunglow-500/10 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-sunglow-400" />
                </div>
                <p className="text-sunglow-200/70 text-lg">
                  This user currently has no active ads
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} onAdUpdated={fetchData} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
