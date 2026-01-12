import React, { useEffect, useMemo, useState } from "react";
import { Toaster } from "sonner";
import {
  FaEye,
  FaProjectDiagram,
  FaTasks,
  FaBookmark,
  FaUserCircle,
} from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

const Dashboard = () => {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("admin_user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const [skillsCount, setSkillsCount] = useState(0);
  const [profile, setProfile] = useState({ avatar: "", name: "" });
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) => setProfile({ avatar: data.avatar || "", name: data.name || "" }))
      .catch(() => {});

    fetch(`${API_BASE}/api/admin/skills`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) => setSkillsCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});

    fetch(`${API_BASE}/api/admin/visitors?days=30`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const days = 30;
        const base = new Date();
        base.setUTCHours(0, 0, 0, 0);
        base.setUTCDate(base.getUTCDate() - (days - 1));
        const counts = Array.from({ length: days }, (_, i) => {
          const d = new Date(base);
          d.setUTCDate(base.getUTCDate() + i);
          const key = d.toISOString().slice(0, 10);
          const match = data.find((item) => {
            const itemDate = new Date(item.date).toISOString().slice(0, 10);
            return itemDate === key;
          });
          return match ? match.count : 0;
        });
        setVisits(counts);
      })
      .catch(() => {});
  }, []);

  const stats = [
    { label: "Profile Views", value: visits.reduce((sum, v) => sum + v, 0).toString(), icon: <FaEye />, tone: "from-cyan-400 to-blue-400" },
    { label: "Projects", value: "37", icon: <FaUserCircle />, tone: "from-sky-400 to-cyan-400" },
    { label: "Skills", value: skillsCount.toString(), icon: <FaTasks />, tone: "from-emerald-400 to-green-400" },
    { label: "Activities", value: "5", icon: <FaBookmark />, tone: "from-rose-400 to-red-400" },
  ];

  const maxVisit = Math.max(...visits, 1);
  const points = visits.length
    ? visits
    .map((v, i) => {
      const x = (i / (visits.length - 1)) * 600;
      const y = 200 - (v / maxVisit) * 160 + 20;
      return `${x},${y}`;
    })
    .join(" ")
    : "";

  const messages = ["SATYAJIT SAHA", "Risav", "Aritri podder"];
  const testimonials = [
    { name: "Boby Mondal", comment: "Excellent Work.." },
    { name: "Santu Pramanik", comment: "Excellent frontend development skills." },
    { name: "Santu Pramanik", comment: "Excellent frontend development skills." },
  ];

  return (
    <div className="bg-[#0b1222] text-white min-h-screen flex">
      <Toaster position="top-right" theme="dark" richColors />
      <AdminSidebar />

      <main className="flex-1 md:ml-64 mt-16 md:mt-0 p-6 md:p-10 transition-all duration-300">
            <h1 className="text-3xl font-semibold text-cyan-100">Dashboard</h1>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-[#0f172a] border border-emerald-400/10 p-5 shadow-[0_0_25px_rgba(16,185,129,0.12)]"
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${s.tone} flex items-center justify-center text-black/80`}>
                  <span className="text-lg">{s.icon}</span>
                </div>
                <div>
                  <p className="text-sm text-cyan-100/70">{s.label}</p>
                  <p className="text-xl font-semibold text-cyan-100">{s.value}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-2xl bg-[#0f172a] border border-emerald-400/10 p-5 shadow-[0_0_25px_rgba(16,185,129,0.12)] flex items-center gap-4">
            <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-emerald-400/40">
              <img
                src={profile.avatar || user.avatar || "https://i.pravatar.cc/120?img=13"}
                alt="Admin"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-lg font-semibold text-cyan-100">
                {profile.name || user.name || "Raktim Maity"}
              </p>
              <p className="text-sm text-cyan-100/60">Admin Name</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <section className="rounded-2xl bg-[#0f172a] border border-cyan-400/15 p-6 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
            <h2 className="text-lg font-semibold text-cyan-100">Profile Visit</h2>
            <div className="mt-4">
              <svg viewBox="0 0 600 220" className="w-full h-[260px]">
                <defs>
                  <linearGradient id="visitLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
                {Array.from({ length: 6 }).map((_, i) => (
                  <line
                    key={`grid-${i}`}
                    x1="0"
                    y1={20 + i * 32}
                    x2="600"
                    y2={20 + i * 32}
                    stroke="#1f2937"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                ))}
                {points && (
                  <polyline
                    fill="none"
                    stroke="url(#visitLine)"
                    strokeWidth="2.5"
                    points={points}
                  />
                )}
                {visits.length > 1 &&
                  visits.map((v, i) => {
                    const x = (i / (visits.length - 1)) * 600;
                    const y = 200 - (v / maxVisit) * 160 + 20;
                    return <circle key={`pt-${i}`} cx={x} cy={y} r="3" fill="#22d3ee" />;
                  })}
              </svg>
              <p className="text-xs text-cyan-100/50 text-center -mt-4">Visitors per Day</p>
            </div>
          </section>

          <section className="rounded-2xl bg-[#0f172a] border border-emerald-400/15 p-6 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
            <h2 className="text-lg font-semibold text-cyan-100">Recent Messages</h2>
            <div className="mt-6 space-y-4">
              {messages.map((name, i) => (
                <div key={name} className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-lime-400 flex items-center justify-center text-black font-bold">
                    {name.slice(0, 1)}
                  </div>
                  <div className="text-cyan-100">{name}</div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full py-2 rounded-md border border-cyan-400/30 text-cyan-100 hover:border-cyan-300 transition">
              View All
            </button>
          </section>
        </div>

        <section className="mt-8 rounded-2xl bg-[#0f172a] border border-cyan-400/15 p-6 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
          <h2 className="text-lg font-semibold text-cyan-100">Latest Testimonials</h2>
          <div className="mt-6">
            <div className="grid grid-cols-[180px_1fr] text-sm text-cyan-100/70 border-b border-cyan-400/20 pb-3">
              <div>Name</div>
              <div>Comment</div>
            </div>
            <div className="divide-y divide-cyan-400/10">
              {testimonials.map((t, i) => (
                <div key={`${t.name}-${i}`} className={`grid grid-cols-[180px_1fr] py-4 ${i === 1 ? "bg-white/5 rounded-md px-2" : ""}`}>
                  <div className="flex items-center gap-3 text-cyan-100">
                    <div className="h-10 w-10 rounded-full bg-purple-400 flex items-center justify-center text-black font-semibold">
                      {t.name.slice(0, 1)}
                    </div>
                    <span>{t.name}</span>
                  </div>
                  <div className="text-cyan-100/80">{t.comment}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
