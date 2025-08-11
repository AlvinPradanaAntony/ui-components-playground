/**
 * Firestore Seeder
 * 1) Put Admin SDK key at scripts/serviceAccountKey.json
 * 2) npm run seed:firestore
 */
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const keyPath = path.resolve(__dirname, "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) {
  console.error("❌ Missing scripts/serviceAccountKey.json");
  process.exit(1);
}
const serviceAccount = require(keyPath);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function seed(col, arr) {
  console.log(`Seeding ${col} (${arr.length})...`);
  const batch = db.batch();
  for (const d of arr) {
    batch.set(db.collection(col).doc(d.id), d, { merge: true });
  }
  await batch.commit();
  console.log(`✅ ${col} done.`);
}

(async () => {
  const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "seed-data.json"), "utf-8"));
  await seed("categories", data.categories);
  await seed("components", data.components);
  console.log("🎉 Seeding finished.");
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
