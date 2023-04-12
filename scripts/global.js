const navbar = document.querySelector("nav");
const submenu = document.querySelector(".submenu");
const sticky = navbar.offsetTop;
const scrollToTop = document.getElementById("scrollToTop");

window.onscroll = function scrollFunction() {
  if (window.pageYOffset >= 250) {
    scrollToTop.classList.add("scrollButtonActive");
  } else {
    scrollToTop.classList.remove("scrollButtonActive");
  }

  if (window.pageYOffset >= 30) {
    navbar.style.top = "0px";
    navbar.style.boxShadow = "0px 3px 5px rgba(0,0,0,0.1)";
  } else {
    navbar.style.boxShadow = "none";
  }
};

scrollToTop.addEventListener("click", () => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

let questionMark = document.getElementById("questionMark");
let modal = document.querySelector(".modal");
if (questionMark) {
  questionMark.addEventListener("click", () => {
    modal.classList.add("modalActive");
  });
}
const modalGotIt = document.getElementById("modalGotIt");
if (modalGotIt) {
  modalGotIt.addEventListener("click", () => {
    modal.classList.remove("modalActive");
  });
}

document.body.addEventListener("keydown", (e) => {
  if (e.code === "Escape") {
    modal.classList.remove("modalActive");
  }
});
