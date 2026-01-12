import React, { useEffect, useState } from "react";
import {
  FaCode,
  FaGlobe,
  FaFacebookF,
  FaInstagram,
  FaSkype,
  FaLinkedinIn,
  FaGithub,
  FaMapMarkerAlt,
  FaUniversity,
  FaBuilding,
} from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

const NeonCard = ({ className = "", children }) => (
  <div
    className={
      "rounded-xl border border-emerald-400/25 bg-white/[0.02] backdrop-blur " +
      "hover:shadow-[0_0_28px_rgba(16,185,129,0.25)] transition-all duration-300 " +
      className
    }
  >
    {children}
  </div>
);

const Chip = ({ children }) => (
  <span className="inline-block text-xs md:text-sm rounded-md px-2.5 py-1 border border-emerald-400/30 bg-emerald-400/10 shadow-[0_0_10px_rgba(16,185,129,0.25)] hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-300 mr-2 mb-2">
    {children}
  </span>
);

const AboutMe = () => {
  const [about, setAbout] = useState(null);
  const [profile, setProfile] = useState(null);
  const [resumeEntries, setResumeEntries] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/about`).then((res) => res.json()),
      fetch(`${API_BASE}/api/profile`).then((res) => res.json()),
      fetch(`${API_BASE}/api/resume`).then((res) => res.json()),
      fetch(`${API_BASE}/api/skills`).then((res) => res.json()),
    ])
      .then(([aboutData, profileData, resumeData, skillsData]) => {
        setAbout(aboutData);
        setProfile(profileData);
        setResumeEntries(Array.isArray(resumeData) ? resumeData : []);
        setSkills(Array.isArray(skillsData) ? skillsData : []);
      })
      .catch(() => { });
  }, []);

  const data = {
    professionalHeading: about?.professionalHeading || "",
    websiteName: about?.websiteName || "",
    subHeading: about?.subHeading || "",
    shortDescription: about?.shortDescription || "",
    longDescription: about?.longDescription || "",
  };

  const staticData = {
    profileName: "Raktim Maity",
    role: "Full Stack Developer",
    tagline: "AI & ML Enthusiast",
    profileImage: "https://picsum.photos/200/200?random=1",
    // education: "Brainware University",
    // location: "Tamluk, West Bengal",
    status: "Available for Work",
    socials: {
      facebook: "#",
      instagram: "#",
      skype: "#",
      linkedin: "#",
      github: "#",
    },
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "Tailwind CSS",
      "React.js",
      "Node.js",
      "MongoDB",
      "Git",
    ],
  };

  const profileData = {
    ...staticData,
    profileName: profile?.name || staticData.profileName,
    role: profile?.job || staticData.role,
    tagline: profile?.professionTitles || staticData.tagline,
    address: profile?.address || staticData.location,
    profileImage: profile?.avatar || staticData.profileImage,
    education: profile?.education || staticData.education,
    location: profile?.address || staticData.location,
    company: profile?.company || "",
    country: profile?.country || "",
    birthday: profile?.birthday || "",
    socials: {
      facebook: profile?.socialFacebook || staticData.socials.facebook,
      instagram: profile?.socialInstagram || staticData.socials.instagram,
      skype: profile?.socialSkype || staticData.socials.skype,
      linkedin: profile?.socialLinkedIn || staticData.socials.linkedin,
      github: profile?.socialGitHub || staticData.socials.github,
    },
  };

  const renderHtml = (value) => ({ __html: value || "" });
  const hasDescription = data.shortDescription || data.longDescription;
  const latestEducation = resumeEntries
    .filter((entry) => entry?.category?.toLowerCase() === "education")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  const skillsList = skills.length ? skills.map((skill) => skill.name).filter(Boolean) : staticData.skills;

  return (
    <main className="min-h-screen bg-[#070b17] text-slate-100 pt-24 pb-16 px-4 md:px-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto mb-12">
          <h1 className="text-center text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            About Me
          </h1>
          <div className="mx-auto mt-3 h-[2px] w-40 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.6)]" />
          <p className="text-center text-slate-400 mt-4 max-w-2xl mx-auto">
            {data.subHeading || data.professionalHeading}
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDEBAR */}
          <section className="space-y-6 lg:col-span-1">
            {/* Profile Card */}
            <NeonCard className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 blur-md opacity-50 animate-pulse" />
                  <img
                    src={profileData.profileImage}
                    alt={profileData.profileName}
                    className="relative h-40 w-40 rounded-full object-cover ring-4 ring-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                  />
                </div>

                <div className="mt-6 text-center">
                  <h4 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    {profileData.profileName}
                  </h4>
                  <p className="text-emerald-300 text-sm mt-2 font-medium">{profileData.role}</p>
                  {/* <p className="text-slate-400 text-xs mt-1">{profileData.tagline}</p> */}
                </div>
              </div>
            </NeonCard>

            {/* Contact Info */}
            <NeonCard className="p-5 space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-emerald-400 mb-4">Contact Info</h3>
              {latestEducation?.organization && (
                <div className="flex items-start gap-3 text-sm">
                  <FaUniversity className="text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-slate-400 text-xs">Education</div>
                    <div className="text-slate-200">{latestEducation.organization}</div>
                  </div>
                </div>
              )}
              {profileData.address && (
                <div className="flex items-start gap-3 text-sm">
                  <FaMapMarkerAlt className="text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-slate-400 text-xs">Address</div>
                    <div className="text-slate-200">{profileData.address}</div>
                  </div>
                </div>
              )}
              {profileData.country && (
                <div className="flex items-start gap-3 text-sm">
                  <FaGlobe className="text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-slate-400 text-xs">Country</div>
                    <div className="text-slate-200">{profileData.country}</div>
                  </div>
                </div>
              )}
              {profileData.company && (
                <div className="flex items-start gap-3 text-sm">
                  <FaBuilding className="text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-slate-400 text-xs">Company</div>
                    <div className="text-slate-200">{profileData.company}</div>
                  </div>
                </div>
              )}
              {profileData.birthday && (
                <div className="flex items-start gap-3 text-sm">
                  <FaUniversity className="text-emerald-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-slate-400 text-xs">Birthday</div>
                    <div className="text-slate-200">{profileData.birthday}</div>
                  </div>
                </div>
              )}
            </NeonCard>

            {/* Website Card */}
            {data.websiteName && (
              <NeonCard className="p-5">
                <h3 className="text-sm uppercase tracking-wider text-emerald-400 mb-3">Portfolio Website</h3>
                <a
                  href={data.websiteName}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition break-all"
                >
                  <FaGlobe className="flex-shrink-0" />
                  <span className="text-sm">{data.websiteName}</span>
                </a>
              </NeonCard>
            )}

            {/* Social Links */}
            <NeonCard className="p-5">
              <h3 className="text-center font-semibold text-sm uppercase tracking-wider text-emerald-400 mb-4">
                Connect With Me
              </h3>
              <div className="flex justify-center gap-3 flex-wrap">
                {[
                  { Icon: FaFacebookF, color: "from-blue-500 to-blue-600", url: profileData.socials.facebook },
                  { Icon: FaInstagram, color: "from-pink-500 to-purple-600", url: profileData.socials.instagram },
                  { Icon: FaSkype, color: "from-cyan-500 to-blue-500", url: profileData.socials.skype },
                  { Icon: FaLinkedinIn, color: "from-blue-600 to-blue-700", url: profileData.socials.linkedin },
                  { Icon: FaGithub, color: "from-gray-700 to-gray-800", url: profileData.socials.github },
                ].map(({ Icon, color, url }, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-3 rounded-full text-white bg-gradient-to-br ${color} shadow-lg hover:shadow-emerald-500/50 hover:scale-110 transition-all duration-300`}
                  >
                    <Icon className="text-lg" />
                  </a>
                ))}
              </div>
            </NeonCard>

            {/* Technical Skills */}
            {/* <NeonCard className="p-5">
              <h3 className="mb-4 text-sm font-semibold text-emerald-400 uppercase tracking-wider">Technical Skills</h3>
              <div className="flex flex-wrap">
                {skillsList.map((skill) => (
                  <Chip key={skill}>{skill}</Chip>
                ))}
              </div>
            </NeonCard> */}
          </section>

          {/* MAIN CONTENT */}
          <section className="lg:col-span-2 space-y-6">
            {/* About Me Description */}
            <NeonCard className="p-6 md:p-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-emerald-400">
                  <FaCode />
                </span>
                <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  About Me
                </span>
              </h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                {data.shortDescription && (
                  <div className="text-base" dangerouslySetInnerHTML={renderHtml(data.shortDescription)} />
                )}
                {data.longDescription && <div dangerouslySetInnerHTML={renderHtml(data.longDescription)} />}
                {!hasDescription && <p className="text-slate-400">No description available.</p>}
              </div>
            </NeonCard>

            {/* Professional Heading */}
            {data.professionalHeading && (
              <NeonCard className="p-6 md:p-8">
                <h3 className="text-xl font-semibold text-emerald-400 mb-3">Professional Summary</h3>
                <p className="text-slate-300 leading-relaxed">{data.professionalHeading}</p>
              </NeonCard>
            )}
            {skillsList && (
              <NeonCard className="p-6 md:p-8">
                <h3 className="text-xl font-semibold text-emerald-400 mb-3">Skills</h3>
                {/* <p className="text-slate-300 leading-relaxed">{skillsList}</p> */}
                <div className="flex flex-wrap">
                  {skillsList.map((skill) => (
                    <Chip key={skill}>{skill}</Chip>
                  ))}
                </div>
              </NeonCard>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default AboutMe;
