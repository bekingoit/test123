document.addEventListener('click', (event) => {
  const ratingBtn = event.target.closest('#giveRatingBtn') || event.target.closest('.js-give-rating-btn');
  const closeBtn = event.target.closest('.js-modal-close-btn');
  const ratingModal = document.getElementById('ratingModal');

  if (ratingBtn) {
    if (ratingModal) {
      ratingModal.classList.remove('is-hidden');
      document.body.style.overflow = 'hidden';

      const recipeModalBackdrop = document.getElementById('recipeModal');
      if (recipeModalBackdrop) {
        recipeModalBackdrop.classList.add('is-hidden');
      }
    }
  }

  if (closeBtn || event.target === ratingModal) {
    if (ratingModal) {
      ratingModal.classList.add('is-hidden');
      document.body.style.overflow = 'auto';
    }
  }
});

const stars = document.querySelectorAll('.rating-star-item');
const ratingValueText = document.querySelector('.js-rating-value');

stars.forEach((star) => {
  star.addEventListener('click', () => {
    const value = star.getAttribute('data-value');
    ratingValueText.textContent = `${value}.0`;
    updateStars(value);
  });
});

function updateStars(currentValue) {
  stars.forEach((star) => {
    const starValue = star.getAttribute('data-value');
    if (starValue <= currentValue) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

updateStars(0);

document.addEventListener('DOMContentLoaded', () => {
  const ratingModal = document.getElementById('ratingModal');
  const ratingForm = document.querySelector('.js-rating-form');
  const stars = document.querySelectorAll('.rating-star-item');
  const ratingText = document.querySelector('.js-rating-value');

  let currentRating = 0;

  stars.forEach(item => {
    item.addEventListener('click', () => {
      currentRating = item.getAttribute('data-value');
      ratingText.textContent = `${currentRating}.0`;

      stars.forEach(star => {
        const icon = star.querySelector('.icon-star1');
        if (icon) {
          if (star.getAttribute('data-value') <= currentRating) {
            icon.classList.add('filled');
          } else {
            icon.classList.remove('filled');
          }
        }
      });
    });
  });

  ratingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = e.target.elements.email.value;
    const isDark = document.body.classList.contains('dark-theme');
    const textColor = isDark ? '#f8f8f8' : '#050505';
    const subTextColor = isDark ? 'rgba(248,248,248,0.5)' : 'rgba(5,5,5,0.5)';

    try {
      const response = await fetch(
        `https://tasty-treats-backend.p.goit.global/api/recipes/${window.currentRecipeId}/rating`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rate: Number(currentRating), email: email }),
        }
      );

      if (response.ok) {
        ratingForm.innerHTML = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            padding: 20px 0;
            text-align: center;
          ">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="30" fill="#9BB537"/>
              <path d="M18 30L26 38L42 22" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p style="font-size: 18px; font-weight: 600; color: ${textColor}; margin: 0;">Thank you for your rating!</p>
            <p style="font-size: 14px; color: ${subTextColor}; margin: 0;">Your feedback has been sent successfully.</p>
          </div>
        `;

        setTimeout(() => {
          ratingModal.classList.add('is-hidden');
          document.body.style.overflow = 'auto';

          currentRating = 0;
          ratingText.textContent = '0.0';
          updateStars(0);

          ratingForm.innerHTML = `
            <input type="email" class="rating-input" name="email" placeholder="Enter email" required>
            <button type="submit" class="btn btn-send">Send</button>
          `;
        }, 2500);

      } else {
        alert('Bir hata oluştu, lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('API Hatası:', error);
    }
  });
});