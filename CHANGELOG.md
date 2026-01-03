# Changelog

Minden jelentős változtatás ebben a fájlban lesz dokumentálva.

A formátum [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) alapján,
és ez a projekt [Semantic Versioning](https://semver.org/spec/v2.0.0.html) szabványt követi.

## [0.4.6] - 2026-01-03
### Hozzáadva (Added)
- **Multi-Grade Extension (Grade 4-5-6):**
    - **Universal Gamification:** Kiterjesztve a 3. évfolyamon bevezetett "Lebegő Pont" animáció és pontozási logika (`scoring` config) a 4. (Lovag), 5. (Cyberpunk) és 6. (Sci-Fi) évfolyamokra is.
    - **Themed Feedback:** A lebegő pontszámok (`.dkv-floating-point`) és az inaktív gombok stílusa minden évfolyam témájához igazodik (pl. Times New Roman a lovagoknál, Neon Zöld Cyberpunk betűtípus az 5. osztálynál, Roboto kék a 6.-nál).
    - **Narrator Upgrade:** A Narráció panel finom áttűnése (`opacity transition`) implementálva minden évfolyam CSS-ében.
    - **Config Sync:** A 4-6. osztályos `config.js` fájlok megkapták a hiányzó `scoring` és `icon` definíciókat.
- **Visual Polish (Grade 3):**
    - **Settings Upgrade:** Hangszóró ikon (SVG) a fogaskerék helyett, "Hangbeállítások" cím, egyedi türkiz csúszkák, és javított bezárási logika.
    - **Timeline Redesign:** Új "Dupla Kör" dizájn (statikus külső gyűrű, töltődő belső sáv) **Ragyogás (Glow)** effekttel kiegészítve. Egységesített `Source Code Pro` tipográfia.
    - **HUD Refinement:** Avatar mérete **70px**-re növelve, a karakternév és pontszám betűmérete arányosan skálázva. A pontszám színe korrigálva a téma türkiz árnyalatára.
    - **Iconography:** Az alapértelmezett színes emojik (Hang, Napló, Narráció) lecserélve letisztult, fehér **SVG ikonokra** (Hangszóró, Tekercs, Könyv) CSS overlay technikával.
    - **Panel Consistency:** A Napló, Beállítások és Narráció panelek kerete egységesen türkiz (**#00d2d3**, 2px) stílust kapott.
    - **CSS Clean-up:** A Grade 3 stíluslap (`main.css`) refaktorálása: az indokolatlan `!important` deklarációk eltávolítása és felváltása helyes CSS specificitással.
    - **Floating Point FX:** A "+1" pontszerzés vizuális visszajelzése (Grade 3) drámaian felnagyítva (**3.5rem**, Impact font) a jobb játékélmény érdekében.

## [0.4.5] - 2026-01-02
### Hozzáadva (Added)
- **Dynamic HUD System:**
    - **Live HUD:** Dinamikus Heads-Up Display a játékfelületen, amely valós időben mutatja a játékos nevét, profilképét és pontszámát.
    - **Score Animation:** A pontszámváltozás látványosan animálva (felpörögve) jelenik meg.
    - **Gamification:**
        - **Floating Points:** "Lebegő +1" animáció sikeres adatmegadáskor és karakterválasztáskor.
        - **Delayed Transition:** Késleltetett (1s) továbbhaladás a regisztrációnál a vizuális visszajelzés érdekében.
        - **Narrator Transition:** A Narráció panel mostantól finom áttűnéssel (opacity fade-in) jelenik meg.
        - **Visual Consistency:** A Regisztrációs "Tovább" gomb inaktív állapota vizuálisan egységesítve a Karakterválasztó gombjával.
- **Configurable Scoring:**
    - A pontozás (`scoring`) mostantól a `config.js`-ben állítható.
- **State Management:**
    - Kibővített `GameStateManager` (userProfile, avatar, score) és automatikus Session Reset.

### Javítva (Fixed)
- **Character Selection Bug:** Javítva a "+1" animáció hiánya a DOM frissítés után.
- **HUD Data Sync:** Helyes adatátadás (`stateManager`) a `TaskSlide`-nak.
- **Score Logic:** Javított pontlevonás (silent validáció nem büntet).

## [0.4.4] - 2026-01-02
### Hozzáadva (Added)
- **Unified Game Interface:**
    - Implementálva a közös játékfelület (`GameInterface.js`) a 3-6. évfolyamok számára.
    - **Core UI Structure:** Top HUD (Avatar, Név, Pontszám, Idővonal), Jobb Oldalsáv (Leltár), Alsó Sáv (Navigáció, Funkció gombok).
    - **Interactive Features:** 
        - Balról beúszó **Küldetésnapló** panel (CSS Transition).
        - Stilizált **Narráció** doboz (Könyv dizájn) a képernyőn.
        - **Beállítások** panel pozícionálása a jobb felső sarokban, a Globális Időzítő mellett.
    - **Navigation Logic:** Perzisztens Balra/Jobbra nyilak (SVG ikonok) a korábbi "Tovább" gomb helyett, amelyek mindig középre igazítva jelennek meg.
    - **Quality of Life:**
        - **Click-Outside-To-Close:** A panelek (Napló, Beállítások) mostantól bezáródnak, ha a felhasználó melléjük kattint.
        - **Global Hero Timer:** A regisztrációnál indult időzítő (`dkv-timer-display`) sikeresen integrálva a játékfelület jobb felső sarkába (Z-index és layout korrekciók).

## [0.4.3] - 2026-01-02
### Javítva (Fixed)
- **Typewriter Engine Upgrade:** A `Typewriter.js` utility frissítve lett, hogy korrektül kezelje a `speed: 0` beállítást. Az eddigi 30ms-os kényszerített minimum késleltetés helyett 0 esetén mostantól **azonnali, szinkron megjelenítést** végez (`bypass logic`), így a 4-5-6. osztályok statikus szövegei valóban azonnal jelennek meg.
- **Modal Visibility:** Javítva a Regisztrációs és Karakterválasztó (Preview) modális ablakok láthatósági hibája a 4., 5. és 6. osztályoknál. A `document.body`-ba fűzött ablakok mostantól megkapják a megfelelő scope osztályt (`dkv-grade-X`), így öröklik a stílusokat.
- **Character Slide Styles:**
    - Pótolva a hiányzó Flexbox layout definíciók a Grade 4-6 CSS fájlokban, így a kártyák és a toggle kapcsoló helyesen jelennek meg.
    - Javítva a szövegszín öröklődése: a `.dkv-character-slide` konténer mostantól közvetlenül definiálja a témaszínt, így minden belső elem (pl. `span`) helyesen jelenik meg.

### Hozzáadva (Added)
- **Multi-Grade Foundation:**
    - Létrehozva a Grade 4 (Lovag), Grade 5 (Cyberpunk) és Grade 6 (Sci-Fi) teljes mappa- és fájlszerkezete (`config.js`, `styles/*.css`).
    - **Scoped CSS Architecture:** Bevezetve a `.dkv-grade-X` alapú izoláció. A `main.js` automatikusan hozzáadja az évfolyam osztályát a fő konténerhez, a CSS fájlok pedig ez alá rendezik a szabályaikat, megakadályozva a stílusok keveredését.

## [0.4.2] - 2025-12-31
### Megváltoztatva (Changed)
- **Visual Unification:** Teljeskörű szín- és stílus egységesítés a Grade 3 folyamatban. Minden szöveges tartalom (Címek, Leírások, Input címkék) mostantól a `main.css`-ből örökli a színét és árnyékát (`text-shadow`), garantálva a konzisztens arculatot.
- **Improved Typewriter Flow:** Eltávolításra került minden mesterséges szünet (50ms/300ms) az írógép effektusból az Üdvözlő (`WelcomeSlide`), Regisztrációs (`RegistrationSlide`) és Karakterválasztó (`CharacterSlide`) felületeken, így a szövegmegjelenítés folyamatos és akadásmentes.
- **Registration UX:**
    - **Staggered Animation:** A regisztrációs űrlap elemei (Név -> Becenév -> Osztály -> Gomb) mostantól lépcsőzetesen, 500ms késleltetéssel követik egymást a cím kiírása után, javítva az áttekinthetőséget.
    - **Input Placeholders:** A segédszövegek világosabb színt kaptak és lekerült róluk az árnyék a jobb olvashatóság érdekében.
- **Button Harmony:** A "Tovább" és "OK" gombok, valamint a hozzájuk tartozó stílusok (`.dkv-grade-3-button`) egységesen 10px lekerekítést kaptak. A Regisztrációs Hibaablak "OK" gombja mostantól ezt a közös osztályt használja.

## [0.4.1] - 2025-12-31
### Hozzáadva (Added)
- **Character Asset Integration:** Teljeskörű támogatás a konfigurálható karakterképekhez (`grade3/config.js`). Mostantól külön definiálható a kártya (`card`) és a nagyított (`zoom`) kép útvonala minden karakterhez (fiú/lány 1-4).
- **Visual Harmony:** A "Kiválasztom" gomb a Preview Modalban mostantól vizuálisan megegyezik a fő "Tovább" gombbal (Impact font, Neon effektek).

### Javítva (Fixed)
- **Missing Methods Recovery:** Helyreállítva a `CharacterSlide` véletlenül törölt metódusai (`_createPreviewModal`, `_updateNextButton`), amelyek blokkolták a működést.
- **Image Fit:** A karakterválasztó kártyák képei mostantól `object-fit: cover` beállítást használnak, így teljesen kitöltik a keretet.
- **Preview Styling:** A nagyított karakterképek (Zoom) 10px lekerekítést és finom keretet kaptak.
- **Container Styling:** A Grade 3 fő konténer (`.dkv-slide-container`) lekerekített sarkokat (10px) és áttetsző hátteret kapott, a piros debug keret eltávolításra került.

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