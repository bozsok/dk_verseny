# Changelog

Minden jelentős változtatás ebben a fájlban lesz dokumentálva.

A formátum [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) alapján,
és ez a projekt [Semantic Versioning](https://semver.org/spec/v2.0.0.html) szabványt követi.

## [0.3.0] - 2025-12-22

### Hozzáadva (Added)
- **Onboarding Flow:** Teljes regisztrációs és karakterválasztó folyamat az új "Kód Királyság" design szerint.
- **RegistrationSlide Komponens:** 
    - Szigorú validáció (Név: 2 szó, kötőjel szabályok; Becenév: max 15 kar, csak betűk; Osztály: d.l formátum).
    - Valós idejű input szűrés (Input Masking) és automatikus formázás.
    - Dedikált hibaüzenet Modal "Modal Lock" funkcióval (egyszerre csak egy hiba).
    - Auto-focus funkció a belépéskor.
- **CharacterSlide Komponens:**
    - Interaktív karakterválasztó felület Slide/Toggle kapcsolóval (Fiú/Lány nézet).
    - Nagyítható kártyák "Preview Modal" ablakkal (770x700px).
    - Intelligens állapotkezelés: A kiválasztás megmarad nézetváltáskor is.
    - Szigorú validáció a "Tovább" gombra (kötelező választás).
- **Akadálymentesítés (Accessibility/A11y):**
    - "Focus Trap" implementáció minden modális ablakhoz (Tab navigáció beszorítása).
    - Teljes billentyűzet támogatás (Enter, Space, Esc, Tab) minden interaktív elemen.
    - ARIA attribútumok és vizuális fókuszjelzők.
- **Multi-Grade Tartalom:**
    - `src/content` mappa struktúra létrehozva grade3, grade4, grade5, grade6 számára.
    - Konfigurációs fájlok replikálva minden évfolyamra, egyedi címekkel és validációs szabályokkal.

### Megváltoztatva (Changed)
- **Konfiguráció:** A `RegistrationSlide` dinamikusan, a `config.js`-ből tölti be az engedélyezett osztályokat (`allowedClasses`), megszüntetve a hardcode-ot.
- **Validáció:** Szigorított név és becenév ellenőrzés (speciális karakterek tiltása, kötőjelek pozíciója).
- **UI/UX:** Finomított hover effektek, animációk és egységesített modális ablak stílusok.

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
