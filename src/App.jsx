import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import About from "./components/About";
import Skills from "./components/Skills";
import Resume from "./components/Resume";
import Projects from "./components/Projects";
import CoActivities from "./components/CoActivities";
import LanguageSection from "./components/LanguageSection";
import StrengthsInterests from "./components/StrengthsInterests";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import { Toaster } from "sonner";
import Footer from "./components/Footer";
import AboutMe from "./pages/AboutMe";
import ProjectsPage from "./pages/ProjectsPage";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";
import SideTabLink from "./components/SideTabLink";
import Review from "./pages/Review";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import { AnimatePresence } from "framer-motion";
import { getAdminExpiry, logoutAdmin, getAdminToken } from "./utils/auth";
import AdminProfile from "./pages/AdminProfile";
import AdminCoverPhoto from "./pages/AdminCoverPhoto";
import AdminSocialLinks from "./pages/AdminSocialLinks";
import AdminAccountSecurity from "./pages/AdminAccountSecurity";
import AdminFavicon from "./pages/AdminFavicon";
import AdminSeo from "./pages/AdminSeo";
import AdminSectionControls from "./pages/AdminSectionControls";
import AdminAboutSection from "./pages/AdminAboutSection";
import AdminSkills from "./pages/AdminSkills";
import AdminLanguage from "./pages/AdminLanguage";
import AdminCvResume from "./pages/AdminCvResume";
import AdminResumeAdd from "./pages/AdminResumeAdd";
import AdminResumeView from "./pages/AdminResumeView";
import AdminPortfolioAdd from "./pages/AdminPortfolioAdd";
import AdminPortfolioView from "./pages/AdminPortfolioView";
import AdminActivitiesAdd from "./pages/AdminActivitiesAdd";
import AdminActivitiesView from "./pages/AdminActivitiesView";
import AdminCoActivitiesAdd from "./pages/AdminCoActivitiesAdd";
import AdminCoActivitiesView from "./pages/AdminCoActivitiesView";
import AdminStrengthsHobbyAdd from "./pages/AdminStrengthsHobbyAdd";
import AdminStrengthsHobbyView from "./pages/AdminStrengthsHobbyView";
import AdminMessagesContact from "./pages/AdminMessagesContact";
import AdminMessagesFeedback from "./pages/AdminMessagesFeedback";
import AdminMessagesTestimonial from "./pages/AdminMessagesTestimonial";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

/* Optional Example Page */
const Blog = () => (
  <div className="text-white pt-24 px-6 max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">
      Blog Page
    </h1>
    <p className="mt-4 text-gray-200">
      This is a new route. You navigated here without a refresh ✨
    </p>
  </div>
);

/* --- Protected Route Wrapper --- */
const ProtectedRoute = ({ children }) => {
  const token = getAdminToken();
  const expiry = getAdminExpiry();
  const isValid = token && expiry && Date.now() < expiry;

  if (!isValid) {
    logoutAdmin(); // cleans up old token
    return <Navigate to="/boss-login" replace />;
  }
  return children;
};

function AppLayout() {
  const location = useLocation();

  // Determine if the page is admin-related
  const isAdminPage = location.pathname.startsWith("/admin") || location.pathname === "/boss-login";
  const isHomePage = location.pathname === "/";
  const isProjectsPage = location.pathname === "/my-projects";

  useEffect(() => {
    if (!isHomePage) return;
    fetch(`${API_BASE}/api/visitor`, { method: "POST" }).catch(() => {});
  }, [isHomePage]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_BASE}/api/visitor`, { method: "POST" }).catch(() => {});
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ScrollToTop />
      <div className="App bg-[#0f172a] min-h-screen relative overflow-hidden">
        <Toaster theme="dark" richColors position="top-right" />

        {/* Background video (only show for public site) */}
        {!isAdminPage && (
          <>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-0"
            >
              <source src="/particles-bg.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/50 z-0" />
          </>
        )}

        {/* Navbar + Sidebar hidden for admin pages */}
        {!isAdminPage && <Navbar />}
        {!isAdminPage && <Sidebar />}

        <main
          className={`relative z-10 ${
            isAdminPage || isProjectsPage
              ? "max-w-full p-0"
              : "max-w-7xl mx-auto px-1 md:px-8 lg:px-12"
          }`}
        >
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <Stats />
                  <About />
                  <Skills />
                  <Resume />
                  <Projects />
                  <CoActivities />
                  <LanguageSection />
                  <StrengthsInterests />
                  <Testimonials />
                  <Contact />
                </>
              }
            />
            <Route path="/about-me" element={<AboutMe />} />
            <Route path="/my-resume" element={<Resume />} />
            <Route path="/contact-me" element={<Contact />} />
            <Route path="/review" element={<Review />} />
            <Route path="/my-projects" element={<ProjectsPage />} />

            {/* Admin routes */}
            <Route path="/boss-login" element={<AdminLogin />} />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-profile"
              element={
                <ProtectedRoute>
                  <AdminProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-cover-photo"
              element={
                <ProtectedRoute>
                  <AdminCoverPhoto />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-social-links"
              element={
                <ProtectedRoute>
                  <AdminSocialLinks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-account-security"
              element={
                <ProtectedRoute>
                  <AdminAccountSecurity />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-favicon"
              element={
                <ProtectedRoute>
                  <AdminFavicon />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-seo"
              element={
                <ProtectedRoute>
                  <AdminSeo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-section-controls"
              element={
                <ProtectedRoute>
                  <AdminSectionControls />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-about-section"
              element={
                <ProtectedRoute>
                  <AdminAboutSection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-about-skills"
              element={
                <ProtectedRoute>
                  <AdminSkills />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-about-language"
              element={
                <ProtectedRoute>
                  <AdminLanguage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-about-resume"
              element={
                <ProtectedRoute>
                  <AdminCvResume />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-resume-add"
              element={
                <ProtectedRoute>
                  <AdminResumeAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-resume-view"
              element={
                <ProtectedRoute>
                  <AdminResumeView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-portfolio-add"
              element={
                <ProtectedRoute>
                  <AdminPortfolioAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-portfolio-view"
              element={
                <ProtectedRoute>
                  <AdminPortfolioView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-activities-add"
              element={
                <ProtectedRoute>
                  <AdminActivitiesAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-activities-view"
              element={
                <ProtectedRoute>
                  <AdminActivitiesView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-coactivities-add"
              element={
                <ProtectedRoute>
                  <AdminCoActivitiesAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-coactivities-view"
              element={
                <ProtectedRoute>
                  <AdminCoActivitiesView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-strengths-hobby-add"
              element={
                <ProtectedRoute>
                  <AdminStrengthsHobbyAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-strengths-hobby-view"
              element={
                <ProtectedRoute>
                  <AdminStrengthsHobbyView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-messages-contact"
              element={
                <ProtectedRoute>
                  <AdminMessagesContact />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-messages-feedback"
              element={
                <ProtectedRoute>
                  <AdminMessagesFeedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-messages-testimonial"
              element={
                <ProtectedRoute>
                  <AdminMessagesTestimonial />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer and floating UI also hidden for admin */}
        {!isAdminPage && (
          <>
            <SideTabLink />
            <BackToTop />
            <Footer />
          </>
        )}
      </div>
    </>
  );
}


function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
