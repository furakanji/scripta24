import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, X, Mail } from "lucide-react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInAsGuest } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [guestName, setGuestName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    if (!isOpen) return null;

    const handleGuestAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = guestName.trim();
        if (!trimmedName) return;

        setError(null);
        setIsLoading(true);
        try {
            await signInAsGuest(trimmedName);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Errore durante l'accesso come ospite");
            setIsLoading(false);
        }
    };

    const handleGoogle = async () => {
        try {
            setError(null);
            setIsLoading(true);
            await signInWithGoogle();
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Errore con Google");
            setIsLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            if (isLogin) {
                await signInWithEmail(email, password);
            } else {
                await signUpWithEmail(email, password);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Errore di autenticazione");
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
            <div className="bg-paper border-2 border-ink shadow-[8px_8px_0px_0px_#1a1a1a] w-full max-w-md relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-ink hover:bg-ink/10 p-1 rounded-full transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8 pb-6">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-ink mb-2">
                        Firma la tua frase
                    </h2>
                    <p className="text-ink-muted font-sans text-sm mb-8 leading-relaxed">
                        Scegli come farti chiamare. Il nome apparirà sotto la tua frase nella storia.
                    </p>

                    <form onSubmit={handleGuestAuth} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-ink mb-2">Il tuo Pseudonimo</label>
                            <input
                                type="text"
                                required
                                maxLength={30}
                                value={guestName}
                                onChange={e => setGuestName(e.target.value)}
                                className="w-full bg-white border-2 border-ink p-4 text-lg font-serif outline-none focus:ring-2 focus:ring-ink/20 transition-all font-bold placeholder:font-normal placeholder:italic shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)]"
                                placeholder="es. Italo Calvino, Volpe_89..."
                            />
                        </div>

                        {error && !showAdvanced && <p className="text-red-500 text-xs font-bold bg-red-100 p-3 border border-red-200">{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading || !guestName.trim()}
                            className="w-full flex justify-center items-center gap-2 bg-ink text-paper font-bold uppercase tracking-widest py-4 px-4 shadow-[4px_4px_0px_0px_#1a1a1a] hover:bg-ink/90 transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0px_0px_#1a1a1a]"
                        >
                            {isLoading && !showAdvanced ? <Loader2 className="animate-spin" size={20} /> : null}
                            Pubblica subito
                        </button>
                    </form>
                </div>

                <div className="bg-ink/5 border-t border-ink/10 p-8 pt-6">
                    {!showAdvanced ? (
                        <button
                            onClick={() => setShowAdvanced(true)}
                            className="w-full text-center text-xs font-bold text-ink-muted hover:text-ink transition-colors uppercase tracking-widest flex flex-col items-center gap-2"
                        >
                            <span>Preferisci usare un account permanente?</span>
                            <span className="underline decoration-ink/30 underline-offset-4">Mostra opzioni Google e Email</span>
                        </button>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-ink mb-4 text-center">Account Permanente</h3>
                            <button
                                onClick={handleGoogle}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-ink text-ink font-bold py-3 px-4 shadow-[2px_2px_0px_0px_#1a1a1a] hover:bg-ink/5 transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none mb-6 relative text-sm"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Usa Google
                                {isLoading && showAdvanced && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><Loader2 className="animate-spin text-ink" size={20} /></div>}
                            </button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1 h-px bg-ink/20"></div>
                                <span className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Oppure E-mail</span>
                                <div className="flex-1 h-px bg-ink/20"></div>
                            </div>

                            <form onSubmit={handleEmailAuth} className="space-y-4">
                                <div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full bg-white border border-ink p-2 font-sans text-sm outline-none focus:ring-1 focus:ring-ink transition-all"
                                        placeholder="tua@email.com"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full bg-white border border-ink p-2 font-sans text-sm outline-none focus:ring-1 focus:ring-ink transition-all"
                                        placeholder="Password"
                                    />
                                </div>

                                {error && showAdvanced && <p className="text-red-500 text-xs font-bold bg-red-100 p-2 border border-red-200">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center items-center gap-2 bg-transparent border-2 border-ink text-ink font-bold uppercase tracking-widest py-2 px-4 hover:bg-ink hover:text-paper transition-all disabled:opacity-50 text-xs"
                                >
                                    {isLoading && showAdvanced ? <Loader2 className="animate-spin" size={14} /> : <Mail size={14} />}
                                    {isLogin ? "Accedi" : "Registrati"}
                                </button>
                            </form>

                            <div className="mt-4 text-center">
                                <button
                                    type="button"
                                    onClick={() => { setIsLogin(!isLogin); setError(null); }}
                                    className="text-[10px] font-bold text-ink-muted hover:text-ink underline uppercase tracking-wider"
                                >
                                    {isLogin ? "Non hai l'account? Registrati" : "Hai già l'account? Accedi"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
