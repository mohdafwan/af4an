#!/src/script.js {GSAP, TIMER AND MORE}
function gsapAnimation() {
  var timeline = gsap.timeline();
  timeline
    .from(".screenLoader", {
      duration: 1,
      delay: 0,
      onStart: countDown,
      onComplete: () => {
        console.log("HI I AM ALWAYS OPEN TO WORK");
      },
    })
    .to(".line", {
      delay: 1.3,
      opacity: 0,
    })
    .to(".location", {
      opacity: 0,
    })
    .to(".screenLoader", {
      ease: "power2.out",
      duration: 1,
      y: "-100%",
    })
    .from(".main", {
      // //   scale: 0,
      //   delay: 0.2,
      //   duration: 1,
      //   opacity: 0,
    });
}

function openMiniContainer() {
  var timeline = gsap.timeline();
  const whatBtn = document.querySelector("#whatBtn");
  const resumeBtn = document.querySelector("#resumeBtn");
  const whatContainerBox = document.querySelector(".whatContainerBox");
  const closeBtn = document.querySelector(".pageOnRightBtn");
  whatBtn.addEventListener("click", () => {
    var timeline = gsap.timeline();
    timeline.to(whatContainerBox, {
      height: "79vh",
      display: "flex",
      opacity: 1,
      ease: "power2.out",
    });
  });
  closeBtn.addEventListener("click", () => {
    var timeline = gsap.timeline();
    timeline.to(whatContainerBox, {
      height: "0vh",
      display: "none",
      opacity: 0,
      ease: "power2.out",
    });
  });
}

function normalAnimaion() {
  gsap.from("#bulp", {
    autoAlpha: 0.4,
    repeat: -1,
  });
}
function countDown() {
  let count = 1;
  let incrementContainer = document.querySelector(".line");
  setInterval(() => {
    if (count <= 100) {
      count++;
      incrementContainer.style.width = `${count}%`;
    }
  }, 21);
}

function customCursor() {
  const cursor = document.querySelector(".cursor");
  document.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
      x: e.clientX - cursor.offsetWidth / 2,
      y: e.clientY - cursor.offsetHeight / 2,
      ease: "power2.out",
      duration: 0.3,
    });

    gsap.to(cursor, {
      opacity: 1,
      duration: 0.3,
    });
  });
  document.addEventListener("mouseleave", () => {
    gsap.to(cursor, {
      opacity: 0,
      duration: 0.3,
    });
  });
  document.addEventListener("mouseenter", () => {
    gsap.to(cursor, {
      opacity: 1,
      duration: 0.3,
    });
  });
}

function openLink() {
  const openLine = document.querySelector(".openLine");
  const cursor = document.querySelector(".cursor");

  openLine.addEventListener("click", () => {
    window.open("https://apps.apple.com/kw/developer/fahad-al-saleh/id1718536234", "_blank");
  });

  openLine.addEventListener("mouseenter", () => {
    cursor.innerHTML = "↗";
    cursor.style.fontSize = "1px";
    cursor.style.color = "red";
    gsap.to(cursor, {
      scale: 2,
      backgroundColor: "white",
      duration: 0.3,
    });
  });

  openLine.addEventListener("mouseleave", () => {
    cursor.innerHTML = "";
    gsap.to(cursor, {
      scale: 1,
      duration: 0.3,
    });
  });
}
// calling the function
gsapAnimation();
normalAnimaion();
openMiniContainer();
customCursor();
openLink(); 
