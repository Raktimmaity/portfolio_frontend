import React, { useEffect, useMemo, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

const fallbackEducationData = [
  { title: "SECONDARY (10TH STANDARD)", year: "2013 - 2019", place: "Nakturi Thakdars Institution", desc: "Appeared 10th exam (W.B.B.S.E) and scored 66.40%.", dotColor: "bg-emerald-400" },
  { title: "HIGHER SECONDARY (12TH STANDARD)", year: "2019 - 2021", place: "Kalam Santoshini High School", desc: "Appeared 12th exam (W.B.C.H.S.E) and scored 86%.", dotColor: "bg-emerald-400" },
  { title: "B.TECH C.S.E (AI-ML)", year: "2021 - 2025", place: "Brainware University", desc: "Pursuing B.Tech in CSE (AI-ML). Last semester SGPA: 8.507.", dotColor: "bg-emerald-400" },
];

const fallbackExperienceData = [
  { title: "INDUSTRIAL TRAINING", year: "Aug 2022 - Sep 2022", place: "Webskitters Academy", desc: "Learned front-end web dev (HTML, CSS, JS) during training & IV.", dotColor: "bg-lime-400" },
  { title: "INDUSTRIAL TRAINING", year: "May 2024 - July 2024", place: "Intel", desc: "Completed TeleICU Patient Monitoring internship (ML + DL).", dotColor: "bg-lime-400" },
];

// simple, column-level animations
const fadeIn = (x) => ({
  hidden: { opacity: 0, x },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
});

const Resume = () => {
  const [entries, setEntries] = useState([]);
  const [cv, setCv] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/resume`)
      .then((res) => res.json())
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/cv`)
      .then((res) => res.json())
      .then((data) => setCv(data))
      .catch(() => {});
  }, []);

  const { educationData, experienceData } = useMemo(() => {
    if (!entries.length) {
      return {
        educationData: fallbackEducationData,
        experienceData: fallbackExperienceData,
      };
    }
    const education = [];
    const experience = [];
    entries.forEach((entry) => {
      const item = {
        title: entry?.title || "",
        year: entry?.duration || "",
        place: entry?.organization || "",
        desc: entry?.description || "",
        dotColor: entry?.category?.toLowerCase() === "professional experience" ? "bg-lime-400" : "bg-emerald-400",
      };
      if (entry?.category?.toLowerCase() === "education") education.push(item);
      if (entry?.category?.toLowerCase() === "professional experience") experience.push(item);
    });
    return {
      educationData: education.length ? education : fallbackEducationData,
      experienceData: experience.length ? experience : fallbackExperienceData,
    };
  }, [entries]);

  const showCvButton = Boolean(cv?.isActive && cv?.fileUrl);

  return (
    <section
      id="resume"
      className="relative py-20 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Animated Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-lime-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)] mb-4">
            Resume
          </h2>
          <div className="mx-auto h-[2px] w-32 rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Education */}
          <motion.div
            variants={fadeIn(-60)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            {/* Section Header */}
            <div className="mb-8 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-emerald-400 to-lime-400 rounded-full"></div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-lime-300">
                Education
              </h3>
            </div>

            {/* Timeline */}
            <div className="space-y-8 relative border-l-2 border-emerald-400/30 pl-8">
              {educationData.map((edu, index) => (
                <div className="relative group" key={index}>
                  {/* Timeline Dot */}
                  <span className={`absolute -left-[37px] top-1 w-5 h-5 rounded-full ${edu.dotColor} shadow-[0_0_15px_rgba(16,185,129,0.8)] ring-4 ring-[#050914] group-hover:scale-125 transition-transform`}></span>

                  {/* Card */}
                  <div className="bg-gradient-to-br from-[#0a1224]/80 to-[#050914]/80 rounded-xl p-5 border border-emerald-400/20 hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 backdrop-blur-sm">
                    <h4 className="text-base font-bold text-emerald-100 mb-2">{edu.title}</h4>
                    <p className="text-emerald-300 text-sm font-semibold mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {edu.year}
                    </p>
                    <p className="text-slate-200 font-semibold text-sm mb-1">{edu.place}</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{edu.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Experience */}
          <motion.div
            variants={fadeIn(60)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative"
          >
            {/* Section Header */}
            <div className="mb-8 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-lime-400 to-emerald-400 rounded-full"></div>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-emerald-300">
                Professional Experience
              </h3>
            </div>

            {/* Timeline */}
            <div className="space-y-8 relative border-l-2 border-lime-400/30 pl-8">
              {experienceData.map((exp, index) => (
                <div className="relative group" key={index}>
                  {/* Timeline Dot */}
                  <span className={`absolute -left-[37px] top-1 w-5 h-5 rounded-full ${exp.dotColor} shadow-[0_0_15px_rgba(163,230,53,0.8)] ring-4 ring-[#050914] group-hover:scale-125 transition-transform`}></span>

                  {/* Card */}
                  <div className="bg-gradient-to-br from-[#0a1224]/80 to-[#050914]/80 rounded-xl p-5 border border-lime-400/20 hover:border-lime-400/50 hover:shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all duration-300 backdrop-blur-sm">
                    <h4 className="text-base font-bold text-lime-100 mb-2">{exp.title}</h4>
                    <p className="text-lime-300 text-sm font-semibold mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {exp.year}
                    </p>
                    <p className="text-slate-200 font-semibold text-sm mb-1">{exp.place}</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{exp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Download CV Button */}
        {showCvButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <a
              href={`${API_BASE}/api/cv/download`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] hover:scale-105 transition-all duration-300"
            >
              <FaDownload className="text-xl" />
              <span>Download CV</span>
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Resume;
