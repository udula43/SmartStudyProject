// Load page in iframe
function loadPage(page) {
  const frame = document.getElementById('mainContent');
  if (frame) {
    frame.src = page;
  }
}

// Toggle side dropdown menus by clicking arrow only
function toggleSideDropdown(arrowElement) {
  const dropdown = arrowElement.parentElement.nextElementSibling;
  if (!dropdown || !dropdown.classList.contains('side-dropdown')) return;

  const allDropdowns = document.querySelectorAll('.side-dropdown');

  // If this dropdown is already open, close it and return
  if (dropdown.style.display === 'flex' || dropdown.style.display === 'block') {
    dropdown.style.display = 'none';
    return;
  }

  // Close all dropdowns first
  allDropdowns.forEach(d => {
    d.style.display = 'none';
  });

  // Open this dropdown
  dropdown.style.display = 'flex';
  dropdown.style.flexDirection = 'column';
}

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const iframe = document.getElementById('mainContent');

darkModeToggle.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark');
  if (isDark) {
    darkModeToggle.textContent = '☀️';
    localStorage.setItem('darkMode', 'enabled');
  } else {
    darkModeToggle.textContent = '🌙';
    localStorage.setItem('darkMode', 'disabled');
  }

  updateLogo(body.classList.contains('dark'));


  // Send message to iframe to sync dark mode
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({ darkMode: isDark }, '*');
  }
});

function updateLogo(darkModeEnabled) {
  const logo = document.getElementById('logoImg');
  if (!logo) return;
  logo.src = darkModeEnabled ? 'pics/logo3.png' : 'pics/logo1.png';
}


// Initialize dark mode on page load based on localStorage
document.addEventListener('DOMContentLoaded', () => {
  const isDark = localStorage.getItem('darkMode') === 'enabled';
  if (isDark) {
    body.classList.add('dark');
    darkModeToggle.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    darkModeToggle.textContent = '🌙';
  }

  updateLogo(localStorage.getItem('darkMode') === 'enabled');


  // Send initial dark mode state to iframe
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({ darkMode: isDark }, '*');
  }
});

// Mobile sidebar toggle
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  sidebar.classList.toggle('open');
});

// Helper: check if click target is inside any sidebar dropdown or arrow
function isClickInsideSidebarDropdownOrArrow(target) {
  const dropdowns = document.querySelectorAll('.side-dropdown');
  for (const dd of dropdowns) {
    if (dd.contains(target)) return true;
  }
  const arrows = document.querySelectorAll('.arrow');
  for (const arrow of arrows) {
    if (arrow === target || arrow.contains(target)) return true;
  }
  return false;
}

// Dropdown language menu toggle
const langBtn = document.getElementById('langBtn');
const langDropdown = document.getElementById('langDropdown');

langBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = langDropdown.classList.contains('open');

  // Close all side-dropdowns if language dropdown opens
  closeAllSideDropdowns();

  if (isOpen) {
    langDropdown.classList.remove('open');
  } else {
    langDropdown.classList.add('open');
  }
});

// Global click handler to close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  // Close language dropdown if click outside it
  if (langDropdown.classList.contains('open') && !langDropdown.contains(e.target)) {
    langDropdown.classList.remove('open');
  }

  // Close sidebar dropdowns if click outside any dropdown or arrow inside sidebar
  if (!isClickInsideSidebarDropdownOrArrow(e.target)) {
    closeAllSideDropdowns();
  }

  // On mobile: close sidebar if open and clicked outside sidebar or menu toggle
  if (window.innerWidth <= 768 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== menuToggle) {
    sidebar.classList.remove('open');
  }
});

// Function to close all sidebar dropdowns
function closeAllSideDropdowns() {
  const allDropdowns = document.querySelectorAll('.side-dropdown');
  allDropdowns.forEach(d => {
    d.style.display = 'none';
  });
}

// Listen for messages from iframe clicks to close dropdowns
window.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'iframeClick') {
    closeAllSideDropdowns();
    if (langDropdown.classList.contains('open')) {
      langDropdown.classList.remove('open');
    }
  }
});



