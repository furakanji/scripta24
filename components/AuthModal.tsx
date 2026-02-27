import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, X, Mail } from "lucide-react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

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
            <div className="bg-paper border-2 border-ink shadow-[8px_8px_0px_0px_#1a1a1a] p-6 w-full max-w-sm relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-ink hover:bg-ink/10 p-1 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-black uppercase tracking-tight text-ink mb-6">
                    {isLogin ? "Accedi" : "Registrati"}
                </h2>

                <button
                    onClick={handleGoogle}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-white border-2 border-ink text-ink font-bold py-3 px-4 shadow-[2px_2px_0px_0px_#1a1a1a] hover:bg-ink/5 transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none mb-6 relative"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continua con Google
                    {isLoading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><Loader2 className="animate-spin text-ink" size={20} /></div>}
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-ink/20"></div>
                    <span className="text-xs font-bold text-ink-muted uppercase tracking-widest">Oppure</span>
                    <div className="flex-1 h-px bg-ink/20"></div>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wide text-ink mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-transparent border-2 border-ink p-2 font-sans outline-none focus:ring-2 focus:ring-ink/20 transition-all"
                            placeholder="tua@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wide text-ink mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-transparent border-2 border-ink p-2 font-sans outline-none focus:ring-2 focus:ring-ink/20 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs font-bold bg-red-100 p-2 border border-red-200">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-2 bg-ink text-paper font-bold uppercase tracking-widest py-3 px-4 shadow-[2px_2px_0px_0px_#1a1a1a] hover:bg-ink/90 transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Mail size={18} />}
                        {isLogin ? "Accedi con Email" : "Registrati con Email"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setError(null); }}
                        className="text-xs font-bold text-ink-muted hover:text-ink underline uppercase tracking-wider"
                    >
                        {isLogin ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
                    </button>
                </div>
            </div>
        </div>
    );
}
