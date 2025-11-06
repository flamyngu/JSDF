import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const dbFile = "./jsdf.db";
const exists = fs.existsSync(dbFile);
const db = new sqlite3.Database(dbFile);

// Wenn Datenbank nicht existiert, aus schema.sql erstellen
if (!exists) {
  const schema = fs.readFileSync("./schema.sql", "utf8");
  db.exec(schema, (err) => {
    if (err) {
      console.error("❌ Fehler beim Erstellen der Datenbank:", err);
    } else {
      console.log("✅ Datenbank erstellt und initialisiert");
    }
  });
}

// API-Endpunkte
app.get("/units", (req, res) => {
  db.all("SELECT * FROM Unit ORDER BY id ASC", (err, rows) => {
    if (err) {
      console.error("❌ Fehler beim Laden der Units:", err);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.get("/branches", (req, res) => {
  db.all("SELECT * FROM Branch", (err, rows) => {
    if (err) {
      console.error("❌ Fehler beim Laden der Branches:", err);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.get("/personnel", (req, res) => {
  db.all("SELECT * FROM Personnel", (err, rows) => {
    if (err) {
      console.error("❌ Fehler beim Laden des Personals:", err);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.listen(4000, () => {
  console.log("📦 SQLite verbunden");
  console.log("🚀 Backend läuft auf http://localhost:4000");
  console.log("\nVerfügbare Endpoints:");
  console.log("  - GET http://localhost:4000/units");
  console.log("  - GET http://localhost:4000/branches");
  console.log("  - GET http://localhost:4000/personnel");
});

// Graceful shutdown
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("❌ Fehler beim Schließen der Datenbank:", err);
    } else {
      console.log("\n👋 Datenbank geschlossen");
    }
    process.exit(0);
  });
});