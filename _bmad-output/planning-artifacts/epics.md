# DIGITÁLIS KULTÚRA VERSENY - EPIKUSOK ÉS USER STORY-K

## 📋 Áttekintés

Ez a dokumentum a projekt tényleges állapotát tükrözi (**v0.16.1**).

---

## 🏗️ 1. CORE ENGINE & INFRASTRUCTURE [DONE]

### Epic 1: SEL Architecture & State Management [DONE]
### Epic 2: Visual Effects & Portal System [DONE]
- Portál Shader és részecske rendszer implementálása.
- v0.9.4: Videólejátszás és portál tranzíció szinkronizálása.

---

## 🎮 3. GRADE 3 (3. OSZTÁLY) TARTALOM [DONE]

### Epic 3: Stations 1-5 [DONE]
- Story 3.1: Maze (Útvesztő) [DONE]
- Story 3.2: Pixel Palota (Puzzle) [DONE]
- Story 3.3: Station 3 [DONE]
- Story 3.4: Station 4 [DONE]
- Story 3.5: Hangerdő (Sound) [DONE]

### Epic 4: Finale - "Nagy Zár" [DONE]
- Story 4.1: Final Story Conclusion [DONE]
- Story 4.2: Finale Interaction [DONE]
- Story 4.3: Portal SFX Integration [DONE]

---

## 🛠️ 5. REFAKTORÁLÁS ÉS MINŐSÉG [DONE]

### Epic 5: Rendszer Konszolidáció (v0.11.0 - v0.13.0) [DONE]
- Strukturált naplózás (`GameLogger`).
- Perzisztencia konszolidáció (`SecureStorage`).
- Unit Teszt Alapozás (~89% lefedettség).

### Epic 6: Clean Engine Architekturális Refaktor (v0.16.0) [DONE]
- `main.js` teljes refaktorálása (Logic vs Content separation).
- Dinamikus feladat betöltés (Lazy Loading).
- Multi-Grade shell támogatás.

### Epic 7: Grade 3 Felhasználói Élmény & Súgó (v0.16.1) [IN PROGRESS]
- Globális Súgó (Tooltip) alapstruktúra és design implementálása.
- SoundGame (Hangerdő) Súgó implementálása [DONE].
- Dinamikus Sound visszajelzések és Vége gomb javítás [DONE].
- BEM struktúra és stílus tisztítás (no !important) [DONE].
- További feladatok (Maze, Memory, Quiz, Finale) Súgó szövegezése [TODO].

---

## 🚀 6. KÖVETKEZŐ LÉPÉSEK

### Epic 8: Grade 4-6 Tartalom Implementálása [BACKLOG]
- Story 7.1: Grade 4 (Loavag) állomások és rejtvények.
- Story 7.2: Grade 5 (Cyberpunk) állomások és rejtvények.
- Story 7.3: Grade 6 (Sci-Fi) állomások és rejtvények.
