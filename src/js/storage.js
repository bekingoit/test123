const DEFAULT_VALUE = null;

// -------- EVRENSEL LOCALSTORAGE KULLANIMLARINI BU BÖLÜME TANIMLADIM. İHTİYACA GÖRE GET, SET, REMOVE METHODLARI KULLANILARAK YENİ KEY'LER OLUŞTURULABİLİR --------
export const getItem = (key, fallback = DEFAULT_VALUE) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    return JSON.parse(data);
  } catch (err) {
    console.warn(`localStorage parse error for key: ${key}, resetting`);
    localStorage.removeItem(key);
    return fallback;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`localStorage set error for key: ${key}`, err);
  }
};

export const removeItem = key => {
  localStorage.removeItem(key);
};

// -------- FAVORITES --------

const FAVORITES_KEY = 'favorites';

export const getFavorites = () => {
  return getItem(FAVORITES_KEY, []);
};

export const addFavorite = id => {
  const favs = getFavorites();
  if (!favs.includes(id)) {
    favs.push(id);
    setItem(FAVORITES_KEY, favs);
  }
};

export const removeFavorite = id => {
  const favs = getFavorites().filter(fav => fav !== id);
  setItem(FAVORITES_KEY, favs);
};

export const isFavorite = id => {
  return getFavorites().includes(id);
};
