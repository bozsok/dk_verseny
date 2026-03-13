# Sprint 4: Állomások (3-5) és Portál Rendszer

**Cél:** A 3. osztályos tartalom befejezése az utolsó három állomással (Memory, Quiz, Sound) és a látványos Portál tranzíciós rendszer implementálása.

---

## 🎮 1. További Állomások (DONE)

### Story 4.1: Adat-tenger (Memory) Feladat
- **As a** Játékos
- **I want** egy memóriajátékot a 3. állomáson
- **So that** tesztelhessem az informatikai ikonok felismerését.

**Acceptance Criteria:**
- [x] `MemoryGame.js` implementálása.
- [x] Neon stílusú kártyák és animált fordítás.
- [x] Párkeresés végén automatikus pontozás.

### Story 4.2: Tudás Torony (Kvíz) Feladat
- **As a** Játékos
- **I want** egy feleletválasztós kvízt a 4. állomáson
- **So that** elméleti tudásomat is bizonyíthassam.

**Acceptance Criteria:**
- [x] `QuizGame.js` létrehozása.
- [x] Kérdések betöltése külső szövegfájlból.
- [x] Véletlenszerű kérdés- és válaszsorrend.

### Story 4.3: Hangerdő (Sound) Feladat
- **As a** Játékos
- **I want** egy hangalapú feladatot az 5. állomáson
- **So that** a hallásomat és a megfigyelőképességemet használhassam.

**Acceptance Criteria:**
- [x] Egyedi audio lejátszó sebességszabályzóval.
- [x] Sorrendfüggő és független válaszok kiértékelése.

---

## ✨ 2. Vizuális Rendszer (DONE)

### Story 4.4: Portál Shader és Tranzíció
- **As a** Játékos
- **I want** egy látványos átmenetet az állomások között
- **So that** érezzem a dimenziók közötti utazást.

**Acceptance Criteria:**
- [x] WebGL (Three.js) alapú örvénylő portál shader.
- [x] Részecske rendszer (particles) az anticipáció fázishoz.
- [x] Állomás-specifikus portálszínek.

### Story 4.5: Videó és Portál Szinkronizáció
- **As a** Fejlesztő
- **I want** a videók csak a portál nyitása után induljanak el
- **So that** ne zavarják a tranzíció élményét.

**Acceptance Criteria:**
- [x] `isPreview` mód bevezetése a diákhoz.
- [x] Manuális `playVideo()` hívás a tranzíció `onComplete` eseményében.
- [x] Verzió 0.9.4 stabilitási javítások (load, safety timeout).

---

## Feljegyzések
- **Állapot:** Minden itt leírt funkció a v0.9.4-es verzióra elkészült.
- **Következő lépés:** Sprint 5 - Finálé (Nagy Zár).
