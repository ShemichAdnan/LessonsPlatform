import { useState, useEffect } from "react";
import { Search, BookOpen, X, SlidersHorizontal } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import { getAds, searchAds as searchAdsAPI } from "../services/adApi";
import type { Ad } from "../App";
import { AdCard } from "./AdCard";
import { FloatingCreateAd } from "./FloatingCreateAd";

export function BrowseAds() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [typeFilter, setTypeFilter] = useState<"all" | "tutor" | "student">(
    "all"
  );
  const [subjectFilter, setSubjectFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchAdsWithSearchAndFilters = async () => {
    setLoading(true);
    setError(null);

    try {
      let fetchedAds: Ad[] = [];

      if (searchQuery.trim()) {
        fetchedAds = await searchAdsAPI(searchQuery);
        setIsSearching(true);
      } else {
        const filters: any = {};
        if (typeFilter !== "all") filters.type = typeFilter;
        if (subjectFilter) filters.subject = subjectFilter;
        if (levelFilter !== "all") filters.level = levelFilter;
        if (locationFilter !== "all") filters.location = locationFilter;
        if (cityFilter) filters.city = cityFilter;

        fetchedAds = await getAds(filters);
        setIsSearching(false);
      }

      let filteredAds = fetchedAds;

      if (typeFilter !== "all") {
        filteredAds = filteredAds.filter((ad) => ad.type === typeFilter);
      }
      if (subjectFilter) {
        filteredAds = filteredAds.filter((ad) =>
          ad.subject.toLowerCase().includes(subjectFilter.toLowerCase())
        );
      }
      if (levelFilter !== "all") {
        filteredAds = filteredAds.filter((ad) => ad.level === levelFilter);
      }
      if (locationFilter !== "all") {
        if (locationFilter === "online") {
          filteredAds = filteredAds.filter(
            (ad) => ad.location === "online" || ad.location === "both"
          );
        } else if (locationFilter === "in-person") {
          filteredAds = filteredAds.filter(
            (ad) => ad.location === "in-person" || ad.location === "both"
          );
        } else {
          filteredAds = filteredAds.filter((ad) => ad.location === "both");
        }
      }
      if (cityFilter) {
        filteredAds = filteredAds.filter(
          (ad) =>
            ad.city && ad.city.toLowerCase().includes(cityFilter.toLowerCase())
        );
      }

      setAds(filteredAds);
    } catch (err: any) {
      console.error("Error fetching ads:", err);
      setError("Failed to load ads. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdsWithSearchAndFilters();
    }, 500);
    return () => clearTimeout(timer);
  }, [
    typeFilter,
    subjectFilter,
    levelFilter,
    locationFilter,
    cityFilter,
    searchQuery,
  ]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  const handleResetFilters = () => {
    setTypeFilter("all");
    setSubjectFilter("");
    setLevelFilter("all");
    setLocationFilter("all");
    setCityFilter("");
    setSearchQuery("");
    setIsSearching(false);
    setIsFilterOpen(false);
  };

  const activeFiltersCount =
    (typeFilter !== "all" ? 1 : 0) +
    (subjectFilter ? 1 : 0) +
    (levelFilter !== "all" ? 1 : 0) +
    (locationFilter !== "all" ? 1 : 0) +
    (cityFilter ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-8">
        <div className="text-center mb-10 pt-6">
          <h1 className="text-4xl font-bold mb-3 text-sunglow-50">
            Browse Ads
          </h1>
          <p className="text-muted-foreground text-lg">
            Find the perfect tutor or student for your needs
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-10">
          <div className="relative flex items-center bg-gray2 rounded-full border border-gray1 shadow-lg shadow-sunglow-950/20 p-2 ">
            <div className="flex items-center flex-1 pl-4">
              <Search className="w-5 h-5 text-sunglow-400" />
              <Input
                placeholder='Search for anything... (e.g., "Math", "John", "Zagreb")'
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

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative cursor-pointer rounded-full hover:bg-gray1 text-sunglow-200 mr-1"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-sunglow-500 text-sunglow-950 text-xs font-bold rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-gray2 border-gray1 text-sunglow-50 w-full max-w-md">
                <SheetHeader>
                  <SheetTitle className="text-sunglow-100">
                    Filter Ads
                  </SheetTitle>
                  <SheetDescription className="text-muted-foreground">
                    Narrow down your search with filters
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 p-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-sunglow-200">
                      Type
                    </label>
                    <Select
                      value={typeFilter}
                      onValueChange={(v: any) => setTypeFilter(v)}
                    >
                      <SelectTrigger className="bg-gray1 border-gray1 text-sunglow-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray2 border-gray1">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="tutor">Tutors</SelectItem>
                        <SelectItem value="student">Students</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-sunglow-200">
                      Subject
                    </label>
                    <Input
                      placeholder="e.g., Mathematics"
                      value={subjectFilter}
                      onChange={(e) => setSubjectFilter(e.target.value)}
                      className="bg-gray1 border-gray1 text-sunglow-50 placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-sunglow-200">
                      Level
                    </label>
                    <Select value={levelFilter} onValueChange={setLevelFilter}>
                      <SelectTrigger className="bg-gray1 border-gray1 text-sunglow-50">
                        <SelectValue placeholder="All levels" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray2 border-gray1">
                        <SelectItem value="all">All levels</SelectItem>
                        <SelectItem value="Elementary">Elementary</SelectItem>
                        <SelectItem value="High School">High School</SelectItem>
                        <SelectItem value="College">College</SelectItem>
                        <SelectItem value="Professional">
                          Professional
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-sunglow-200">
                      Location
                    </label>
                    <Select
                      value={locationFilter}
                      onValueChange={setLocationFilter}
                    >
                      <SelectTrigger className="bg-gray1 border-gray1 text-sunglow-50">
                        <SelectValue placeholder="All locations" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray2 border-gray1">
                        <SelectItem value="all">All locations</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="in-person">In-person</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-sunglow-200">
                      City
                    </label>
                    <Input
                      placeholder="e.g., Zagreb"
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      className="bg-gray1 border-gray1 text-sunglow-50 placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button
                      variant="outline"
                      onClick={handleResetFilters}
                      className="w-full cursor-pointer border-gray1 text-sunglow-200 hover:bg-gray1 hover:text-sunglow-100 bg-transparent"
                    >
                      Reset All Filters
                    </Button>
                    <Button
                      onClick={() => setIsFilterOpen(false)}
                      className="w-full mt-2 cursor-pointer bg-sunglow-500 hover:bg-sunglow-600 text-sunglow-950 font-semibold"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Button
              onClick={() => fetchAdsWithSearchAndFilters()}
              className="rounded-full bg-gradient-to-r from-sunglow-500 to-sunglow-600 hover:from-sunglow-400 hover:to-sunglow-500 text-background font-semibold cursor-pointer transition-all px-6"
            >
              Search
            </Button>
          </div>

          {(isSearching || activeFiltersCount > 0) && (
            <div className="mt-4 flex items-center gap-2 flex-wrap justify-center">
              {isSearching && (
                <>
                  <Badge
                    variant="outline"
                    className="bg-sunglow-500/20 text-sunglow-300 border-sunglow-500/50"
                  >
                    🔍 Search: "{searchQuery}"
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="text-sunglow-400 hover:text-sunglow-300 hover:bg-sunglow-500/10"
                  >
                    Clear search
                  </Button>
                </>
              )}
              {activeFiltersCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  {isSearching ? "• Filters:" : "Active filters:"}
                </span>
              )}
              {typeFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-gray1 text-sunglow-200 border-gray1"
                >
                  Type: {typeFilter}
                  <button
                    onClick={() => setTypeFilter("all")}
                    className="ml-1 hover:text-sunglow-400 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {subjectFilter && (
                <Badge
                  variant="secondary"
                  className="bg-gray1 text-sunglow-200 border-gray1"
                >
                  Subject: {subjectFilter}
                  <button
                    onClick={() => setSubjectFilter("")}
                    className="ml-1 hover:text-sunglow-400 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {levelFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-gray1 text-sunglow-200 border-gray1"
                >
                  Level: {levelFilter}
                  <button
                    onClick={() => setLevelFilter("all")}
                    className="ml-1 hover:text-sunglow-400 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {locationFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-gray1 text-sunglow-200 border-gray1"
                >
                  Location: {locationFilter}
                  <button
                    onClick={() => setLocationFilter("all")}
                    className="ml-1 hover:text-sunglow-400 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {cityFilter && (
                <Badge
                  variant="secondary"
                  className="bg-gray1 text-sunglow-200 border-gray1"
                >
                  City: {cityFilter}
                  <button
                    onClick={() => setCityFilter("")}
                    className="ml-1 hover:text-sunglow-400 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sunglow-500"></div>
            <p className="mt-4 text-muted-foreground">
              {isSearching ? "Searching..." : "Loading ads..."}
            </p>
          </div>
        )}

        {error && (
          <Card className="bg-sunglow-500/10 border-sunglow-500/30 max-w-3xl mx-auto mb-6">
            <CardContent className="pt-6 pb-6">
              <p className="text-sunglow-300 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && (
          <>
            {ads.length !== 0 && (
              <div className="flex items-center gap-3 mb-6 max-w-6xl mx-auto">
                <div className="p-2 rounded-xl bg-sunglow-500/15 border border-sunglow-500/30">
                  <BookOpen className="w-5 h-5 text-sunglow-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-sunglow-50">
                    Found{" "}
                    <span className="text-sunglow-400">({ads.length})</span>{" "}
                    {ads.length === 1 ? "ad" : "ads"}{" "}
                    {isSearching && ` for "${searchQuery}"`}
                  </h2>
                  <p className="text-sunglow-200/60 text-sm">All active ads</p>
                </div>
              </div>
            )}

            {ads.length === 0 && (
              <Card className="border-transparent max-w-6xl mx-auto">
                <CardContent className="pt-6 text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-sunglow-500/10 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-sunglow-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-sunglow-100">
                    No ads found
                  </h3>
                  <p className="text-sunglow-200/70 mb-4">
                    {isSearching
                      ? `No results for "${searchQuery}". Try different keywords.`
                      : "Try adjusting your filters or check back later"}
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleResetFilters}
                    className="border-sunglow-500/30 text-sunglow-300 hover:bg-sunglow-500/10 hover:text-sunglow-200 bg-transparent"
                  >
                    Reset all filters
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {ads.map((ad) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  onAdUpdated={fetchAdsWithSearchAndFilters}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <FloatingCreateAd
        mode="create"
        onAdCreated={fetchAdsWithSearchAndFilters}
      />
    </div>
  );
}
