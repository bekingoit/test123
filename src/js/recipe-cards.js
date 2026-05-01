import throttle from 'lodash.throttle';
import Notiflix from 'notiflix';
import svg from '../img/favicon.svg';
import { createRatingStars } from './rating';
import { fetchRecipes } from './api';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
} from './storage';

const recipesList = document.querySelector('.list-recipes');
const paginationContainer = document.querySelector('.recipes-pagination');
const loader = document.querySelector('.loader');
const loaderText = document.querySelector('.loader-txt');

const state = {
  page: 1,
  limit: 9,
  totalPages: 0,
  category: '',
  title: '',
  area: '',
  ingredient: '',
  time: '',
};

const jump = window.innerWidth <= 767 ? 2 : 3;

const showLoader = () => {
  loader?.classList.remove('visually-hidden');
  loaderText?.classList.remove('visually-hidden');
  paginationContainer?.classList.add('visually-hidden');
};

const hideLoader = () => {
  loader?.classList.add('visually-hidden');
  loaderText?.classList.add('visually-hidden');
};

const setResponsiveLimit = () => {
  const w = window.innerWidth;
  if (w <= 767) state.limit = 6;
  else if (w < 1280) state.limit = 8;
  else state.limit = 9;
};

export const createRecipesList = data => {
  try {
    if (!recipesList) {
      console.error('recipesList bulunamadı');
      return;
    }

    recipesList.innerHTML = '';

    if (!Array.isArray(data?.results)) return;

    const favorites = getFavorites();

    data.results.forEach(recipe => {
      const isFav =
        recipe._id &&
        Array.isArray(favorites) &&
        favorites.includes(String(recipe._id));

      if (!recipe._id) {
        console.warn('ID YOK:', recipe);
      }

      const markup = `
        <li class="recipes-item" id="${recipe._id}">
          <svg class="favorite-icon ${isFav ? 'favorite-icon-active' : ''}" data-id="${recipe._id}">
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
              <button type="button" class="see-recipe-btn" name="${recipe._id}" data-id="${recipe._id}" data-modal-recipte-open>See recipe</button>
            </div>
          </div>
        </li>`;
      recipesList.insertAdjacentHTML('beforeend', markup);
    });
  } catch (err) {
    console.error(err);

    if (document?.body) {
      Notiflix.Notify.warning('Opps, something went wrong. Please try again.');
    }
  }
};

export async function reloadRecipesList(options = {}) {
  Object.assign(state, options);

  showLoader();
  recipesList.innerHTML = '';
  try {
    const newData = await fetchRecipes({
      ...options,
      page: state.page,
      limit: state.limit,
      category: state.category,
      area: state.area,
      ingredient: state.ingredient,
      time: state.time,
      title: state.title,
    });

    state.totalPages = newData.totalPages;
    createRecipesList(newData);
    renderPagination();
    return newData;
  } catch (err) {
    console.error(err);
    Notiflix.Notify.failure('Data load failed', {
      timeout: 5000,
      position: 'right-top',
    });
  } finally {
    hideLoader();
  }
}

reloadRecipesList();

const changeNumberRecipe = () => {
  const oldLimit = state.limit;
  const oldPage = state.page;

  setResponsiveLimit();

  if (oldLimit === state.limit) return;

  const firstItemIndex = (oldPage - 1) * oldLimit;
  const newPage = Math.floor(firstItemIndex / state.limit) + 1;

  state.page = newPage;

  reloadRecipesList();
};

window.addEventListener('resize', throttle(changeNumberRecipe, 1000));

const renderPagination = () => {
  if (!paginationContainer) return;

  if (state.totalPages <= 1) {
    paginationContainer.classList.add('visually-hidden');
    return;
  } else {
    paginationContainer.classList.remove('visually-hidden');
  }

  const pageNumbersEl = paginationContainer.querySelector('.page-numbers');
  pageNumbersEl.innerHTML = '';

  const maxVisible = window.innerWidth <= 767 ? 2 : 3;

  let start = Math.max(1, state.page - Math.floor(maxVisible / 2));
  let end = start + maxVisible - 1;

  if (end > state.totalPages) {
    end = state.totalPages;
    start = Math.max(1, end - maxVisible + 1);
  }

  if (start > end) return;

  if (start > 1) {
    const prevBlock = document.createElement('button');
    prevBlock.textContent = '...';
    prevBlock.className = 'pageBtn';
    prevBlock.dataset.jump = 'prev';
    pageNumbersEl.appendChild(prevBlock);
  }

  for (let i = start; i <= end; i++) {
    const btn = document.createElement('button');
    btn.className = 'pageBtn';
    btn.textContent = i;
    btn.dataset.page = i;

    if (i === state.page) btn.classList.add('current-page');

    pageNumbersEl.appendChild(btn);
  }

  if (end < state.totalPages) {
    const nextBlock = document.createElement('button');
    nextBlock.textContent = '...';
    nextBlock.className = 'pageBtn';
    nextBlock.dataset.jump = 'next';
    pageNumbersEl.appendChild(nextBlock);
  }
};

paginationContainer.addEventListener('click', async e => {
  const btn = e.target.closest('button');
  if (!btn) return;

  if (btn.classList.contains('next-page')) {
    if (state.page < state.totalPages) state.page++;
  } else if (btn.classList.contains('previous-page')) {
    if (state.page > 1) state.page--;
  } else if (btn.classList.contains('first-page')) {
    state.page = 1;
  } else if (btn.classList.contains('last-page')) {
    state.page = state.totalPages;
  } else if (btn.dataset.page) {
    state.page = Number(btn.dataset.page);
  } else if (btn.dataset.jump === 'next') {
    state.page = Math.min(state.page + jump, state.totalPages);
  } else if (btn.dataset.jump === 'prev') {
    state.page = Math.max(state.page - jump, 1);
  } else return;

  await reloadRecipesList();
  renderPagination();
});

recipesList.addEventListener('click', e => {
  const icon = e.target.closest('.favorite-icon');
  if (icon) {
    const id = icon.dataset.id;
    let favorites = getFavorites(); // ilgili fonksiyon import edilip bağlanacak

    if (isFavorite(id)) {
      removeFavorite(id);
      icon.classList.remove('favorite-icon-active');
    } else {
      addFavorite(id);
      icon.classList.add('favorite-icon-active');
    }
  }

  const btn = e.target.closest('.see-recipe-btn');
  if (btn) {
    const id = btn.dataset.id;
    openRecipe(id);
  }
});
