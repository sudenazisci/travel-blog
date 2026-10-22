import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import API_BASE from '../api';

// Gerçek ziyaretçi takibi. SAYILMAYANLAR:
//  - admin olarak giriş yapmış tarayıcılar (localStorage'da 'token' var)
//  - localhost / yerel ağ (geliştirme)
//  - /admin ve /yonetim sayfaları
//  - tarayıcıda localStorage.setItem('ceylanme_no_track','1') yapılmış cihazlar
const VID_KEY = 'ceylanme_vid';

const isDevHost = () => {
    const h = window.location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h.endsWith('.local') ||
        /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h);
};

const shouldTrack = (path) => {
    try {
        if (isDevHost()) return false;
        if (localStorage.getItem('token')) return false;
        if (localStorage.getItem('ceylanme_no_track') === '1') return false;
    } catch (e) {
        return false;
    }
    return !/^\/(admin|yonetim)/i.test(path);
};

const getVid = () => {
    let vid = localStorage.getItem(VID_KEY);
    if (!vid || !/^[a-f0-9-]{36}$/i.test(vid)) {
        vid = (window.crypto && window.crypto.randomUUID)
            ? window.crypto.randomUUID()
            : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                const r = Math.random() * 16 | 0;
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        localStorage.setItem(VID_KEY, vid);
    }
    return vid;
};

const send = (payload, beacon = false) => {
    const url = `${API_BASE}/api/stats/track`;
    const body = JSON.stringify(payload);
    if (beacon && navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
    } else {
        fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
    }
};

const VisitorTracker = () => {
    const location = useLocation();
    const lastTick = useRef(Date.now());
    const accumulated = useRef(0);

    // Sayfa görüntüleme (her rota değişiminde)
    useEffect(() => {
        const path = location.pathname;
        if (!shouldTrack(path)) return;
        let newSession = false;
        try {
            if (!sessionStorage.getItem('ceylanme_session')) {
                sessionStorage.setItem('ceylanme_session', '1');
                newSession = true;
            }
        } catch (e) { /* yoksay */ }
        send({ vid: getVid(), type: 'hit', path, newSession });
    }, [location.pathname]);

    // Sitede geçirilen süre: yalnızca sekme görünürken sayılır, 30 sn'de bir gönderilir
    useEffect(() => {
        const flush = (beacon) => {
            const path = window.location.pathname;
            if (!shouldTrack(path) || accumulated.current < 1) return;
            send({ vid: getVid(), type: 'ping', seconds: Math.round(accumulated.current) }, beacon);
            accumulated.current = 0;
        };
        const tick = () => {
            const now = Date.now();
            if (document.visibilityState === 'visible') {
                accumulated.current += Math.min((now - lastTick.current) / 1000, 35);
            }
            lastTick.current = now;
        };
        const interval = setInterval(() => { tick(); if (accumulated.current >= 30) flush(false); }, 5000);
        const onVis = () => {
            tick();
            if (document.visibilityState === 'hidden') flush(true);
        };
        document.addEventListener('visibilitychange', onVis);
        window.addEventListener('pagehide', onVis);
        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', onVis);
            window.removeEventListener('pagehide', onVis);
        };
    }, []);

    return null;
};

export default VisitorTracker;
