import React, { useEffect, useState } from "react";
import { FaMicrophone, FaBook, FaPen } from "react-icons/fa";
import { motion } from "framer-motion";

// ---------- DATA (edit here) ----------
const languageData = [
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
      <div className="w-12 h-12 rounded-full border border-cyan-400/40 flex items-center justify-center shadow-[0_0_14px_rgba(34,211,238,0.45)]">
        {icon}
      </div>
      <span className="text-sm text-cyan-200">{label}</span>
      <span className="px-2 py-0.5 text-xs rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/30">
        {count}%
      </span>
    </div>
  );
};

const ProgressBar = ({ value }) => {
  const count = useCounter(value, 1200);
  return (
    <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden border border-cyan-400/20">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 shadow-[0_0_16px_rgba(34,211,238,0.6)]"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={count}
        role="progressbar"
      />
    </div>
  );
};

const LanguageSection = () => {
  return (
    <section id="language" className="py-16 px-6 md:px-12 max-w-6xl mx-auto">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 pb-8">
        Language
      </h2>
      {/* half-width divider under the heading */}
      <div className="flex justify-center -mt-6 mb-8" aria-hidden="true">
        <span className="inline-block h-[2px] w-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      </div>


      <div className="grid md:grid-cols-2 gap-8">
        {languageData.map((lang, idx) => {
          const overallCount = useCounter(lang.overall, 1200);
          return (
            <motion.div
              key={idx}
              className="rounded-xl p-5 bg-gradient-to-br from-gray-900/70 to-gray-800/50 border border-cyan-400/30 hover:shadow-[0_0_18px_rgba(34,211,238,0.35)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg md:text-xl font-semibold text-white">
                  {lang.name}
                </h3>
                <span className="text-sm text-cyan-200">{overallCount}%</span>
              </div>

              {/* Overall progress */}
              <ProgressBar value={lang.overall} />

              {/* Speak / Read / Write */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-6">
                <SkillPill
                  icon={<FaMicrophone className="text-cyan-300" />}
                  label="Speak"
                  value={lang.skills.speak}
                />
                <SkillPill
                  icon={<FaBook className="text-cyan-300" />}
                  label="Read"
                  value={lang.skills.read}
                />
                <SkillPill
                  icon={<FaPen className="text-cyan-300" />}
                  label="Write"
                  value={lang.skills.write}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default LanguageSection;
