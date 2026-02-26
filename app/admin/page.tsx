import Link from "next/link";
import { Copyleft, LayoutDashboard, FileText, Settings, Users, Activity, Trash2, Shield, EyeOff } from "lucide-react";

export default function AdminDashboard() {
    const stats = [
        { label: "Storie Attive", value: "1", icon: <Activity size={20} className="text-red-700" /> },
        { label: "Storie Archiviate", value: "42", icon: <FileText size={20} className="text-ink-muted" /> },
        { label: "Utenti Totali", value: "1,204", icon: <Users size={20} className="text-ink-muted" /> },
        { label: "Interventi J. Hortus", value: "8", icon: <Copyleft size={20} className="text-ink-muted" /> },
    ];

    const recentContributions = [
        { id: 1, author: "Mario R.", text: "Nessuno ricordava come fosse arrivato lì...", time: "10 min fa", status: "approved" },
        { id: 2, author: "J. Hortus", text: "Guardando l'orizzonte, speravano di scorgere...", time: "1 ora fa", status: "auto" },
        { id: 3, author: "Luca T.", text: "Le rovine della vecchia città sussurravano...", time: "2 ore fa", status: "approved" },
        { id: 4, author: "Anonimo", text: "compra crypto subito su questo sito!!1", time: "3 ore fa", status: "rejected" },
    ];

    return (
        <div className="flex h-screen bg-paper font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-ink text-paper border-r border-ink-faint/20 flex flex-col">
                <div className="p-6 border-b border-paper/10">
                    <h1 className="text-2xl font-black tracking-tighter uppercase italic" style={{ textShadow: "1px 1px 0px #000" }}>
                        SCRIPT<span className="text-red-500">A</span><span className="ml-0.5 tracking-normal font-serif not-italic">24</span>
                    </h1>
                    <p className="text-[10px] text-paper/60 uppercase tracking-widest mt-1">Console di Comando</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-red-700 text-white rounded-md font-bold text-sm tracking-wide">
                        <LayoutDashboard size={18} /> Dashboard
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-paper/70 hover:text-white hover:bg-paper/10 rounded-md font-medium text-sm transition-colors">
                        <FileText size={18} /> Gestione Storie
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-paper/70 hover:text-white hover:bg-paper/10 rounded-md font-medium text-sm transition-colors">
                        <Shield size={18} /> Moderazione AI
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-paper/70 hover:text-white hover:bg-paper/10 rounded-md font-medium text-sm transition-colors">
                        <Settings size={18} /> Impostazioni Server
                    </a>
                </nav>

                <div className="p-4 border-t border-paper/10">
                    <Link href="/" className="flex items-center gap-3 px-4 py-2 text-paper/50 hover:text-white transition-colors text-sm">
                        &larr; Torna al Sito Pubblico
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-white/50">
                <div className="p-8 max-w-5xl mx-auto space-y-8">

                    <header className="flex justify-between items-end">
                        <div>
                            <h2 className="text-3xl font-black text-ink uppercase tracking-tight">Panoramica Sistema</h2>
                            <p className="text-ink-muted text-sm mt-1">Oggi è una nuova storia. Monitoraggio in tempo reale.</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border border-ink text-ink font-bold text-xs uppercase hover:bg-ink hover:text-paper transition-colors shadow-[2px_2px_0px_0px_#1a1a1a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                                Forza J. Hortus
                            </button>
                            <button className="px-4 py-2 bg-red-700 text-white font-bold text-xs uppercase hover:bg-red-800 transition-colors shadow-[2px_2px_0px_0px_#1a1a1a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none border border-red-900">
                                Chiudi Storia Ora
                            </button>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-paper border-2 border-ink p-4 shadow-[4px_4px_0px_0px_#1a1a1a]">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-bold uppercase text-ink-muted tracking-wider">{stat.label}</span>
                                    {stat.icon}
                                </div>
                                <p className="text-3xl font-black font-serif text-ink">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Activity Log */}
                    <div className="bg-paper border-2 border-ink shadow-[4px_4px_0px_0px_#1a1a1a] overflow-hidden">
                        <div className="p-4 border-b-2 border-ink bg-ink/5 flex justify-between items-center">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-ink">Ultime Contribuzioni</h3>
                            <span className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                LIVE
                            </span>
                        </div>

                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-ink/20 text-xs uppercase tracking-wider text-ink-muted bg-white/50">
                                    <th className="p-4 font-semibold">Autore</th>
                                    <th className="p-4 font-semibold w-2/3">Testo</th>
                                    <th className="p-4 font-semibold">Ora</th>
                                    <th className="p-4 font-semibold text-right">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ink/10">
                                {recentContributions.map(ctx => (
                                    <tr key={ctx.id} className="hover:bg-ink/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${ctx.status === 'rejected' ? 'bg-red-500' : ctx.status === 'auto' ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                                                <span className="font-bold text-sm text-ink">{ctx.author}</span>
                                            </div>
                                        </td>
                                        <td className={`p-4 font-serif text-ink italic ${ctx.status === 'rejected' ? 'line-through text-ink-muted' : ''}`}>
                                            "{ctx.text}"
                                        </td>
                                        <td className="p-4 text-xs font-medium text-ink-muted font-sans">
                                            {ctx.time}
                                        </td>
                                        <td className="p-4 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-ink-muted hover:text-ink hover:bg-ink/10 rounded transition-colors" title="Nascondi">
                                                <EyeOff size={16} />
                                            </button>
                                            <button className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors" title="Elimina/Banna">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>
        </div>
    );
}
