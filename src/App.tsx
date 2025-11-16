import { useState } from "react";
import { AuthPage } from "./components/AuthPage";
import { Dashboard } from "./components/Dashboard";

export interface User {
  id: string;
  email: string;
  name: string;
  role?: "student" | "tutor";
  avatar?: string;
  bio?: string;
  subjects?: string[];
  experience?: number;
  city?: string;
  pricePerHour?: number;
  level?: string;
}

export interface Ad {
  id: string;
  userId: string;
  type: "tutor" | "student";
  subject: string;
  areas: string[];
  level: string;
  pricePerHour?: number;
  availableTimes?: string[];
  location: "online" | "in-person" | "both";
  city?: string;
  description: string;
  createdAt: string;
  user: User;
  rating?: number;
  reviews?: number;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return <Dashboard user={currentUser} onLogout={handleLogout} />;
}

export default App;
