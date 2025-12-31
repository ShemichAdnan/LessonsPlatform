import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "./components/AuthPage";
import { DashboardLayout } from "./components/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { BrowseAds } from "./components/BrowseAds";
import { MyProfile } from "./components/MyProfile";
import { AllProfilesPage } from "./components/AllProfilesPage";
import { UserProfilePage } from "./components/UserProfilePage";
import { AdPage } from "./components/AdPage";
import { Messages } from "./components/Messages";
import { AIAssistant } from "./components/AIAssistant";
import { Communities } from "./components/Communities";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";

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
  createdAt?: string;
}

export interface Ad {
  id: string;
  userId: string;
  type: "tutor" | "student";
  subject: string;
  areas: string[];
  level: string;
  pricePerHour?: number;
  location: "online" | "in-person" | "both";
  city?: string;
  description: string;
  createdAt: string;
  user: User;
  rating?: number;
  reviews?: number;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const { currentUser, login } = useAuth();
  return (
    <Routes>
      
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/browse" replace />
          ) : (
            <AuthPage onLogin={login} />
          )
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/browse" replace />} />
        <Route path="browse" element={<BrowseAds />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="profiles" element={<AllProfilesPage />} />
        <Route path="profiles/:userId" element={<UserProfilePage />} />
        <Route path="ads/:adId" element={<AdPage />} />
        <Route path="messages" element={<Messages />} />
        <Route path="ai" element={<AIAssistant />} />
        <Route path="communities" element={<Communities />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}


export default App;
