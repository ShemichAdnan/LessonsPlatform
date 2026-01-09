import { useState, useEffect } from "react";
import { getAllProfiles } from "../services/profileServices";
import { Search, Users, AlertCircle, X } from "lucide-react";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import type { User } from "../App";
import { useAuth } from "../contexts/AuthContext";
import defaultAvatar from "../assets/images/defaultAvatar.png";

export const AllProfilesPage = () => {
  const { currentUser: user } = useAuth();
  const [profiles, setProfiles] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

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

  const filteredProfiles = profiles
    .filter((profile) => user && profile.id !== user.id)
    .filter((profile) =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8">
        <div className="text-center mb-10 pt-6">
          <h1 className="text-4xl font-bold mb-3 text-sunglow-50">
            All Profiles
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse profiles of all teachers and find the perfect match for your
            needs
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-10">
          <div className="relative flex items-center bg-gray2 rounded-full border border-gray1 shadow-lg shadow-sunglow-950/20 p-2">
            <div className="flex items-center flex-1 pl-4">
              <Search className="w-5 h-5 text-sunglow-400" />
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent text-sunglow-50 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="text-muted-foreground hover:text-sunglow-300 transition-colors mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button className="rounded-full bg-gradient-to-r from-sunglow-500 to-sunglow-600 hover:from-sunglow-400 hover:to-sunglow-500 text-background font-semibold cursor-pointer transition-all px-6">
              Search
            </Button>
          </div>

          {searchQuery && (
            <div className="mt-4 flex items-center gap-2 flex-wrap justify-center">
              <Badge
                variant="outline"
                className="bg-sunglow-500/20 text-sunglow-300 border-sunglow-500/50"
              >
                Search: "{searchQuery}"
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="text-sunglow-400 hover:text-sunglow-300 hover:bg-sunglow-500/10"
              >
                Clear search
              </Button>
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sunglow-500"></div>
            <p className="mt-4 text-muted-foreground">Loading profiles...</p>
          </div>
        )}

        {error && (
          <Card className="bg-sunglow-500/10 border-sunglow-500/30 max-w-3xl mx-auto mb-6">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-center gap-3">
                <AlertCircle className="w-5 h-5 text-sunglow-400" />
                <p className="text-sunglow-300 text-center">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <>
            {filteredProfiles.length !== 0 && (
              <div className="flex items-center gap-3 mb-6 max-w-6xl mx-auto">
                <div className="p-2 rounded-xl bg-sunglow-500/15 border border-sunglow-500/30">
                  <Users className="w-5 h-5 text-sunglow-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-sunglow-50">
                    Found{" "}
                    <span className="text-sunglow-400">
                      ({filteredProfiles.length})
                    </span>{" "}
                    {filteredProfiles.length === 1 ? "profile" : "profiles"}
                  </h2>
                  <p className="text-sunglow-200/60 text-sm">
                    All active users
                  </p>
                </div>
              </div>
            )}

            {filteredProfiles.length === 0 ? (
              <Card className="border-transparent max-w-6xl mx-auto">
                <CardContent className="pt-6 text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-sunglow-500/10 flex items-center justify-center">
                    <Users className="w-10 h-10 text-sunglow-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-sunglow-100">
                    No profiles found
                  </h3>
                  <p className="text-sunglow-200/70 mb-4">
                    {searchQuery
                      ? `No results for "${searchQuery}". Try different keywords.`
                      : "No profiles available at the moment."}
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      onClick={handleClearSearch}
                      className="border-sunglow-500/30 text-sunglow-300 hover:bg-sunglow-500/10 hover:text-sunglow-200 bg-transparent"
                    >
                      Clear search
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {filteredProfiles.map((profile) => (
                  <Card
                    key={profile.id}
                    onClick={() => navigate(`/profiles/${profile.id}`)}
                    className="bg-gray2 border-gray1 hover:border-sunglow-500/50 overflow-hidden hover:border-sunglow-400/40 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-sunglow-400/10 hover:-translate-y-1 rounded-xl"
                  >
                    <CardContent className="p-0 flex flex-col">
                      <div className="relative h-48 w-full overflow-hidden ">
                        <img
                          src={profile.avatarUrl || defaultAvatar}
                          alt={profile.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = defaultAvatar;
                          }}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray2 to-transparent" />
                      </div>
                      <div className="p-4 pt-2 flex flex-col items-center ">
                        <h3 className="text-lg font-semibold text-sunglow-50 text-center hover:text-sunglow-400 transition-colors mb-2">
                          {profile.name}
                        </h3>
                        {profile.subjects && profile.subjects.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 justify-center">
                            {profile.subjects
                              .slice(0, 3)
                              .map((subject, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-sunglow-500/10 text-sunglow-300 border-sunglow-500/30 text-xs"
                                >
                                  {subject}
                                </Badge>
                              ))}
                            {profile.subjects.length > 3 && (
                              <Badge
                                variant="secondary"
                                className="bg-gray1 text-sunglow-200/70 border-gray1 text-xs"
                              >
                                +{profile.subjects.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
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
