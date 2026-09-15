// Storage cache utility for instant page hydration on refresh
export const STORAGE_KEYS = {
    SETTINGS: 'ceylanme_cached_settings',
    DESTINATIONS: 'ceylanme_cached_destinations',
    BLOGS: 'ceylanme_cached_blogs'
};

export const getCachedData = (key, fallback = null) => {
    try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        return fallback;
    }
};

export const setCachedData = (key, data) => {
    try {
        if (data) {
            sessionStorage.setItem(key, JSON.stringify(data));
        }
    } catch (e) {
        console.debug('Storage error:', e);
    }
};

export const DEFAULT_STATIC_REGIONS = [
    { _id: 'def-tr', name: 'TÜRKİYE', isRegion: true },
    { _id: 'def-af', name: 'AFRİKA', isRegion: true },
    { _id: 'def-as', name: 'ASYA', isRegion: true },
    { _id: 'def-eu', name: 'AVRUPA', isRegion: true },
    { _id: 'def-sa', name: 'GÜNEY AMERİKA', isRegion: true },
    { _id: 'def-na', name: 'KUZEY AMERİKA', isRegion: true }
];
