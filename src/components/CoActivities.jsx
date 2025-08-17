import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

const items = [
    {
        title: "Neon Styled Section",
        date: "Aug 2025",
        img: "https://picsum.photos/500/300?random=1",
        desc: "This is an example of a card styled with the same neon theme as the rest of your portfolio. ".repeat(30),
        tech: ["React", "Tailwind", "Neon Theme"],
    },
    {
        title: "Another Example Card",
        date: "July 2025",
        img: "https://picsum.photos/500/300?random=2",
        desc: "This modal can hold screenshots, longer text, or even embedded media. ".repeat(25),
        tech: ["JavaScript", "CSS", "Animations"],
    },
];

const CoActivities = () => {
    const [selected, setSelected] = useState(null);
    const [closing, setClosing] = useState(false);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            setSelected(null);
            setClosing(false);
        }, 300); // fade-out duration
    };

    return (
        <section
            id="co-activities"
            className="relative py-16 px-6 md:px-12 max-w-6xl mx-auto mt-20"
        >
            {/* Title */}
            <h2 className="text-center text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 mb-10">
                Co-Activities
            </h2>
            {/* half-width divider under the heading */}
<div className="flex justify-center -mt-6 mb-8" aria-hidden="true">
  <span className="inline-block h-[2px] w-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
</div>


            {/* Cards */}
            <div className="grid md:grid-cols-2 gap-8">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className="p-6 rounded-xl bg-gradient-to-br from-gray-900/70 to-gray-800/50 border border-cyan-400/30 hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition"
                    >
                        <img
                            src={item.img}
                            alt={item.title}
                            className="rounded-lg mb-4 border border-cyan-400/20 shadow-md"
                        />
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="flex items-center gap-2 text-sm text-cyan-300">
                            <FaCalendarAlt /> {item.date}
                        </p>

                        <button
                            onClick={() => setSelected(item)}
                            className="mt-5 px-5 py-2 text-sm font-medium text-white rounded-full bg-gradient-to-r from-cyan-500 to-green-500 hover:shadow-[0_0_15px_rgba(34,211,238,1)] transition"
                        >
                            Details
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selected && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
                    onClick={handleClose}
                >
                    <div
                        className={`relative w-full max-w-md mx-4 bg-gray-900 p-4 rounded-xl mt-6 transform transition-all duration-300 ${closing ? "animate-fadeOut" : "animate-fadeIn"
                            } max-h-[55vh] md:max-h-[100vh] overflow-y-auto md:mt-14`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal content */}
                        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 mb-2">
                            {selected.title}
                        </h3>
                        <img
                            src={selected.img}
                            alt={selected.title}
                            className="rounded-lg mb-3 border border-cyan-400/20 shadow-md"
                        />
                        <p className="text-xs text-cyan-300 mb-2 flex justify-start items-center gap-2"><FaCalendarAlt className="inline"/> {selected.date}</p>

                        {/* Scrollable description */}
                        <p className="bg-gray-700 text-white px-2 mb-2">Description:</p>
                        <div className="max-h-20 md:max-h-20 overflow-y-auto pr-2 custom-scroll text-sm leading-relaxed">
                            <p className="text-gray-200">{selected.desc}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {selected.tech.map((t, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-cyan-500 to-green-500 text-white"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Bottom-right close button */}
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleClose}
                                className="px-4 py-1.5 text-xs font-medium text-white rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-[0_0_10px_rgba(239,68,68,1)] transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </section>
    );
};

export default CoActivities;
