import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

/* ---------- data ---------- */
const TESTIMONIALS = [
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

/* one card, neon-styled to match your theme */
const Card = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = item.text.length > 100; // adjust threshold if needed
  return (
    <article
      className="min-w-[280px] sm:min-w-[320px] max-w-sm mr-6 rounded-xl
                 bg-gradient-to-br from-gray-900/75 to-gray-800/60
                 border border-cyan-400/30
                 hover:shadow-[0_0_30px_rgba(34,211,238,0.35)]
                 transition p-5"
    >
      <div className="flex items-center gap-3">
        <img
          src={item.avatar}
          alt={`${item.name} avatar`}
          className="w-12 h-12 rounded-full ring-2 ring-cyan-400/60"
        />
        <div>
          <h4 className="text-white font-semibold leading-tight">
            {item.name}
          </h4>
          <span className="inline-block text-xs mt-1 px-2 py-0.5 rounded
                           bg-black/40 border border-cyan-400/40
                           text-cyan-200">
            {item.role}
          </span>
        </div>
      </div>

      <div
        className="mt-3 flex items-center gap-1"
        aria-label={`${item.rating} out of 5 stars`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar
            key={i}
            className={`text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] ${i < item.rating ? "opacity-100" : "opacity-0"
              }`}
          />
        ))}
      </div>

      {/* ✨ expandable text */}
      <p
        className={`mt-4 text-sm text-gray-200 leading-relaxed whitespace-normal ${!expanded ? "line-clamp-2" : ""
          }`}
      >
        {item.text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 text-cyan-400 text-sm font-medium hover:underline focus:outline-none"
        >
          {expanded ? "See Less" : "See More"}
        </button>
      )}
    </article>
  );
};


const Testimonials = () => {
  // duplicate the list to create a seamless loop
  const LOOP = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section
      id="testimonials"
      className="relative py-16 px-6 md:px-12 max-w-6xl mx-auto mt-20"
      aria-labelledby="testimonials-title"
    >
      <h2
        id="testimonials-title"
        className="text-center text-3xl md:text-4xl font-bold text-transparent bg-clip-text
                   bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400"
      >
        Testimonials
      </h2>
      {/* half-width divider under the heading */}
      {/* <div className="flex justify-center -mt-6 mb-8" aria-hidden="true">
        <span className="inline-block h-[2px] w-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      </div> */}
      <div className="flex justify-center mt-3" aria-hidden="true">
        <span className="inline-block h-[2px] w-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      </div>
      {/* scroller */}
      <div className="group relative mt-10 overflow-hidden">
        {/* fade masks on edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16
                        bg-gradient-to-r from-[#0b0f19] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16
                        bg-gradient-to-l from-[#0b0f19] to-transparent z-10" />

        <div className="flex items-stretch whitespace-nowrap animate-marquee will-change-transform">
          {LOOP.map((item, idx) => (
            <Card key={idx} item={item} />
          ))}
        </div>
      </div>

      {/* marquee animation + pause on hover (no Tailwind config changes needed) */}
      <style>{`
        @keyframes marqueeLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marqueeLeft 25s linear infinite;
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
