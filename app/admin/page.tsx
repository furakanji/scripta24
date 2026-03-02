"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, FileText, Settings, Users, Activity, Trash2, Shield, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getTodayStr } from "@/lib/date";

interface Contribution {
    id: string;
    text: string;
    authorName: string;
    authorId: string;
    isGhostwriter: boolean;
    createdAt: any;
}

export default function AdminDashboard() {
    const { user, loading: authLoading, signInAsGuest } = useAuth();
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [loading, setLoading] = useState(true);
    const [adminInput, setAdminInput] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);
    const [availableStories, setAvailableStories] = useState<{ id: string, title?: string }[]>([]);
    const [selectedStoryId, setSelectedStoryId] = useState<string>(getTodayStr());

    const isAdmin = user?.email === "franginolucarini@gmail.com" || user?.displayName === "franginolucarini@gmail.com";

    useEffect(() => {
        if (!isAdmin) return;

        // Fetch all available stories once for the dropdown
        const fetchStories = async () => {
            try {
                const storiesRef = collection(db, "stories");
                const q = query(storiesRef, orderBy("id", "desc"));
                const snapshot = await getDocs(q);
                const stories = snapshot.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data().title
                }));
                setAvailableStories(stories);
            } catch (err) {
                console.error("Errore recupero storie:", err);
            }
        };

        fetchStories();
    }, [isAdmin]);

    useEffect(() => {
        if (!isAdmin || !selectedStoryId) return;

        setLoading(true);
        const contribsRef = collection(db, "stories", selectedStoryId, "contributions");
        const q = query(contribsRef, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Contribution[];
            setContributions(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isAdmin, selectedStoryId]);

    const handleDelete = async (id: string) => {
        if (!confirm("Sei sicuro di voler eliminare questa frase?")) return;
        try {
            await deleteDoc(doc(db, "stories", selectedStoryId, "contributions", id));
        } catch (error) {
            console.error("Errore durante l'eliminazione:", error);
            alert("Errore durante l'eliminazione. Controlla i permessi.");
        }
    };

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (adminInput.trim() === "franginolucarini@gmail.com") {
            setLoginLoading(true);
            try {
                await signInAsGuest(adminInput.trim());
            } catch (err) {
                console.error("Errore di blocco durante il login admin:", err);
                alert("Si è verificato un errore durante l'accesso.");
            } finally {
                setLoginLoading(false);
            }
        } else {
            alert("Email amministratore non valida o non autorizzata.");
        }
    };

    if (authLoading) return <div className="h-screen w-screen flex items-center justify-center bg-paper text-ink"><Loader2 className="animate-spin" /></div>;

    if (!user || !isAdmin) {
        return (
            <div className="flex h-screen items-center justify-center bg-paper flex-col gap-6 font-sans text-ink p-4">
                <Shield size={48} className="text-red-700" />
                <h1 className="text-3xl font-black uppercase tracking-tighter italic">Pannello di Controllo</h1>
                <p className="text-ink-muted text-sm max-w-sm text-center">Inserisci l'email di amministrazione per sbloccare la console.</p>
                <form onSubmit={handleAdminLogin} className="w-full max-w-sm space-y-4">
                    <input
                        type="email"
                        required
                        value={adminInput}
                        onChange={(e) => setAdminInput(e.target.value)}
                        placeholder="tua@email.com"
                        className="w-full bg-white border-2 border-ink p-4 font-sans outline-none focus:ring-2 focus:ring-ink/20 transition-all font-bold placeholder:font-normal shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)] text-center text-lg italic"
                    />
                    <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full flex justify-center items-center gap-2 bg-ink text-paper font-bold uppercase tracking-widest py-4 px-4 shadow-[4px_4px_0px_0px_#1a1a1a] hover:bg-ink/90 transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50"
                    >
                        {loginLoading ? <Loader2 className="animate-spin" size={20} /> : "Accedi al Pannello"}
                    </button>
                </form>
                <Link href="/" className="mt-8 text-xs font-bold uppercase tracking-widest text-ink-muted hover:text-ink underline">&larr; Torna a Scrivere</Link>
            </div>
        );
    }

    const stats = [
        { label: "Storie Attive", value: "1", icon: <Activity className="text-red-700" size={20} /> },
        { label: "Storie Archiviate", value: "0", icon: <FileText className="text-ink-muted" size={20} /> },
        { label: "Utenti Totali", value: "?", icon: <Users className="text-ink-muted" size={20} /> },
        { label: "Interventi J. Hortus", value: "0", icon: <FileText className="text-ink-muted" size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-paper font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-ink text-paper border-r border-ink flex flex-col">
                <div className="p-6 border-b border-paper/10">
                    <h1 className="text-2xl font-black tracking-tighter uppercase italic" style={{ textShadow: "1px 1px 0px #000" }}>
                        SCRIPT<span className="text-red-500">A</span><span className="ml-0.5 tracking-normal font-serif not-italic">24</span>
                    </h1>
                    <p className="text-[10px] text-paper/60 uppercase tracking-widest mt-1">Console di Comando</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-red-700 text-white font-bold text-sm tracking-wide shadow-[2px_2px_0px_0px_#1a1a1a]">
                        <LayoutDashboard size={18} /> Dashboard
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 text-paper/70 hover:text-white hover:bg-paper/10 font-medium text-sm transition-colors">
                        <FileText size={18} /> Gestione Storie
                    </a>
                </nav>
                <div className="p-4 border-t border-paper/10">
                    <Link href="/" className="flex items-center gap-3 px-4 py-2 text-paper/50 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                        &larr; Esci
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-white/50 space-y-8 p-8 max-w-5xl mx-auto">
                <header className="flex justify-between items-end border-b-2 border-ink pb-4">
                    <div>
                        <h2 className="text-3xl font-black text-ink uppercase tracking-tight">Panoramica Sistema</h2>
                        <p className="text-ink-muted text-sm font-bold mt-1">Stato: <span className="text-green-600">ONLINE</span></p>
                    </div>
                </header>

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

                <div className="bg-paper border-2 border-ink shadow-[4px_4px_0px_0px_#1a1a1a] overflow-hidden">
                    <div className="p-4 border-b-2 border-ink bg-ink/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <h3 className="font-bold text-sm uppercase tracking-widest text-ink">Contribuzioni di</h3>
                            <select
                                value={selectedStoryId}
                                onChange={(e) => setSelectedStoryId(e.target.value)}
                                className="bg-white border-2 border-ink text-ink font-bold text-sm py-1 px-3 outline-none focus:ring-2 focus:ring-ink/20 shadow-[2px_2px_0px_0px_#1a1a1a] cursor-pointer"
                            >
                                <option value={getTodayStr()}>Oggi (Live)</option>
                                {availableStories.filter(s => s.id !== getTodayStr()).map(story => (
                                    <option key={story.id} value={story.id}>
                                        {new Date(story.id).toLocaleDateString('it-IT')} - {story.title || "Senza Titolo"}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {selectedStoryId === getTodayStr() && (
                            <span className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full uppercase tracking-wider border border-green-200 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Live Sync
                            </span>
                        )}
                    </div>

                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b-2 border-ink text-xs uppercase tracking-wider text-ink-muted bg-white/50">
                                    <th className="p-4 font-bold w-[20%]">Autore</th>
                                    <th className="p-4 font-bold w-[70%]">Testo</th>
                                    <th className="p-4 font-bold w-[10%] text-right">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-ink/10">
                                {loading ? (
                                    <tr><td colSpan={3} className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-ink" /></td></tr>
                                ) : contributions.length === 0 ? (
                                    <tr><td colSpan={3} className="p-8 text-center text-ink-muted font-bold font-serif italic text-lg">Nessuna contribuzione trovata.</td></tr>
                                ) : (
                                    contributions.map(ctx => (
                                        <tr key={ctx.id} className="hover:bg-ink/5 transition-colors group">
                                            <td className="p-4 align-top">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ctx.isGhostwriter ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                                                    <span className="font-bold text-sm text-ink truncate">{ctx.authorName}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-serif text-ink text-lg leading-snug break-words">
                                                &ldquo;{ctx.text}&rdquo;
                                            </td>
                                            <td className="p-4 text-right align-top">
                                                <button
                                                    onClick={() => handleDelete(ctx.id)}
                                                    className="p-2 text-red-500 hover:text-white hover:bg-red-600 border-2 border-transparent hover:border-red-900 rounded transition-all shadow-none hover:shadow-[2px_2px_0px_0px_#7f1d1d] active:translate-y-px active:translate-x-px"
                                                    title="Elimina Definitivamente"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
