import React, { useEffect, useMemo, useState } from "react";
import { Typewriter } from "react-simple-typewriter";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";
const TESTIMONIALS_URL = import.meta.env.VITE_TESTIMONIALS_URL || `${API_BASE}/api/testimonials`;

const Hero = () => {
  const [profile, setProfile] = useState(null);
  const [skillsCount, setSkillsCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [reviewsAvg, setReviewsAvg] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE}/api/profile`)
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/skills`)
      .then((res) => res.json())
      .then((data) => setSkillsCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(TESTIMONIALS_URL)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setReviewsCount(0);
          setReviewsAvg(0);
          return;
        }
        const validRatings = data
          .map((item) => Number(item?.rating))
          .filter((rating) => Number.isFinite(rating) && rating > 0);
        const count = data.length;
        const avg = validRatings.length
          ? validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length
          : 0;
        setReviewsCount(count);
        setReviewsAvg(avg);
      })
      .catch(() => {});
  }, []);

  const name = profile?.name || "Raktim Maity";
  const company = profile?.company || "Company Name";
  const coverPhoto = profile?.coverPhoto || "https://picsum.photos/500/500?random=1";
  const typewriterWords = useMemo(() => {
    const raw = profile?.professionTitles || "";
    const parsed = raw
      .split(",")
      .map((title) => title.trim())
      .filter(Boolean);
    return parsed.length
      ? parsed
      : ["Front-End Developer!", "UI/UX Enthusiast", "React.js Specialist", "Creative Designer"];
  }, [profile?.professionTitles]);

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-6 overflow-hidden">
      {/* Animated Background Effects - Green Neon Theme */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-lime-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-emerald-500/10 via-green-400/10 to-lime-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Text Section */}
          <div className="flex-1 text-center md:text-left space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/50 bg-emerald-400/10 backdrop-blur-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-white text-sm font-medium">Available for work</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-3">
              <h2 className="text-lg md:text-xl font-medium text-white tracking-wide">
                Hello, I'm
              </h2>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                  {name}
                </span>
              </h1>
            </div>

            {/* Typewriter Effect */}
            <div className="text-xl md:text-2xl text-slate-200 font-light min-h-[2rem]">
              <span className="text-emerald-400 font-mono">{"<"}</span>
              <span className="mx-2">
                <Typewriter
                  words={typewriterWords}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1500}
                />
              </span>
              <span className="text-emerald-400 font-mono">{"/>"}</span>
            </div>

            {/* Company */}
            <p className="text-lg text-slate-300">
              Currently working at{" "}
              <span className="text-emerald-400 font-semibold text-xl">
                {company}
              </span>
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start pt-4">
              {/* Reviews */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <img
                    className="w-10 h-10 rounded-full ring-2 ring-emerald-400 border-2 border-[#050914]"
                    src="https://randomuser.me/api/portraits/women/1.jpg"
                    alt="user"
                  />
                  <img
                    className="w-10 h-10 rounded-full ring-2 ring-lime-400 border-2 border-[#050914]"
                    src="https://randomuser.me/api/portraits/men/2.jpg"
                    alt="user"
                  />
                  <img
                    className="w-10 h-10 rounded-full ring-2 ring-green-400 border-2 border-[#050914]"
                    src="https://randomuser.me/api/portraits/women/3.jpg"
                    alt="user"
                  />
                </div>
                <div className="px-4 py-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 backdrop-blur-sm">
                  <span className="text-white font-semibold text-sm">
                    ⭐ {reviewsAvg.toFixed(1)} · {reviewsCount} Reviews
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex-shrink-0 relative">
            <div className="relative animate-float">
              {/* Glowing ring effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 via-green-400 to-lime-400 blur-2xl opacity-30 animate-pulse"></div>

              {/* Profile Image */}
              <div className="relative">
                <img
                  src={coverPhoto}
                  alt="Profile"
                  className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-2xl border-4 border-emerald-400/50 shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:shadow-[0_0_60px_rgba(16,185,129,0.8)] transition-all duration-500"
                />

                {/* Decorative corner accents */}
                <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg"></div>
                <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-lime-400 rounded-br-lg"></div>
              </div>

              {/* Skills Badge */}
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-[#0a1224] to-[#050914] border-2 border-emerald-400/60 shadow-[0_0_30px_rgba(16,185,129,0.5)] px-6 py-4 rounded-xl text-center backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-lime-300">
                  {skillsCount}+
                </h2>
                <p className="text-xs text-white font-medium uppercase tracking-wider">Skills</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation Keyframes */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          .animate-float {
            animation: float 5s ease-in-out infinite;
          }
        `}
      </style>
    </section>
  );
};

export default Hero;
