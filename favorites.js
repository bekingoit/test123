import{a as e,c as t,o as n,r,u as i}from"./assets/rating-modal-BBpcIu23.js";var a=document.querySelector(`.fav-hero-pic`),o=document.querySelector(`.fav-category-recipe-list`),s=document.querySelector(`.fav-recipes-list`),c=document.querySelector(`.fav-no-recipes-content`);document.querySelector(`.all-category-btn`);var l=[];u();async function u(){let e=t();if(!e||e.length===0){p();return}try{let t=(await Promise.all(e.map(e=>r(e)))).filter(Boolean);if(t.length===0){p();return}l=t,m(),f(t),d(t)}catch(e){console.error(e),p()}}function d(t){s.innerHTML=``;let r=t.map(t=>`
      <li class="recipes-item" id="${t._id}">
        <svg class="favorite-icon favorite-icon-active" data-id="${t._id}">
          <use href="${n}#icon-heart"></use>
        </svg>
        <img class="card-img" src="${t.preview}" alt="${t.description}" loading="lazy" />
        <div class="recipe-card">
          <div class="text-content">
            <p class="recipe-card-title">${t.title}</p>
            <p class="recipe-card-description">${t.description}</p>
          </div>
          <div class="card-btn-container">
            <div class="rating-container">
              <span class="rating-value">${t.rating||0}</span>
              <span class="rating-stars">${e(t.rating)}</span>
            </div>
            <button type="button" class="see-recipe-btn" name="${t._id}" data-modal-recipte-open>
              See recipe
            </button>
          </div>
        </div>
      </li>
    `).join(``);s.insertAdjacentHTML(`beforeend`,r)}function f(e){let t=[...new Set(e.map(e=>e.category))];o.innerHTML=``,o.insertAdjacentHTML(`beforeend`,`<button type="button" class="all-category-btn fav-category-btn">All categories</button>`);let n=t.map(e=>`<button type="button" class="fav-category-btn">${e}</button>`).join(``);o.insertAdjacentHTML(`beforeend`,n)}o.addEventListener(`click`,e=>{if(!e.target.classList.contains(`fav-category-btn`))return;let t=e.target.textContent;if(t===`All categories`){d(l);return}d(l.filter(e=>e.category===t))}),s.addEventListener(`click`,e=>{let t=e.target.closest(`.favorite-icon`);if(t){let e=t.dataset.id;t.classList.remove(`favorite-icon-active`),setTimeout(()=>{l=l.filter(t=>t._id!==e),i(e),d(l),f(l),l.length===0&&p()},300)}let n=e.target.closest(`.see-recipe-btn`);if(n){let e=n.name;openRecipe(e)}});function p(){c.classList.remove(`is-hidden`),a.style.display=`none`,o.style.display=`none`,s.style.display=`none`}function m(){c.classList.add(`is-hidden`),a.style.display=``,o.style.display=``,s.style.display=``}document.addEventListener(`favoriteRemoved`,e=>{let t=e.detail.id;l=l.filter(e=>e._id!==t),i(t),d(l),f(l),l.length===0&&p()});
//# sourceMappingURL=favorites.js.map