import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

const fallbackItems = [
  {
    title: "Line Following Car",
    date: "21-11-2024",
    img: "https://picsum.photos/600/400?random=11",
    desc: "A showcase of teamwork and iterative prototyping on a robotics challenge.",
  },
  {
    title: "Intel Industrial Training",
    date: "17-07-2024",
    img: "https://picsum.photos/600/400?random=12",
    desc: "Completed a professional training program with real-world project exposure.",
  },
];

const CoActivitiesPage = () => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/co-activities`)
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      // Try parsing different date formats
      let date;

      // Check if it's in DD-MM-YYYY format
      if (dateString.includes('-') && dateString.split('-')[0].length <= 2) {
        const [day, month, year] = dateString.split('-');
        date = new Date(`${year}-${month}-${day}`);
      } else {
        date = new Date(dateString);
      }

      // Check if date is valid
      if (isNaN(date.getTime())) return dateString;

      // Format as "Jan 14, 2025"
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch (error) {
      return dateString;
    }
  };

  const displayItems = items.length
    ? items.map((item) => ({
        title: item?.title || "Untitled Activity",
        date: item?.date || "",
        img: item?.imageUrl || "https://picsum.photos/600/400?random=11",
        desc: item?.description || "",
      }))
    : fallbackItems;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setSelected(null);
      setClosing(false);
    }, 250);
  };

  return (
    <section className="min-h-screen bg-[#050914] text-white pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            Co-Curricular Activities
          </h1>
          <div className="mx-auto mt-3 h-[2px] w-40 bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 rounded-full shadow-[0_0_18px_rgba(16,185,129,0.5)]" />
          <p className="mt-4 text-emerald-100/70 text-lg">
            Total Activities: {displayItems.length}
          </p>
        </div>

        {/* Grid Layout for Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="group bg-[#0a1224] border border-emerald-400/20 rounded-2xl shadow-[0_0_28px_rgba(16,185,129,0.18)] overflow-hidden hover:shadow-[0_0_40px_rgba(16,185,129,0.35)] transition-all duration-300 hover:scale-105 flex flex-col"
            >
              <div className="relative w-full h-48 bg-gradient-to-br from-emerald-900/20 to-cyan-900/20">
                <div className="absolute top-3 left-3 z-10 bg-emerald-400/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                  #{index + 1}
                </div>
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg md:text-xl font-semibold text-emerald-100 line-clamp-2 min-h-[3.5rem]">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-emerald-200/70 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(item.date)}
                </p>
                <p className="mt-3 text-sm text-emerald-100/70 line-clamp-3 flex-grow">
                  {item.desc || "No description available."}
                </p>
                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  className="mt-4 w-full px-5 py-2.5 text-xs uppercase tracking-wider rounded-lg bg-gradient-to-r from-emerald-500 to-lime-500 text-white shadow-[0_0_16px_rgba(16,185,129,0.5)] hover:shadow-[0_0_24px_rgba(16,185,129,0.8)] transition-all font-semibold"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal - Matching Project Modal Design */}
      {selected && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={handleClose}
          aria-modal="true"
          role="dialog"
        >
          <div
            className={`relative w-full max-w-3xl my-auto rounded-2xl border border-emerald-400/50 bg-gradient-to-br from-[#0a0f1e] to-[#070b17] shadow-[0_0_50px_rgba(44,255,125,.4)] overflow-hidden ${
              closing ? "animate-fadeOut" : "animate-fadeIn"
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: 'calc(100vh - 8rem)' }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-3 z-20 inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-emerald-400/60 bg-black/50 backdrop-blur-sm text-emerald-200 hover:bg-emerald-400/20 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(44,255,125,.6)] transition-all duration-300"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Scrollable content */}
            <div className="overflow-y-auto custom-scroll" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
              {/* Header with image */}
              <div className="relative h-48 md:h-64 overflow-hidden">
                <img
                  src={selected.img}
                  alt={selected.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b17] via-[#070b17]/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                {/* Title */}
                <header className="mb-4">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {selected.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {formatDate(selected.date)}
                    </span>
                  </div>
                </header>

                {/* Description */}
                <div className="mb-4">
                  <h4 className="text-base font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-emerald-400 rounded-full" />
                    About this Activity
                  </h4>
                  <div className="rounded-lg bg-white/[0.02] border border-emerald-400/20 p-4">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {selected.desc || "No description available for this activity."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CoActivitiesPage;
