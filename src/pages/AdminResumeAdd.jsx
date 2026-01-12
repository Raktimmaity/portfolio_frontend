import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

const AdminResumeAdd = () => {
  const [form, setForm] = useState({
    category: "",
    duration: "",
    title: "",
    organization: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.category) {
      toast.error("Please choose a category");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/resume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error saving resume entry");
      toast.success("Resume entry added");
      setForm({ category: "", duration: "", title: "", organization: "", description: "" });
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
            <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
              Resume Section
            </h1>
            <p className="text-sm text-cyan-100/70 mt-1">
              Edit your resume section like add the school data, college data also you can add
              your professional data from which company complete the internship
            </p>
          </div>
          <div className="text-sm text-cyan-200/70">
            <span className="text-cyan-300">Dashboard</span> <span className="mx-2">/</span> Resume{" "}
            <span className="mx-2">/</span> Add data
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-cyan-400/15 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-cyan-100/80 mb-1">Select Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                >
                  <option value="">Choose a category</option>
                  <option value="Education">Education</option>
                  <option value="Professional Experience">Professional Experience</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-cyan-100/80 mb-1">Duration or Time Period</label>
                <input
                  type="text"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="Enter the time duration of the course (e.g: 2024-2025)"
                  className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-cyan-100/80 mb-1">
                  Course or position name
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter your course or position name"
                  className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-cyan-100/80 mb-1">
                  Institute or Company name
                </label>
                <input
                  type="text"
                  name="organization"
                  value={form.organization}
                  onChange={handleChange}
                  placeholder="Enter your institute or company name"
                  className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-cyan-200/70 mb-2">
                Description (leave it blank if you don't want to)
              </label>
              <textarea
                rows="4"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter the description of the course or position"
                className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-3 text-cyan-100 focus:border-cyan-300 outline-none"
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

export default AdminResumeAdd;
