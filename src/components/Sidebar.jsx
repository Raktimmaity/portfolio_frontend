import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaSkype,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

const Sidebar = () => {
  const [profileSocials, setProfileSocials] = useState({});

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

  const icons = [
    { icon: <FaFacebookF />, link: profileSocials.socialFacebook, label: "Facebook" },
    { icon: <FaInstagram />, link: profileSocials.socialInstagram, label: "Instagram" },
    { icon: <FaSkype />, link: profileSocials.socialSkype, label: "Skype" },
    { icon: <FaLinkedinIn />, link: profileSocials.socialLinkedIn, label: "LinkedIn" },
    { icon: <FaGithub />, link: profileSocials.socialGitHub, label: "GitHub" },
  ].filter((item) => item.link && item.link.trim().length > 0);

  return (
    <div className="fixed top-1/2 -translate-y-1/2 left-4 z-40 hidden md:flex flex-col gap-5 items-center">
      <span className="text-xs text-gray-300 tracking-widest rotate-180 [writing-mode:vertical-lr] mb-3">
        SOCIAL LINKS
      </span>
      {icons.map((item, index) => (
        <a
          key={index}
          href={item.link}
          title={item.label}
          className="p-3 rounded-lg text-white bg-gradient-to-br from-cyan-500 to-green-500 shadow-lg hover:shadow-green-500/40 transition transform hover:scale-110 hover:rotate-3"
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
};

export default Sidebar;
