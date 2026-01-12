import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    address: "",
    country: "",
    company: "",
    job: "",
    professionTitles: "",
    avatar: "",
  });
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) => setAdmin((prev) => ({ ...prev, ...data })))
      .catch(() => toast.error("Failed to fetch profile"));
  }, []);

  useEffect(() => {
    if (showUpload) {
      const id = requestAnimationFrame(() => setModalVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setModalVisible(false);
  }, [showUpload]);


  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/admin/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(admin),
      });
      const data = await res.json();
      if (res.ok) toast.success("Profile updated successfully!");
      else toast.error(data.message || "Error updating profile");
    } catch (err) {
      toast.error("Server error");
    }
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

  const handleUpload = async (file) => {
    if (!file) return;
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      toast.error("Missing Cloudinary config");
      return;
    }

    try {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Max file size is 2MB");
        return;
      }
      const { width, height } = await getImageSize(file);
      if (width < 500 || height < 500) {
        toast.error("Minimum size is 500px x 500px");
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Upload failed");
      setAdmin((prev) => ({ ...prev, avatar: data.secure_url || "" }));
      setShowUpload(false);
      setUploadFile(null);
      setUploadError("");
      toast.success("Photo updated");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
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
              Account Profile
            </h1>
            <p className="text-sm text-cyan-100/70 mt-1">Change your account profile and personal details.</p>
          </div>
          <div className="text-sm text-cyan-200/70">
            <span className="text-cyan-300">Dashboard</span> <span className="mx-2">/</span> Profile
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <section className="bg-[#0f172a] border border-cyan-400/15 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,211,238,0.12)] self-start">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={admin.avatar}
                  alt="Admin avatar"
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                />
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-cyan-100">{admin.name || "Admin Name"}</h2>
              <p className="mt-2 text-sm text-cyan-100/70 leading-relaxed">
                {admin.professionTitles || ""}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 text-sm text-cyan-100">
                <span>Update Photo:</span>
                <button
                  type="button"
                  onClick={() => setShowUpload(true)}
                  className="px-3 py-2 rounded-md bg-emerald-500/90 hover:bg-emerald-400 transition shadow-[0_0_15px_rgba(16,185,129,0.6)]"
                >
                  Upload
                </button>
              </div>
            </div>
          </section>

          <section className="bg-[#0f172a] border border-cyan-400/15 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-cyan-100/80 mb-1">Name</label>
                  <input
                    type="text"
                    value={admin.name}
                    onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
                    className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none shadow-[0_0_0_rgba(34,211,238,0.2)]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-cyan-100/80 mb-1">Email</label>
                  <input
                    type="email"
                    value={admin.email}
                    onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
                    className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-cyan-100/80 mb-1">Phone</label>
                  <input
                    type="text"
                    value={admin.phone}
                    onChange={(e) => setAdmin({ ...admin, phone: e.target.value })}
                    className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-cyan-100/80 mb-1">Birthday</label>
                  <input
                    type="text"
                    value={admin.birthday}
                    onChange={(e) => setAdmin({ ...admin, birthday: e.target.value })}
                    className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-cyan-100/80 mb-1">Address</label>
                  <input
                    type="text"
                    value={admin.address}
                    onChange={(e) => setAdmin({ ...admin, address: e.target.value })}
                    className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-cyan-100/80 mb-1">Country</label>
                  <input
                    type="text"
                    value={admin.country}
                    onChange={(e) => setAdmin({ ...admin, country: e.target.value })}
                    className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-cyan-100/80 mb-1">Company</label>
                  <input
                    type="text"
                    value={admin.company}
                    onChange={(e) => setAdmin({ ...admin, company: e.target.value })}
                    className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-cyan-100/80 mb-1">Job</label>
                  <input
                    type="text"
                    value={admin.job}
                    onChange={(e) => setAdmin({ ...admin, job: e.target.value })}
                    className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-cyan-200/70 mb-2">Profession Titles</label>
                <textarea
                  rows="4"
                  value={admin.professionTitles}
                  onChange={(e) => setAdmin({ ...admin, professionTitles: e.target.value })}
                  className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-3 text-cyan-100 focus:border-cyan-300 outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 rounded-md bg-gradient-to-r from-cyan-500 via-green-500 to-emerald-500 text-white font-medium shadow-[0_0_18px_rgba(34,211,238,0.5)] hover:scale-105 transition"
              >
                Save Changes
              </button>
            </form>
          </section>
        </div>

      </main>

      {showUpload && (
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
              <h3 className="text-lg font-semibold text-emerald-100">Update Profile Picture</h3>
              <button
                type="button"
                onClick={() => {
                  setModalVisible(false);
                  setTimeout(() => {
                    setShowUpload(false);
                    setUploadFile(null);
                    setUploadError("");
                  }, 200);
                }}
                className="text-emerald-200/70 hover:text-emerald-100"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-emerald-100/70">
                Profile Pic (Minimum 500px x 500px, Maxsize 2MB)
              </p>

              <div className="flex flex-col md:flex-row md:items-center gap-3 bg-[#0b1220] border border-emerald-400/20 rounded-md overflow-hidden">
                <label className="px-4 py-2 bg-emerald-500/20 text-emerald-100 cursor-pointer">
                  Browse...
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setUploadFile(file);
                      setUploadError("");
                    }}
                  />
                </label>
                <span className="flex-1 px-4 py-2 text-sm text-emerald-100/70">
                  {uploadFile ? uploadFile.name : "No file selected."}
                </span>
                <button
                  type="button"
                  disabled={!uploadFile || uploading}
                  onClick={() => {
                    if (!uploadFile) return;
                    handleUpload(uploadFile);
                  }}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium shadow-[0_0_18px_rgba(16,185,129,0.6)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>

              {uploadError && <p className="text-sm text-red-300">{uploadError}</p>}
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-emerald-400/15">
              <button
                type="button"
                onClick={() => {
                  setModalVisible(false);
                  setTimeout(() => {
                    setShowUpload(false);
                    setUploadFile(null);
                    setUploadError("");
                  }, 200);
                }}
                className="px-4 py-2 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProfile;