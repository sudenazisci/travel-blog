import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const DestinationDetail = () => {
    const { id } = useParams();
    const [destination, setDestination] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all destinations to find the current one (simplest without new API endpoint)
                // In production, you'd want a GET /api/destinations/:id endpoint
                const destRes = await axios.get(`${API_BASE}/api/destinations`);
                const foundDest = destRes.data.find(d => d._id === id);
                setDestination(foundDest);

                // Fetch blogs for this destination
                const blogsRes = await axios.get(`${API_BASE}/api/blogs?destination=${id}`);
                setBlogs(blogsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!destination) return <div className="min-h-screen flex items-center justify-center">Destination not found</div>;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Header */}
            <div className="relative h-[60vh] min-h-[400px]">
                <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center px-4">
                    <div className="max-w-4xl animate-fadeIn">
                        <span className="text-accent uppercase tracking-widest font-medium mb-4 block">Travel Guide</span>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-sm">{destination.name}</h1>
                        <p className="text-xl text-gray-100 max-w-2xl mx-auto font-light leading-relaxed">
                            {destination.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Blogs Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="flex items-center justify-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-gray-900 border-b-2 border-accent pb-2">
                        Stories from {destination.name}
                    </h2>
                </div>

                {blogs.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl">
                        <p className="text-gray-500 text-lg">No stories written for this destination yet.</p>
                        <Link to="/" className="text-accent font-medium mt-4 inline-block hover:underline">Return Home</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map(blog => (
                            <Link key={blog._id} to={`/blog/${blog._id}`} className="group block h-full">
                                <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col hover:-translate-y-1">
                                    <div className="relative overflow-hidden h-64">
                                        <img
                                            src={blog.image}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                                            {blog.title}
                                        </h3>
                                        <div className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                                        <div className="mt-auto text-accent font-medium text-sm flex items-center">
                                            Read Article <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DestinationDetail;
