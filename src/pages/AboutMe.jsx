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
} from "react-icons/fa";
import { Link } from "react-router-dom";

const NeonCard = ({ className = "", children }) => (
  <div
    className={
      "rounded-xl border border-emerald-400/25 bg-white/[0.02] backdrop-blur " +
      "hover:shadow-[0_0_28px_rgba(16,185,129,0.25)] transition " +
      className
    }
  >
    {children}
  </div>
);

const Chip = ({ children }) => (
  <span className="inline-block text-xs md:text-sm rounded-md px-2.5 py-1 border border-emerald-400/30 bg-emerald-400/10 shadow-[0_0_10px_rgba(16,185,129,0.25)] mr-2 mb-2">
    {children}
  </span>
);

const AboutMe = () => {
  return (
    <main className="min-h-screen bg-[#070b17] text-slate-100 pt-24 pb-16 px-4 md:px-6">
      {/* Page heading */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-center text-3xl md:text-4xl font-bold">About Me</h1>
        <div className="mx-auto mt-2 h-[2px] w-40 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.6)]" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* === LEFT SIDEBAR === */}
        <section className="space-y-6">
          {/* Profile card */}
          <NeonCard className="p-5">
            <h3 className="text-center font-semibold text-sm uppercase tracking-wider text-slate-300">
              Profile
            </h3>

            <div className="mt-5 flex flex-col items-center">
              <div className="relative">
                <img
                  src="https://picsum.photos/100/100?random=1" // replace with your actual image path
                  alt="Raktim Maity"
                  className="h-36 w-36 rounded-full object-cover ring-4 ring-emerald-400/30"
                />
                <span className="pointer-events-none absolute inset-0 rounded-full blur-xl opacity-60 bg-gradient-to-r from-cyan-400/30 via-emerald-400/30 to-cyan-400/30" />
              </div>

              <div className="mt-4 text-center">
                <h4 className="text-lg font-semibold">Raktim Maity</h4>
                <p className="text-emerald-300/90 text-sm">
                  Web Developer, Front-End Developer
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 w-full">
                <div className="rounded-lg bg-white/5 border border-emerald-400/20 text-center py-3">
                  <div className="text-sm text-slate-300">Projects</div>
                  <div className="text-xl font-bold">37</div>
                </div>
                <div className="rounded-lg bg-white/5 border border-emerald-400/20 text-center py-3">
                  <div className="text-sm text-slate-300">Visitors</div>
                  <div className="text-xl font-bold">412</div>
                </div>
              </div>

              <Link
                to="/contact-me"
                className="mt-5 inline-block rounded-xl px-5 py-2 font-semibold text-black bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.55)] hover:shadow-[0_0_26px_rgba(16,185,129,0.75)] transition"
              >
                Hire Me
              </Link>
            </div>
          </NeonCard>

          {/* Socials */}
          <NeonCard className="p-4">
            <h3 className="text-center font-semibold text-sm uppercase tracking-wider text-slate-300">
              Social Accounts
            </h3>
            <div className="mt-4 flex justify-center gap-4">
              {[FaFacebookF, FaInstagram, FaSkype, FaLinkedinIn, FaGithub].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="p-3 rounded-full text-white bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-md shadow-cyan-500/40 hover:shadow-emerald-500/60 transition"
                  >
                    <Icon />
                  </a>
                )
              )}
            </div>
          </NeonCard>

          {/* Mini about */}
          <NeonCard className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <FaUniversity className="text-emerald-300" />
              <span>Brainware University</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-emerald-300" />
              <span>Tamluk, West Bengal</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBuilding className="text-emerald-300" />
              <span>Company</span>
            </div>
          </NeonCard>

          {/* Skills */}
          <NeonCard className="p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-300 uppercase">
              Skills
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
        <section className="lg:col-span-2">
          <NeonCard className="p-6">
            <h2 className="text-2xl font-bold mb-3">About Me</h2>
            <p className="text-slate-300 mb-5 leading-relaxed">
              Hello, I am Raktim Maity. I am currently pursuing Bachelor of
              Computer Science and Engineering specialization in Artificial
              Intelligence and Machine Learning from Brainware University.
              <br />
              <br />
              I seek challenging opportunities where I can fully use my skills
              for success. I want to work for an organization that provides me
              the opportunity to improve my skills and grow along with its
              objectives. My goal is to start my career in a high-level
              professional environment.
            </p>

            {/* Profile Table */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded border border-emerald-400/20">
                <strong>Name:</strong> Raktim Maity
              </div>
              <div className="bg-white/5 p-3 rounded border border-emerald-400/20">
                <strong>Education:</strong> Brainware University
              </div>
              <div className="bg-white/5 p-3 rounded border border-emerald-400/20">
                <strong>Address:</strong> Tamluk, West Bengal
              </div>
              <div className="bg-white/5 p-3 rounded border border-emerald-400/20">
                <strong>Country:</strong> India
              </div>
              <div className="bg-white/5 p-3 rounded border border-emerald-400/20">
                <strong>Phone:</strong> +91 6295396929
              </div>
              <div className="bg-white/5 p-3 rounded border border-emerald-400/20">
                <strong>Email:</strong> reach.raktimmaity@gmail.com
              </div>
            </div>
          </NeonCard>
        </section>
      </div>
    </main>
  );
};

export default AboutMe;
