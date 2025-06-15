//
const hamButton = document.querySelector('#menu');
const navigation = document.querySelector('.navigation');

hamButton.addEventListener('click', () => {
  navigation.classList.toggle('open');
  hamButton.classList.toggle('open');
});

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  const lastModEl = document.getElementById("lastModified");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (lastModEl) {
    lastModEl.textContent = document.lastModified;
  }
});
