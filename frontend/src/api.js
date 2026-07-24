// Merkezi API URL ayarı
// Vercel'de VITE_API_URL env variable'ı, local'de localhost:5000 kullanılır
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_BASE;
