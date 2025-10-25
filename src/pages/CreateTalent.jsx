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
  });

  const [skillInput, setSkillInput] = useState("");
  const [softSkillInput, setSoftSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Handle normal input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, images: file });
    }
  };

  // ✅ Handle skill addition
  const handleSkillKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({
          ...formData,
          skills: [...formData.skills, skillInput.trim()],
        });
      }
      setSkillInput("");
    }
  };

  // ✅ Handle soft skill addition
  const handleSoftSkillKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && softSkillInput.trim()) {
      e.preventDefault();
      if (!formData.softSkills.includes(softSkillInput.trim())) {
        setFormData({
          ...formData,
          softSkills: [...formData.softSkills, softSkillInput.trim()],
        });
      }
      setSoftSkillInput("");
    }
  };

  // ✅ Remove a tag
  const removeTag = (type, value) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((tag) => tag !== value),
    });
  };

  // ✅ Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const data = new FormData();

    // Append all fields correctly
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => data.append(key, item)); // backend expects arrays
      } else {
        data.append(key, value);
      }
    });

    try {
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
            Skills <span className="text-gray-400"> (Press Enter after typing a skill, and should be more than one skill)</span>
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
              className="flex-1 outline-none"
            />
          </div>
        </div>

        {/* Soft Skills */}
        <div>
          <label className="block text-sm font-semibold text-gray-600">
            Soft Skills <span className="text-gray-400"> (Press Enter after typing a skill, and should be more than one skill)</span>
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
              className="flex-1 outline-none"
            />
          </div>
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
