import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaExternalLinkAlt,
  FaGithub,
  FaCalendarAlt,
  FaTimes,
  FaCheckCircle,
  FaCircle,
  FaFilter,
} from "react-icons/fa";

/* helper: normalize paid/free from data */
function getPaidFlag(p) {
  const price = typeof p.price === "number" ? p.price : null;
  if (typeof p.isPaid === "boolean") return p.isPaid;
  if (typeof p.paid === "boolean") return p.paid;
  if (price != null) return price > 0;
  return null; // unknown
}

const NAV_OFFSET_PX = 80; // stick just below your fixed navbar
const PAGE_SIZE = 4;
const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

const ProjectsPage = () => {
  const [selected, setSelected] = useState(null); // project object
  const [closing, setClosing] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [projectsData, setProjectsData] = useState({
    summary: { total: 0, heroTitle: "Welcome to My Projects", heroSub: "" },
    skillColors: {},
    skills: [],
    items: [],
  });

  const listRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/projects`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const skillsSet = new Set();
        list.forEach((p) => (p.skills || []).forEach((s) => skillsSet.add(s)));
        setProjectsData({
          summary: {
            total: list.length,
            heroTitle: "Welcome to My Projects",
            heroSub:
              "Explore my latest projects and innovations. Each project reflects my dedication to learning and building amazing things.",
          },
          skillColors: {},
          skills: Array.from(skillsSet).sort(),
          items: list.map((p) => ({
            id: p._id,
            title: p.title,
            image: p.imageUrl,
            type: (p.projectType || "").toLowerCase(),
            hosted: { live: Boolean(p.projectLink), url: p.projectLink || null },
            github: p.githubLink || "",
            uploadedOn: p.createdAt,
            tech: p.skills || [],
            isPaid: (p.cost || "").toLowerCase() === "paid",
            description: p.description || "",
          })),
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const target = Number(projectsData.summary.total || 0);
    let start = null;
    let rafId = null;
    const duration = 1200;

    const tick = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setTotalCount(Math.floor(eased * target));
      if (t < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [projectsData.summary.total]);

  /* ------------ FILTER STATE ------------ */
  const [selSkills, setSelSkills] = useState(new Set()); // empty = All
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [paid, setPaid] = useState("all"); // 'all' | 'free' | 'paid'

  /* ------------ PAGINATION ------------ */
  const [page, setPage] = useState(1);

  // modal controls
  const openModal = (project) => {
    setSelected(project);
    setShowFullDescription(false);
  };
  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setSelected(null);
      setClosing(false);
      setShowFullDescription(false);
    }, 250);
  };

  // close on Esc
  useEffect(() => {
    const onKey = (e) => (e.key === "Escape" ? closeModal() : null);
    if (selected) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // lock scroll when mobile drawer open
  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mobileFiltersOpen]);

  /* ------------ SKILLS LIST (auto) ------------ */
  const allSkills = useMemo(() => {
    const base = Array.isArray(projectsData.skills) ? projectsData.skills : [];
    const s = new Set(base);
    projectsData.items?.forEach((p) => p.tech?.forEach((t) => s.add(t)));
    const arr = Array.from(s).filter((x) => x);
    return arr.sort();
  }, [projectsData.skills, projectsData.items]);

  /* ------------ FILTERED ITEMS ------------ */
  const filteredItems = useMemo(() => {
    const fromT = dateFrom ? new Date(dateFrom).getTime() : null;
    const toT = dateTo ? new Date(dateTo).getTime() : null;

    return (projectsData.items || []).filter((p) => {
      // skills (OR logic). If none selected -> pass all.
      let skillsOk = true;
      if (selSkills.size > 0) {
        const setHas = (arr) => arr?.some((t) => selSkills.has(t));
        skillsOk = setHas(p.tech);
      }

      // date
      let dateOk = true;
      if (fromT || toT) {
        const candidateT = p.uploadedOn ? new Date(p.uploadedOn).getTime() : NaN;
        if (!Number.isNaN(candidateT)) {
          if (fromT && candidateT < fromT) dateOk = false;
          if (toT && candidateT > toT) dateOk = false;
        }
      }

      // free/paid
      let paidOk = true;
      const isPaid = getPaidFlag(p);
      if (paid === "free") paidOk = isPaid === false;
      else if (paid === "paid") paidOk = isPaid === true;

      return skillsOk && dateOk && paidOk;
    });
  }, [projectsData.items, selSkills, dateFrom, dateTo, paid]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [selSkills, dateFrom, dateTo, paid]);

  const total = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = filteredItems.slice(start, end);

  /* ------------ helpers ------------ */
  const toggleSkill = (s) => {
    setSelSkills((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  };

  const Pagination = () => {
    if (total <= PAGE_SIZE) return null;

    const nums = [];
    const add = (n) => nums.push(n);
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) add(i);
    } else {
      add(1);
      const left = Math.max(2, page - 1);
      const right = Math.min(totalPages - 1, page + 1);
      if (left > 2) nums.push("…");
      for (let i = left; i <= right; i++) add(i);
      if (right < totalPages - 1) nums.push("…");
      add(totalPages);
    }

    return (
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 relative z-[40] pointer-events-auto">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-3 py-1.5 rounded-md text-sm border ${page === 1
            ? "border-cyan-400/20 text-cyan-300/50 cursor-not-allowed"
            : "border-cyan-400/60 text-cyan-300 hover:shadow-[0_0_12px_rgba(34,211,238,.45)]"
            }`}
        >
          Prev
        </button>

        {nums.map((n, i) =>
          n === "…" ? (
            <span key={`dots${i}`} className="px-2 text-cyan-200/70 select-none">…</span>
          ) : (
            <button
              type="button"
              key={n}
              onClick={() => setPage(n)}
              className={`min-w-[2.25rem] px-3 py-1.5 rounded-md text-sm border transition ${n === page
                ? "border-emerald-400 bg-emerald-500/10 text-emerald-200 shadow-[0_0_12px_rgba(44,255,125,.55)]"
                : "border-cyan-400/40 text-cyan-200 hover:border-cyan-400/70 hover:bg-cyan-500/5"
                }`}
            >
              {n}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={`px-3 py-1.5 rounded-md text-sm border ${page === totalPages
            ? "border-cyan-400/20 text-cyan-300/50 cursor-not-allowed"
            : "border-cyan-400/60 text-cyan-300 hover:shadow-[0_0_12px_rgba(34,211,238,.45)]"
            }`}
        >
          Next
        </button>
      </div>
    );
  };

  /* ------------ STICKY with BOTTOM LIMIT (no overlap with footer) ------------ */
  const asideWrapRef = useRef(null);
  const [fixed, setFixed] = useState(false);
  const [bottomed, setBottomed] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0, left: 0 });

  // absolute top of the wrapper (when not fixed)
  const baseTopAbsRef = useRef(0);

  const measureAside = () => {
    if (!asideWrapRef.current) return;
    const rect = asideWrapRef.current.getBoundingClientRect();
    setDims({
      w: rect.width,
      h: asideWrapRef.current.offsetHeight,
      left: rect.left + window.scrollX,
    });
    // capture the wrapper's absolute top only once (layout start)
    if (!baseTopAbsRef.current) {
      baseTopAbsRef.current = rect.top + window.scrollY;
    }
  };

  useEffect(() => {
    measureAside();
    window.addEventListener("resize", measureAside);
    return () => window.removeEventListener("resize", measureAside);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!asideWrapRef.current || !listRef.current) return;

      const scrollY = window.scrollY;

      // container bounds (the whole projects list section)
      const containerRect = listRef.current.getBoundingClientRect();
      const containerBottomAbs = containerRect.bottom + window.scrollY;

      const asideH = dims.h || asideWrapRef.current.offsetHeight;

      // start fixing when top passes wrapper top minus the navbar offset
      const startFixY = baseTopAbsRef.current - NAV_OFFSET_PX;

      // Calculate when sidebar bottom would reach the end of the container
      // We want to stop being fixed BEFORE the sidebar reaches the footer
      const sidebarBottomIfFixed = scrollY + NAV_OFFSET_PX + asideH;

      // Add buffer to ensure sidebar stops well before footer
      const FOOTER_BUFFER = 100;
      const maxBottomPosition = containerBottomAbs - FOOTER_BUFFER;

      if (scrollY < startFixY) {
        // Haven't reached sticky point yet
        setFixed(false);
        setBottomed(false);
      } else if (sidebarBottomIfFixed < maxBottomPosition) {
        // Safe to be fixed - won't overlap footer
        setFixed(true);
        setBottomed(false);
      } else {
        // Would overlap footer - switch to absolute positioning at bottom
        setFixed(false);
        setBottomed(true);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dims.h]);

  /* ---------- RENDER ---------- */
  return (
    <main className="min-h-screen text-white bg-[#070b17]">
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden min-h-[50vh] md:h-[70vh] w-full flex items-center py-20 md:py-0">
        {/* Animated background effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-emerald-500/10 via-cyan-400/10 to-emerald-500/10 blur-2xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-12 text-center w-full">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 text-xs md:text-sm font-medium">
            Portfolio Showcase
          </div>

          <h1 className="text-3xl md:text-6xl font-extrabold mb-4 md:mb-6 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(44,255,125,0.4)] px-4">
            {projectsData.summary.heroTitle}
          </h1>

          <p className="mt-3 md:mt-4 text-sm md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
            {projectsData.summary.heroSub}
          </p>

          <div className="mt-6 md:mt-8 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-2 px-4">
            <div className="hidden md:block h-[2px] w-20 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full" />
            <div className="px-6 py-3 rounded-2xl border-2 border-emerald-400/50 bg-emerald-400/10 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl md:text-6xl font-extrabold text-emerald-400 drop-shadow-[0_0_20px_rgba(44,255,125,.8)]">
                  {totalCount}+
                </span>
                <span className="text-xs md:text-sm text-slate-300 uppercase tracking-wider">Projects</span>
              </div>
            </div>
            <div className="hidden md:block h-[2px] w-20 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full" />
          </div>
        </div>
      </section>

      {/* ---------- CONTENT ---------- */}
      <section
        ref={listRef}
        id="projects-list"
        className="max-w-6xl mx-auto px-6 md:px-12 pb-28"
      >
        <h2 className="sr-only">Projects List</h2>

        {/* Mobile toolbar (filters + result count) */}
        <div className="md:hidden mt-5 md:mt-0 mb-4 flex items-center justify-between relative z-[41]">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-cyan-400/50 px-3 py-2 text-sm text-cyan-200 hover:shadow-[0_0_12px_rgba(34,211,238,.5)] transition"
          >
            <FaFilter /> Filters
          </button>
          <div className="text-xs text-cyan-200/80">
            {total} result{total !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          {/* -------- FILTER SIDEBAR (sticks; un-sticks before footer) -------- */}
          <aside
            className="hidden md:block z-20"
            ref={asideWrapRef}
            style={{ position: "relative", ...(fixed || bottomed ? { height: `${dims.h}px` } : null) }}
          >
            <div
              style={
                fixed
                  ? {
                    position: "fixed",
                    top: `${NAV_OFFSET_PX}px`,
                    left: `${dims.left}px`,
                    width: `${dims.w}px`,
                    zIndex: 30,
                  }
                  : bottomed
                    ? {
                      position: "absolute",
                      top: "auto",
                      bottom: "100px",
                      left: 0,
                      width: "100%",
                      zIndex: 20,
                    }
                    : undefined
              }
            >
              <div className="rounded-xl bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur border border-emerald-400/30 p-5 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <div className="mb-5 pb-3 border-b border-emerald-400/20">
                  <h2 className="font-bold text-lg text-emerald-400 flex items-center gap-2">
                    <FaFilter className="text-sm" />
                    Filters
                  </h2>
                </div>

                {/* Skills (multi-select) */}
                <div className="mb-5">
                  <h3 className="font-semibold mb-3 text-sm text-slate-200 uppercase tracking-wider">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelSkills(new Set())}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300
                        ${selSkills.size === 0
                          ? "border-emerald-400 bg-emerald-400/20 text-emerald-200 shadow-[0_0_14px_rgba(44,255,125,.55)]"
                          : "border-emerald-400/25 text-slate-300 hover:border-emerald-400/60 hover:bg-emerald-500/10"}`}
                      aria-pressed={selSkills.size === 0}
                    >
                      All
                    </button>

                    {allSkills.map((s) => {
                      const on = selSkills.has(s);
                      return (
                        <button
                          type="button"
                          key={s}
                          onClick={() => {
                            setSelSkills((prev) => {
                              const next = new Set(prev);
                              on ? next.delete(s) : next.add(s);
                              return next;
                            });
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300
                            ${on
                              ? "border-emerald-400 bg-emerald-400/20 text-emerald-200 shadow-[0_0_14px_rgba(44,255,125,.55)]"
                              : "border-emerald-400/25 text-slate-300 hover:border-emerald-400/60 hover:bg-emerald-500/10"}`}
                          aria-pressed={on}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date */}
                {/* <div className="mb-5">
                  <h3 className="font-semibold mb-3 text-sm text-slate-200 uppercase tracking-wider">Date Range</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <label className="text-xs text-slate-400 font-medium">
                      From
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="mt-1.5 w-full rounded-lg bg-black/40 border border-emerald-400/30 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                      />
                    </label>
                    <label className="text-xs text-slate-400 font-medium">
                      To
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="mt-1.5 w-full rounded-lg bg-black/40 border border-emerald-400/30 px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                      />
                    </label>
                  </div>
                </div> */}

                {/* Free/Paid */}
                <div className="mb-5">
                  <h3 className="font-semibold mb-3 text-sm text-slate-200 uppercase tracking-wider">Pricing</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "all", label: "All" },
                      { id: "free", label: "Free" },
                      { id: "paid", label: "Paid" },
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setPaid(opt.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-300
                          ${paid === opt.id
                            ? "border-cyan-400 bg-cyan-400/20 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,.55)]"
                            : "border-cyan-400/25 text-slate-300 hover:border-cyan-400/60 hover:bg-cyan-500/10"
                          }`}
                        aria-pressed={paid === opt.id}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset */}
                <div className="pt-3 border-t border-emerald-400/20">
                  <button
                    type="button"
                    onClick={() => {
                      setSelSkills(new Set());
                      setDateFrom("");
                      setDateTo("");
                      setPaid("all");
                    }}
                    className="w-full rounded-lg border border-emerald-400/40 bg-emerald-400/5 px-4 py-2.5 text-sm font-medium text-emerald-200 hover:bg-emerald-400/10 hover:shadow-[0_0_16px_rgba(44,255,125,.5)] transition-all duration-300"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* -------- CARDS GRID -------- */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {total === 0 ? (
              <div className="col-span-full rounded-xl border border-emerald-400/30 bg-white/[0.02] backdrop-blur p-8 text-center">
                <div className="text-5xl mb-4 text-emerald-400/30">
                  <FaFilter className="inline-block" />
                </div>
                <h3 className="text-xl font-semibold text-slate-200 mb-2">No projects found</h3>
                <p className="text-slate-400">Try adjusting your filters to see more results</p>
              </div>
            ) : (
              pageItems.map((p) => (
                <article
                  key={p.id}
                  className="group relative rounded-2xl overflow-hidden border border-emerald-400/30 bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur
                             shadow-[0_0_0_rgba(0,0,0,0)] hover:shadow-[0_0_30px_rgba(44,255,125,.3)] hover:border-emerald-400/50
                             transition-all duration-500 will-change-transform hover:-translate-y-1 self-start"
                >
                  {/* Animated glow effect */}
                  <span
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                               bg-[radial-gradient(400px_150px_at_30%_30%,rgba(16,185,129,.12),transparent_70%),radial-gradient(400px_150px_at_70%_10%,rgba(34,211,238,.12),transparent_70%)]
                               transition-opacity duration-500"
                    aria-hidden
                  />

                  {/* Image header with improved aspect ratio */}
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-emerald-900/20 to-cyan-900/20">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Status badges with improved styling */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md transition-all duration-300
                        ${p.hosted?.live
                          ? "border-emerald-400/70 bg-emerald-500/30 text-emerald-100 shadow-[0_0_15px_rgba(44,255,125,.4)]"
                          : "border-red-400/70 bg-red-500/30 text-red-100"}`}>
                        {p.hosted?.live ? (
                          <>
                            <FaCheckCircle className="text-emerald-300" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <FaCircle className="text-red-300 text-[6px]" />
                            <span>Offline</span>
                          </>
                        )}
                      </span>

                      {(() => {
                        const isPaid = getPaidFlag(p);
                        return (
                          <span className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider border backdrop-blur-md
                            ${isPaid
                              ? "border-rose-400/70 bg-rose-500/30 text-rose-100"
                              : "border-cyan-400/70 bg-cyan-500/30 text-cyan-100"}`}>
                            {isPaid ? "Paid" : "Free"}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-100 mb-3 group-hover:text-emerald-400 transition-colors duration-300">
                      {p.title} {" "} {p.type && (
                        <span className="text-[10px] font-semibold rounded-md px-2 py-1 border border-purple-400/40 bg-purple-500/15 text-purple-200">
                          #{p.type}
                        </span>
                      )}
                    </h3>

                    {/* Project Type & Tech stack chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {/* {p.type && (
                        <span className="text-[10px] font-semibold rounded-md px-2 py-1 border border-purple-400/40 bg-purple-500/15 text-purple-200">
                          #{p.type}
                        </span>
                      )} */}
                      {p.tech?.slice(0, 4).map((t) => {
                        const color = projectsData.skillColors?.[t] || "bg-cyan-500/15 text-cyan-200 border-cyan-400/40";
                        return (
                          <span
                            key={t}
                            className={`text-[10px] font-medium rounded-md px-2 py-1 border ${color} hover:scale-105 transition-transform duration-200`}
                          >
                            {t}
                          </span>
                        );
                      })}
                      {p.tech?.length > 4 && (
                        <span className="text-[10px] font-medium rounded-md px-2 py-1 border border-slate-400/40 bg-slate-500/15 text-slate-300">
                          +{p.tech.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Upload date */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 pb-4 border-b border-emerald-400/20">
                      <FaCalendarAlt className="text-emerald-400" />
                      <span>
                        {p.uploadedOn
                          ? new Date(p.uploadedOn).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openModal(p)}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 text-black hover:shadow-[0_0_20px_rgba(44,255,125,.6)] hover:scale-105 transition-all duration-300"
                      >
                        View Details
                      </button>

                      <div className="flex gap-2">
                        {p.hosted?.live && (
                          <a
                            href={p.hosted.url}
                            target="_blank"
                            rel="noreferrer"
                            title="Visit Live Site"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm border border-emerald-400/60 text-emerald-300 hover:bg-emerald-400/10 hover:shadow-[0_0_15px_rgba(44,255,125,.5)] transition-all duration-300"
                          >
                            <FaExternalLinkAlt />
                          </a>
                        )}
                        {p.github && (
                          <a
                            href={p.github}
                            target="_blank"
                            rel="noreferrer"
                            title="View on GitHub"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm border border-cyan-400/60 text-cyan-300 hover:bg-cyan-400/10 hover:shadow-[0_0_15px_rgba(34,211,238,.5)] transition-all duration-300"
                          >
                            <FaGithub />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Pagination (full width across both columns, always clickable) */}
          {total > 0 && (
            <div className="col-span-1 md:col-span-2 relative z-[40]">
              <Pagination />
            </div>
          )}
        </div>
      </section>

      {/* ---------- MOBILE FILTER DRAWER ---------- */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-gray-900/95 border-t border-emerald-400/30 p-4 max-h-[50vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div className="mx-auto max-w-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-emerald-300">Filters</h3>
                <button
                  type="button"
                  className="rounded-md border border-emerald-400/40 px-3 py-1.5 text-sm text-emerald-200"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Apply
                </button>
              </div>

              {/* Skills */}
              <div className="mt-3">
                <div className="text-sm text-cyan-200/90 mb-2">Skills</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelSkills(new Set())}
                    className={`px-3 py-1.5 rounded-full text-sm border transition
                      ${selSkills.size === 0
                        ? "border-emerald-400 bg-emerald-500/10 text-white shadow-[0_0_14px_rgba(44,255,125,.55)]"
                        : "border-emerald-400/25 text-white hover:border-emerald-400/70 hover:bg-emerald-500/5"}`}
                    aria-pressed={selSkills.size === 0}
                  >
                    All
                  </button>
                  {allSkills.map((s) => {
                    const on = selSkills.has(s);
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => toggleSkill(s)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition
                          ${on
                            ? "border-emerald-400 bg-emerald-500/10 text-white shadow-[0_0_14px_rgba(44,255,125,.55)]"
                            : "border-emerald-400/25 text-white hover:border-emerald-400/70 hover:bg-emerald-500/5"}`}
                        aria-pressed={on}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date */}
              <div className="mt-4">
                <div className="text-sm text-cyan-200/90 mb-2">Date</div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs text-cyan-200/90">
                    From
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="mt-1 w-full rounded-md bg-black/30 border border-emerald-400/30 px-2 py-1 text-sm outline-none focus:border-emerald-400"
                    />
                  </label>
                  <label className="text-xs text-cyan-200/90">
                    To
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="mt-1 w-full rounded-md bg-black/30 border border-emerald-400/30 px-2 py-1 text-sm outline-none focus:border-emerald-400"
                    />
                  </label>
                </div>
              </div>

              {/* Free/Paid */}
              <div className="mt-4">
                <div className="text-sm text-cyan-200/90 mb-2">Free or Paid</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "All" },
                    { id: "free", label: "Free" },
                    { id: "paid", label: "Paid" },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setPaid(opt.id)}
                      className={`px-3 py-1.5 rounded-md text-sm border transition
                        ${paid === opt.id
                          ? "border-cyan-400 bg-cyan-500/10 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,.55)]"
                          : "border-cyan-400/25 text-cyan-200/90 hover:border-cyan-400/70 hover:bg-cyan-500/5"
                        }`}
                      aria-pressed={paid === opt.id}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setSelSkills(new Set());
                    setDateFrom("");
                    setDateTo("");
                    setPaid("all");
                  }}
                  className="w-full rounded-md border border-emerald-400/40 px-3 py-2 text-sm text-emerald-200 hover:shadow-[0_0_12px_rgba(44,255,125,.7)] transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- MODAL ---------- */}
      {selected && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 pt-20 md:pt-24 pb-4"
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
        >
          <div
            className={`relative w-full max-w-3xl max-h-[calc(100vh-6rem)] md:max-h-[85vh] overflow-hidden rounded-2xl border border-emerald-400/50 bg-gradient-to-br from-[#0a0f1e] to-[#070b17] shadow-[0_0_50px_rgba(44,255,125,.4)] ${closing ? "animate-fadeOut" : "animate-fadeIn"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 z-10 inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-emerald-400/60 bg-black/50 backdrop-blur-sm text-emerald-200 hover:bg-emerald-400/20 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(44,255,125,.6)] transition-all duration-300"
              aria-label="Close"
            >
              <FaTimes className="text-base" />
            </button>

            {/* Scrollable content */}
            <div className="max-h-[calc(100vh-6rem)] md:max-h-[85vh] overflow-y-auto custom-scroll">
              {/* Header with image */}
              <div className="relative h-48 md:h-56 overflow-hidden">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b17] via-[#070b17]/50 to-transparent" />

                {/* Status badges overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-all
                    ${selected.hosted?.live
                      ? "border-emerald-400/70 bg-emerald-500/30 text-emerald-100 shadow-[0_0_15px_rgba(44,255,125,.5)]"
                      : "border-red-400/70 bg-red-500/30 text-red-100"}`}>
                    {selected.hosted?.live ? (
                      <>
                        <FaCheckCircle className="text-emerald-300" />
                        <span>Live</span>
                      </>
                    ) : (
                      <>
                        <FaCircle className="text-red-300 text-[6px]" />
                        <span>Offline</span>
                      </>
                    )}
                  </span>

                  {(() => {
                    const isPaid = getPaidFlag(selected);
                    return (
                      <span className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border backdrop-blur-md
                        ${isPaid
                          ? "border-rose-400/70 bg-rose-500/30 text-rose-100"
                          : "border-cyan-400/70 bg-cyan-500/30 text-cyan-100"}`}>
                        {isPaid ? "Paid" : "Free"}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                {/* Title */}
                <header className="mb-4">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {selected.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <FaCalendarAlt className="text-emerald-400" />
                    <span>
                      {selected.uploadedOn
                        ? new Date(selected.uploadedOn).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Date not available"}
                    </span>
                    {selected.type && (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-md border border-purple-400/50 bg-purple-500/20 text-purple-200 hover:scale-105 transition-transform duration-200">
                        #{selected.type}
                      </span>
                    )}
                  </div>
                </header>

                {/* Description */}
                <div className="mb-4">
                  <h4 className="text-base font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-emerald-400 rounded-full" />
                    About this Project
                  </h4>
                  <div className="rounded-lg bg-white/[0.02] border border-emerald-400/20 p-4">
                    {(() => {
                      const description = selected.description || "No description available for this project.";
                      const words = description.split(' ');
                      const shouldTruncate = words.length > 50;
                      const truncatedText = shouldTruncate ? words.slice(0, 50).join(' ') + '...' : description;

                      return (
                        <>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {showFullDescription ? description : truncatedText}
                          </p>
                          {shouldTruncate && (
                            <button
                              type="button"
                              onClick={() => setShowFullDescription(!showFullDescription)}
                              className="mt-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors duration-200 flex items-center gap-1"
                            >
                              {showFullDescription ? (
                                <>
                                  Show Less
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                </>
                              ) : (
                                <>
                                  Read More
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </>
                              )}
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Project Type & Tech Stack */}
                {/* <div className="mb-4">
                  <h4 className="text-base font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-emerald-400 rounded-full" />
                    Tech Stack & Type
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.type && (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-md border border-purple-400/50 bg-purple-500/20 text-purple-200 hover:scale-105 transition-transform duration-200">
                        #{selected.type}
                      </span>
                    )}
                  </div>
                </div> */}

                <div className="mb-4">
                  <h4 className="text-base font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-emerald-400 rounded-full" />
                    Tech Stack Used
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {/* {selected.type && (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-md border border-purple-400/50 bg-purple-500/20 text-purple-200 hover:scale-105 transition-transform duration-200">
                        #{selected.type}
                      </span>
                    )} */}
                    {selected.tech?.length > 0 ? (
                      selected.tech.map((t) => {
                        const color = projectsData.skillColors?.[t] || "bg-cyan-500/15 text-cyan-200 border-cyan-400/40";
                        return (
                          <span
                            key={t}
                            className={`px-2.5 py-1 text-xs font-medium rounded-md border ${color} hover:scale-105 transition-transform duration-200`}
                          >
                            {t}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-slate-400 text-xs">No technologies listed</span>
                    )}
                  </div>
                </div>

                {/* Project Links */}
                <div className="pt-4 border-t border-emerald-400/20">
                  <h4 className="text-base font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-emerald-400 rounded-full" />
                    Quick Links
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {selected.hosted?.live && (
                      <a
                        href={selected.hosted.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:shadow-[0_0_20px_rgba(44,255,125,.6)] hover:scale-105 transition-all duration-300"
                      >
                        <FaExternalLinkAlt className="text-xs" />
                        Visit Live Site
                      </a>
                    )}
                    {selected.github && (
                      <a
                        href={selected.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border-2 border-cyan-400/60 bg-cyan-400/5 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400 hover:shadow-[0_0_18px_rgba(34,211,238,.5)] transition-all duration-300"
                      >
                        <FaGithub className="text-xs" />
                        View on GitHub
                      </a>
                    )}
                    {!selected.hosted?.live && !selected.github && (
                      <p className="text-slate-400 text-xs">No links available for this project</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProjectsPage;
