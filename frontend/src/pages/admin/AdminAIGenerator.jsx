import React, { useState } from 'react';
import API_BASE from '../../api';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import AdminLayout from '../../components/AdminLayout';

const AdminAIGenerator = () => {
    const [mode, setMode] = useState('upload'); // 'url' or 'upload'
    const [url, setUrl] = useState('');
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const handleAnalyze = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult('');

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            if (mode === 'url') {
                formData.append('url', url);
            } else {
                if (!file) {
                    setError('Lütfen bir video dosyası seçin.');
                    setLoading(false);
                    return;
                }
                formData.append('video', file);
            }

            if (caption) {
                formData.append('caption', caption);
            }

            const config = {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            };

            const res = await axios.post(`${API_BASE}/api/ai/analyze-instagram`, formData, config);
            setResult(res.data.content);
        } catch (err) {
            setError(err.response?.data?.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        alert('İçerik kopyalandı!');
    };

    return (
        <AdminLayout title="AI Blog Yazarı">
            <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">

            {/* Mode Selection Tabs */}
            <div className="flex border-b mb-6">
                <button
                    className={`py-2 px-4 font-semibold ${mode === 'upload' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setMode('upload')}
                >
                    Video Yükle (Önerilen)
                </button>
                <button
                    className={`py-2 px-4 font-semibold ${mode === 'url' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setMode('url')}
                >
                    Instagram URL
                </button>
            </div>

            <form onSubmit={handleAnalyze} className="mb-8 space-y-4">

                {mode === 'url' ? (
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Instagram Reel/Video URL</label>
                        <input
                            type="url"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="https://www.instagram.com/reel/..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <p className="text-xs text-red-500 mt-1">
                            Not: Instagram engellemeleri nedeniyle URL analizi bazen çalışmayabilir. Dosya yükleme daha garantidir.
                        </p>
                    </div>
                ) : (
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Video Dosyası Seç (MP4)</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-purple-50 file:text-purple-700
                                hover:file:bg-purple-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">Maksimum 50MB.</p>
                    </div>
                )}

                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Instagram Açıklaması / Ekstra Bilgi (Opsiyonel)</label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Videonun açıklamasını buraya yapıştırırsanız AI daha doğru bir yazı yazar."
                        rows="3"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'Analiz Ediliyor ve Blog Yazılıyor...' : 'Blog Yazısı Oluştur'}
                </button>
            </form>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Hata: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {result && (
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Oluşturulan İçerik</h2>
                        <button
                            onClick={copyToClipboard}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded text-sm"
                        >
                            Kopyala
                        </button>
                    </div>

                    <div className="bg-gray-50 p-6 rounded border border-gray-200 prose max-w-none">
                        <ReactMarkdown>{result}</ReactMarkdown>
                    </div>
                    <textarea
                        className="w-full h-40 mt-4 p-4 border rounded font-mono text-sm text-gray-500"
                        value={result}
                        readOnly
                        placeholder="Ham Markdown çıktısı"
                    />
                </div>
            )}
            </div>
        </AdminLayout>
    );
};

export default AdminAIGenerator;
