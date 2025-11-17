import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiClient } from "../../api/client";

export default function EditTalentProfileModal({
  isOpen,
  onClose,
  talent,
  onUpdateSuccess,
}) {
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
    projects: [], // ADDED
    location: { country: "", city: "" }, // ADDED
    isRemote: false,
  });

  const [skillInput, setSkillInput] = useState("");
  const [softSkillInput, setSoftSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Populate the form with the talent’s existing details
  useEffect(() => {
    if (talent) {
      setFormData({
        name: talent.name || "",
        email: talent.email || "",
        phoneNumber: talent.phoneNumber || "",
        cohort: talent.cohort || "",
        role: talent.role || "",
        availability: talent.availability || "",
        portFolio: talent.portFolio || "",
        cv: talent.cv || "",
        briefSummary: talent.briefSummary || "",
        educationSummary: talent.educationSummary || "",
        skills: Array.isArray(talent.skills) ? talent.skills : [],
        softSkills: Array.isArray(talent.softSkills) ? talent.softSkills : [],
        images: talent.images?.[0] || "", // store existing URL for backend
        projects: Array.isArray(talent.projects) ? talent.projects : [], // 👈 ADDED
        location: talent.location || { country: "", city: "" }, // 👈 ADDED
        isRemote: talent.isRemote || false, // 👈 ADDED
      });
    }
  }, [talent]);


  if (!isOpen || !talent) return null;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle skills & soft skills
  const handleKeyDown = (type, e, inputValue, setInputValue) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      const parts = inputValue.split(/[,;\n]+/).map((v) => v.trim()).filter((v) => v);
      const updated = [...formData[type]];
      parts.forEach((p) => {
        if (!updated.includes(p)) updated.push(p);
      });
      setFormData({ ...formData, [type]: updated });
      setInputValue("");
    }
  };

  const removeTag = (type, value) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((tag) => tag !== value),
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFormData({ ...formData, images: file });
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

  // Handle isRemote change (boolean checkbox/select)
  const handleIsRemoteChange = (e) => {
    setFormData({ ...formData, isRemote: e.target.value === "true" });
  };

  // Handle changes for a specific project field (nested array of objects)
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

  // Handle update submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();

      // Append all fields correctly
      Object.entries(formData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        // Handle image File/URL
        if (key === "images") {
          if (value instanceof File) {
            data.append("images", value);
          } else if (typeof value === "string" && value.trim() !== "") {
            data.append("images", value);
          }
          return;
        }

        // Handle simple string arrays (skills, softSkills) by appending each element
        if (key === "skills" || key === "softSkills") {
          (value).forEach((item) => {
            data.append(key, item);
          });
          return;
        }

        // Handle complex array of objects (projects)
        if (key === "projects" && Array.isArray(value)) {
          // Loop through each project object and append its properties
          value.forEach((project, index) => {
            data.append(`projects[${index}][title]`, project.title);
            data.append(`projects[${index}][description]`, project.description);
            data.append(`projects[${index}][link]`, project.link);
          });
          return;
        }

        // Handle simple nested object (location) - stringify is usually best for objects in form-data
        if (key === "location" && typeof value === "object" && !Array.isArray(value)) {
          data.append(key, JSON.stringify(value));
          return;
        }


        // Handle all other fields (strings, numbers, booleans)
        data.append(key, value);
      });

      await apiClient.put(`/portfolio/update-new/${talent._id || talent.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Talent updated successfully!");
      onUpdateSuccess?.(); // refresh the main page list
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      console.error("Update error:", err);
      setMessage("❌ Failed to update talent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Edit Talent</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold">Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          {/* File Upload */}
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
            {formData.images ? (
              typeof formData.images === "string" ? (
                // Existing image (string URL)
                <img
                  src={formData.images}
                  alt="Current Profile"
                  className="h-24 w-24 object-cover rounded-full mt-2 border"
                />
              ) : (
                // Newly selected file
                <img
                  src={URL.createObjectURL(formData.images)}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded-full mt-2 border"
                />
              )
            ) : null}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
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
            <label className="block text-sm font-semibold">Portfolio Link</label>
            <input
              type="url"
              name="portFolio"
              value={formData.portFolio}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* CV */}
          <div>
            <label className="block text-sm font-semibold">CV</label>
            <input
              type="url"
              name="cv"
              value={formData.cv}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* Brief Summary */}
          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Brief Summary
            </label>
            <textarea
              name="briefSummary"
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
            <label className="block text-sm font-semibold">Skills</label>
            <div className="flex flex-wrap gap-2 border rounded-lg p-2">
              {formData.skills.map((skill, i) => (
                <span key={i} className="bg-blue-100 px-2 py-1 rounded-full">
                  {skill}
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() => removeTag("skills", skill)}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) =>
                  handleKeyDown("skills", e, skillInput, setSkillInput)
                }
                className="flex-1 outline-none"
                placeholder="Add skill..."
              />
            </div>
          </div>

          {/* Soft Skills */}
          <div>
            <label className="block text-sm font-semibold">Soft Skills</label>
            <div className="flex flex-wrap gap-2 border rounded-lg p-2">
              {formData.softSkills.map((skill, i) => (
                <span key={i} className="bg-green-100 px-2 py-1 rounded-full">
                  {skill}
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() => removeTag("softSkills", skill)}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                value={softSkillInput}
                onChange={(e) => setSoftSkillInput(e.target.value)}
                onKeyDown={(e) =>
                  handleKeyDown("softSkills", e, softSkillInput, setSoftSkillInput)
                }
                className="flex-1 outline-none"
                placeholder="Add soft skill..."
              />
            </div>
          </div>


          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Country
              </label>
              <input
                type="text"
                name="country"
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
                value={formData.location.city}
                onChange={handleLocationChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          {/* Is Remote */}
          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Available for Remote Work?
            </label>
            <select
              name="isRemote"
              value={formData.isRemote.toString()} // Convert boolean to string for select value
              onChange={handleIsRemoteChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>


          {/* Projects */}
          <div>
            <h3 className="text-md font-bold mb-2 pt-4 border-t mt-4">
              Projects
            </h3>
            <div className="space-y-4">
              {formData.projects.map((project, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-lg bg-gray-50 relative"
                >
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                  {/* Project Title */}
                  <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={project.title}
                      onChange={(e) => handleProjectChange(index, e)}
                      className="w-full border rounded-lg px-3 py-1 mt-1"
                    />
                  </div>
                  {/* Project Description */}
                  <div className="mt-2">
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                      name="description"
                      rows="2"
                      value={project.description}
                      onChange={(e) => handleProjectChange(index, e)}
                      className="w-full border rounded-lg px-3 py-1 mt-1 resize-none"
                    ></textarea>
                  </div>
                  {/* Project Link */}
                  <div className="mt-2">
                    <label className="block text-sm font-medium">Link</label>
                    <input
                      type="url"
                      name="link"
                      value={project.link}
                      onChange={(e) => handleProjectChange(index, e)}
                      className="w-full border rounded-lg px-3 py-1 mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addProject}
              className="mt-2 w-full border border-[#28BBBB] text-[#28BBBB] py-2 rounded-lg hover:bg-[#28BBBB]/10 transition"
            >
              + Add New Project
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#28BBBB] text-white py-2 rounded-lg"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {message && (
            <p
              className={`text-center mt-2 font-medium ${message.includes("✅") ? "text-green-600" : "text-red-600"
                }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}