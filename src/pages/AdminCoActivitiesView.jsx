import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

const AdminCoActivitiesView = () => {
  const [items, setItems] = useState([]);
  const [imageFiles, setImageFiles] = useState({});
  const [imageNames, setImageNames] = useState({});
  const [uploadingId, setUploadingId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", date: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/co-activities`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to fetch co-activities"));
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

  const handleImageSelect = (itemId, file) => {
    setImageFiles((prev) => ({ ...prev, [itemId]: file || null }));
    setImageNames((prev) => ({ ...prev, [itemId]: file?.name || "No file selected." }));
  };

  const handleImageUpload = async (item) => {
    const file = imageFiles[item._id];
    if (!file) {
      toast.error("Please choose an image");
      return;
    }
    try {
      setUploadingId(item._id);
      const imageUrl = await uploadImage(file);
      const res = await fetch(`${API_BASE}/api/admin/co-activities/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({
          title: item.title,
          imageUrl,
          date: item.date || "",
          description: item.description || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating image");
      setItems((prev) => prev.map((p) => (p._id === data._id ? data : p)));
      setImageFiles((prev) => ({ ...prev, [item._id]: null }));
      setImageNames((prev) => ({ ...prev, [item._id]: "No file selected." }));
      toast.success("Image updated");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  const openEdit = (item) => {
    setEditing(item);
    setEditForm({
      title: item.title || "",
      date: item.date || "",
      description: item.description || "",
    });
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditing(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editing?._id) return;
    if (!editForm.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/co-activities/${editing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({
          ...editForm,
          imageUrl: editing.imageUrl || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating co-activity");
      setItems((prev) => prev.map((p) => (p._id === data._id ? data : p)));
      toast.success("Co-Activity updated");
      closeEdit();
    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this co-activity?");
    if (!ok) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/co-activities/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error deleting co-activity");
      toast.success("Co-Activity deleted");
      setItems((prev) => prev.filter((p) => p._id !== id));
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
            <h1 className="text-3xl md:text-4xl font-semibold text-emerald-200">
              Co-Activities
            </h1>
            <p className="text-sm text-emerald-100/70 mt-1">
              View and manage your co-activities.
            </p>
          </div>
          <div className="text-sm text-emerald-200/70">
            <span className="text-emerald-300">Dashboard</span> <span className="mx-2">/</span>{" "}
            Activities <span className="mx-2">/</span> Co-Activities{" "}
            <span className="mx-2">/</span> View Data
          </div>
        </div>

        <section className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {items.map((item) => (
              <article
                key={item._id}
                className="rounded-2xl border border-emerald-400/20 bg-[#0f172a] p-5 shadow-[0_0_25px_rgba(16,185,129,0.2)]"
              >
                <h2 className="text-lg font-semibold text-emerald-100">{item.title}</h2>

                <div className="mt-4 flex flex-col md:flex-row gap-4">
                  <div className="w-28 h-20 rounded-md border border-emerald-400/20 bg-emerald-500/10 overflow-hidden flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
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
                        htmlFor={`co-image-${item._id}`}
                        className="px-4 py-2 bg-emerald-500/20 text-emerald-100 border-r border-emerald-400/20 cursor-pointer"
                      >
                        Browse...
                      </label>
                      <input
                        id={`co-image-${item._id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleImageSelect(item._id, file);
                        }}
                      />
                      <span className="flex-1 px-4 py-2 text-sm text-emerald-100/70">
                        {imageNames[item._id] || "No file selected."}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleImageUpload(item)}
                        className="px-4 py-2 bg-emerald-500/80 text-white disabled:opacity-60"
                        disabled={uploadingId === item._id}
                      >
                        {uploadingId === item._id ? "Uploading..." : "Upload"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-emerald-100/80">
                  Date:{" "}
                  <span className="px-2 py-1 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs">
                    {item.date || "—"}
                  </span>
                </div>

                {item.description && (
                  <p className="mt-3 text-sm text-emerald-100/80">{item.description}</p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-yellow-400 text-black"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-500/90 text-white"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
          {items.length === 0 && (
            <div className="mt-6 text-center text-emerald-100/60">
              No co-activities found.
            </div>
          )}
        </section>
      </main>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-xl rounded-2xl border border-emerald-400/20 bg-[#0f172a] shadow-[0_0_35px_rgba(15,23,42,0.8)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-400/15">
              <h3 className="text-lg font-semibold text-emerald-100">Edit Co-Activity</h3>
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
                <label className="block text-sm text-emerald-100/90 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-emerald-100/90 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={editForm.date}
                  onChange={handleEditChange}
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-emerald-200/70 mb-2">
                  Description of the Co-Activity
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

export default AdminCoActivitiesView;
