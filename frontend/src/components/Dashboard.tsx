import { useLocation, useNavigate } from "react-router-dom";
import { FloatingMenu } from "./FloatingMenu";
import { FloatingCreateAd } from "./FloatingCreateAd";
import { BrowseAds } from "./BrowseAds";
import { MyProfile } from "./MyProfile";
import { MyBookings } from "./MyBookings";
import { Messages } from "./Messages";
import { AIAssistant } from "./AIAssistant";
import { Communities } from "./Communities";
import {AllProfilesPage} from "./AllProfilesPage";
import type { User } from "../App";
import { useState } from "react";

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
}

export type Page =
  | "browse"
  | "profiles"
  | "profile"
  | "bookings"
  | "messages"
  | "ai"
  | "communities";

export function Dashboard({ user, onLogout, onUserUpdate }: DashboardProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [browseAdsKey, setBrowseAdsKey] = useState(0); // To force remount BrowseAds

  const getCurrentPage = (): Page => {
    const path = location.pathname;
    if (path === "/profile") return "profile";
    if (path === "/profiles") return "profiles";
    if (path === "/bookings") return "bookings";
    if (path === "/messages") return "messages";
    if (path === "/ai") return "ai";
    if (path === "/communities") return "communities";
    return "browse";
  };

  const handleNavigate = (page: Page) => {
    const routes: Record<Page, string> = {
      browse: "/browse-ads",
      profiles: "/profiles",
      profile: "/profile",
      bookings: "/bookings",
      messages: "/messages",
      ai: "/ai",
      communities: "/communities",
    };
    navigate(routes[page]);
  };
  const handleAdCreated = () => {
    setBrowseAdsKey((prev) => prev + 1);
  };

  const currentPage = getCurrentPage();

  const renderPage = () => {
    switch (currentPage) {
      case "profile":
        return <MyProfile user={user} onUserUpdate={onUserUpdate} />;
      case "profiles":
        return <AllProfilesPage user={user} />;
      case "bookings":
        return <MyBookings user={user} />;
      case "messages":
        return <Messages user={user} />;
      case "ai":
        return <AIAssistant user={user} />;
      case "communities":
        return <Communities user={user} />;
      case "browse":
      default:
        return <BrowseAds key={browseAdsKey} user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <main className="flex-1">
        {renderPage()}
        <FloatingMenu
          user={user}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={onLogout}
        />
        {currentPage === "browse" && (
          <FloatingCreateAd user={user} onAdCreated={handleAdCreated} />
        )}
      </main>
    </div>
  );
}
