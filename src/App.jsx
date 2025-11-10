import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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

// Example new page
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

function AppLayout() {
  const location = useLocation();

  // hide sidebar on these routes
  const hideSidebar = ["/boss-login", "/admin-dashboard"].includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <div className="App bg-[#0f172a] min-h-screen relative overflow-hidden">
        <Toaster theme="dark" richColors position="top-right" />

        {/* Background video */}
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="/particles-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50 z-0" />

        <Navbar />
        {!hideSidebar && <Sidebar />}

        <main className="relative z-10 max-w-7xl mx-auto px-1 md:px-8 lg:px-12">
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
            <Route path="/boss-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/my-projects" element={<ProjectsPage />} />
          </Routes>
        </main>

        <SideTabLink />
        <BackToTop />
        <Footer />
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
