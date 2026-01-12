import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaLock } from "react-icons/fa";
import { toast } from "sonner";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();
  const API_BASE = import.meta.env.REACT_APP_API_BASE || import.meta.env.VITE_API_BASE  || "http://localhost:5000";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 15) return "Good Noon";
    if (hour >= 15 && hour < 18) return "Good Afternoon";
    if (hour >= 18 && hour < 22) return "Good Evening";
    return "Good Night";
  };

  useEffect(() => {
    setGreeting(getGreeting());
    const interval = setInterval(() => setGreeting(getGreeting()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
    //   const res = await fetch(`${import.meta.env.REACT_APP_API_BASE}/api/admin/login`, {
    const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // store token + expiry time (ms)
      const token = data.token;
      // compute expiry from JWT or server expire string: use current time + TTL fallback from server
      const ttlSeconds = (() => {
        // server returned expiresIn like "1h" or "3600s" — we fallback to 3600s
        const ei = "1h" || data.expiresIn || "1h";
        if (/^\d+$/.test(ei)) return parseInt(ei, 10);
        if (ei.endsWith("h")) return parseInt(ei, 10) * 3600;
        if (ei.endsWith("m")) return parseInt(ei, 10) * 60;
        return 3600;
      })();

      const expiresAt = Date.now() + ttlSeconds * 1000;

      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_expiresAt", String(expiresAt));
      localStorage.setItem("admin_user", JSON.stringify(data.user || {}));

      toast.success("Login successful", { description: "Welcome back, Admin!" });
      navigate("/admin-dashboard");
    } catch (err) {
      toast.error("Login failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-black/50 border border-cyan-400/30 rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <FaUserShield className="text-4xl text-cyan-400 mb-2" />
          <h2 className="text-xl font-semibold text-cyan-300">{greeting}, <span className="text-2xl font-bold text-white">Boss</span></h2>
          <p className="text-sm text-gray-400">Enter your credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" name="email" placeholder="Admin Email" value={form.email} onChange={handleChange} className="w-full rounded-md bg-gray-800 border border-cyan-400/30 px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none" required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full rounded-md bg-gray-800 border border-cyan-400/30 px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none" required />

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-green-500 py-2 rounded-md text-black font-semibold hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition disabled:opacity-60 disabled:cursor-not-allowed">
            <FaLock /> {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
