"use client";

import { useState } from "react";
import { PenTool, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function ContributionInput() {
    const [text, setText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user, signInWithGoogle, loading } = useAuth();

    const words = text.trim() ? text.trim().split(/\s+/) : [];
    const wordCount = words.length;
    const isOverLimit = wordCount > 50;

    const containsUrl = /(http|https|www|\.it|\.com)/gi.test(text);
    const containsHtml = /<[^>]*>?/gm.test(text);

    // We only block the button if the text itself is invalid. 
    // We DO NOT block if the user is logged out, because we want them to click it.
    const isTextInvalid = isOverLimit || containsUrl || containsHtml || wordCount === 0;

    const handleSubmit = async () => {
        if (isTextInvalid) return;

        // If not logged in, prompt login FIRST before submitting
        if (!user) {
            try {
                await signInWithGoogle();
                return;
            } catch (err: any) {
                setError(`Errore auth: ${err.message || 'sconosciuto'}`);
                return;
            }
        }

        setError(null);
        setIsSubmitting(true);
        try {
            const todayStr = new Date().toISOString().split("T")[0];
            const contribsRef = collection(db, "stories", todayStr, "contributions");
            await addDoc(contribsRef, {
                text: text,
                authorId: user.uid,
                authorName: user.displayName || "Anonimo",
                authorImage: user.photoURL || null,
                createdAt: serverTimestamp(),
                isGhostwriter: false
            });
            setText("");
        } catch (err: any) {
            setError(err.message || "Errore durante l'invio della frase.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return null;

    return (
        <div className="fixed bottom-[44px] left-0 right-0 bg-gradient-to-t from-paper via-paper to-transparent pt-12 pb-4 px-4 z-50 pointer-events-none">
            <div className="max-w-2xl mx-auto pointer-events-auto">
                <div className={`bg-white/90 backdrop-blur-md border rounded-2xl p-3 shadow-lg flex items-end gap-3 transition-all focus-within:ring-2 ${error || isOverLimit || containsUrl || containsHtml ? 'border-red-400 focus-within:ring-red-400/20' : 'border-ink-faint focus-within:ring-ink/20'}`}>
                    <textarea
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                            setError(null);
                        }}
                        disabled={isSubmitting}
                        placeholder="Aggiungi la tua frase... (max 50 parole)"
                        className="w-full bg-transparent resize-none outline-none font-serif text-lg py-2 px-1 placeholder:text-ink-faint min-h-[52px] max-h-[120px] disabled:opacity-50"
                        rows={1}
                    />
                    <div className="flex flex-col items-end gap-2 pb-1 shrink-0">
                        <span className={`text-xs font-sans font-medium transition-colors ${isOverLimit ? 'text-red-500' : 'text-ink-muted'}`}>
                            {wordCount}/50
                        </span>
                        <button
                            onClick={handleSubmit}
                            disabled={isTextInvalid || isSubmitting}
                            className="bg-ink text-paper rounded-full p-2.5 hover:bg-ink/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            title={!user ? "Accedi per pubblicare" : "Pubblica"}
                        >
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <PenTool size={18} />}
                        </button>
                    </div>
                </div>
                <div className="h-6 mt-1 flex justify-center items-start">
                    {isOverLimit && <p className="text-red-500 text-xs font-sans">Hai superato il limite di 50 parole.</p>}
                    {containsUrl && <p className="text-red-500 text-xs font-sans">Non è consentito inserire link.</p>}
                    {containsHtml && <p className="text-red-500 text-xs font-sans">Caratteri non consentiti rilevati.</p>}
                    {error && <p className="text-red-500 text-xs font-sans">{error}</p>}
                    {!user && !error && !isTextInvalid && wordCount > 0 && (
                        <p className="text-ink-muted text-xs font-sans">Ti sarà richiesto di accedere al momento della pubblicazione.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
