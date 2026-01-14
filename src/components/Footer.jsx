import React, { useEffect, useState } from "react";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaGithub,
    FaSkype,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
} from "react-icons/fa";
import { Link } from "react-router-dom";   // ✅ added

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";


// ✅ updated to match Navbar routes
const links = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about-me" },
    { label: "Resume", to: "/my-resume" },
    { label: "Projects", to: "/my-projects" },
    { label: "Contact", to: "/contact-me" },
];
// const important = ["Contact", "Feedback", "Testimonial", "Co-Activities"];

const important = [
    {label: "Conatct", to: "/contact-me"},
    {label: "Testimonial", to: "/review"},
    {label: "Co-Activities", to: "/co-activities"},
]

const Footer = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/api/profile`)
            .then((res) => res.json())
            .then((data) => setProfile(data))
            .catch(() => {});
    }, []);

    /* —— editable data —— */
    const brand = {
        name: profile?.name || "Raktim Maity",
        title: profile?.job || "Web Developer, Front-End Web Developer, UI Developer",
        avatar: profile?.avatar || "https://i.pravatar.cc/180?img=13",
        socials: [
            { icon: <FaFacebookF />, href: profile?.socialFacebook || "" },
            { icon: <FaInstagram />, href: profile?.socialInstagram || "" },
            { icon: <FaSkype />, href: profile?.socialSkype || "" },
            { icon: <FaLinkedinIn />, href: profile?.socialLinkedIn || "" },
            { icon: <FaGithub />, href: profile?.socialGitHub || "" },
        ].filter((item) => item.href && item.href.trim().length > 0),
    };

    const contact = {
        location: { icon: <FaMapMarkerAlt />, text: profile?.address || "Tamluk, West Bengal" },
        phone: {
            icon: <FaPhoneAlt />,
            text: profile?.phone || "+91 6295396929",
            href: `tel:${profile?.phone || "+916295396929"}`,
        },
        email: {
            icon: <FaEnvelope />,
            text: profile?.email || "reach.raktimmaity@gmail.com",
            href: `mailto:${profile?.email || "reach.raktimmaity@gmail.com"}`,
        },
    };

    return (
        <footer className="relative bg-[#0b0f19] text-white mt-24">
            {/* Wavy top */}
            {/* Wavy top */}
            <div className="absolute -top-16 w-full overflow-hidden leading-[0]">
                <svg
                    className="block w-full h-20 md:h-28 wave-animate"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M321.39,56.44C211.25,78.93,105.62,95.66,0,89.35V0H1200V89.35c-110.41,6.31-220.82-10.42-331.23-32.91C758.18,33.94,639.77,0,521.36,0,402.95,0,433.54,33,321.39,56.44Z"
                        className="fill-[#0b0f19]"
                        fillOpacity="1"
                    />
                    <path
                        d="M0,0V20C120,60,300,80,480,60C660,40,840,0,1020,10C1140,15,1200,30,1200,30V0Z"
                        className="fill-cyan-500/20"
                    />
                    <path
                        d="M0,0V15C200,55,400,70,600,50C800,30,1000,0,1200,15V0Z"
                        className="fill-green-500/20"
                    />
                </svg>
            </div>


            {/* content */}
            <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-10">
                <div className="grid md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-4">
                            <img
                                src={brand.avatar}
                                alt={brand.name}
                                className="w-20 h-20 rounded-full ring-4 ring-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                            />
                            <div>
                                <h3 className="text-xl font-bold">{brand.name}</h3>
                                <p className="text-sm text-cyan-200">{brand.title}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-3">
                            {brand.socials.map((s, i) => (
                                <a
                                    key={i}
                                    href={s.href}
                                    className="p-2.5 rounded-full bg-gradient-to-br from-cyan-500 to-green-500 text-black
                             shadow-[0_0_16px_rgba(34,211,238,0.45)] hover:shadow-[0_0_24px_rgba(34,211,238,0.7)] transition"
                                    aria-label="social"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-sm tracking-widest text-cyan-200 mb-3">LINKS</h4>
                        <ul className="space-y-2">
                            {links.map(({ label, to }) => (
                                <li key={to} className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                                    <Link
                                        to={to}
                                        className="text-gray-200 hover:text-white transition"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Important Links */}
                    <div>
                        <h4 className="font-semibold text-sm tracking-widest text-cyan-200 mb-3">
                            IMPORTANT LINKS
                        </h4>
                        <ul className="space-y-2">
                            {important.map(({ label, to}) => (
                                <li key={to} className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                                    <Link
                                        // href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                                        to={to}
                                        className="text-gray-200 hover:text-white transition"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-sm tracking-widest text-cyan-200 mb-3">CONTACT</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="text-cyan-300 mt-0.5">{contact.location.icon}</span>
                                <span className="text-gray-200">{contact.location.text}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-cyan-300 mt-0.5">{contact.phone.icon}</span>
                                <a href={contact.phone.href} className="text-gray-200 hover:text-white transition">
                                   +91{" "} {contact.phone.text}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-cyan-300 mt-0.5">{contact.email.icon}</span>
                                <a href={contact.email.href} className="text-gray-200 hover:text-white transition">
                                    {contact.email.text}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* separator */}
                <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />


                {/* bottom line */}
                <div className="text-center text-sm text-cyan-200 mt-4">
                    © Copyright{" "}
                    <a
                        href="#home"
                        className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400"
                    >
                        {brand.name}
                    </a>{" "}
                    {new Date().getFullYear()} - {new Date().getFullYear() + 1}
                </div>
            </div>
            <style>
                {`
    @keyframes waveMove {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
      100% { transform: translateY(0px); }
    }
    .wave-animate path {
      animation: waveMove 3s ease-in-out infinite;
    }
  `}
            </style>

        </footer>

    );
};

export default Footer;
