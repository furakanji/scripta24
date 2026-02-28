const admin = require('firebase-admin');

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : require('./scripta24-e7b4b-firebase-adminsdk-fbsvc-c6b7385be4.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();

const todayStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
}).format(new Date());

async function run() {
    console.log(`Checking contributions for ${todayStr}...`);
    const contribsRef = db.collection('stories').doc(todayStr).collection('contributions');
    const snapshot = await contribsRef.where('authorName', '==', 'franginolucarini@gmail.com').get();

    if (snapshot.empty) {
        console.log('No contributions found with authorName = franginolucarini@gmail.com');

        // Let's also check if they wrote their email in the text itself just in case
        const textSnapshot = await contribsRef.where('text', '==', 'franginolucarini@gmail.com').get();
        if (textSnapshot.empty) {
            console.log('No contributions found with text = franginolucarini@gmail.com either.');
            return;
        } else {
            for (const doc of textSnapshot.docs) {
                console.log(`Deleting contribution: ${doc.id}`);
                await doc.ref.delete();
            }
        }
    } else {
        for (const doc of snapshot.docs) {
            console.log(`Deleting contribution: ${doc.id}`);
            await doc.ref.delete();
        }
    }
}

run().catch(console.error).finally(() => process.exit(0));
