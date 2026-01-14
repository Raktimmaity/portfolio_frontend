import React, { useEffect, useRef, useState } from "react";
import { FaRocket, FaCode, FaUsers, FaAward } from "react-icons/fa";

/* ------------------ CONFIG DATA (edit here) ------------------ */
const statsData = {
  title: "By the Numbers",
  subtitle: "A quick snapshot of my journey and achievements",
  // visuals
  bg: "#070b17",
};

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

/* ------------------ HELPERS ------------------ */
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function useCountUp(inView, to, duration = 1200) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf, start;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setN(Math.round(easeOutCubic(p) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return n;
}

const StatCard = ({ value, suffix = "", label, active, icon: Icon }) => {
  const display = useCountUp(active, value);
  return (
    <div
      className="group relative text-center px-6 py-8 rounded-xl border border-emerald-400/30
                 bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur
                 hover:shadow-[0_0_35px_rgba(16,185,129,0.3)] hover:-translate-y-1 hover:border-emerald-400/50
                 transition-all duration-500"
      role="group"
      aria-label={label}
    >
      {/* Animated glow effect */}
      <span
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                   bg-[radial-gradient(300px_150px_at_50%_50%,rgba(16,185,129,.15),transparent_70%)]
                   transition-opacity duration-500"
        aria-hidden
      />

      {/* Icon */}
      <div className="relative flex justify-center mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
          <div className="relative p-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-400/40">
            {Icon && <Icon className="text-2xl text-emerald-400 group-hover:scale-110 transition-transform duration-300" />}
          </div>
        </div>
      </div>

      {/* Number */}
      <h3
        className="text-5xl md:text-6xl font-extrabold tracking-tight mb-2
                   text-transparent bg-clip-text
                   bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400
                   drop-shadow-[0_0_20px_rgba(44,255,125,0.8)]
                   group-hover:drop-shadow-[0_0_30px_rgba(44,255,125,1)]
                   transition-all duration-300"
        aria-live="polite"
      >
        {display}
        {suffix}
      </h3>

      {/* Label */}
      <p className="text-sm md:text-base text-slate-300 font-medium group-hover:text-emerald-200 transition-colors duration-300">
        {label}
      </p>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/0 to-transparent group-hover:via-emerald-400/50 transition-all duration-500 rounded-b-xl" />
    </div>
  );
};

/* ------------------ MAIN COMPONENT ------------------ */
const Stats = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);
  const [projectsCount, setProjectsCount] = useState(0);
  const [experienceCount, setExperienceCount] = useState(0);
  const [skillsCount, setSkillsCount] = useState(0);

  // fire once when ~30% of the section becomes visible
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/projects`)
      .then((res) => res.json())
      .then((data) => setProjectsCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/resume`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setExperienceCount(0);
          return;
        }
        const count = data.filter(
          (entry) => entry?.category?.toLowerCase() === "professional experience"
        ).length;
        setExperienceCount(count);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/skills`)
      .then((res) => res.json())
      .then((data) => setSkillsCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, []);

  const items = [
    { value: projectsCount, suffix: "", label: "Successful Projects", icon: FaRocket },
    // { value: experienceCount, suffix: "+", label: "Professional Experiences", icon: FaCode },
    // { value: 100, suffix: "+", label: "Happy Clients", icon: FaUsers },
    { value: skillsCount, suffix: "+", label: "Technologies", icon: FaAward },
  ];

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-24 overflow-hidden"
      style={{ backgroundColor: statsData.bg }}
      aria-labelledby="stats-title"
    >
      {/* Animated background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-emerald-500/5 via-cyan-400/5 to-emerald-500/5 blur-2xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-12">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-white text-xs md:text-sm font-medium">
            Statistics
          </div>
          <h2
            id="stats-title"
            className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text
                       bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400
                       drop-shadow-[0_0_30px_rgba(44,255,125,0.4)]"
          >
            {statsData.title}
          </h2>
          <p className="mt-4 text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            {statsData.subtitle}
          </p>
          <div className="mx-auto mt-6 h-[2px] w-32 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.6)]" />
        </div>

        {/* Stats Grid */}
        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
          {items.map((it, i) => (
            <div key={i} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <StatCard
                value={it.value}
                suffix={it.suffix}
                label={it.label}
                icon={it.icon}
                active={inView}
              />
            </div>
          ))}
        </div>

        {/* Bottom divider */}
        <div className="mt-16 h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent rounded-full" />
      </div>
    </section>
  );
};

export default Stats;
