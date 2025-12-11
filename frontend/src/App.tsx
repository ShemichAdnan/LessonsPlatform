import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AuthPage } from "./components/AuthPage";
import { Dashboard } from "./components/Dashboard";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
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

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  return (
    <BrowserRouter>
      <AppContent
        currentUser={currentUser}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        handleUserUpdate={handleUserUpdate}
      />
    </BrowserRouter>
  );
}

function AppContent({
  currentUser,
  handleLogin,
  handleLogout,
  handleUserUpdate,
}: {
  currentUser: User | null;
  handleLogin: (user: User) => void;
  handleLogout: () => void;
  handleUserUpdate: (user: User) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (currentUser && location.pathname === "/login") {
      navigate("/browse-ads", { replace: true });
    } else if (!currentUser && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [currentUser, navigate, location.pathname]);

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<AuthPage onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Dashboard
      user={currentUser}
      onLogout={handleLogout}
      onUserUpdate={handleUserUpdate}
    />
  );
}

export default App;
