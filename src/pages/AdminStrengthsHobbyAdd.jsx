import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import AdminSidebar from "../components/AdminSidebar";

const AdminStrengthsHobbyAdd = () => {
  const [form, setForm] = useState({ category: "", name: "" });
  const [saving, setSaving] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

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
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/strengths-interests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error saving item");
      toast.success("Item added");
      setForm({ category: "", name: "" });
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
              Add new Strengths or Interests
            </h1>
            <p className="text-sm text-emerald-100/70 mt-1">
              Add new strengths or interests.
            </p>
          </div>
          <div className="text-sm text-emerald-200/70">
            <span className="text-emerald-300">Dashboard</span> <span className="mx-2">/</span>{" "}
            Strength & Interests <span className="mx-2">/</span> Add data
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-emerald-400/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-emerald-100/90 mb-1">
                  Select Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                >
                  <option value="">Choose a category</option>
                  <option value="Strengths">Strengths</option>
                  <option value="Interests">Interests</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-emerald-100/90 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter the name of the strength or interests"
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

export default AdminStrengthsHobbyAdd;
