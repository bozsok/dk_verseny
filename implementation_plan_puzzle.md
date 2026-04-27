# Implementation Plan - Grade 4 Finale Puzzle

Ez a dokumentum a Finálé puzzle feladatának megvalósítását részletezi a jóváhagyott vázlat és technikai paraméterek alapján.

## 1. Navigációs Sorrend és Logika
*   **Belépés**: Az utolsó állomás után, a Finálé 1. diájának (`final_1`) elindulásakor a rendszer azonnal megnyitja a puzzle feladatot (beugró).
*   **Összegző Modal**: A puzzle kirakása után a `main.js` megjeleníti a `showMazeResultModal`-t az alábbi címmel: **"SIKERES FRISSÍTŐSZKRIPT ÖSSZEILLESZTÉS"**.
*   **Visszatérés**: A modal "TOVÁBB" gombjára kattintva a puzzle és az overlay eltűnik, és elindul a **Finálé 1. diájának (DIA_28) narrációja**.
*   **Folytatás**: A narráció után a navigációs nyíllal megyünk a 2. diára, majd onnan a Végső Feladatra.

## 2. Megjelenítés és Design
*   **Viewport**: 1200x675px méretű terület a modal alján.
*   **Időzítő (Timer Box)**: 
    - **Stílus**: Átvéve a `SpeedTask` (Station 5) feladatból.
    - **Paraméterek**: `Space Grotesk` (900), `tabular-nums`, ciánkék glow.
    - **Helyszín**: A fejléc (`dkv-finale-intro__header`) jobb alsó sarkában.
    - **Trigger**: Az **első puzzle darab megfogásakor** indul el a stopper.

## 3. Technikai Megvalósítás
*   **Puzzle Motor**: A 3. osztályos mechanika (`PolyPiece`, `Generator`, `Geometry`) átemelése és 1200x675-ös méretre való kalibrálása.
*   **Skálázhatóság**: A darabszám az osztályfoktól függ (4. osztály: 16, 5-6. osztály: magasabb).
*   **Egyedi Cím**: A `main.js` módosítása, hogy a 4. osztályos összegző modal is tudjon egyedi címet megjeleníteni (ne csak a beégetett alapértelmezettet).
*   **Memóriavédelem**: Minden globális `window` eseménykezelő (`mousemove`, `mouseup`, `resize`, `scroll`) regisztrálása a `this._handlers` listába, és kényszerített törlésük a `destroy()` hívásakor.

## 4. Ellenőrzési Pontok (Verification)
- [ ] A feladat indulásakor az időzítő látszik, de áll (00:00).
- [ ] Az első darab elmozdításakor elindul a stopper.
- [ ] A puzzle befejezése után felugrik a rendszer-szintű összegző modal.
- [ ] A modal bezárása után elindul a DIA_28 narrációja.
- [ ] A `destroy()` hívása után nem maradnak aktív eseménykezelők vagy intervallumok.
