document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("membershipForm");
    const formMessage = document.getElementById("formMessage");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      formMessage.textContent = ""; // Clear previous messages
  
      if (!form.checkValidity()) {
        formMessage.textContent = "Please fill in all required fields correctly.";
        formMessage.style.color = "red";
        form.reportValidity();
        return;
      }
  
      // Additional custom validation for phone pattern
      const phone = form.phone.value.trim();
      const phonePattern = /^\d{10,15}$/;
      if (!phonePattern.test(phone)) {
        formMessage.textContent = "Please enter a valid phone number (10 to 15 digits).";
        formMessage.style.color = "red";
        form.phone.focus();
        return;
      }
  
      // If valid, simulate form submission success
      formMessage.textContent = "Thank you for your application! We will contact you soon.";
      formMessage.style.color = "green";
      form.reset();
    });
  });
  