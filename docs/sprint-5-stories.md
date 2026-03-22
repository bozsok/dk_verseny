# Sprint 5: Interaktív Tutorial Rendszer (Epic 8)

**Cél:** A játékfelület interaktív oktatói bemutató rendszerének elkészítése, amely az onboarding után és az intro előtt végigvezeti az új versenyzőket a HUD elemein.

**Verzió:** v0.16.6  
**Dátum:** 2026-03-22  
**Állapot:** ✅ DONE

---

## 🎓 Story 8.1: Tutorial kiemelési mechanizmus – `cloneNode` alapú megközelítés [DONE]

- **As a** Versenyző
- **I want** látni, hogy a tutorial éppen melyik felületi elemről beszél
- **So that** megértsem, mire vonatkozik a magyarázat.

**Acceptance Criteria:**
- [x] Az éppen bemutatott elem `cloneNode(true)` másolata jelenik meg a `document.body`-ban
- [x] A klón `position: fixed; z-index: 2601` értékekkel pontosan az eredeti elem képernyőpozícióján áll
- [x] `transform: none`, `right: auto`, `bottom: auto` CSS reset az örökölt konfliktusos tulajdonságokon
- [x] `display` értéke `getComputedStyle`-ból olvasva (pl. timer `display: none` alapértelmezés esetén fix)
- [x] Minden klón `borderColor`-ja türkiz; inventory slotoknál belső slotok is
- [x] A klón `pointer-events: none` – csak vizuális, nem interaktív

---

## 📋 Story 8.2: Tutorial lépések sorrendje és konfigurációja [DONE]

- **As a** Versenyző
- **I want** logikus sorrendben megismerni a felület elemeit
- **So that** könnyen megjegyezzem, mi mire való.

**Acceptance Criteria:**
- [x] 10 lépéses tutorial a következő sorrendben:
  1. Karakterkép (`.dkv-avatar-circle`)
  2. Becenév (`.dkv-username`)
  3. Pontszám (`.dkv-points`)
  4. Idővonal (`.dkv-hud-timeline`)
  5. Hanglejátszó gomb (`.dkv-btn-settings`)
  6. Eltelt idő (`.dkv-timer-display`)
  7. Küldetésnapló gomb (`.dkv-btn-journal`)
  8. Narráció gomb (`.dkv-btn-narrator`)
  9. Inventory slotok (`.dkv-game-sidebar`)
  10. Tovább gomb (`.dkv-btn-next`)
- [x] Minden lépéshez: selector, szöveg, tooltip pozíció, audio fájl
- [x] Hiányzó elem esetén automatikus átlépés a következő lépésre

---

## ✨ Story 8.3: Animált megjelenés és eltűnés [DONE]

- **As a** Versenyző
- **I want** gördülékeny vizuális átmeneteket a tutorial lépései között
- **So that** ne érjen meglepetés a hirtelen ugrások miatt.

**Acceptance Criteria:**
- [x] Klón megjelenés: `fade-in + scale(0.97→1)` CSS keyframe animáció (`dkv-tutorial-clone` osztály)
- [x] Klón eltűnés: `fade-out + scale` animáció (`dkv-tutorial-clone--out` osztály), `animationend` után DOM eltávolítás
- [x] Tooltip lépésváltáskor: fade-out (280ms késleltetés), majd fade-in az új pozíción
- [x] Tooltip y-irányú mozgás nélkül (csak `opacity` transition)
- [x] Tooltip gomb hover: nincs `transform: translateY` elmozdulás

---

## 💬 Story 8.4: Tutorial overlay és tooltip [DONE]

- **As a** Versenyző
- **I want** olvasható magyarázatot az adott elemről, és egyszerű navigációt a lépések között
- **So that** saját tempómban haladhassam végig a tutorialon.

**Acceptance Criteria:**
- [x] Sötétítő overlay a `document.body`-ban (`z-index: 2600`)
- [x] Tooltip buborék a `document.body`-ban (`z-index: 2602`), szöveggel és navigációs gombokkal
- [x] `positionTooltip()` a `dkv-is-visible` osztály hozzáadása **előtt** fut – nem villan fel az előző pozíción
- [x] Tooltip tartalom: leírás szöveg + Kihagyás / Vissza / Tovább / Kezdjük! gombok
- [x] `Kihagyás` és `Bezárás` gombok mérete egységes a többi gombbal
- [x] Tooltip pozíció: bottom, top, left, right, bottom-right, top-left, top-right variánsok

---

## 🐛 Story 8.5: Hibajavítások [DONE]

- **As a** Fejlesztő
- **I want** stabil, hibamentes tutorial rendszert
- **So that** ne törjön össze a játék futtatása a tutorial során vagy után.

**Acceptance Criteria:**
- [x] `design-system.css`: tiltott `!important` eltávolítva – `.dkv-timer-display { z-index: var(--z-onboarding-modal) !important }` → `var(--z-ui-controls)`
- [x] `SlideManager.js`: hiányzó `getCurrentIndex()` és `getSlides()` metódusok implementálva
- [x] Post-tutorial: `onTutorialFinished()` callback helyesen indítja a narrációt és videót
- [x] Sidebar klón eltolódás javítva: `transform: translateY(-50%)` dupla alkalmazásának megelőzése `transform: none` resettel
- [x] Timer klón z-index: az `!important` eltávolítása után a klón `z-index: 2601` inline értéke érvényesül

---

## Feljegyzések

- **Állapot:** v0.16.6-ban minden story teljesítve.
- **Megközelítés:** `cloneNode(true)` alapú kiemelés stacking-context-független – nem igényel z-index manipulációt az eredeti HUD elemeken.
- **Következő sprint:** Epic 9 – Grade 4-6 tartalom implementálása.
