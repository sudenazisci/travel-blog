import React from 'react';
import API_BASE from './api';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
const BlogDetail = React.lazy(() => import('./pages/BlogDetail'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const Destinations = React.lazy(() => import('./pages/Destinations'));
const DestinationDetail = React.lazy(() => import('./pages/DestinationDetail'));
const About = React.lazy(() => import('./pages/About'));
const AdminPosts = React.lazy(() => import('./pages/admin/AdminPosts'));
const AdminPostEditor = React.lazy(() => import('./pages/admin/AdminPostEditor'));
const AdminDestinations = React.lazy(() => import('./pages/admin/AdminDestinations'));
const AdminRegions = React.lazy(() => import('./pages/admin/AdminRegions'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));
const AdminStatistics = React.lazy(() => import('./pages/admin/AdminStatistics'));
const AdminAIGenerator = React.lazy(() => import('./pages/admin/AdminAIGenerator'));
const DestinationPage = React.lazy(() => import('./pages/DestinationPage'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));
const Contact = React.lazy(() => import('./pages/Contact'));
const CookiePolicy = React.lazy(() => import('./pages/CookiePolicy'));
const AdvertisingPolicy = React.lazy(() => import('./pages/AdvertisingPolicy'));
import PrivateRoute from './components/PrivateRoute';
import CookieConsent from './components/CookieConsent';
import axios from 'axios';
import setupAxios from './setupAxios';
import VisitorTracker from './components/VisitorTracker';

setupAxios();

import { Helmet, HelmetProvider } from 'react-helmet-async';

function App() {
    const visitIncremented = React.useRef(false);

    const [adSenseId, setAdSenseId] = React.useState('');
    const [isConsentGiven, setIsConsentGiven] = React.useState(false);

    React.useEffect(() => {
        // Fetch AdSense ID
        axios.get(`${API_BASE}/api/settings`)
            .then(res => {
                if (res.data.googleAdSenseId) {
                    setAdSenseId(res.data.googleAdSenseId);
                }
            })
            .catch(err => console.error("Settings fetch error:", err));
    }, []);

    return (
        <HelmetProvider>
            {/* AdSense only loads if consent is given */}
            {adSenseId && isConsentGiven && (
                <Helmet>
                    <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`} crossOrigin="anonymous"></script>
                </Helmet>
            )}
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <VisitorTracker />
                <React.Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />
                    <Route path="/destinations" element={<Destinations />} />
                    <Route path="/destination/:id" element={<DestinationPage />} />
                    <Route path="/destinations/:id" element={<DestinationDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/iletisim" element={<Contact />} />
                    
                    {/* Legal and Compliance Routes */}
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />
                    <Route path="/advertising-policy" element={<AdvertisingPolicy />} />


                    <Route path="/yonetim-gizli-giris" element={<AdminLogin />} />

                    {/* Protected Admin Routes */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/posts" element={<AdminPosts />} />
                        <Route path="/admin/posts/new" element={<AdminPostEditor />} />
                        <Route path="/admin/posts/edit/:id" element={<AdminPostEditor />} />
                        <Route path="/admin/destinations" element={<AdminDestinations />} />
                        <Route path="/admin/regions" element={<AdminRegions />} />
                        <Route path="/admin/settings" element={<AdminSettings />} />
                        <Route path="/admin/statistics" element={<AdminStatistics />} />
                        <Route path="/admin/ai-generator" element={<AdminAIGenerator />} />
                    </Route>

                    {/* 404 Route - Must be last */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
                </React.Suspense>
                
                {/* Global Cookie Consent Banner */}
                <CookieConsent onAccept={(val) => setIsConsentGiven(val)} />
            </Router>
        </HelmetProvider>
    );
}

export default App;
