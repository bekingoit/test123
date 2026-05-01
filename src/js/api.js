import axios from 'axios';

const BASE_URL = 'https://tasty-treats-backend.p.goit.global/api';

// Hero bölümündeki etkinlikleri getirir
export async function fetchEvents() {
  try {
    const { data } = await axios.get(`${BASE_URL}/events`);
    return data;
  } catch (error) {
    console.error('Events çekilirken hata oluştu:', error.message);
    return []; // Slider'ın bozulmaması için boş dizi dönüyoruz
  }
}
// Kategorileri getirir
export async function fetchCategories() {
  try {
    const { data } = await axios.get(`${BASE_URL}/categories`);
    return data;
  } catch (error) {
    console.error('Kategoriler çekilirken hata oluştu:', error.message);
    return []; // Slider'ın bozulmaması için boş dizi dönüyoruz
  }
}

// Popüler tarifleri getirir
export async function fetchPopularRecipes() {
  try {
    const { data } = await axios.get(`${BASE_URL}/recipes/popular`);
    return data;
  } catch (error) {
    console.error('Popüler tarifler çekilirken hata oluştu:', error.message);
    return []; // Slider'ın bozulmaması için boş dizi dönüyoruz
  }
}

// Tarifleri çeşitli filtrelerle getirir
export async function fetchRecipes(options = {}) {
  try {
    const { data } = await axios.get(`${BASE_URL}/recipes`, {
      params: {
        page: options.page || 1,
        limit: options.limit || 9, // Varsayılanı 9 yaptık
        category: options.category || '',
        title: options.title || '',
        area: options.area || '',
        ingredient: options.ingredient || '',
        time: options.time || '',
      },
    });
    return data;
  } catch (error) {
    console.error('Tarifler çekilirken hata:', error.message);
    return { results: [] };
  }
}

// Tek bir tarifin tüm detaylarını ID üzerinden getirir
export async function fetchRecipeById(id) {
  try {
    const { data } = await axios.get(`${BASE_URL}/recipes/${id}`);
    return data;
  } catch (error) {
    console.error('Tarif detayları alınamadı:', error.message);
    return null;
  }
}

// Yeni bir sipariş oluşturur (POST isteği)
export async function createOrder(orderData) {
  try {
    // orderData: { name, phone, email, comment } gibi bir obje olmalı
    const { data } = await axios.post(`${BASE_URL}/orders/add`, orderData);
    return data;
  } catch (error) {
    console.error('Sipariş gönderilirken hata:', error.message);
    throw error; // Hatayı yukarı fırlat ki arayüzde kullanıcıya "Hata oluştu" diyebilelim
  }// Hatayı yukarı fırlat ki arayüzde kullanıcıya "Hata oluştu" diyebilelim
}