const audio = new Audio("../public/button.mp3");
const tile = document.querySelectorAll(".tile");
tile.forEach((element) => {
  element.addEventListener("mouseenter", () => {
    audio.currentTime = 0;
    audio.play();
  });
  console.log(element);
});
