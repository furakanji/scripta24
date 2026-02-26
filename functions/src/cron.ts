import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as cheerio from "cheerio";

const db = admin.firestore();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const dailySpark = onSchedule({
    schedule: "1 0 * * *",
    timeZone: "Europe/Rome"
}, async (event) => {
    if (!process.env.GEMINI_API_KEY) return;
    const today = new Date().toISOString().split("T")[0];

    try {
        // 1. Scrape inspiration
        let ilPostTitle = "La lenta ricostruzione delle città europee";
        try {
            const response = await fetch("https://www.ilpost.it/");
            const html = await response.text();
            const $ = cheerio.load(html);
            // Fallback scraping
            ilPostTitle = $("h2 a").first().text().trim() || ilPostTitle;
        } catch (e) {
            console.warn("ilpost scrape failed", e);
        }

        let quote = "Il vero viaggio di scoperta non consiste nel cercare nuove terre, ma nell'avere nuovi occhi.";
        try {
            const response = await fetch("https://it.wikiquote.org/wiki/Pagina_principale");
            const html = await response.text();
            // simplified scrape for wikiquote
            quote = cheerio.load(html)("#mf-qotd div").first().text().trim() || quote;
        } catch (e) {
            console.warn("wikiquote scrape failed", e);
        }

        // 2. Generate Spark via Gemini
        const prompt = `Sei un maestro di scrittura creativa. Prendi ispirazione da questo titolo di giornale: "${ilPostTitle}" e da questa citazione: "${quote}".
    Crea un Titolo, un Genere Letterario (molto breve), e un Incipit (massimo 30 parole) per un racconto collettivo.
    Regola fondamentale: È tassativamente vietato citare nomi propri di persone reali (politici, attori, figure pubbliche). Astrai i temi in concetti narrativi universali o fantastici.
    
    Rispondi rigorosamente in questo formato JSON:
    {
      "title": "Titolo",
      "genre": "Genere",
      "incipit": "Incipit di massimo 30 parole..."
    }`;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        let out = result.response.text().trim();
        if (out.startsWith("\`\`\`json")) {
            out = out.replace(/\`\`\`json/, "").replace(/\`\`\`/, "").trim();
        }
        const data = JSON.parse(out);

        // 3. Save to Firestore
        await db.collection("stories").doc(today).set({
            id: today,
            title: data.title,
            genre: data.genre,
            incipit: data.incipit,
            status: "active",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Daily spark generated for ${today}: ${data.title}`);
    } catch (error) {
        console.error("Error in dailySpark:", error);
    }
});

export const ghostwriterHortus = onSchedule({
    schedule: "every 30 minutes"
}, async (event) => {
    if (!process.env.GEMINI_API_KEY) return;
    const today = new Date().toISOString().split("T")[0];
    const storyRef = db.collection("stories").doc(today);

    try {
        const doc = await storyRef.get();
        if (!doc.exists) return;
        const story = doc.data();
        if (story?.status !== "active") return;

        // Check if updatedAt is older than 60 minutes
        const now = Date.now();
        const updatedAt = story.updatedAt?.toMillis() || 0;
        if (now - updatedAt < 60 * 60 * 1000) {
            return; // Not enough time has passed
        }

        // Fetch last contributions
        const snapshot = await storyRef.collection("contributions").orderBy("createdAt", "asc").limitToLast(10).get();
        let history = story.incipit + " ";
        snapshot.forEach(s => history += s.data().text + " ");

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Sei J. Hortus, un ghostwriter misterioso e abile che partecipa a un racconto collettivo online.
    Continua la storia seguendo lo stile del racconto e tenendo conto delle frasi precedenti.
    Scrivi UNA SOLA frase (massimo 50 parole). Niente presentazioni o saluti, solo il testo della continuazione.
    La storia finora: ${history}`;

        const result = await model.generateContent(prompt);
        const newSentence = result.response.text().trim().replace(/^"|"$/g, "");

        await storyRef.collection("contributions").add({
            authorId: "ghostwriter",
            authorName: "J. Hortus",
            text: newSentence,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            isGhostwriter: true
        });

        await storyRef.set({ updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
        console.log("J. Hortus added a contribution");
    } catch (error) {
        console.error("Error in ghostwriterHortus:", error);
    }
});

export const closeStoryAndSummarize = onSchedule({
    schedule: "59 23 * * *",
    timeZone: "Europe/Rome"
}, async (event) => {
    if (!process.env.GEMINI_API_KEY) return;
    const today = new Date().toISOString().split("T")[0];
    const storyRef = db.collection("stories").doc(today);

    try {
        const doc = await storyRef.get();
        if (!doc.exists) return;

        // Update status
        await storyRef.update({ status: "closed" });

        // Read full story
        const snapshot = await storyRef.collection("contributions").orderBy("createdAt", "asc").get();
        let fullStory = doc.data()?.incipit + " ";
        snapshot.forEach(s => fullStory += s.data().text + " ");

        // Summarize
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Agisci come un critico letterario contemporaneo. Scrivi un breve riassunto critico (1 paragrafo, circa 100 parole)
    a commento di questo racconto surreale a più mani intitolato "${doc.data()?.title}". 
    Ecco il testo completo del racconto:
    ${fullStory}`;

        const result = await model.generateContent(prompt);
        const summary = result.response.text().trim();

        // Note: Imagen API generation could go here if using Vertex AI.
        // We'll leave the image logic to a placeholder or client-side flow.

        await storyRef.update({
            summary: summary,
            coverImageUrl: "https://via.placeholder.com/1080x1350.png?text=Scripta24"
        });

        console.log(`Story closed and summarized for ${today}`);
    } catch (error) {
        console.error("Error in closeStoryAndSummarize:", error);
    }
});

import { Resend } from "resend";

export const sendDailyRecap = onSchedule({
    schedule: "0 8 * * *",
    timeZone: "Europe/Rome"
}, async (event) => {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY missing");
        return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const db = admin.firestore();

    // The story to send is from yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const storyId = yesterday.toISOString().split("T")[0];

    try {
        const storyDoc = await db.collection("stories").doc(storyId).get();
        if (!storyDoc.exists) return;

        const snapshot = await db.collection("stories").doc(storyId).collection("contributions").orderBy("createdAt", "asc").get();
        let textBody = storyDoc.data()?.incipit + " ";
        snapshot.forEach(s => textBody += s.data().text + " ");

        const storyTitle = storyDoc.data()?.title;

        // In a real scenario, you'd batch this or check a users collection.
        // Here we list up to 1000 users from auth.
        const listUsersResult = await admin.auth().listUsers(1000);
        const emails = listUsersResult.users.map(u => u.email).filter(e => !!e) as string[];

        if (emails.length === 0) return;

        // Send emails in chunks if needed. For now, simple loop or resend batch.
        const chunkSize = 50;
        for (let i = 0; i < emails.length; i += chunkSize) {
            const chunk = emails.slice(i, i + chunkSize);
            await resend.emails.send({
                from: "Scripta24 <hello@scripta24.it>",
                to: chunk,
                subject: `La storia di ieri: ${storyTitle}`,
                html: `
          <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="text-align: center;">${storyTitle}</h1>
            <img src="${storyDoc.data()?.coverImageUrl}" style="width: 100%; border-radius: 8px;" />
            <p style="font-size: 18px; line-height: 1.6; margin-top: 30px;">
              ${textBody}
            </p>
            <hr style="margin: 40px 0;" />
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; font-family: sans-serif; font-size: 14px;">
              <strong>Nota della Redazione (AI):</strong> ${storyDoc.data()?.summary}
            </div>
          </div>
        `
            });
        }

        console.log(`Sent recap emails for ${storyId}`);
    } catch (error) {
        console.error("Error in sendDailyRecap:", error);
    }
});
