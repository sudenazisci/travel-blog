/** Render/Vercel ortam değişkenlerindeki baş/son boşlukları temizler. */
const envTrim = (key) => {
    const v = process.env[key];
    if (v === undefined || v === null) return undefined;
    return String(v).trim();
};

module.exports = { envTrim };
