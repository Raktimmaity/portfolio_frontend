import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaSkype,
  FaLinkedinIn,
  FaGithub,
  FaMapMarkerAlt,
  FaUniversity,
  FaBuilding,
  FaCode,
  FaLaptopCode,
  FaMobileAlt,
  FaDatabase,
  FaGraduationCap,
  FaBriefcase,
  FaAward,
  FaRocket,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const NeonCard = ({ className = "", children }) => (
  <div
    className={
      "rounded-xl border border-emerald-400/25 bg-white/[0.02] backdrop-blur " +
      "hover:shadow-[0_0_28px_rgba(16,185,129,0.25)] transition-all duration-300 " +
      className
    }
  >
    {children}
  </div>
);

const Chip = ({ children }) => (
  <span className="inline-block text-xs md:text-sm rounded-md px-2.5 py-1 border border-emerald-400/30 bg-emerald-400/10 shadow-[0_0_10px_rgba(16,185,129,0.25)] hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-300 mr-2 mb-2">
    {children}
  </span>
);

const AboutMe = () => {
  return (
    <main className="min-h-screen bg-[#070b17] text-slate-100 pt-24 pb-16 px-4 md:px-6 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Page heading */}
        <div className="max-w-7xl mx-auto mb-12">
          <h1 className="text-center text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            About Me
          </h1>
          <div className="mx-auto mt-3 h-[2px] w-40 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.6)]" />
          <p className="text-center text-slate-400 mt-4 max-w-2xl mx-auto">
            Passionate Web Developer & AI Enthusiast
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* === LEFT SIDEBAR === */}
          <section className="space-y-6">
            {/* Profile card */}
            <NeonCard className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 blur-md opacity-50 animate-pulse" />
                  <img
                    src="https://picsum.photos/100/100?random=1"
                    alt="Raktim Maity"
                    className="relative h-40 w-40 rounded-full object-cover ring-4 ring-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                  />
                  <div className="absolute bottom-2 right-2 h-5 w-5 bg-emerald-400 rounded-full border-4 border-[#070b17] shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                </div>

                <div className="mt-6 text-center">
                  <h4 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    Raktim Maity
                  </h4>
                  <p className="text-emerald-300 text-sm mt-2 font-medium">
                    Full Stack Developer
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    AI & ML Enthusiast
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 w-full">
                  <div className="rounded-lg bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-400/30 text-center py-4 hover:border-emerald-400/50 transition-all">
                    <div className="text-3xl font-bold text-emerald-400">37</div>
                    <div className="text-xs text-slate-300 mt-1">Projects</div>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-400/30 text-center py-4 hover:border-cyan-400/50 transition-all">
                    <div className="text-3xl font-bold text-cyan-400">412</div>
                    <div className="text-xs text-slate-300 mt-1">Visitors</div>
                  </div>
                </div>

                <Link
                  to="/contact-me"
                  className="mt-6 w-full text-center rounded-xl px-6 py-3 font-semibold text-black bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.55)] hover:shadow-[0_0_30px_rgba(16,185,129,0.8)] hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FaRocket />
                    Hire Me
                  </span>
                </Link>
              </div>
            </NeonCard>

            {/* Contact Info */}
            <NeonCard className="p-5 space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-emerald-400 mb-4">
                Contact Info
              </h3>
              <div className="flex items-start gap-3 text-sm">
                <FaUniversity className="text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-slate-400 text-xs">Education</div>
                  <div className="text-slate-200">Brainware University</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <FaMapMarkerAlt className="text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-slate-400 text-xs">Location</div>
                  <div className="text-slate-200">Tamluk, West Bengal</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <FaBuilding className="text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-slate-400 text-xs">Status</div>
                  <div className="text-slate-200">Available for Work</div>
                </div>
              </div>
            </NeonCard>

            {/* Socials */}
            <NeonCard className="p-5">
              <h3 className="text-center font-semibold text-sm uppercase tracking-wider text-emerald-400 mb-4">
                Connect With Me
              </h3>
              <div className="flex justify-center gap-3 flex-wrap">
                {[
                  { Icon: FaFacebookF, color: "from-blue-500 to-blue-600" },
                  { Icon: FaInstagram, color: "from-pink-500 to-purple-600" },
                  { Icon: FaSkype, color: "from-cyan-500 to-blue-500" },
                  { Icon: FaLinkedinIn, color: "from-blue-600 to-blue-700" },
                  { Icon: FaGithub, color: "from-gray-700 to-gray-800" },
                ].map(({ Icon, color }, i) => (
                  <a
                    key={i}
                    href="#"
                    className={`p-3 rounded-full text-white bg-gradient-to-br ${color} shadow-lg hover:shadow-emerald-500/50 hover:scale-110 transition-all duration-300`}
                  >
                    <Icon className="text-lg" />
                  </a>
                ))}
              </div>
            </NeonCard>

            {/* Skills */}
            <NeonCard className="p-5">
              <h3 className="mb-4 text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                Technical Skills
              </h3>
              <div className="flex flex-wrap">
                {[
                  "HTML",
                  "CSS",
                  "JavaScript",
                  "Tailwind CSS",
                  "Bootstrap",
                  "C",
                  "C++",
                  "Python",
                  "Java",
                  "MySQL",
                  "PHP",
                  "React.js",
                  "WordPress",
                  "Git",
                ].map((skill) => (
                  <Chip key={skill}>{skill}</Chip>
                ))}
              </div>
            </NeonCard>
          </section>

          {/* === MAIN CONTENT === */}
          <section className="lg:col-span-2 space-y-6">
            {/* About Me Section */}
            <NeonCard className="p-6 md:p-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-emerald-400">
                  <FaCode />
                </span>
                <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  About Me
                </span>
              </h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p className="text-lg">
                  Hello! I'm <span className="text-emerald-400 font-semibold">Raktim Maity</span>,
                  a passionate Full Stack Web Developer and AI enthusiast currently pursuing a
                  Bachelor's degree in Computer Science and Engineering with specialization in
                  Artificial Intelligence and Machine Learning from Brainware University.
                </p>
                <p>
                  I thrive on creating innovative web solutions that combine elegant design with
                  powerful functionality. My journey in software development has equipped me with
                  a diverse skill set spanning front-end and back-end technologies, enabling me to
                  build complete, production-ready applications.
                </p>
                <p>
                  I seek challenging opportunities where I can leverage my technical expertise and
                  creative problem-solving abilities to deliver exceptional results. My goal is to
                  contribute to cutting-edge projects while continuously expanding my knowledge in
                  emerging technologies, particularly in the fields of AI and web development.
                </p>
              </div>
            </NeonCard>

            {/* Personal Info Grid */}
            <NeonCard className="p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-emerald-400">
                  <FaGraduationCap />
                </span>
                <span>Personal Information</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", value: "Raktim Maity" },
                  { label: "Education", value: "Brainware University" },
                  { label: "Location", value: "Tamluk, West Bengal" },
                  { label: "Country", value: "India" },
                  { label: "Phone", value: "+91 6295396929" },
                  { label: "Email", value: "reach.raktimmaity@gmail.com" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-white/5 to-white/[0.02] p-4 rounded-lg border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300 group"
                  >
                    <div className="text-xs text-emerald-400 mb-1 font-medium uppercase tracking-wider">
                      {item.label}
                    </div>
                    <div className="text-slate-100 font-medium group-hover:text-emerald-400 transition-colors">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </NeonCard>

            {/* What I Do Section */}
            <NeonCard className="p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-emerald-400">
                  <FaBriefcase />
                </span>
                <span>What I Do</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    icon: FaLaptopCode,
                    title: "Web Development",
                    desc: "Building responsive and dynamic web applications using modern frameworks and technologies.",
                  },
                  {
                    icon: FaMobileAlt,
                    title: "Frontend Design",
                    desc: "Creating beautiful, user-friendly interfaces with React, Tailwind CSS, and modern design principles.",
                  },
                  {
                    icon: FaDatabase,
                    title: "Backend Development",
                    desc: "Developing robust server-side applications and APIs with efficient database management.",
                  },
                  {
                    icon: FaAward,
                    title: "Problem Solving",
                    desc: "Applying algorithmic thinking and data structures to solve complex technical challenges.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 p-5 rounded-lg border border-emerald-400/20 hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 group"
                  >
                    <item.icon className="text-3xl text-emerald-400 mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <h4 className="text-lg font-semibold mb-2 text-slate-100">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </NeonCard>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AboutMe;
