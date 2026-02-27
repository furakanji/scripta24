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
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

async function runGhostwriter() {
    console.log("👻 Controllo attività per J. Hortus...");

    try {
        const todayStr = new Date().toISOString().split("T")[0];
        const storyRef = db.collection("stories").doc(todayStr);

        const docSnapshot = await storyRef.get();
        if (!docSnapshot.exists) {
            console.log("Story doc doesn't exist yet for today.");
            process.exit(0);
        }

        const story = docSnapshot.data();
        if (story.status === "closed") {
            console.log("Story is closed. Hortus rests.");
            process.exit(0);
        }

        // Recuperiamo l'ultimo aggiornamento registrato O, se assente/invalido, l'ultima contribuzione
        let lastActivityTimeMillis = story.updatedAt?.toMillis() || story.createdAt?.toMillis() || 0;

        const contribSnapshot = await storyRef.collection("contributions")
            .orderBy("createdAt", "desc")
            .limit(1)
            .get();

        if (!contribSnapshot.empty) {
            const lastContribDateMillis = contribSnapshot.docs[0].data().createdAt?.toMillis() || 0;
            // Usa il tempo più recente tra l'aggiornamento del documento e l'ultimo commento.
            if (lastContribDateMillis > lastActivityTimeMillis) {
                lastActivityTimeMillis = lastContribDateMillis;
            }
        }

        const now = Date.now();
        const ONE_HOUR = 60 * 60 * 1000;

        const timeSinceLastActivity = now - lastActivityTimeMillis;

        const force = process.argv.includes("--force");
        if (timeSinceLastActivity < ONE_HOUR && !force) {
            console.log(`⏱️ Ultima attività rilevata a meno di un'ora fa (${Math.round(timeSinceLastActivity / 60000)} minuti fa). Nessun intervento necessario.`);
            process.exit(0);
        }

        console.log("📜 Inattività rilevata! J. Hortus entra in azione.");

        // Recuperiamo tutte le contribuzioni per dare contesto a Gemini
        const allContribsSnapshot = await storyRef.collection("contributions")
            .orderBy("createdAt", "asc")
            .get();

        let history = story.incipit + " ";
        allContribsSnapshot.forEach(s => history += s.data().text + " ");

        const prompt = `Sei J. Hortus, un ghostwriter misterioso e sottile che partecipa a un racconto collettivo online.
        Continua la storia seguendo lo stile del racconto e tenendo conto delle frasi precedenti.
        Scrivi UNA SOLA frase (massimo 50 parole). Niente presentazioni, niente virgolette, solo il testo della continuazione nudo e crudo.
        Cerca di portare avanti la narrazione o introdurre un piccolo dettaglio misterioso.
        La storia finora: ${history}`;

        console.log("🧠 Chiamata a Gemini per generare la frase...");
        const result = await model.generateContent(prompt);
        let newSentence = result.response.text().trim();

        // Pulizia output modello (spesso aggiunge virgolette o va a capo)
        newSentence = newSentence.replace(/^"|"$/g, "").trim();

        if (!newSentence) {
            throw new Error("Gemini ha restituito un testo vuoto.");
        }

        console.log(`🤖 J. Hortus ha scritto: "${newSentence}"`);

        await storyRef.collection("contributions").add({
            text: newSentence,
            authorId: "ghostwriter",
            authorName: "J. Hortus",
            authorImage: null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            isGhostwriter: true
        });

        // Aggiorniamo l'orario del documento padre per la prossima verifica
        await storyRef.set({ updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });

        console.log("✅ Contribuzione di J. Hortus salvata su Firebase.");
        process.exit(0);

    } catch (error) {
        console.error("❌ Errore durante J. Hortus:", error);
        process.exit(1);
    }
}

runGhostwriter();
