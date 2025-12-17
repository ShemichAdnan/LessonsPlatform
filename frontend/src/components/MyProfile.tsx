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
import { Camera, Plus, X, Key } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useProfileManager } from "../hooks/useProfileManager";
import { AdCard } from "./AdCard";

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
    setSubjects,
    currentSubject,
    setCurrentSubject,
    currentPassword,
    setCurrentPassword,
    showPasswordPrompt,
    saving,
    error,
    selectedAvatarFile,
    avatarPreview,
    showChangePasswordModal,
    changePasswordData,
    setChangePasswordData,
    changingPassword,
    passwordError,
    myAds,
    setMyAds,

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
  } = useProfileManager(user!, updateUser);

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-400">Loading profile...</div>
    );
  }

  const saveButtonClass = dirty
    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
    : "bg-gray-700 text-gray-300 cursor-not-allowed";

  return (
    <div className="bg-gray-900 ">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your profile information</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>
                    Upload a photo to help others recognize you
                  </CardDescription>
                </div>
                {avatarDirty && (
                  <Badge
                    variant="outline"
                    className="text-yellow-500 border-yellow-500/50 bg-yellow-500/10"
                  >
                    Unsaved changes
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    className="object-contain"
                    src={
                      avatarPreview ||
                      (user.avatarUrl
                        ? `http://localhost:4000${user.avatarUrl}`
                        : undefined)
                    }
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-3xl">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
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
                    className="cursor-pointer hover:bg-gray-800"
                    onClick={() =>
                      document.getElementById("avatar-upload")?.click()
                    }
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-gray-400 mt-2">
                    JPG, PNG, GIF or WebP. Max size 2MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Your personal details</CardDescription>
                </div>
                {basicInfoDirty && (
                  <Badge
                    variant="outline"
                    className="text-yellow-500 border-yellow-500/50 bg-yellow-500/10"
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
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself, your teaching philosophy, or learning goals..."
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Teaching & Learning Information</CardTitle>
                  <CardDescription>
                    Optional details to help others understand your expertise
                  </CardDescription>
                </div>
                {teachingInfoDirty && (
                  <Badge
                    variant="outline"
                    className="text-yellow-500 border-yellow-500/50 bg-yellow-500/10"
                  >
                    Unsaved changes
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="5"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Hour (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)}
                    placeholder="45"
                    min="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjects">Subjects</Label>
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
                  />
                  <Button type="button" onClick={handleAddSubject}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {subjects.map((subject) => (
                      <Badge
                        key={subject}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {subject}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(subject)}
                          className="hover:text-red-600"
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

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleOpenChangePassword}
              className="border-gray-600 text-gray-200 hover:bg-gray-800 cursor-pointer"
            >
              <Key className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <Button
              type="button"
              onClick={handleStartSave}
              disabled={!dirty || saving}
              size="lg"
              className={`${saveButtonClass} disabled:opacity-60`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">
            Ads ({myAds.length})
          </h2>
          <p className="text-gray-400">All my active ads</p>
        </div>
        {myAds.length === 0 ? (
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <CardContent className="py-16">
              <div className="text-center">
                <p className="text-gray-400 text-lg">
                  This user currently has no active ads
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </div>

      {showPasswordPrompt && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCancelPassword}
        >
          <Card
            className="border-blue-500/50 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="text-lg">Confirm Changes</CardTitle>
              <CardDescription>
                Enter your current password to save your profile changes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-500 caret-white"
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
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelPassword}
                  disabled={saving}
                  className="border-gray-600 text-gray-200 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmSave}
                  disabled={saving || !currentPassword}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Confirm & Save"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showChangePasswordModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCloseChangePassword}
        >
          <Card
            className="border-blue-500/50 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle className="text-lg">Change Password</CardTitle>
              <CardDescription>
                Enter your current password and choose a new one
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="change-current-password">
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
                  className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-500 caret-white"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
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
                  className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-500 caret-white"
                />
                <p className="text-xs text-gray-400">
                  Min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 symbol
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">
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
                  className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-500 caret-white"
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
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseChangePassword}
                  disabled={changingPassword}
                  className="border-gray-600 text-gray-200 hover:bg-gray-800"
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
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {changingPassword ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
