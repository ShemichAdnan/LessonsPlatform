import { useState, useEffect } from "react";
import { getAllProfiles, type Profile } from "../services/profileServices";
import { Search, Users, Loader2, AlertCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import type { User } from "../App";

interface AllProfilesPageProps {
  user: User
}

export const AllProfilesPage = ({ user }: AllProfilesPageProps) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllProfiles();
        setProfiles(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch profiles");
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const filteredProfiles = profiles.filter((profile) => profile.id !== user.id).filter((profile) =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  const getAvatarUrl = (avatarUrl: string | null | undefined) => {
    if (!avatarUrl) return null;
    return avatarUrl.startsWith("http")
      ? avatarUrl
      : `http://localhost:4000${avatarUrl}`;
  };

  return (
    <div className="bg-gray-900 p-6 h-screen overflow-scroll no-scrollbar">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl mb-2 text-white">All Profiles</h1>
          <p className="text-gray-400">
            Browse profiles of all teachers and find the perfect match for your
            needs
          </p>
        </div>

        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
            </div>
            {searchQuery && (
              <p className="mt-3 text-sm text-gray-400">
                Found {filteredProfiles.length}{" "}
                {filteredProfiles.length === 1 ? "profile" : "profiles"}
              </p>
            )}
          </CardContent>
        </Card>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-400">Loading profiles...</p>
          </div>
        )}

        {error && (
          <Card className="bg-red-900/20 border-red-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <>
            {filteredProfiles.length === 0 ? (
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                <CardContent className="py-16">
                  <div className="text-center">
                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">
                      {searchQuery
                        ? "No profiles match your search"
                        : "No profiles available"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredProfiles.map((profile) => (
                  <Card
                    key={profile.id}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
                  >
                    <CardContent className="p-6 flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-gray-700 group-hover:ring-blue-500/50 transition-all">
                        {profile.avatarUrl ? (
                          <img
                            src={profile.avatarUrl.startsWith("http") ? profile.avatarUrl : `http://localhost:4000${profile.avatarUrl}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-2xl font-semibold">
                              {getInitials(profile.name)}
                            </span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-white text-center group-hover:text-blue-400 transition-colors">
                        {profile.name}
                      </h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllProfilesPage;
