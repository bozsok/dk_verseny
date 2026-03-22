# DIGITÁLIS KULTÚRA VERSENY - EPIKUSOK ÉS USER STORY-K

## 📋 Áttekintés

Ez a dokumentum a projekt tényleges állapotát tükrözi (**v0.16.6**).

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

### Epic 7: Grade 3 Felhasználói Élmény & Súgó (v0.16.1) [DONE]
- Globális Súgó (Tooltip) alapstruktúra és design implementálása.
- SoundGame (Hangerdő) Súgó implementálása [DONE].
- Dinamikus Sound visszajelzések és Vége gomb javítás [DONE].
- BEM struktúra és stílus tisztítás (no !important) [DONE].
- További feladatok (Maze, Memory, Quiz, Finale) Súgó szövegezése [DONE].

---

## 🚀 6. KÖVETKEZŐ LÉPÉSEK

### Epic 8: Interaktív Tutorial Rendszer (v0.16.6) [DONE]

- **Story 8.1**: Tutorial `cloneNode` alapú kiemelési mechanizmus [DONE]
  - Az éppen bemutatott elem mélységi klónja a `document.body`-ba kerül `position: fixed; z-index: 2601`-gyel
  - `transform: none`, `right: auto`, `bottom: auto` CSS reset az örökölt konfliktusok megakadályozására
  - `borderColor` türkizre állítva minden klónon; inventory sloton külön

- **Story 8.2**: Tutorial lépések sorrendje és konfigurációja [DONE]
  - 10 lépés: Karakterkép → Becenév → Pont → Idővonal → Hanglejátszó → Eltelt idő → Küldetésnapló → Narráció → Inventory → Tovább gomb

- **Story 8.3**: Animált megjelenés és eltűnés [DONE]
  - Klón: `fade-in + scale(0.97→1)` / `fade-out + scale` CSS keyframe animációkkal
  - Tooltip: step-váltáskor fade-out (280ms) majd fade-in az új pozíción, y-irányú mozgás nélkül

- **Story 8.4**: Tutorial overlay és tooltip [DONE]
  - `dkv-is-visible` osztályváltáson alapuló `opacity` transition
  - `positionTooltip()` a `dkv-is-visible` előtt fut → nincs felvillanás az előző pozíción
  - Egységes gomb stílusok, hover y-mozgás nélkül

- **Story 8.5**: Hibajavítások [DONE]
  - `design-system.css`: tiltott `z-index: var(--z-onboarding-modal) !important` eltávolítva a timer-ről
  - `SlideManager.js`: hiányzó `getCurrentIndex()` és `getSlides()` metódusok implementálva
  - Post-tutorial narráció és videó helyesen indul az `onTutorialFinished()` callbackből

### Epic 9: Grade 4-6 Tartalom Implementálása [BACKLOG]
- Story 9.1: Grade 4 (Lovag) állomások és rejtvények.
- Story 9.2: Grade 5 (Cyberpunk) állomások és rejtvények.
- Story 9.3: Grade 6 (Sci-Fi) állomások és rejtvények.
