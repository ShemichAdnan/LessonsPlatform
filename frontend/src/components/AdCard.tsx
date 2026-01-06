"use client";

import { useNavigate } from "react-router-dom";
import type { Ad } from "../App";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  MapPin,
  Clock,
  Sparkles,
  BookOpen,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { FloatingCreateAd } from "./FloatingCreateAd";
import { deleteAd, getAdById } from "../services/adApi";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import defaultAvatar from "../assets/images/defaultAvatar.png";

interface AdCardProps {
  ad: Ad;
  onAdUpdated?: () => void;
}

export const AdCard = ({ ad: initialAd, onAdUpdated }: AdCardProps) => {
  const navigate = useNavigate();
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const { currentUser: user } = useAuth();
  const [ad, setAd] = useState<Ad>(initialAd);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");

  useEffect(() => {
    setAd(initialAd);
  }, [initialAd]);

  const handleAdUpdated = async () => {
    try {
      const updatedAd = await getAdById(ad.id);
      setAd(updatedAd);
    } catch (error) {
      console.error("Failed to refetch ad:", error);
    }

    if (onAdUpdated) {
      onAdUpdated();
    }
  };

  const handleCancelPassword = () => {
    setShowDeleteConfirm(false);
    setError(null);
  };

  const handleConfirmDelete = async () => {
    if (!currentPassword) {
      setError("Please enter your current password");
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      await deleteAd(ad.id, currentPassword);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete ad");
      setDeleting(false);
      return;
    }
    setDeleting(false);
    setShowDeleteConfirm(false);
    setCurrentPassword("");
    if (onAdUpdated) {
      onAdUpdated();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Card
        key={ad.id}
        onClick={() => navigate(`/ads/${ad.id}`)}
        className="group relative overflow-hidden bg-gray2 border-gray1/50 hover:border-sunglow-400/40 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-sunglow-400/10 hover:-translate-y-1 rounded-xl"
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge
                className={`px-3 py-1 text-xs font-semibold border ${
                  ad.type === "tutor"
                    ? "bg-sunglow-400/15 text-sunglow-300 border-sunglow-400/30"
                    : "bg-sunglow-200/15 text-sunglow-200 border-sunglow-200/30"
                }`}
              >
                {ad.type === "tutor" ? "Tutor" : "Student"}
              </Badge>
              {user && user.id === ad.userId && (
                <Badge className="bg-gradient-to-r from-sunglow-500 to-sunglow-600 text-sunglow-950 border-0 shadow-lg shadow-sunglow-500/20 font-semibold">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Your Ad
                </Badge>
              )}
            </div>

            {ad.pricePerHour && (
              <span className="text-sunglow-300 font-bold text-lg">
                ${ad.pricePerHour}
                <span className="text-sunglow-400/70 text-sm font-normal">
                  /hr
                </span>
              </span>
            )}
          </div>

          <CardTitle className="text-xl text-sunglow-50 mb-2 group-hover:text-sunglow-300 transition-colors font-bold">
            {ad.subject}
          </CardTitle>

          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {ad.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <BookOpen className="w-4 h-4 text-sunglow-400" />
            {ad.areas.slice(0, 4).map((area, index) => (
              <span key={index} className="text-sunglow-200">
                {area}
                {index < Math.min(ad.areas.length, 4) - 1 && ","}
              </span>
            ))}
            {ad.areas.length > 4 && (
              <span className="text-sunglow-400">+{ad.areas.length - 4}</span>
            )}
            <span className="text-gray-600 mx-1">•</span>
            <span className="text-sunglow-200 bg-sunglow-500/10 px-2 py-0.5 rounded-full text-xs">
              {ad.level}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-sunglow-400" />
            <span className="text-sunglow-200">
              {ad.location === "online" && "Online"}
              {ad.location === "in-person" && (ad.city || "In-person")}
              {ad.location === "both" &&
                `Both${ad.city ? ` • ${ad.city}` : ""}`}
            </span>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-gray1/50">
            <Avatar className="size-10 ring-2 ring-sunglow-400/30">
              <AvatarImage
                src={
                  ad.user.avatarUrl
                    ? ad.user.avatarUrl.startsWith("http")
                      ? ad.user.avatarUrl
                      : `http://localhost:4000${ad.user.avatarUrl}`
                    : defaultAvatar
                }
                alt={ad.user.name}
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultAvatar;
                }}
              />
              <AvatarFallback className="bg-gradient-to-br from-sunglow-500 to-sunglow-600 text-sunglow-50 font-semibold">
                {getInitials(ad.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-sunglow-50 truncate block">
                {ad.user.name}
              </span>
              {ad.user.experience && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {ad.user.experience}y experience
                </span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          {user && user.id === ad.userId ? (
            <div className="w-full flex justify-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditPanelOpen(true);
                }}
                className="p-2 rounded-lg bg-gray1/80 hover:bg-sunglow-400/20 text-sunglow-300 hover:text-sunglow-200 transition-all duration-200 cursor-pointer"
                title="Edit ad"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                disabled={deleting}
                className="p-2 rounded-lg bg-gray1/80 hover:bg-sunglow-600/30 text-sunglow-400 hover:text-sunglow-300 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                title="Delete ad"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : user ? (
            <Button
              className="w-full bg-sunglow-400/10 text-sunglow-300 border border-sunglow-400/30 hover:bg-sunglow-400/20 cursor-pointer"
              variant="outline"
              size="sm"
            >
              View details
            </Button>
          ) : null}
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
          <Card
            className="border-gray1 bg-background w-full max-w-md pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="text-lg text-sunglow-50">
                Confirm Delete
              </CardTitle>
              <CardDescription className="text-gray-400">
                Enter your current password to delete this ad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sunglow-100">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="bg-gray2 border-gray1 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-sunglow-500/50 caret-white"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleConfirmDelete();
                    }
                  }}
                  autoFocus
                />
              </div>
              {error && <p className="text-sm text-sunglow-500">{error}</p>}
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelPassword}
                  disabled={deleting}
                  className="border-gray1 text-sunglow-100 hover:bg-gray2 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting || !currentPassword}
                  className="bg-sunglow-600 hover:bg-sunglow-700 text-sunglow-950 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {deleting ? "Deleting..." : "Delete Ad"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default AdCard;
