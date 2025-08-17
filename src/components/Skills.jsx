import React, { useEffect, useRef, useState } from "react";
import {
  FaHtml5, FaCss3Alt, FaJs, FaBootstrap, FaPython,
  FaDatabase, FaReact, FaGitAlt, FaPhp, FaWordpress, FaJava,
} from "react-icons/fa";
import { SiTailwindcss, SiC } from "react-icons/si";

const Skills = () => {
  const [inView, setInView] = useState(false);
  const [counts, setCounts] = useState({});
  const sectionRef = useRef(null);

  const skills = [
    { name: "HTML", level: 85, icon: <FaHtml5 className="text-orange-500" /> },
    { name: "CSS", level: 75, icon: <FaCss3Alt className="text-blue-500" /> },
    { name: "JAVASCRIPT", level: 55, icon: <FaJs className="text-yellow-400" /> },
    { name: "TAILWIND CSS", level: 75, icon: <SiTailwindcss className="text-cyan-400" /> },
    { name: "BOOTSTRAP", level: 60, icon: <FaBootstrap className="text-purple-500" /> },
    { name: "C LANGUAGE", level: 75, icon: <SiC className="text-blue-400" /> },
    { name: "PYTHON", level: 60, icon: <FaPython className="text-yellow-400" /> },
    { name: "JAVA", level: 50, icon: <FaJava className="text-red-500" /> },
    { name: "MYSQL", level: 60, icon: <FaDatabase className="text-blue-300" /> },
    { name: "PHP", level: 50, icon: <FaPhp className="text-indigo-400" /> },
    { name: "REACT JS", level: 35, icon: <FaReact className="text-cyan-400" /> },
    { name: "WORDPRESS", level: 30, icon: <FaWordpress className="text-blue-500" /> },
    { name: "GIT", level: 40, icon: <FaGitAlt className="text-orange-600" /> },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Number counter (runs outside React re-renders)
  useEffect(() => {
    if (inView) {
      skills.forEach((skill) => {
        let start = 0;
        const end = skill.level;
        const duration = 1200;
        const startTime = performance.now();

        const update = (time) => {
          const progress = Math.min((time - startTime) / duration, 1);
          const value = Math.floor(progress * end);
          setCounts((prev) => ({ ...prev, [skill.name]: value }));
          if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
      });
    }
  }, [inView]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-16 px-6 md:px-12  max-w-6xl mx-auto mt-20"
    >
      {/* <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-green-500/10 to-blue-500/10 blur-2xl rounded-2xl"></div> */}

      <div className="relative">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 mb-10">
          Skills
        </h2>
        {/* half-width divider under the heading */}
        <div className="flex justify-center -mt-6 mb-8" aria-hidden="true">
          <span className="inline-block h-[2px] w-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        </div>


        <div className="grid md:grid-cols-2 gap-x-16 gap-y-6">
          {skills.map((skill, index) => (
            <div key={index}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{skill.icon}</span>
                <span className="text-white text-sm font-semibold tracking-wide">
                  {skill.name}
                </span>
                <span className="ml-auto text-cyan-300 font-semibold text-sm">
                  {inView ? counts[skill.name] || 0 : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] transition-[width] duration-1000 ease-out"
                  style={{
                    width: inView ? `${skill.level}%` : "0%",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
