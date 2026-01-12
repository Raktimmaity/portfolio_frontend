import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

const AdminSeo = () => {
  const [form, setForm] = useState({
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    seoOgTitle: "",
    seoOgDescription: "",
    seoOgImage: "",
    seoTwitterCard: "summary_large_image",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/site-settings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setForm((prev) => ({
          ...prev,
          seoTitle: data.seoTitle || "",
          seoDescription: data.seoDescription || "",
          seoKeywords: data.seoKeywords || "",
          seoOgTitle: data.seoOgTitle || "",
          seoOgDescription: data.seoOgDescription || "",
          seoOgImage: data.seoOgImage || "",
          seoTwitterCard: data.seoTwitterCard || "summary_large_image",
        }))
      )
      .catch(() => toast.error("Failed to fetch SEO settings"));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/admin/site-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) toast.success("SEO settings saved");
      else toast.error(data.message || "Error updating SEO settings");
    } catch (err) {
      toast.error("Server error");
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
              SEO
            </h1>
            <p className="text-sm text-cyan-100/70 mt-1">Manage meta tags and SEO settings</p>
          </div>
          <div className="text-sm text-cyan-200/70">
            <span className="text-cyan-300">Dashboard</span> <span className="mx-2">/</span> SEO
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-cyan-400/15 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm text-cyan-100/80 mb-1">SEO Title</label>
              <input
                type="text"
                name="seoTitle"
                value={form.seoTitle}
                onChange={handleChange}
                className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-cyan-100/80 mb-1">Meta Description</label>
              <textarea
                rows="4"
                name="seoDescription"
                value={form.seoDescription}
                onChange={handleChange}
                className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-3 text-cyan-100 focus:border-cyan-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-cyan-100/80 mb-1">Keywords</label>
              <input
                type="text"
                name="seoKeywords"
                value={form.seoKeywords}
                onChange={handleChange}
                className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                placeholder="design, portfolio, mern"
              />
            </div>
            <div>
              <label className="block text-sm text-cyan-100/80 mb-1">Open Graph Title</label>
              <input
                type="text"
                name="seoOgTitle"
                value={form.seoOgTitle}
                onChange={handleChange}
                className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-cyan-100/80 mb-1">Open Graph Description</label>
              <textarea
                rows="3"
                name="seoOgDescription"
                value={form.seoOgDescription}
                onChange={handleChange}
                className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-3 text-cyan-100 focus:border-cyan-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-cyan-100/80 mb-1">Open Graph Image URL</label>
              <input
                type="url"
                name="seoOgImage"
                value={form.seoOgImage}
                onChange={handleChange}
                className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                placeholder="https://example.com/og-image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm text-cyan-100/80 mb-1">Twitter Card</label>
              <select
                name="seoTwitterCard"
                value={form.seoTwitterCard}
                onChange={handleChange}
                className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
              >
                <option value="summary">summary</option>
                <option value="summary_large_image">summary_large_image</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-gradient-to-r from-cyan-500 via-green-500 to-emerald-500 text-white font-medium shadow-[0_0_18px_rgba(34,211,238,0.5)] hover:scale-105 transition"
            >
              Save Changes
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AdminSeo;
