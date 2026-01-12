import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

const AdminCoverPhoto = () => {
  const [admin, setAdmin] = useState({ coverPhoto: "" });
  const [uploading, setUploading] = useState(false);
  const [showCoverUpload, setShowCoverUpload] = useState(false);
  const [coverModalVisible, setCoverModalVisible] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [coverError, setCoverError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) => setAdmin((prev) => ({ ...prev, ...data })))
      .catch(() => toast.error("Failed to fetch profile"));
  }, []);

  useEffect(() => {
    if (showCoverUpload) {
      const id = requestAnimationFrame(() => setCoverModalVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setCoverModalVisible(false);
  }, [showCoverUpload]);

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

  const saveCover = async (coverUrl) => {
    const res = await fetch(`${API_BASE}/api/admin/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify({ coverPhoto: coverUrl }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Error updating cover photo");
    }
  };

  const handleCoverUpload = async (file) => {
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
      if (width < 426 || height < 426) {
        toast.error("Minimum size is 426px x 426px");
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

      const coverUrl = data.secure_url || "";
      await saveCover(coverUrl);
      setAdmin((prev) => ({ ...prev, coverPhoto: coverUrl }));
      setShowCoverUpload(false);
      setCoverFile(null);
      setCoverError("");
      toast.success("Cover photo updated");
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
              Cover Photo
            </h1>
            <p className="text-sm text-cyan-100/70 mt-1">
              Set your cover photo in PNG format. It means upload a cover photo that&apos;s background is transparent.
            </p>
          </div>
          <div className="text-sm text-cyan-200/70">
            <span className="text-cyan-300">Dashboard</span> <span className="mx-2">/</span> Cover Photo
          </div>
        </div>

        <div className="mt-8 bg-[#0f172a] border border-emerald-400/15 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl rounded-2xl bg-[#0b1220] border border-emerald-400/15 p-6 shadow-[0_0_20px_rgba(16,185,129,0.12)]">
              <div className="flex items-center justify-center min-h-[280px]">
                {admin.coverPhoto ? (
                  <img
                    src={admin.coverPhoto}
                    alt="Cover"
                    className="max-h-[320px] w-auto object-contain drop-shadow-[0_0_18px_rgba(16,185,129,0.2)]"
                  />
                ) : (
                  <div className="text-emerald-100/60 text-sm">No cover photo uploaded.</div>
                )}
              </div>
              <div className="mt-6 flex flex-col items-start gap-3">
                <h3 className="text-xl font-semibold text-emerald-100">Current Cover Photo</h3>
                <button
                  type="button"
                  onClick={() => setShowCoverUpload(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-500/90 hover:bg-emerald-400 text-black font-medium shadow-[0_0_18px_rgba(16,185,129,0.6)]"
                >
                  Update Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showCoverUpload && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
            coverModalVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`w-full max-w-xl rounded-2xl bg-[#0f172a] border border-emerald-400/20 shadow-[0_0_35px_rgba(16,185,129,0.25)] transition-all duration-200 ${
              coverModalVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
            }`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-400/15">
              <h3 className="text-lg font-semibold text-emerald-100">Update Cover Photo</h3>
              <button
                type="button"
                onClick={() => {
                  setCoverModalVisible(false);
                  setTimeout(() => {
                    setShowCoverUpload(false);
                    setCoverFile(null);
                    setCoverError("");
                  }, 200);
                }}
                className="text-emerald-200/70 hover:text-emerald-100"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-emerald-100/70">
                Cover Photo (Minimum 426px x 426px, Maxsize 2MB)
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
                      setCoverFile(file);
                      setCoverError("");
                    }}
                  />
                </label>
                <span className="flex-1 px-4 py-2 text-sm text-emerald-100/70">
                  {coverFile ? coverFile.name : "No file selected."}
                </span>
                <button
                  type="button"
                  disabled={!coverFile || uploading}
                  onClick={() => {
                    if (!coverFile) return;
                    handleCoverUpload(coverFile);
                  }}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium shadow-[0_0_18px_rgba(16,185,129,0.6)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>

              {coverError && <p className="text-sm text-red-300">{coverError}</p>}
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-emerald-400/15">
              <button
                type="button"
                onClick={() => {
                  setCoverModalVisible(false);
                  setTimeout(() => {
                    setShowCoverUpload(false);
                    setCoverFile(null);
                    setCoverError("");
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

export default AdminCoverPhoto;
