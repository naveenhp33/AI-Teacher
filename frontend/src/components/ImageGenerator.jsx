import React, { useState } from 'react';
import { Wand2, Download } from 'lucide-react';
import { generateImage } from '../services/api';

const ImageGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt.trim() || loading) return;

        setLoading(true);
        setError('');
        setImage(null);

        try {
            const data = await generateImage(prompt);
            setImage(data.imageUrl);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to generate image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = () => {
        const link = document.createElement('a');
        link.href = image;
        link.download = `ai-image-${Date.now()}.png`;
        link.click();
    };

    return (
        <div className="main-content">
            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
                    <h1 style={{ marginBottom: '1rem' }}>Generate AI Art</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Transform your words into stunning visuals using high-quality AI models.
                    </p>

                    <form className="input-wrapper" onSubmit={handleGenerate} style={{ marginBottom: '2rem' }}>
                        <input 
                            type="text" 
                            placeholder="Describe what you want to see..." 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={loading}
                        />
                        <button type="submit" className="send-btn" disabled={loading || !prompt.trim()}>
                            {loading ? <div className="spinner"></div> : <Wand2 size={20} />}
                        </button>
                    </form>

                    {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}

                    <div style={{ 
                        width: '100%', 
                        aspectRatio: '1', 
                        backgroundColor: 'var(--bg-secondary)', 
                        borderRadius: '1rem', 
                        overflow: 'hidden',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        {image ? (
                            <>
                                <img src={image} alt="Generated" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button className="download-btn" style={{ opacity: 1 }} onClick={downloadImage}>
                                    <Download size={20} />
                                </button>
                            </>
                        ) : (
                            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                                {loading ? "Creating your masterpiece..." : "Your image will appear here"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageGenerator;
