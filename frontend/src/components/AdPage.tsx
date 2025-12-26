import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getAdById, getAds } from "../services/adApi"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { MapPin, Mail, DollarSign, ArrowLeft, UserIcon, BookOpen, Clock, Sparkles, GraduationCap } from "lucide-react"
import AdCard from "./AdCard"
import { useAuth } from "../contexts/AuthContext"

export const AdPage = () => {
  const { adId } = useParams<{ adId: string }>()
  const { currentUser: user } = useAuth()
  const [ad, setAd] = useState<any>(null)
  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAd = async () => {
      if (!adId) return
      try {
        setLoading(true)
        setError(null)
        const data = await getAdById(adId)
        setAd(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch ad")
      } finally {
        setLoading(false)
      }
    }
    fetchAd()
  }, [adId])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const fetchAds = async () => {
    if (!adId) return
    try {
      const adsData = await getAds({})
      const filteredAds = adsData.filter((a: any) => a.id !== adId)
      setAds(filteredAds)
    } catch (err: any) {
      console.error("Failed to fetch other ads:", err)
    }
  }

  useEffect(() => {
    fetchAds()
  }, [adId])

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-400">Loading ad...</p>
        </div>
      </div>
    )
  }

  if (error || !ad) {
    return (
      <div className="bg-gray-900 min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate("/browse")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Button>
          <Card className="bg-red-500/10 border-red-500/50">
            <CardContent className="pt-6 text-center py-12">
              <p className="text-red-400">{error || "Ad not found"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const isTutor = ad.type === "tutor"

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/browse")}
          className="mb-6 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse
        </Button>

        <Card className="bg-gray-800/50 gap-0 border-gray-700/50 overflow-hidden mb-8 backdrop-blur-sm">
          <div
            className={`h-1 ${isTutor ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-cyan-500 to-blue-500"}`}
          />

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="flex flex-col items-center md:items-start">
                <div className="relative">
                  <div
                    className={`absolute -inset-1 rounded-full ${isTutor ? "bg-gradient-to-br from-emerald-500 to-teal-500" : "bg-gradient-to-br from-cyan-500 to-blue-500"} opacity-75 blur-sm`}
                  />
                  <div
                    className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full ${isTutor ? "ring-2 ring-emerald-500/50" : "ring-2 ring-cyan-500/50"} overflow-hidden bg-gray-900`}
                  >
                    {ad.user.avatarUrl ? (
                      <img
                        src={
                          ad.user.avatarUrl.startsWith("http")
                            ? ad.user.avatarUrl
                            : `http://localhost:4000${ad.user.avatarUrl}`
                        }
                        alt={ad.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center ${isTutor ? "bg-gradient-to-br from-emerald-600 to-teal-600" : "bg-gradient-to-br from-cyan-600 to-blue-600"}`}
                      >
                        <span className="text-3xl font-bold text-white">{getInitials(ad.user.name)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 text-center md:text-left">
                  <h3 className="text-lg font-semibold text-white">{ad.user.name}</h3>
                  {ad.user.experience && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-1 justify-center md:justify-start">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ad.user.experience}y experience</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${isTutor ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"} px-3 py-1`}
                    >
                      {isTutor ? (
                        <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                      ) : (
                        <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                      )}
                      {isTutor ? "Tutor" : "Student"}
                    </Badge>
                    {user && user.id === ad.userId && (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-3 py-1">
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                        Your Ad
                      </Badge>
                    )}
                  </div>
                  {ad.pricePerHour && (
                    <div
                      className={`flex items-center gap-1 ${isTutor ? "text-emerald-400" : "text-cyan-400"} font-bold text-xl`}
                    >
                      <DollarSign className="w-5 h-5" />
                      <span>{ad.pricePerHour}</span>
                      <span className="text-gray-500 text-sm font-normal">/hr</span>
                    </div>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{ad.subject}</h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isTutor ? "bg-emerald-500/10" : "bg-cyan-500/10"}`}
                  >
                    <BookOpen className={`w-4 h-4 ${isTutor ? "text-emerald-400" : "text-cyan-400"}`} />
                    <span className="font-medium">{ad.level}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-700/50">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>
                      {ad.location === "online" && "Online"}
                      {ad.location === "in-person" && (ad.city || "In-person")}
                      {ad.location === "both" && `Online & In-person${ad.city ? ` (${ad.city})` : ""}`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => navigate(`/profiles/${ad.userId}`)}
                    variant="outline"
                    className="border-gray-600 hover:bg-gray-700 hover:border-gray-500"
                  >
                    <UserIcon className="w-4 h-4" />
                    View Profile
                  </Button>
                  {user && user.id !== ad.userId && (
                    <Button
                      className={`${isTutor ? "bg-emerald-600 hover:bg-emerald-700" : "bg-cyan-600 hover:bg-cyan-700"}`}
                    >
                      <Mail className="w-4 h-4" />
                      Contact
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700/50" />
          <div className="p6  md:p-8 space-y-6">
            {ad.areas && ad.areas.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
                  Areas of Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ad.areas.map((area: string) => (
                    <Badge
                      key={area}
                      variant="outline"
                      className={`${isTutor ? "border-emerald-500/30 text-emerald-300 bg-emerald-500/5" : "border-cyan-500/30 text-cyan-300 bg-cyan-500/5"} px-3 py-1`}
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Description</h3>
              <p className="text-gray-300 leading-relaxed">{ad.description}</p>
            </div>

            
          </div>
        </Card>
        {ads.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Other Available Ads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((otherAd) => (
                <AdCard key={otherAd.id} ad={otherAd} onAdUpdated={fetchAds} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
