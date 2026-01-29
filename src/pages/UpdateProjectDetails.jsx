import { useEffect, useState } from "react";
import { apiClient, authHeader } from "../../api/client.js";
import ProjectCard from "../components/ProjectCard";
import EditProjectModal from "../components/EditProjectModal";
import PageWrapper from "../components/PageWrapper";
import Footer from "../components/Footer";
import Banner from "../components/Banner.jsx";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";

export default function UpdateProjectDetails() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await apiClient.get("/projects", {
        headers: authHeader(),
      });

      const projectsData = res.data.projects || res.data;

      if (Array.isArray(projectsData)) {
        setProjects(projectsData);
      } else {
        console.error("Projects response is not an array:", res.data);
        setProjects([]);
      }
    } catch (err) {
      console.error(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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

  const [search, setSearch] = useState("");

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper className="bg-white">
      <Banner
        title="Manage Your"
        subtitle="Projects"
        description="Edit, update, and remove portfolio projects you've created."
      />

      <div className="mt-8 max-w-6xl mx-auto px-4">
        <input
          type="text"
          placeholder="Search projects by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block mx-auto w-full md:w-1/2 lg:w-1/3 pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-100)] text-gray-900 placeholder-gray-500"
        />

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
              filteredProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onEdit={setSelectedProject}
                  onDelete={setDeleteTarget}
                />
              ))}
          </div>
          {selectedProject && (
            <EditProjectModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
              onUpdated={fetchProjects}
            />
          )}
        </div>

        {/* DELETE MODAL */}
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
