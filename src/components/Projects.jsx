import React from "react";
import { FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";

// Example project data
const projects = [
  {
    title: "Vibe & Vine Bar and Restaurant",
    date: "Sat, Apr 30th 2025",
    desc: "Vibe and Vine is a modern, elegant bar and restaurant website with a stylish design and seamless functionality. Built using React & Tailwind CSS for the frontend and Node.js with Express on the backend, with MongoDB for reservations.",
    img: "https://picsum.photos/400?random=1", // replace with your image
    tech: ["Tailwind CSS", "React JS", "Node.js", "MongoDB"],
    link: "#",
  },
  {
    title: "Real Estate Business Website",
    date: "Sat, Feb 23rd 2025",
    desc: "A fully functional real estate platform for property listing, searching, and management. Features include multi-level dashboards, secure login with hashed passwords, mobile-responsive design with Bootstrap, and backend built using PHP & MySQL.",
    img: "https://picsum.photos/400?random=1", // replace with your image
    tech: ["HTML", "CSS", "JavaScript", "Bootstrap", "MySQL", "PHP"],
    link: "#",
  },
];

const Projects = () => {
  return (
    <section
      id="projects"
      className="relative py-16 px-6 md:px-12 max-w-6xl mx-auto mt-20"
    >
      {/* Glow effect */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-green-500/10 to-blue-500/10 blur-2xl rounded-2xl"></div> */}

      <div className="relative">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 mb-10">
          Projects
        </h2>
        {/* half-width divider under the heading */}
<div className="flex justify-center -mt-6 mb-8" aria-hidden="true">
  <span className="inline-block h-[2px] w-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
</div>


        <div className="space-y-12">
          {projects.map((proj, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 rounded-xl bg-gradient-to-br from-gray-900/70 to-gray-800/50 border border-cyan-400/30 hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition"
            >
              {/* Image */}
              <div className="w-full md:w-1/3">
                <img
                  src={proj.img}
                  alt={proj.title}
                  className="rounded-lg shadow-lg border border-cyan-400/20"
                />
              </div>

              {/* Content */}
              <div className="flex-1 text-gray-200">
                <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                  {proj.title}
                  <FaExternalLinkAlt className="text-cyan-400" />
                </h3>

                <p className="flex items-center gap-2 text-sm text-cyan-300 mt-1">
                  <FaCalendarAlt /> {proj.date}
                </p>

                <p className="mt-3 text-sm leading-relaxed">{proj.desc}</p>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {proj.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-cyan-500 to-green-500 text-white"
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
                    className="inline-block mt-5 px-5 py-2 text-sm font-medium text-white rounded-full bg-gradient-to-r from-cyan-500 to-green-500  hover:shadow-[0_0_15px_rgba(34,211,238,1)] transition"
                  >
                    Visit Project
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
