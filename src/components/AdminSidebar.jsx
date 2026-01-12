import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../utils/auth";
import {
  FaChartPie,
  FaUsers,
  FaCogs,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaChevronDown,
  FaChevronUp,
  FaLayerGroup,
  FaInfoCircle,
  FaFileAlt,
  FaProjectDiagram,
  FaWaveSquare,
  FaEnvelope,
  FaStar,
} from "react-icons/fa";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [activitySectionOpen, setActivitySectionOpen] = useState(false);
  const [coActivitySectionOpen, setCoActivitySectionOpen] = useState(false);
  const [strengthsHobbyMenuOpen, setStrengthsHobbyMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [siteOpen, setSiteOpen] = useState(false);
  const isAboutSectionRoute = location.pathname.startsWith("/admin-about-section");
  const isAboutSkillsRoute = location.pathname.startsWith("/admin-about-skills");
  const isAboutLanguageRoute = location.pathname.startsWith("/admin-about-language");
  const isAboutResumeRoute = location.pathname.startsWith("/admin-about-resume");
  const isAboutRoute =
    isAboutSectionRoute || isAboutSkillsRoute || isAboutLanguageRoute || isAboutResumeRoute;
  const isResumeAddRoute = location.pathname.startsWith("/admin-resume-add");
  const isResumeViewRoute = location.pathname.startsWith("/admin-resume-view");
  const isResumeRoute = isResumeAddRoute || isResumeViewRoute;
  const isPortfolioAddRoute = location.pathname.startsWith("/admin-portfolio-add");
  const isPortfolioViewRoute = location.pathname.startsWith("/admin-portfolio-view");
  const isPortfolioRoute = isPortfolioAddRoute || isPortfolioViewRoute;
  const isActivitiesAddRoute = location.pathname.startsWith("/admin-activities-add");
  const isActivitiesViewRoute = location.pathname.startsWith("/admin-activities-view");
  const isCoActivitiesAddRoute = location.pathname.startsWith("/admin-coactivities-add");
  const isCoActivitiesViewRoute = location.pathname.startsWith("/admin-coactivities-view");
  const isStrengthsHobbyAddRoute = location.pathname.startsWith("/admin-strengths-hobby-add");
  const isStrengthsHobbyViewRoute = location.pathname.startsWith("/admin-strengths-hobby-view");
  const isActivitiesRoute =
    isActivitiesAddRoute ||
    isActivitiesViewRoute ||
    isCoActivitiesAddRoute ||
    isCoActivitiesViewRoute;
  const isStrengthsHobbyRoute = isStrengthsHobbyAddRoute || isStrengthsHobbyViewRoute;
  const isProfileRoute = location.pathname.startsWith("/admin-profile");
  const isCoverRoute = location.pathname.startsWith("/admin-cover-photo");
  const isSocialRoute = location.pathname.startsWith("/admin-social-links");
  const isSecurityRoute = location.pathname.startsWith("/admin-account-security");
  const isAccountRoute = isProfileRoute || isCoverRoute || isSocialRoute || isSecurityRoute;
  const isFaviconRoute = location.pathname.startsWith("/admin-favicon");
  const isSeoRoute = location.pathname.startsWith("/admin-seo");
  const isSectionRoute = location.pathname.startsWith("/admin-section-controls");
  const isSiteRoute = isFaviconRoute || isSeoRoute || isSectionRoute;

  useEffect(() => {
    if (isAboutRoute) setAboutOpen(true);
  }, [location.pathname]);
  useEffect(() => {
    if (isResumeRoute) setResumeOpen(true);
  }, [location.pathname]);
  useEffect(() => {
    if (isPortfolioRoute) setPortfolioOpen(true);
  }, [location.pathname]);
  useEffect(() => {
    if (isActivitiesRoute) setActivitiesOpen(true);
    if (isActivitiesAddRoute || isActivitiesViewRoute) setActivitySectionOpen(true);
    if (isCoActivitiesAddRoute || isCoActivitiesViewRoute) setCoActivitySectionOpen(true);
    if (isStrengthsHobbyRoute) setStrengthsHobbyMenuOpen(true);
  }, [location.pathname]);
  useEffect(() => {
    if (isAccountRoute) setAccountOpen(true);
  }, [location.pathname]);
  useEffect(() => {
    if (isSiteRoute) setSiteOpen(true);
  }, [location.pathname]);

  const handleLogout = () => {
    logoutAdmin(navigate);
  };

  return (
    <>
      {/* ===== Topbar (mobile only) ===== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0b1120]/90 backdrop-blur-lg border-b border-cyan-400/10 flex items-center justify-between px-4 py-3">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
          Admin Panel
        </h2>
        <button
          onClick={() => setOpen(!open)}
          className="text-cyan-400 text-2xl focus:outline-none"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* ===== Sidebar ===== */}
      <aside
        className={`fixed ${
          open ? "top-14" : "top-14 -translate-x-full"
        } md:top-0 left-0 h-[calc(100vh-56px)] md:h-screen w-64 bg-[#0b1120]/80 backdrop-blur-lg border-r border-cyan-400/20 shadow-[0_0_25px_rgba(34,211,238,0.2)] flex flex-col z-40 transform transition-transform duration-500 ease-in-out md:translate-x-0`}
      >
        {/* Sidebar Header (hidden on mobile) */}
        <div className="hidden md:block px-6 py-5 border-b border-cyan-400/10">
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">
            Admin Panel
          </h2>
        </div>

        {/* ===== Scrollable Menu Section ===== */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col space-y-1">
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-400/10 border-r-4 border-cyan-400 text-cyan-300"
                    : ""
                }`
              }
              onClick={() => setOpen(false)}
            >
              <FaHome className="text-lg" /> Dashboard
            </NavLink>

            {/* Dropdown for About */}
            <div className="flex flex-col">
              <button
                onClick={() => setAboutOpen(!aboutOpen)}
                className={`flex items-center justify-between px-6 py-3 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 ${
                  isAboutRoute ? "text-cyan-300" : "text-gray-300"
                }`}
              >
                <span className="flex items-center gap-3">
                  <FaInfoCircle className="text-lg" /> About
                </span>
                {aboutOpen ? (
                  <FaChevronUp className="text-sm" />
                ) : (
                  <FaChevronDown className="text-sm" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  aboutOpen ? "max-h-72" : "max-h-0"
                }`}
              >
                <NavLink
                  to="/admin-about-section"
                  className={`block pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isAboutSectionRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setAboutOpen(true);
                  }}
                >
                  About Section
                </NavLink>
                <NavLink
                  to="/admin-about-skills"
                  className={`block pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isAboutSkillsRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setAboutOpen(true);
                  }}
                >
                  Skills
                </NavLink>
                <NavLink
                  to="/admin-about-language"
                  className={`block pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isAboutLanguageRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setAboutOpen(true);
                  }}
                >
                  Language
                </NavLink>
                <NavLink
                  to="/admin-about-resume"
                  className={`block pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isAboutResumeRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setAboutOpen(true);
                  }}
                >
                  CV/Resume
                </NavLink>
              </div>
            </div>

            {/* Dropdown for Resume */}
            <div className="flex flex-col">
              <button
                onClick={() => setResumeOpen(!resumeOpen)}
                className={`flex items-center justify-between px-6 py-3 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 ${
                  isResumeRoute ? "text-cyan-300" : "text-gray-300"
                }`}
              >
                <span className="flex items-center gap-3">
                  <FaFileAlt className="text-lg" /> Resume
                </span>
                {resumeOpen ? (
                  <FaChevronUp className="text-sm" />
                ) : (
                  <FaChevronDown className="text-sm" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  resumeOpen ? "max-h-40" : "max-h-0"
                }`}
              >
                <NavLink
                  to="/admin-resume-add"
                  className={`block pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isResumeAddRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setResumeOpen(true);
                  }}
                >
                  Add Data
                </NavLink>
                <NavLink
                  to="/admin-resume-view"
                  className={`block pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isResumeViewRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setResumeOpen(true);
                  }}
                >
                  View Data
                </NavLink>
              </div>
            </div>

            {/* Dropdown for Portfolio */}
            <div className="flex flex-col">
              <button
                onClick={() => setPortfolioOpen(!portfolioOpen)}
                className={`flex items-center justify-between px-6 py-3 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 ${
                  isPortfolioRoute ? "text-cyan-300" : "text-gray-300"
                }`}
              >
                <span className="flex items-center gap-3">
                  <FaProjectDiagram className="text-lg" /> Portfolio
                </span>
                {portfolioOpen ? (
                  <FaChevronUp className="text-sm" />
                ) : (
                  <FaChevronDown className="text-sm" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  portfolioOpen ? "max-h-40" : "max-h-0"
                }`}
              >
                <NavLink
                  to="/admin-portfolio-add"
                  className={`block pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isPortfolioAddRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setPortfolioOpen(true);
                  }}
                >
                  Add New
                </NavLink>
                <NavLink
                  to="/admin-portfolio-view"
                  className={`block pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isPortfolioViewRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setPortfolioOpen(true);
                  }}
                >
                  View Data
                </NavLink>
              </div>
            </div>

            {/* Dropdown for Activities */}
            <div className="flex flex-col">
              <button
                onClick={() => setActivitiesOpen(!activitiesOpen)}
                className={`flex items-center justify-between px-6 py-3 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 ${
                  isActivitiesRoute ? "text-cyan-300" : "text-gray-300"
                }`}
              >
                <span className="flex items-center gap-3">
                  <FaWaveSquare className="text-lg" /> Activities
                </span>
                {activitiesOpen ? (
                  <FaChevronUp className="text-sm" />
                ) : (
                  <FaChevronDown className="text-sm" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activitiesOpen ? "max-h-96" : "max-h-0"
                }`}
              >
                <button
                  onClick={() => setActivitySectionOpen(!activitySectionOpen)}
                  className={`flex w-full items-center justify-between pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isActivitiesAddRoute || isActivitiesViewRoute
                      ? "text-cyan-300 font-semibold"
                      : "text-gray-400"
                  }`}
                >
                  <span>Activities</span>
                  {activitySectionOpen ? (
                    <FaChevronUp className="text-xs" />
                  ) : (
                    <FaChevronDown className="text-xs" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activitySectionOpen ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <NavLink
                    to="/admin-activities-add"
                    className={`block pl-20 pr-6 py-2 text-xs hover:text-cyan-300 ${
                      isActivitiesAddRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                    }`}
                    onClick={() => {
                      setOpen(false);
                      setActivitiesOpen(true);
                      setActivitySectionOpen(true);
                    }}
                  >
                    Add Data
                  </NavLink>
                  <NavLink
                    to="/admin-activities-view"
                    className={`block pl-20 pr-6 py-2 text-xs hover:text-cyan-300 ${
                      isActivitiesViewRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                    }`}
                    onClick={() => {
                      setOpen(false);
                      setActivitiesOpen(true);
                      setActivitySectionOpen(true);
                    }}
                  >
                    View Data
                  </NavLink>
                </div>

                <button
                  onClick={() => setCoActivitySectionOpen(!coActivitySectionOpen)}
                  className={`flex w-full items-center justify-between pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isCoActivitiesAddRoute || isCoActivitiesViewRoute
                      ? "text-cyan-300 font-semibold"
                      : "text-gray-400"
                  }`}
                >
                  <span>Co-Activities</span>
                  {coActivitySectionOpen ? (
                    <FaChevronUp className="text-xs" />
                  ) : (
                    <FaChevronDown className="text-xs" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    coActivitySectionOpen ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <NavLink
                    to="/admin-coactivities-add"
                    className={`block pl-20 pr-6 py-2 text-xs hover:text-cyan-300 ${
                      isCoActivitiesAddRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                    }`}
                    onClick={() => {
                      setOpen(false);
                      setActivitiesOpen(true);
                      setCoActivitySectionOpen(true);
                    }}
                  >
                    Add Data
                  </NavLink>
                  <NavLink
                    to="/admin-coactivities-view"
                    className={`block pl-20 pr-6 py-2 text-xs hover:text-cyan-300 ${
                      isCoActivitiesViewRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                    }`}
                    onClick={() => {
                      setOpen(false);
                      setActivitiesOpen(true);
                      setCoActivitySectionOpen(true);
                    }}
                  >
                    View Data
                  </NavLink>
                </div>

              </div>
            </div>

            {/* Dropdown for Strengths & Hobby */}
            <div className="flex flex-col">
              <button
                onClick={() => setStrengthsHobbyMenuOpen(!strengthsHobbyMenuOpen)}
                className={`flex items-center justify-between px-6 py-3 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 ${
                  isStrengthsHobbyRoute ? "text-cyan-300" : "text-gray-300"
                }`}
              >
                <span className="flex items-center gap-3">
                  <FaWaveSquare className="text-lg" /> Strengths & Hobby
                </span>
                {strengthsHobbyMenuOpen ? (
                  <FaChevronUp className="text-sm" />
                ) : (
                  <FaChevronDown className="text-sm" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  strengthsHobbyMenuOpen ? "max-h-40" : "max-h-0"
                }`}
              >
                <NavLink
                  to="/admin-strengths-hobby-add"
                  className={`block pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isStrengthsHobbyAddRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setStrengthsHobbyMenuOpen(true);
                  }}
                >
                  Add New
                </NavLink>
                <NavLink
                  to="/admin-strengths-hobby-view"
                  className={`block pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isStrengthsHobbyViewRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setStrengthsHobbyMenuOpen(true);
                  }}
                >
                  View Data
                </NavLink>
              </div>
            </div>

            <div className="px-6 pt-5 pb-2 text-xs uppercase tracking-widest text-cyan-200/60">
              Messages
            </div>

            <NavLink
              to="/admin-messages-contact"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-400/10 border-r-4 border-cyan-400 text-cyan-300"
                    : ""
                }`
              }
              onClick={() => setOpen(false)}
            >
              <FaEnvelope className="text-lg" /> Contact
            </NavLink>

            <NavLink
              to="/admin-messages-feedback"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-400/10 border-r-4 border-cyan-400 text-cyan-300"
                    : ""
                }`
              }
              onClick={() => setOpen(false)}
            >
              <FaStar className="text-lg" /> Feedback
            </NavLink>

            <NavLink
              to="/admin-messages-testimonial"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-400/10 border-r-4 border-cyan-400 text-cyan-300"
                    : ""
                }`
              }
              onClick={() => setOpen(false)}
            >
              <FaUsers className="text-lg" /> Testimonial
            </NavLink>

            <NavLink
              to="/admin-users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-400/10 border-r-4 border-cyan-400 text-cyan-300"
                    : ""
                }`
              }
              onClick={() => setOpen(false)}
            >
              <FaUsers className="text-lg" /> Manage Users
            </NavLink>

            <NavLink
              to="/admin-reports"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-400/10 border-r-4 border-cyan-400 text-cyan-300"
                    : ""
                }`
              }
              onClick={() => setOpen(false)}
            >
              <FaChartPie className="text-lg" /> Reports
            </NavLink>

            <div className="px-6 pt-5 pb-2 text-xs uppercase tracking-widest text-cyan-200/60">
              Settings
            </div>

            {/* Dropdown for Site Settings */}
            <div className="flex flex-col">
              <button
                onClick={() => setSiteOpen(!siteOpen)}
                className={`flex items-center justify-between px-6 py-3 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 ${
                  isSiteRoute ? "text-cyan-300" : "text-gray-300"
                }`}
              >
                <span className="flex items-center gap-3">
                  <FaLayerGroup className="text-lg" /> Site Settings
                </span>
                {siteOpen ? (
                  <FaChevronUp className="text-sm" />
                ) : (
                  <FaChevronDown className="text-sm" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  siteOpen ? "max-h-56" : "max-h-0"
                }`}
              >
                <NavLink
                  to="/admin-favicon"
                  className={`block pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isFaviconRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setSiteOpen(true);
                  }}
                >
                  Favicon
                </NavLink>
                <NavLink
                  to="/admin-seo"
                  className={`block pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isSeoRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setSiteOpen(true);
                  }}
                >
                  SEO
                </NavLink>
                <NavLink
                  to="/admin-section-controls"
                  className={`block pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isSectionRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setSiteOpen(true);
                  }}
                >
                  Section Controls
                </NavLink>
              </div>
            </div>

            <div className="px-6 pt-5 pb-2 text-xs uppercase tracking-widest text-cyan-200/60">
              Account
            </div>

            {/* Dropdown for Account */}
            <div className="flex flex-col">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className={`flex items-center justify-between px-6 py-3 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 ${
                  isAccountRoute ? "text-cyan-300" : "text-gray-300"
                }`}
              >
                <span className="flex items-center gap-3">
                  <FaUserCircle className="text-lg" /> Account
                </span>
                {accountOpen ? (
                  <FaChevronUp className="text-sm" />
                ) : (
                  <FaChevronDown className="text-sm" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  accountOpen ? "max-h-80" : "max-h-0"
                }`}
              >
                <NavLink
                  to="/admin-profile"
                  className={`block pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isProfileRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setAccountOpen(true);
                  }}
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/admin-cover-photo"
                  className={`block pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isCoverRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setAccountOpen(true);
                  }}
                >
                  Cover Photo
                </NavLink>
                <NavLink
                  to="/admin-social-links"
                  className={`block pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isSocialRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setAccountOpen(true);
                  }}
                >
                  Social Links
                </NavLink>
                <NavLink
                  to="/admin-account-security"
                  className={`block pl-14 pr-6 py-2 text-sm hover:text-cyan-300 ${
                    isSecurityRoute ? "text-cyan-300 font-semibold" : "text-gray-400"
                  }`}
                  onClick={() => {
                    setOpen(false);
                    setAccountOpen(true);
                  }}
                >
                  Account Security
                </NavLink>
              </div>
            </div>

            <NavLink
              to="/admin-settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-400/10 border-r-4 border-cyan-400 text-cyan-300"
                    : ""
                }`
              }
              onClick={() => setOpen(false)}
            >
              <FaCogs className="text-lg" /> Settings
            </NavLink>
          </nav>
        </div>

        {/* ===== Logout Button (fixed bottom) ===== */}
        <div className="px-6 py-4 border-t border-cyan-400/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-green-500 text-white font-semibold hover:scale-105 shadow-[0_0_15px_rgba(34,211,238,0.5)] transition duration-300"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
