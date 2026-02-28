import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SocialCarouselGenerator } from "@/components/SocialCarouselGenerator";
import { Footer } from "@/components/Footer";

export default function StoryDetail({ params }: { params: { id: string } }) {
    // In a real app, fetch story by id from Firestore
    const story = {
        id: params.id,
        title: "Il Vento di Sabbia",
        genre: "Fantascienza",
        incipit: "La città sorgeva dove un tempo c'era l'oceano, ora solo una distesa di polvere e rovine scolpite dal vento incessante.",
        contributions: [
            "Nessuno ricordava come fosse arrivato lì, ma il sapore del sale era ancora vivo sulle loro labbra secche.",
            "Guardando l'orizzonte, speravano di scorgere l'ombra di un vascello commerciale, ma solo nubi grigie rispondevano al loro richiamo.",
            "Fu allora che la campana della vecchia torre riprese a suonare da sola, spinta da una tempesta invisibile."
        ],
        summary: "Un'esplorazione onirica e polverosa della futilità dell'attesa umana, raccontata attraverso il frammentario ricordo di un oceano perduto."
    };

    const allTexts = [story.incipit, ...story.contributions];
    const carouselTexts = [];
    // Group into chunks of 2 sentences for the carousel
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
                    <p key={idx}>{text}</p>
                ))}

                <div className="mt-12 p-8 bg-paper border-2 border-ink shadow-[4px_4px_0px_0px_#1a1a1a]">
                    <h3 className="font-sans text-xs font-black uppercase tracking-[0.2em] text-red-700 mb-4 border-b border-red-700/20 pb-2">Nota della Redazione (AI)</h3>
                    <p className="text-base italic text-ink font-serif">{story.summary}</p>
                </div>
            </main>

            <div className="border-t-2 border-ink pt-8 mt-auto mb-16">
                <SocialCarouselGenerator title={story.title} texts={carouselTexts} />
            </div>

            <Footer />
        </div>
    );
}
