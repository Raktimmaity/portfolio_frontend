import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const AdminActivitiesAdd = () => {
  const [form, setForm] = useState({ title: "", platform: "", date: "" });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error saving activity");
      toast.success("Activity added");
      setForm({ title: "", platform: "", date: "" });
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
            <h1 className="text-3xl md:text-4xl font-semibold text-emerald-200">
              Add Activities
            </h1>
            <p className="text-sm text-emerald-100/70 mt-1">
              You can easily add the your Activities.
            </p>
          </div>
          <div className="text-sm text-emerald-200/70">
            <span className="text-emerald-300">Dashboard</span> <span className="mx-2">/</span>{" "}
            Activities <span className="mx-2">/</span> Activities{" "}
            <span className="mx-2">/</span> Add data
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-emerald-400/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm text-emerald-100/90 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter the title of your Activities"
                className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <label className="block text-sm text-emerald-100/90 mb-1">Platform</label>
                <input
                  type="text"
                  name="platform"
                  value={form.platform}
                  onChange={handleChange}
                  placeholder="Enter the platform or organization"
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-emerald-100/90 mb-1">Date</label>
                <input
                  type="text"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  placeholder="Enter year"
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 text-white font-medium shadow-[0_0_18px_rgba(16,185,129,0.5)] hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Add to Database"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AdminActivitiesAdd;
