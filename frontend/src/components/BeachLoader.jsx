import React from 'react';

// Palmiyeli, güneşli, dalgalı küçük bir tatil sahnesi (saf SVG + CSS, ek paket yok)
const BeachLoader = ({ label = 'Yazı Yükleniyor' }) => (
    <div className="beach-loader" role="status" aria-live="polite">
        <style>{`
            .beach-loader { text-align: center; max-width: 560px; width: 100%; }
            .beach-scene { width: 100%; height: auto; display: block; margin: 0 auto 26px; overflow: visible; filter: drop-shadow(0 18px 30px rgba(163,72,40,.18)); }
            .bl-glow { transform-origin: 250px 62px; animation: bl-glow 3.6s ease-in-out infinite; }
            .bl-bird { animation: bl-fly 7s ease-in-out infinite alternate; }
            .bl-bird-2 { animation-duration: 9s; animation-direction: alternate-reverse; }
            .bl-spark { animation: bl-twinkle 2.2s ease-in-out infinite; }
            .bl-spark:nth-of-type(2n) { animation-delay: .7s; }
            .bl-spark:nth-of-type(3n) { animation-delay: 1.3s; }
            .bl-bar { height: 3px; width: 160px; margin: 16px auto 0; border-radius: 3px; background: rgba(26,25,24,.08); overflow: hidden; }
            .bl-bar::after { content: ''; display: block; height: 100%; width: 45%; border-radius: 3px; background: linear-gradient(90deg, transparent, #A34828, transparent); animation: bl-slide 1.6s ease-in-out infinite; }
            @keyframes bl-glow { 0%,100% { transform: scale(1); opacity: .55; } 50% { transform: scale(1.35); opacity: .2; } }
            @keyframes bl-fly { from { transform: translate(-16px, 4px); } to { transform: translate(22px, -6px); } }
            @keyframes bl-twinkle { 0%,100% { opacity: 0; } 50% { opacity: .9; } }
            @keyframes bl-slide { from { transform: translateX(-110%); } to { transform: translateX(260%); } }
            .bl-sun-rays { transform-origin: 250px 62px; animation: bl-spin 14s linear infinite; }
            .bl-sun { transform-origin: 250px 62px; animation: bl-pulse 2.6s ease-in-out infinite; }
            .bl-cloud-a { animation: bl-drift 9s ease-in-out infinite alternate; }
            .bl-cloud-b { animation: bl-drift 12s ease-in-out infinite alternate-reverse; }
            .bl-palm-leaves { transform-origin: 96px 78px; animation: bl-sway 3.2s ease-in-out infinite alternate; }
            .bl-boat { animation: bl-bob 2.4s ease-in-out infinite; transform-origin: 190px 128px; }
            .bl-wave-1 { animation: bl-wave 3.4s ease-in-out infinite alternate; }
            .bl-wave-2 { animation: bl-wave 2.6s ease-in-out infinite alternate-reverse; }
            .bl-dot { display: inline-block; animation: bl-dot 1.2s ease-in-out infinite; }
            .bl-dot:nth-child(2) { animation-delay: .18s; }
            .bl-dot:nth-child(3) { animation-delay: .36s; }
            @keyframes bl-spin { to { transform: rotate(360deg); } }
            @keyframes bl-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
            @keyframes bl-drift { from { transform: translateX(-10px); } to { transform: translateX(14px); } }
            @keyframes bl-sway { from { transform: rotate(-5deg); } to { transform: rotate(5deg); } }
            @keyframes bl-bob { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-4px) rotate(2deg); } }
            @keyframes bl-wave { from { transform: translateX(-14px); } to { transform: translateX(14px); } }
            @keyframes bl-dot { 0%,80%,100% { opacity: .2; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
            @media (prefers-reduced-motion: reduce) {
                .beach-loader * { animation: none !important; }
            }
        `}</style>

        <svg className="beach-scene" viewBox="0 0 320 190" aria-hidden="true">
            <defs>
                <linearGradient id="bl-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FBE3C4" />
                    <stop offset="100%" stopColor="#FBF9F5" />
                </linearGradient>
                <linearGradient id="bl-sea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6FB7C4" />
                    <stop offset="100%" stopColor="#3E8FA3" />
                </linearGradient>
                <clipPath id="bl-clip"><rect x="0" y="0" width="320" height="190" rx="10" /></clipPath>
            </defs>

            <g clipPath="url(#bl-clip)">
                <rect width="320" height="190" fill="url(#bl-sky)" />

                {/* Güneş */}
                <circle className="bl-glow" cx="250" cy="62" r="34" fill="#F7C873" />
                <g className="bl-sun-rays" stroke="#E9A23B" strokeWidth="3" strokeLinecap="round">
                    {[...Array(12)].map((_, i) => (
                        <line key={i} x1="250" y1="26" x2="250" y2="16" transform={`rotate(${i * 30} 250 62)`} />
                    ))}
                </g>
                <circle className="bl-sun" cx="250" cy="62" r="24" fill="#F4B942" />

                {/* Bulutlar */}
                <g className="bl-cloud-a" fill="#FFFFFF" opacity=".95">
                    <ellipse cx="60" cy="40" rx="22" ry="9" />
                    <ellipse cx="78" cy="35" rx="14" ry="9" />
                </g>
                <g className="bl-cloud-b" fill="#FFFFFF" opacity=".8">
                    <ellipse cx="170" cy="26" rx="18" ry="7" />
                    <ellipse cx="184" cy="22" rx="11" ry="7" />
                </g>

                {/* Kuşlar */}
                <g className="bl-bird" fill="none" stroke="#1A1918" strokeWidth="1.6" strokeLinecap="round" opacity=".6">
                    <path d="M130 52 q5 -6 10 0 q5 -6 10 0" />
                    <path d="M152 66 q4 -5 8 0 q4 -5 8 0" />
                </g>
                <g className="bl-bird bl-bird-2" fill="none" stroke="#1A1918" strokeWidth="1.4" strokeLinecap="round" opacity=".45">
                    <path d="M20 70 q4 -5 8 0 q4 -5 8 0" />
                </g>

                {/* Deniz */}
                <rect y="112" width="320" height="78" fill="url(#bl-sea)" />
                <g className="bl-wave-1" fill="none" stroke="#FFFFFF" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round">
                    <path d="M-20 124 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" />
                </g>
                <g className="bl-wave-2" fill="none" stroke="#FFFFFF" strokeOpacity=".4" strokeWidth="2" strokeLinecap="round">
                    <path d="M-20 140 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" />
                </g>

                {/* Yelkenli */}
                <g className="bl-boat">
                    <path d="M172 128 h36 l-6 9 h-24 z" fill="#A34828" />
                    <line x1="190" y1="128" x2="190" y2="96" stroke="#1A1918" strokeWidth="2" />
                    <path d="M192 98 l16 26 h-16 z" fill="#FBF9F5" />
                    <path d="M188 104 l-12 20 h12 z" fill="#F4B942" />
                </g>

                {/* Kumsal */}
                <path d="M0 190 V158 Q70 138 150 158 T320 160 V190 Z" fill="#F2D9A8" />
                <path d="M0 190 V172 Q80 158 160 172 T320 172 V190 Z" fill="#E8C98B" />

                {/* Palmiye */}
                <path d="M96 160 Q90 120 98 80" fill="none" stroke="#7A4B2A" strokeWidth="6" strokeLinecap="round" />
                <g className="bl-palm-leaves" fill="#2F8F5B">
                    <path d="M96 78 Q60 62 36 82 Q64 74 96 82 Z" />
                    <path d="M96 78 Q70 48 44 50 Q70 60 96 80 Z" />
                    <path d="M96 78 Q96 46 112 34 Q106 58 98 80 Z" fill="#3BA06A" />
                    <path d="M96 78 Q128 52 154 58 Q128 66 98 82 Z" />
                    <path d="M96 78 Q130 74 148 92 Q122 84 96 84 Z" fill="#3BA06A" />
                    <circle cx="94" cy="84" r="3.5" fill="#6B3E1F" />
                    <circle cx="101" cy="86" r="3.5" fill="#6B3E1F" />
                </g>
            </g>
        </svg>

        <div className="font-mono text-sm sm:text-base text-[#A34828] uppercase tracking-[0.3em]">
            {label.replace(/\.+$/, '')}
            <span aria-hidden="true">
                <span className="bl-dot">.</span><span className="bl-dot">.</span><span className="bl-dot">.</span>
            </span>
        </div>
        <div className="bl-bar" aria-hidden="true" />
    </div>
);

export default BeachLoader;
