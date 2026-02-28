require("dotenv").config({ path: ".env.local" });
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Setup Firebase Admin with Service Account
try {
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        serviceAccount = require("./service.json");
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: "scripta24-e7b4b",
    });
} catch (e) {
    console.error("Firebase Initialization Error:", e);
    process.exit(1);
}

const db = admin.firestore();

// Setup Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro",
    systemInstruction: "Sei uno scrittore creativo italiano specializzato in narrativa breve e avvincente. Scrivi sempre e solo in italiano.",
    generationConfig: {
        temperature: 0.8,
    }
});

async function generateDailyStory() {
    console.log("🚀 Chiamata a Gemini per generare l'incipit della storia...");

    try {
        const prompt = `
        Genera un nuovo incipit (massimo 30 parole) per una storia narrativa.
        Inventati anche un Titolo e un Genere per la storia.
        Rispondi ESATTAMENTE in questo formato JSON (senza nessun markdown o testo extra):
        {
            "title": "Titolo Inventato",
            "genre": "Genere",
            "incipit": "L'incipit creativo della storia in massimo 30 parole..."
        }
    `;

        const result = await model.generateContent(prompt);
        let output = result.response.text().trim();

        // Rimuovi eventuali backtick da markdown (spesso aggiunti dall'AI)
        output = output.replace(/^```json/g, "").replace(/```$/g, "").trim();

        const storyData = JSON.parse(output);

        if (!storyData.title || !storyData.genre || !storyData.incipit) {
            throw new Error("Formato AI non valido.");
        }

        const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

        console.log(`\n✅ Storia generata per il ${todayStr}:`);
        console.log(`- Titolo: ${storyData.title}`);
        console.log(`- Genere: ${storyData.genre}`);
        console.log(`- Incipit: ${storyData.incipit}\n`);

        console.log("💾 Salvataggio in corso su Firestore...");

        await db.collection("stories").doc(todayStr).set({
            title: storyData.title,
            genre: storyData.genre,
            incipit: storyData.incipit,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("🎉 Salvataggio completato con successo su Firebase!");
        process.exit(0);

    } catch (err) {
        console.error("❌ ERRORE GENERAZIONE STORIA:", err);
        process.exit(1);
    }
}

// Esegui la funzione
generateDailyStory();
