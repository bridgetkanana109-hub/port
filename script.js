/* ============================================================
   TechNash — Portfolio Scripts
   ============================================================ */

/* ---------- 1. PROJECT DATA (edit here) ---------- */
const projects = [
  {
    title: "Distributed Task Queue",
    status: "Production",
    description:
      "A horizontally scalable job queue built in Go with Redis-backed persistence. Handles background workloads for internal services with retry semantics and dead-letter handling.",
    tech: ["Go", "Redis", "Docker", "gRPC"],
    link: "#",
  },
  {
    title: "API Gateway",
    status: "Production",
    description:
      "Centralized gateway handling authentication, rate limiting, and request routing for a set of microservices. Reduced client-side integration complexity and improved observability.",
    tech: ["Node.js", "TypeScript", "PostgreSQL", "AWS"],
    link: "#",
  },
  {
    title: "Analytics Pipeline",
    status: "Production",
    description:
      "Event ingestion pipeline that processes application metrics in near real time. Designed for idempotency and safe replays across multiple downstream consumers.",
    tech: ["Python", "Kafka", "PostgreSQL", "Grafana"],
    link: "#",
  },
  {
    title: "Realtime Collaboration Service",
    status: "Internal",
    description:
      "WebSocket-based service enabling concurrent document editing with conflict resolution. Benchmarked for low-latency updates under load.",
    tech: ["Node.js", "WebSocket", "MongoDB", "Redis"],
    link: "#",
  },
  {
    title: "Observability Toolkit",
    status: "Open Source",
    description:
      "Lightweight library for structured logging and trace correlation across services. Adopted across multiple internal teams to standardize instrumentation.",
    tech: ["TypeScript", "OpenTelemetry", "Node.js"],
    link: "#",
  },
  {
    title: "Migration Automation",
    status: "Production",
    description:
      "Tooling that automates database schema migrations with rollback support and pre-flight checks. Integrated into the CI pipeline to reduce deployment risk.",
    tech: ["Go", "PostgreSQL", "CI/CD", "Docker"],
    link: "#",
  },
];

/* ---------- 2. RENDER PROJECTS ---------- */
(function renderProjects() {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (p) => `
      <a class="project-card" href="${p.link}" target="_blank" rel="noopener">
        <div class="project-head">
          <h3>${p.title}</h3>
          <span class="project-status">${p.status}</span>
        </div>
        <p class="project-description">${p.description}</p>
        <div class="project-tech">
          ${p.tech.map((t) => `<span>${t}</span>`).join("")}
        </div>
      </a>
    `
    )
    .join("");
})();

/* ---------- 3. NAVBAR: scroll shadow ---------- */
(function navbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 8) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* ---------- 4. MOBILE NAV TOGGLE ---------- */
(function mobileNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => links.classList.remove("open"));
  });
})();

/* ---------- 5. ACTIVE SECTION HIGHLIGHT ---------- */
(function activeSection() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${id}`
            );
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
})();

/* ---------- 6. FOOTER YEAR ---------- */
(function footerYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
})();

/* ---------- 7. CONTACT FORM → API ---------- */
(function contactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    status.textContent = "Sending...";
    status.className = "form-status loading";
    submitBtn.disabled = true;

    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot: silently succeed for bots
    if (data.website) {
      status.textContent = "Message sent. I will get back to you shortly.";
      status.className = "form-status success";
      form.reset();
      submitBtn.disabled = false;
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to send message");

      status.textContent = "Message sent. I will get back to you shortly.";
      status.className = "form-status success";
      form.reset();
    } catch (err) {
      status.textContent = "Error: " + err.message;
      status.className = "form-status error";
    } finally {
      submitBtn.disabled = false;
    }
  });8
})();
