import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY || document.documentElement.scrollTop;
            setVisible(y > 300);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollUp = () => {
        // scroll body
        window.scrollTo({ top: 0, behavior: "smooth" });
        // if you scroll inside <main>, do that too
        const scroller = document.querySelector("main");
        if (scroller) scroller.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            onClick={scrollUp}
            aria-label="Scroll to top"
            className={`fixed bottom-5 right-5 z-[70] rounded-full border px-4 py-3
                  bg-gradient-to-r from-cyan-500 to-emerald-500 text-black
                  hover:shadow-[0_0_26px_rgba(34,211,238,.55)]
                  transition-all
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-2"}`}
        >
            <FaArrowUp />
        </button>
    );
}
