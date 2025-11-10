import React from "react";
import { FaBirthdayCake, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

const fadeIn = (direction = "up", delay = 0) => {
  let x = 0, y = 0;
  if (direction === "left") x = -60;
  if (direction === "right") x = 60;
  if (direction === "up") y = 60;
  if (direction === "down") y = -60;

  return {
    hidden: { opacity: 0, x, y },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.6, delay, ease: "easeOut" },
    },
  };
};

// Centralized details object
const aboutData = {
  name: "Raktim Maity",
  role: "Front-End Web Developer | UI Developer",
  headline:
    "Hi, I’m Raktim Maity. A passionate Front-End Developer with skills in HTML, CSS, JavaScript, and React. I love crafting modern, responsive, and visually appealing web experiences.",
  statement:
    "I seek challenging opportunities where I can leverage my skills to contribute meaningfully, grow professionally, and work in an environment that values creativity, innovation, and continuous learning.",
  image: "https://picsum.photos/500/500?random=2",
  info: [
    {
      icon: <FaBirthdayCake className="text-cyan-400" />,
      label: "Birthday",
      value: "21 Aug, 2003",
    },
    {
      icon: <FaEnvelope className="text-cyan-400" />,
      label: "Email",
      value: "reach.raktimmaity@gmail.com",
    },
    {
      icon: <FaPhoneAlt className="text-cyan-400" />,
      label: "Mobile",
      value: "+91 6295396929",
    },
  ],
};

const About = () => {
  return (
    <section
      id="about"
      className="relative py-16 px-6 md:px-12 max-w-6xl mx-auto mt-20"
    >
      {/* Title */}
      <motion.h2
        variants={fadeIn("up")}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 mb-12"
      >
        About Me
      </motion.h2>
      {/* half-width divider under the heading */}
      <motion.div
        variants={fadeIn("up", 0.05)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="flex justify-center -mt-6 mb-8"
        aria-hidden="true"
      >
        <span className="inline-block h-[2px] w-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      </motion.div>


      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Profile Image */}
        <motion.div
          variants={fadeIn("left")}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative flex-shrink-0"
        >
          <div className="rounded-full border-4 border-cyan-400/60 shadow-[0_0_30px_rgba(34,211,238,0.8)] p-1 hover:scale-105 transition-transform">
            <img
              src={aboutData.image}
              alt="Profile"
              className="rounded-full w-56 h-56 md:w-64 md:h-64 object-cover"
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          variants={fadeIn("right")}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="flex-1 text-cyan-100"
        >
          {/* Role */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-green-500/20 px-4 py-2 rounded-md mb-6 border border-cyan-400/30 shadow-md shadow-cyan-500/30 text-center">
            <h3 className="text-xl md:text-2xl font-semibold text-cyan-200">
              {aboutData.role}
            </h3>
          </div>

          {/* Headline */}
          <p className="mb-6 text-base md:text-lg leading-relaxed">
            {aboutData.headline.split("Raktim Maity")[0]}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400">
              {aboutData.name}
            </span>
            {aboutData.headline.split("Raktim Maity")[1]}
          </p>

          {/* Info Cards */}
          <motion.div
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
          >
            {aboutData.info.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-gray-800/40 rounded-md px-4 py-3 border border-cyan-400/20 hover:shadow-[0_0_12px_rgba(34,211,238,0.5)] transition"
              >
                {item.icon}
                <span className="text-sm">
                  <strong>{item.label}:</strong> {item.value}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Final Statement */}
          <motion.p
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="leading-relaxed text-sm md:text-base"
          >
            {aboutData.statement}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
