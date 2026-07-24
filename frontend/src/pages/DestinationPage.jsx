import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const DestinationPage = () => {
    const { id } = useParams();
    const [destination, setDestination] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all destinations to find ours (simplified)
                const allDest = await axios.get(`${API_BASE}/api/destinations`);
                const currentDest = allDest.data.find(d => d._id === id);
                setDestination(currentDest);

                if (currentDest) {
                    const blogsRes = await axios.get(`${API_BASE}/api/blogs`);

                    // Filter blogs:
                    // 1. Exact match (blog.destination == id)
                    // 2. OR blog.destination is a CHILD of currentDest (if currentDest is a region like 'Europe')
                    // For now, let's keep it simple: direct match or check against children if we knew them here.
                    // But usually you tag a blog with "Paris", not "Europe". 
                    // So if I am on "Europe" page, I want to see blogs from "Paris".

                    // Find all children IDs
                    const childrenIds = allDest.data
                        .filter(d => d.parent && (d.parent === id || d.parent._id === id))
                        .map(d => d._id);

                    const filteredBlogs = blogsRes.data.filter(b => {
                        const blogDestId = typeof b.destination === 'object' ? b.destination._id : b.destination;
                        return blogDestId === id || childrenIds.includes(blogDestId);
                    });

                    setBlogs(filteredBlogs);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!destination) return <div className="flex h-screen items-center justify-center">Destination not found</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Header */}
            <div className="relative h-[60vh] bg-gray-900 flex items-center justify-center overflow-hidden">
                <img
                    src={destination.image}
                    alt={destination.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                <div className="relative z-10 text-center text-white px-4 max-w-4xl">
                    <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">Seyahat Rehberi</span>
                    <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 tracking-tight">{destination.name.toUpperCase()}</h1>
                    <p className="text-xl md:text-2xl font-light text-gray-200 max-w-2xl mx-auto">{destination.description}</p>
                </div>
            </div>

            {/* Content List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex items-end justify-between mb-12 border-b border-gray-200 pb-6">
                    <div>
                        <span className="text-accent font-bold uppercase tracking-wider text-sm block mb-2">Keşfet</span>
                        <h2 className="text-4xl font-bold text-gray-900">{destination.name} Rehberi</h2>
                    </div>
                    <div className="text-gray-500 font-medium">
                        {blogs.length} Yazı Bulundu
                    </div>
                </div>

                {blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {blogs.map(blog => (
                            <Link key={blog._id} to={`/blog/${blog._id}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-widest text-gray-900 rounded-sm">
                                        Travel
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-accent transition-colors leading-tight">
                                        {blog.title}
                                    </h3>
                                    <div className="text-gray-500 text-sm line-clamp-3 mb-6" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                                    <div className="flex items-center text-accent font-bold text-sm tracking-wide uppercase group/link">
                                        Devamını Oku
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-block p-4 rounded-full bg-gray-100 mb-4 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900">Henüz yazı eklenmemiş.</h3>
                        <p className="text-gray-500 mt-2">Diğer destinasyonları keşfedin veya daha sonra tekrar kontrol edin!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DestinationPage;
