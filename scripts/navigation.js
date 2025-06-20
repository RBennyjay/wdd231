document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menu');
    const nav = document.getElementById('nav');
    const body = document.body;
  
    if (menuButton && nav) {
      menuButton.addEventListener('click', () => {
        nav.classList.toggle('open');
        menuButton.classList.toggle('active'); // Changed from 'open' to 'active'
        body.classList.toggle('no-scroll');
      });
  
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          if (nav.classList.contains('open')) {
            nav.classList.remove('open');
            menuButton.classList.remove('active'); // Also updated here
            body.classList.remove('no-scroll');
          }
        });
      });
    }
  });
  