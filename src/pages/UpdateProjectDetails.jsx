import { useEffect, useState } from "react";
import { apiClient, authHeader } from "../../api/client.js";
import ProjectCard from "../components/ProjectCard";
import EditProjectModal from "../components/EditProjectModal";
import PageWrapper from "../components/PageWrapper";
import Footer from "../components/Footer";
import Banner from "../components/Banner.jsx";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";
import TalentPagination from "../components/TalentPagination.jsx";

const PROJECT_TYPES = [
  "PORTFOLIO_PERSONAL",
  "ECOMMERCE",
  "FINTECH",
  "SAAS_PRODUCTIVITY",
  "SOCIAL_COMMUNICATION",
  "ENTERTAINMENT_MEDIA",
  "EDTECH",
  "HEALTH_FITNESS",
  "AI_MACHINE_LEARNING",
  "WEB3_BLOCKCHAIN",
  "UTILITIES_TOOLS",
  "OPEN_SOURCE",
  "ADVERTISEMENT",
  "GAMING",
  "MARKETING",
];

export default function UpdateProjectDetails() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [projectType, setProjectType] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 12;

  const fetchProjects = async () => {
    setLoading(true);

    try {
      const isFiltering = projectType || search;
      let res;

      // No filter / search → fetch ALL projects
      if (!isFiltering) {
        res = await apiClient.get("/projects", {
          headers: authHeader(),
        });

        const projectsData = res.data.projects || res.data;
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setTotalPages(1);
      }
      // Filter / search → paginated endpoint
      else {
        res = await apiClient.get("/projects/filter", {
          headers: authHeader(),
          params: {
            projectType: projectType || undefined,
            title: search || undefined,
            page: currentPage,
            limit: LIMIT,
          },
        });

        setProjects(res.data.projects || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.error(error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage, projectType, search]);

  /* ---------- CONFIRM DELETE ---------- */
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await apiClient.delete(
        `/delete/project/${deleteTarget._id}`,
        { headers: authHeader() }
      );

      setDeleteTarget(null);
      fetchProjects();
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageWrapper className="bg-white">
      <Banner
        title="Manage Your"
        subtitle="Projects"
        description="Edit, update, and remove portfolio projects you've created."
      />

      <div className="mt-8 max-w-6xl mx-auto px-4">
        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Search projects by title"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/2 lg:w-1/3 pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none"
          />

          <select
            value={projectType}
            onChange={(e) => {
              setProjectType(e.target.value);
              setCurrentPage(1);
            }}
            className="px-6 py-3 rounded-xl bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#28BBBB] cursor-pointer"
          >
            <option value="">All Project Types</option>
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Projects */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading && (
              <p className="col-span-full text-center text-gray-500">
                Loading projects...
              </p>
            )}

            {!loading && projects.length === 0 && (
              <p className="col-span-full text-center text-gray-500">
                No projects found.
              </p>
            )}

            {!loading &&
              projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onEdit={setSelectedProject}
                  onDelete={setDeleteTarget}
                />
              ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <TalentPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}

          {selectedProject && (
            <EditProjectModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
              onUpdated={fetchProjects}
            />
          )}
        </div>

        {/* ❌ Delete Modal */}
        <ConfirmDeleteModal
          open={!!deleteTarget}
          title="Delete Project"
          description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          loading={deleting}
        />
      </div>

      <Footer />
    </PageWrapper>
  );
}
