import { fetchPopularRecipes, fetchRecipeById } from './api.js';

const popularList = document.querySelector('.popular-recipes-list');

async function renderPopularRecipes() {
  try {
    const recipes = await fetchPopularRecipes();
    if (!recipes || recipes.length === 0) return;

    const markup = recipes
      .map(({ _id, title, description, preview }) => {
        const rawDescription = description || 'No description available';
        const shortDescription =
          rawDescription.length > 80
            ? rawDescription.substring(0, 80) + '...'
            : rawDescription;

        return `
          <li class="popular-recipe-item" data-id="${_id}">
            <img class="popular-recipe-img" src="${preview}" alt="${title}">
            <div class="popular-recipe-info">
              <h3 class="popular-recipe-title">${title}</h3>
              <p class="popular-recipe-description">${shortDescription}</p>
            </div>
          </li>
        `;
      })
      .join('');

    if (popularList) {
      popularList.innerHTML = markup;
    }
  } catch (error) {
    console.error('Popüler tarifler basılırken hata oluştu:', error);
  }
}

renderPopularRecipes();

if (popularList) {
  popularList.addEventListener('click', async e => {
    const recipeCard = e.target.closest('.popular-recipe-item');

    if (recipeCard) {
      const recipeId = recipeCard.dataset.id;

      try {
        const recipeDetails = await fetchRecipeById(recipeId);
        console.log('Tarif Detayları:', recipeDetails);
        openRecipeModal(recipeDetails);
      } catch (err) {
        console.error('Tarif detayları getirilemedi:', err);
      }
    }
  });
}