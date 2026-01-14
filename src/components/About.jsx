import React, { useEffect, useState } from "react";
import { FaBirthdayCake, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

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
  role: "Front-End Web Developer",
  headline:
    "Hi, I'm Raktim Maity. A passionate Front-End Developer with skills in HTML, CSS, JavaScript, and React. I love crafting modern, responsive, and visually appealing web experiences.",
  statement:
    "I seek challenging opportunities where I can leverage my skills to contribute meaningfully, grow professionally, and work in an environment that values creativity, innovation, and continuous learning.",
  image: "https://res.cloudinary.com/dqj64anbj/image/upload/v1768025181/yc1xbf8mgvc4tqrp9waq.png",
  info: [
    {
      icon: <FaBirthdayCake className="text-emerald-400" />,
      label: "Birthday",
      value: "21 Aug, 2003",
    },
    {
      icon: <FaEnvelope className="text-emerald-400" />,
      label: "Email",
      value: "reach.raktimmaity@gmail.com",
    },
    {
      icon: <FaPhoneAlt className="text-emerald-400" />,
      label: "Mobile",
      value: "+91 6295396929",
    },
  ],
};

const About = () => {
  const [profile, setProfile] = useState(null);
  const [about, setAbout] = useState(null);
  const avatarSrc = profile?.avatar || aboutData.image;
  const infoItems = [
    {
      icon: <FaBirthdayCake className="text-emerald-400" />,
      label: "Birthday",
      value: profile?.birthday || aboutData.info[0].value,
    },
    {
      icon: <FaEnvelope className="text-emerald-400" />,
      label: "Email",
      value: profile?.email || aboutData.info[1].value,
    },
    {
      icon: <FaPhoneAlt className="text-emerald-400" />,
      label: "Mobile",
      value: profile?.phone || aboutData.info[2].value,
    },
  ];

  useEffect(() => {
    fetch(`${API_BASE}/api/profile`)
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/about`)
      .then((res) => res.json())
      .then((data) => setAbout(data))
      .catch(() => {});
  }, []);

  const headlineText = about?.shortDescription || aboutData.headline;
  const statementText = about?.longDescription || aboutData.statement;

  return (
    <section
      id="about"
      className="relative py-20 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Animated Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lime-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Title */}
        <motion.div
          variants={fadeIn("up")}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)] mb-4">
            About Me
          </h2>
          <div className="mx-auto h-[2px] w-32 rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        </motion.div>

        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Profile Image */}
          <motion.div
            variants={fadeIn("left")}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative flex-shrink-0"
          >
            {/* Glowing ring effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-green-400 to-lime-400 blur-2xl opacity-30 animate-pulse"></div>

            <div className="relative rounded-full border-4 border-emerald-400/60 shadow-[0_0_40px_rgba(16,185,129,0.7)] p-2 hover:scale-105 hover:shadow-[0_0_60px_rgba(16,185,129,0.9)] transition-all duration-500">
              <img
                src={avatarSrc}
                alt="Profile"
                className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover"
              />

              {/* Decorative corner accents */}
              <div className="absolute -top-3 -left-3 w-10 h-10 border-t-4 border-l-4 border-emerald-400 rounded-tl-full"></div>
              <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-4 border-r-4 border-lime-400 rounded-br-full"></div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            variants={fadeIn("right")}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="flex-1 space-y-6"
          >
            {/* Role Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-lime-500/20 border border-emerald-400/40 backdrop-blur-sm shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-lime-300">
                {profile?.job || aboutData.role}
              </h3>
            </div>

            {/* Headline */}
            <p className="text-base md:text-lg leading-relaxed text-slate-200">
              {headlineText}
            </p>

            {/* Info Cards */}
            <motion.div
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="grid grid-cols-1 gap-4"
            >
              {infoItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-gradient-to-r from-[#0a1224]/80 to-[#050914]/80 rounded-xl px-5 py-4 border border-emerald-400/30 hover:border-emerald-400/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 backdrop-blur-sm group"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-400/10 border border-emerald-400/30 group-hover:bg-emerald-400/20 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all">
                    {item.icon}
                  </div>
                  <span className="text-sm md:text-base text-slate-200">
                    <strong className="text-emerald-300">{item.label}:</strong>{" "}
                    <span className="text-slate-300">{item.value}</span>
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Final Statement */}
            <motion.div
              variants={fadeIn("up", 0.4)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-gradient-to-br from-emerald-500/10 to-lime-500/10 rounded-xl p-6 border border-emerald-400/30 backdrop-blur-sm"
            >
              <p className="leading-relaxed text-sm md:text-base text-slate-200">
                {statementText}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
