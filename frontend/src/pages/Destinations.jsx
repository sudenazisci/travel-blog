import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Destinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [destRes, setRes] = await Promise.all([
                    axios.get(`${API_BASE}/api/destinations`),
                    axios.get(`${API_BASE}/api/settings`)
                ]);
                // Filter: Must not be a region AND must be featured
                setDestinations(destRes.data.filter(d => !d.isRegion && d.isFeatured));
                setSettings(setRes.data);
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (destinations.length <= 1) return;
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % destinations.length);
        }, 10000);
        return () => clearInterval(timer);
    }, [destinations.length]);

    if (loading) return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
    );

    if (destinations.length === 0) return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">No Destinations Yet</h2>
            <p className="text-gray-400 mb-8">It is looking a bit empty here. Start by adding some regions in the Admin panel.</p>
            <Link to="/admin/destinations" className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
                Go to Admin Panel
            </Link>
        </div>
    );

    const activeDest = destinations[activeIndex];

    return (
        <div className="relative min-h-screen bg-gray-900 overflow-hidden font-sans">
            <div className="absolute top-0 left-0 w-full z-50">
                <Navbar transparent={true} />
            </div>

            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                {destinations.map((dest, index) => (
                    <div
                        key={dest._id}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
                        style={{ backgroundImage: `url('${dest.image}')` }}
                    >
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">

                {/* Active Destination Info */}
                <div className="mb-12 max-w-2xl animate-fadeIn">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-12 h-1 bg-white rounded-full"></span>
                        <span className="text-white/80 uppercase tracking-[0.2em] text-sm">{settings?.destinationsTag || 'Most Popular'}</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
                        {activeDest.name}
                    </h1>

                    <p className="text-lg text-gray-200 mb-8 max-w-lg leading-relaxed drop-shadow-md">
                        {activeDest.description || "Uncover the secrets of this amazing destination. From hidden gems to popular spots, get ready for an unforgettable journey."}
                    </p>

                    <Link
                        to={`/destinations/${activeDest._id}`}
                        className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white font-semibold hover:bg-white hover:text-black transition-all duration-300 group"
                    >
                        <span className="mr-2">Explore {activeDest.name}</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                </div>

                {/* Slider / Carousel */}
                <div className="absolute bottom-10 right-0 left-0 lg:left-auto lg:right-10 lg:bottom-10 z-20 w-full lg:w-auto">
                    <div className="flex overflow-x-auto pb-8 px-4 gap-6 lg:justify-end hide-scrollbar snap-x">
                        {destinations.map((dest, index) => (
                            <button
                                key={dest._id}
                                onClick={() => setActiveIndex(index)}
                                className={`
                                    relative flex-shrink-0 w-32 h-40 md:w-40 md:h-52 rounded-2xl overflow-hidden shadow-xl
                                    transition-all duration-500 transform snap-center border-2
                                    ${index === activeIndex ? 'border-white scale-105 ring-4 ring-white/20' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'}
                                `}
                            >
                                <img
                                    src={dest.image}
                                    alt={dest.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-center pb-4">
                                    <span className="text-white font-serif font-bold tracking-wide text-sm">{dest.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Destinations;
