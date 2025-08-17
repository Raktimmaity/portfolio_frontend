import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SideTabLink = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setVisible(y > 300); // same threshold as BackToTop
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Link
      to="/review"
      aria-label="Open reviews"
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-[70] transition-all
        ${visible ? "opacity-100 pointer-events-auto translate-x-0"
                  : "opacity-0 pointer-events-none translate-x-2"}`}
    >
      <div
        className="h-25 w-10 rounded-l-2xl border text-black
                   bg-gradient-to-r from-cyan-500 to-emerald-500
                   hover:shadow-[0_0_26px_rgba(34,211,238,.5)]
                   transition-all"
      >
        {/* vertical label (no extra space) */}
        <div className="h-full w-full flex items-center justify-center">
          <span className="writing-vertical-rl font-bold tracking-wider text-[11px]">
            Testimonial
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SideTabLink;
