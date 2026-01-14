import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaSkype, FaLinkedinIn, FaGithub } from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileSocials, setProfileSocials] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/profile`)
      .then((res) => res.json())
      .then((data) =>
        setProfileSocials({
          socialFacebook: data?.socialFacebook || "",
          socialInstagram: data?.socialInstagram || "",
          socialSkype: data?.socialSkype || "",
          socialLinkedIn: data?.socialLinkedIn || "",
          socialGitHub: data?.socialGitHub || "",
        })
      )
      .catch(() => {});
  }, []);

  const navItems = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about-me" },
    { label: "Projects", to: "/my-projects" },
    { label: "Resume", to: "/my-resume" },
    { label: "Testimonials", to: "/review" },
    { label: "Contact", to: "/contact-me" },
  ];

  const socials = [
    { icon: <FaFacebookF />, link: profileSocials.socialFacebook },
    { icon: <FaInstagram />, link: profileSocials.socialInstagram },
    { icon: <FaSkype />, link: profileSocials.socialSkype },
    { icon: <FaLinkedinIn />, link: profileSocials.socialLinkedIn },
    { icon: <FaGithub />, link: profileSocials.socialGitHub },
  ].filter((social) => social.link && social.link.trim().length > 0);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-black/70 backdrop-blur-xl shadow-[0_0_20px_rgba(34,211,238,0.3)]" : "bg-transparent"
      }`}
    >
      <nav className="relative border-b border-cyan-400/20">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="flex justify-between items-center h-16">
            {/* Brand */}
            <Link
              to="/"
              className="text-2xl md:text-3xl lg:3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.7)] transition"
            >
              Raktim <span className="text-white">Maity</span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 text-white">
              <ul className="flex gap-8">
                {navItems.map(({ label, to }) => (
                  <li key={to} className="relative group">
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `text-sm uppercase tracking-wide transition-colors duration-200 ${
                          isActive ? "text-cyan-400" : "hover:text-cyan-300"
                        }`
                      }
                    >
                      {label}
                      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 rounded-full transition-all duration-300 group-hover:w-full" />
                    </NavLink>
                  </li>
                ))}
              </ul>
              {/* {socials.length > 0 && (
                <div className="flex items-center gap-4">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.link}
                      className="text-cyan-300 text-lg hover:text-green-400 transition transform hover:rotate-6 hover:scale-110"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              )} */}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-cyan-300 border border-cyan-400/40 rounded-lg p-2 hover:border-cyan-300 transition"
            >
              <div className="space-y-1">
                <span
                  className={`block w-5 h-0.5 bg-cyan-300 transition-transform ${open ? "rotate-45 translate-y-1.5" : ""}`}
                />
                <span
                  className={`block w-5 h-0.5 bg-cyan-300 transition-opacity ${open ? "opacity-0" : "opacity-100"}`}
                />
                <span
                  className={`block w-5 h-0.5 bg-cyan-300 transition-transform ${open ? "-rotate-45 -translate-y-1.5" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 backdrop-blur-md ${
            open ? "max-h-96 border-t border-cyan-400/20" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col items-center gap-4 py-4 text-white">
            {navItems.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setOpen(false)}
                  className="px-6 py-2 text-sm tracking-wider uppercase border border-cyan-400/20 rounded-full hover:border-cyan-400/60 hover:bg-cyan-400/10 transition"
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <div className="flex gap-5 mt-4">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.link}
                  className="text-cyan-300 text-lg hover:text-green-400 transition transform hover:rotate-6 hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
