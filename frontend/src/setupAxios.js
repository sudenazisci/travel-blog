import axios from 'axios';
import API_BASE from './api';

// Tüm API isteklerine admin token'ını otomatik ekler (taslaklar, istatistikler, yükleme vb. için)
// ve süresi dolmuş / geçersiz token durumunda admin'i giriş sayfasına yönlendirir.
let configured = false;

export default function setupAxios() {
    if (configured) return;
    configured = true;

    axios.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        const url = config.url || '';
        const isOwnApi = url.startsWith(`${API_BASE}/api`) || url.startsWith('/api');
        if (token && isOwnApi && !config.headers['x-auth-token']) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    });

    axios.interceptors.response.use(
        (res) => res,
        (err) => {
            const status = err?.response?.status;
            const url = err?.config?.url || '';
            if (status === 401 && localStorage.getItem('token') && !url.includes('/api/auth/')) {
                localStorage.removeItem('token');
                if (window.location.pathname.startsWith('/admin')) {
                    window.location.href = '/yonetim-gizli-giris';
                }
            }
            return Promise.reject(err);
        }
    );
}
