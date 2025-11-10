import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaSkype,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about-me" },
    { label: "Projects", to: "/my-projects" },
    { label: "Resume", to: "/my-resume" },
    { label: "Contact", to: "/contact-me" },
  ];

  const socials = [
    { icon: <FaFacebookF />, link: "#", label: "Facebook" },
    { icon: <FaInstagram />, link: "#", label: "Instagram" },
    { icon: <FaSkype />, link: "#", label: "Skype" },
    { icon: <FaLinkedinIn />, link: "#", label: "LinkedIn" },
    { icon: <FaGithub />, link: "#", label: "GitHub" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-40">
      {/* Glow strip */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-cyan-400/60 via-green-400/60 to-blue-400/60 blur-[2px]" />

      <nav className="relative bg-black/70 backdrop-blur-md border-b border-cyan-400/20 shadow-lg shadow-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="h-16 flex items-center justify-center gap-30">
            {/* Brand */}
            <Link
              to="/"
              className="text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 transition .3s hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]"
              onClick={() => setOpen(false)}
            >
              Raktim <span className='text-white'> Maity</span>
            </Link>

            {/* Desktop links */}
            <ul className="hidden md:flex items-center gap-8 text-white">
              {navItems.map(({ label, to }) => (
                <li key={to} className="group">
                  <NavLink
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) =>
                      `relative inline-block py-1 transition-colors duration-200 ${
                        isActive ? "text-cyan-300" : "hover:text-cyan-300"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {label}
                        <span
                          className={`absolute left-0 -bottom-0.5 h-[2px] bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 rounded-full transition-all duration-300 ${
                            isActive ? "w-full" : "w-0 group-hover:w-full"
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
              {/* <li>
                <Link
                  to="/contact-me"
                  className="rounded-xl px-4 py-2 bg-gradient-to-r from-cyan-500 to-green-500 text-black font-semibold shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_30px_rgba(34,211,238,0.75)] transition"
                >
                  Let’s Talk
                </Link>
              </li> */}
            </ul>

            {/* Mobile toggle */}
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-cyan-400/30 text-white hover:border-cyan-400/60 hover:shadow-[0_0_12px_rgba(34,211,238,0.6)] transition"
            >
              <span className="sr-only">Menu</span>
              <div className="space-y-1.5">
                <span
                  className={`block h-0.5 w-5 bg-cyan-300 transition-transform ${
                    open ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-cyan-300 transition-opacity ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 bg-cyan-300 transition-transform ${
                    open ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${
            open ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="px-4 pb-4 pt-2">
            <ul className="grid gap-2 text-white">
              {navItems.map(({ label, to }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-2 border transition ${
                        isActive
                          ? "bg-white/10 border-cyan-400/40"
                          : "bg-white/0 hover:bg-white/5 border-cyan-400/10 hover:border-cyan-400/30"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              {/* <li>
                <Link
                  to="/contact-me"
                  onClick={() => setOpen(false)}
                  className="mt-2 block text-center rounded-lg px-4 py-2 bg-gradient-to-r from-cyan-500 to-green-500 text-black font-semibold shadow-[0_0_18px_rgba(34,211,238,0.55)] hover:shadow-[0_0_26px_rgba(34,211,238,0.75)] transition"
                >
                  Let’s Talk
                </Link>
              </li> */}
            </ul>

            {/* Social icons below Let’s Talk */}
            {open && (
              <div className="mt-4 flex justify-center gap-4 border-t border-cyan-400/20 pt-3">
                {socials.map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    title={item.label}
                    className="p-3 rounded-full text-white bg-gradient-to-br from-cyan-500 to-green-500 shadow-md shadow-cyan-500/40 hover:shadow-green-500/60 transition"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom glow */}
      <div className="h-[2px] bg-gradient-to-r from-cyan-500/40 via-green-500/40 to-blue-500/40 blur-[3px]" />
    </header>
  );
};

export default Navbar;
