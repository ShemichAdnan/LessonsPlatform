import { Outlet, useLocation } from "react-router-dom";
import { FloatingMenu } from "./FloatingMenu";
import { FloatingCreateAd } from "./FloatingCreateAd";

export function DashboardLayout() {
  const location = useLocation();
  const isBrowsePage = location.pathname === "/browse";

  return (
    <div className="flex h-screen bg-gray-900">
      <main className="flex-1">
        <Outlet />

        <FloatingMenu />
        {isBrowsePage && <FloatingCreateAd mode="create" />}
      </main>
    </div>
  );
}
