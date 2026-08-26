import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import axios from 'axios';

/**
 * Reusable Google AdSense-compliant AdSlot component
 * Variants: 'article-top' | 'article-middle' | 'article-bottom' | 'sidebar' | 'listing-inline'
 */
const AdSlot = ({ 
    variant = 'article-middle', 
    slotId = '', 
    format = 'auto', 
    responsive = 'true',
    className = '' 
}) => {
    const [adSenseId, setAdSenseId] = useState('');
    const [hasMarketingConsent, setHasMarketingConsent] = useState(false);

    useEffect(() => {
        // 1. Fetch site settings to see if Google AdSense is enabled
        axios.get(`${API_BASE}/api/settings`)
            .then(res => {
                if (res.data?.googleAdSenseId) {
                    setAdSenseId(res.data.googleAdSenseId);
                }
            })
            .catch(() => {});

        // 2. Check Cookie Consent
        const checkConsent = () => {
            const raw = localStorage.getItem('cookie_consent_preferences');
            if (raw) {
                try {
                    const prefs = JSON.parse(raw);
                    setHasMarketingConsent(!!prefs.marketing);
                } catch {
                    setHasMarketingConsent(false);
                }
            } else if (localStorage.getItem('cookie_consent') === 'accepted') {
                setHasMarketingConsent(true);
            } else {
                setHasMarketingConsent(false);
            }
        };

        checkConsent();
        window.addEventListener('cookie_consent_updated', checkConsent);
        return () => window.removeEventListener('cookie_consent_updated', checkConsent);
    }, []);

    // Push adsbygoogle if AdSense is initialized & consent is granted
    useEffect(() => {
        if (adSenseId && hasMarketingConsent && slotId) {
            try {
                ((window.adsbygoogle = window.adsbygoogle || []).push({}));
            } catch (e) {
                console.debug('AdSense unit load:', e);
            }
        }
    }, [adSenseId, hasMarketingConsent, slotId]);

    // Container sizing based on variant
    const getVariantClasses = () => {
        switch (variant) {
            case 'article-top':
                return 'w-full my-6 min-h-[90px] max-w-4xl mx-auto';
            case 'article-middle':
                return 'w-full my-8 min-h-[250px] max-w-3xl mx-auto';
            case 'article-bottom':
                return 'w-full my-8 min-h-[250px] max-w-4xl mx-auto';
            case 'sidebar':
                return 'w-full my-4 min-h-[250px] max-w-[320px] mx-auto';
            case 'listing-inline':
                return 'w-full my-6 min-h-[120px]';
            default:
                return 'w-full my-4 min-h-[90px]';
        }
    };

    // If real AdSense is configured and user consented to marketing cookies:
    if (adSenseId && hasMarketingConsent && slotId) {
        return (
            <div className={`ad-container relative my-6 text-center overflow-hidden ${getVariantClasses()} ${className}`}>
                <span className="block text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-1">
                    REKLAM
                </span>
                <ins
                    className="adsbygoogle block"
                    style={{ display: 'block' }}
                    data-ad-client={adSenseId}
                    data-ad-slot={slotId}
                    data-ad-format={format}
                    data-full-width-responsive={responsive}
                />
            </div>
        );
    }

    // Safe, non-intrusive placeholder container (Ensures layout stability without fake deceptive ads)
    return (
        <div className={`ad-slot-placeholder rounded-xl border border-dashed border-[#ded7cb] bg-[#faf8f5]/60 p-4 text-center flex flex-col items-center justify-center relative overflow-hidden ${getVariantClasses()} ${className}`}>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 font-bold mb-1">
                REKLAM ALANI
            </span>
            <p className="text-[11px] text-stone-400 font-light font-mono max-w-xs">
                Google AdSense veya Sponsorluk Alanı
            </p>
        </div>
    );
};

export default AdSlot;
