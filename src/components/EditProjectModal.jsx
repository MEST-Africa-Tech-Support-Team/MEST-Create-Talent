import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiClient, authHeader } from "../../api/client";

export default function EditProjectModal({ project, onClose, onUpdated }) {


  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    projectType: project?.projectType || "",

    links: {
      gitHub: project?.links?.gitHub || "",
      live: project?.links?.live || "",
    },
    techStack: project?.techStack || [],
    createdBy: project?.createdBy || [],
    images: null,
  });

  const [techInput, setTechInput] = useState("");
  const [creatorInput, setCreatorInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* -------------------- Handlers -------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLinksChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      links: {
        ...formData.links,
        [name]: value,
      },
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFormData({ ...formData, images: file });
  };

  /* -------------------- Tag Logic -------------------- */

  const handleTechKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && techInput.trim()) {
      e.preventDefault();
      const parts = techInput.split(/[,;\n]+/).map((v) => v.trim()).filter(Boolean);
      const updated = [...formData.techStack];
      parts.forEach((p) => { if (!updated.includes(p)) updated.push(p); });
      setFormData({ ...formData, techStack: updated });
      setTechInput("");
    }
  };

  const handleCreatorKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && creatorInput.trim()) {
      e.preventDefault();
      const parts = creatorInput.split(/[,;\n]+/).map((v) => v.trim()).filter(Boolean);
      const updated = [...formData.createdBy];
      parts.forEach((p) => { if (!updated.includes(p)) updated.push(p); });
      setFormData({ ...formData, createdBy: updated });
      setCreatorInput("");
    }
  };

  const removeTag = (type, value) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((v) => v !== value),
    });
  };

  /* -------------------- Submit -------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("projectType", formData.projectType);

      // data.append("links[gitHub]", formData.links.gitHub);
      // data.append("links[live]", formData.links.live);

      if (formData.links.gitHub.trim()) {
        data.append("links[gitHub]", formData.links.gitHub);
      }

      if (formData.links.live.trim()) {
        data.append("links[live]", formData.links.live);
      }

      formData.techStack.forEach((tech, index) => data.append(`techStack[${index}]`, tech));
      formData.createdBy.forEach((name, index) => data.append(`createdBy[${index}]`, name));

      if (formData.images) data.append("images", formData.images);

      await apiClient.patch(`/update/project/${project._id}`, data, {
        headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Project updated successfully");
      onUpdated?.();
      setTimeout(onClose, 800);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm">

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">

          {/* Close Button */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="rounded-full bg-gray-100 p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Edit Project</h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold mb-1">Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#28BBBB] outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 resize-none focus:ring-2 focus:ring-[#28BBBB] outline-none"
                />
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-sm font-semibold mb-1">Project Type</label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-[#28BBBB] outline-none"
                >
                  <option value="">Select project type</option>
                  <option value="PORTFOLIO_PERSONAL">Portfolio / Personal</option>
                  <option value="ECOMMERCE">E-commerce</option>
                  <option value="FINTECH">Fintech</option>
                  <option value="SAAS_PRODUCTIVITY">SaaS / Productivity</option>
                  <option value="SOCIAL_COMMUNICATION">Social / Communication</option>
                  <option value="ENTERTAINMENT_MEDIA">Entertainment / Media</option>
                  <option value="EDTECH">EdTech</option>
                  <option value="HEALTH_FITNESS">Health & Fitness</option>
                  <option value="AI_MACHINE_LEARNING">AI / Machine Learning</option>
                  <option value="WEB3_BLOCKCHAIN">Web3 / Blockchain</option>
                  <option value="UTILITIES_TOOLS">Utilities / Tools</option>
                  <option value="OPEN_SOURCE">Open Source</option>
                  <option value="ADVERTISEMENT">Advertisement</option>
                  <option value="GAMING">Gaming</option>
                  <option value="MARKETING">Marketing</option>
                </select>
              </div>

              {/* Links - FIX 2: Ensure value points to formData.links.xxx */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">GitHub Link</label>
                  <input
                    type="url"
                    name="gitHub"
                    value={formData.links.gitHub}
                    onChange={handleLinksChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#28BBBB] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Live Link</label>
                  <input
                    type="url"
                    name="live"
                    value={formData.links.live}
                    onChange={handleLinksChange}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#28BBBB] outline-none"
                  />
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-sm font-semibold mb-1">Tech Stack</label>
                <div className="flex flex-wrap gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#28BBBB]">
                  {formData.techStack.map((tech) => (
                    <span key={tech} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {tech}
                      <button type="button" onClick={() => removeTag("techStack", tech)} className="hover:text-blue-900">✕</button>
                    </span>
                  ))}
                  <input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleTechKeyDown}
                    placeholder="Type & Enter..."
                    className="flex-1 outline-none min-w-[100px] bg-transparent"
                  />
                </div>
              </div>

              {/* Created By */}
              <div>
                <label className="block text-sm font-semibold mb-1">Created By</label>
                <div className="flex flex-wrap gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#28BBBB]">
                  {formData.createdBy.map((name) => (
                    <span key={name} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {name}
                      <button type="button" onClick={() => removeTag("createdBy", name)} className="hover:text-green-900">✕</button>
                    </span>
                  ))}
                  <input
                    value={creatorInput}
                    onChange={(e) => setCreatorInput(e.target.value)}
                    onKeyDown={handleCreatorKeyDown}
                    placeholder="Type & Enter..."
                    className="flex-1 outline-none min-w-[100px] bg-transparent"
                  />
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-semibold mb-1">Update Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#28BBBB] file:text-white hover:file:opacity-90"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#28BBBB] text-white py-3 rounded-lg hover:opacity-90 font-semibold transition-colors"
                >
                  {loading ? "Updating..." : "Update Project"}
                </button>
              </div>

              {message && (
                <p className={`text-center font-medium ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}