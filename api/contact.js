import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "portfolio";

// Cache client across invocations (critical on Vercel)
let cachedClient = global._mongoClient;
if (!cachedClient) {
  cachedClient = global._mongoClient = new MongoClient(uri);
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    await cachedClient.connect();
    const db = cachedClient.db(dbName);

    const result = await db.collection("messages").insertOne({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: (subject || "").trim(),
      message: message.trim(),
      read: false,
      createdAt: new Date(),
    });

    return res.status(201).json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error("Contact API error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
