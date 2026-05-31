// audio.js — subtle hover click on interactive elements
(function () {
  "use strict";
  try {
    // path is relative to index.html (site root)
    const src = "./public/button2.mp3";
    const makeSound = document.querySelectorAll(".sound, .tile");
    let unlocked = false;

    // browsers block audio until first user gesture
    window.addEventListener(
      "pointerdown",
      () => {
        unlocked = true;
      },
      { once: true }
    );

    makeSound.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        if (!unlocked) return;
        const audio = new Audio(src);
        audio.volume = 0.35;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      });
    });
  } catch (error) {
    /* no-op */
  }
})();
