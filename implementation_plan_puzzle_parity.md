# Részletes Megvalósítási Terv - Puzzle Paritás és Ellenőrzés

Ez a dokumentum a `tools/puzzle-generator` és a játékbeli puzzle rendszer közötti 100%-os vizuális és logikai egyezés elérésének lépéseit tartalmazza.

## 1. Lépés: Kísérleti Környezet (Staging)
Létrehozzuk a V2-es fájlokat, hogy a jelenlegi játékmenet 100%-ban stabil maradjon a fejlesztés alatt.
*   **[NEW]** `src/features/puzzles/PuzzleServiceV2.js`
*   **[NEW]** `src/features/puzzles/PuzzlePieceV2.js`
*   **[NEW]** `src/features/puzzles/PuzzlePieceV2.css`

## 2. Lépés: Master Ellenőrző Nézet (Master Preview)
Létrehozunk egy debug felületet a gyors ellenőrzéshez.
*   **[NEW]** `src/ui/components/PuzzleMasterPreview.js`
*   **Funkció**: Megjeleníti a teljes 15 darabos (5x3) rácsot összeillesztve, teljes méretben.
*   **Cél**: Ezen a felületen igazoljuk a vizuális paritást (noise-fill, glow, blokkok).

## 3. Lépés: Precíziós Generáló Logika (V2 Service)
Átültetjük a generátor-eszköz minden funkcióját:
*   **Blokk-alapú elrendezés**: `blocksPerColumn` és `blockGap` kezelése.
*   **Textúra-kitöltés (Noise-Fill)**: Minden sor végének feltöltése a pixel-pontos szélességig.
*   **Determinisztikus Mérés**: Fix karakter-szélesség táblázat alkalmazása a szervizben.

## 4. Lépés: Vizuális Finomhangolás (V2 Component)
A renderelés szinkronizálása a CSS paraméterekkel:
*   **Token-stílusok**: Színtípusonkénti `drop-shadow`, `opacity` és `font-size-offset` alkalmazása.
*   **Folytonos háló**: A kód folyamatos áramlása a darabkák között (5 oszlopos logika átalakítása egyetlen széles oszlop szeletelésére).

## 5. Lépés: Ellenőrzés és Átállás
*   **Vizuális audit**: A Master Preview összevetése az eredeti eszköz kimenetével.
*   **Aktiválás**: Csak jóváhagyás után irányítjuk át a játékot az új V2-es rendszerre.
