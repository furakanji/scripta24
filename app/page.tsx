import { ContributionInput } from "@/components/ContributionInput";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto relative pt-4 pb-40">
      <header className="py-12 flex flex-col items-center border-b-2 border-ink mb-8 relative px-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl -z-10"></div>
        <h1 className="text-5xl font-black tracking-tighter text-ink uppercase mb-2 font-sans italic mt-8" style={{ textShadow: "2px 2px 0px #d1d0ce" }}>
          SCRIPT<span className="text-red-700">A</span><span className="ml-1 tracking-normal font-serif not-italic">24</span>
        </h1>
        <p className="text-xs text-ink-muted uppercase tracking-[0.3em] font-sans font-bold flex items-center gap-3 mt-2">
          <span className="w-8 h-[1px] bg-red-700 block"></span>
          Ogni giorno una storia nuova
          <span className="w-8 h-[1px] bg-red-700 block"></span>
        </p>
      </header>

      <main className="flex-1 pb-16 px-4">
        <article className="space-y-6 text-xl leading-relaxed">
          {/* Mock Story Content */}
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-4xl font-bold">Il Vento di Sabbia</h2>
            <p className="text-sm font-sans text-ink-muted uppercase tracking-wider">Fantascienza</p>
          </div>

          <p className="group relative">
            <span className="text-3xl float-left mr-2 font-bold opacity-80 mt-1 text-red-700">L</span>
            <span className="relative z-10">a città sorgeva dove un tempo c'era l'oceano, ora solo una distesa di polvere e rovine scolpite dal vento incessante.</span>
            <span className="absolute -left-6 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-sans text-ink-muted cursor-help" title="Generato dall'IA (The Spark)">✨</span>
          </p>

          <p className="group relative indent-8 border-l border-ink-faint/30 pl-4 ml-[-1rem]">
            <span className="relative z-10">Nessuno ricordava come fosse arrivato lì, ma il sapore del sale era ancora vivo sulle loro labbra secche.</span>
            <span className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-sans text-ink-muted cursor-pointer" title="Scritto da Mario R.">👤</span>
          </p>

          <p className="group relative indent-8 border-l border-ink-faint/30 pl-4 ml-[-1rem]">
            <span className="relative z-10">Guardando l'orizzonte, speravano di scorgere l'ombra di un vascello commerciale, ma solo nubi grigie rispondevano al loro richiamo.</span>
            <span className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-sans text-ink-muted cursor-pointer" title="Scritto da J. Hortus (Ghostwriter)">👻</span>
          </p>
        </article>
      </main>

      <Footer />
      <ContributionInput />
    </div>
  );
}
