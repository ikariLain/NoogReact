# React Noog – Samtalsstartare & Recorder

Detta repo innehåller den fristående React‑applikationen för **Noog**, specifikt ansvarig för att:

* Starta och hantera videosamtal via **Stream.IO**
* Sköta inspelningar (recordings)
* Skicka tillbaka inspelnings‑URL:er till vår backend‑endpoint

Applikationen är frikopplad från vårt huvud‑monorepo och fungerar som en separat frontend‑klient dedikerad till videosamtal.

---

## 📌 Översikt

Detta projekt är en del av det större Noog‑systemet som utvecklats av:
**Michael, Matheus, Oliver och Simon**.

Noog är en kollaborationsplattform där användare kan:

* Skapa konto och projektgrupper
* Bjuda in medlemmar
* Ha möten/samtal via video
* Få AI‑genererade sammanfattningar av sina möten
* Se dessa sammanfattningar inne i projektgrupperna

React‑klienten i detta repo är ansvarig för **den videorelaterade delen**.

---

## 🏗 Arkitektur i helheten

Denna React‑app är en del av följande ekosystem:

### 🔧 Backend

* ASP.NET Web API
* Identity Authentication
* .NET 8
* OpenAI – genererar mötessammanfattningar
* AssemblyAI – skapar transkript

### 🎨 Frontend (1)

* ASP.NET MVC med Razor
* ViewComponents & Layout‑struktur

### ⚛️ Frontend (2) – *detta repo*

* React (Vite) + TypeScript
* Stream.IO – samtal & videohantering

### 🧩 Microservice

* Express.js
* Stream.IO – Call CRUD

Länkar till övriga repos:

* Noog repo: [https://github.com/michaelw-jpg/noog](https://github.com/michaelw-jpg/noog)
* Microservice: [https://github.com/ikariLain/Noog-Express-Microservice](https://github.com/ikariLain/Noog-Express-Microservice)

---

## 🎥 Funktionalitet i detta repo

Denna React‑app hanterar allt som har med **videosamtal** att göra:

### ✔ Starta videosamtal

Ansvarig för att initiera ett Stream.IO‑samtal baserat på parametrar i URL:en:

```
/call?callId=...&userId=...&token=...
```

### ✔ Hantera inspelningar

* Hämta existerande recordings
* Vänta på nya recordings
* Sortera och identifiera senaste inspelningen

### ✔ Skicka inspelnings‑URL till backend

När inspelningen är klar skickas URL:en till en angiven .NET‑endpoint (vanligtvis i monorepot).

### ✔ Minimal UI

React‑appen används inte som huvudsaklig frontend, därför är den avskalad och fokuserad.

---

## 🚀 Installation

```bash
npm install
npm run dev
```

Miljövariabler krävs för Stream.IO:

```
VITE_STREAM_API_KEY=...
VITE_STREAMIO_SECRET=...
```

---

## 🌐 Deployment

Produkten är del av Noogs helhet som är driftsatt här:
👉 [https://noogmvc-dagbgyecakdcecem.swedencentral-01.azurewebsites.net/](https://noogmvc-dagbgyecakdcecem.swedencentral-01.azurewebsites.net/)

React‑appen driftsätts separat (Vercel):
[https://noog-react.vercel.app/](https://noog-react.vercel.app/)

Express.js Api (Render):
[https://noog-express-microservice.onrender.com/](https://noog-express-microservice.onrender.com/)

---

## 📭 Kontakt / Team
* **[Matheus Torrico](https://github.com/ikariLain)** (Repo ägare)
* **[Michael Wortel](https://github.com/michaelw-jpg)**
* **[Oliver garderud williams](https://github.com/OliverWG-net)**
* **[Simon Eke](https://github.com/Simon-Eke)**

---

## 📄 Licens

Endast för utbildningssyfte inom vårt skolprojekt.
