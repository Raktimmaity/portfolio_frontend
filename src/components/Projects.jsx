import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

// Example project data
const fallbackProjects = [
  {
    title: "Vibe & Vine Bar and Restaurant",
    date: "Sat, Apr 30th 2025",
    desc: "Vibe and Vine is a modern, elegant bar and restaurant website with a stylish design and seamless functionality. Built using React & Tailwind CSS for the frontend and Node.js with Express on the backend, with MongoDB for reservations.",
    img: "https://picsum.photos/400?random=1",
    tech: ["Tailwind CSS", "React JS", "Node.js", "MongoDB"],
    link: "#",
  },
  {
    title: "Real Estate Business Website",
    date: "Sat, Feb 23rd 2025",
    desc: "A fully functional real estate platform for property listing, searching, and management. Features include multi-level dashboards, secure login with hashed passwords, mobile-responsive design with Bootstrap, and backend built using PHP & MySQL.",
    img: "https://picsum.photos/400?random=1",
    tech: ["HTML", "CSS", "JavaScript", "Bootstrap", "MySQL", "PHP"],
    link: "#",
  },
];

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" }
  },
});

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => {});
  }, []);

  const displayProjects = projects.length
    ? projects.map((proj) => ({
      title: proj?.title || "Untitled Project",
      date: proj?.createdAt ? new Date(proj.createdAt).toDateString() : "",
      desc: proj?.description || "",
      img: proj?.imageUrl || "https://picsum.photos/400?random=1",
      tech: Array.isArray(proj?.skills) ? proj.skills : [],
      link: proj?.projectLink || "",
    }))
    : fallbackProjects;

  return (
    <section
      id="projects"
      className="relative py-20 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Animated Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-lime-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Title */}
        <motion.div
          variants={fadeIn(0)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)] mb-4">
            Projects
          </h2>
          <div className="mx-auto h-[2px] w-32 rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        </motion.div>

        {/* Projects List */}
        <div className="space-y-10">
          {displayProjects.map((proj, i) => (
            <motion.div
              key={i}
              variants={fadeIn(i * 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="group relative flex flex-col md:flex-row items-center md:items-start gap-6 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#0a1224]/80 to-[#050914]/80 border border-emerald-400/20 hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300 backdrop-blur-sm"
            >
              {/* Image */}
              <div className="w-full md:w-2/5 flex-shrink-0">
                <div className="relative overflow-hidden rounded-xl border-2 border-emerald-400/30 group-hover:border-emerald-400/60 transition-all duration-300">
                  <img
                    src={proj.img}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050914]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4">
                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-lime-200 flex items-center gap-3">
                  {proj.title}
                  {/* <FaExternalLinkAlt className="text-emerald-400 text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> */}
                </h3>

                {/* Date */}
                <p className="flex items-center gap-2 text-sm text-emerald-300 font-semibold">
                  <FaCalendarAlt className="text-emerald-400" />
                  {proj.date}
                </p>

                {/* Description */}
                <p className="text-sm md:text-base leading-relaxed text-slate-300">
                  {proj.desc}
                </p>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-2">
                  {proj.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-500/20 to-lime-500/20 text-emerald-300 border border-emerald-400/40 hover:border-emerald-400/70 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Visit button */}
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] hover:scale-105 transition-all duration-300"
                  >
                    <span>Visit Project</span>
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          variants={fadeIn(0.3)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/my-projects"
            className="inline-flex items-center gap-3 px-8 py-4 text-base font-bold text-white rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] hover:scale-105 transition-all duration-300"
          >
            <span>View More Projects</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
