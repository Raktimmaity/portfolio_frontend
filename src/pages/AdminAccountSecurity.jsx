import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

const AdminAccountSecurity = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setForm((prev) => ({
          ...prev,
          name: data.name || "",
          email: data.email || "",
        }))
      )
      .catch(() => toast.error("Failed to fetch account details"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const getStrength = (value) => {
    if (!value) return { label: "Empty", className: "text-gray-400" };
    if (value.length < 6) return { label: "Weak", className: "text-red-300" };
    if (value.length < 10) return { label: "Medium", className: "text-yellow-300" };
    return { label: "Strong", className: "text-emerald-300" };
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Login details updated");
        setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      } else {
        toast.error(data.message || "Error updating account");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
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
              Account Security
            </h1>
            <p className="text-sm text-cyan-100/70 mt-1">
              A page where you can change account security settings.
            </p>
          </div>
          <div className="text-sm text-cyan-200/70">
            <span className="text-cyan-300">Dashboard</span> <span className="mx-2">/</span> Account{" "}
            <span className="mx-2">/</span> Security
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-cyan-400/15 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
          <h2 className="text-xl font-semibold text-cyan-100 mb-6">Change Password</h2>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm text-cyan-100/80 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                readOnly
                className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100/80 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-cyan-100/80 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 outline-none focus:border-cyan-300"
              />
            </div>

            <div>
              <label className="block text-sm text-cyan-100/80 mb-1">Password</label>
              <div className="flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="flex-1 bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 outline-none focus:border-cyan-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="px-3 py-2 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className={`mt-2 text-xs ${getStrength(form.password).className}`}>
                Strength: {getStrength(form.password).label}
              </p>
            </div>

            <div>
              <label className="block text-sm text-cyan-100/80 mb-1">Confirm Password</label>
              <div className="flex items-center gap-2">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  className="flex-1 bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 outline-none focus:border-cyan-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="px-3 py-2 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 text-sm"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-md bg-gradient-to-r from-cyan-500 via-green-500 to-emerald-500 text-white font-medium shadow-[0_0_18px_rgba(34,211,238,0.5)] hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default AdminAccountSecurity;
