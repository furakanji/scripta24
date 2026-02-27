import Link from "next/link";
import { History, Info } from "lucide-react";

export function Header() {
    return (
        <header className="absolute top-0 right-0 w-full p-6 flex justify-end gap-6 z-50 pointer-events-none">
            <div className="flex gap-6 pointer-events-auto">
                <Link
                    href="/archive"
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-muted hover:text-ink transition-colors cursor-pointer"
                    title="Archivio Storie"
                >
                    <History size={16} />
                    <span className="hidden sm:inline">Archivio</span>
                </Link>
                <Link
                    href="/about"
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-muted hover:text-ink transition-colors cursor-pointer"
                    title="Come Funziona"
                >
                    <Info size={16} />
                    <span className="hidden sm:inline">Come Funziona</span>
                </Link>
            </div>
        </header>
    );
}
