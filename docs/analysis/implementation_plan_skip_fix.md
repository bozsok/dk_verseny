# Implementációs Terv: Granuláris Skip és Pontozás Javítása

Ez a terv a `onboarding_skip_analysis.md` dokumentumban feltárt hibák javítását célozza.

## Célkitűzés
A "mindent vagy semmit" alapú debug pontozás lecserélése egy diánkénti, granuláris pontozásra, amely elkerüli a pontok duplázódását és biztosítja az állomások skippelésekor is a konzisztens haladást.

## Várható módosítások

### 1. DebugManager.js
- Új `handleSlideSkip(slide)` metódus:
    - `REGISTRATION` -> Injektálja a profilnevet és a configból kiolvasott pontokat (+3).
    - `CHARACTER` -> Injektálja az alapértelmezett avatart és a configból kiolvasott pontot (+1).
    - `STORY` (ha állomás feladat) -> 
        - Szimulált `result` objektum generálása (idő, pontos pontszám, siker).
        - Kulcs hozzáadása a `stateManager`-hez.
        - Pontszám frissítése.
        - `markSlideCompleted` hívása.
        - Statisztikai bejegyzés injektálása a `main.js` `taskResults` tömbjébe.
    - Új `addTimeOffset(ms)` hívás a szimulált időhöz.
    - `simulatedState` hookok kezelése a config-ból (speciális flagek szimulálása).
- `applyDummyData()` kivezetése.

### 2. main.js
- A navigációs ciklusban (`renderSlide`) a `shouldSkip` ágban meghívjuk a `debugManager.handleSlideSkip(slide)`-ot minden átugrott diánál.
- **Optimalizált mentés**: A rekurzív `renderSlide` hívás után, ha `skipDepth === 0` és történt skippelés, kényszerített `saveResultToLeaderboard` hívás. Ezzel elkerüljük az ismételt HTTP kéréseket.
- Az állomási kulcsok manuális injektálását (`addKey`) áthelyezzük a `DebugManager`-be.

### 3. TimeManager (Idő-szimuláció)
- Új metódus: `addSimulationOffset(ms)`.
- **Logika**: A `globalTimer.startTime` értékét módosítja (csökkenti), így a játék eltelt ideje megnövekszik a szimulált értékkel. Ez biztosítja a reális ranglista eredményeket.

### 4. Konfigurációs támogatás (config.js)
- A diákhoz opcionális `simulatedState` objektum rendelhető (pl. `hasUsedKey: true`), amit a `DebugManager` automatikusan alkalmaz skippeléskor.

## Jóváhagyás kérése
Ha a tervet elfogadhatónak találod, kérlek jelezz vissza, és elkezdem a kód módosítását!
