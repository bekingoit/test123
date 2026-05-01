import { fetchRecipeById } from './api';

export const openRecipe = id => {
  if (window.openRecipeModal) {
    fetch(`https://tasty-treats-backend.p.goit.global/api/recipes/${id}`)
      .then(res => res.json())
      .then(data => {
        window.currentRecipeId = id;
        window.openRecipeModal(data);
      })
      .catch(err => console.error('Modal açılırken hata:', err));
  }
};

import { addFavorite, removeFavorite, isFavorite } from './storage';
import { createRatingStars } from './rating';

const modalBackdrop = document.querySelector('.js-recipe-modal-backdrop');
const closeBtn = document.querySelector('.js-modal-close-btn');
const videoWrapperEl = document.querySelector('.video-wrapper');

window.openRecipeModal = function (recipeData) {
  if (!recipeData) return;
  window.currentRecipeId = recipeData._id;
  renderModalContent(recipeData);
  setupFavoriteButton(recipeData._id);
  if (modalBackdrop) {
    modalBackdrop.classList.remove('is-hidden');
    document.body.style.overflow = 'hidden';
  }
};

function renderModalContent(data) {
  const titleEl = document.querySelector('.js-recipe-title');
  const instructionsEl = document.querySelector('.js-instructions');
  const ingredientsListEl = document.querySelector('.js-ingredients');
  const ratingEl = document.querySelector('.js-recipe-rating');
  const timeEl = document.querySelector('.js-recipe-time');
  const starsContainer = document.querySelector('.js-recipe-stars');
  const videoWrapperEl = document.querySelector('.video-wrapper');
  const tagsListEl = document.querySelector('.js-tags');

  if (titleEl) titleEl.textContent = data.title || '';
  if (instructionsEl) instructionsEl.textContent = data.instructions || '';
  if (ratingEl) ratingEl.textContent = data.rating || '0.0';
  if (timeEl) timeEl.textContent = `${data.time} min` || '';

  if (tagsListEl && data.tags) {
    tagsListEl.innerHTML = data.tags
      .map(tag => `<li class="recipe-tag-item">#${tag}</li>`)
      .join('');
  }

  if (ingredientsListEl && data.ingredients) {
    ingredientsListEl.innerHTML = data.ingredients
      .map(ing => `
        <li class="ingredient-item">
          <span class="ingredient-name">${ing.name}</span>
          <span class="ingredient-measure">${ing.measure}</span>
        </li>
      `)
      .join('');
  }

  if (starsContainer) {
    starsContainer.innerHTML = createRatingStars(data.rating);
  }

  if (videoWrapperEl && data.youtube) {
    const videoId = data.youtube.includes('=')
      ? data.youtube.split('=')[1]
      : data.youtube.split('/').pop();
    videoWrapperEl.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
  }
}

function closeModal() {
  if (modalBackdrop) {
    modalBackdrop.classList.add('is-hidden');
    document.body.style.overflow = 'auto';
    if (videoWrapperEl) videoWrapperEl.innerHTML = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', e => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.body.addEventListener('click', async event => {
    const targetBtn =
      event.target.closest('.see-recipe-btn') ||
      event.target.closest('.js-see-recipe');
    if (!targetBtn) return;

    const recipeId = targetBtn.dataset.id || targetBtn.name;
    if (recipeId) {
      try {
        const response = await fetch(
          `https://tasty-treats-backend.p.goit.global/api/recipes/${recipeId}`
        );
        const data = await response.json();
        window.openRecipeModal(data);
      } catch (error) {
        console.error('Hata:', error);
      }
    }
  });

  const ratingBtn = document.getElementById('giveRatingBtn');
  const ratingModal = document.querySelector('.js-rating-modal-backdrop');

  if (ratingBtn && ratingModal) {
    ratingBtn.addEventListener('click', () => {
      ratingModal.classList.remove('is-hidden');
      document.body.style.overflow = 'hidden';
    });
  }
});

function setupFavoriteButton(recipeId) {
  const favBtn = document.querySelector('.btn-favorite');
  if (!favBtn) return;

  updateFavButtonUI(favBtn, recipeId);

  favBtn.onclick = () => {
    if (isFavorite(recipeId)) {
      removeFavorite(recipeId);
      document.dispatchEvent(new CustomEvent('favoriteRemoved', { detail: { id: recipeId } }));
    } else {
      addFavorite(recipeId);
    }
    updateFavButtonUI(favBtn, recipeId);
  };
}

function updateFavButtonUI(btn, recipeId) {
  if (isFavorite(recipeId)) {
    btn.textContent = 'Remove from favorite';
  } else {
    btn.textContent = 'Add to favorite';
  }

  const cardIcon = document.querySelector(`.favorite-icon[data-id="${recipeId}"]`);
  if (cardIcon) {
    if (isFavorite(recipeId)) {
      cardIcon.classList.add('favorite-icon-active');
    } else {
      cardIcon.classList.remove('favorite-icon-active');
    }
  }
}