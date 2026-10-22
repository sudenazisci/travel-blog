// Merkezi API URL ayarı
// Backend Render'da ise Vercel/build ortamında VITE_API_URL=https://...onrender.com ayarlayın.
// Tanımsızsa aynı kökten /api (Vercel serverless proxy) kullanılır.
const raw = import.meta.env.VITE_API_URL;
const API_BASE =
    raw !== undefined && raw !== null
        ? String(raw).trim().replace(/\/$/, '')
        : '';

export default API_BASE;
