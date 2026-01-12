import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { FaExternalLinkAlt, FaEdit, FaTrash } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

const AdminPortfolioView = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [imageFiles, setImageFiles] = useState({});
  const [imageNames, setImageNames] = useState({});
  const [uploadingId, setUploadingId] = useState(null);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [costFilter, setCostFilter] = useState("All");
  const [hostingFilter, setHostingFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    skills: [],
    projectLink: "",
    githubLink: "",
    projectType: "",
    description: "",
    cost: "Free",
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);

  const fetchProjects = () => {
    fetch(`${API_BASE}/api/admin/projects`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setProjects(list);
        setPage(1);
      })
      .catch(() => toast.error("Failed to fetch projects"));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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

  const handleImageSelect = (projectId, file) => {
    setImageFiles((prev) => ({ ...prev, [projectId]: file || null }));
    setImageNames((prev) => ({
      ...prev,
      [projectId]: file?.name || "No file selected.",
    }));
  };

  const handleImageUpload = async (project) => {
    const file = imageFiles[project._id];
    if (!file) {
      toast.error("Please choose an image");
      return;
    }
    try {
      setUploadingId(project._id);
      const imageUrl = await uploadImage(file);
      const res = await fetch(`${API_BASE}/api/admin/projects/${project._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({
          title: project.title,
          imageUrl,
          projectLink: project.projectLink || "",
          githubLink: project.githubLink || "",
          projectType: project.projectType || "Minor",
          skills: Array.isArray(project.skills) ? project.skills : [],
          cost: project.cost || "Free",
          description: project.description || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating image");
      setProjects((prev) => prev.map((p) => (p._id === data._id ? data : p)));
      setImageFiles((prev) => ({ ...prev, [project._id]: null }));
      setImageNames((prev) => ({ ...prev, [project._id]: "No file selected." }));
      toast.success("Image updated");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this project?");
    if (!ok) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error deleting project");
      toast.success("Project deleted");
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.message || "Server error");
    }
  };

  const openEdit = (project) => {
    setEditing(project);
    setEditForm({
      title: project.title || "",
      skills: Array.isArray(project.skills) ? project.skills : [],
      projectLink: project.projectLink || "",
      githubLink: project.githubLink || "",
      projectType: project.projectType || "Minor",
      description: project.description || "",
      cost: project.cost || "Free",
      imageUrl: project.imageUrl || "",
    });
    setIsEditOpen(true);
    setSkillsOpen(false);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditing(null);
    setSkillsOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSkill = (skillName) => {
    setEditForm((prev) => {
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
    setEditForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillName),
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editing?._id) return;
    if (!editForm.title.trim()) {
      toast.error("Project name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/projects/${editing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({
          ...editForm,
          projectType: editForm.projectType || "Minor",
          cost: editForm.cost || "Free",
          imageUrl: editForm.imageUrl || editing?.imageUrl || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating project");
      setProjects((prev) => prev.map((p) => (p._id === data._id ? data : p)));
      toast.success("Project updated");
      closeEdit();
    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setSaving(false);
    }
  };

  const matchesFilters = (project) => {
    const title = (project.title || "").toLowerCase();
    const searchOk = !search || title.includes(search.toLowerCase());
    const skillsList = Array.isArray(project.skills) ? project.skills : [];
    const skillOk = skillFilter === "All" || skillsList.includes(skillFilter);
    const typeOk =
      typeFilter === "All" ||
      (project.projectType || "").toLowerCase() === typeFilter.toLowerCase();
    const costOk =
      costFilter === "All" ||
      (project.cost || "").toLowerCase() === costFilter.toLowerCase();
    const hosting = project.projectLink ? "Hosted" : "Self Hosted";
    const hostingOk = hostingFilter === "All" || hosting === hostingFilter;
    return searchOk && skillOk && typeOk && costOk && hostingOk;
  };

  const sortedProjects = [...projects]
    .filter(matchesFilters)
    .sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      return sortOrder === "oldest" ? aTime - bTime : bTime - aTime;
    });

  const totalPages = Math.max(1, Math.ceil(sortedProjects.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedProjects = sortedProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-[#0b1222] text-white flex">
      <Toaster position="top-right" theme="dark" richColors />
      <AdminSidebar />

      <main className="flex-1 md:ml-64 mt-16 md:mt-0 p-6 md:p-10 transition-all duration-300">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-emerald-200">Portfolio</h1>
            <p className="text-sm text-emerald-100/70 mt-1">
              Add new projects to your portfolio. you can edit, view or remove the data.
            </p>
          </div>
          <div className="text-sm text-emerald-200/70">
            <span className="text-emerald-300">Dashboard</span> <span className="mx-2">/</span>{" "}
            Portfolio <span className="mx-2">/</span> View Data
          </div>
        </div>

        <section className="mt-8">
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
            <div className="xl:col-span-2">
              <label className="block text-sm text-emerald-100/80 mb-1">Search</label>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by project name"
                className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-emerald-100/80 mb-1">Skill</label>
              <select
                value={skillFilter}
                onChange={(e) => {
                  setSkillFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
              >
                <option value="All">All</option>
                {skills.map((skill) => (
                  <option key={skill._id} value={skill.name}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-emerald-100/80 mb-1">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
              >
                <option value="All">All</option>
                <option value="Academic">Academic</option>
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-emerald-100/80 mb-1">Cost</label>
              <select
                value={costFilter}
                onChange={(e) => {
                  setCostFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
              >
                <option value="All">All</option>
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-emerald-100/80 mb-1">Hosting</label>
              <select
                value={hostingFilter}
                onChange={(e) => {
                  setHostingFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
              >
                <option value="All">All</option>
                <option value="Hosted">Hosted</option>
                <option value="Self Hosted">Self Hosted</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-emerald-100/80 mb-1">Sort By</label>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSkillFilter("All");
                  setTypeFilter("All");
                  setCostFilter("All");
                  setHostingFilter("All");
                  setSortOrder("newest");
                  setPage(1);
                }}
                className="w-full px-4 py-2 rounded-md border border-emerald-400/30 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pagedProjects.map((project) => {
              const hostedLabel = project.projectLink ? "Hosted" : "Self Hosted";
              const typeLabel = (project.projectType || "Minor").toLowerCase();
              const created = project.createdAt
                ? new Date(project.createdAt).toLocaleDateString()
                : "—";
              return (
                <article
                  key={project._id}
                  className="rounded-2xl border border-emerald-400/20 bg-[#0f172a] p-5 shadow-[0_0_25px_rgba(16,185,129,0.2)]"
                >
                  <h2 className="text-lg font-semibold text-emerald-100">{project.title}</h2>

                  <div className="mt-4 flex flex-col md:flex-row gap-4">
                    <div className="w-28 h-20 rounded-md border border-emerald-400/20 bg-emerald-500/10 overflow-hidden flex items-center justify-center">
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-emerald-100/60">No image</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="text-sm text-emerald-100/80">Update Image</div>
                      <div className="mt-2 flex items-center border border-emerald-400/20 rounded-md overflow-hidden bg-[#0b1220]">
                        <label
                          htmlFor={`image-${project._id}`}
                          className="px-4 py-2 bg-emerald-500/20 text-emerald-100 border-r border-emerald-400/20 cursor-pointer"
                        >
                          Browse...
                        </label>
                        <input
                          id={`image-${project._id}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            handleImageSelect(project._id, file);
                          }}
                        />
                        <span className="flex-1 px-4 py-2 text-sm text-emerald-100/70">
                          {imageNames[project._id] || "No file selected."}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleImageUpload(project)}
                          className="px-4 py-2 bg-emerald-500/80 text-white disabled:opacity-60"
                          disabled={uploadingId === project._id}
                        >
                          {uploadingId === project._id ? "Uploading..." : "Upload"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-emerald-100/80">
                    Skills:{" "}
                    {(project.skills || []).length ? (
                      <span className="inline-flex flex-wrap gap-2">
                        {project.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="text-emerald-100/60">—</span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-emerald-100/80">
                    <span>
                      Type:{" "}
                      <span className="px-2 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs">
                        #{typeLabel}
                      </span>
                    </span>
                    <span>
                      Hosting:{" "}
                      <span className="px-2 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs">
                        {hostedLabel}
                      </span>
                    </span>
                    <span>
                      Cost:{" "}
                      <span className="px-2 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs">
                        {project.cost || "Free"}
                      </span>
                    </span>
                    <span>
                      Date:{" "}
                      <span className="px-2 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs">
                        {created}
                      </span>
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {project.projectLink ? (
                      <a
                        href={project.projectLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-500/80 text-white"
                      >
                        <FaExternalLinkAlt /> Visit
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-500/40 text-white/70 cursor-not-allowed"
                        disabled
                      >
                        <FaExternalLinkAlt /> Visit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openEdit(project)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-yellow-400 text-black"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(project._id)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-500/90 text-white"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          {sortedProjects.length === 0 && (
            <div className="mt-6 text-center text-emerald-100/60">
              No projects found.
            </div>
          )}
          {sortedProjects.length > pageSize && (
            <div className="mt-6 flex items-center justify-between text-xs text-emerald-100/70">
              <span>
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, sortedProjects.length)} of{" "}
                {sortedProjects.length} projects
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md bg-emerald-500/20 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 rounded-md bg-[#0b1220] border border-emerald-400/20">
                  {currentPage}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1 rounded-md bg-emerald-500/20 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-2xl rounded-2xl border border-emerald-400/20 bg-[#0f172a] shadow-[0_0_35px_rgba(15,23,42,0.8)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-400/15">
              <h3 className="text-lg font-semibold text-emerald-100">Edit Project</h3>
              <button
                type="button"
                onClick={closeEdit}
                className="h-8 w-8 rounded-full text-emerald-100/80 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdate} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm text-emerald-100/90 mb-1">Project Name</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                />
              </div>
              <div className="relative">
                <label className="block text-sm text-emerald-100/90 mb-1">Skills used</label>
                <button
                  type="button"
                  onClick={() => setSkillsOpen((prev) => !prev)}
                  className="w-full min-h-[48px] bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-left text-emerald-100 focus:border-emerald-300 outline-none"
                >
                  {editForm.skills.length ? "Selected skills" : "Choose skills"}
                </button>
                {skillsOpen && (
                  <div className="absolute z-20 mt-2 w-full rounded-md border border-emerald-400/20 bg-[#0b1220] shadow-[0_0_20px_rgba(16,185,129,0.15)] max-h-56 overflow-y-auto">
                    {skills.length === 0 && (
                      <div className="px-4 py-3 text-sm text-emerald-100/60">No skills found</div>
                    )}
                    {skills.map((skill) => {
                      const checked = editForm.skills.includes(skill.name);
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
                {editForm.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {editForm.skills.map((skill) => (
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
                  value={editForm.projectLink}
                  onChange={handleEditChange}
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-emerald-100/90 mb-1">Github Link</label>
                <input
                  type="url"
                  name="githubLink"
                  value={editForm.githubLink}
                  onChange={handleEditChange}
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-emerald-100/90 mb-1">
                    Project Type Choose Project Type
                  </label>
                  <select
                    name="projectType"
                    value={editForm.projectType}
                    onChange={handleEditChange}
                    className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-emerald-100/90 mb-1">Cost</label>
                  <select
                    name="cost"
                    value={editForm.cost}
                    onChange={handleEditChange}
                    className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                  >
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-emerald-200/70 mb-2">
                  Description of your project
                </label>
                <textarea
                  rows="4"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-3 text-emerald-100 focus:border-emerald-300 outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-emerald-400/10 pt-4">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-5 py-2 rounded-md bg-slate-500/70 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-md bg-gradient-to-r from-emerald-500 to-green-500 text-white disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortfolioView;
