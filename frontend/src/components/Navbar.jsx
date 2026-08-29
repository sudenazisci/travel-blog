import React, { useEffect, useState, useRef } from 'react';
import API_BASE from '../api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const [siteTitle, setSiteTitle] = useState('Ceylan.m.e.');
    const [destinations, setDestinations] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openRegionId, setOpenRegionId] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 15) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenRegionId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const orderedRegions = ['TÜRKİYE', 'AFRİKA', 'ASYA', 'AVRUPA', 'GÜNEY AMERİKA', 'KUZEY AMERİKA'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsRes, destRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/settings`),
                    axios.get(`${API_BASE}/api/destinations`)
                ]);

                if (settingsRes.data.siteTitle) setSiteTitle(settingsRes.data.siteTitle);
                setDestinations(destRes.data);
            } catch (err) { 
                console.error('Navbar fetch error:', err); 
            }
        };
        fetchData();
    }, []);

    const getChildren = (parentId) => destinations.filter(d => (d.parent && (d.parent === parentId || d.parent._id === parentId)));
    const dbRegions = destinations.filter(d => d.isRegion || !d.parent);

    const regionMenuItems = orderedRegions.map(name => {
        return dbRegions.find(d => 
            d.name.trim().toUpperCase() === name.trim().toUpperCase() ||
            d.name.replace(/[Iİiı]/g, 'i').toLowerCase() === name.replace(/[Iİiı]/g, 'i').toLowerCase()
        );
    }).filter(Boolean);

    dbRegions.forEach(d => {
        if (!regionMenuItems.some(r => r._id === d._id)) {
            regionMenuItems.push(d);
        }
    });

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <header className={`sticky top-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white/95 backdrop-blur-md border-b border-[#1A1918]/15 py-2 shadow-xs' 
                    : 'bg-white border-b border-[#1A1918]/15 py-3'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12" ref={dropdownRef}>
                    
                    {/* Left: Clean Logo Image (Without double text) */}
                    <Link to="/" className="flex items-center shrink-0 group min-h-[44px]">
                        <img 
                            src="/logo.png" 
                            alt={siteTitle} 
                            className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                        />
                    </Link>

                    {/* Center: Region Links with Hover & Click City Panels */}
                    <nav className="hidden lg:flex items-center space-x-5 shrink-0">
                        {regionMenuItems.map((region, idx) => {
                            if (!region._id) return null;
                            const children = getChildren(region._id);
                            const hasChildren = children.length > 0;
                            const isRegionActive = location.pathname.includes(region._id);
                            const isOpen = openRegionId === region._id;

                            return (
                                <div
                                    key={region._id || idx}
                                    className="relative group py-2"
                                    onMouseEnter={() => setOpenRegionId(region._id)}
                                    onMouseLeave={() => setOpenRegionId(null)}
                                >
                                    <button
                                        onClick={() => {
                                            if (isOpen) setOpenRegionId(null);
                                            else setOpenRegionId(region._id);
                                            navigate(`/destination/${region._id}`);
                                        }}
                                        className={`font-mono text-[11px] font-bold uppercase tracking-wider transition-colors py-1 flex items-center gap-1 cursor-pointer ${
                                            isRegionActive 
                                                ? 'text-[#A34828] border-b-2 border-[#A34828]' 
                                                : 'text-[#1A1918] hover:text-[#A34828]'
                                        }`}
                                    >
                                        <span>{region.name}</span>
                                        {hasChildren && <ChevronDown size={11} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#A34828]' : ''}`} />}
                                    </button>

                                    {/* City Panel Dropdown */}
                                    <AnimatePresence>
                                        {(isOpen && hasChildren) && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute top-full left-0 min-w-[200px] bg-white border border-[#1A1918]/15 shadow-xl z-50 p-2 space-y-1"
                                            >
                                                <div className="font-mono text-[9px] font-bold text-[#A34828] uppercase tracking-widest px-2.5 py-1 border-b border-[#1A1918]/10 mb-1">
                                                    {region.name} ŞEHİRLERİ
                                                </div>
                                                {children.map(child => (
                                                    <Link
                                                        key={child._id}
                                                        to={`/destination/${child._id}`}
                                                        onClick={() => setOpenRegionId(null)}
                                                        className="block px-2.5 py-1.5 font-mono text-[11px] text-[#1A1918] hover:text-[#A34828] hover:bg-[#F4F0E8] transition-colors uppercase tracking-wider"
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                                <Link
                                                    to={`/destination/${region._id}`}
                                                    onClick={() => setOpenRegionId(null)}
                                                    className="block px-2.5 py-1.5 font-mono text-[10px] font-bold text-[#A34828] hover:bg-[#F4F0E8] transition-colors uppercase tracking-wider border-t border-[#1A1918]/10 mt-1"
                                                >
                                                    Tüm {region.name} Rehberleri →
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}

                        <Link 
                            to="/destinations" 
                            className={`font-mono text-[11px] font-bold uppercase tracking-wider transition-colors py-1 ${
                                isActive('/destinations') ? 'text-[#A34828] border-b-2 border-[#A34828]' : 'text-[#1A1918] hover:text-[#A34828]'
                            }`}
                        >
                            TÜM ROTALAR
                        </Link>
                    </nav>

                    {/* Right Info Links: Ana Sayfa + Hakkımda + İletişim */}
                    <div className="hidden lg:flex items-center space-x-4 shrink-0 font-mono text-[11px] font-bold uppercase tracking-wider">
                        <Link 
                            to="/" 
                            className={`transition-colors py-1 ${
                                isActive('/') ? 'text-[#A34828]' : 'text-[#1A1918] hover:text-[#A34828]'
                            }`}
                        >
                            ANA SAYFA
                        </Link>
                        <Link 
                            to="/about" 
                            className={`transition-colors py-1 ${
                                isActive('/about') ? 'text-[#A34828]' : 'text-[#1A1918] hover:text-[#A34828]'
                            }`}
                        >
                            HAKKIMDA
                        </Link>
                        <Link 
                            to="/contact" 
                            className={`transition-colors py-1 ${
                                isActive('/contact') ? 'text-[#A34828]' : 'text-[#1A1918] hover:text-[#A34828]'
                            }`}
                        >
                            İLETİŞİM
                        </Link>
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="w-10 h-10 flex items-center justify-center text-[#1A1918] hover:text-[#A34828] transition-colors focus:outline-none touch-manipulation"
                            aria-label={isMobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
                        >
                            {isMobileMenuOpen ? (
                                <X size={22} strokeWidth={1.8} />
                            ) : (
                                <Menu size={22} strokeWidth={1.8} />
                            )}
                        </button>
                    </div>

                </div>
            </header>

            {/* Mobile Drawer Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[9999] lg:hidden flex flex-col bg-white">
                        <div className="p-4 border-b border-[#1A1918]/15 flex items-center justify-between">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                                <img src="/logo.png" alt="Ceylan.m.e." className="h-8 w-auto object-contain" />
                            </Link>
                            <button 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-9 h-9 flex items-center justify-center text-[#1A1918] border border-[#1A1918]/20"
                                aria-label="Menüyü Kapat"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
                        >
                            <div>
                                <span className="font-mono text-[10px] font-bold text-[#A34828] uppercase tracking-[0.2em] block mb-3">
                                    BÖLGELER & ŞEHİRLER
                                </span>
                                <div className="space-y-4">
                                    {regionMenuItems.map((region) => {
                                        const children = getChildren(region._id);
                                        return (
                                            <div key={region._id || region.name} className="space-y-1">
                                                <Link
                                                    to={`/destination/${region._id}`}
                                                    className="block font-serif text-xl font-bold text-[#1A1918] hover:text-[#A34828]"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {region.name}
                                                </Link>
                                                {children.length > 0 && (
                                                    <div className="pl-3 border-l border-[#1A1918]/15 space-y-1">
                                                        {children.map(child => (
                                                            <Link
                                                                key={child._id}
                                                                to={`/destination/${child._id}`}
                                                                className="block font-mono text-xs text-[#4A4744] hover:text-[#A34828]"
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                            >
                                                                {child.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[#1A1918]/15 space-y-3">
                                <span className="font-mono text-[10px] font-bold text-[#A34828] uppercase tracking-[0.2em] block mb-2">
                                    MENÜ
                                </span>
                                <Link 
                                    to="/" 
                                    className="block font-mono text-xs font-bold text-[#1A1918] uppercase tracking-widest hover:text-[#A34828]"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    ANA SAYFA
                                </Link>
                                <Link 
                                    to="/destinations" 
                                    className="block font-mono text-xs font-bold text-[#1A1918] uppercase tracking-widest hover:text-[#A34828]"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    TÜM ROTALAR
                                </Link>
                                <Link 
                                    to="/about" 
                                    className="block font-mono text-xs font-bold text-[#1A1918] uppercase tracking-widest hover:text-[#A34828]"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    HAKKIMDA
                                </Link>
                                <Link 
                                    to="/contact" 
                                    className="block font-mono text-xs font-bold text-[#1A1918] uppercase tracking-widest hover:text-[#A34828]"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    İLETİŞİM
                                </Link>
                            </div>
                        </motion.div>

                        <div className="p-4 border-t border-[#1A1918]/15 flex items-center justify-between font-mono text-[9px] uppercase text-[#78746D]">
                            <span>© 2026 Ceylan.m.e.</span>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
