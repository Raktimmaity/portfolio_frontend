import React, { useEffect, useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

/* ---------- data ---------- */
const FALLBACK_TESTIMONIALS = [
  {
    name: "Anshu Poddar",
    role: "Student",
    avatar: "https://i.pravatar.cc/80?img=12",
    rating: 5,
    text:
      "In this site we get valuable and productive information about web development. In this site we get valuable and productive information about web development.",
  },
  {
    name: "Anusuya Samanta",
    role: "Student",
    avatar: "https://i.pravatar.cc/80?img=32",
    rating: 4,
    text: "Very nice!",
  },
  {
    name: "Soham Mathur",
    role: "Student",
    avatar: "https://i.pravatar.cc/80?img=25",
    rating: 5,
    text:
      "Your portfolio is a perfect blend of creativity and professionalism.",
  },
  {
    name: "Anuran Maity",
    role: "Student",
    avatar: "https://i.pravatar.cc/80?img=45",
    rating: 4,
    text:
      "Gaining an excellent experience through your portfolio.",
  },
];

/* one card, green neon theme */
const Card = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = item.text.length > 100;

  // Extract first and last name initials
  const getInitials = (name) => {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.slice(0, 2);
  };

  return (
    <article
      className="min-w-[280px] sm:min-w-[320px] max-w-sm mr-6 rounded-2xl
                 bg-gradient-to-br from-[#0a1224]/80 to-[#050914]/80
                 border border-emerald-400/20
                 hover:border-emerald-400/50
                 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]
                 transition-all duration-300 backdrop-blur-sm p-6"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-md"></div>
          <div className="relative w-14 h-14 rounded-full ring-2 ring-emerald-400/60 border-2 border-[#050914] bg-gradient-to-br from-emerald-500/30 to-lime-500/30 flex items-center justify-center">
            <span className="text-emerald-100 font-bold text-lg uppercase">
              {getInitials(item.name)}
            </span>
          </div>
        </div>
        <div>
          <h4 className="text-emerald-100 font-bold leading-tight">
            {item.name}
          </h4>
          <span className="inline-block text-xs mt-1 px-3 py-1 rounded-full
                           bg-emerald-500/10 border border-emerald-400/40
                           text-emerald-300 font-medium">
            {item.role}
          </span>
        </div>
      </div>

      <div
        className="mt-4 flex items-center gap-1"
        aria-label={`${item.rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar
            key={i}
            className={`text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.7)] ${
              i < item.rating ? "opacity-100" : "opacity-20"
            }`}
          />
        ))}
      </div>

      {/* expandable text */}
      <p
        className={`mt-4 text-sm text-slate-300 leading-relaxed whitespace-normal ${
          !expanded ? "line-clamp-3" : ""
        }`}
      >
        {item.text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 text-emerald-400 text-sm font-semibold hover:text-emerald-300 focus:outline-none transition-colors"
        >
          {expanded ? "See Less" : "See More"}
        </button>
      )}
    </article>
  );
};


const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/testimonials`)
      .then((res) => res.json())
      .then((data) =>
        setTestimonials(Array.isArray(data) ? data : [])
      )
      .catch(() => {});
  }, []);

  const displayTestimonials = useMemo(() => {
    if (!testimonials.length) return FALLBACK_TESTIMONIALS;
    return testimonials.map((item) => ({
      name: item?.name || "Anonymous",
      role: item?.role || "Guest",
      avatar: item?.avatar || "https://i.pravatar.cc/80?img=12",
      rating: Number(item?.rating) || 0,
      text: item?.text || "",
    }));
  }, [testimonials]);

  // duplicate the list only when there are enough items to loop cleanly
  const LOOP = displayTestimonials.length >= 4
    ? [...displayTestimonials, ...displayTestimonials]
    : displayTestimonials;

  return (
    <section
      id="testimonials"
      className="relative py-20 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
      aria-labelledby="testimonials-title"
    >
      {/* Animated Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-lime-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            id="testimonials-title"
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)] mb-4"
          >
            Testimonials
          </h2>
          <div className="mx-auto h-[2px] w-32 rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        </motion.div>

        {/* Scroller */}
        <div className="group relative overflow-hidden">
          {/* Fade masks on edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32
                          bg-gradient-to-r from-[#050914] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32
                          bg-gradient-to-l from-[#050914] to-transparent z-10" />

          <div className="flex items-stretch whitespace-nowrap animate-marquee will-change-transform">
            {LOOP.map((item, idx) => (
              <Card key={idx} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Marquee animation + pause on hover */}
      <style>{`
        @keyframes marqueeLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marqueeLeft 30s linear infinite;
        }
        /* pause on hover of the whole section */
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
