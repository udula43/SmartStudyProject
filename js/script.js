// Load page inside iframe
function loadPage(page) {
  const frame = document.getElementById('mainContent');
  if (frame) frame.src = page;
}

// Toggle dropdown under sidebar items
function toggleSideDropdown(arrowElement) {
  const dropdown = arrowElement.parentElement.nextElementSibling;
  if (!dropdown || !dropdown.classList.contains('side-dropdown')) return;

  const allDropdowns = document.querySelectorAll('.side-dropdown');

  if (dropdown.style.display === 'flex' || dropdown.style.display === 'block') {
    dropdown.style.display = 'none';
    return;
  }

  allDropdowns.forEach(d => d.style.display = 'none');

  dropdown.style.display = 'flex';
  dropdown.style.flexDirection = 'column';
}

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const iframe = document.getElementById('mainContent');

function updateLogo(dark) {
  const logo = document.getElementById('logoImg');
  if (logo) logo.src = dark ? 'pics/logo3.png' : 'pics/logo1.png';
}

function syncDarkModeToIframe(isDark) {
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({ darkMode: isDark }, '*');
  }
}

function applyStoredDarkMode() {
  const isDark = localStorage.getItem('darkMode') === 'enabled';
  body.classList.toggle('dark', isDark);
  darkModeToggle.textContent = isDark ? '☀️' : '🌙';
  updateLogo(isDark);
  syncDarkModeToIframe(isDark);
}

darkModeToggle.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark');
  darkModeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
  updateLogo(isDark);
  syncDarkModeToIframe(isDark);
});

// Mobile Sidebar Toggle
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', e => {
  e.stopPropagation();
  sidebar.classList.toggle('open');
});

// Close sidebar on mobile click outside
function closeSidebarOnMobileClick(target) {
  if (window.innerWidth <= 768 && sidebar.classList.contains('open') &&
      !sidebar.contains(target) && target !== menuToggle) {
    sidebar.classList.remove('open');
  }
}

document.addEventListener('click', e => {
  if (!isClickInsideDropdownOrArrow(e.target)) closeAllSideDropdowns();
  closeSidebarOnMobileClick(e.target);
});

// Sidebar dropdown detection
function isClickInsideDropdownOrArrow(target) {
  return [...document.querySelectorAll('.side-dropdown, .arrow')].some(el => el.contains(target) || el === target);
}

// Close all dropdowns
function closeAllSideDropdowns() {
  document.querySelectorAll('.side-dropdown').forEach(d => d.style.display = 'none');
}

// Close sidebar when header clicked (mobile)
const header = document.querySelector('header');
if (header) {
  header.addEventListener('click', e => {
    closeSidebarOnMobileClick(e.target);
  });
}

// Notify parent when iframe page is clicked
document.addEventListener('click', () => {
  parent.postMessage({ action: 'iframeClick' }, '*');
});

// Listen for iframe click messages
window.addEventListener('message', event => {
  if (event.data && event.data.action === 'iframeClick') {
    closeAllSideDropdowns();
    closeSidebarOnMobileClick(document.body);
  }
});

// Init dark mode on load
document.addEventListener('DOMContentLoaded', applyStoredDarkMode);
