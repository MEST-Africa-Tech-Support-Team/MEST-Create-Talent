import React, { useState } from "react";
import { Link } from "react-router";
import { apiClient } from "../../api/client";

export default function CreateProject() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    links: {
      gitHub: "",
      live: "",
    },
    techStack: [],
    createdBy: [],
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
    if (file) {
      setFormData({ ...formData, images: file });
    }
  };

  /* -------------------- Tech Stack -------------------- */

  const handleTechKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && techInput.trim()) {
      e.preventDefault();

      const parts = techInput
        .split(/[,;\n]+/)
        .map((v) => v.trim())
        .filter(Boolean);

      const updated = [...formData.techStack];
      parts.forEach((p) => {
        if (!updated.includes(p)) updated.push(p);
      });

      setFormData({ ...formData, techStack: updated });
      setTechInput("");
    }
  };

  const handleTechPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");

    const parts = pasted
      .split(/[,;\n]+/)
      .map((v) => v.trim())
      .filter(Boolean);

    const updated = [...formData.techStack];
    parts.forEach((p) => {
      if (!updated.includes(p)) updated.push(p);
    });

    setFormData({ ...formData, techStack: updated });
    setTechInput("");
  };

  /* -------------------- Created By -------------------- */

  const handleCreatorKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && creatorInput.trim()) {
      e.preventDefault();

      const parts = creatorInput
        .split(/[,;\n]+/)
        .map((v) => v.trim())
        .filter(Boolean);

      const updated = [...formData.createdBy];
      parts.forEach((p) => {
        if (!updated.includes(p)) updated.push(p);
      });

      setFormData({ ...formData, createdBy: updated });
      setCreatorInput("");
    }
  };

  const handleCreatorPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");

    const parts = pasted
      .split(/[,;\n]+/)
      .map((v) => v.trim())
      .filter(Boolean);

    const updated = [...formData.createdBy];
    parts.forEach((p) => {
      if (!updated.includes(p)) updated.push(p);
    });

    setFormData({ ...formData, createdBy: updated });
    setCreatorInput("");
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

    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);

    data.append("links[gitHub]", formData.links.gitHub);
    data.append("links[live]", formData.links.live);

    formData.techStack.forEach((tech, index) => {
      data.append(`techStack[${index}]`, tech);
    });

    formData.createdBy.forEach((name, index) => {
      data.append(`createdBy[${index}]`, name);
    });

    if (formData.images) {
      data.append("images", formData.images);
    }

    try {
      const response = await apiClient.post(
        "/create/project",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("Project created successfully ✅");
      console.log(response.data);

      setFormData({
        title: "",
        description: "",
        links: { gitHub: "", live: "" },
        techStack: [],
        createdBy: [],
        images: null,
      });
    } catch (error) {
      console.error(error);
      setMessage(
        error?.response?.data?.message ||
          "❌ Failed to create project."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-10">
      <Link
        to="/"
        className="inline-block mb-6 text-blue-600 hover:text-blue-800 font-semibold"
      >
        ← Back
      </Link>

      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create Project
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold">Description</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 resize-none"
          />
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold">GitHub Link</label>
            <input
              type="url"
              name="gitHub"
              value={formData.links.gitHub}
              onChange={handleLinksChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Live Link</label>
            <input
              type="url"
              name="live"
              value={formData.links.live}
              onChange={handleLinksChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-semibold">Tech Stack</label>
          <div className="flex flex-wrap gap-2 border rounded-lg px-3 py-2">
            {formData.techStack.map((tech) => (
              <span
                key={tech}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex gap-2"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTag("techStack", tech)}
                >
                  ✕
                </button>
              </span>
            ))}
            <input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleTechKeyDown}
              onPaste={handleTechPaste}
              className="flex-1 outline-none"
            />
          </div>
        </div>

        {/* Created By */}
        <div>
          <label className="block text-sm font-semibold">Created By</label>
          <div className="flex flex-wrap gap-2 border rounded-lg px-3 py-2">
            {formData.createdBy.map((name) => (
              <span
                key={name}
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex gap-2"
              >
                {name}
                <button
                  type="button"
                  onClick={() => removeTag("createdBy", name)}
                >
                  ✕
                </button>
              </span>
            ))}
            <input
              value={creatorInput}
              onChange={(e) => setCreatorInput(e.target.value)}
              onKeyDown={handleCreatorKeyDown}
              onPaste={handleCreatorPaste}
              className="flex-1 outline-none"
            />
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-semibold">Project Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#28BBBB] text-white py-2 rounded-lg"
        >
          {loading ? "Submitting..." : "Create Project"}
        </button>
      </form>

      {message && (
        <p
          className={`text-center mt-4 font-semibold ${
            message.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
