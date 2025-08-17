import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaSkype,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

const Sidebar = () => {
  const icons = [
    { icon: <FaFacebookF />, link: "#", label: "Facebook" },
    { icon: <FaInstagram />, link: "#", label: "Instagram" },
    { icon: <FaSkype />, link: "#", label: "Skype" },
    { icon: <FaLinkedinIn />, link: "#", label: "LinkedIn" },
    { icon: <FaGithub />, link: "#", label: "GitHub" },
  ];

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
