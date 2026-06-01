// smooth-scroll.js — Lenis-powered smooth scrolling.
// Lenis scrolls the real window, so existing scroll listeners (nav state,
// three-bg parallax, scroll hint) keep working unchanged.
(function () {
  "use strict";
  try {
    if (typeof Lenis === "undefined") return;
    // Honour reduced-motion: fall back to native scrolling.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Route in-page anchor links (#about, #work, #top, …) through Lenis.
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0 });
      });
    });
  } catch (error) {
    /* no-op */
  }
})();
