import debounce from 'lodash.debounce';
import { reloadRecipesList } from './recipe-cards';

const searchInput = document.querySelector('#search-input');

const handleSearch = debounce(event => {
  const query = event.target.value.trim();

  if (query === '') {
    console.log('Arama temizlendi, tüm tarifler veya seçili kategori getiriliyor...');
  } else {
    console.log(`Aranan kelime: ${query}`);
  }
  reloadRecipesList({ query: query, page: 1 });
}, 300);

if (searchInput) {
  searchInput.addEventListener('input', handleSearch);
}