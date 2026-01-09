import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  LogOut,
  Search,
  MessageSquare,
  Users,
  User,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import defaultAvatar from "../assets/images/defaultAvatar.png";
import logoAplikacije from "../assets/images/logoAplikacije.png";

const menuItems = [
  { path: "/browse", label: "Browse Ads", icon: Search },
  { path: "/profiles", label: "All Profiles", icon: Users },
  { path: "/messages", label: "Messages", icon: MessageSquare },
  { path: "/profile", label: "My Profile", icon: User },
];

export function FloatingMenu() {
  const { currentUser: user, logout } = useAuth();
  const { totalUnread } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full shadow-lg shadow-sunglow-500/25 bg-gradient-to-br from-sunglow-400 to-sunglow-600 hover:from-sunglow-300 hover:to-sunglow-500 flex items-center justify-center text-background transition-all duration-300 hover:shadow-sunglow-500/40 hover:scale-105"
      >
        <Menu className="h-6 w-6" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-6 h-6 px-1 rounded-full bg-background text-sunglow-600 text-xs font-semibold flex items-center justify-center ring-2 ring-sunglow-500/30">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed left-0 top-0 bottom-0 w-72 bg-gray2 border-r border-gray1 z-50 flex flex-col overflow-y-auto shadow-xl shadow-sunglow-500/5">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={logoAplikacije}
                    alt="LearnConnect"
                    className="w-10 h-10 rounded-xl object-contain"
                  />
                  <span className="text-xl font-semibold text-sunglow-50">
                    LearnConnect
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sunglow-200/60 hover:text-sunglow-300 transition-colors p-1 rounded-lg hover:bg-gray1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="h-px bg-gray1 mx-4" />

            <nav className="flex-1 p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-sunglow-500/15 text-sunglow-300 shadow-sm shadow-sunglow-500/10"
                        : "text-sunglow-100/70 hover:bg-gray1 hover:text-sunglow-200"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-sunglow-400" : ""
                      }`}
                    />
                    <span className="font-medium">{item.label}</span>

                    {item.path === "/messages" && totalUnread > 0 && (
                      <span
                        className={`ml-auto min-w-6 h-6 px-2 rounded-full text-xs font-semibold flex items-center justify-center ${
                          isActive
                            ? "bg-sunglow-500/25 text-sunglow-200"
                            : "bg-sunglow-500/15 text-sunglow-200"
                        }`}
                      >
                        {totalUnread > 99 ? "99+" : totalUnread}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="h-px bg-gray1 mx-4" />

            <div className="p-4 space-y-4">
              {user && (
                <div className="flex items-center gap-3 p-3 rounded-xl">
                  <Avatar className="ring-2 ring-sunglow-500/30">
                    <AvatarImage
                      className="object-cover"
                      src={
                        user.avatarUrl
                          ? user.avatarUrl.startsWith("http")
                            ? user.avatarUrl
                            : `http://localhost:4000${user.avatarUrl}`
                          : defaultAvatar
                      }
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultAvatar;
                      }}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-sunglow-400 to-sunglow-600 text-background font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sunglow-50 font-medium">
                      {user.name}
                    </div>
                    <div className="text-xs text-sunglow-200/50">Online</div>
                  </div>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full border-gray1 bg-transparent text-sunglow-200/80 cursor-pointer hover:bg-gray1 hover:text-sunglow-300 hover:border-sunglow-500/30 transition-all duration-200"
                onClick={async () => {
                  await logout();
                  setIsOpen(false);
                  navigate("/login");
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
