# Changelog

Minden jelentős változtatás ebben a fájlban lesz dokumentálva.

A formátum [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) alapján,
és ez a projekt [Semantic Versioning](https://semver.org/spec/v2.0.0.html) szabványt követi.

## [0.2.0] - 2025-12-21

### Hozzáadva (Added)
- **VideoSlide:** Komponens a videós tartalmak megjelenítésére és a továbbhaladás blokkolására.
- **TaskSlide:** Komponens a feladatok megjelenítésére és a beküldés szimulációjára.
- **Slide Rendering:** A `main.js`-be integrált logika, amely dinamikusan váltja a diákat az új `SlideManager` alapján.
- **Hub UI:** Teljesen újratervezett, "Game Menu" stílusú osztályválasztó felület (Dark Fantasy téma).
- **TimeManager:** Precíz, előre számláló versenyóra implementációja (performance.now alapokon).
- **SecureStorage:** Titkosított (Base64+Salt) adattárolás a manipulációk kivédésére.
- **MockApiService:** Backend kommunikáció szimulációja (késleltetés, hibagenerálás).
- **Story Engine:** Új, lineáris történetvezérlő rendszer (`SlideManager`) 30 diás struktúrával.
- **Slides Config:** A teljes verseny menetének (Bevezetés -> Állomások -> Végjáték) definíciója.
- **TimerDisplay:** UI komponens az eltelt idő megjelenítésére.

### Megváltoztatva (Changed)
- **Hub:** A kártyákra kattintás most már nem a feladatra, hanem a Story Engine-be (első diára) navigál.
- **Adatkezelés:** A `GameStateManager` mostantól titkosítva menti az állást.

## [0.1.0] - 2025-12-20
- Kezdeti projektstruktúra kialakítása.
- .gitignore fájl beállítása a kivételekkel.
- README.md létrehozása az alapinformációkkal.
- CHANGELOG.md létrehozása a változások követésére.
