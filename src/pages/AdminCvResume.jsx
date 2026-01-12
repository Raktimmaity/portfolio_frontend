import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

const AdminCvResume = () => {
  const [cv, setCv] = useState({ fileUrl: "", fileName: "", isActive: true });
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected.");

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/cv`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setCv({
          fileUrl: data.fileUrl || "",
          fileName: data.fileName || "",
          isActive: typeof data.isActive === "boolean" ? data.isActive : true,
        })
      )
      .catch(() => toast.error("Failed to fetch CV"));
  }, []);

  useEffect(() => {
    if (showUpload) {
      const id = requestAnimationFrame(() => setModalVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setModalVisible(false);
  }, [showUpload]);

  const uploadCv = async () => {
    if (!file) {
      toast.error("Please choose a file");
      return null;
    }
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      toast.error("Missing Cloudinary config");
      return null;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Upload failed");
      const url = data.secure_url || data.url || "";
      if (!url) throw new Error("Upload did not return a file URL");
      return url;
    } catch (err) {
      toast.error(err.message || "Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    let fileUrl = cv.fileUrl;
    let fileName = cv.fileName;
    if (file) {
      const uploadedUrl = await uploadCv();
      if (!uploadedUrl) return;
      fileUrl = uploadedUrl;
      fileName = file.name;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/cv`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ fileUrl, fileName, isActive: cv.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating CV");
      setCv({ fileUrl, fileName, isActive: cv.isActive });
      setFile(null);
      setFileName("No file selected.");
      toast.success("CV updated");
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
              CV/Resume
            </h1>
            <p className="text-sm text-cyan-100/70 mt-1">Update the CV or Resume</p>
          </div>
          <div className="text-sm text-cyan-200/70">
            <span className="text-cyan-300">Dashboard</span> <span className="mx-2">/</span> CV or Resume
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
          <section className="bg-[#0f172a] border border-emerald-400/15 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
            <h2 className="text-2xl font-semibold text-emerald-100 text-center">Current CV</h2>
            <p className="mt-2 text-center text-cyan-100/80">
              {cv.fileName || "No CV uploaded"}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="text-cyan-100/80">Update CV:</span>
              <button
                type="button"
                onClick={() => setShowUpload(true)}
                className="px-3 py-2 rounded-md bg-emerald-500/90 hover:bg-emerald-400 text-black cursor-pointer shadow-[0_0_18px_rgba(16,185,129,0.6)]"
              >
                Upload
              </button>
            </div>
          </section>

          <section className="bg-[#0f172a] border border-cyan-400/15 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
            <h2 className="text-lg font-semibold text-cyan-100">Show or Hide your Resume</h2>
            <p className="text-sm text-cyan-100/70 mt-1">
              Show or hide your resume
            </p>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCv((prev) => ({ ...prev, isActive: !prev.isActive }))}
                className={`w-14 h-7 rounded-full transition-colors duration-200 ${
                  cv.isActive ? "bg-emerald-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`block w-6 h-6 bg-white rounded-full transform transition-transform duration-200 ${
                    cv.isActive ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-cyan-100/80">
                {cv.isActive ? "Show Resume" : "Hide Resume"}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-cyan-100/80">Current Status:</span>
              <span
                className={`px-3 py-1 rounded-md text-sm ${
                  cv.isActive ? "bg-emerald-500/20 text-emerald-100" : "bg-gray-600/40 text-gray-200"
                }`}
              >
                {cv.isActive ? "Active" : "Hidden"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={uploading}
              className="mt-6 px-5 py-2 rounded-md bg-gradient-to-r from-cyan-500 via-green-500 to-emerald-500 text-white font-medium shadow-[0_0_18px_rgba(34,211,238,0.5)] hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Save Changes"}
            </button>
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
              <h3 className="text-lg font-semibold text-emerald-100">Update CV</h3>
              <button
                type="button"
                onClick={() => {
                  setModalVisible(false);
                  setTimeout(() => {
                    setShowUpload(false);
                    setFile(null);
                    setFileName("No file selected.");
                  }, 200);
                }}
                className="text-emerald-200/70 hover:text-emerald-100"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-emerald-100/70">CV or PDF (Choose pdf files only)</p>

              <div className="flex flex-col md:flex-row md:items-center bg-[#0b1220] border border-emerald-400/20 rounded-md overflow-hidden">
                <label className="px-4 py-2 bg-emerald-500/20 text-emerald-100 cursor-pointer">
                  Browse...
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => {
                      const selected = e.target.files?.[0] || null;
                      setFile(selected);
                      setFileName(selected?.name || "No file selected.");
                    }}
                  />
                </label>
                <span className="flex-1 px-4 py-2 text-sm text-emerald-100/70">{fileName}</span>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={async () => {
                    await handleSave();
                    setModalVisible(false);
                    setTimeout(() => setShowUpload(false), 200);
                  }}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium shadow-[0_0_18px_rgba(16,185,129,0.6)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Submit Query"}
                </button>
              </div>
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-emerald-400/15">
              <button
                type="button"
                onClick={() => {
                  setModalVisible(false);
                  setTimeout(() => {
                    setShowUpload(false);
                    setFile(null);
                    setFileName("No file selected.");
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

export default AdminCvResume;
