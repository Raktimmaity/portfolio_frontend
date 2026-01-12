import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

const AdminFavicon = () => {
  const [fileName, setFileName] = useState("No file selected.");
  const [favicon, setFavicon] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/site-settings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) => setFavicon(data.favicon || ""))
      .catch(() => toast.error("Failed to fetch favicon"));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      toast.error("Missing Cloudinary config");
      return;
    }

    try {
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

      const iconUrl = data.secure_url || "";
      const saveRes = await fetch(`${API_BASE}/api/admin/site-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ favicon: iconUrl }),
      });
      if (!saveRes.ok) {
        const saveData = await saveRes.json();
        throw new Error(saveData.message || "Error updating favicon");
      }
      setFavicon(iconUrl);
      setFile(null);
      setFileName("No file selected.");
      toast.success("Favicon updated");
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
              Favicon
            </h1>
            <p className="text-sm text-cyan-100/70 mt-1">Adjust your website favicon.</p>
          </div>
          <div className="text-sm text-cyan-200/70">
            <span className="text-cyan-300">Dashboard</span> <span className="mx-2">/</span> Favicon
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-cyan-400/15 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
          <h2 className="text-lg font-semibold text-cyan-100">Favicon Setting</h2>
          <p className="mt-4 text-sm text-cyan-100/70">Your current Favicon Image</p>
          <div className="mt-6 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-[#0b1220] border border-cyan-400/20 flex items-center justify-center shadow-[0_0_18px_rgba(34,211,238,0.2)] overflow-hidden">
              {favicon ? (
                <img src={favicon} alt="Current favicon" className="h-full w-full object-cover" />
              ) : (
                <span className="text-cyan-100 text-2xl">RM</span>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 bg-[#0f172a] border border-emerald-400/15 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
          <h2 className="text-lg font-semibold text-emerald-100">Update Favicon</h2>
          <form onSubmit={handleSave} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm text-emerald-100/80 mb-2">
                Site icon (Minimum 100px x 100px, Maxsize 2MB)
              </label>
              <div className="flex flex-col md:flex-row md:items-center bg-[#0b1220] border border-emerald-400/20 rounded-md overflow-hidden">
                <label className="px-4 py-2 bg-emerald-500/20 text-emerald-100 cursor-pointer">
                  Browse...
                  <input
                    type="file"
                    accept=".png,.ico"
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
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium shadow-[0_0_18px_rgba(16,185,129,0.6)]"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AdminFavicon;
