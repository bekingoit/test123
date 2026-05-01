import './rating-modal.js';
import svg from '../img/favicon.svg';
import { createRatingStars } from './rating';
import { getFavorites, removeFavorite } from './storage';
import { fetchRecipeById } from './api';

const heroPicture = document.querySelector('.fav-hero-pic');
const categoryRecipeList = document.querySelector('.fav-category-recipe-list');
const favoriteRecipesList = document.querySelector('.fav-recipes-list');
const noFavoriteRecipesMessage = document.querySelector(
  '.fav-no-recipes-content'
);
const categoryAllBtn = document.querySelector('.all-category-btn');

let allRecipes = [];

initFavoritesPage();

async function initFavoritesPage() {
  const ids = getFavorites();

  if (!ids || ids.length === 0) {
    showEmptyState();
    return;
  }

  try {
    const recipes = (
      await Promise.all(ids.map(id => fetchRecipeById(id)))
    ).filter(Boolean);

    if (recipes.length === 0) {
      showEmptyState();
      return;
    }

    allRecipes = recipes;
    showContentState();
    createCategories(recipes);
    renderRecipes(recipes);
  } catch (err) {
    console.error(err);
    showEmptyState();
  }
}

function renderRecipes(recipes) {
  favoriteRecipesList.innerHTML = '';

  const markup = recipes
    .map(recipe => {
      return `
      <li class="recipes-item" id="${recipe._id}">
        <svg class="favorite-icon favorite-icon-active" data-id="${recipe._id}">
          <use href="${svg}#icon-heart"></use>
        </svg>
        <img class="card-img" src="${recipe.preview}" alt="${recipe.description}" loading="lazy" />
        <div class="recipe-card">
          <div class="text-content">
            <p class="recipe-card-title">${recipe.title}</p>
            <p class="recipe-card-description">${recipe.description}</p>
          </div>
          <div class="card-btn-container">
            <div class="rating-container">
              <span class="rating-value">${recipe.rating || 0}</span>
              <span class="rating-stars">${createRatingStars(recipe.rating)}</span>
            </div>
            <button type="button" class="see-recipe-btn" name="${recipe._id}" data-modal-recipte-open>
              See recipe
            </button>
          </div>
        </div>
      </li>
    `;
    })
    .join('');

  favoriteRecipesList.insertAdjacentHTML('beforeend', markup);
}

function createCategories(recipes) {
  const categories = [...new Set(recipes.map(r => r.category))];

  categoryRecipeList.innerHTML = '';
  categoryRecipeList.insertAdjacentHTML(
    'beforeend',
    `<button type="button" class="all-category-btn fav-category-btn">All categories</button>`
  );

  const markup = categories
    .map(
      cat => `<button type="button" class="fav-category-btn">${cat}</button>`
    )
    .join('');

  categoryRecipeList.insertAdjacentHTML('beforeend', markup);
}

categoryRecipeList.addEventListener('click', e => {
  if (!e.target.classList.contains('fav-category-btn')) return;

  const category = e.target.textContent;

  if (category === 'All categories') {
    renderRecipes(allRecipes);
    return;
  }

  const filtered = allRecipes.filter(r => r.category === category);
  renderRecipes(filtered);
});

favoriteRecipesList.addEventListener('click', e => {
  const icon = e.target.closest('.favorite-icon');
  if (icon) {
    const id = icon.dataset.id;

    // İkonu beyaza çevir
    icon.classList.remove('favorite-icon-active');

    // 300ms sonra listeden kaldır
    setTimeout(() => {
      allRecipes = allRecipes.filter(r => r._id !== id);
      removeFavorite(id);
      renderRecipes(allRecipes);
      createCategories(allRecipes);

      if (allRecipes.length === 0) {
        showEmptyState();
      }
    }, 300);
  }

  const btn = e.target.closest('.see-recipe-btn');
  if (btn) {
    const id = btn.name;
    openRecipe(id);
  }
});

function showEmptyState() {
  noFavoriteRecipesMessage.classList.remove('is-hidden');
  heroPicture.style.display = 'none';
  categoryRecipeList.style.display = 'none';
  favoriteRecipesList.style.display = 'none';
}

function showContentState() {
  noFavoriteRecipesMessage.classList.add('is-hidden');
  heroPicture.style.display = '';
  categoryRecipeList.style.display = '';
  favoriteRecipesList.style.display = '';
}

document.addEventListener('favoriteRemoved', e => {
  const id = e.detail.id;
  allRecipes = allRecipes.filter(r => r._id !== id);
  removeFavorite(id);
  renderRecipes(allRecipes);
  createCategories(allRecipes);

  if (allRecipes.length === 0) {
    showEmptyState();
  }
});
