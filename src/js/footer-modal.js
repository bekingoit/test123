const openModalBtn = document.getElementById('open-team-modal');
const closeModalBtn = document.getElementById('close-team-modal');
const teamBackdrop = document.getElementById('team-modal');

if (openModalBtn && teamBackdrop) {
  openModalBtn.addEventListener('click', () => {
    teamBackdrop.classList.remove('is-hidden');
    document.body.style.overflow = 'hidden'; // Modal açılınca arkadaki sayfa kaymasın
  });
}

if (closeModalBtn && teamBackdrop) {
  closeModalBtn.addEventListener('click', () => {
    teamBackdrop.classList.add('is-hidden');
    document.body.style.overflow = ''; // Modal kapanınca kayma geri gelsin
  });
}

if (teamBackdrop) {
  teamBackdrop.addEventListener('click', (e) => {
    if (e.target === teamBackdrop) {
      teamBackdrop.classList.add('is-hidden');
      document.body.style.overflow = '';
    }
  });
}

// ESC tuşu ile kapatma 
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !teamBackdrop.classList.contains('is-hidden')) {
    teamBackdrop.classList.add('is-hidden');
    document.body.style.overflow = '';
  }
});