import React, { useEffect, useState } from "react";
import { FaMicrophone, FaBook, FaPen } from "react-icons/fa";
import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

// ---------- DATA (edit here) ----------
const fallbackLanguageData = [
  {
    name: "English",
    overall: 83, // overall proficiency %
    skills: { speak: 50, read: 100, write: 100 },
  },
  {
    name: "Hindi",
    overall: 30,
    skills: { speak: 50, read: 20, write: 20 },
  },
  {
    name: "Bengali",
    overall: 100,
    skills: { speak: 100, read: 100, write: 100 },
  },
];
// -------------------------------------

// Animated counter hook
const useCounter = (target, duration = 1000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(duration / target);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

const SkillPill = ({ icon, label, value }) => {
  const count = useCounter(value, 800);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-full border-2 border-emerald-400/40 flex items-center justify-center shadow-[0_0_14px_rgba(16,185,129,0.45)] hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:border-emerald-400/70 transition-all">
        {icon}
      </div>
      <span className="text-sm text-emerald-200 font-medium">{label}</span>
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
        {count}%
      </span>
    </div>
  );
};

const ProgressBar = ({ value }) => {
  const count = useCounter(value, 1200);
  return (
    <div className="w-full h-3 rounded-full bg-[#0a1224] overflow-hidden border border-emerald-400/20">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-green-400 to-lime-400 shadow-[0_0_16px_rgba(16,185,129,0.7)] relative overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={count}
        role="progressbar"
      >
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
      </motion.div>
    </div>
  );
};

const LanguageSection = () => {
  const [languageData, setLanguageData] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/languages`)
      .then((res) => res.json())
      .then((data) =>
        setLanguageData(
          Array.isArray(data)
            ? data.map((lang) => ({
                name: lang?.name || "Language",
                overall: Number(lang?.percentage) || 0,
                skills: {
                  speak: Number(lang?.speak) || 0,
                  read: Number(lang?.read) || 0,
                  write: Number(lang?.write) || 0,
                },
              }))
            : []
        )
      )
      .catch(() => {});
  }, []);

  const displayLanguages = languageData.length ? languageData : fallbackLanguageData;

  return (
    <section id="language" className="relative py-20 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
      {/* Animated Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-lime-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)] mb-4">
            Languages
          </h2>
          <div className="mx-auto h-[2px] w-32 rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        </motion.div>

        {/* Languages Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {displayLanguages.map((lang, idx) => {
            const overallCount = useCounter(lang.overall, 1200);
            return (
              <motion.div
                key={idx}
                className="group relative rounded-2xl p-6 md:p-8 bg-gradient-to-br from-[#0a1224]/80 to-[#050914]/80 border border-emerald-400/20 hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300 backdrop-blur-sm"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-lime-200">
                    {lang.name}
                  </h3>
                  <span className="text-lg font-bold text-emerald-300">{overallCount}%</span>
                </div>

                {/* Overall progress */}
                <ProgressBar value={lang.overall} />

                {/* Speak / Read / Write */}
                <div className="mt-6 flex flex-wrap items-center justify-around gap-6">
                  <SkillPill
                    icon={<FaMicrophone className="text-emerald-400 text-lg" />}
                    label="Speak"
                    value={lang.skills.speak}
                  />
                  <SkillPill
                    icon={<FaBook className="text-green-400 text-lg" />}
                    label="Read"
                    value={lang.skills.read}
                  />
                  <SkillPill
                    icon={<FaPen className="text-lime-400 text-lg" />}
                    label="Write"
                    value={lang.skills.write}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Shimmer Animation */}
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `}
      </style>
    </section>
  );
};

export default LanguageSection;
