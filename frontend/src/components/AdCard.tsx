"use client"

import { useNavigate } from "react-router-dom"
import type { Ad } from "../App"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { DollarSign, MapPin, Clock, Sparkles } from "lucide-react"
import { Button } from "./ui/button"
import { useAuth } from "../contexts/AuthContext"
import { useState, useEffect } from "react"
import { FloatingCreateAd } from "./FloatingCreateAd"
import { deleteAd, getAdById } from "../services/adApi"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"

interface AdCardProps {
  ad: Ad
  onAdUpdated?: () => void
}

export const AdCard = ({ ad: initialAd, onAdUpdated }: AdCardProps) => {
  const navigate = useNavigate()
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false)
  const { currentUser: user } = useAuth()
  const [ad, setAd] = useState<Ad>(initialAd)
  const [deleting, setDeleting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)
  const [currentPassword, setCurrentPassword] = useState<string>("")

  useEffect(() => {
    setAd(initialAd)
  }, [initialAd])

  const handleAdUpdated = async () => {
    try {
      const updatedAd = await getAdById(ad.id)
      setAd(updatedAd)
    } catch (error) {
      console.error("Failed to refetch ad:", error)
    }

    if (onAdUpdated) {
      onAdUpdated()
    }
  }

  const handleCancelPassword = () => {
    setShowDeleteConfirm(false)
    setError(null)
  }

  const handleConfirmDelete = async () => {
    if (!currentPassword) {
      setError("Please enter your current password")
      return
    }
    setDeleting(true)
    setError(null)
    try {
      await deleteAd(ad.id, currentPassword)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete ad")
      setDeleting(false)
      return
    }
    setDeleting(false)
    setShowDeleteConfirm(false)
    setCurrentPassword("")
    if (onAdUpdated) {
      onAdUpdated()
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const typeColors = {
    tutor: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      accent: "from-emerald-500/20 to-teal-500/20",
      ring: "ring-emerald-500/20",
      hover: "hover:bg-emerald-500/20",
    },
    student: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-400",
      accent: "from-blue-500/20 to-cyan-500/20",
      ring: "ring-blue-500/20",
      hover: "hover:bg-blue-500/20",
    },
  }

  const colors = typeColors[ad.type as keyof typeof typeColors] || typeColors.student

  return (
    <>
      <Card
        key={ad.id}
        onClick={() => navigate(`/ads/${ad.id}`)}
        className={`group relative overflow-hidden bg-gray-900/80 border-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1`}
      >
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${colors.accent}`} />

        {user && user.id === ad.userId && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg shadow-amber-500/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Your Ad
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            <Avatar className={` flex items-center size-14 ring-2 ${colors.ring} shadow-lg`}>
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
                  <div className={`w-full h-full rounded-full ${ad.type === "tutor" ? "bg-gradient-to-br from-emerald-600 to-teal-600" : "bg-gradient-to-br from-cyan-600 to-blue-600"} flex items-center justify-center `}>
                    <span className="text-2xl font-bold text-white">
                      {getInitials(ad.user.name)}
                    </span>
                  </div>
                )}
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-100 truncate">{ad.user.name}</span>
                <Badge className={` ${colors.text} text-xs shrink-0`}>
                  {ad.type === "tutor" ? "👨‍🏫 Tutor" : "🎓 Student"}
                </Badge>
              </div>

              {ad.user.experience && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{ad.user.experience}y experience</span>
                </div>
              )}
            </div>

            {ad.pricePerHour && (
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${colors.bg} ${colors.text} ${colors.border}`}>
                <DollarSign className={`w-4 h-4 ${colors.text}`} />
                <span className={`font-bold ${colors.text} ${colors.border}`}>{ad.pricePerHour}</span>
                <span className={` ${colors.text}  text-sm`}>/hr</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <CardTitle className="text-xl text-gray-100 mb-2 group-hover:text-white transition-colors">
              {ad.subject}
            </CardTitle>
            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{ad.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {ad.areas.slice(0, 3).map((area: string) => (
              <Badge
                key={area}
                variant="outline"
                className="text-xs bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50"
              >
                {area}
              </Badge>
            ))}
            {ad.areas.length > 3 && (
              <Badge variant="outline" className="text-xs bg-gray-800/50 border-gray-700 text-gray-500">
                +{ad.areas.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-gray-800">
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <span className="text-base">📚</span>
              {ad.level}
            </span>
            <span className="w-px h-4 bg-gray-700" />
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin className="w-3.5 h-3.5" />
              {ad.location === "online" && "Online"}
              {ad.location === "in-person" && (ad.city || "In-person")}
              {ad.location === "both" && "Online & In-person"}
            </span>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          {user && user.id !== ad.userId ? (
            <Button
              className={`w-full ${colors.bg} ${colors.text} ${colors.border} ${colors.hover} cursor-pointer`}
              variant="outline"
              size="sm"
            >
              Contact
            </Button>
          ) : (
            <div className="flex gap-2 w-full">
              <Button
                className={`flex-1 ${colors.bg} ${colors.text} ${colors.border} ${colors.hover} cursor-pointer`}
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditPanelOpen(true)
                }}
              >
                Edit
              </Button>
              <Button
                className="flex-1 bg-red-950/50 hover:bg-red-900/50 text-red-400 border border-red-900/50 cursor-pointer"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteConfirm(true)
                }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {isEditPanelOpen && (
        <FloatingCreateAd
          mode="edit"
          adId={ad.id}
          onClose={() => setIsEditPanelOpen(false)}
          onAdCreated={handleAdUpdated}
        />
      )}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCancelPassword}
        >
          <Card className="border-gray-700 bg-gray-900 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="text-lg text-gray-100">Confirm Delete</CardTitle>
              <CardDescription className="text-gray-400">Enter your current password to delete this ad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-gray-300">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-500 caret-white"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleConfirmDelete()
                    }
                  }}
                  autoFocus
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelPassword}
                  disabled={deleting}
                  className="border-gray-600 text-gray-200 hover:bg-gray-800 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting || !currentPassword}
                  className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {deleting ? "Deleting..." : "Delete Ad"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default AdCard
