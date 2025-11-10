export const projectsData = {
  summary: {
    total: 42, // shows "42+"
    heroTitle: "Welcome to My Projects",
    heroSub:
      "Explore my latest projects and innovations. Each project reflects my dedication to learning and building amazing things.",
  },

  // Central colors for skills (used in cards + modal)
  skillColors: {
    "HTML": "bg-orange-500/20 text-orange-200 border-orange-400/40",
    "CSS": "bg-blue-600/20 text-blue-200 border-blue-400/40",
    "JavaScript": "bg-yellow-500/20 text-yellow-200 border-yellow-400/40",
    "Tailwind CSS": "bg-cyan-500/20 text-cyan-200 border-cyan-400/40",
    "Bootstrap": "bg-purple-600/20 text-purple-200 border-purple-400/40",
    "React JS": "bg-sky-500/20 text-sky-200 border-sky-400/40",
    "MySQL": "bg-emerald-600/20 text-emerald-200 border-emerald-400/40",
    "PHP": "bg-indigo-600/20 text-indigo-200 border-indigo-400/40",
    "Node.js": "bg-lime-600/20 text-lime-200 border-lime-400/40",
    "Express": "bg-stone-500/20 text-stone-200 border-stone-400/40",
    "Redux": "bg-fuchsia-600/20 text-fuchsia-200 border-fuchsia-400/40",
    "Framer Motion": "bg-rose-600/20 text-rose-200 border-rose-400/40",
  },

  // Optional: base skills list (used to render filter list)
  skills: [
    "All",
    "HTML",
    "CSS",
    "JavaScript",
    "Tailwind CSS",
    "Bootstrap",
    "React JS",
    "MySQL",
    "PHP",
    "Node.js",
    "Express",
    "Redux",
    "Framer Motion",
  ],

  items: [
    {
      id: "vibe-vine",
      title: "Vibe & Vine Bar and Restaurant",
      image: "https://picsum.photos/560/320?random=31",
      type: "minor",
      hosted: { live: true, url: "https://example.com/vibe-vine" },
      github: "https://github.com/you/vibe-vine",
      uploadedOn: "Apr 26, 2025",
      tech: ["Tailwind CSS", "React JS", "Framer Motion"],
      isPaid: false, // FREE
      description: `“Vibe and Vine” is a modern, elegant bar & restaurant website combining stylish design with seamless functionality.
Built with React for component-driven UI, and Tailwind for fast, consistent styling. “Vibe and Vine” is a modern, elegant bar & restaurant website combining stylish design with seamless functionality.
Built with React for component-driven UI, and Tailwind for fast, consistent styling.`,
    },
    {
      id: "real-estate",
      title: "Real Estate Business Website",
      image: "https://picsum.photos/560/320?random=32",
      type: "major",
      hosted: { live: false, url: null },
      github: "https://github.com/you/real-estate",
      uploadedOn: "Feb 22, 2025",
      tech: ["HTML", "CSS", "JavaScript", "Bootstrap", "MySQL", "PHP"],
      isPaid: true, // PAID
      description: `A clean and responsive real-estate site with listings, filters, and CTAs.
Server-side features use PHP + MySQL; UI is built with Bootstrap utilities.`,
    },

    /* ---- More sample items with paid/free and varied skills ---- */
    {
      id: "task-tracker",
      title: "Task Tracker SPA",
      image: "https://picsum.photos/560/320?random=33",
      type: "minor",
      hosted: { live: true, url: "https://example.com/task-tracker" },
      github: "https://github.com/you/task-tracker",
      uploadedOn: "Mar 10, 2025",
      tech: ["React JS", "Tailwind CSS", "Redux"],
      isPaid: false,
      description: "A lightweight task manager with drag-and-drop, offline caching, and fast filters.",
    },
    {
      id: "ecommerce-ui",
      title: "E-commerce UI Kit",
      image: "https://picsum.photos/560/320?random=34",
      type: "minor",
      hosted: { live: true, url: "https://example.com/ecommerce-ui" },
      github: "https://github.com/you/ecommerce-ui",
      uploadedOn: "Jan 18, 2025",
      tech: ["HTML", "CSS", "JavaScript"],
      isPaid: true,
      description: "A mobile-first set of storefront components with carts, modals and product grids.",
    },
    {
      id: "portfolio-react",
      title: "Personal Portfolio (React)",
      image: "https://picsum.photos/560/320?random=35",
      type: "minor",
      hosted: { live: true, url: "https://example.com/portfolio-react" },
      github: "https://github.com/you/portfolio-react",
      uploadedOn: "Dec 02, 2024",
      tech: ["React JS", "Tailwind CSS", "Framer Motion"],
      isPaid: false,
      description: "Animated portfolio with theme switcher, scroll reveals, and project filtering.",
    },
    {
      id: "api-dashboard",
      title: "API Analytics Dashboard",
      image: "https://picsum.photos/560/320?random=36",
      type: "major",
      hosted: { live: false, url: null },
      github: "https://github.com/you/api-dashboard",
      uploadedOn: "Nov 12, 2024",
      tech: ["React JS", "Node.js", "Express", "MySQL"],
      isPaid: true,
      description: "Server-rendered metrics with role-based access and chart widgets.",
    },
    {
      id: "blog-php",
      title: "Blog Engine (PHP + MySQL)",
      image: "https://picsum.photos/560/320?random=37",
      type: "minor",
      hosted: { live: true, url: "https://example.com/blog-php" },
      github: "https://github.com/you/blog-php",
      uploadedOn: "Oct 05, 2024",
      tech: ["PHP", "MySQL", "Bootstrap"],
      isPaid: false,
      description: "CRUD blog with categories, search, and simple admin dashboard.",
    },
  ],
};
