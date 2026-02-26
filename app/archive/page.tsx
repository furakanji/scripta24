import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function ArchivePage() {
    // In a real app, fetch stories from Firestore where status === "closed"
    const mockStories = [
        {
            id: "2026-02-25",
            title: "Il Vento di Sabbia",
            genre: "Fantascienza",
            summary: "Un'esplorazione onirica e polverosa della futilità dell'attesa umana, raccontata attraverso il frammentario ricordo di un oceano perduto."
        },
        {
            id: "2026-02-24",
            title: "Memorie di un Orologio",
            genre: "Realismo Magico",
            summary: "Una riflessione sul tempo che passa inesorabile dal punto di vista di un oggetto inanimato intrappolato in una casa abbandonata."
        }
    ];

    return (
        <div className="flex flex-col min-h-screen max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <header className="mb-12 flex flex-col items-center sm:items-start sm:flex-row justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black font-sans uppercase italic text-ink mb-2 tracking-tighter" style={{ textShadow: "2px 2px 0px #d1d0ce" }}>Archivio<span className="text-red-700">.</span></h1>
                    <p className="text-ink-muted font-sans text-sm tracking-widest uppercase">Le storie collettive dei giorni passati.</p>
                </div>
                <Link href="/" className="text-paper bg-ink hover:bg-red-700 transition-colors flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-wider px-6 py-3 rounded-none border border-ink shadow-[4px_4px_0px_0px_#1a1a1a] hover:shadow-[2px_2px_0px_0px_#1a1a1a] hover:translate-x-[2px] hover:translate-y-[2px]">
                    <BookOpen size={16} />
                    Leggi Oggi
                </Link>
            </header>

            <main className="space-y-8">
                {mockStories.map(story => (
                    <Link key={story.id} href={`/archive/${story.id}`} className="block">
                        <article className="border border-ink-faint rounded-2xl p-6 bg-white/50 hover:bg-white transition-colors group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold font-serif text-ink">{story.title}</h2>
                                    <p className="text-xs font-sans text-ink-muted uppercase tracking-wider mt-1">{story.genre} • {story.id}</p>
                                </div>
                            </div>
                            <p className="text-ink italic font-serif leading-relaxed line-clamp-3">
                                "{story.summary}"
                            </p>
                            <div className="mt-6 flex justify-end">
                                <span className="text-sm font-sans font-medium text-ink-muted group-hover:text-ink transition-colors flex items-center gap-2">
                                    Leggi tutto &rarr;
                                </span>
                            </div>
                        </article>
                    </Link>
                ))}
            </main>
        </div>
    );
}
