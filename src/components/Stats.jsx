import React, { useEffect, useRef, useState } from "react";

/* ------------------ CONFIG DATA (edit here) ------------------ */
const statsData = {
  title: "By the Numbers",
  subtitle: "A quick snapshot of my work so far",
  items: [
    { value: 37, suffix: "", label: "Successful Projects" },
    { value: 5, suffix: "+", label: "Years Experience" },
    { value: 100, suffix: "+", label: "Clients" },
  ],
  // visuals
  bg: "#0a0f1f",
};

/* ------------------ HELPERS ------------------ */
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function useCountUp(inView, to, duration = 1200) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf, start;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setN(Math.round(easeOutCubic(p) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return n;
}

const StatCard = ({ value, suffix = "", label, active }) => {
  const display = useCountUp(active, value);
  return (
    <div
      className="text-center px-6 py-6 rounded-xl border border-cyan-400/30
                 bg-black/40
                 hover:shadow-[0_0_28px_rgba(34,211,238,0.25)] hover:-translate-y-0.5
                 transition-all duration-300"
      role="group"
      aria-label={label}
    >
      <div
        className="mx-auto mb-3 h-8 w-24 rounded-full
                   bg-gradient-to-r from-cyan-500/20 via-green-500/20 to-blue-500/20
                   border border-cyan-400/20"
      />
      <h3
        className="text-4xl font-extrabold tracking-tight
                   text-transparent bg-clip-text
                   bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400
                   drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]"
        aria-live="polite"
      >
        {display}
        {suffix}
      </h3>
      <p className="mt-2 text-sm text-cyan-200">{label}</p>
    </div>
  );
};

/* ------------------ MAIN COMPONENT ------------------ */
const Stats = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  // fire once when ~30% of the section becomes visible
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-16"
      style={{ backgroundColor: statsData.bg }}
      aria-labelledby="stats-title"
    >
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="mx-auto h-32 w-3/4" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-10">
          <h2
            id="stats-title"
            className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text
                       bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400"
          >
            {statsData.title}
          </h2>
          <p className="mt-2 text-cyan-200 text-sm">{statsData.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {statsData.items.map((it, i) => (
            <StatCard
              key={i}
              value={it.value}
              suffix={it.suffix}
              label={it.label}
              active={inView}
            />
          ))}
        </div>

        {/* bottom divider */}
        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      </div>
    </section>
  );
};

export default Stats;
