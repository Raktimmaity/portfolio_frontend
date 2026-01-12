import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

const emptyForm = {
  title: "",
  imageUrl: "",
  projectLink: "",
  githubLink: "",
  projectType: "",
  skills: [],
  cost: "Free",
  description: "",
};

const AdminPortfolioAdd = () => {
  const [form, setForm] = useState(emptyForm);
  const [skills, setSkills] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("No file selected.");
  const [saving, setSaving] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/skills`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setSkills(list);
      })
      .catch(() => toast.error("Failed to fetch skills"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSkill = (skillName) => {
    setForm((prev) => {
      const exists = prev.skills.includes(skillName);
      return {
        ...prev,
        skills: exists
          ? prev.skills.filter((s) => s !== skillName)
          : [...prev.skills, skillName],
      };
    });
  };

  const removeSkill = (skillName) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillName),
    }));
  };

  const getImageSize = (file) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Invalid image"));
      };
      img.src = url;
    });

  const uploadImage = async (file) => {
    if (!file) throw new Error("Please choose an image");
    if (!CLOUD_NAME || !UPLOAD_PRESET) throw new Error("Missing Cloudinary config");
    if (file.size > 2 * 1024 * 1024) throw new Error("Max file size is 2MB");

    await getImageSize(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Upload failed");
    const uploadedUrl = data.secure_url || data.url || "";
    if (!uploadedUrl) throw new Error("Upload did not return an image URL");
    return uploadedUrl;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Project name is required");
      return;
    }
    setSaving(true);
    try {
      let imageUrl = form.imageUrl || "";
      if (!imageUrl && imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const res = await fetch(`${API_BASE}/api/admin/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ ...form, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error saving project");
      toast.success("Project added");
      setForm(emptyForm);
      setImageFile(null);
      setImageName("No file selected.");
    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1222] text-white flex">
      <Toaster position="top-right" theme="dark" richColors />
      <AdminSidebar />

      <main className="flex-1 md:ml-64 mt-16 md:mt-0 p-6 md:p-10 transition-all duration-300">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-emerald-200">
              Add to Portfolio
            </h1>
            <p className="text-sm text-emerald-100/70 mt-1">
              You can easily add the projects.
            </p>
          </div>
          <div className="text-sm text-emerald-200/70">
            <span className="text-emerald-300">Dashboard</span> <span className="mx-2">/</span>{" "}
            Portfolio <span className="mx-2">/</span> Add to Portfolio
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-emerald-400/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-emerald-100/90 mb-1">
                  Project image{" "}
                  <span className="text-xs text-emerald-100/60">
                    (Maximum size should be 2MB)
                  </span>
                </label>
                <div className="flex items-center border border-emerald-400/20 rounded-md overflow-hidden bg-[#0b1220]">
                  <label
                    htmlFor="project-image"
                    className="px-4 py-2 bg-emerald-500/20 text-emerald-100 cursor-pointer border-r border-emerald-400/20"
                  >
                    Browse...
                  </label>
                  <input
                    id="project-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const selected = e.target.files?.[0] || null;
                      setImageFile(selected);
                      setImageName(selected?.name || "No file selected.");
                    }}
                  />
                  <span className="flex-1 px-4 py-2 text-sm text-emerald-100/70">
                    {imageName}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-emerald-100/90 mb-1">Project Name</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter your Project name"
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="relative">
                <label className="block text-sm text-emerald-100/90 mb-1">
                  Skills used in the project
                </label>
                <button
                  type="button"
                  onClick={() => setSkillsOpen((prev) => !prev)}
                  className="w-full min-h-[48px] bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-left text-emerald-100 focus:border-emerald-300 outline-none"
                >
                  {form.skills.length ? "Selected skills" : "Choose skills"}
                </button>
                {skillsOpen && (
                  <div className="absolute z-20 mt-2 w-full rounded-md border border-emerald-400/20 bg-[#0b1220] shadow-[0_0_20px_rgba(16,185,129,0.15)] max-h-56 overflow-y-auto">
                    {skills.length === 0 && (
                      <div className="px-4 py-3 text-sm text-emerald-100/60">No skills found</div>
                    )}
                    {skills.map((skill) => {
                      const checked = form.skills.includes(skill.name);
                      return (
                        <label
                          key={skill._id}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-emerald-100/90 hover:bg-emerald-500/10 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSkill(skill.name)}
                            className="accent-emerald-400"
                          />
                          {skill.name}
                        </label>
                      );
                    })}
                  </div>
                )}
                {form.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {form.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs text-emerald-100"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-emerald-100/80 hover:text-white"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-emerald-100/90 mb-1">Project Link</label>
                <input
                  type="url"
                  name="projectLink"
                  value={form.projectLink}
                  onChange={handleChange}
                  placeholder="Enter your project URL"
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-emerald-100/90 mb-1">GitHub Link</label>
                <input
                  type="url"
                  name="githubLink"
                  value={form.githubLink}
                  onChange={handleChange}
                  placeholder="Enter your github link"
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-emerald-100/90 mb-1">
                  Choose Project Type
                </label>
                <select
                  name="projectType"
                  value={form.projectType}
                  onChange={handleChange}
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                >
                  <option value="">Choose...</option>
                  <option value="Academic">Academic</option>
                  <option value="Major">Major</option>
                  <option value="Minor">Minor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-emerald-100/90 mb-1">Cost</label>
                <select
                  name="cost"
                  value={form.cost}
                  onChange={handleChange}
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                >
                  <option value="Free">Free</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <div />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-emerald-200/70 mb-2">
                Description of the project
              </label>
              <textarea
                rows="4"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter your project description"
                className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-3 text-emerald-100 focus:border-emerald-300 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 text-white font-medium shadow-[0_0_18px_rgba(16,185,129,0.5)] hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Add to Portfolio"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AdminPortfolioAdd;
