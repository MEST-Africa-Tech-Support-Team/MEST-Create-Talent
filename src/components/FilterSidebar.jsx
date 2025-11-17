import { useState } from "react";
import { X, Search } from "lucide-react";

// Predefined lists for filter options
const skillsList = ["ReactJS", "Node.js", "Css 3", "HTML5", "Tailwind", "Javascript"];
const rolesList = ["Backend", "Frontend", "Fullstack"];
// const availabilityList = ["Available", "Full-time", "Part-time", "Contract"];
const availabilityList = ["Yes", "No"];
const cohortsList = ["Cohort 4", "Cohort 5" , "Cohort 6"]; // Example cohorts

export default function FilterSidebar({ filters, setFilters, onClose }) {
  // Use a local state to manage changes before applying
  const [localFilters, setLocalFilters] = useState(filters);

  // Handle changes for multi-select (checkbox-style) filters
  const handleArrayChange = (filterKey, value) => {
    setLocalFilters((prev) => {
      const currentArray = prev[filterKey];
      if (currentArray.includes(value)) {
        return { ...prev, [filterKey]: currentArray.filter((item) => item !== value) };
      } else {
        return { ...prev, [filterKey]: [...currentArray, value] };
      }
    });
  };

  // Handle changes for single-select (radio-button-style) filters
  const handleSingleSelectChange = (filterKey, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [filterKey]: prev[filterKey] === value ? null : value, // Toggle logic for single selection
    }));
  };

  // Apply filters to the parent component's state
  const handleApplyFilters = () => {
    setFilters(localFilters);
    onClose();
  };

 

  // In FilterSidebar.jsx
const handleClearAll = () => {
  const defaultFilters = {
    search: "",
    searchField: "name", // 👈 Add this line to reset the search field
    skills: [],
    roles: [],           // 👈 Correct the key from 'role' to 'roles' to match the parent
    availability: null,
    cohort: null,
  };
  setLocalFilters(defaultFilters);
  setFilters(defaultFilters);
  onClose();
};



  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/30 backdrop-blur-sm bg-opacity-50">
      <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white p-6 shadow-lg transform transition-transform duration-300 ease-in-out translate-x-0">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Filters</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <X size={24} />
          </button>
        </div>

        {/* Search within sidebar */}
        <div className="relative mt-6 mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search talents by name..."
            className="w-full pl-10 pr-4 py-2 text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={localFilters.search}
            onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
          />
        </div>

        {/* All Filter Sections */}
        <div className="flex flex-col gap-6 overflow-y-auto flex-1">
          {/* Skills Filter Section */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-[#333333]">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill) => (
                <span
                  key={skill}
                  onClick={() => handleArrayChange("skills", skill)}
                  className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    localFilters.skills.includes(skill)
                      ? "bg-[#28bbbb] text-white"
                      : "bg-[#949494] text-[#fff] "
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Roles Filter Section */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-[#333333]">Roles</h3>
            <div className="flex flex-wrap gap-2">
              {rolesList.map((role) => (
                <span
                  key={role}
                  onClick={() => handleArrayChange("roles", role)}
                  className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    localFilters.roles.includes(role)
                       ? "bg-[#28bbbb] text-white"
                      : "bg-[#949494] text-[#fff] "
                  }`}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Availability Filter Section */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-[#333333]">Availability</h3>
            <div className="flex flex-wrap gap-2">
              {availabilityList.map((availability) => (
                <span
                  key={availability}
                  onClick={() => handleSingleSelectChange("availability", availability)}
                  className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-colors  ${
                    localFilters.availability === availability
                       ? "bg-[#28bbbb] text-white"
                      : "bg-[#949494] text-[#fff] "
                  }`}
                >
                  {availability}
                </span>
              ))}
            </div>
          </div>

          {/* Cohort Filter Section */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-2 text-[#333333]">Cohort</h3>
            <div className="flex flex-wrap gap-2">
              {cohortsList.map((cohort) => (
                <span
                  key={cohort}
                  onClick={() => handleSingleSelectChange("cohort", cohort)}
                  className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-colors  ${
                    localFilters.cohort === cohort
                      ? "bg-[#28bbbb] text-white"
                      : "bg-[#949494] text-[#fff] "
                  }`}
                >
                  {cohort}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 flex justify-between items-center border-t border-gray-200">
          <button onClick={handleClearAll} className="text-sm font-semibold text-[#ff6221] hover:underline cursor-pointer">
            Clear All
          </button>
          <button onClick={handleApplyFilters} className="px-6 py-2 rounded-lg bg-[#28bbbb] text-white font-semibold cursor-pointer">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}