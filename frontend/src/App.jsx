import React from 'react';
import API_BASE from './api';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BlogDetail from './pages/BlogDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import About from './pages/About';
import AdminPosts from './pages/admin/AdminPosts';
import AdminPostEditor from './pages/admin/AdminPostEditor';
import AdminDestinations from './pages/admin/AdminDestinations';
import AdminRegions from './pages/admin/AdminRegions';
import AdminSettings from './pages/admin/AdminSettings';
import AdminStatistics from './pages/admin/AdminStatistics';
import AdminAIGenerator from './pages/admin/AdminAIGenerator';
import DestinationPage from './pages/DestinationPage';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import CookiePolicy from './pages/CookiePolicy';
import PrivateRoute from './components/PrivateRoute';
import CookieConsent from './components/CookieConsent';
import axios from 'axios';

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

        if (!visitIncremented.current) {
            visitIncremented.current = true;
            axios.post(`${API_BASE}/api/settings/visit`)
                .catch(err => console.error("Visit tracking error:", err));
        }
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
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />
                    <Route path="/destinations" element={<Destinations />} />
                    <Route path="/destination/:id" element={<DestinationPage />} />
                    <Route path="/destinations/:id" element={<DestinationDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />


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
                
                {/* Global Cookie Consent Banner */}
                <CookieConsent onAccept={(val) => setIsConsentGiven(val)} />
            </Router>
        </HelmetProvider>
    );
}

export default App;
