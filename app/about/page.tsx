import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen max-w-2xl mx-auto relative pt-4 pb-20">
            <header className="py-12 flex flex-col items-center border-b-2 border-ink mb-8 relative px-4 text-center">
                <Link href="/" className="absolute left-0 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors px-4 font-bold text-xs uppercase tracking-widest">
                    &larr; Torna a Scrivere
                </Link>
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl -z-10"></div>
                <h1 className="text-3xl font-black tracking-tighter text-ink uppercase mb-2 font-sans italic mt-8" style={{ textShadow: "1px 1px 0px #d1d0ce" }}>
                    COME FUNZION<span className="text-red-700">A</span>
                </h1>
            </header>

            <main className="flex-1 px-4 space-y-8 text-lg font-serif leading-relaxed text-ink/90">

                <section>
                    <h2 className="text-xl font-bold font-sans uppercase tracking-widest text-ink mb-4 border-l-4 border-red-700 pl-4">Cos'è Scripta24?</h2>
                    <p>
                        Scripta24 è un esperimento di narrazione collettiva. Immagina un gigantesco foglio di carta digitale, appoggiato sul tavolo di un bar, a cui chiunque può aggiungere una riga prima di passarlo al vicino.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold font-sans uppercase tracking-widest text-ink mb-4 border-l-4 border-red-700 pl-4">Le 3 Regole d'Oro</h2>
                    <ul className="space-y-4 list-decimal pl-6">
                        <li>
                            <strong>Una storia al giorno:</strong> Ogni giorno a mezzanotte, The Spark (la nostra Intelligenza Artificiale) genera un Titolo, un Genere e la frase iniziale (l'Incipit) da cui partire.
                        </li>
                        <li>
                            <strong>Cinquanta parole alla volta:</strong> Puoi aggiungere al massimo 50 parole per ogni tua pubblicazione. Non scrivere romanzi, lascia spazio agli altri.
                        </li>
                        <li>
                            <strong>Effimero ma eterno:</strong> A mezzanotte, la storia del giorno si blocca per sempre. Nessuno potrà più modificarla, ma vivrà in eterno nel nostro Archivio e sui nostri canali social.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold font-sans uppercase tracking-widest text-ink mb-4 border-l-4 border-red-700 pl-4">Chi è J. Hortus?</h2>
                    <p>
                        Se per troppo tempo nessuno scrive nulla, la pagina non può rimanere bianca.
                        A quel punto entra in gioco <strong>J. Hortus</strong>, il nostro ghostwriter artificiale.
                        Leggerà tutto quello che è stato scritto fino a quel momento e aggiungerà un paragrafo coerente per ravvivare l'ispirazione. Quando vedi il simbolo 👻, sai che c'è il suo zampino.
                    </p>
                </section>

                <div className="pt-8 text-center">
                    <Link href="/" className="inline-block px-8 py-4 bg-ink text-paper font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_#1a1a1a] hover:bg-ink/90 transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                        Inizia a Scrivere
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
