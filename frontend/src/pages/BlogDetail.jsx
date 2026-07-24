import React, { useEffect, useState } from 'react';
import API_BASE from '../api';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const viewIncremented = React.useRef(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/blogs/${id}`);
                setBlog(res.data);

                // Increment view count only once
                if (!viewIncremented.current) {
                    viewIncremented.current = true;
                    await axios.post(`${API_BASE}/api/blogs/${id}/view`);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchBlog();
    }, [id]);

    if (!blog) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-pulse text-xl text-primary font-serif">Loading Story...</div>
        </div>
    );

    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "image": [blog.image],
        "datePublished": blog.createdAt,
        "dateModified": blog.updatedAt || blog.createdAt,
        "author": [{
            "@type": "Person",
            "name": "Ceylan M",
            "url": "http://localhost:5174/about" // Update with real domain later
        }]
    };

    return (
        <div className="bg-bg-light min-h-screen">
            <SEO
                title={blog.metaTitle || blog.title}
                description={blog.metaDescription || blog.content.substring(0, 150)}
                image={blog.image}
                schema={schema}
            />
            <Navbar />

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-10 text-center">
                    <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full mb-4 uppercase tracking-wider">
                        Travel Story
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                        {blog.title}
                    </h1>
                    <div className="flex items-center justify-center space-x-4 text-gray-500 text-sm">
                        <time dateTime={blog.createdAt}>
                            {new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                        <span>•</span>
                        <span>5 min read</span>
                    </div>
                </header>

                <div className="mb-12 rounded-2xl overflow-hidden shadow-lg h-[400px] md:h-[500px] relative group">
                    <img
                        src={blog.image || 'https://via.placeholder.com/1200x600'}
                        alt={blog.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <div className="prose prose-lg prose-indigo mx-auto max-w-3xl">
                    <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100 text-center">
                    <p className="text-gray-600 italic">"The world is a book and those who do not travel read only one page."</p>
                </div>
            </article>
        </div>
    );
};

export default BlogDetail;
