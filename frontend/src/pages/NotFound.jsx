import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SEO title="Sayfa Bulunamadı - 404" description="Aradığınız sayfa bulunamadı." />
            <Navbar />
            <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
                <div className="relative mb-8">
                    <h1 className="text-9xl font-black text-gray-200">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-800 bg-white px-4 py-2 rounded-lg shadow-sm">
                            Sayfa Kayıp!
                        </span>
                    </div>
                </div>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Aradığınız sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.
                </p>
                <Link to="/" className="px-8 py-3 bg-accent text-white font-bold rounded-full hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Ana Sayfaya Dön
                </Link>
            </div>
            <Footer />
        </div>
    );
};

export default NotFound;
