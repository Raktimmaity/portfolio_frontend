import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

const emptyForm = { name: "", imageUrl: "", percentage: 0 };

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("No file selected.");
  const [imageUploading, setImageUploading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const fetchSkills = () => {
    fetch(`${API_BASE}/api/admin/skills`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setSkills(list);
        setPage(1);
      })
      .catch(() => toast.error("Failed to fetch skills"));
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (showModal) {
      const id = requestAnimationFrame(() => setModalVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setModalVisible(false);
  }, [showModal]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setImageName("No file selected.");
    setShowModal(true);
  };

  const openEdit = (skill) => {
    setEditing(skill);
    setForm({
      name: skill.name || "",
      imageUrl: skill.imageUrl || "",
      percentage: skill.percentage || 0,
    });
    setImageFile(null);
    setImageName("No file selected.");
    setShowModal(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => {
      setShowModal(false);
      setEditing(null);
      setForm(emptyForm);
      setImageFile(null);
      setImageName("No file selected.");
    }, 200);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "percentage" ? Number(value) : value,
    }));
  };

  const uploadImage = async (file) => {
    if (!file) throw new Error("Please choose an image");
    if (!CLOUD_NAME || !UPLOAD_PRESET) throw new Error("Missing Cloudinary config");

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

  const handleImageUpload = async () => {
    try {
      setImageUploading(true);
      const uploadedUrl = await uploadImage(imageFile);
      setForm((prev) => ({ ...prev, imageUrl: uploadedUrl }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Skill name is required");
      return;
    }
    setSaving(true);
    try {
      let imageUrl = form.imageUrl || "";
      if (!imageUrl && imageFile) {
        imageUrl = await uploadImage(imageFile);
        setForm((prev) => ({ ...prev, imageUrl }));
      }
      const url = editing
        ? `${API_BASE}/api/admin/skills/${editing._id}`
        : `${API_BASE}/api/admin/skills`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ ...form, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error saving skill");
      toast.success(editing ? "Skill updated" : "Skill added");
      closeModal();
      fetchSkills();
    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (skillId) => {
    const ok = window.confirm("Delete this skill?");
    if (!ok) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/skills/${skillId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error deleting skill");
      toast.success("Skill deleted");
      setSkills((prev) => prev.filter((s) => s._id !== skillId));
    } catch (err) {
      toast.error(err.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1222] text-white flex">
      <Toaster position="top-right" theme="dark" richColors />
      <AdminSidebar />

      <main className="flex-1 md:ml-64 mt-16 md:mt-0 p-6 md:p-10 transition-all duration-300">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
              Skills
            </h1>
            <p className="text-sm text-cyan-100/70 mt-1">Add, Remove or Edit your preferred skills</p>
          </div>
          <div className="text-sm text-cyan-200/70">
            <span className="text-cyan-300">Dashboard</span> <span className="mx-2">/</span> Skills
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-cyan-400/15 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-cyan-100">Your Skills</h2>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-500/90 hover:bg-emerald-400 text-black font-medium shadow-[0_0_18px_rgba(16,185,129,0.6)]"
            >
              <FaPlus /> Add New
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-cyan-100/80 border-b border-cyan-400/20">
                <tr>
                  <th className="py-3 px-2 w-16">Sl. No.</th>
                  <th className="py-3 px-2 w-20">Image</th>
                  <th className="py-3 px-2">Skill</th>
                  <th className="py-3 px-2">Skill Expertise</th>
                  <th className="py-3 px-2 w-28">Percentage</th>
                  <th className="py-3 px-2 w-32">Action</th>
                </tr>
              </thead>
              <tbody className="text-cyan-100/90">
                {skills.slice((page - 1) * pageSize, page * pageSize).map((skill, index) => (
                  <tr key={skill._id} className="border-b border-cyan-400/10">
                    <td className="py-4 px-2">{(page - 1) * pageSize + index + 1}</td>
                    <td className="py-4 px-2">
                      <div className="h-12 w-12 rounded-full bg-[#0b1220] border border-cyan-400/20 flex items-center justify-center overflow-hidden">
                        {skill.imageUrl ? (
                          <img src={skill.imageUrl} alt={skill.name} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs text-cyan-100">IMG</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2">{skill.name}</td>
                    <td className="py-4 px-2">
                      <div className="w-full max-w-[300px] h-2 rounded-full bg-white/20 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                          style={{ width: `${skill.percentage || 0}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="px-3 py-1 rounded-md bg-white/10">{skill.percentage || 0}%</span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(skill)}
                          className="h-9 w-9 rounded-full bg-blue-500/80 hover:bg-blue-400 text-white flex items-center justify-center"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(skill._id)}
                          className="h-9 w-9 rounded-md bg-red-500/90 hover:bg-red-400 text-white flex items-center justify-center"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {skills.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-cyan-100/60">
                      No skills added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {skills.length > pageSize && (
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="text-sm text-cyan-100/70">
                Page {page} of {Math.ceil(skills.length / pageSize)}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(Math.ceil(skills.length / pageSize), p + 1))}
                disabled={page >= Math.ceil(skills.length / pageSize)}
                className="px-4 py-2 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>

      {showModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
            modalVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`w-full max-w-xl rounded-2xl bg-[#0f172a] border border-emerald-400/20 shadow-[0_0_35px_rgba(16,185,129,0.25)] transition-all duration-200 ${
              modalVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
            }`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-400/15">
              <h3 className="text-lg font-semibold text-emerald-100">
                {editing ? "Edit Skill" : "Add Skill"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-emerald-200/70 hover:text-emerald-100"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm text-emerald-100/80 mb-2">Update Image</label>
                <div className="flex flex-col md:flex-row md:items-center bg-[#0b1220] border border-emerald-400/20 rounded-md overflow-hidden">
                  <label className="px-4 py-2 bg-emerald-500/20 text-emerald-100 cursor-pointer">
                    Browse...
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const selected = e.target.files?.[0] || null;
                        setImageFile(selected);
                        setImageName(selected?.name || "No file selected.");
                      }}
                    />
                  </label>
                  <span className="flex-1 px-4 py-2 text-sm text-emerald-100/70">{imageName}</span>
                  <button
                    type="button"
                    disabled={imageUploading}
                    onClick={handleImageUpload}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium shadow-[0_0_18px_rgba(16,185,129,0.6)] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {imageUploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-emerald-100/80 mb-1">Skill Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 outline-none focus:border-emerald-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-emerald-100/80 mb-1">Expertise</label>
                  <input
                    type="number"
                    name="percentage"
                    min="0"
                    max="100"
                    value={form.percentage}
                    onChange={handleChange}
                    className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 outline-none focus:border-emerald-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-medium shadow-[0_0_18px_rgba(16,185,129,0.6)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : editing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSkills;
