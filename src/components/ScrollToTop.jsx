import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If there’s a hash, try to scroll to that element smoothly
    if (hash) {
      requestAnimationFrame(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
        // If your app uses a custom scroll container:
        const scroller = document.querySelector("main");
        if (scroller) scroller.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      });
      return;
    }

    // Default: scroll page (and any scrollable <main>) to top smoothly
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    const scroller = document.querySelector("main");
    if (scroller) scroller.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname, search, hash]);

  return null;
}
