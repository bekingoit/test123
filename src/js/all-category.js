import { fetchCategories } from './api.js';
import { reloadRecipesList } from './recipe-cards.js'; // Bu importun olduğundan emin ol

const categoryList = document.querySelector('#category-list');
const allCatBtn = document.querySelector('#all-category-btn');

// Kategorileri sol menüye basan fonksiyon
async function initCategories() {
  const categories = await fetchCategories();
  const markup = categories
    .map(
      ({ name }) => `
    <li class="cat-items">
      <button type="button" class="category-btn" data-name="${name}">${name}</button>
    </li>
  `
    )
    .join('');

  if (categoryList) categoryList.innerHTML = markup;
}

// KATEGORİ TIKLAMA OLAYI
if (categoryList) {
  categoryList.addEventListener('click', e => {
    if (e.target.nodeName !== 'BUTTON') return;

    // Aktiflik görselini güncelle
    document
      .querySelectorAll('.category-btn, .all-category-button')
      .forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    // Tıklanan kategoriyi al
    const categoryName = e.target.dataset.name;
    reloadRecipesList({ category: categoryName, page: 1 });
  });
}

// ALL CATEGORIES TIKLAMA OLAYI
if (allCatBtn) {
  allCatBtn.addEventListener('click', () => {
    document
      .querySelectorAll('.category-btn')
      .forEach(btn => btn.classList.remove('active'));
    allCatBtn.classList.add('active');
    reloadRecipesList({ category: '', page: 1 }); // Filtreyi sıfırla
  });
}

initCategories();
