# Sprint 3: Rejtvény Engine és az első állomások

**Cél:** A feladatkezelő rendszer (`TaskSlide`) alapjainak lefektetése és az első két interaktív állomás (Maze, Puzzle) implementálása.

---

## 🏗️ 1. Task Engine Alapok (DONE)

### Story 3.1: TaskSlide Keretrendszer
- **As a** Fejlesztő
- **I want** egy generikus `TaskSlide` komponenst
- **So that** különböző típusú mini-játékokat tudjak megjeleníteni a történetben.

**Acceptance Criteria:**
- [x] `src/ui/components/TaskSlide.js` létrehozása.
- [x] Dinamikus komponens betöltés a `taskType` alapján.
- [x] Integráció a `main.js` renderelési folyamatába.

### Story 3.2: Egységes Pontozás és Időmérés
- **As a** Fejlesztő
- **I want** egy központi pontozási rendszert
- **So that** minden feladat egységesen tudjon pontokat és időt beküldeni.

**Acceptance Criteria:**
- [x] Pontszerzés (+1) vizuális visszajelzés (Floating Points).
- [x] Sikeres feladatmegoldás utáni automatikus eredmény-modal megjelenítés.

---

## 🎮 2. Első Állomások (DONE)

### Story 3.3: Maze (Útvesztő) Implementáció
- **As a** Játékos
- **I want** egy labirintus feladatot az 1. állomáson
- **So that** interaktív módon szerezhessem meg az első kulcsot.

**Acceptance Criteria:**
- [x] `MazeGame.js` és `Maze.css` létrehozása.
- [x] Billentyűzet alapú irányítás.
- [x] Random labirintus generálás.
- [x] Kilépési pont elérésekor pontszerzés és továbbhaladás.

### Story 3.4: Pixel Palota (Puzzle) Implementáció
- **As a** Játékos
- **I want** egy kirakós feladatot a 2. állomáson
- **So that** vizuális készségeimet is próbára tehessem.

**Acceptance Criteria:**
- [x] `PuzzleGame.js` létrehozása.
- [x] Drag & Drop mechanika mágneses illesztéssel.
- [x] Teljes kép kirakása után gratuláció és továbbhaladás.

---

## Feljegyzések
- **Stílus:** Kizárólag a `design-system.css` és az egyedi komponens CSS fájlok használatosak. (Tailwind nem használt).
- **Állapot:** Minden itt leírt funkció a v0.8.8-as verzióra elkészült.
