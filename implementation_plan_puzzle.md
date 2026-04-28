# Implementation Plan - Puzzle System Integration

Ez a dokumentum a meglévő Puzzle feladat és a Kód-generátor eszköz összekapcsolását, valamint a játékmenetbe való integrálását részletezi.

## 1. Koncepció és Logika
*   **Master Kód-háló**: A játék indításakor egy központi szerviz (`PuzzleService`) legenerál egy teljes képernyőnyi "nonsense" kód-textúrát a felhasználó által kikísérletezett paraméterek alapján.
*   **Determinisztikus Generálás**: Egy `seed` (véletlenszám mag) használatával biztosítjuk, hogy a háló és a puzzle formák (fülek/lyukak) állandóak maradjanak a munkamenet során.
*   **15 vs 5 darab**:
    *   A hálót egy 5x3-as rácsra (15 darab) osztjuk.
    *   Az 5 állomás (Station 1-5) végén a játékos 1-1 kiemelt darabot kap meg.
    *   A finálé előselejtezőjében mind a 15 darab megjelenik (összekeverve), és a versenyzőnek mind a 15 darabot a helyére kell illesztenie a teljes kép összeállásához. A korábban megszerzett 5 darab a történet szerint adja meg a lehetőséget a feladat megoldására.

## 2. Vizuális Megvalósítás (Glassmorphism)
*   **Technológia**: HTML + CSS + JS (nem képfájl).
*   **Háttér**: `backdrop-filter: blur(10px)` és enyhén áttetsző réteg.
*   **Forma**: A `finale/puzzle` algoritmusából származó SVG `clip-path` használata a jigsaw formákhoz.
*   **Tartalom**: A Master-hálóból kivágott valódi kód-tokenek (span elemek).
*   **Effektek**: Dinamikus pulzálás és a kód színéhez igazodó ragyogás (`drop-shadow`).

## 3. Komponensek és Szolgáltatások [NEW]
*   **`PuzzleService.js`**: Központi szerviz, amely kezeli a generálást, a háló adatait és a darabkák kiosztását.
*   **`PuzzlePiece.js`**: Újrafelhasználható UI komponens a darabkák megjelenítéséhez (Station 4 diák és Finálé számára).

## 4. Integrációs Pontok
### Állomások (Station 1-5)
*   A feladat befejezése és az összegző modal után a **4. dián** megjelenik az adott állomáshoz rendelt `PuzzlePiece`.
*   A darabka elmentődik a `StateManager`-be mint "megszerzett" elem.

### Finálé Előselejtező
*   A meglévő `finale/puzzle` feladat módosítása, hogy statikus képek helyett a `PuzzleService` adatait használja.
*   A 15 darabos háló megjelenítése a gyűjtött darabokkal kiegészítve.

## 5. Implementációs Stratégia: Biztonság és Párhuzamosság
*   **Párhuzamos Fejlesztés**: Az új rendszert a meglévő kódoktól teljesen függetlenül, a `src/features/puzzles/` mappában építjük fel.
*   **Zero-Risk Garancia**: A jelenlegi `src/tools/puzzle-generator` és `src/content/grade4/tasks/finale/puzzle` fájlokhoz nem nyúlunk hozzá, amíg az új rendszer nem bizonyított.
*   **Fokozatos Átállás**: Először csak az állomások 4. diáján vezetjük be az új vizualitást. A finálé átállítása csak azután történik meg, ha a generálás és a darabolás logikája már tökéletes.
*   **Visszaállítási Terv**: Bármilyen hiba esetén egyetlen konstans átállításával visszaváltható a rendszer a régi, kép-alapú működésre.

## 6. Ellenőrzési Pontok
- [ ] A generált kód minden állomáson ugyanaz marad (a seed konzisztens).
- [ ] A `blur()` effekt megfelelően működik a játéktér háttere felett.
- [ ] A fináléban mind a 15 darabka illeszkedik egymáshoz.
- [ ] A `StateManager` helyesen tárolja a megszerzett darabok indexeit.
- [ ] Az eredeti rendszer továbbra is hibátlanul fut a fejlesztés ideje alatt.
