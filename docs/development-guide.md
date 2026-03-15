# Fejlesztői Útmutató

Ez a dokumentum segítséget nyújt a fejlesztői környezet beállításához és a munkafolyamatokhoz.

## 🚀 Első lépések

### Előfeltételek
- **Node.js:** >= 18.0.0
- **Csomagkezelő:** npm (alapértelmezett)

### Telepítés
1. Klónozd a tárolót.
2. Futtasd a függőségek telepítését:
   ```bash
   npm install
   ```

## 🛠️ Fejlesztői parancsok

| Parancs | Leírás |
| :--- | :--- |
| `npm run dev` | Fejlesztői szerver indítása (HMR támogatással). |
| `npm run build` | Alkalmazás fordítása produkciós verzióra (`dist` mappa). |
| `npm run preview` | Produkciós build helyi tesztelése. |
| `npm run test` | Egységtesztek futtatása (Jest). |
| `npm run lint` | Kódminőség ellenőrzése (ESLint). |
| `npm run format` | Kód automatikus formázása (Prettier). |

## 🧪 Tesztelési folyamat

- **Unit tesztek:** `src/**/*.test.js` fájlokban, Jest segítségével.
- **E2E tesztek:** Cypress alapú tesztek a stabil funkciók ellenőrzésére.
- **Lefedettség:** `npm run test:coverage` paranccsal ellenőrizhető.

## 📐 Kódolási konvenciók

- **Nyelv:** Modern JavaScript (ES6+).
- **Stílus:** A Prettier és ESLint szabályok betartása kötelező.
- **Komponensek:** Vue 3 Single File Components (SFC).
- **Architektúra:** Mindig tartsd be a **SEL Architecture** alapelveit (State, Events, Logging).

## 📦 Build és Deployment

A build folyamat során a Vite optimalizált fájlokat generál a `dist/` mappába. Ezek a fájlok bármilyen modern webszerveren kiszolgálhatók.
Fontos: A `public/` mappa tartalma változtatás nélkül másolódik a build gyökerébe.
