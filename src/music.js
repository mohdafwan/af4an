// music.js — background music with a fixed toggle control.
// Autoplay is blocked until a user gesture, so playback starts on first
// interaction (if the user hasn't explicitly muted) and the button lets
// them flip it on/off at any time. Preference persists across visits.
(function () {
  "use strict";
  try {
    const audio = document.getElementById("bgMusic");
    const toggle = document.getElementById("musicToggle");
    if (!audio || !toggle) return;

    const label = toggle.querySelector(".music-label");
    const STORAGE_KEY = "afwan:music";
    audio.volume = 0.4;

    // Default to wanting music on, unless the user turned it off before.
    let wantsOn = localStorage.getItem(STORAGE_KEY) !== "off";
    let started = false;

    function paint(on) {
      toggle.classList.toggle("is-playing", on);
      toggle.setAttribute("aria-pressed", String(on));
      if (label) label.textContent = on ? "Sound on" : "Sound off";
    }

    function play() {
      const p = audio.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }

    function setOn(on) {
      wantsOn = on;
      localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
      if (on) play();
      else audio.pause();
      paint(on);
    }

    // Reflect actual element state in the UI.
    audio.addEventListener("play", () => paint(true));
    audio.addEventListener("pause", () => paint(false));

    paint(false);

    // Try to start straight away. Most browsers block autoplay-with-sound
    // until the user has interacted with the page, so this often won't fire
    // on a first visit — the gesture fallback below covers that case.
    if (wantsOn) play();

    // First user gesture unlocks audio — kick playback if it isn't already
    // running (covers the common case where autoplay above was blocked).
    function unlock() {
      if (started) return;
      started = true;
      if (wantsOn && audio.paused) play();
    }
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      started = true;
      setOn(audio.paused);
    });
  } catch (error) {
    /* no-op */
  }
})();
