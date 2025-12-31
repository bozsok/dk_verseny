# Changelog

Minden jelentős változtatás ebben a fájlban lesz dokumentálva.

A formátum [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) alapján,
és ez a projekt [Semantic Versioning](https://semver.org/spec/v2.0.0.html) szabványt követi.

## [0.4.0] - 2025-12-31
### Javítva (Fixed)
- **Character Blank Screen:** Javítva a kritikus hiba, ami miatt a karakterválasztó üres maradt. Vissza lettek állítva a hiányzó renderelő metódusok (`_renderCards`) és javításra került egy template literal szintaxis hiba.
- **Layout Jumps:** Megszüntetve a tartalom "ugrálása" a karakterválasztón. A konténer igazítása `center`-ről `flex-start`-ra változott, fix felső paddinggel, így az alsó magyarázó szöveg megjelenése nem tolja el a fenti elemeket.
- **Animation Speed:** Egységesítve az írógép effekt sebessége. A címek mostantól helyesen öröklik a konfigurált (gyors) sebességet, nem lassulnak le alapértelmezettre.
- **Persistent Cursors:** Javítva az írógép kurzor logikája: mostantól az animációs lépések között eltűnik a villogó kurzor a már kiírt szövegről, csak az aktív/utolsó elemen marad meg.
- **Image Overflow:** A karakterkártyák képei mostantól `object-fit: contain` tulajdonsággal rendelkeznek, így nem lógnak ki a keretből.
- **Modal Positioning:** A Regisztrációs képernyő hibaüzenet ablaka (`.dkv-registration-modal-overlay`) mostantól `position: fixed` és `100vw/100vh` beállítást használ, így helyesen lefedi a teljes képernyőt, nem csak a konténert.

### Megváltoztatva (Changed)
- **Animation Sequence:** Teljesen újraírt, részletes animációs szekvencia a `CharacterSlide`-on: Cím -> Toggle Szöveg -> Toggle Megjelenés -> Kártyák (egyesével) -> Alsó Szöveg -> Tovább Gomb.
- **Fail-Safe Mechanism:** Beépített biztonsági időzítő (4s), amely automatikusan megjelenít minden elemet, ha az animációs lánc elakadna, megelőzve a "beragadt" állapotot.
- **Font Consistency:** A karakterválasztó minden szöveges eleme (Cím, Leírás, Label, Footer) egységesen **1.2rem** betűméretet kapott, igazodva a Regisztrációs felület stílusához.
- **Button Placement:** A "Tovább" gomb abszolút pozícionálással a jobb alsó sarokba került a karakterválasztón.

## [0.3.2] - 2025-12-23
### Javítva (Fixed)
- **Critical Layout Regression:** Javítva a `RegistrationSlide` és `CharacterSlide` layout összeomlása. A konténerek mostantól helyes Flexbox tulajdonságokkal és méretezéssel rendelkeznek.
- **Toggle Switch Bug:** Javítva a karakterválasztó kapcsolójának hibája, ahol a csúszka (`.dkv-slider`) elszabadult és kitakarta a teljes képernyőt (szürke felület). A JS (`dkv-toggle-switch`) és CSS (`dkv-switch`) osztálynevek szinkronizálva lettek.
- **Modal Visibility:** Javítva a hiba, ami miatt a Preview és Error modális ablakok overlay rétegei alapértelmezetten láthatóak voltak (`display: flex`), eltakarva a tartalmat. Mostantól CSS szinten rejtve vannak (`display: none`).
- **Phantom Styles:** Eltávolítva a `design-system.css`-ből a felejtett debug stílusok (`border: 1px solid red`) és az ütköző onboarding definíciók.
- **JS-to-CSS Refactor:** Teljesen eltávolítva az inline stílusok (`style.property = ...`) a JS komponensekből. Minden vizuális beállítás (validáció színei, layout) mostantól a `Registration.css` és `Character.css` fájlokban, osztályokon keresztül történik (`.dkv-input-error`, `.dkv-input-success`).
- **Container Fix:** A Slide konténer mérete fixálva **1100x740px**-re a Grade 3 stílusokban, felülírva a globális beállításokat.

## [0.3.1] - 2025-12-22
### Megváltoztatva (Changed)
- **Universal Styling Engine:** A `WelcomeSlide` komponens mostantól teljeskörűen támogatja a `config.js`-ből vezérelt stílusozást.
- **Component Styling Upgrade:** A `RegistrationSlide` és `CharacterSlide` komponensek is megkapták a dinamikus stíluskezelő képességet (`_applyStyles`), így teljes mértékben testreszabhatók konfigból.
- **Shared Config Architecture:** A `grade3/config.js`-ben bevezetésre kerültek a megosztott stílus konstansok (`SHARED_BUTTON_STYLE`) a kódduplikáció elkerülése és az egységes 3. osztályos arculat érdekében.
- **Layout Decoupling:** Minden pozícionálási és méretezési szabály (`maxWidth`, `margin`) kikerült a komponensekből (`WelcomeSlide`), és átkerült a konfigurációba, biztosítva a teljes layout szabadságot évfolyamonként.
- **Grade Replication:** A 3. évfolyamon véglegesített konfigurációs struktúra (Shared Styles, HTML Content, Validation Rules) átültetésre került a `grade4`, `grade5` és `grade6` konfigurációs fájlokba is, így minden évfolyam egységes technikai alapokon, de egyedi tartalommal működik.
- **Rich Text Support:** A `WelcomeSlide` és `CharacterSlide` szöveges mezői (Cím, Leírás) mostantól támogatják a HTML formázást (`<b>`, `<i>`, `<br>`, `<span>`).
- **Font Management:** Az `index.html` bővült az `Outfit` (400, 700, 900) és `Source Code Pro` (200, 300, 400, 600) betűtípusokkal.
- **Layout Stabilization:** A `.dkv-slide-container` korlátozása (`max-width: 1000px`) eltávolítva, így az Onboarding konténer garantáltan **1100x740px** méretű minden eszközön.
- **Grade 3 Design:** Implementálva a specifikus "Kód Királyság" arculat (Impact címek, vékony Source Code Pro szövegek, türkiz/neon gombok).
- **Code Cleanup:** Hardcode-olt szövegek és stílusok eltávolítása a `CharacterSlide` és `WelcomeSlide` komponensekből; minden tartalom a config fájlokba került.

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
