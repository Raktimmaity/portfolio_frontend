import React from "react";
import { Typewriter } from "react-simple-typewriter";

const Hero = () => {
  return (
    <section className="pt-28 flex flex-col md:flex-row justify-around items-center py-16 text-white relative overflow-hidden max-w-7xl mx-auto px-6">
      {/* Text Section */}
      <div className="max-w-lg z-10 text-center md:text-left">
        <h2 className="text-2xl font-semibold text-cyan-300 mb-3 tracking-wide">
          Welcome
        </h2>
        <h1 className="text-4xl font-bold leading-tight">
          I'm{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400">
            Raktim Maity
          </span>
        </h1>

        {/* Typewriter Effect */}
        <p className="text-lg text-cyan-200 mt-4">
            <span className="text-cyan-400">{"<"}</span>
          <Typewriter
            words={[
              "Front-End Developer!",
              "UI/UX Enthusiast",
              "React.js Specialist",
              "Creative Designer",
            ]}
            loop={0}
            cursor
            cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
          <span className="text-cyan-400">{"/>"}</span>
        </p>

        {/* Reviews */}
        <div className="flex flex-col md:flex-row lg:flex-row items-center gap-2 mt-6 justify-center md:justify-start">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <img
              className="w-9 h-9 rounded-full ring-2 ring-cyan-400"
              src="https://randomuser.me/api/portraits/women/1.jpg"
              alt="user"
            />
            <img
              className="w-9 h-9 rounded-full ring-2 ring-green-400 relative right-5"
              src="https://randomuser.me/api/portraits/men/2.jpg"
              alt="user"
            />
            </div>
          <span className="text-sm bg-black/50 px-3 py-1 rounded-full border border-cyan-400/40 shadow-lg shadow-cyan-500/30">
            ⭐ 4.3 (20 Reviews)
          </span>
        </div>
      </div>

      {/* Image Section */}
      <div className="mt-10 md:mt-0 relative z-10 animate-float">
        <img
          src="https://picsum.photos/500/500?random=1"
          alt="Profile"
          className="w-64 rounded-lg border-4 border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.8)] hover:shadow-[0_0_45px_rgba(34,211,238,0.9)] transition-all duration-500"
        />
        <div className="absolute -top-4 -right-6 bg-black/60 border border-cyan-400/40 shadow-lg shadow-green-500/40 p-4 rounded-lg text-center backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-cyan-300">13</h2>
          <p className="text-sm">Skills Have</p>
        </div>
      </div>

      {/* Floating Animation Keyframes */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}
      </style>
    </section>
  );
};

export default Hero;
