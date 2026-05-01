window.addEventListener('load', () => {
const savedTheme = localStorage.getItem('theme');

const hamburgerBtn = document.getElementById('hamburgerBtn');

const mobileMenu = document.getElementById('mobileMenu');

const closeMenuBtn = document.getElementById('closeMenuBtn');
const menuOverlay = document.getElementById('menuOverlay');
// burger açma

hamburgerBtn.addEventListener('click', () => {
  mobileMenu.classList.add('active');

  menuOverlay.classList.add('active');
});

// burger kapama

closeMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.remove('active');

  menuOverlay.classList.remove('active');
});

// ACTIVE PAGE LINK

const currentPage = window.location.pathname
  .split('/')
  .pop();

const allLinks = document.querySelectorAll('.nav-link');

allLinks.forEach(link => {
  const linkPage = link
    .getAttribute('href')
    .split('/')
    .pop();

  if (currentPage === linkPage) {
    link.classList.add('active-link');
  }
});

// TOGGLE tema

const themeToggle = document.getElementById('themeToggle');

const desktopThemeToggle = document.getElementById('desktopThemeToggle');

if (savedTheme === 'dark') {
  document.body.classList.add('dark-theme');
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');

  if (document.body.classList.contains('dark-theme')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});
desktopThemeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');

  if (document.body.classList.contains('dark-theme')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// ORDER MODAL penceresi

const openOrderModalBtn =
  document.getElementById('openOrderModal');

const orderModal = document.querySelector(
  '[data-modal-id="order-now"]'
);


/* 
Sadece elementler varsa çalıştır.
Favorites page'de modal olmayabilir.
*/

if (openOrderModalBtn && orderModal) {

  openOrderModalBtn.addEventListener('click', event => {

    event.preventDefault();

    orderModal.classList.remove('is-hidden');

  });

}

if (orderModal) {

  const closeOrderModalBtn =
    orderModal.querySelector('[data-modal-close]');


  // modal kapat
  closeOrderModalBtn.addEventListener('click', () => {

    orderModal.classList.add('is-hidden');

  });


  // overlay click
  orderModal.addEventListener('click', event => {

    if (event.target === orderModal) {

      orderModal.classList.add('is-hidden');

    }

  });

}

document.addEventListener('click', event => {
  const isMenuOpen = mobileMenu.classList.contains('active');

  if (
    isMenuOpen &&
    !mobileMenu.contains(event.target) &&
    !hamburgerBtn.contains(event.target)
  ) {
    mobileMenu.classList.remove('active');

    menuOverlay.classList.remove('active');
  }
});
});
