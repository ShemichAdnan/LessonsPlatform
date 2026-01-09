import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Camera, Plus, X, Key, Loader2, BookOpen, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useProfileManager } from "../hooks/useProfileManager";
import { AdCard } from "./AdCard";
import defaultAvatar from "../assets/images/defaultAvatar.png";

export function MyProfile() {
  const { currentUser: user, updateUser } = useAuth();

  const {
    name,
    setName,
    bio,
    setBio,
    experience,
    setExperience,
    city,
    setCity,
    pricePerHour,
    setPricePerHour,
    subjects,
    currentSubject,
    setCurrentSubject,
    currentPassword,
    setCurrentPassword,
    showPasswordPrompt,
    saving,
    error,
    avatarPreview,
    showChangePasswordModal,
    changePasswordData,
    setChangePasswordData,
    changingPassword,
    passwordError,
    myAds,

    dirty,
    avatarDirty,
    basicInfoDirty,
    teachingInfoDirty,

    handleAddSubject,
    handleRemoveSubject,
    handleStartSave,
    handleConfirmSave,
    handleCancelPassword,
    handleAvatarChange,
    handleOpenChangePassword,
    handleCloseChangePassword,
    handleChangePassword,
    refetchMyAds,
  } = useProfileManager(user!, updateUser);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-sunglow-200/70">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  const saveButtonClass = dirty
    ? "bg-gradient-to-r from-sunglow-500 to-sunglow-400 hover:from-sunglow-600 hover:to-sunglow-500 text-gray2"
    : "bg-gray1 text-sunglow-200/50 cursor-not-allowed";

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sunglow-500/10 via-background to-background" />
        <div className="relative max-w-4xl mx-auto px-6 pt-10 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-sunglow-500/15 border border-sunglow-500/30">
              <User className="w-6 h-6 text-sunglow-400" />
            </div>
            <h1 className="text-3xl font-bold text-sunglow-50">My Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="grid gap-6">
          <Card className="bg-gray2 border-gray1 pb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sunglow-50">
                    Profile Picture
                  </CardTitle>
                  <CardDescription className="text-sunglow-200/60">
                    Upload a photo to help others recognize you
                  </CardDescription>
                </div>
                {avatarDirty && (
                  <Badge
                    variant="outline"
                    className="text-sunglow-400 border-sunglow-500/50 bg-sunglow-500/10"
                  >
                    Unsaved changes
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-sunglow-500/40 to-sunglow-400/20 rounded-full blur-sm" />
                  <Avatar className="relative w-24 h-24 ring-2 ring-sunglow-500/30">
                    <AvatarImage
                      className="object-cover"
                      src={avatarPreview || user.avatarUrl || defaultAvatar}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultAvatar;
                      }}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-sunglow-500 to-sunglow-600 text-gray2 text-3xl font-bold">
                      {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    className="cursor-pointer bg-gray1/50 border-gray1 text-sunglow-100 hover:bg-gray1 hover:text-sunglow-50 hover:border-sunglow-500/30"
                    onClick={() =>
                      document.getElementById("avatar-upload")?.click()
                    }
                  >
                    <Camera className="w-4 h-4 mr-2 text-sunglow-400" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-sunglow-200/50 mt-2">
                    JPG, PNG, GIF or WebP. Max size 2MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray2 border-gray1 pb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sunglow-50">
                    Basic Information
                  </CardTitle>
                  <CardDescription className="text-sunglow-200/60">
                    Your personal details
                  </CardDescription>
                </div>
                {basicInfoDirty && (
                  <Badge
                    variant="outline"
                    className="text-sunglow-400 border-sunglow-500/50 bg-sunglow-500/10"
                  >
                    Unsaved changes
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sunglow-100">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="bg-gray1/50 border-gray1 text-sunglow-50 placeholder:text-sunglow-200/40 focus-visible:ring-1 focus-visible:ring-sunglow-500/50 focus-visible:border-sunglow-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sunglow-100">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="bg-gray1/30 border-gray1 text-sunglow-200/50 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sunglow-100">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                      className="bg-gray1/50 border-gray1 text-sunglow-50 placeholder:text-sunglow-200/40 focus-visible:ring-1 focus-visible:ring-sunglow-500/50 focus-visible:border-sunglow-500/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sunglow-100">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself, your teaching philosophy, or learning goals..."
                    rows={4}
                    className="bg-gray1/50 border-gray1 text-sunglow-50 placeholder:text-sunglow-200/40 focus-visible:ring-1 focus-visible:ring-sunglow-500/50 focus-visible:border-sunglow-500/50 resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray2 border-gray1 pb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sunglow-50">
                    Teaching & Learning Information
                  </CardTitle>
                  <CardDescription className="text-sunglow-200/60">
                    Optional details to help others understand your expertise
                  </CardDescription>
                </div>
                {teachingInfoDirty && (
                  <Badge
                    variant="outline"
                    className="text-sunglow-400 border-sunglow-500/50 bg-sunglow-500/10"
                  >
                    Unsaved changes
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sunglow-100">
                    Years of Experience
                  </Label>
                  <Input
                    id="experience"
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="5"
                    min="0"
                    className="bg-gray1/50 border-gray1 text-sunglow-50 placeholder:text-sunglow-200/40 focus-visible:ring-1 focus-visible:ring-sunglow-500/50 focus-visible:border-sunglow-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sunglow-100">
                    Price per Hour (USD)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)}
                    placeholder="45"
                    min="0"
                    className="bg-gray1/50 border-gray1 text-sunglow-50 placeholder:text-sunglow-200/40 focus-visible:ring-1 focus-visible:ring-sunglow-500/50 focus-visible:border-sunglow-500/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjects" className="text-sunglow-100">
                  Subjects
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="subjects"
                    value={currentSubject}
                    onChange={(e) => setCurrentSubject(e.target.value)}
                    placeholder="e.g., Mathematics, Physics, English"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubject();
                      }
                    }}
                    className="bg-gray1/50 border-gray1 text-sunglow-50 placeholder:text-sunglow-200/40 focus-visible:ring-1 focus-visible:ring-sunglow-500/50 focus-visible:border-sunglow-500/50"
                  />
                  <Button
                    type="button"
                    onClick={handleAddSubject}
                    className="bg-sunglow-500 hover:bg-sunglow-600 text-gray2"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {subjects.map((subject) => (
                      <Badge
                        key={subject}
                        variant="secondary"
                        className="flex items-center gap-1 bg-sunglow-500/15 text-sunglow-300 border border-sunglow-500/30 hover:bg-sunglow-500/25"
                      >
                        {subject}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(subject)}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center pt-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleOpenChangePassword}
              className="bg-gray1/50 border-gray1 text-sunglow-100 hover:bg-gray1 hover:text-sunglow-50 hover:border-sunglow-500/30 cursor-pointer"
            >
              <Key className="w-4 h-4 mr-2 text-sunglow-400" />
              Change Password
            </Button>
            <Button
              type="button"
              onClick={handleStartSave}
              disabled={!dirty || saving}
              size="lg"
              className={`${saveButtonClass} font-semibold disabled:opacity-60`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray1">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-sunglow-500/15 border border-sunglow-500/30">
              <BookOpen className="w-5 h-5 text-sunglow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-sunglow-50">
                My Ads{" "}
                <span className="text-sunglow-400">({myAds.length})</span>
              </h2>
              <p className="text-sunglow-200/60 text-sm">All my active ads</p>
            </div>
          </div>
          {myAds.length === 0 ? (
            <Card className="bg-gray2 border-gray1">
              <CardContent className="py-16">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-sunglow-500/10 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-sunglow-500/50" />
                  </div>
                  <p className="text-sunglow-200/60 text-lg">
                    You currently have no active ads
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} onAdUpdated={refetchMyAds} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showPasswordPrompt && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCancelPassword}
        >
          <Card
            className="bg-gray2 border-sunglow-500/30 w-full max-w-md shadow-xl shadow-sunglow-500/5 pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="text-lg text-sunglow-50">
                Confirm Changes
              </CardTitle>
              <CardDescription className="text-sunglow-200/60">
                Enter your current password to save your profile changes
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
                  className="bg-gray1/50 border-gray1 text-sunglow-50 placeholder:text-sunglow-200/40 focus-visible:ring-1 focus-visible:ring-sunglow-500/50 focus-visible:border-sunglow-500/50 caret-sunglow-400"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleConfirmSave();
                    }
                  }}
                  autoFocus
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="flex gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelPassword}
                  disabled={saving}
                  className="bg-gray1/50 border-gray1 text-sunglow-100 hover:bg-gray1 hover:text-sunglow-50"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmSave}
                  disabled={saving || !currentPassword}
                  className="bg-gradient-to-r from-sunglow-500 to-sunglow-400 hover:from-sunglow-600 hover:to-sunglow-500 text-gray2 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Confirm & Save"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showChangePasswordModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseChangePassword}
        >
          <Card
            className="bg-gray2 border-sunglow-500/30 w-full max-w-md shadow-xl shadow-sunglow-500/5 pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="text-lg text-sunglow-50">
                Change Password
              </CardTitle>
              <CardDescription className="text-sunglow-200/60">
                Enter your current password and choose a new one
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="change-current-password"
                  className="text-sunglow-100"
                >
                  Current Password
                </Label>
                <Input
                  id="change-current-password"
                  type="password"
                  value={changePasswordData.currentPassword}
                  onChange={(e) =>
                    setChangePasswordData({
                      ...changePasswordData,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Enter your current password"
                  className="bg-gray1/50 border-gray1 text-sunglow-50 placeholder:text-sunglow-200/40 focus-visible:ring-1 focus-visible:ring-sunglow-500/50 focus-visible:border-sunglow-500/50 caret-sunglow-400"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sunglow-100">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={changePasswordData.newPassword}
                  onChange={(e) =>
                    setChangePasswordData({
                      ...changePasswordData,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Enter new password"
                  className="bg-gray1/50 border-gray1 text-sunglow-50 placeholder:text-sunglow-200/40 focus-visible:ring-1 focus-visible:ring-sunglow-500/50 focus-visible:border-sunglow-500/50 caret-sunglow-400"
                />
                <p className="text-xs text-sunglow-200/50">
                  Min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 symbol
                </p>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirm-new-password"
                  className="text-sunglow-100"
                >
                  Repeat New Password
                </Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={changePasswordData.confirmNewPassword}
                  onChange={(e) =>
                    setChangePasswordData({
                      ...changePasswordData,
                      confirmNewPassword: e.target.value,
                    })
                  }
                  placeholder="Repeat new password"
                  className="bg-gray1/50 border-gray1 text-sunglow-50 placeholder:text-sunglow-200/40 focus-visible:ring-1 focus-visible:ring-sunglow-500/50 focus-visible:border-sunglow-500/50 caret-sunglow-400"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleChangePassword();
                    }
                  }}
                />
              </div>
              {passwordError && (
                <p className="text-sm text-red-400">{passwordError}</p>
              )}
              <div className="flex gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseChangePassword}
                  disabled={changingPassword}
                  className="bg-gray1/50 border-gray1 text-sunglow-100 hover:bg-gray1 hover:text-sunglow-50"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={
                    changingPassword ||
                    !changePasswordData.currentPassword ||
                    !changePasswordData.newPassword ||
                    !changePasswordData.confirmNewPassword
                  }
                  className="bg-gradient-to-r from-sunglow-500 to-sunglow-400 hover:from-sunglow-600 hover:to-sunglow-500 text-gray2 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
