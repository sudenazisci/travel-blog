import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Map, Globe, Info, Menu, X, ChevronRight, Compass } from 'lucide-react';

const Navbar = () => {
    const [siteTitle, setSiteTitle] = useState('Ceylan.m.e.');
    const [destinations, setDestinations] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Specific regions ordered as requested (or by logical group)
    // TÜRKiYE, ASYA, AVRUPA, GÜNEY AMERİKA, KUZEY AMERİKA
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
            } catch (err) { console.error(err); }
        };
        fetchData();
    }, []);

    const getChildren = (parentId) => destinations.filter(d => d.parent === parentId || (d.parent && d.parent._id === parentId));

    // Find the actual destination objects for the ordered regions
    const regionMenuItems = orderedRegions.map(name => {
        return destinations.find(d => d.name.toUpperCase() === name) || { name, _id: null, isPlaceholder: true };
    }).filter(d => !d.isPlaceholder || d.name); // Keep placeholders if we want to show empty ones? For now, let's just use what we find + placeholders if missing (but user script should have created them)

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-serif font-bold text-gray-900 tracking-tighter hover:text-accent transition-colors relative z-50">
                        {siteTitle}
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex h-full items-center space-x-6">
                        {/* Standard Links - Left */}


                        {/* Regional Links - Center */}
                        {regionMenuItems.map((region, idx) => {
                            if (!region._id) return null; // Skip if not found in DB yet

                            const children = getChildren(region._id);
                            const hasChildren = children.length > 0;

                            return (
                                <div
                                    key={region._id || idx}
                                    className="relative h-full flex items-center group"
                                    onMouseEnter={() => setOpenMenuId(region._id)}
                                // onMouseLeave={() => setOpenMenuId(null)} // Often better UX to rely on CSS :hover for menu visibility or delay hide
                                >
                                    <Link
                                        to={`/destination/${region._id}`}
                                        className="py-2 text-sm font-bold uppercase tracking-wider text-gray-700 group-hover:text-accent transition-colors flex items-center gap-1 border-b-2 border-transparent group-hover:border-accent"
                                    >
                                        {region.name}
                                    </Link>

                                    {/* Mega Menu Dropdown */}
                                    {hasChildren && (
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-64 bg-white shadow-xl rounded-b-xl border-t-2 border-accent opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-40">
                                            <div className="py-2 max-h-[400px] overflow-y-auto">
                                                {children.map(child => (
                                                    <Link
                                                        key={child._id}
                                                        to={`/destination/${child._id}`}
                                                        className="block px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-accent transition-colors text-sm font-medium border-l-4 border-transparent hover:border-accent"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            {child.name}
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-sm font-bold uppercase tracking-wider text-gray-700 hover:text-accent transition-colors">ANASAYFA</Link>
                        <Link to="/destinations" className="text-sm font-bold uppercase tracking-wider text-gray-700 hover:text-accent transition-colors">ROTALAR</Link>
                        <Link to="/about" className="text-sm font-bold uppercase tracking-wider text-gray-700 hover:text-accent transition-colors">HAKKIMDA</Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-900 hover:text-amber-600 transition-colors focus:outline-none"
                            aria-label="Menüyü Aç"
                        >
                            {isMobileMenuOpen ? (
                                <X size={24} strokeWidth={1.5} />
                            ) : (
                                <Menu size={24} strokeWidth={1.5} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

        </nav>

        {/* Mobile Menu Dropdown - PREMIUM FULL SCREEN DRAWER */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[9999] md:hidden">
                    {/* Backdrop with High Blur */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
                        onClick={() => setIsMobileMenuOpen(false)} 
                    />

                    {/* Drawer Panel - Refined Compact Design */}
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200, mass: 1 }}
                        className="absolute right-0 top-0 bottom-0 w-[75%] max-w-[280px] bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden border-l border-gray-100"
                    >
                        {/* Interactive Background Elements - Minimal */}
                        <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none -mr-32 -mt-32">
                            <Compass size={400} className="text-slate-900" />
                        </div>

                        {/* Integrated Header */}
                        <div className="relative z-20 px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif font-black text-slate-900 tracking-tighter">
                                {siteTitle}
                            </Link>
                            <button 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all border border-gray-100"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <motion.div 
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                                hidden: {}
                            }}
                            className="px-5 py-6 flex-grow overflow-y-auto space-y-6 relative z-10"
                        >
                            {/* Ana Menü Section */}
                            <motion.div variants={{ hidden: { opacity: 0, x: 10 }, visible: { opacity: 1, x: 0 } }}>
                                <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4 opacity-70">Menü</p>
                                <div className="space-y-2">
                                    <Link to="/" 
                                        className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-amber-50 rounded-xl transition-all group"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-amber-100 transition-colors">
                                            <Home size={14} className="text-amber-600" />
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-800">ANASAYFA</span>
                                        <ChevronRight size={12} className="ml-auto text-slate-300" />
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Regional Section */}
                            <motion.div variants={{ hidden: { opacity: 0, x: 10 }, visible: { opacity: 1, x: 0 } }}>
                                <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4 opacity-70">Kategoriler</p>
                                <div className="grid grid-cols-1 gap-1">
                                    {regionMenuItems.map((region) => (
                                        <Link
                                            key={region._id || region.name}
                                            to={`/destination/${region._id}`}
                                            className="flex items-center gap-3 py-2.5 px-3 hover:bg-slate-50 rounded-xl transition-all group"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-100">
                                                <Globe size={14} className="text-slate-400 group-hover:text-amber-600" />
                                            </div>
                                            <span className="text-[13px] font-bold text-slate-700 tracking-wide uppercase">{region.name}</span>
                                            <ChevronRight size={12} className="ml-auto text-slate-200 opacity-0 group-hover:opacity-100 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>

                            {/* General Links */}
                            <motion.div 
                                variants={{ hidden: { opacity: 0, x: 10 }, visible: { opacity: 1, x: 0 } }}
                                className="space-y-2 pt-4 border-t border-gray-50"
                            >
                                <Link to="/destinations" 
                                    className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all group"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-amber-100/50 transition-all border border-transparent group-hover:border-amber-100">
                                        <Map size={14} className="text-slate-500 group-hover:text-amber-600" />
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">ROTALAR</span>
                                </Link>
                                <Link to="/about" 
                                    className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all group"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-amber-100/50 transition-all border border-transparent group-hover:border-amber-100">
                                        <Info size={14} className="text-slate-500 group-hover:text-amber-600" />
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-800 uppercase tracking-wide">HAKKIMDA</span>
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Social Footer in Menu - Refined */}
                        <div className="p-6 bg-slate-50/50 border-t border-gray-100 flex items-center justify-between relative z-20">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">© 2024</span>
                                <span className="text-[11px] font-black text-slate-800 tracking-tight">{siteTitle}</span>
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic opacity-60">İyi Yolculuklar</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </>
    );
};

export default Navbar;
