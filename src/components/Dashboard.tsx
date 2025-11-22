import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { BrowseAds } from "./BrowseAds";
import { MyProfile } from "./MyProfile";
import { CreateAd } from "./CreateAd";
import { MyBookings } from "./MyBookings";
import { Messages } from "./Messages";
import { AIAssistant } from "./AIAssistant";
import { Communities } from "./Communities";
import type { User } from "../App";

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
}

export type Page =
  | "browse"
  | "profile"
  | "create-ad"
  | "bookings"
  | "messages"
  | "ai"
  | "communities";

export function Dashboard({ user, onLogout, onUserUpdate }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<Page>("browse");

  const renderPage = () => {
    switch (currentPage) {
      case "browse":
        return <BrowseAds user={user} />;
      case "profile":
        return <MyProfile user={user} onUserUpdate={onUserUpdate} />;
      case "create-ad":
        return <CreateAd user={user} />;
      case "bookings":
        return <MyBookings user={user} />;
      case "messages":
        return <Messages user={user} />;
      case "ai":
        return <AIAssistant user={user} />;
      case "communities":
        return <Communities user={user} />;
      default:
        return <BrowseAds user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar
        user={user}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-auto">{renderPage()}</main>
    </div>
  );
}
