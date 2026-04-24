# Anomáliák Szigete (Station 4) Feladat Implementálása

A cél a 4. évfolyam 4. állomásának (Anomáliák Szigete) véglegesítése a megadott speciális paraméterek alapján.

## Feladat Specifikáció

### Logika és Interakció
- **5 ciklusból (körből)** áll a feladat progressive nehézséggel:
  - **1. kör:** 12 mp sebesség
  - **2. kör:** 10 mp sebesség
  - **3. kör:** 8 mp sebesség
  - **4. kör:** 8 mp sebesség + **90 fokban elforgatott elem** (anomália)
  - **5. kör:** 6 mp sebesség
- **Zavaró tényezők (Data Interference Layer):** 
  - Véletlenszerűen megjelenő neon kék/türkiz részecskék (porszerű lebegés).
  - Digitális zaj (glitch-boxok), amik időnként kitakarják a rúnákat.
  - Fényvibrálás (flicker) az instabil terminál érzetért.
- **Megjelenítés:**
  - Végtelenített rúnaszalag úszik jobbról balra.
  - A szalagon 8-10 rúna van a memóriában.
  - A viewportban egyszerre 5-6 rúna látszik (szélsők kilógnak).
  - **1 db véletlenszerű anomália** van a szalagon körönként.
- **Felhasználói folyamat:**
  - Kijelölés kattintással (vizuális keret).
  - A **VÉGREHAJTÁS** gomb csak kijelölés után válik aktívvá.
  - A gomb megnyomásakor a kiértékelés 2,5 mp-ig tart.
- **Visszajelzés (2,5 mp):**
  - Helyes: Zöld keret + **"A CÉL EGYEZIK"** felirat.
  - Helytelen: Piros keret + **"A CÉL NEM EGYEZIK"** felirat.
- **Átmenet:** A körök végén a 2. feladatból ismert **"rázás" (glitch-shake) effekt** kíséretében érkeznek az új rúnák.

## Megvalósítandó változtatások

### [Station 4] Anomáliák Szigete

#### IslandTask.js
- `Typewriter` segédosztály importálása a súgóhoz.
- 5 körös (stage) rendszer kiépítése.
- `requestAnimationFrame` alapú mozgatás delta-time számítással.
- Részecske-generátor és glitch-box logika.
- Kijelölés és VÉGREHAJTÁS gomb állapotkezelés.
- Memória menedzsment (cleanup).

#### IslandTask.css
- `dkv-island__rune-belt`: Szalag konténer.
- `dkv-island__rune`: Rúna kártyák és kijelölés state.
- `dkv-island__interference-layer`: Zavaró effektek rétege.
- Visszajelzés stílusok (Task 2 mintájára).
- `island-shake` animáció.
