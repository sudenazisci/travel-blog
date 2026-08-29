import React, { useState, useEffect } from 'react';
import API_BASE from '../api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ email: '', password: '', securityPin: '', otpCode: '' });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isFailed, setIsFailed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let timer;
        if (step === 2 && timeLeft > 0 && !isFailed) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (step === 2 && timeLeft === 0 && !isFailed) {
            handleFailure('Süre doldu! Güvenlik nedeniyle işlem iptal edildi.');
        }
        return () => clearInterval(timer);
    }, [step, timeLeft, isFailed]);

    const handleFailure = (msg) => {
        setIsFailed(true);
        setError(msg);
        setTimeout(() => {
            setStep(1);
            setTimeLeft(60);
            setIsFailed(false);
            setFormData(prev => ({ ...prev, otpCode: '' }));
            setError('');
            setSuccessMessage('');
        }, 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginStep1 = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        try {
            const res = await axios.post(`${API_BASE}/api/auth/login`, {
                email: formData.email,
                password: formData.password,
                securityPin: formData.securityPin
            });
            if (res.data.step === 2) {
                setStep(2);
                setTimeLeft(60);
                setIsFailed(false);
                setSuccessMessage(res.data.msg || 'Doğrulama kodu Telegram hesabınıza gönderildi.');
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Geçersiz Giriş Bilgileri');
        }
    };

    const handleVerifyStep2 = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        try {
            const res = await axios.post(`${API_BASE}/api/auth/verify-otp`, {
                email: formData.email,
                otpCode: formData.otpCode
            });
            localStorage.setItem('token', res.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            handleFailure(err.response?.data?.msg || 'Geçersiz doğrulama kodu');
        }
    };

    if (isFailed) {
        return (
            <div className="min-h-screen bg-red-600 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 transition-colors duration-500">
                <div className="text-white text-center">
                    <svg className="mx-auto h-24 w-24 text-white mb-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-4xl font-bold mb-2 tracking-wider">ERİŞİM REDDEDİLDİ</h2>
                    <p className="text-xl font-medium">{error}</p>
                    <p className="mt-6 text-red-200 animate-pulse">Giriş ekranına yönlendiriliyorsunuz...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <img src="/logo.png" alt="Ceylan.m.e." className="mx-auto h-24 md:h-28 w-auto object-contain mb-4 drop-shadow-md" />
                <h2 className="text-center text-3xl font-serif font-bold text-gray-900">
                    Yönetici Erişimi
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {step === 1 ? 'Hikayelerinizi yönetmek için giriş yapın' : 'İki Aşamalı Doğrulama'}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
                            <p className="text-sm text-green-700">{successMessage}</p>
                        </div>
                    )}

                    {step === 1 ? (
                        <form className="space-y-6" onSubmit={handleLoginStep1}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta Adresi</label>
                                <div className="mt-1">
                                    <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Şifre</label>
                                <div className="mt-1">
                                    <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="securityPin" className="block text-sm font-medium text-gray-700">Güvenlik PIN Kodu</label>
                                <div className="mt-1">
                                    <input id="securityPin" name="securityPin" type="password" required value={formData.securityPin} onChange={handleChange} placeholder="PIN Kodu" className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm" />
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-300 transform hover:-translate-y-0.5">
                                    Giriş Yap
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleVerifyStep2}>
                            <div className="text-center mb-4">
                                <span className={`inline-flex items-center px-4 py-1 rounded-full text-md font-bold transition-colors ${timeLeft < 15 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                    ⌚ Kalan Süre: {timeLeft}s
                                </span>
                            </div>
                            <div>
                                <label htmlFor="otpCode" className="block text-sm font-medium text-gray-700">6 Haneli Doğrulama Kodu</label>
                                <p className="text-xs text-gray-500 mb-2 mt-1">Lütfen Telegram botundan gelen 6 haneli kodu süre bitmeden girin.</p>
                                <div className="mt-1">
                                    <input id="otpCode" name="otpCode" type="text" required value={formData.otpCode} onChange={handleChange} placeholder="Örn: 123456" maxLength="6" className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm text-center tracking-widest text-lg font-mono font-bold" />
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-300 transform hover:-translate-y-0.5">
                                    Doğrula ve Giriş Yap
                                </button>
                            </div>
                            <div className="text-center mt-4">
                                <button type="button" onClick={() => { setStep(1); setSuccessMessage(''); setError(''); }} className="text-sm text-accent hover:underline">
                                    ← Geri Dön
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
