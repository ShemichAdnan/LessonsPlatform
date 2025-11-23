import { useState, useEffect } from "react";
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
import type { User } from "../App";
import {
  updateProfile,
  uploadAvatar,
  changePassword,
} from "../services/authApi";

interface MyProfileProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

export function MyProfile({ user, onUserUpdate }: MyProfileProps) {
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [city, setCity] = useState(user.city || "");
  const [experience, setExperience] = useState(
    user.experience?.toString() || ""
  );
  const [pricePerHour, setPricePerHour] = useState(
    user.pricePerHour?.toString() || ""
  );
  const [subjects, setSubjects] = useState<string[]>(user.subjects || []);
  const [currentSubject, setCurrentSubject] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Change password state
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Update local state when user prop changes
  useEffect(() => {
    setName(user.name || "");
    setBio(user.bio || "");
    setCity(user.city || "");
    setExperience(user.experience?.toString() || "");
    setPricePerHour(user.pricePerHour?.toString() || "");
    setSubjects(user.subjects || []);
    setSelectedAvatarFile(null);
    setAvatarPreview(null);
  }, [user]);

  // Track if anything has changed
  const dirty =
    name !== user.name ||
    bio !== (user.bio || "") ||
    city !== (user.city || "") ||
    experience !== (user.experience?.toString() || "") ||
    pricePerHour !== (user.pricePerHour?.toString() || "") ||
    JSON.stringify(subjects) !== JSON.stringify(user.subjects || []) ||
    selectedAvatarFile !== null;

  // Track changes per section
  const avatarDirty = selectedAvatarFile !== null;

  const basicInfoDirty =
    name !== user.name ||
    bio !== (user.bio || "") ||
    city !== (user.city || "");

  const teachingInfoDirty =
    experience !== (user.experience?.toString() || "") ||
    pricePerHour !== (user.pricePerHour?.toString() || "") ||
    JSON.stringify(subjects) !== JSON.stringify(user.subjects || []);

  const handleAddSubject = () => {
    if (currentSubject.trim() && !subjects.includes(currentSubject.trim())) {
      setSubjects([...subjects, currentSubject.trim()]);
      setCurrentSubject("");
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setSubjects(subjects.filter((s) => s !== subject));
  };

  const handleStartSave = () => {
    if (!dirty) return;
    setError(null);
    setShowPasswordPrompt(true);
  };

  const handleConfirmSave = async () => {
    if (!currentPassword) {
      setError("Please enter your current password");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      // First upload avatar if there's a new one
      if (selectedAvatarFile) {
        await uploadAvatar(selectedAvatarFile);
      }

      // Then update profile fields
      const updated = await updateProfile({
        name,
        bio: bio || undefined,
        city: city || undefined,
        experience: experience ? parseInt(experience, 10) : undefined,
        pricePerHour: pricePerHour ? parseInt(pricePerHour, 10) : undefined,
        subjects: subjects.length > 0 ? subjects : undefined,
        currentPassword,
      });
      onUserUpdate(updated);
      setShowPasswordPrompt(false);
      setCurrentPassword("");
      setSelectedAvatarFile(null);
      setAvatarPreview(null);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Could not save changes";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelPassword = () => {
    setShowPasswordPrompt(false);
    setCurrentPassword("");
    setError(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be less than 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Store file and show preview
    setSelectedAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleOpenChangePassword = () => {
    setChangePasswordData({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setPasswordError(null);
    setShowChangePasswordModal(true);
  };

  const handleCloseChangePassword = () => {
    setShowChangePasswordModal(false);
    setChangePasswordData({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setPasswordError(null);
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Password must contain at least one symbol";
    }
    return null;
  };

  const handleChangePassword = async () => {
    const {
      currentPassword: current,
      newPassword,
      confirmNewPassword,
    } = changePasswordData;

    if (!current) {
      setPasswordError("Please enter your current password");
      return;
    }

    if (!newPassword) {
      setPasswordError("Please enter a new password");
      return;
    }

    // Validate new password
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setChangingPassword(true);
    setPasswordError(null);
    try {
      await changePassword({
        currentPassword: current,
        newPassword,
      });
      setShowChangePasswordModal(false);
      setChangePasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      // Show success message (you could use a toast notification here)
      alert("Password changed successfully!");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Could not change password";
      setPasswordError(message);
    } finally {
      setChangingPassword(false);
    }
  };

  const saveButtonClass = dirty
    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
    : "bg-gray-700 text-gray-300 cursor-not-allowed";

  return (
    <div className="h-full overflow-auto bg-gray-900 overflow-scroll no-scrollbar">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your profile information</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Picture Card */}
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
                  <AvatarImage className="object-contain"
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

          {/* Basic Information */}
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

          {/* Teaching/Learning Information */}
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

          {/* Action Buttons */}
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

      {/* Password Confirmation Modal */}
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

      {/* Change Password Modal */}
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
