"use client";

import { useState, useEffect } from "react";
import { collection, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ContributionInput } from "@/components/ContributionInput";
import { Footer } from "@/components/Footer";
import { getTodayStr } from "@/lib/date";

export default function Home() {
  const [story, setStory] = useState<any>(null);
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get today's date formatted as YYYY-MM-DD
    const todayStr = getTodayStr();

    // 2. Listen to today's story document
    const storyRef = doc(db, "stories", todayStr);
    const unsubStory = onSnapshot(storyRef, (docSnap) => {
      if (docSnap.exists()) {
        setStory({ id: docSnap.id, ...docSnap.data() });
      } else {
        setStory(null);
      }
      setLoading(false);
    });

    // 3. Listen to today's contributions
    const contribsRef = collection(db, "stories", todayStr, "contributions");
    const q = query(contribsRef, orderBy("createdAt", "asc"));
    const unsubContribs = onSnapshot(q, (snapshot) => {
      const texts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContributions(texts);
    });

    return () => {
      unsubStory();
      unsubContribs();
    };
  }, []);

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
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-red-700 border-t-transparent animate-spin"></div>
          </div>
        ) : !story ? (
          <div className="text-center py-20 space-y-4">
            <h2 className="text-2xl font-bold font-serif text-ink">In attesa dell'incipit...</h2>
            <p className="text-ink-muted font-sans text-sm">L'intelligenza artificiale (The Spark) non ha ancora scoccato la scintilla di oggi.</p>
            <p className="text-xs text-ink-muted/50 mt-4">(Questo accade solitamente a mezzanotte)</p>
          </div>
        ) : (
          <article className="space-y-6 text-xl leading-relaxed">
            <div className="text-center space-y-2 mb-12">
              <h2 className="text-4xl font-bold font-serif">{story.title}</h2>
              <p className="text-sm font-sans text-ink-muted uppercase tracking-wider">Genere suggerito: {story.genre}</p>
            </div>

            {/* The Spark Incipit */}
            <p className="group relative">
              <span className="text-3xl float-left mr-2 font-bold opacity-80 mt-1 text-red-700">{story.incipit ? story.incipit.charAt(0) : ''}</span>
              <span className="relative z-10">{story.incipit ? story.incipit.slice(1) : ''}</span>
              <span className="absolute -left-6 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-sans text-ink-muted cursor-help" title="Generato dall'IA (The Spark)">✨</span>
            </p>

            {/* Contributions */}
            {contributions.map((c: any) => (
              <p key={c.id} className="group relative indent-8 border-l border-ink-faint/30 pl-4 ml-[-1rem]">
                <span className="relative z-10">{c.text}</span>
                <span className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-sans text-ink-muted cursor-pointer" title={`Scritto da ${c.authorName}`}>
                  {c.isGhostwriter ? '👻' : '👤'}
                </span>
              </p>
            ))}
          </article>
        )}
      </main>

      <Footer />
      <ContributionInput />
    </div>
  );
}
