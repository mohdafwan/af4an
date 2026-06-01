// hero-langs.js — cycles the hero title ("Software Developer") through
// languages from around the world, fading between each. The second line
// keeps its gradient (.hero-grad) the whole time.
(function () {
  "use strict";
  try {
    const title = document.querySelector(".hero-title");
    if (!title) return;

    const top = title.querySelector("span:not(.hero-grad)");
    const bottom = title.querySelector(".hero-grad");
    if (!top || !bottom) return;

    // [line 1, line 2] — "Software Developer" the world over
    const langs = [
      ["SOFTWARE", "DEVELOPER"],        // English
      ["DESARROLLADOR", "DE SOFTWARE"], // Spanish
      ["DÉVELOPPEUR", "LOGICIEL"],      // French
      ["SOFTWARE", "ENTWICKLER"],       // German
      ["सॉफ़्टवेयर", "डेवलपर"],            // Hindi
      ["SVILUPPATORE", "SOFTWARE"],     // Italian
      ["DESENVOLVEDOR", "DE SOFTWARE"], // Portuguese
      ["ソフトウェア", "開発者"],           // Japanese
      ["소프트웨어", "개발자"],             // Korean
      ["软件", "开发者"],                  // Chinese
      ["РАЗРАБОТЧИК", "ПО"],            // Russian
      ["مطوّر", "برمجيات"],               // Arabic
      ["YAZILIM", "GELİŞTİRİCİ"],        // Turkish
      ["SOFTWARE", "ONTWIKKELAAR"],     // Dutch
    ];

    // Keep the title static for visitors who prefer reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // On native / mobile screens (small or touch), don't rotate — just show
    // "SOFTWARE DEVELOPER".
    if (
      window.matchMedia("(max-width: 768px)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const FADE_MS = 450;
    const HOLD_MS = 2600;
    let i = 0;

    function fade(out) {
      [top, bottom].forEach((el) => {
        el.style.opacity = out ? "0" : "1";
        el.style.transform = out ? "translateY(14px)" : "translateY(0)";
      });
    }

    function cycle() {
      fade(true);
      setTimeout(() => {
        i = (i + 1) % langs.length;
        top.textContent = langs[i][0];
        bottom.textContent = langs[i][1];
        fade(false);
      }, FADE_MS);
    }

    // Wait for the loader + initial reveal to settle, then start rotating.
    setTimeout(() => {
      [top, bottom].forEach((el) => {
        el.style.transition =
          "opacity " + FADE_MS + "ms var(--ease), transform " + FADE_MS + "ms var(--ease)";
      });
      setInterval(cycle, HOLD_MS);
    }, 3600);
  } catch (error) {
    /* no-op */
  }
})();
