/* js/navigation.js */

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector("#menu");
  const navLinks = document.querySelector("nav");

  navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      navToggle.classList.toggle("open"); // Toggle open class on the button for icon change (if you have CSS for it)
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menu");
  const nav = document.querySelector("nav"); // If you want to toggle nav too

  menuButton.addEventListener("click", () => {
    menuButton.classList.toggle("active");
    nav?.classList.toggle("open"); // Optional: toggle nav visibility
  });
});




// scripts/navigation.js
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector("#menu");
  const navLinks = document.querySelector(".navigation");

  navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      navToggle.classList.toggle("open");
  });
});
