import React, { useEffect, useMemo, useRef, useState } from "react";
import { projectsData } from "../data/projects";
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

const ProjectsPage = () => {
  const [selected, setSelected] = useState(null); // project object
  const [closing, setClosing] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const listRef = useRef(null);

  /* ------------ FILTER STATE ------------ */
  const [selSkills, setSelSkills] = useState(new Set()); // empty = All
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [paid, setPaid] = useState("all"); // 'all' | 'free' | 'paid'

  /* ------------ PAGINATION ------------ */
  const [page, setPage] = useState(1);

  // modal controls
  const openModal = (project) => setSelected(project);
  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setSelected(null);
      setClosing(false);
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
    const base = Array.isArray(projectsData.skills) ? projectsData.skills : ["All"];
    const s = new Set(base);
    projectsData.items?.forEach((p) => p.tech?.forEach((t) => s.add(t)));
    const arr = Array.from(s).filter((x) => x && x !== "All");
    return arr.sort();
  }, []);

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
  }, [selSkills, dateFrom, dateTo, paid]);

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
      const containerTopAbs = containerRect.top + window.scrollY;
      const containerBottomAbs = containerRect.bottom + window.scrollY;

      const asideH = dims.h || asideWrapRef.current.offsetHeight;

      // start fixing when top passes wrapper top minus the navbar offset
      const startFixY = baseTopAbsRef.current - NAV_OFFSET_PX;

      // stop fixing when the bottom of the container is reached (just before footer),
      // i.e., when the fixed aside’s bottom would pass the container bottom
      const stopFixY = containerBottomAbs - NAV_OFFSET_PX - asideH;

      if (scrollY < startFixY) {
        setFixed(false);
        setBottomed(false);
      } else if (scrollY >= startFixY && scrollY <= stopFixY) {
        setFixed(true);
        setBottomed(false);
      } else {
        setFixed(false);
        setBottomed(true); // pin to bottom of its column
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dims.h]);

  /* ---------- RENDER ---------- */
  return (
    <main className="min-h-screen text-white">
      {/* ---------- HERO (unchanged) ---------- */}
      <section className="relative overflow-hidden h-[40vh] md:h-[80vh] w-screen flex items-center">
        <div className="pointer-events-none absolute -top-40 left-0 right-0 h-[450px] opacity-90">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/70 via-violet-700/60 to-fuchsia-700/50 blur-2xl" />
          <div className="absolute inset-x-0 top-16 h-40 bg-gradient-to-r from-emerald-500/40 via-cyan-400/30 to-emerald-500/40 blur-xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-[0_0_20px_rgba(44,255,125,0.35)]">
            {projectsData.summary.heroTitle}
          </h1>
          <p className="mt-4 text-cyan-100/90 max-w-3xl mx-auto">
            {projectsData.summary.heroSub} Already{" "}
            <span className="font-extrabold text-emerald-400 drop-shadow-[0_0_10px_rgba(44,255,125,.55)]">
              {projectsData.summary.total}+
            </span>{" "}
            uploaded.
          </p>
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
        <div className="md:hidden mb-4 flex items-center justify-between relative z-[41]">
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
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      zIndex: 20,
                    }
                    : undefined
              }
            >
              <div className="rounded-xl bg-gradient-to-br from-gray-900/70 to-gray-800/50 border border-emerald-400/30 p-4">
                {/* Skills (multi-select) */}
                <h3 className="font-bold mb-3 text-white">Filter by Skills</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setSelSkills(new Set())}
                    className={`px-3 py-1.5 rounded-full text-sm border transition
                      ${selSkills.size === 0
                        ? "border-emerald-400 bg-emerald-500/10 text-emerald-200 shadow-[0_0_14px_rgba(44,255,125,.55)]"
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
                        onClick={() => {
                          setSelSkills((prev) => {
                            const next = new Set(prev);
                            on ? next.delete(s) : next.add(s);
                            return next;
                          });
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm border transition
                          ${on
                            ? "border-emerald-400 bg-emerald-500 text-emerald-200 shadow-[0_0_14px_rgba(44,255,125,.55)]"
                            : "border-emerald-400/25 text-white hover:border-emerald-400/70 hover:bg-emerald-500/5"}`}
                        aria-pressed={on}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>

                {/* Date */}
                <h3 className="font-bold mb-2 text-white">Filter by Date</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
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

                {/* Free/Paid */}
                <h3 className="font-bold mb-2 text-emerald-300">Free or Paid</h3>
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
                          ? "border-cyan-400 bg-cyan-500/10 text-white shadow-[0_0_14px_rgba(34,211,238,.55)]"
                          : "border-cyan-400/25 text-white hover:border-cyan-400/70 hover:bg-cyan-500/5"
                        }`}
                      aria-pressed={paid === opt.id}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Reset */}
                <div className="mt-4">
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
          </aside>

          {/* -------- CARDS GRID -------- */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {total === 0 ? (
              <div className="col-span-full rounded-xl border border-emerald-400/30 bg-black/30 p-6 text-center text-cyan-200">
                No projects found.
              </div>
            ) : (
              pageItems.map((p) => (
                <article
                  key={p.id}
                  className="group relative rounded-2xl overflow-hidden border border-emerald-400/25 bg-gradient-to-br from-gray-900/70 to-gray-800/50
                             shadow-[0_0_0_rgba(0,0,0,0)] hover:shadow-[0_0_28px_rgba(44,255,125,.25)]
                             transition-all duration-300 will-change-transform hover:-translate-y-0.5"
                >
                  {/* glow */}
                  <span
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                               bg-[radial-gradient(300px_120px_at_20%_20%,rgba(16,185,129,.15),transparent_60%),radial-gradient(300px_120px_at_80%_0%,rgba(34,211,238,.15),transparent_60%)]
                               transition-opacity duration-300"
                    aria-hidden
                  />

                  {/* image header (16:9) */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* live badge */}
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-emerald-400/60 bg-black/50 px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-emerald-200 backdrop-blur-sm">
                      {p.hosted?.live ? (
                        <FaCheckCircle className="text-emerald-400" />
                      ) : (
                        <FaCircle className="text-red-400" />
                      )}
                      {p.hosted?.live ? "Live Hosted" : "Not Hosted"}
                    </span>

                    {/* paid/free pill */}
                    {(() => {
                      const isPaid = getPaidFlag(p);
                      return (
                        <span className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[11px] uppercase tracking-wide border backdrop-blur-sm ${isPaid ? "border-rose-400/60 text-white bg-rose-500/20" : "border-emerald-400/60 text-emerald-200 bg-emerald-500/20"
                          }`}>
                          {isPaid ? "Paid" : "Free"}
                        </span>
                      );
                    })()}
                  </div>

                  {/* body */}
                  <div className="p-4">
                    <h3 className="font-bold text-[1.05rem]">{p.title}</h3>

                    {/* skill chips with colors */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {p.tech?.map((t) => {
                        const color = projectsData.skillColors?.[t] || "bg-cyan-500/20 text-cyan-100 border-cyan-400/30";
                        return (
                          <span
                            key={t}
                            className={`text-[11px] rounded-full px-2 py-0.5 border ${color}`}
                          >
                            {t}
                          </span>
                        );
                      })}
                    </div>

                    {/* meta */}
                    <div className="mt-3 flex items-center gap-2 text-xs text-cyan-200">
                      <FaCalendarAlt /> Uploaded on: {p.uploadedOn}
                    </div>

                    {/* footer actions */}
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => openModal(p)}
                        className="px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-cyan-500 to-emerald-500 text-black hover:shadow-[0_0_16px_rgba(44,255,125,.8)] transition"
                      >
                        Details
                      </button>

                      <div className="flex gap-2">
                        {p.hosted?.live && (
                          <a
                            href={p.hosted.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm border border-emerald-400/60 text-emerald-300 hover:shadow-[0_0_14px_rgba(44,255,125,.55)] transition"
                          >
                            Visit <FaExternalLinkAlt />
                          </a>
                        )}
                        {p.github && (
                          <a
                            href={p.github}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm border border-cyan-400/60 text-cyan-300 hover:shadow-[0_0_14px_rgba(34,211,238,.55)] transition"
                          >
                            Github <FaGithub />
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
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-gray-900/95 border-t border-emerald-400/30 p-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div className="mx-auto max-w-6xl">
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

      {/* ---------- MODAL (unchanged) ---------- */}
      {selected && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
        >
          <div
            className={`relative w-[min(92vw,720px)] max-h-[86vh] overflow-y-auto rounded-xl border border-emerald-400/40 bg-gray-900/95 p-4 sm:p-5 shadow-[0_0_30px_rgba(44,255,125,.35)] ${closing ? "animate-fadeOut" : "animate-fadeIn"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 inline-grid place-items-center rounded-md border border-emerald-400/40 p-2 text-emerald-200 hover:shadow-[0_0_12px_rgba(44,255,125,.7)] transition"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <header className="mb-3">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400">
                {selected.title}
              </h3>
            </header>

            <div className="w-full overflow-hidden rounded-lg border border-emerald-400/25">
              <img
                src={selected.image}
                alt={selected.title}
                className="w-full max-h-52 object-cover"
              />
            </div>
            <div className="mt-1 text-xs text-cyan-300 flex items-center gap-2">
            <FaCalendarAlt />   <span className='text-white'>Uploaded at: </span> {selected.uploadedOn}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span>Skills Used: </span>
              {selected.tech?.map((t) => {
                const color = projectsData.skillColors?.[t] || "bg-cyan-500/20 text-cyan-100 border-cyan-400/30";
                return (
                  <>
                    <span key={t} className={`px-2 py-1 text-xs rounded-full border ${color}`}>
                      {t}
                    </span>
                  </>
                );
              })}
            </div>
            {/* <p className='bg-gray-800 py-1 rounded text-white'>Description:</p> */}
            <div className="custom-scroll mt-4 max-h-56 overflow-y-auto h-[90px] pr-1 border border-emerald-400/25 p-2 rounded">
              <p className="text-sm leading-relaxed text-cyan-100">
                {selected.description}
              </p>
            </div>


            <footer className="mt-5 flex items-center gap-2 justify-end">
              {selected.hosted?.live && (
                <a
                  href={selected.hosted.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 font-semibold text-black hover:shadow-[0_0_16px_rgba(44,255,125,.8)] transition"
                >
                  Visit <FaExternalLinkAlt />
                </a>
              )}
              {selected.github && (
                <a
                  href={selected.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-400/60 px-4 py-2 text-cyan-300 hover:shadow-[0_0_14px_rgba(34,211,238,.55)] transition"
                >
                  Github <FaGithub />
                </a>
              )}
            </footer>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProjectsPage;
