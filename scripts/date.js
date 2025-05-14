/* js/date.js */


// Dynamically populate the footer year
const yearElement = document.getElementById("current-year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}
  // Dynamically update the last modified date
  const modifiedElement = document.getElementById("last-modified");
  if (modifiedElement) {
      modifiedElement.textContent = "Last Modified: " + document.lastModified;
}
  
