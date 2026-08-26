import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url, schema }) => {
    const siteTitle = 'Ceylan.m.e.';
    const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const finalDescription = description || 'Dünyayı keşfedin, seyahat rehberleri ve ipuçları.';
    const finalImage = image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
    const finalUrl = url || window.location.href;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={finalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={finalUrl} />
            <meta property="twitter:title" content={finalTitle} />
            <meta property="twitter:description" content={finalDescription} />
            <meta property="twitter:image" content={finalImage} />

            {/* Structured Data (JSON-LD) */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
