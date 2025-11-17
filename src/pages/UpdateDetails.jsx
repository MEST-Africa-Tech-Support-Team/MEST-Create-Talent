import { useEffect, useState, useCallback } from "react";
import PageWrapper from "../components/PageWrapper";
import Footer from "../components/Footer";
import TalentCards from "../components/TalentCards";
import TalentPagination from "../components/TalentPagination";
import EditTalentProfileModal from "../components/EditTalentProfileModal";
import { apiClient } from "../../api/client";
import FilterSidebar from "../components/FilterSidebar";
import Banner from "../components/Banner";

export default function UpdateDetails() {

  const [talents, setTalents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [talentsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [talentProfile, setTalentProfile] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    searchField: "name",
    skills: [],
    roles: [],
    availability: null,
    cohort: null,
  });

  // Fetch talents
  const fetchTalents = useCallback(() => {
    setIsLoading(true);
    setError(null);

    const params = {};

    if (filters.search && filters.search.trim() !== "") {
      const field = filters.searchField || "name";
      params[field] = filters.search.trim();
    }

    if (filters.skills?.length > 0) params.skills = filters.skills.join(",");
    if (filters.roles?.length > 0) params.role = filters.roles.join(",");
    if (filters.availability) params.availability = filters.availability;
    if (filters.cohort) params.cohort = filters.cohort;

    const hasFilters = Object.keys(params).length > 0;
    const url = hasFilters ? "/talent-query" : "/talents";

    apiClient
      .get(url, { params })
      .then((response) => {
        const portfolios = response.data.portfolios || response.data;
        if (Array.isArray(portfolios)) {
          // ✅ Sort by cohort first (Cohort 6 first), then alphabetically by name
          const sortedPortfolios = [...portfolios].sort((a, b) => {
            // Get cohort values
            const cohortA = a.cohort || "";
            const cohortB = b.cohort || "";

            // Prioritize Cohort 6
            if (cohortA === "Cohort 6" && cohortB !== "Cohort 6") return -1;
            if (cohortA !== "Cohort 6" && cohortB === "Cohort 6") return 1;

            // If both are Cohort 6 or both are not, sort alphabetically by name
            return a.name.localeCompare(b.name);
          });

          setTalents(sortedPortfolios);
          setTotalPages(Math.ceil(sortedPortfolios.length / talentsPerPage));
        } else {
          throw new Error("API response is not a valid array.");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch talents:", err);
        setError(
          "No talent with the specified criteria was found. Please try different search options."
        );
        setTalents([]);
      })
      .finally(() => setIsLoading(false));
  }, [filters, talentsPerPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchTalents();
    }, 500);
    return () => clearTimeout(handler);
  }, [fetchTalents]);

  useEffect(() => {
    if (selectedTalent) {
      setIsModalLoading(true);
      apiClient
        .get(`/talent/${selectedTalent.id}`)
        .then((response) => setTalentProfile(response.data.portfolio))
        .catch((err) => {
          console.error("Failed to fetch talent profile:", err);
          setTalentProfile(null);
        })
        .finally(() => setIsModalLoading(false));
    }
  }, [selectedTalent]);

  const indexOfLastTalent = currentPage * talentsPerPage;
  const indexOfFirstTalent = indexOfLastTalent - talentsPerPage;
  const displayedTalents = talents.slice(indexOfFirstTalent, indexOfLastTalent);

  return (
    <>
      <PageWrapper className="bg-white">
        <Banner />

        <div className="min-h-[100vh] px-4 bg-white">
          <div className="my-8 flex flex-col md:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
            <div className="relative flex-1 w-full md:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <input
                type="text"
                placeholder={
                  {
                    name: "Search talents by name (e.g. Abdul Gafar Issah)",
                    skills: "Search talents by skill (e.g. React.js, Node.js)",
                    role: "Search talents by role (e.g. Frontend, Backend, Fullstack)",
                  }[filters.searchField] || "Search talents"
                }
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-100)] text-gray-900 placeholder-gray-500"
              />
            </div>

            <div className="relative">
              <select
                value={filters.searchField}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    searchField: e.target.value,
                  }))
                }
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 shadow-sm text-gray-700 font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
              >
                <option value="name">Search by Name</option>
                <option value="role">Search by Role</option>
                <option value="skills">Search by Skill</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <button
              onClick={() => setIsFilterSidebarOpen(true)}
              className="px-6 py-3 rounded-xl bg-[#28BBBB] text-white font-semibold shadow transition-all cursor-pointer"
            >
              Filter
            </button>
          </div>

          {isLoading ? (
            <div className="text-center text-lg mt-10">Loading talents...</div>
          ) : error ? (
            <div className="text-center text-red-500 text-lg mt-10">{error}</div>
          ) : (
            <>
              <TalentCards
                talents={displayedTalents}
                onViewProfile={(talent) => setSelectedTalent(talent)}
              />
              <TalentPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>

        <Footer />

        {/* <EditTalentProfileModal
        isOpen={!!selectedTalent}
        onClose={() => {
          setSelectedTalent(null);
          setTalentProfile(null);
        }}
        talent={talentProfile}
        isLoading={isModalLoading}
      /> */}

        <EditTalentProfileModal
          isOpen={!!selectedTalent}
          onClose={() => setSelectedTalent(null)}
          talent={selectedTalent}
          onUpdated={fetchTalents} // to refresh list after editing
        />

        {isFilterSidebarOpen && (
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onClose={() => setIsFilterSidebarOpen(false)}
          />
        )}
      </PageWrapper>
    </>
  );
}