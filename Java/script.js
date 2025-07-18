// iframe
function loadPage(page) {
  const frame = document.getElementById('mainContent');
  if (frame) {
    frame.src = page;
  }
}

// arrow
function toggleSideDropdown(arrowElement) {
  const dropdown = arrowElement.parentElement.nextElementSibling;
  if (!dropdown || !dropdown.classList.contains('side-dropdown')) return;

  const allDropdowns = document.querySelectorAll('.side-dropdown');

  
  if (dropdown.style.display === 'flex' || dropdown.style.display === 'block') {
    dropdown.style.display = 'none';
    return;
  }

  
  allDropdowns.forEach(d => {
    d.style.display = 'none';
  });

  
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


  // iframe dark mode
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({ darkMode: isDark }, '*');
  }
});

function updateLogo(darkModeEnabled) {
  const logo = document.getElementById('logoImg');
  if (!logo) return;
  logo.src = darkModeEnabled ? 'pics/logo3.png' : 'pics/logo1.png';
}



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


  
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({ darkMode: isDark }, '*');
  }
});


// Mobile sidebar 
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  sidebar.classList.toggle('open');
});


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


document.addEventListener('click', (e) => {

  // Close sidebar dropdowns if click outside any dropdown or arrow inside sidebar
  if (!isClickInsideSidebarDropdownOrArrow(e.target)) {
    closeAllSideDropdowns();
  }

  // On mobile: close sidebar if open and clicked outside sidebar or menu toggle
  if (window.innerWidth <= 768 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== menuToggle) {
    sidebar.classList.remove('open');
  }
});

// close all sidebar dropdowns
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

// Close sidebar on mobile if clicked on header or iframe content
function closeSidebarOnMobileClick(target) {
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  if (window.innerWidth <= 768 && sidebar.classList.contains('open') &&
      !sidebar.contains(target) && target !== menuToggle) {
    sidebar.classList.remove('open');
  }
}

// Close sidebar when header is clicked
const header = document.querySelector('header');
if (header) {
  header.addEventListener('click', (e) => {
    closeSidebarOnMobileClick(e.target);
  });
}

// Listen for iframe (main content) clicks
window.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'iframeClick') {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    }
  }
});

// Let iframe pages notify parent when clicked
document.addEventListener('click', () => {
  parent.postMessage({ action: 'iframeClick' }, '*');
});




