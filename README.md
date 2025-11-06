# Japan Self-Defense Forces – Organigramm

Eine interaktive Visualisierung der Organisationsstruktur der Japan Self-Defense Forces (JSDF) mit hierarchischem Baumdiagramm.

## 📋 Überblick

Dieses Projekt zeigt die militärische Organisationsstruktur der JSDF in einer interaktiven D3.js-Visualisierung. Die Daten werden aus einer SQLite-Datenbank geladen und als zoombare, hierarchische Baumstruktur dargestellt.

### Branches (Teilstreitkräfte)

- 🟢 **Ground Self-Defense Force** (Landstreitkräfte) - Grün
- 🔵 **Maritime Self-Defense Force** (Seestreitkräfte) - Blau  
- 🟠 **Air Self-Defense Force** (Luftstreitkräfte) - Orange

## 🚀 Installation

### Voraussetzungen

- Node.js (v14 oder höher)
- npm oder yarn

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

## 📦 Abhängigkeiten

### Backend
- `express` - Web-Framework
- `sqlite3` - Datenbank
- `cors` - Cross-Origin Resource Sharing

### Frontend
- `react` - UI-Framework
- `typescript` - Typsicherheit
- `d3` - Datenvisualisierung
- `vite` - Build-Tool

## 🗃️ Datenbankstruktur

Die SQLite-Datenbank enthält drei Tabellen:

### Branch
- `id` - Eindeutige ID
- `name` - Name der Teilstreitkraft
- `description` - Beschreibung

### Unit
- `id` - Eindeutige ID
- `name` - Name der Einheit
- `type` - Typ (Command, Division, Brigade, Wing, etc.)
- `parent_unit_id` - Referenz zur übergeordneten Einheit
- `branch_id` - Referenz zur Teilstreitkraft

### Personnel
- `id` - Eindeutige ID
- `name` - Name des Offiziers
- `rank` - Rang
- `position` - Position/Funktion
- `unit_id` - Referenz zur Einheit

## 🎯 Verwendung

### 1. Datenbank initialisieren

Beim ersten Start des Backend-Servers wird automatisch die Datenbank erstellt und mit Daten aus `schema.sql` gefüllt.

**Wichtig:** Falls Probleme auftreten:
```bash
# Datenbank zurücksetzen
rm database.db
```

### 2. Backend starten
```bash
cd backend
node server.js
```

Der Server läuft auf `http://localhost:4000`

### 3. Frontend starten
```bash
cd frontend
npm run dev
```

Das Frontend ist erreichbar unter `http://localhost:5173`

## 🎨 Features

- **Interaktives Zoomen & Scrollen** - Navigiere durch die große Hierarchie
- **Farbcodierung nach Branch** - Sofortige visuelle Unterscheidung der Teilstreitkräfte
- **Hover-Tooltips** - Zusätzliche Informationen beim Überfahren von Nodes
- **Hierarchische Darstellung** - Klare Visualisierung der Kommandostruktur
- **Responsive Layout** - Passt sich verschiedenen Bildschirmgrößen an

## 📊 API-Endpunkte

### GET /units
Gibt alle militärischen Einheiten zurück.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Ground Component Command",
    "type": "Command",
    "parent_unit_id": null,
    "branch_id": 1
  }
]
```

### GET /branches
Gibt alle Teilstreitkräfte zurück.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Japan Ground Self-Defense Force",
    "description": "Landstreitkräfte der JSDF"
  }
]
```

## 🛠️ Entwicklung

### Projekt-Struktur
```
.
├── backend/
│   ├── server.js          # Express-Server
│   ├── schema.sql         # Datenbankschema & Daten
│   └── database.db        # SQLite-Datenbank (generiert)
│
└── frontend/
    ├── src/
    │   ├── App.tsx        # Hauptkomponente mit D3-Visualisierung
    │   ├── main.tsx       # React-Einstiegspunkt
    │   └── index.css      # Globale Styles
    └── package.json
```

### Datenbank neu initialisieren
```bash
cd backend
rm database.db
node server.js
```

### Debugging

Die Frontend-Konsole zeigt detaillierte Logs:
- Geladene Units
- Hierarchie-Aufbau
- Rendering-Status

## 🐛 Troubleshooting

### "Fehler beim Erstellen des Organigramms: cycle"
Die Datenbank enthält zyklische Referenzen. Lösung:
1. Backend stoppen
2. `database.db` löschen
3. Backend neu starten

### "Keine Units gefunden"
Backend-Server läuft nicht oder falsche URL. Überprüfe:
- Ist der Server auf Port 4000 gestartet?
- Gibt `http://localhost:4000/units` Daten zurück?

### CORS-Fehler
Stelle sicher, dass das Backend mit aktiviertem CORS läuft.

## 📝 Lizenz

Dieses Projekt dient zu Bildungszwecken und ist frei verwendbar.

## 👥 Autoren

Martin Stanev & Nemanja Nesic

---

**Hinweis:** Die dargestellten Daten sind vereinfacht und dienen nur zu Demonstrationszwecken.
