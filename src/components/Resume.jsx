import React from "react";
import { FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";

const educationData = [
  { title: "SECONDARY (10TH STANDARD)", year: "2013 - 2019", place: "Nakturi Thakdars Institution", desc: "Appeared 10th exam (W.B.B.S.E) and scored 66.40%.", dotColor: "bg-cyan-400" },
  { title: "HIGHER SECONDARY (12TH STANDARD)", year: "2019 - 2021", place: "Kalam Santoshini High School", desc: "Appeared 12th exam (W.B.C.H.S.E) and scored 86%.", dotColor: "bg-cyan-400" },
  { title: "B.TECH C.S.E (AI-ML)", year: "2021 - 2025", place: "Brainware University", desc: "Pursuing B.Tech in CSE (AI-ML). Last semester SGPA: 8.507.", dotColor: "bg-cyan-400" },
];

const experienceData = [
  { title: "INDUSTRIAL TRAINING", year: "Aug 2022 - Sep 2022", place: "Webskitters Academy", desc: "Learned front-end web dev (HTML, CSS, JS) during training & IV.", dotColor: "bg-green-400" },
  { title: "INDUSTRIAL TRAINING", year: "May 2024 - July 2024", place: "Intel", desc: "Completed TeleICU Patient Monitoring internship (ML + DL).", dotColor: "bg-green-400" },
];

// simple, column-level animations
const fadeIn = (x) => ({
  hidden: { opacity: 0, x },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
});

const Resume = () => {
  return (
    <section
      id="resume"
      className="relative py-16 px-6 md:px-12  max-w-6xl mx-auto mt-20"
    >
      {/* <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-green-500/10 to-blue-500/10 blur-2xl rounded-2xl"></div> */}

      <div className="relative">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 mb-10">
          Resume
        </h2>
        {/* half-width divider under the heading */}
        <div className="flex justify-center -mt-6 mb-8" aria-hidden="true">
          <span className="inline-block h-[2px] w-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        </div>


        <div className="grid md:grid-cols-2 gap-12">
          {/* Education */}
          <motion.div
            variants={fadeIn(-60)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-white mb-6 border-l-4 border-cyan-400 pl-3 bg-gray-800 py-2">Education</h3>
            <div className="space-y-8 relative border-l-2 border-cyan-400/40 pl-6">
              {educationData.map((edu, index) => (
                <div className="relative" key={index}>
                  <span className={`absolute -left-[33px] top-0 w-4 h-4 rounded-full ${edu.dotColor} shadow-[0_0_12px_rgba(34,211,238,0.8)]`}></span>
                  <h4 className="bg-gray-800/50 px-3 py-1 rounded-md text-sm font-semibold text-white inline-block">{edu.title}</h4>
                  <p className="text-cyan-300 text-xs mt-1">{edu.year}</p>
                  <p className="text-gray-300 mt-2 text-sm">{edu.place} <br /> {edu.desc}</p>
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
          >
            <h3 className="text-xl font-semibold text-white mb-6 border-l-4 border-cyan-400 pl-3 bg-gray-800 py-2">Professional Experience</h3>
            <div className="space-y-8 relative border-l-2 border-cyan-400/40 pl-6">
              {experienceData.map((exp, index) => (
                <div className="relative" key={index}>
                  <span className={`absolute -left-[33px] top-0 w-4 h-4 rounded-full ${exp.dotColor} shadow-[0_0_12px_rgba(34,211,238,0.8)]`}></span>
                  <h4 className="bg-gray-800/50 px-3 py-1 rounded-md text-sm font-semibold text-white inline-block">{exp.title}</h4>
                  <p className="text-cyan-300 text-xs mt-1">{exp.year}</p>
                  <p className="text-gray-300 mt-2 text-sm">{exp.place} <br /> {exp.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Download CV */}
        <div className="text-center mt-12">
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-500 to-green-500 text-white rounded-full hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition"
          >
            <FaDownload /> Download CV
          </a>
        </div>
      </div>
    </section>
  );
};

export default Resume;
