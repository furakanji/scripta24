"use client";

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';

interface SocialCarouselProps {
    title: string;
    texts: string[];
}

export function SocialCarouselGenerator({ title, texts }: SocialCarouselProps) {
    const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
    const [downloading, setDownloading] = useState(false);

    const downloadCarousel = async () => {
        setDownloading(true);
        try {
            for (const [index, ref] of imagesRef.current.entries()) {
                if (!ref) continue;
                const dataUrl = await toPng(ref, {
                    quality: 1.0,
                    pixelRatio: 2,
                    // Force 1080x1350
                    width: 1080,
                    height: 1350,
                    style: {
                        transform: 'scale(1)',
                        transformOrigin: 'top left'
                    }
                });

                const link = document.createElement('a');
                link.download = `scripta24-${title.replace(/\s+/g, '-').toLowerCase()}-${index + 1}.png`;
                link.href = dataUrl;
                link.click();

                // Small delay between downloads to prevent browser blocking
                await new Promise(r => setTimeout(r, 500));
            }
        } catch (err) {
            console.error("Failed to generate images", err);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="mt-12 p-6 bg-ink/5 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold font-serif text-ink">Esporta per i Social</h3>
                    <p className="text-sm font-sans text-ink-muted">Genera automaticamente il carosello 1080x1350</p>
                </div>
                <button
                    onClick={downloadCarousel}
                    disabled={downloading}
                    className="bg-ink text-paper px-4 py-2 rounded-full font-sans text-sm font-medium hover:bg-ink-muted transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    <Download size={16} />
                    {downloading ? 'Generazione...' : 'Scarica (ZIP/Immagini)'}
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                {texts.map((text, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 snap-center relative shadow-sm border border-ink-faint rounded-md overflow-hidden"
                        style={{ width: '270px', height: '337.5px' }} // Proportional preview of 1080x1350
                    >
                        <div
                            ref={el => { imagesRef.current[i] = el; }}
                            className="absolute top-0 left-0 bg-paper flex flex-col justify-center items-center p-16"
                            style={{ width: '1080px', height: '1350px', transform: 'scale(0.25)', transformOrigin: 'top left' }}
                        >
                            <h4 className="text-[42px] font-sans text-ink-faint uppercase tracking-[0.2em] absolute top-20 text-center w-full"> Scripta24</h4>
                            <p className="text-[64px] font-serif text-ink leading-tight text-center max-w-[800px]">
                                "{text}"
                            </p>
                            <div className="absolute bottom-24 w-full flex flex-col items-center">
                                <p className="text-[32px] font-serif font-bold text-ink italic">{title}</p>
                                <p className="text-[24px] font-sans text-ink-muted mt-4">{i + 1} / {texts.length}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
