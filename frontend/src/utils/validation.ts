export const validatePassword = (password: string): string | null => {
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

  export const validateProfileData = (data: {
    name: string;
    bio: string;
    experience: string;
    city: string;
    pricePerHour: string;
    subjects: string[];
  }): string | null => {
    if (data.name.trim().length < 2) {
        return "Name must be at least 2 characters long";
    }
    if (data.bio.trim().length > 500) {
        return "Bio cannot exceed 500 characters";
    }
    if(data.city.trim().length >30) {
        return "City name cannot exceed 30 characters";
    }
    if(data.experience && (parseInt(data.experience) < 0 || parseInt(data.experience) > 80)) {
        return "Experience must be between 0 and 80 years";
    }
    if(data.pricePerHour && parseInt(data.pricePerHour) < 0) {
        return "Price per hour cannot be negative";
    }
    if(data.name.trim().length > 30) {
        return "Name cannot exceed 30 characters";
    }
    return null;
  };
