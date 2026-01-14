import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaHtml5, FaCss3Alt, FaJs, FaBootstrap, FaPython,
  FaDatabase, FaReact, FaGitAlt, FaPhp, FaWordpress, FaJava, FaCode,
} from "react-icons/fa";
import { SiTailwindcss, SiC } from "react-icons/si";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

const Skills = () => {
  const [inView, setInView] = useState(false);
  const [counts, setCounts] = useState({});
  const [skillsData, setSkillsData] = useState([]);
  const sectionRef = useRef(null);

  const fallbackSkills = [
    { name: "HTML", level: 85, icon: <FaHtml5 className="text-emerald-400" /> },
    { name: "CSS", level: 75, icon: <FaCss3Alt className="text-green-400" /> },
    { name: "JAVASCRIPT", level: 55, icon: <FaJs className="text-lime-400" /> },
    { name: "TAILWIND CSS", level: 75, icon: <SiTailwindcss className="text-emerald-300" /> },
    { name: "BOOTSTRAP", level: 60, icon: <FaBootstrap className="text-green-500" /> },
    { name: "C LANGUAGE", level: 75, icon: <SiC className="text-lime-400" /> },
    { name: "PYTHON", level: 60, icon: <FaPython className="text-emerald-400" /> },
    { name: "JAVA", level: 50, icon: <FaJava className="text-green-400" /> },
    { name: "MYSQL", level: 60, icon: <FaDatabase className="text-emerald-300" /> },
    { name: "PHP", level: 50, icon: <FaPhp className="text-lime-400" /> },
    { name: "REACT JS", level: 35, icon: <FaReact className="text-emerald-400" /> },
    { name: "WORDPRESS", level: 30, icon: <FaWordpress className="text-green-500" /> },
    { name: "GIT", level: 40, icon: <FaGitAlt className="text-lime-400" /> },
  ];

  const skills = useMemo(() => {
    if (!skillsData.length) return fallbackSkills;
    return skillsData.map((skill) => ({
      name: skill?.name || "Skill",
      level: Number(skill?.percentage) || 0,
      icon: skill?.imageUrl ? (
        <img
          src={skill.imageUrl}
          alt={skill?.name || "Skill"}
          className="w-6 h-6 object-contain"
        />
      ) : (
        <FaCode className="text-emerald-400" />
      ),
    }));
  }, [skillsData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/skills`)
      .then((res) => res.json())
      .then((data) => setSkillsData(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Number counter (runs outside React re-renders)
  useEffect(() => {
    if (inView) {
      skills.forEach((skill) => {
        let start = 0;
        const end = skill.level;
        const duration = 1200;
        const startTime = performance.now();

        const update = (time) => {
          const progress = Math.min((time - startTime) / duration, 1);
          const value = Math.floor(progress * end);
          setCounts((prev) => ({ ...prev, [skill.name]: value }));
          if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
      });
    }
  }, [inView, skills]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-20 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Animated Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)] mb-4">
            My Skills
          </h2>
          <div className="mx-auto h-[2px] w-32 rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-[#0a1224]/80 to-[#050914]/80 rounded-xl p-6 border border-emerald-400/20 hover:border-emerald-400/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all duration-300 backdrop-blur-sm"
            >
              {/* Skill Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-400/10 border border-emerald-400/30 group-hover:bg-emerald-400/20 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all">
                  <span className="text-3xl">{skill.icon}</span>
                </div>
                <div className="flex-1">
                  <span className="block text-slate-100 text-base md:text-lg font-bold tracking-wide">
                    {skill.name}
                  </span>
                  <span className="text-emerald-300 font-bold text-xl">
                    {inView ? counts[skill.name] || 0 : 0}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-[#0a1224] rounded-full h-3 overflow-hidden border border-emerald-400/20">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-emerald-400 via-green-400 to-lime-400 shadow-[0_0_15px_rgba(16,185,129,0.7)] transition-[width] duration-1000 ease-out relative overflow-hidden"
                    style={{
                      width: inView ? `${skill.level}%` : "0%",
                    }}
                  >
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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

export default Skills;
