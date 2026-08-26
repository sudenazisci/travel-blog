import React, { useEffect, useRef, useState } from 'react';

// Authentic travel words from Ceylan.m.e
const TRAVEL_WORDS = [
    'İstanbul', 'Tokyo', 'Kapadokya', 'Roma', 'Paris', 'Prag', 'Busan',
    'Budapeşte', 'Viyana', 'Seyahat', 'Rota', 'Keşfet', 'Yolculuk',
    'Anı', 'Hikâye', 'Kültür', 'Gezi', 'Doğa', 'Miras', 'Ufuk', 'Yol'
];

const ACCENT_COLORS = ['#c25e36', '#e07a5f'];
const BASE_COLORS = ['#1c1917', '#292524', '#3f3f46', '#44403c'];

const LetterPhysicsCanvas = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const isVisibleRef = useRef(false);
    const strandsRef = useRef([]);
    const mouseRef = useRef({
        x: -9999,
        y: -9999,
        prevX: -9999,
        prevY: -9999,
        vx: 0,
        vy: 0,
        isHovering: false
    });
    const rafIdRef = useRef(null);
    const timeRef = useRef(0);
    const entranceProgressRef = useRef(0);
    const startTimeRef = useRef(null);

    const [isReducedMotion, setIsReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setIsReducedMotion(mediaQuery.matches);
        const handleChange = (e) => setIsReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d', { alpha: true });

        // Generate vertical hanging text strands in a narrow, tall composition
        const createStrands = (width, height) => {
            const isMobile = width < 640;
            // Narrow vertical composition: width 280-360px on desktop, 220-260px on mobile
            const curtainWidth = isMobile ? Math.min(width * 0.85, 260) : Math.min(width * 0.42, 340);
            const numStrands = isMobile ? 18 : 32;
            const startX = (width - curtainWidth) / 2;
            const spacing = curtainWidth / (numStrands - 1);

            const strands = [];

            for (let i = 0; i < numStrands; i++) {
                const anchorX = startX + i * spacing;
                // Subtle organic top offset
                const anchorY = 25 + (Math.sin(i * 0.8) * 6 + (Math.random() - 0.5) * 8);

                // Organic length: longer in middle, shorter on edges, with natural jitter
                const normalizedCenter = 1 - Math.abs((i / (numStrands - 1)) - 0.5) * 2;
                const baseLength = isMobile ? 220 : 320;
                const lengthVariation = (normalizedCenter * 70) + ((Math.random() - 0.5) * 50);
                const totalLength = Math.max(160, baseLength + lengthVariation);

                // Stack small vertical words along the strand length
                const words = [];
                let currentY = 0;
                let wordIdx = i;

                while (currentY < totalLength) {
                    const word = TRAVEL_WORDS[wordIdx % TRAVEL_WORDS.length];
                    wordIdx++;
                    const isAccent = Math.random() < 0.08; // 8% warm terracotta
                    const color = isAccent 
                        ? ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)]
                        : BASE_COLORS[Math.floor(Math.random() * BASE_COLORS.length)];
                    
                    const fontSize = isMobile ? 8 : 9.5;
                    const opacity = 0.42 + Math.random() * 0.46; // 0.42 - 0.88

                    words.push({
                        text: word,
                        yOffset: currentY,
                        color,
                        isAccent,
                        fontSize,
                        opacity
                    });

                    currentY += fontSize + 5; // vertical word gap
                }

                strands.push({
                    id: i,
                    anchorX,
                    anchorY,
                    length: totalLength,
                    words,
                    angle: 0,
                    angularVelocity: 0,
                    // Natural idle pendulum wave properties
                    idleSpeed: 0.0016 + Math.random() * 0.0018,
                    idleAmplitude: 0.024 + Math.random() * 0.02, // in radians (~1.5 - 2.5 degrees)
                    phase: i * 0.35 + Math.random() * 0.5,
                    damping: 0.945 + (Math.random() * 0.015),
                    stiffness: 0.045 + (Math.random() * 0.012)
                });
            }

            return strands;
        };

        const handleResize = () => {
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const w = Math.floor(rect.width);
            // Composition is taller than wide: height 440px on desktop, 360px on mobile
            const h = w < 640 ? 360 : 440;

            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.scale(dpr, dpr);

            strandsRef.current = createStrands(w, h);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        // Viewport intersection observer
        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisibleRef.current = entry.isIntersecting;
                if (entry.isIntersecting && !startTimeRef.current) {
                    startTimeRef.current = performance.now();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(container);

        // 60FPS Physics Loop
        const animate = (timestamp) => {
            rafIdRef.current = requestAnimationFrame(animate);

            if (!isVisibleRef.current) return;

            const w = parseFloat(canvas.style.width) || canvas.width;
            const h = parseFloat(canvas.style.height) || canvas.height;

            ctx.clearRect(0, 0, w, h);

            timeRef.current += 1;

            // Entrance fade & drop
            if (startTimeRef.current) {
                const elapsed = timestamp - startTimeRef.current;
                entranceProgressRef.current = Math.min(elapsed / 900, 1);
            }

            const entranceFactor = entranceProgressRef.current;
            const entranceDrop = (1 - entranceFactor) * -22;

            // Calculate Mouse Velocity
            const mouse = mouseRef.current;
            if (mouse.prevX !== -9999) {
                mouse.vx = (mouse.x - mouse.prevX) * 0.45;
                mouse.vy = (mouse.y - mouse.prevY) * 0.45;
            }
            mouse.prevX = mouse.x;
            mouse.prevY = mouse.y;

            const strands = strandsRef.current;

            for (let i = 0; i < strands.length; i++) {
                const strand = strands[i];

                // 1. Natural Idle Sway (Gentle individual breeze)
                const idleAngle = Math.sin(timeRef.current * strand.idleSpeed + strand.phase) * strand.idleAmplitude;

                // 2. Cursor Wind Force
                if (mouse.isHovering) {
                    const dx = mouse.x - strand.anchorX;
                    const dy = mouse.y - strand.anchorY;
                    const dist = Math.hypot(dx, dy);
                    const influenceRadius = 140;

                    if (dist < influenceRadius && dy > -10 && dy < strand.length + 30) {
                        const proximity = (1 - dist / influenceRadius);
                        // Wind force pushed by cursor direction & velocity
                        const windDirection = mouse.vx !== 0 ? Math.sign(mouse.vx) : Math.sign(dx || 1);
                        const velocityBoost = Math.min(Math.abs(mouse.vx) * 0.008, 0.08);
                        const impulse = (windDirection * (0.035 + velocityBoost) * proximity);

                        strand.angularVelocity += impulse;
                    }
                }

                // 3. True Pendulum Physics with Spring Restoring Force & Damping
                const restoringForce = (idleAngle - strand.angle) * strand.stiffness;
                strand.angularVelocity += restoringForce;
                strand.angularVelocity *= strand.damping;
                strand.angle += strand.angularVelocity;

                // Cap max angle to stay elegant
                strand.angle = Math.max(-0.25, Math.min(0.25, strand.angle));

                // 4. Render Strand of Vertical Hanging Words
                ctx.save();
                ctx.translate(strand.anchorX, strand.anchorY + entranceDrop);
                ctx.rotate(strand.angle);
                ctx.globalAlpha = entranceFactor;

                // Very faint top anchor suspension dot
                ctx.fillStyle = '#c25e36';
                ctx.globalAlpha = entranceFactor * 0.35;
                ctx.beginPath();
                ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
                ctx.fill();

                // Draw each word vertically down the string
                for (let j = 0; j < strand.words.length; j++) {
                    const item = strand.words[j];
                    ctx.font = `600 ${item.fontSize}px 'Plus Jakarta Sans', sans-serif`;
                    ctx.fillStyle = item.color;
                    ctx.globalAlpha = entranceFactor * item.opacity;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';

                    ctx.fillText(item.text, 0, item.yOffset);
                }

                ctx.restore();
            }
        };

        rafIdRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
        };
    }, []);

    // Pointer events (Mouse)
    const handlePointerMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
        mouseRef.current.isHovering = true;
    };

    const handlePointerLeave = () => {
        mouseRef.current.isHovering = false;
        mouseRef.current.x = -9999;
        mouseRef.current.y = -9999;
        mouseRef.current.prevX = -9999;
        mouseRef.current.prevY = -9999;
    };

    // Touch events (Mobile swipe wind)
    const handleTouchMove = (e) => {
        if (!containerRef.current || !e.touches[0]) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current.x = e.touches[0].clientX - rect.left;
        mouseRef.current.y = e.touches[0].clientY - rect.top;
        mouseRef.current.isHovering = true;
    };

    const handleTouchEnd = () => {
        handlePointerLeave();
    };

    if (isReducedMotion) {
        return (
            <section className="py-14 sm:py-18 bg-[#faf8f5] border-t border-[#ede8e1] text-center select-none">
                <div className="max-w-xl mx-auto px-4">
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-[#c25e36] uppercase font-mono block mb-2">
                        HAREKETTEKİ HİKÂYELER
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#1c1917] tracking-tight mb-2">
                        Her Yolculuk Bir İz Bırakır.
                    </h2>
                    <p className="text-stone-500 font-light text-xs sm:text-sm max-w-sm mx-auto mb-8">
                        “Rotadan geriye bazen bir fotoğraf, bazen bir kelime kalır.”
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section 
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="py-14 sm:py-20 bg-[#faf8f5] border-t border-[#ebe5df] text-center relative overflow-hidden select-none touch-pan-y"
        >
            {/* Editorial Heading */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10 mb-4 sm:mb-6 pointer-events-none">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] text-[#c25e36] uppercase font-mono block mb-2 animate-fadeIn">
                    HAREKETTEKİ HİKÂYELER
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1c1917] font-normal tracking-tight mb-2.5">
                    Her Yolculuk Bir İz Bırakır.
                </h2>
                <p className="text-stone-600 font-light text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                    “Rotadan geriye bazen bir fotoğraf, bazen bir kelime kalır.”
                </p>
            </div>

            {/* Centered Narrow Vertical Letter Curtain Canvas (Taller than wide) */}
            <div className="relative w-full max-w-xl mx-auto flex items-center justify-center cursor-default">
                <canvas 
                    ref={canvasRef} 
                    className="block w-full max-w-full"
                />
            </div>

            {/* Minimal Travel Waypoint Accents */}
            <div className="max-w-xs mx-auto mt-4 text-stone-300 pointer-events-none select-none">
                <svg width="120" height="10" viewBox="0 0 120 10" fill="none" className="mx-auto opacity-45">
                    <circle cx="5" cy="5" r="2" fill="#c25e36" />
                    <path d="M8 5 H112" stroke="#ded7cb" strokeWidth="1" strokeDasharray="3 3" />
                    <circle cx="115" cy="5" r="2" fill="#c25e36" />
                </svg>
            </div>
        </section>
    );
};

export default LetterPhysicsCanvas;
