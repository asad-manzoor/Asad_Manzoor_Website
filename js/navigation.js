// --- Navigation ---
function initNavigation() {
  const links = document.querySelectorAll(".nav-link");
  const nav = document.getElementById("nav");
  
  if (!links.length || !nav) return;

  setActiveNavLink();

  // Add click listeners to all links
  links.forEach(link => {
    link.addEventListener("click", function(e) {
      // Clear all active states
      links.forEach(l => l.classList.remove("active"));
      // Set this link as active
      this.classList.add("active");
      // Close mobile menu
      if(nav) nav.classList.remove("active");
    });
  });

  // For home page sections, update active link based on scroll
  if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
    window.addEventListener('scroll', setActiveNavLink);
  }
}

function setActiveNavLink() {
  const links = document.querySelectorAll(".nav-link");
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Clear all active states first
  links.forEach(l => l.classList.remove("active"));

  if (currentPage === '' || currentPage === 'index.html' || !currentPage) {
    // On home page - check which section is in view
    const sections = [
      { id: 'home', link: 'index.html#home' },
      { id: 'about', link: 'index.html#about' },
      { id: 'speciality', link: 'index.html#speciality' },
      { id: 'testimonials', link: 'index.html#testimonials' },
      { id: 'video-testimonials', link: 'video_testimonials.html' },
      { id: 'workshop', link: 'index.html#workshop' }
    ];

    let activeSection = 'home';
    let closestDistance = Infinity;

    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        const distance = Math.abs(element.getBoundingClientRect().top);
        if (distance < closestDistance) {
          closestDistance = distance;
          activeSection = section.id;
        }
      }
    });

    // Find and activate the corresponding link
    const activeLink = Array.from(links).find(link => {
      const href = link.getAttribute('href');
      if (activeSection === 'video-testimonials') {
        return href.includes('video_testimonials.html');
      } else if (activeSection === 'workshop') {
        return href.includes('index.html#workshop');
      } else {
        return href.includes(`#${activeSection}`);
      }
    });

    if (activeLink) {
      activeLink.classList.add("active");
    }
  } else if (currentPage.includes('portfolio')) {
    // On portfolio page
    const portfolioLink = Array.from(links).find(link => 
      link.getAttribute('href').includes('portfolio_projects.html')
    );
    if (portfolioLink) portfolioLink.classList.add("active");
  } else if (currentPage.includes('video')) {
    // On video testimonials page
    const videoLink = Array.from(links).find(link => 
      link.getAttribute('href').includes('video_testimonials.html')
    );
    if (videoLink) videoLink.classList.add("active");
  }
}

// --- Mobile hamburger toggle ---
function toggleMenu() {
  const nav = document.getElementById("nav");
  if(nav) nav.classList.toggle("active");
}

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigation);
} else {
  initNavigation();
}
