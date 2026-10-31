// ============================================================
// portfolioData.js — ALL content for the portfolio lives here.
// Components only read from this file.
// ============================================================

export const personalInfo = {
  name: "K Sudarshan Hebbar",
  brandName: "K Sudarshan Hebbar",
  role: "Java Full Stack Developer",
  city: "Udupi, India",
  timezone: "Asia/Kolkata", // IANA timezone used by the live clock in the HUD
  email: "ksudarshanhebbar@gmail.com",
  phone: "+91 7022409099",
  availability: "Open to internships & full-time roles",
};

export const academy = {
  name: "TAP Academy",
  url: "https://thetapacademy.com/",
};

export const socialLinks = {
  github: "https://github.com/KSudarshanH",
  linkedin: "https://www.linkedin.com/in/k-sudarshan-hebbar-30577025b/",
  instagram: "",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export const heroContent = {
  eyebrow: "PORTFOLIO — 2026",
  intro: "I’m a passionate Java Full Stack Developer who loves building scalable web applications and solving real-world problems through technology.",
  statusLines: [
    "Building with Java & React",
    "Exploring Full Stack Development",
    "Turning ideas into reality",
  ],
  ctaPrimary: { label: "View projects", href: "#projects" },
  ctaSecondary: { label: "Get in touch", href: "#contact" },
};

export const aboutContent = {
  label: "01 / About",
  heading: "Turning complex challenges into elegant solutions.",
  paragraph:
    "I specialize in end-to-end web development with a strong focus on Core Java, Spring frameworks, and intuitive frontends. Having built production-grade management and e-commerce platforms during my internships, I thrive on writing clean, maintainable, and high-performance code. I am continuing to expand my technical depth through the placement training program at TAP Academy.",
  stats: [
    { value: 3, suffix: "+", label: "Projects Built" },
    { value: 8, suffix: "+", label: "Technologies Learned" },
    { value: 2, suffix: "", label: "Internships Completed" },
  ],
};

export const skillGroups = [
  {
    title: "Frontend",
    items: ["HTML", "CSS", "React", "JavaScript"],
  },
  {
    title: "Backend",
    items: ["Java", "Spring", "Spring Boot", "JDBC", "JSP", "Servlets", "REST API"],
  },
  {
    title: "Database",
    items: ["MySQL"],
  },
  {
    title: "Core & CS",
    items: ["OOPs", "Collections", "Exception Handling", "Multithreading", "DSA"],
  },
];

export const projects = [
  {
    id: "project-1",
    number: "01",
    title: "Employment Management System",
    description:
      "Engineered a Java-based backend system to manage employee records, payroll processing, and attendance data with optimized SQL queries via JDBC.",
    tags: ["Java", "JDBC", "MySQL"],
    year: "2026",
    liveUrl: "",
    githubUrl: "https://github.com/KSudarshanH/JavaProject",
  },
  {
    id: "project-2",
    number: "02",
    title: "E-Commerce Fashion Store",
    description:
      "Full-stack e-commerce fashion store featuring category browsing, shopping cart, and database-driven CRUD operations for products and orders.",
    tags: ["Java", "JSP", "MySQL"],
    year: "2026",
    liveUrl: "",
    githubUrl: "",
  },
];

export const experience = [
  {
    period: "Jul 2026 — Present",
    role: "Full-stack Web Developer Intern",
    org: "TAP Academy",
    description:
      "Mastered Core Java, Advanced Java, Spring, Hibernate, and MySQL alongside frontend development fundamentals.",
  },
  {
    period: "Jan 2026 — May 2026",
    role: "Software Development Engineer Intern",
    org: "Algo Orbit Innovations Private Limited",
    description:
      "Built a full-stack Restaurant POS system using Next.js and PostgreSQL/Neon, supporting four user roles: Customer, Staff, Admin, and Super Admin.",
  },
];

export const contactContent = {
  label: "04 / Contact",
  heading: "Let's build something.",
  note: "Have a role, a project or a question? Send a message — I reply within a day.",
};

export const footerContent = {
  tagline: "Designed & built by hand.",
};

// EmailJS — values come from .env.local (variables must start with VITE_)
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY",
};

