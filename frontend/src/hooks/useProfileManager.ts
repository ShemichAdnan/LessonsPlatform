import { useState,useEffect } from "react";
import type { User, Ad } from "../App";
import { updateProfile,changePassword,uploadAvatar } from "../services/authApi";
import { validatePassword, validateProfileData } from "../utils/validation";
import { getMyAds } from "../services/adApi";

export function useProfileManager(user: User, onUserUpdate: (user: User) => void) {
    const[name,setName]=useState(user.name || "");
    const[bio,setBio]=useState(user.bio || "");
    const[experience,setExperience]=useState(user.experience?.toString() || "");
    const[city,setCity]=useState(user.city || "");
    const[pricePerHour,setPricePerHour]=useState(user.pricePerHour?.toString() || "");
    const[subjects,setSubjects]=useState<string[]>(user.subjects || []);
    const[currentSubject,setCurrentSubject]=useState("");

    const[currentPassword,setCurrentPassword]=useState("");
    const[showPasswordPrompt,setShowPasswordPrompt]=useState(false);
    const[saving,setSaving]=useState(false);
    const[error,setError]=useState<string | null>(null);
    const[selectedAvatarFile,setSelectedAvatarFile]=useState<File | null>(null);
    const[avatarPreview,setAvatarPreview]=useState<string | null>(null);

    const[showChangePasswordModal,setShowChangePasswordModal]=useState(false);
    const[changePasswordData,setChangePasswordData]=useState({
        currentPassword:"",
        newPassword:"",
        confirmNewPassword:""
    });
    const[changingPassword,setChangingPassword]=useState(false);
    const[passwordError,setPasswordError]=useState<string | null>(null);

    const[myAds,setMyAds]=useState<Ad[]>([]); 

    useEffect(() => {
        setName(user.name || "");
        setBio(user.bio || "");
        setCity(user.city || "");
        setExperience(user.experience?.toString() || "");
        setPricePerHour(user.pricePerHour?.toString() || "");
        setSubjects(user.subjects || []);
        setSelectedAvatarFile(null);
        setAvatarPreview(null);
        
        const fetchMyAds = async () => {
            try {
                const adsData = await getMyAds();
                setMyAds(adsData);
            } catch (error) {
                console.error("Failed to fetch ads:", error);
            }
        };
        
        fetchMyAds();
    }, [user]);

    const avatarDirty = selectedAvatarFile !== null;
    const basicInfoDirty =
        name !== user.name ||
        bio !== (user.bio || "") ||
        city !== (user.city || "");

    const teachingInfoDirty =
        experience !== (user.experience?.toString() || "") ||
        pricePerHour !== (user.pricePerHour?.toString() || "") ||
        JSON.stringify(subjects) !== JSON.stringify(user.subjects || []);

    const dirty = avatarDirty || basicInfoDirty || teachingInfoDirty;

    const handleAddSubject = () => {
        const subject = currentSubject.trim();
        if (subject && !subjects.includes(subject)) {
            setSubjects([...subjects, subject]);
            setCurrentSubject("");
        }
    };

    const handleRemoveSubject = (subjectToRemove: string) => {
        setSubjects(subjects.filter((s) => s !== subjectToRemove));
    };

    const refetchMyAds = async () => {
        try {
            const adsData = await getMyAds();
            setMyAds(adsData);
        } catch (error) {
            console.error("Failed to refetch ads:", error);
        }
    };

    const handleStartSave=()=> {
        setError(null);
        setShowPasswordPrompt(true);
    }

    const handleConfirmSave=async()=> {
        if(!currentPassword) {
            setError("Please enter your current password to confirm changes.");
            return;
        }

        const validationError = validateProfileData({
            name,
            bio,
            experience,
            city,
            pricePerHour,
            subjects,
        });

        if (validationError) {
            setError(validationError);
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const updatedData: any = {
                name: name.trim(),
                bio: bio.trim() || undefined,
                city: city.trim() || undefined,
                experience: experience ? parseInt(experience) : undefined,
                pricePerHour: pricePerHour ? parseInt(pricePerHour) : undefined,
                subjects: subjects.length > 0 ? subjects : undefined,
                currentPassword,
            };

            const updatedUser = await updateProfile(updatedData);

            if(selectedAvatarFile) {
                const userWithAvatar = await uploadAvatar(selectedAvatarFile);
                onUserUpdate(userWithAvatar);
            } else {
                onUserUpdate(updatedUser);
            }

            setShowPasswordPrompt(false);
            setCurrentPassword("");
            setSelectedAvatarFile(null);
            setAvatarPreview(null);
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update profile."
            );
        } finally {
            setSaving(false);
        }
    };
    const handleCancelPassword=()=> {
        setShowPasswordPrompt(false);
        setCurrentPassword("");
        setError(null);
    }

    const handleAvatarChange=(e: React.ChangeEvent<HTMLInputElement>)=> {
        const file = e.target.files?.[0];
        if (file) {
            if(file.size > 5 * 1024 * 1024) {
                setError("Avatar file size must be less than 5MB.");
                return;
            }
            if(!file.type.startsWith("image/")) {
                setError("Please select a valid image file for the avatar.");
                return;
            }
            setSelectedAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setError(null);
        }
    };

    const handleOpenChangePassword=()=> {
        setShowChangePasswordModal(true);
        setChangePasswordData({
            currentPassword:"",
            newPassword:"",
            confirmNewPassword:""
        });
        setPasswordError(null);
    };

    const handleCloseChangePassword=async()=> {
        setShowChangePasswordModal(false);
        setChangePasswordData({
            currentPassword:"",
            newPassword:"",
            confirmNewPassword:""
        });
        setPasswordError(null);
    };

    const handleChangePassword=async()=> {
        setPasswordError(null);

        if(!changePasswordData.currentPassword) {
            setPasswordError("Please enter your current password.");
            return;
        }

        const passwordValidationError = validatePassword(changePasswordData.newPassword);
        if(passwordValidationError) {
            setPasswordError(passwordValidationError);
            return;
        }

        if(changePasswordData.newPassword !== changePasswordData.confirmNewPassword) {
            setPasswordError("New password and confirmation do not match.");
            return;
        }

        setChangingPassword(true);
        try {
            await changePassword({
                currentPassword: changePasswordData.currentPassword,
                newPassword: changePasswordData.newPassword
            });
            handleCloseChangePassword();
        } catch(err: any) {
            setPasswordError(err.response?.data?.message || "Failed to change password.");
        } finally {
            setChangingPassword(false);
        }
    };

    return {
        name,setName,
        bio,setBio,
        experience,setExperience,
        city,setCity,
        pricePerHour,setPricePerHour,
        subjects,setSubjects,
        currentSubject,setCurrentSubject,
        currentPassword,setCurrentPassword,
        showPasswordPrompt,
        saving,
        error,
        selectedAvatarFile,
        avatarPreview,
        showChangePasswordModal,
        changePasswordData,setChangePasswordData,
        changingPassword,
        passwordError,
        myAds,setMyAds,

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
    };
}
