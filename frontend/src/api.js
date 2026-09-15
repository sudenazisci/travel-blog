// Merkezi API URL ayarı
// Production ve Vercel ortamında varsayılan olarak relative ('') API kökü kullanılır.
// VITE_API_URL verilmişse o kullanılır, aksi halde relative path ile Mixed Content ve localhost engeli önlenir.
const API_BASE = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : '';

export default API_BASE;
