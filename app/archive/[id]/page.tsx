"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SocialCarouselGenerator } from "@/components/SocialCarouselGenerator";
import { Footer } from "@/components/Footer";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StoryDetail() {
    const params = useParams();
    const id = params?.id as string;

    const [story, setStory] = useState<any>(null);
    const [contributions, setContributions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        async function fetchStoryAndContributions() {
            try {
                // Fetch the main story
                const storyDocRef = doc(db, "stories", id);
                const storyDocSnap = await getDoc(storyDocRef);

                if (!storyDocSnap.exists()) {
                    setError("Storia non trovata.");
                    setLoading(false);
                    return;
                }

                const storyData = { id: storyDocSnap.id, ...storyDocSnap.data() };

                // Fetch the contributions
                const contribsRef = collection(db, "stories", id, "contributions");
                const q = query(contribsRef, orderBy("createdAt", "asc"));
                const querySnapshot = await getDocs(q);

                const contribsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setStory(storyData);
                setContributions(contribsData);
            } catch (err) {
                console.error("Error fetching story:", err);
                setError("Si è verificato un errore durante il caricamento della storia.");
            } finally {
                setLoading(false);
            }
        }

        fetchStoryAndContributions();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-red-700 border-t-transparent animate-spin"></div>
            </div>
        );
    }

    if (error || !story) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center space-y-4">
                <p className="text-2xl font-serif text-ink">{error || "Qualcosa è andato storto."}</p>
                <Link href="/archive" className="text-red-700 font-bold uppercase tracking-widest text-sm hover:underline">
                    &larr; Torna all'archivio
                </Link>
            </div>
        );
    }

    const allTexts = [story.incipit, ...contributions.map(c => c.text)];
    const carouselTexts = [];
    // Group into chunks of 2 sentences for the carousel
    // (If a single block is very long, it might be better to chunk by actual length, but this is a start)
    for (let i = 0; i < allTexts.length; i += 2) {
        carouselTexts.push(allTexts.slice(i, i + 2).join(" "));
    }

    return (
        <div className="flex flex-col min-h-screen max-w-2xl mx-auto px-4 sm:px-6 py-12 relative">
            <Link href="/" className="absolute top-4 left-4 sm:left-6 text-ink-muted hover:text-ink transition-colors font-bold text-xs uppercase tracking-widest hidden sm:block">
                &larr; Torna a Scrivere
            </Link>
            <header className="mb-12 mt-8 sm:mt-4">
                <Link href="/archive" className="text-ink-muted hover:text-red-700 transition-colors flex items-center gap-2 font-sans text-sm mb-8 font-bold uppercase tracking-widest">
                    <ArrowLeft size={16} /> Torna all'archivio
                </Link>
                <h1 className="text-5xl font-black font-sans italic text-ink mb-2 uppercase tracking-tighter" style={{ textShadow: "2px 2px 0px #d1d0ce" }}>{story.title}</h1>
                <p className="text-red-700 font-sans uppercase tracking-[0.2em] font-bold text-xs mt-4">{story.genre} • {story.id}</p>
            </header>

            <main className="space-y-6 text-xl leading-relaxed text-ink font-serif mb-12">
                {allTexts.map((text, idx) => (
                    <p key={idx} className="group relative">
                        {idx === 0 ? (
                            <>
                                <span className="text-3xl float-left mr-2 font-bold opacity-80 mt-1 text-red-700">{text ? text.charAt(0) : ''}</span>
                                <span className="relative z-10">{text ? text.slice(1) : ''}</span>
                            </>
                        ) : (
                            <span className="relative z-10">{text}</span>
                        )}
                    </p>
                ))}

                {story.summary && (
                    <div className="mt-12 p-8 bg-paper border-2 border-ink shadow-[4px_4px_0px_0px_#1a1a1a]">
                        <h3 className="font-sans text-xs font-black uppercase tracking-[0.2em] text-red-700 mb-4 border-b border-red-700/20 pb-2">Nota della Redazione (AI)</h3>
                        <p className="text-base italic text-ink font-serif">{story.summary}</p>
                    </div>
                )}
            </main>

            <div className="border-t-2 border-ink pt-8 mt-auto mb-16">
                <SocialCarouselGenerator title={story.title} texts={carouselTexts} />
            </div>

            <Footer />
        </div>
    );
}
