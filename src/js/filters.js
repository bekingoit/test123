import { reloadRecipesList } from './recipe-cards.js';

const BASE_URL = 'https://tasty-treats-backend.p.goit.global/api';

function init() {
  const searchInput = document.querySelector('.search-input');
  const resetBtn = document.querySelector('.reset-btn');
  const timeSelect = document.querySelector('[data-filter="time"]');
  const areaSelect = document.querySelector('[data-filter="area"]');
  const ingredientSelect = document.querySelector('[data-filter="ingredient"]');
  const timeDropdown = document.querySelector('.time-dropdown');
  const areaDropdown = document.querySelector('.area-dropdown');
  const ingredientsDropdown = document.querySelector('.ingredients-dropdown');

  if (!timeDropdown || !areaDropdown || !ingredientsDropdown) {
    setTimeout(init, 100);
    return;
  }

  const filters = {
    search: '',
    time: '',
    area: '',
    ingredient: '',
  };

  function debounce(callback, delay) {
    let timerId;
    return function (...args) {
      clearTimeout(timerId);
      timerId = setTimeout(() => callback(...args), delay);
    };
  }

  function emitFiltersChange() {
    reloadRecipesList({
      page: 1,
      title: filters.search,
      area: filters.area,
      ingredient: filters.ingredient,
      time: filters.time,
    });
  }

  function closeAllDropdowns() {
    document.querySelectorAll('.custom-select').forEach(select => {
      select.classList.remove('is-open');
    });
  }

  const dropdowns = document.querySelectorAll('.custom-dropdown');
  dropdowns.forEach(dropdown => {
    let scrollTimeout;
    dropdown.addEventListener('scroll', () => {
      dropdown.classList.add('is-scrolling');
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        dropdown.classList.remove('is-scrolling');
      }, 700);
    });
  });

  function createOption({ value, label }) {
    return `<li class="custom-dropdown-option" data-value="${value}">${label}</li>`;
  }

  function renderTimeOptions() {
    const times = [];
    for (let i = 10; i <= 120; i += 10) {
      times.push({ value: i, label: `${i} min` });
    }
    timeDropdown.innerHTML = times.map(createOption).join('');
  }

  async function fetchAreas() {
    const response = await fetch(`${BASE_URL}/areas`);
    if (!response.ok) throw new Error('Areas could not be fetched');
    return response.json();
  }

  async function fetchIngredients() {
    const response = await fetch(`${BASE_URL}/ingredients`);
    if (!response.ok) throw new Error('Ingredients could not be fetched');
    return response.json();
  }

  function renderAreas(areas) {
    const sortedAreas = [...areas].sort((a, b) => a.name.localeCompare(b.name));
    areaDropdown.innerHTML = sortedAreas
      .map(area => createOption({ value: area.name, label: area.name }))
      .join('');
  }

  function renderIngredients(ingredients) {
    const sortedIngredients = [...ingredients].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    ingredientsDropdown.innerHTML = sortedIngredients
      .map(ingredient =>
        createOption({ value: ingredient._id, label: ingredient.name })
      )
      .join('');
  }

  function setSelectedOption(select, option) {
    const filterName = select.dataset.filter;
    const trigger = select.querySelector('.custom-select-trigger');
    const selectedText = option.textContent.trim();
    const selectedValue = option.dataset.value;

    filters[filterName] = selectedValue;
    trigger.firstChild.textContent = selectedText;

    select.querySelectorAll('.custom-dropdown-option').forEach(item => {
      item.classList.remove('is-selected');
    });

    option.classList.add('is-selected');
    closeAllDropdowns();
    emitFiltersChange();
  }

  document.querySelectorAll('.custom-select').forEach(select => {
    const trigger = select.querySelector('.custom-select-trigger');

    trigger.addEventListener('click', event => {
      event.stopPropagation();
      const isOpen = select.classList.contains('is-open');
      closeAllDropdowns();
      if (!isOpen) select.classList.add('is-open');
    });
  });

  document.addEventListener('click', event => {
    const option = event.target.closest('.custom-dropdown-option');
    if (!option) return;

    const select = option.closest('.custom-select');
    if (!select) return;

    setSelectedOption(select, option);
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.custom-select')) {
      closeAllDropdowns();
    }
  });

  if (searchInput) {
    searchInput.addEventListener(
      'input',
      debounce(event => {
        filters.search = event.target.value.trim();
        emitFiltersChange();
      }, 300)
    );
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      filters.search = '';
      filters.time = '';
      filters.area = '';
      filters.ingredient = '';

      if (searchInput) searchInput.value = '';

      timeSelect.querySelector('.custom-select-trigger').firstChild.textContent = 'Any time';
      areaSelect.querySelector('.custom-select-trigger').firstChild.textContent = 'Any area';
      ingredientSelect.querySelector('.custom-select-trigger').firstChild.textContent = 'Any ingredient';

      document.querySelectorAll('.custom-dropdown-option').forEach(option => {
        option.classList.remove('is-selected');
      });

      closeAllDropdowns();
      emitFiltersChange();
    });
  }

  async function initFilters() {
    try {
      renderTimeOptions();
      const [areas, ingredients] = await Promise.all([
        fetchAreas(),
        fetchIngredients(),
      ]);
      renderAreas(areas);
      renderIngredients(ingredients);
      emitFiltersChange();
    } catch (error) {
      console.error(error);
    }
  }

  initFilters();
}

init();