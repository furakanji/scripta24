export function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 w-full bg-paper border-t border-ink-faint/30 z-[60] py-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="max-w-2xl mx-auto text-center flex flex-col items-center justify-center text-[10px] sm:text-xs font-sans text-ink-muted">
                <p className="font-semibold text-ink uppercase tracking-widest">Scripta 24 - A Totally Unnecessary Productions 2026</p>
                <p className="mt-0.5 opacity-80">Progetto artistico collettivo senza fini di lucro.</p>
            </div>
        </footer>
    );
}
