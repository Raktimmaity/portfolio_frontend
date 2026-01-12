import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

const AdminAboutSection = () => {
  const [form, setForm] = useState({
    professionalHeading: "",
    websiteName: "",
    subHeading: "",
    shortDescription: "",
    longDescription: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/about`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setForm((prev) => ({
          ...prev,
          professionalHeading: data.professionalHeading || "",
          websiteName: data.websiteName || "",
          subHeading: data.subHeading || "",
          shortDescription: data.shortDescription || "",
          longDescription: data.longDescription || "",
        }))
      )
      .catch(() => toast.error("Failed to fetch about details"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/about`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) toast.success("About section updated");
      else toast.error(data.message || "Error updating about section");
    } catch (err) {
      toast.error("Server error");
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
            <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
              About Section
            </h1>
            <p className="text-sm text-cyan-100/70 mt-1">
              Edit your about information like bio, short, description etc.
            </p>
          </div>
          <div className="text-sm text-cyan-200/70">
            <span className="text-cyan-300">Dashboard</span> <span className="mx-2">/</span> About Section
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-cyan-400/15 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-cyan-100/80 mb-1">Professional Heading</label>
                <input
                  type="text"
                  name="professionalHeading"
                  value={form.professionalHeading}
                  onChange={handleChange}
                  className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-cyan-100/80 mb-1">Website Name</label>
                <input
                  type="text"
                  name="websiteName"
                  value={form.websiteName}
                  onChange={handleChange}
                  className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-cyan-100/80 mb-1">Sub Heading</label>
              <input
                type="text"
                name="subHeading"
                value={form.subHeading}
                onChange={handleChange}
                className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-cyan-100/80 mb-1">
                Short Description About You (You can use Html Code)
              </label>
              <textarea
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                rows={4}
                className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-cyan-100/80 mb-1">
                Long Description About You (You can use Html Code)
              </label>
              <textarea
                name="longDescription"
                value={form.longDescription}
                onChange={handleChange}
                rows={6}
                className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-gradient-to-r from-cyan-500 via-green-500 to-emerald-500 text-white font-medium shadow-[0_0_18px_rgba(34,211,238,0.5)] hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AdminAboutSection;
