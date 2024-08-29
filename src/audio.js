#!/src/audio.js {AUDIO}
try {
  const audio = new Audio("../public/button2.mp3");
  const tile = document.querySelectorAll(".tile");
  const makeSound = document.querySelectorAll(".sound");
  tile.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      audio.currentTime = -0.2;
      audio.play();
    });
    element.addEventListener("mouseleave", () => {
      audio.currentTime = -0.2;
      audio.pause();
    });
  });
  // Ancher tag

  makeSound.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      audio.currentTime = -0.2;
      audio.play();
    });
    element.addEventListener("mouseleave", () => {
      audio.currentTime = -0.2;
      audio.pause();
    });
  });
} catch (error) {
  console.error("");
}
