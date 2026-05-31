// script.js — loader, cursor, nav, scroll reveals, project links
(function () {
  "use strict";

  const hasGsap = typeof window.gsap !== "undefined";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Loader ---------------- */
  function runLoader() {
    const loader = document.getElementById("loader");
    const percent = document.getElementById("loaderPercent");
    const line = document.querySelector(".line");
    if (!loader) return;

    if (reduceMotion || !hasGsap) {
      loader.style.display = "none";
      return;
    }

    let count = 0;
    const tick = setInterval(() => {
      count = Math.min(count + 1, 100);
      if (percent) percent.textContent = count;
      if (line) line.style.width = count + "%";
      if (count >= 100) clearInterval(tick);
    }, 18);

    gsap.to(loader, {
      yPercent: -100,
      duration: 1,
      delay: 2.3,
      ease: "power3.inOut",
      onComplete: () => {
        loader.style.display = "none";
        console.log("HI I AM ALWAYS OPEN TO WORK");
      },
    });
  }

  /* ---------------- Custom cursor ---------------- */
  function customCursor() {
    const ring = document.querySelector(".cursor");
    const dot = document.querySelector(".cursor-dot");
    if (!ring || !dot) return;

    // touch / coarse pointers: hide entirely
    if (window.matchMedia("(pointer: coarse)").matches) {
      ring.style.display = "none";
      dot.style.display = "none";
      document.body.style.cursor = "auto";
      return;
    }

    let mx = window.innerWidth / 2,
      my = window.innerHeight / 2;
    let rx = mx,
      ry = my;

    window.addEventListener("pointermove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    // grow over interactive elements
    const hoverables = document.querySelectorAll(
      "a, button, .tile, .project, .card"
    );
    hoverables.forEach((el) => {
      const isLink = el.matches("a, .project") || el.hasAttribute("data-link");
      el.addEventListener("mouseenter", () => {
        ring.classList.add("is-hover");
        if (isLink) ring.classList.add("is-link");
      });
      el.addEventListener("mouseleave", () => {
        ring.classList.remove("is-hover", "is-link");
      });
    });

    // labelled cursor (e.g. "SCROLL" over the marquee)
    document.querySelectorAll("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        ring.classList.add("is-label");
        ring.textContent = el.getAttribute("data-cursor");
      });
      el.addEventListener("mouseleave", () => {
        ring.classList.remove("is-label");
        ring.textContent = "";
      });
    });

    document.addEventListener("mouseleave", () => (ring.style.opacity = "0"));
    document.addEventListener("mouseenter", () => (ring.style.opacity = "1"));
  }

  /* ---------------- Scroll reveals ---------------- */
  function scrollReveals() {
    const items = document.querySelectorAll(".reveal");
    items.forEach((el) => {
      const d = el.getAttribute("data-delay");
      if (d) el.style.setProperty("--d", d);
    });

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach((el) => io.observe(el));
  }

  /* ---------------- Nav (scroll state + mobile menu) ---------------- */
  function navBehavior() {
    const nav = document.getElementById("topnav");
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");
    if (!nav) return;

    const isMobile = () => window.matchMedia("(max-width: 680px)").matches;
    let lastY = 0;
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY || 0;
        nav.classList.toggle("scrolled", y > 40);
        // auto-hide only on desktop, and never while the menu is open
        if (
          !isMobile() &&
          y > 400 &&
          y > lastY &&
          !nav.classList.contains("open")
        ) {
          nav.classList.add("hidden");
        } else {
          nav.classList.remove("hidden");
        }
        lastY = y;
      },
      { passive: true }
    );

    function closeMenu() {
      nav.classList.remove("open");
      document.body.classList.remove("menu-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }

    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        document.body.classList.toggle("menu-open", open);
        nav.classList.remove("hidden"); // keep bar visible when opening
        toggle.setAttribute("aria-expanded", String(open));
      });
      links.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", closeMenu)
      );
    }
  }

  /* ---------------- Project links ---------------- */
  function projectLinks() {
    document.querySelectorAll(".project[data-link]").forEach((el) => {
      el.addEventListener("click", () => {
        const url = el.getAttribute("data-link");
        if (url) window.open(url, "_blank", "noopener");
      });
    });
  }

  /* ---------------- Magnetic buttons ---------------- */
  function magnetic() {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    document.querySelectorAll(".magnetic").forEach((el) => {
      const strength = 0.35;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ---------------- Idle "scroll" hint ---------------- */
  // Shows a small "SCROLL" tag above the cursor when the mouse stops moving,
  // but only once the visitor has scrolled past the hero (the hero has its
  // own scroll cue). Moving the mouse or scrolling hides it again.
  function scrollHint() {
    const hint = document.getElementById("scrollHint");
    const ring = document.querySelector(".cursor");
    if (!hint) return;

    // touch / coarse pointers have no hover cursor — skip entirely
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const hero = document.getElementById("top");
    const IDLE_MS = 600;
    let timer = null;
    let x = 0,
      y = 0;

    function hide() {
      hint.classList.remove("show");
    }

    function show() {
      // not while hovering an interactive element (cursor is in a special state)
      if (ring && ring.classList.contains("is-hover")) return;
      if (ring && ring.classList.contains("is-label")) return;
      // only past the hero section
      const heroBottom = hero ? hero.offsetHeight * 0.7 : 0;
      if ((window.scrollY || 0) < heroBottom) return;

      hint.style.left = x + "px";
      hint.style.top = y + "px";
      hint.classList.add("show");
    }

    function bump() {
      hide();
      if (timer) clearTimeout(timer);
      timer = setTimeout(show, IDLE_MS);
    }

    window.addEventListener("pointermove", (e) => {
      x = e.clientX;
      y = e.clientY;
      bump();
    });

    // scrolling counts as activity — hide and wait for the mouse to settle
    window.addEventListener("scroll", bump, { passive: true });
  }

  /* ---------------- Year ---------------- */
  function setYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    runLoader();
    customCursor();
    scrollHint();
    scrollReveals();
    navBehavior();
    projectLinks();
    magnetic();
    setYear();
  });
})();
