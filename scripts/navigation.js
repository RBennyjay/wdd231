
// scripts/navigation.js

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menu");
  const nav = document.querySelector("nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      menuButton.classList.toggle("open");
      nav.classList.toggle("open");
    });
  }
});
