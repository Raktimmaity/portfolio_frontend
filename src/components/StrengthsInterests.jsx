import React from "react";
import { motion } from "framer-motion";
import { FaBolt, FaCheckCircle } from "react-icons/fa";

/* --------- data --------- */
const strengths = [
  "Good Listener",
  "Punctual",
  "Quick Learner",
  "Learn new things",
  "Dedicated",
];

const interests = [
  "Video Gaming",
  "Learn new things",
  "Watching movies",
  "Finding errors/bugs in code",
  "Drawing",
];

/* --------- animations --------- */
const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const gridVariant = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const itemVariant = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

const StrengthsInterests = () => {
  return (
    <motion.section
      id="strengths-interests"
      className="relative py-16 px-6 md:px-12 max-w-6xl mx-auto mt-20"
      variants={sectionVariant}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      aria-labelledby="si-title"
    >
      {/* title */}
      <h2
        id="si-title"
        className="text-center text-3xl md:text-4xl font-bold text-transparent bg-clip-text
                   bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400
                   mb-10"
      >
        Strengths & Interests
      </h2>
      {/* half-width divider under the heading */}
<div className="flex justify-center -mt-6 mb-8" aria-hidden="true">
  <span className="inline-block h-[2px] w-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
</div>


      {/* subtle divider glow behind the grid */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="mx-auto h-32 w-3/4 blur-[60px] opacity-30 
                        bg-gradient-to-r from-cyan-500/30 via-green-500/30 to-blue-500/30" />
      </div>

      {/* grid */}
      <motion.div
        className="grid md:grid-cols-2 gap-8"
        variants={gridVariant}
      >
        {/* strengths card */}
        <motion.div
          variants={cardVariant}
          className="relative p-6 rounded-xl bg-gradient-to-br from-gray-900/70 to-gray-800/50 
                     border border-cyan-400/30
                     hover:shadow-[0_0_30px_rgba(34,211,238,0.35)] transition"
        >
          {/* header pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          bg-black/40 border border-cyan-400/40
                          shadow-[0_0_12px_rgba(34,211,238,0.45)] mb-4">
            <FaBolt className="text-cyan-300" aria-hidden />
            <span className="text-sm font-semibold text-transparent bg-clip-text 
                             bg-gradient-to-r from-cyan-400 to-green-400">
              Strengths
            </span>
          </div>

          {/* list */}
          <ul className="space-y-3">
            {strengths.map((s, i) => (
              <motion.li
                key={s}
                variants={itemVariant}
                className="flex items-start gap-3 group"
              >
                <span className="mt-1 inline-flex h-2 w-2 rounded-full 
                                 bg-gradient-to-r from-cyan-400 to-green-400 
                                 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                <span className="text-gray-200 group-hover:text-white transition">
                  {s}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* interests card */}
        <motion.div
          variants={cardVariant}
          className="relative p-6 rounded-xl bg-gradient-to-br from-gray-900/70 to-gray-800/50 
                     border border-green-400/30
                     hover:shadow-[0_0_30px_rgba(34,211,238,0.35)] transition"
        >
          {/* header pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                          bg-black/40 border border-green-400/40
                          shadow-[0_0_12px_rgba(34,211,238,0.45)] mb-4">
            <FaCheckCircle className="text-green-300" aria-hidden />
            <span className="text-sm font-semibold text-transparent bg-clip-text 
                             bg-gradient-to-r from-green-400 to-cyan-400">
              Interests
            </span>
          </div>

          {/* list */}
          <ul className="space-y-3">
            {interests.map((it) => (
              <motion.li
                key={it}
                variants={itemVariant}
                className="flex items-start gap-3 group"
              >
                <span className="mt-1 inline-flex h-2 w-2 rounded-full 
                                 bg-gradient-to-r from-green-400 to-cyan-400 
                                 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                <span className="text-gray-200 group-hover:text-white transition">
                  {it}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      {/* bottom CTA / accent line */}
      <div className="mt-8 h-px w-full bg-gradient-to-r 
                      from-transparent via-cyan-500/40 to-transparent" />
    </motion.section>
  );
};

export default StrengthsInterests;
