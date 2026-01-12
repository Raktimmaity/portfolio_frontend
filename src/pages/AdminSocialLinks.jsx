import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

const AdminSocialLinks = () => {
  const [form, setForm] = useState({
    socialFacebook: "",
    socialInstagram: "",
    socialLinkedIn: "",
    socialGitHub: "",
    socialSkype: "",
    socialTwitter: "",
  });

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setForm((prev) => ({
          ...prev,
          socialFacebook: data.socialFacebook || "",
          socialInstagram: data.socialInstagram || "",
          socialLinkedIn: data.socialLinkedIn || "",
          socialGitHub: data.socialGitHub || "",
          socialSkype: data.socialSkype || "",
          socialTwitter: data.socialTwitter || "",
        }))
      )
      .catch(() => toast.error("Failed to fetch social links"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/admin/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) toast.success("Social links updated");
      else toast.error(data.message || "Error updating social links");
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
              Social Links
            </h1>
            <p className="text-sm text-cyan-100/70 mt-1">Upload your social media accounts</p>
          </div>
          <div className="text-sm text-cyan-200/70">
            <span className="text-cyan-300">Dashboard</span> <span className="mx-2">/</span> Social Links
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-cyan-400/15 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-cyan-100/80 mb-1">Facebook</label>
                <input
                  type="url"
                  name="socialFacebook"
                  value={form.socialFacebook}
                  onChange={handleChange}
                  className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                  placeholder="https://facebook.com/username"
                />
              </div>
              <div>
                <label className="block text-sm text-cyan-100/80 mb-1">Instagram</label>
                <input
                  type="url"
                  name="socialInstagram"
                  value={form.socialInstagram}
                  onChange={handleChange}
                  className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div>
                <label className="block text-sm text-cyan-100/80 mb-1">Linkedin</label>
                <input
                  type="url"
                  name="socialLinkedIn"
                  value={form.socialLinkedIn}
                  onChange={handleChange}
                  className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm text-cyan-100/80 mb-1">Github</label>
                <input
                  type="url"
                  name="socialGitHub"
                  value={form.socialGitHub}
                  onChange={handleChange}
                  className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <label className="block text-sm text-cyan-100/80 mb-1">Skype</label>
                <input
                  type="url"
                  name="socialSkype"
                  value={form.socialSkype}
                  onChange={handleChange}
                  className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                  placeholder="https://join.skype.com/invite/..."
                />
              </div>
              <div>
                <label className="block text-sm text-cyan-100/80 mb-1">Twitter</label>
                <input
                  type="url"
                  name="socialTwitter"
                  value={form.socialTwitter}
                  onChange={handleChange}
                  className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-gradient-to-r from-cyan-500 via-green-500 to-emerald-500 text-white font-medium shadow-[0_0_18px_rgba(34,211,238,0.5)] hover:scale-105 transition"
            >
              Save Changes
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AdminSocialLinks;
