import React from 'react';
import Navbar from '../components/Navbar';

const About = () => {
    return (
        <div className="bg-bg-light min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">About Ceylan.m.e.</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Inspiring travelers to discover the world's most beautiful and hidden corners.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Traveler"
                            className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl font-serif font-bold text-gray-900">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We believe that travel is the best way to learn about the world and ourselves. Since 2024,
                            Ceylan.m.e. has been a trusted resource for adventurers seeking authentic experiences,
                            practical guides, and inspiration for their next journey.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Whether you're a backpacker, a luxury traveler, or someone who loves to explore local
                            gems on weekends, we have stories that resonate with your spirit of adventure.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Join Our Community</h3>
                    <p className="text-gray-600 mb-6">Follow us on social media for daily travel inspiration.</p>
                    <div className="flex justify-center space-x-6">
                        {/* Social Icons Placeholders */}
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-accent hover:text-white transition-colors cursor-pointer">IG</div>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-accent hover:text-white transition-colors cursor-pointer">TW</div>
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-accent hover:text-white transition-colors cursor-pointer">FB</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
