import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import AdminSidebar from "../components/AdminSidebar";

const AdminSectionControls = () => {
  const [sections, setSections] = useState({
    hero: true,
    projects: true,
    testimonials: true,
    contact: true,
  });

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Section controls saved");
  };

  return (
    <div className="min-h-screen bg-[#0b1222] text-white flex">
      <Toaster position="top-right" theme="dark" richColors />
      <AdminSidebar />

      <main className="flex-1 md:ml-64 mt-16 md:mt-0 p-6 md:p-10 transition-all duration-300">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
              Section Controls
            </h1>
            <p className="text-sm text-cyan-100/70 mt-1">Enable or disable homepage sections</p>
          </div>
          <div className="text-sm text-cyan-200/70">
            <span className="text-cyan-300">Dashboard</span> <span className="mx-2">/</span> Section Controls
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-emerald-400/15 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
          <form onSubmit={handleSave} className="space-y-4">
            {[
              { key: "hero", label: "Hero Section" },
              { key: "projects", label: "Projects Section" },
              { key: "testimonials", label: "Testimonials Section" },
              { key: "contact", label: "Contact Section" },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-3 text-emerald-100/90"
              >
                <span>{item.label}</span>
                <button
                  type="button"
                  onClick={() => toggleSection(item.key)}
                  className={`w-14 h-7 rounded-full transition-colors duration-200 ${
                    sections[item.key] ? "bg-emerald-500" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`block w-6 h-6 bg-white rounded-full transform transition-transform duration-200 ${
                      sections[item.key] ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </label>
            ))}

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

export default AdminSectionControls;
