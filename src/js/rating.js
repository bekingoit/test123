import svg from '../img/favicon.svg';

export const createRatingStars = rating => {
  const rounded = Math.round(rating || 0);

  const filledStar = `
    <svg class="filled-stars" viewBox="0 0 32 32" width="14" height="14">
      <use href="${svg}#icon-star"></use>
    </svg>
  `;

  const emptyStar = `
    <svg class="empty-star" viewBox="0 0 32 32" width="14" height="14">
      <use href="${svg}#icon-star"></use>
    </svg>
  `;

  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += i < rounded ? filledStar : emptyStar;
  }

  return stars;
};