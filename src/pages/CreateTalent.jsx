import React, { useState } from "react";
import { Link } from "react-router";
import { apiClient } from "../../api/client";

export default function CreateTalent() {
  const [formData, setFormData] = useState({
    name: "",
    images: null,
    email: "",
    phoneNumber: "",
    cohort: "",
    role: "",
    availability: "",
    portFolio: "",
    cv: "",
    briefSummary: "",
    educationSummary: "",
    skills: [],
    softSkills: [],
    projects: [{ title: "", description: "", link: "" }], // ADDED (Start with one empty project)
    location: { country: "", city: "" }, // ADDED
    isRemote: false, // ADDED
  });

  const [skillInput, setSkillInput] = useState("");
  const [softSkillInput, setSoftSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle normal input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, images: file });
    }
  };

  // Handle skill addition (supports pasting multiple lines)
  const handleSkillKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault();

      // Split input by commas, newlines, or semicolons
      const newParts = skillInput
        .split(/[,;\n]+/)
        .map((v) => v.trim())
        .filter((v) => v);

      const updatedSkills = [...formData.skills];
      newParts.forEach((part) => {
        if (!updatedSkills.includes(part)) updatedSkills.push(part);
      });

      setFormData({ ...formData, skills: updatedSkills });
      setSkillInput("");
    }
  };

  // Handle skill paste
  const handleSkillPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const newParts = pasted
      .split(/[,;\n]+/)
      .map((v) => v.trim())
      .filter((v) => v);

    const updatedSkills = [...formData.skills];
    newParts.forEach((part) => {
      if (!updatedSkills.includes(part)) updatedSkills.push(part);
    });

    setFormData({ ...formData, skills: updatedSkills });
    setSkillInput("");
  };


  // Handle soft skill addition (supports pasting multiple lines)
  const handleSoftSkillKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && softSkillInput.trim()) {
      e.preventDefault();

      // Split input by commas, newlines, or semicolons
      const newParts = softSkillInput
        .split(/[,;\n]+/)
        .map((v) => v.trim())
        .filter((v) => v);

      const updatedSoftSkills = [...formData.softSkills];
      newParts.forEach((part) => {
        if (!updatedSoftSkills.includes(part)) updatedSoftSkills.push(part);
      });

      setFormData({ ...formData, softSkills: updatedSoftSkills });
      setSoftSkillInput("");
    }
  };

  // Handle soft skill paste
  const handleSoftSkillPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const newParts = pasted
      .split(/[,;\n]+/)
      .map((v) => v.trim())
      .filter((v) => v);

    const updatedSoftSkills = [...formData.softSkills];
    newParts.forEach((part) => {
      if (!updatedSoftSkills.includes(part)) updatedSoftSkills.push(part);
    });

    setFormData({ ...formData, softSkills: updatedSoftSkills });
    setSoftSkillInput("");
  };


  // Handle location field changes (nested object)
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        [name]: value,
      },
    });
  };

  // Handle isRemote change (boolean select)
  const handleIsRemoteChange = (e) => {
    // Convert the string value "true" or "false" from the select box back to a boolean
    setFormData({ ...formData, isRemote: e.target.value === "true" });
  };

  // Handle changes for a specific project field
  const handleProjectChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProjects = formData.projects.map((project, i) => {
      if (i === index) {
        return { ...project, [name]: value };
      }
      return project;
    });
    setFormData({ ...formData, projects: updatedProjects });
  };

  // Add a new project entry
  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        { title: "", description: "", link: "" },
      ],
    });
  };

  // Remove a project entry
  const removeProject = (index) => {
    const updatedProjects = formData.projects.filter((_, i) => i !== index);
    setFormData({ ...formData, projects: updatedProjects });
  };


  // Remove a tag
  const removeTag = (type, value) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((tag) => tag !== value),
    });
  };


  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const data = new FormData();

    // Append all fields with special handling for nested data
    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      // 1. Handle simple string arrays (skills, softSkills)
      if (key === "skills" || key === "softSkills") {
        value.forEach((item) => data.append(key, item));
        return;
      }

      // 2. Handle complex array of objects (projects) using indexed keys
      if (key === "projects" && Array.isArray(value)) {
        value.forEach((project, index) => {
          // Only append projects if they have at least a title
          if (project.title) {
            data.append(`projects[${index}][title]`, project.title);
            data.append(`projects[${index}][description]`, project.description);
            data.append(`projects[${index}][link]`, project.link);
          }
        });
        return;
      }

      // 3. Handle simple nested object (location) using indexed keys
      if (key === "location" && typeof value === "object" && !Array.isArray(value)) {
        data.append(`location[country]`, value.country);
        data.append(`location[city]`, value.city);
        return;
      }

      // 4. Handle boolean/files/strings (including isRemote)
      data.append(key, value);
    });

    try {
      // NOTE: Using the new endpoint from your Postman example
      const response = await apiClient.post("/talent/old", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Talent created successfully ✅");
      console.log("Response:", response.data);

      setFormData({
        name: "",
        images: null,
        email: "",
        phoneNumber: "",
        cohort: "",
        role: "",
        availability: "",
        portFolio: "",
        cv: "",
        briefSummary: "",
        educationSummary: "",
        skills: [],
        softSkills: [],
        projects: [{ title: "", description: "", link: "" }], // Reset with new fields
        location: { country: "", city: "" },
        isRemote: false,
      });
    } catch (error) {
      console.error("Error creating talent:", error);
      setMessage(
        error?.response?.data?.message || "❌ Failed to create talent. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-10">
      <Link
        to="/"
        className="inline-block mb-6 text-blue-600 hover:text-blue-800 font-semibold transition"
      >
        ← Back to Home
      </Link>
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Add New Talent
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-600">
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Profile Image */}
        <div>
          <label className="block text-sm font-semibold text-gray-600">
            Profile Image
          </label>
          <input
            type="file"
            name="images"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          {formData.images && (
            <img
              src={URL.createObjectURL(formData.images)}
              alt="Preview"
              className="h-24 w-24 object-cover rounded-full mt-2 border"
            />
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-600">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-600">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="+233..."
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Cohort */}
        <div>
          <label className="block text-sm font-semibold text-gray-600">
            Cohort
          </label>
          <input
            type="text"
            name="cohort"
            placeholder="e.g. Cohort 5"
            value={formData.cohort}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-semibold text-gray-600">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Select...</option>
            <option value="Frontend Developer">Frontend Developer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Mobile Developer">Mobile Developer</option>
            <option value="Product Designer">Product Designer</option>
            <option value="AI/ML Specialist">AI/ML Specialist</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Digital Marketer">Digital Marketer</option>
            <option value="Full-Stack Developer">Full-Stack Developer</option>
          </select>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-semibold text-gray-600">
            Availability
          </label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Select...</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Gig">Gig</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {/* Portfolio */}
        <div>
          <label className="block text-sm font-semibold text-gray-600">
            Portfolio Link
          </label>
          <input
            type="url"
            name="portFolio"
            placeholder="https://..."
            value={formData.portFolio}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* CV */}
        <div>
          <label className="block text-sm font-semibold text-gray-600">
            CV Link
          </label>
          <input
            type="url"
            name="cv"
            placeholder="https://..."
            value={formData.cv}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Brief Summary */}
        <div>
          <label className="block text-sm font-semibold text-gray-600">
            Brief Summary
          </label>
          <textarea
            name="briefSummary"
            placeholder="Tell us about the talent..."
            rows="4"
            value={formData.briefSummary}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
          ></textarea>
        </div>

        {/* Education Summary */}
        <div>
          <label className="block text-sm font-semibold text-gray-600">
            Education Summary
          </label>
          <textarea
            name="educationSummary"
            placeholder="Degree, institution, etc."
            rows="2"
            value={formData.educationSummary}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
          ></textarea>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-semibold text-gray-600">
            Skills <span className="text-gray-400"> (Add a "," or press Enter after typing a skill, and should be more than one skill)</span>
          </label>
          <div className="flex flex-wrap gap-2 border rounded-lg px-3 py-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeTag("skills", skill)}
                  className="text-blue-500 hover:text-red-500"
                >
                  ✕
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add skill..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              onPaste={handleSkillPaste}
              className="flex-1 outline-none"
            />
          </div>
        </div>

        {/* Soft Skills */}
        <div>
          <label className="block text-sm font-semibold text-gray-600">
            Soft Skills <span className="text-gray-400"> (Add a "," or press Enter after typing a skill, and should be more than one skill)</span>
          </label>
          <div className="flex flex-wrap gap-2 border rounded-lg px-3 py-2">
            {formData.softSkills.map((soft, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {soft}
                <button
                  type="button"
                  onClick={() => removeTag("softSkills", soft)}
                  className="text-green-500 hover:text-red-500"
                >
                  ✕
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add soft skill..."
              value={softSkillInput}
              onChange={(e) => setSoftSkillInput(e.target.value)}
              onKeyDown={handleSoftSkillKeyDown}
              onPaste={handleSoftSkillPaste}
              className="flex-1 outline-none"
            />
          </div>
        </div>


        {/* Location & Remote Status */}
        <h3 className="text-xl font-bold mb-3 pt-4 border-t mt-4 text-gray-800">
          Location & Remote Status
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Country
            </label>
            <input
              type="text"
              name="country"
              placeholder="e.g., Ghana"
              value={formData.location.country}
              onChange={handleLocationChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600">
              City
            </label>
            <input
              type="text"
              name="city"
              placeholder="e.g., Accra"
              value={formData.location.city}
              onChange={handleLocationChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Remote Available?
            </label>
            <select
              name="isRemote"
              // Convert boolean to string for the select value
              value={formData.isRemote.toString()}
              onChange={handleIsRemoteChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="false">No (On-site/Hybrid)</option>
              <option value="true">Yes (Fully Remote)</option>
            </select>
          </div>
        </div>


        {/* Projects Section */}
        <div>
          <h3 className="text-xl font-bold mb-3 pt-4 border-t mt-4 text-gray-800">
            Projects
          </h3>
          <div className="space-y-4">
            {formData.projects.map((project, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg bg-gray-50 relative"
              >
                {formData.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-lg leading-none"
                  >
                    ✕
                  </button>
                )}
                <p className="text-sm font-semibold mb-2 text-gray-700">
                  Project {index + 1}
                </p>
                {/* Project Title */}
                <div className="mb-2">
                  <label className="block text-sm font-medium">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={project.title}
                    onChange={(e) => handleProjectChange(index, e)}
                    placeholder="E-commerce Platform Redesign"
                    className="w-full border rounded-lg px-3 py-1 mt-1 outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                {/* Project Description */}
                <div className="mb-2">
                  <label className="block text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    rows="2"
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, e)}
                    placeholder="Developed a full-stack e-commerce site..."
                    className="w-full border rounded-lg px-3 py-1 mt-1 resize-none outline-none focus:ring-1 focus:ring-blue-400"
                  ></textarea>
                </div>
                {/* Project Link */}
                <div>
                  <label className="block text-sm font-medium">Link</label>
                  <input
                    type="url"
                    name="link"
                    value={project.link}
                    onChange={(e) => handleProjectChange(index, e)}
                    placeholder="https://github.com/..."
                    className="w-full border rounded-lg px-3 py-1 mt-1 outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addProject}
            className="mt-2 w-full border border-[#28BBBB] text-[#28BBBB] py-2 rounded-lg hover:bg-[#28BBBB]/10 transition font-semibold"
          >
            + Add Another Project
          </button>
        </div>


        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#28BBBB] hover:bg-[#42a0a0] text-white py-2 rounded-lg transition duration-300 disabled:bg-gray-400"
        >
          {loading ? "Submitting..." : "Create Talent"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <p
          className={`text-center mt-4 font-semibold ${message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}