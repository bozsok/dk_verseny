# Changelog

Minden jelentős változtatás ebben a fájlban lesz dokumentálva.

A formátum [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) alapján,
és ez a projekt [Semantic Versioning](https://semver.org/spec/v2.0.0.html) szabványt követi.

## [0.7.5] - 2026-01-29

### Added
- **Debug Panel Video Tab** 🎬
  - Új "Video" fül a Debug Panelen (`Ctrl+Shift+D`), amely lehetővé teszi a videó lejátszási beállítások per-slide konfigurálását.
  - **Per-Slide Video Settings:** Egyedi `videoDelay` (késleltetés) és `videoLoop` (ismétlés) beállítások minden diához.
  - **Auto-Save API:** Vite plugin implementáció (`video-config-api`), amely automatikusan menti a beállításokat JSON fájlokba (`video-config.json`) évfolyamonként.
  - **Visual Status Indicator:** A Video tab jelzi, ha az adott dia rendelkezik videóval (📹) vagy konfigurált beállításokkal (⚙️).
- **Video Config Files:** Létrehozva a `src/content/gradeX/video-config.json` fájlok minden évfolyamhoz (3-6).
- **Improved Video Preloading:** A `StorySlide` komponens mostantól megvárja a `canplaythrough` eseményt a videó indítása előtt, biztosítva a zökkenőmentes átmenetet.
- **Forward Button Animation** ✨
  - **Aktiválódás Animáció:** A "Tovább" gomb 1.35x-ös méretűre nő és erősebb glow effektet kap, amikor aktívvá válik.
  - **Folyamatos Légzés:** A gomb légzés animációja (1.25x ↔ 1.28x) színtől függetlenül folyamatosan fut, soha nem áll meg.
  - **Attention Grab:** 8 mp tétlenség után 1.2 mp-es átmenettel narancssárga színűre vált (háttér + keret + glow együtt), a légzés folytatódik.
  - **Szétválasztott Animációk:** A scale (légzés) és color (szín) külön animációként fut, így a légzés nem szakad meg színváltáskor.
  - **Azonnali Passzív Váltás:** Kattintáskor a gomb azonnal passzív kinézetre vált (nincs átmeneti "aktív" állapot).

### Changed
- **StorySlide Video Logic:** A videó háttér mostantól tiszteletben tartja a `videoDelay` és `videoLoop` beállításokat a `content` objektumból.
- **Tab-Based Debug Panel:** A Debug Panel mostantól két fülre oszlik: "Selection" (eredeti skip funkciók) és "Video" (új videó beállítások).
- **Grade Config Files:** Minden évfolyam `config.js` fájlja frissítve az `applyVideoConfig()` helper funkcióval.

### Fixed
- **Video Status Detection:** Javítva a videó detektálás a Video tab-on, mostantól index-alapú keresést használ a megbízhatóbb működésért.
- **Video Transition Ghost Effect:** A kép→videó átmenet ideje 1.5s-ről 0.1s-re csökkentve, megszüntetve a "szellemképes" hatást zoom-in animációknál.

---

## [0.7.0] - 2026-01-10

### Added
- **Fejlett Debug Panel Rendszer** 🛠️
  - Új fejlesztői eszköz (`Ctrl+Shift+D`), amely csak DEV módban érhető el.
  - **Szekció Skip:** Onboarding, Intro, Állomások és Finálé átlépése egy kattintással.
  - **Részletes Slide Skip:** Egyedi diák kihagyása vagy engedélyezése.
  - **Visual Indicator:** "🐛 DEBUG MODE" badge a képernyő sarkában.
  - **Auto Dummy Data:** Az 'Onboarding' szekció átlépésekor automatikusan tesztadatokat (Avatar, Név, Osztály) tölt be és beállítja a versenyidőt (38mp offset).
  - **Mute Background Music:** Dedikált opció a háttérzene némítására tesztelés közben.
- **Slide Metadata Kiterjesztés:** Az összes évfolyam (Grade 3, 4, 5, 6) `config.js` fájlja frissítve lett `metadata` (section, step) paraméterekkel a pontos debug navigáció érdekében.
- **Bidirectional Skip Logic:** A `renderSlide` metódus mostantól támogatja az irányfüggő (előre/hátra) skip logikát, így a 'Vissza' gombbal is helyesen működik a navigáció skip-elt szakaszoknál.

### Changed
- **TimeManager:** Javítva a `globalTimer` property elérése a helyes időmérő offset beállításához.
- **Debug Styles:** Modern, sötét témájú ("Dark Mode") stílusrendszer (`debug.css`) neon effektekkel és reszponzív elrendezéssel.
- **Main.js Integráció:** A debug rendszer condicionális betöltése (`__DEV__` check) és integrációja a fő alkalmazás életciklusába (`init`, `renderSlide`, `handleGradeSelect`).

### Fixed
- "Fallthrough Protection": Javítva egy hiba, ahol a skip lánc végén a rendszer megjeleníthetett egy skip-re jelölt diát.
- "Index Timing Issue": Javítva a `shouldSkipSlide` indexelési logikája, hogy mindig a helyes dia ID alapján döntsön.

---
## [0.6.1] - 2026-01-03 (Hotfix)
### Javítva (Fixed)
- **CRITICAL: CharacterSlide Lifecycle Bug:** Javítva a kritikus hiba, ami miatt a regisztráció után nem lehetett továbblépni a karakterválasztásra (`CRITICAL RENDER ERROR` a konzolon). A `CharacterSlide` komponensből hiányzott a `destroy()` metódus, ami kötelező a Unified App Shell architektúrában.
- **CharacterSlide Memory Leak:** Implementálva a hiányzó `_registerTimeout()` helper metódus, amely biztosítja, hogy minden `setTimeout` hívás nyomon követhető és törölhető legyen a komponens megszűnésekor.
- **Untracked Timeout:** A `_showFloatingPoint()` metódusban a `setTimeout` lecserélve `_registerTimeout`-ra, megelőzve a zombie timeout-okat.
- **Duplikált click hang:** Eltávolítva a szintetikus "blup" hang (playSystemSound oszcillátor), amely átfedésben volt a preloaded click.mp3 fájllal.
- **Hover hang hiánya:** Javítva a hover.mp3 hangereje (rögzített 0.2 volume) a jobb hallhatóság érdekében.
- **Timeline százalék (Off-by-One Bug):** Javítva az idővonal számítás - az utolsó dián most helyesen 100%-ot mutat (korábban 96% volt). A probléma: 0-based index helyett 1-based slide number szükséges a GameInterface-nek.

### Hozzáadva (Added)
- **CharacterSlide.destroy():** Teljes lifecycle cleanup implementáció, amely törli:
  - Minden regisztrált timeout-ot
  - Preview modal-t a `document.body`-ból
  - Error modal-t
  - Floating point animációs elemeket
  - A komponens saját DOM elemét
- **Dokumentáció:** Részletes post-mortem elemzés és alternatív megközelítések dokumentálása az `upgrade_audio.md` fájlban (Szakasz 6-11).
- **SFX Volume Control:** Új "Egérkattintás hangerő" slider a Beállítások panelen, amely szabályozza a click hangok hangerősségét (0-100%, default 20%).
- **Bővített Audio Szelektorok:** Click és hover hangok most már működnek minden interaktív elemen:
  - Onboarding gombok (`.dkv-button`)
  - Hub évfolyam kártyák (`.dkv-card`)
  - Karakter választó kártyák (`.dkv-char-card`) - hover hang hozzáadva

### Tanulságok
- Az **explicit lifecycle management** nem opcionális a Unified App Shell architektúrában
- Minden komponensnek KELL `destroy()` metódus
- Minden `setTimeout` KÖTELEZŐ `_registerTimeout`-tal hívni (tracking)
- Modal elemek cleanup-ja kritikus (body pollution megelőzése)

## [0.6.0] - 2026-01-03
### Hozzáadva
- **Zero-Latency SFX Engine:** Teljes átállás a **Web Audio API**-ra a hangeffektek (hover, click) kezelésénél. Ez megszünteti a böngésző alapú késleltetést, azonnali visszajelzést biztosítva.
- **Seamless Video Backgrounds:** A `StorySlide` komponens mostantól támogatja a videó háttereket (`videoUrl`). Intelligens átmenetet képez a poszter kép (`imageUrl`) és a videó között, megakadályozva a betöltéskori villanást.
- **Intelligent Asset Preloading:** A rendszer a háttérben előre betölti a következő dia képeit, videóit és hangjait (`preloadNextSlide`), így a lapozás zökkenőmentesebbé vált.
- **Grade 3 Content:** Az első történet dia (`slide_01`) mostantól videó háttérrel rendelkezik.

### Módosítva
- **GameInterface UI:** A Beállítások panel refaktorálása. A hangbeállítások (Zene/Narráció) külön, dedikált panelen érhetők el.
- **Performance:** Optimalizált erőforrás-kezelés a médiafájlok betöltésénél.

## [0.5.0] - 2026-01-03
### Hozzáadva (Added)
- **Audio Core System:**
    - **Global Background Music:** Implementálva a háttérzene (`default_bg.mp3`) rendszere, amely a játék kezdetekor (Slide 1) indul, végig kíséri a kalandot, és az utolsó diánál (Finálé) 3 másodperces 'fade-out' effekttel halkul el. Loop-olt lejátszás támogatott.
    - **Audio Settings Panel:** Új "Hangbeállítások" panel a `GameInterface`-ben, két csúszkával (Slider), amellyel a felhasználó valós időben, külön-külön szabályozhatja a Zene és a Narráció hangerejét (Session szintű beállítás).
    - **Smart Replay Logic:** Intelligens hanganyag-kezelés. Új diára lépéskor a hang automatikusan elindul, és blokkolja a "Tovább" gombot. Ha azonban a felhasználó már egyszer meghallgatta a diát (pl. visszalép), a hang ugyan elindul ("Mandatory Play"), de a navigáció NEM blokkolódik ("Optional Wait").
    - **Safety Buffer:** Beépítve a `canplay` esemény figyelése a narrációs hangoknál, megakadályozva, hogy a lejátszás kezdete "leharapódjon" a rendszerterhelés miatt.
    - **Immediate Stop:** Csúszásmentes hangváltás. Diát váltáskor (akár előre, akár hátra) az előző dia hangja azonnal és teljesen leáll, megelőzve az áthallást (`audio bleed`).

### Megváltoztatva (Changed)
- **Navigation UX:**
    - **Final Slide Lock:** Az utolsó dián (Összefoglaló/28. dia) a "Tovább" gomb véglegesen inaktívvá válik, jelezve a kaland végét.
    - **Visual Feedback:** A "Tovább" nyilak (Onboarding és GameInterface) inaktív állapotában az egérkurzor mostantól `default`, az átlátszóság pedig expliciten `0.5`, vizuálisan is egyértelművé téve a tiltást.
    - **Audio Sync:** A "Tovább" gombok vizuális állapota (opacity) mostantól szinkronban van a hang alapú tiltással (`isAudioLocked`), felülírva az esetleges animációs (Typewriter/Reveal) opacity változásokat.
    
## [0.4.8] - 2026-01-03
### Hozzáadva (Added)
- **Narrációs Rendszer (Storytelling):**
    - Teljes körű integráció a `GameInterface` és a `SlideManager` között. A Narráció gomb (📜) mostantól az éppen aktuális diához tartozó történetet jeleníti meg, dinamikusan frissülve.
    - **Grade 3 Tartalom:** A "Bevezetés" szakasz (1-4. dia) megkapta a végleges, formázott mesét (Kód Királyság eredettörténete, Hexadecimus, Varázskulcsok, Árnyprogram).
    - **Multi-Grade Támogatás:** A 4., 5. és 6. osztály konfigurációs fájljai is felkészítve a narráció fogadására (egyelőre helyőrző szövegekkel).
    - **Állomás Keverés (Station Shuffle):** A verseny tisztasága érdekében és a másolás elkerülésére az 5 darab köztes állomás (5-24. dia) sorrendje véletlenszerűen generálódik minden játékindításkor az összes évfolyamon (Grade 3-6). Ezzel biztosítva, hogy a szomszédos versenyzők nagy valószínűséggel éppen más feladatot oldanak meg.
    - **Narratív Helyőrzők és Állomásnevek:** Kiépítve a részletes `if-else` struktúra az összes állomás (20 dia/évfolyam) szövegezéséhez. Minden évfolyamhoz egyedi, témába vágó fantázianevekkel (pl. Grade 3: Labirintuskert, Grade 6: Kristály Bolygó) ellátott blokkok kerültek a konfigurációs fájlokba a könnyebb szerkeszthetőség érdekében.
### Megváltoztatva (Changed)
- **UI Architecture Reform (CSS Refactor):**
    - A Grade 3 stíluslap (`main.css`) teljes szerkezeti átalakításon esett át. A korábbi szétszórt szabályok helyett logikus csoportokba (`Unified Button System`, `Unified Panel Base`, `Form Elements` és `HUD Elements`) rendeződtek a stílusok, megszüntetve a redundanciát és garantálva a könnyebb karbantarthatóságot.
    - **Grade Extension:** A Grade 3 megtisztított CSS struktúrája átültetésre került a **Grade 4 (Lovag)**, **Grade 5 (Cyberpunk)** és **Grade 6 (Sci-Fi)** osztályokra is. Minden évfolyam megkapta a saját, egyedi színvilágát (Vörös/Arany, Zöld/Fekete, Cián/Mélykék) és a hozzá illő tipográfiát (Serif, Monospace, Sans-Serif), valamint az egységesített HUD és Panel elemeket.
- **Icon System Optimization:**
    - A `GameInterface` gombjai (Hang, Napló, Narráció) megtisztításra kerültek a zavaró emojiktól. A vizuális megjelenésért kizárólag a CSS-ben definiált, évfolyamonként színezett (pl. Grade 4: Arany, Grade 5: Zöld) **SVG ikonok** felelnek.
    - Javítva az ikonok pozicionálása (`position: relative`), így azok szorosan a gombokhoz igazodnak, megszüntetve a lebegő hatást.
- **Inventory & HUD Consistency:**
    - Minden évfolyamon (`main.css`) pótolva lettek a hiányzó `dkv-inventory-slot` definíciók (80x80px), így a tárgyak helye egységesen jelenik meg.

### Javítva (Fixed)
- **Narrátor Panel Formázás:** Javítva a hiba, ahol a flexbox elrendezés miatt a félkövér (`<b>`) szövegrészek akaratlanul új sorba törtek. A tartalom mostantól egy wrapper konténerbe kerül, biztosítva a helyes folyószöveg (inline) megjelenítést.
- **CSS Konszolidáció:** A Grade 3 stíluslapján (`main.css`) egységesítve és tisztítva lettek a szétszórt `.dkv-narrator-box` szabályok. A panel mérete fixálva lett (600x400px) a kompaktabb megjelenés érdekében.

## [0.4.7] - 2026-01-03
### Javítva (Fixed)
- **Regisztráció:** A név megadásakor a többszörös szóközök (pl. "Kiss  Anna") mostantól automatikusan egyetlen szóközzé olvadnak össze.
- **Idővonal (Timeline):** A százalékos haladás számítása mostantól dinamikusan követi a configban lévő diák számát, kiküszöbölve a korai 100%-os elérést.
- **Felület (Interface):**
    - A gombok (Beállítások, Napló, Narráció, Nyilak) megkapták saját egyedi CSS osztályaikat (`dkv-btn-...`), így egymástól függetlenül stílusozhatók.
    - Eltávolítva a zavaró böngésző-alapú fókusz-keret (outline) a Napló szövegmezőjéről.
    - Javítva az Időzítő (Timer) neon stílusa: a globális `dkv-grade-3` osztályt mostantól a `body` kapja, így a stílus minden komponensre (beleértve a Timert is) helyesen érvényesül.

### Hozzáadva (Added)
- **Fejlesztői segédek (Dev Tools):**
    - **Intelligens Helyőrző (Placeholder):** A `StorySlide` komponens mostantól automatikusan detektálja a hiányzó képfájlokat. Ha egy dia képe nincs a mappában (pl. Git tárhelykímélés miatt törölve), a rendszer automatikusan egy stílusos helyőrző képernyőt generál a dia címével és fájlnevével, biztosítva a folyamatos tesztelhetőséget.
- **Multi-Grade Config Sync:** A 4., 5. és 6. osztály konfigurációs fájljai (`config.js`) frissítve lettek a 3. osztálynál bevezetett 28 diás struktúrára (Bevezetés, Állomások, Finálé). Mostantól ezek az évfolyamok is támogatják az automatikus Helyőrző megjelenítést a hiányzó grafikák helyén.

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