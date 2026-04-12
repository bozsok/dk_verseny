# Changelog

Minden jelentős változtatás ebben a fájlban lesz dokumentálva.

A formátum [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) alapján,
és ez a projekt [Semantic Versioning](https://semver.org/spec/v2.0.0.html) szabványt követi.

## [0.25.0] - 2026-04-12

### Hozzáadva
- **Grade 4 interaktív tutorial**: Teljes körű tutorial támogatást adtunk a "Quantum Terminal" felülethez, évfolyam-specifikus szelektorokkal és technikai szövegezéssel.
- **Dinamikus tutorial-stílus**: A tutorial tooltip-ek és gombok mostantól CSS változókon keresztül öröklik az aktuális évfolyam stílusjegyeit (pl. szögletes formák a 4. osztályban).
- **Idővonal (Timeline) vizuális kiemelés**: Speciális, `!important`-mentes CSS megoldás a vékony idővonal-csíkok látványos megvilágítására a tutorial klónozási folyamata során.
- **Audió-struktúra (g4)**: Előkészítettük az új hangfájl-elérési utakat az `assets/audio/tutorial/g4/` könyvtárban.

### Módosítva
- **TutorialManager refaktor**: Az osztály mostantól `stepsByGrade` struktúrát használ, így az évfolyamonként eltérő interfész-elemek (PL. `.dkv-g4-avatar-wrapper`) pontosan célozhatók.
- **Design System bővítés**: Bevezettük a `.dkv-grade-4` téma-változókat a globális `design-system.css` fájlba.

## [0.24.0] - 2026-04-12

### Hozzáadva
- **View Transitions API-integráció**: Implementáltuk a modern böngészőalapú diaátmeneteket, amelyek simább és hatékonyabb váltást tesznek lehetővé a diák között.
- **Interfész-stabilitás (Persistent UI)**: A `view-transition-name` használatával elkülönítettük a statikus interfészelemeket (HUD, navigáció, leltár), így azok nem villannak be vagy tűnnek el a diaváltások során.
- **Hibatűrés (Robustness)**: Bevezettünk egy biztonsági `catch` ágat a `startViewTransition` hívásokhoz, amely megakadályozza az `InvalidStateError` okozta összeomlást.

### Eltávolítva
- **Felesleges dekoratív elemek**: Eltávolítottuk a `dkv-g4-avatar-dot` osztályt és egyéb használaton kívüli stílusokat a kód tisztasága érdekében.

## [0.23.0] - 2026-04-12

### Hozzáadva
- **Globális diaátmenetek**: Implementáltuk a rendszerszintű 0.6 másodperces fade-in-out animációt (`Transitions.css`), amely minden évfolyamon egységes és sima váltást biztosít a diák között.
- **Grade 4 Visual Polish**: Bevezettük a "Quantum Terminal" specifikus vizuális finomításokat, beleértve a script-részlet gyűjtési animációt (`ScriptPartAnimation.js`) és a terminál-stílusú glitch átmenetet (`GlitchTransition.js`).
- **Z-Index Hierarchia Térkép**: Létrehoztunk egy központosított dokumentációt (`z-index-map.md`) és CSS változórendszert (`z-index.css`) a rétegzési hibák megelőzése érdekében.
- **Grade 4 Slide Visibility Fix**: Kiterjesztettük a háttérkép betöltési logikát a `TASK` és `INFO` diátípusokra is a 4. évfolyamon, megszüntetve a fekete képernyő jelenséget.

### Módosítva
- **Navigációs logika**: A `main.js` mostantól támogatja az aszinkron, animált diaváltást, miközben megőrzi a SEL architektúra szerinti állapotkonzisztenciát.
- **Inventory visszajelzés**: A 4. évfolyam interfésze dinamikus pulzáló effektust kapott az új tárgyak megszerzésekor.

## [0.22.0] - 2026-04-11

### Hozzáadva
- **Named Export Refaktor**: A projekt összes kulcsfontosságú modulja (pl. `GameInterfaceGrade4`, `PortalTransition`) átállt Named Export-alapú exportálásra a Rule 33-nak megfelelően, növelve a kód olvashatóságát és a tree-shaking hatékonyságát.
- **Interfész magyarítás (Grade 4)**: A technikai azonosítók (STATION_NAMES) véglegesítése és magyar szaknyelvi szinkronizálása az interfész minden rétegén.

### Módosítva
- **Kompatibilitási réteg**: Megtartottuk az `export default` deklarációkat a nagyobb komponenseknél (`SummarySlide`, `GameInterfaceGrade4`) a fokozatos átállás és a visszamenőleges kompatibilitás biztosítása érdekében.

## [0.21.0] - 2026-04-11

### Hozzáadva
- **7 szegmenses idővonal (Grade 4)**: Implementáltuk a teljesen szimmetrikus, 7 logikai egységre (Intro, 5 Állomás, Finálé) bontott idővonalat. Minden egység pontosan 4 diát fed le, így a 28 diás versenyfolyamat vizuálisan is követhetővé vált.

### Módosítva
- **Timeline vizualizáció**: A korábbi 10 pontos rendszert szimmetrikus „sín” (slider) mechanikára cseréltük, amely 25%-os lépésközökkel töltődik fel az egyes szekciókon belül.
- **Onboarding elszigetelés**: Az idővonal mostantól helyesen csak az onboarding fázis (Welcome, Regisztráció, Karakterválasztó) után jelenik meg, biztosítva a fókuszált felhasználói élményt.
- **Dinamikus szekciónevek**: Az interfész alsó sávja mostantól a metadata alapján jeleníti meg a fázisokat (INTRO, Sector, FINAL).

## [0.20.0] - 2026-04-11

### Hozzáadva
- **Interfész animációk (Grade 4)**: Implementáltuk a Beállítások panel jobb oldali slide-in (beúszó) animációját, amely illeszkedik a "Quantum Terminal" futurisztikus esztétikájához.

### Módosítva
- **Beállítások panel pozicionálása**: A panel a képernyő jobb felső sarkába került, közvetlenül a HUD alá, biztosítva a zavartalanabb játékmenetet.
* **Explicit panelkezelés**: Eltávolítottuk a "click-outside" (mellékattintásra záródó) logikát. A panelek (Napló, Narrátor, Beállítások) mostantól szándékos módon, csak a bezáró gombbal szüntethetők meg.
- **G4 Panel konzisztencia**: Egységesítettük a bezáró ikonokat (`✕`) és az eseménykezelést minden Grade 4 panelen, megakadályozva a véletlen interfész-interakciókat.

## [0.19.0] - 2026-04-11

### Hozzáadva
- **Teljes körű linting compliance**: A projekt mostantól 100%-ban megfelel az ESLint és Prettier szabályoknak (0 hiba, 0 figyelmeztetés).

### Módosítva
- **Konzol naplózás refaktora**: Minden `console.log/warn/error` hívás kivezetve vagy a `GameLogger.js`-be integrálva, illetve ahol elkerülhetetlen (külső API hibák), ott szigorú `eslint-disable` kontroll alá vonva.
- **Paraméter-tisztítás**: Eltávolítottam a nem használt függvényparamétereket és változókat a teljes codebase-ben (`no-unused-vars` javítása).
- **Verziókövetési adatok**: Frissítettem a `package.json` és `project-context.md` állományokat az új kódminőségi mérföldkőnek megfelelően.

### Javítva
- **PuzzleGame – biztonsgos ciklus**: Kijavítottam a `while (true)` potenciális végtelen ciklusát egy kontrollált feltételalapú hurokra (`no-constant-condition` hiba elhárítása).
- **Integritás megőrzése**: Sikeresen lefuttatva a teljes unit teszt készlet (63/63 pass), igazolva a refaktorálás utáni stabil működést.

## [0.18.6] - 2026-04-11

### Hozzáadva
- **Munkamenet-alaphelyzetbe állítás (reset)**: Implementáltam a `TimeManager.reset()` metódust a tiszta munkamenet-indítás érdekében. Ez a SEL architektúra elveit követve biztosítja, hogy az időzítőadatok ne szivárogjanak át a különböző játékmenetek (session) között.

### Módosítva
- **Navigációs integráció**: A `main.js` navigációs folyamatában (évfolyam választásakor) mostantól automatikusan lefut a versenyóra alaphelyzetbe állítása a `TimeManager.reset()` hívásával.

### Javítva
- **Összegző képernyő (Summary) – Karaktermegjelenítés**: Javítottam a karakterképek elérési útjának feloldását a `SummarySlide.js` komponensben. A Grade 4 esetén használt teljes fájlútvonalakat a rendszer mostantól helyesen konvertálja nagy felbontású (`large`) képpé és `.jpg` kiterjesztéssé.
- **Vizuális korrekció**: Kijavítottam egy elírást az összegző dia háttérképének alternatív szövegében (alt-szöveg): "Hátteér" -> "Háttér".

## [0.18.5] - 2026-04-11

### Hozzáadva
- **Granuláris skip-rendszer**: Implementáltam egy atomi feladat-szimulációs mechanizmust a `DebugManager`-ben. Mostantól minden átugrott dia (regisztráció, karakterválasztó, állomások) egyedileg szimulálja a pontszámokat, kulcsokat és statisztikákat, biztosítva a ranglista konzisztenciáját masszív skippelés esetén is.
- **Szimulált időoffset**: Új `addSimulationOffset` metódus a `TimeManager`-ben, amely reális időt ad hozzá a versenyidőhöz a kihagyott feladatok után (pl. 38 mp onboarding, 45 mp állomásfeladatonként), elkerülve a 0 másodperces rekordokat.

### Módosítva
- **Navigációs loop-refaktor**: A `main.js`-ből eltávolításra került a korábbi hardkódolt, monolitikus skip logika. A vezérlés átkerült a `DebugManager.handleSlideSkip` metódushoz, amely a State-Eventbus-Logger (SEL) architektúra szerint kezeli az állapotátmeneteket.
- **DebugDummyData**: Új, finomhangolt időoffset-konstansok a reálisabb szimuláció érdekében.

## [0.18.4] - 2026-04-10

### Javítva
- **FOUIF (fontvillanás)**: Megszüntettem az ikonok szöveges felvillanását egy rendszerszintű, az inicializációs logikába és a betöltőképernyőbe integrált fontbetöltési kontrollal. Teljes körű megoldás a Google Fonts `display=block` és a JS `document.fonts.load` API kombinációjával.
- **Kódtisztítás**: Eltávolításra kerültek az ideiglenes komponensszintű hackek és időzítők a 4. évfolyam interfészéből, eleget téve a Rule 89, 99 és 110-es irányelveknek.

## [0.18.3] - 2026-04-10

### Javítva
- **4. évfolyam narráció**: Megoldottam a sortöréskarakterek (`\n`) megjelenítési hibáját, és helyreállítottam a hiányzó narratív leírásokat a regisztrációs dián.
- **Pontozórendszer**: Helyreállítottam a 4. évfolyamon elromlott `+1` (lebegőpontos) animációt az `Interface.css`-ben fellépő osztálynév-eltérés javításával.
- **Vizuális megjelenítés**: Visszaállítottam a pontozás arany színét a jobb láthatóság érdekében.

## [0.18.2] - 2026-04-10

### Hozzáadva
- **Modális interakciók**: A „Beállítások” ablak is megkapta a bezáró X-ikont.
- **UX**: A „Terminál” (Narráció) ablak mostantól külső kattintásra is bezáródik.

### Javítva
- **Onboarding-időzítő**: Helyreállítottam és szinkronizáltam az időzítő vizuális megjelenését az onboarding szakasz alatt, hogy megegyezzen a játék többi részével.

## [0.18.1] - 2026-04-10

### Módosítva
- **A 4. évfolyam „Quantum Terminal” interfészének finomhangolása**:
  - **Beállítások panel**: A technikai labelek magyarítása (HÁTTÉRZENE, NARRÁTOR, EGÉRKATTINTÁS) a jobb érthetőségért.
  - **Vizuális egységesítés**: A navigációs gombok, az oldalmenü és a beállítások gomb alapháttérszínének egységesítése (`rgba(0, 0, 0, 0.5)`).
  - **Ikonstabilitás**: A HUD-ikonok CSS-szelektorainak megerősítése (specificity), biztosítva a méretezési szabályok helyes érvényesülését.
  - **Karakter-előnézet**: A „Kiválasztás” gomb vizuális finomítása és 4. évfolyam-specifikus stílusizolációja a `Character.css`-ben.

### Javítva
- **Szerkezeti inkonzisztencia**: Az inventory slotok kezdeti HTML-osztályának (`bg-active` -> `active-item`) szinkronizálása a CSS-sel.
- **Hover-állapotok**: A navigációs nyilak és a beállítások gomb hover effektjeinek konzisztensebbé tétele.

## [0.18.0] - 2026-04-10

### Hozzáadva
- **A 4. évfolyam „Quantum Terminal” interfészének csiszolása**:
  - Kontrasztosabb modálisablak-elemek: Sötét háttér a „Kiválasztom” gombhoz és a bezáró „x” ikonhoz a jobb láthatóságért.
  - Hover-/active-állapotok: Jittermentes, „Quantum” stílusú gombvisszajelzések (glow és border-color).
  - Tipográfiai egységesítés: Új standard betűméret (1.4rem) a Manrope és Space Grotesk betűtípusokhoz a teljes onboarding során.

### Módosítva
- **Dinamikus placeholder**: A regisztrációs íven az osztálypélda már az évfolyamhoz igazodik (3. osztály -> 3.b, 4. osztály -> 4.b).
- **Szelektorarchitektúra**: A modális ablakok CSS-szelektorai már nem függenek a slide-konténertől, így stabilabb a stílusöröklődés.

### Javítva
- **3. évfolyam vizuális regresszió**: Az OK-gombok olvashatatlanságát okozó korábbi CSS-konfliktusok feloldva, a 3. évfolyamos stílusok érintetlenek maradnak.
- **Szintaktikai hibák**: Javítva a `Character.css` fájlban maradt zárójel- és formázási hibák.

## [0.17.0] - 2026-04-09

### Hozzáadva
- **A 4. évfolyam „Quantum Terminal” interfésze**: Teljes körű vizuális harmonizáció a 3. évfolyam elrendezésével.
- **Brutalista dizájn**: Technikai vágások (clip-path), türkiz neoneffektek és Space Grotesk/Manrope tipográfia bevezetése.

### Javítva
- **CSS-tisztítás**: Az összes tiltott `!important` szabály eltávolítása a 4. évfolyam stíluslapjairól.
- **Hover-stabilitás**: A gombok és kártyák Y irányú elmozdulásának megszüntetése a globális design-system felülbírálásával.
- **Nyelvi harmonizáció**: Minden 4. évfolyamos CSS-komment és dokumentáció magyarosítása a projekt szabályai szerint.

## [0.16.7] - 2026-03-23

### Hozzáadva
- **Teljes képernyő mód (Hub)**: Az évfolyam választásakor az alkalmazás mostantól automatikusan megkísérli a teljes képernyős módba váltást a jobb felhasználói élmény érdekében.

### Javítva
- **Összegző képernyő (Summary) – Osztály adat**: Kijavítva a mezőnév eltérés (`classId` vs `playerClass`), így a versenyző osztálya már helyesen megjelenik az összegző dián.
- **Összegző képernyő (Summary) – Karakter és Keret**: Javítva a `CharacterSlide.js` adatmentési logikája, így a választott karakter azonosítója bekerül a profilba. Az `oklevel_keret_fekvo.png` elérhetővé tétele az univerzális `assets/images` útvonalon.
- **Összegző képernyő (Summary) – Pozicionálás**: A név, pontszám és idő mezők `top` értéke korrigálva (-7px), biztosítva a tökéletes illeszkedést a háttérgrafikához.
- **Ranglista képalkotás**: Az admin felületen (ranglista) javításra került az oklevél keret HTML attribútuma (`id` helyett `class`), így a generált gratulációs képeken már konzisztensen megjelenik a keret a karakteren.

## [0.16.6] - 2026-03-22

### Hozzáadva
- **Interaktív Tutorial rendszer – teljes újraírás** (`TutorialManager.js`): A tutorial kiemelési mechanizmusa teljesen átdolgozásra került. Az új megközelítés `cloneNode(true)` alapú: az éppen bemutatott elem mélységi klónját a `document.body`-ba fűzi `position: fixed` és `z-index: 2601` értékekkel, pontosan az eredeti elem képernyőpozícióján. Ez a megoldás stacking-context-független, nem igényel z-index manipulációt az eredeti elemeken, és nem töri a DOM layoutot.
- **Tutorial lépések helyes sorrendje**: A lépések átrendezésre kerültek a megadott sorrend szerint: Karakterkép → Becenév → Pontszám → Idővonal → Hanglejátszó → Eltelt idő → Küldetésnapló → Narráció gomb → Inventory slotok → Tovább (jobbra nyíl) gomb.
- **Animált megjelenés és eltűnés**: A klón `dkv-tutorial-clone` CSS osztállyal animáltan (fade-in + scale) jelenik meg, és `dkv-tutorial-clone--out` osztállyal animáltan tűnik el lépésváltáskor. A tooltip szintén animáltan jelenik meg és tűnik el lépések között (`opacity` transition, y-irányú mozgás nélkül).
- **Tutorial lépések z-index hierarchia**: `--z-tutorial-overlay: 2600`, `--z-tutorial-highlight: 2601`, `--z-tutorial-tooltip: 2602` értékek kerültek a `z-index.css`-be.

### Módosítva
- **`TutorialManager.js` – klón pozíció javítás**: A `createClone()` metódus explicit módon nullázza az öröklött CSS-ből eredő konfliktusos tulajdonságokat: `transform: none` (sidebar `translateY(-50%)` dupla alkalmazásának megakadályozására), `right: auto`, `bottom: auto`. A `display` értéket `getComputedStyle`-ból olvassa, így `display: none` alapértelmezés estén is helyesen jelenik meg a klón.
- **`TutorialManager.js` – tooltip pozícionálás**: A `positionTooltip()` hívás a `dkv-is-visible` osztály hozzáadása **előtt** fut, így a tooltip rögtön a helyes koordinátákon jelenik meg, nem villan fel az előző lépés pozícióján.
- **`TutorialManager.js` – lépésváltás animáció**: A `showStep()` metódus most először fade-out-olja a tooltipet (280ms késleltetés), majd az új klónt és tooltipet fade-in-nel jeleníti meg.
- **`Tutorial.css` – hover és animáció**: A tooltip gombjain eltávolítva a `transform: translateY(-2px)` hover effekt. A `Kihagyás` / `Bezárás` gomb mérete egységesítve a többi gombbal (`font-size: 0.9rem`).
- **`SlideManager.js`**: A hiányzó `getCurrentIndex()` és `getSlides()` metódusok implementálva – ezek hiánya `TypeError`-t okozott a tutorial befejezésekor és megelőzte a post-tutorial narráció/videó elindítását.

### Javítva
- **`design-system.css` – tiltott `!important` eltávolítása**: A `.dkv-timer-display` blokkon szereplő `z-index: var(--z-onboarding-modal) !important` (2000) szabály felváltva a helyes `z-index: var(--z-ui-controls)` (1000) értékkel. A `!important` felülírta a klón `inline z-index: 2601` értékét, megakadályozva a timer kiemelését.
- **Tutorial overlay klón konfliktusos stílus**: Az inventory sidebar klónja korábban felfelé csúszott a `transform: translateY(-50%)` dupla alkalmazása miatt. Javítva a `transform: none` inline reset hozzáadásával.
- **`Tutorial.css` – tiltott `!important` eltávolítása**: Az összes korábban bevezetett `!important` flag eltávolításra került a tutorial CSS-ből.
- **Tutorial ismétlés / összeomlás a befejezéskor**: A `SlideManager` hiányzó metódusainak pótlásával megoldódott a tutorial ismétlésének és a befejezéskori összeomlásnak a hibája.
- **Post-tutorial narráció és videó**: A tutorial befejezése után az `onTutorialFinished()` callback helyesen indítja el a bevezető narrációt és videót.

## [0.16.5] - 2026-03-22

### Hozzáadva
- **Központi Téma Változók (CSS Theming)**: A `design-system.css` elején vagy egy külön CSS fájlban definiálásra kerültek a `.dkv-grade-3` témához (és a jövőbeni témákhoz) tartozó globális CSS változók (pl. `--th-panel-bg`, `--th-btn-bg`, `--th-font-display`, `--th-btn-radius`).
- **Dinamikus JS Téma Aktiválás**: A `main.js` induláskor automatikusan applikálja a megfelelő témaosztályt (pl. `.dkv-grade-3`) a `document.body` elemen. Így a JS által dinamikusan fűzött (injektált) komponensek – mint pl. a Modálok, Eredmény ablakok és Tooltipek – szintén megöröklik az aktuális CSS változókat, elkerülve a téma-kontextus elvesztését.

### Módosítva
- **CSS Architektúra Döntés (Syllabus)**: Létrejött az "Igazság Alapja", a `css_architecture_syllabus.md`, ami dokumentálja a struktúra-dizájn leválasztásának szabályait.
- **A `design-system.css` "lecsupaszítása"**: A fájl immáron valóban csak a strukturális "csontvázat" adja (Flexbox, Grid, pozíciók, animációs logika), a korábbi hardkódolt színeket, kerekítéseket és betűtípusokat kicseréltük a `--th-*` változókra. A felület arculata egyetlen CSS paraméter-blokkal testreszabható.
- **`grade3/styles/main.css` tisztítása**: Az összes lokális dizájn-felülírás (Specificity War) törlésre került a fájlból (pl. gombok színének agresszív megváltoztatása). Kizárólag az évfolyamspecifikus dobozszerkezetek és egyedi elrendezések (pl. `.dkv-narrator-box` flex szerkezete, animációi) maradtak meg.

### Javítva
- **Onboarding (Welcome, Character, Registration) gombok méretezése**: Az Onboarding diák gombjainak és alcímeinek lokális, felülírt vizuális paraméterei (pl. `1.5rem` formázások) elvesztek a korábbi gomb-takarításnál, ezek maradéktalanul helyreállításra kerültek.
- **Feladat Összegző Modal `Tovább` gombja**: A `.dkv-btn--result-modal` a közös Theming örökségeként vizuálisan megkapta azokat a dimenziókat (1.5rem betű, 12px 40px padding), amitől egységes és felismerhető a teljes játékon belül az alapgombokkal („harmonizáció”).
- **Tipográfiai törések (Headings, Username)**: Impact és monospace font-weight (`normal` vs `700`) konfliktusok elhárítása a változókon át úgy, hogy a grade 3 egyedi vizuális esztétikája (`Source Code Pro`) ne sérüljön.

## [0.16.4] - 2026-03-21

### Hozzáadva
- **Narrátor gomb körkörös folyamatjelző (Progress Bar)**: A narráció indításakor (`main.js` -> `playAudio()`) a Narrátor gomb káváján egy neon-ciánkék, óramutató járásával megegyező sáv jeleníti meg az eltelt hangidőt. A megvalósítás letisztult z-index rétegzést és trükkös `background-clip: padding-box` CSS formázást használ, ami stabilan kezeli a gombok alakját (border-radius).
- **Kvíz Játék pontfüggő egyedi értékelései**: A Kvíz játék feladatának `endGame` metódusába beépítésre kerültek a pontszám-alapú egyedi üzenetek, így az eredménytől függően (10 kérdés esetén: 8-10, 4-7, 1-3, 0 pont) motiváló és tematikus visszacsatolást ad a Kód Királyság kontextusában.

### Javítva
- **Kvíz Játék 0 pontos befejezése (success bug)**: Javítva a korábbi állapot, ahol 0 pont megszerzése estén (esetleges gyors végigkattintáskor) a `success: true` flaggel zárult a játék és hamisan jelent meg a 'Gratulálunk...' felirat. Mostantól ez az állapot automatikusan sikertelen (`success: false`).

## [0.16.3] - 2026-03-21

### Javítva
- **Összegző modal „Tovább" gomb vizuális egységesítése**: A feladat teljesítése utáni eredmény modal „Tovább" gombjának osztályai megváltoztak (`dkv-btn--result-modal dkv-btn dkv-btn-primary` → `dkv-button dkv-grade-3-button dkv-btn--result-modal`), így a gomb vizuálisan pontosan egyezik az Onboarding-on látható gombokkal (Impact font, türkiz háttér, neon keret, box-shadow).
- **`.dkv-btn--result-modal` CSS cleanup**: Az osztályból eltávolításra kerültek az összes duplikált vizuális tulajdonságok (font, background, border, box-shadow, hover). Csak a pozicionálás-specifikus értékek (`margin-top: 25px`, `min-width: 180px`) maradtak.

## [0.16.2] - 2026-03-21

### Hozzáadva
- **Globális Súgó Floating Panel rendszer**: A tooltip tartalom panel mostantól a `document.body`-ba kerül JS-sel és `getBoundingClientRect()`-tel pozícionálódik az ikon alá (`position: fixed; z-index: 99999`). Ezzel teljesen kikerüli a modal stacking context korlátait, így a puzzle darabok és egyéb játékelemek sem takarhatják el.
- **Egységesített tooltip a Sound feladatban**: A `SoundGame.js`-ben az elavult, HTML-string alapú `getTooltipHTML()` metódus lecserélve `_createFloatingTooltipTrigger()`-re. A `revealTasks()` metódus DOM-manipulációra állt át, hogy az eseménykezelők helyesen kötődhessenek a dinamikusan generált ikonokhoz.
- **Egységesített tooltip a Finale feladatban**: A beviteli mező melletti régi kérdőjeles (`?`) CSS-tooltip helyett az SVG-ikonos globális floating panel rendszer kerül alkalmazásra. Új `_createFloatingTooltipTrigger()` metódus implementálva a `FinaleGame` osztályban.
- **`.dkv-tooltip-floating-panel` CSS osztály**: Új stílusdefiníció a `design-system.css`-ben a floating panel számára.

### Javítva
- **Puzzle Súgó ikon pozícionálása**: A Súgó ikon az instruktív mondat (alcím `p` tag) melletti `dkv-subtitle-wrapper` flex-konténerbe kerül, garantálva a szöveg és az ikon egy sorban maradását, függetlenül a fejléc elrendezésétől.
- **Modal fejléc z-index hierarchia**: A `.dkv-task-modal-header` kap `z-index: 10001 !important` értéket, a `.dkv-task-modal-body` pedig explicit `z-index: 1`-et, így a fejléc elemei (pl. Súgó ikon) soha nem bújnak a játéktér alá.

### Módosítva
- **Sound feladat fejléc**: A `helpContent` eltávolítva a `config.js`-ben a `station_5` bejegyzésből – a feladat saját in-game tooltipjei tartalmazzák a szükséges útmutatót.
- **Finale feladat fejléc**: A `helpContent` eltávolítva a `config.js`-ben a `final_2` bejegyzésből – az útmutatás a beviteli mező melletti Súgó ikonba került.
- **Puzzle feladat Súgó szövege frissítve**: Rövidebb, célzottabb instrukcióra cserélve (`config.js`, `station_4`).
- **Z-index centralizálás**: Létrehozva a `src/ui/styles/z-index.css` fájl az összes z-index érték CSS custom property-ként (`--z-...`). A `design-system.css` importálja ezt a fájlt, és minden korábbi hardkódolt `z-index: <szám>` értéket `var(--z-...)` hivatkozással vált ki. Dokumentáció: `docs/z-index-map.md` (táblázat + Mermaid diagram).

## [0.16.1] - 2026-03-21
### Hozzáadva
- **Globális Súgó (Tooltip) rendszer**: Új, interaktív tooltip rendszer implementálása a feladatokhoz. Tartalmazza a neon stílusú lebegő ablakot, az egyedi SVG ikont és a Sound feladat (Grade 3) specifikus súgó szövegeit.
- **Dinamikus visszajelzés (Sound feladat)**: Részletes, sikeresség-függő üzenetek implementálása a három részfeladat (üzenetek, suttogás, hangjelzések) alapján.

### Javítva
- **Navigáció**: A "VÉGE" gomb aktiválva az utolsó dián, így a felhasználó visszatérhet a Hub-ba.
- **Stíluskezelés**: BEM struktúra megerősítése és a felesleges `!important` szabályok eltávolítása a `design-system.css` fájlból.

## [0.16.0] - 2026-03-21
### Hozzáadva
- **Clean Engine architektúra (Phase 6 & 7)**: A `main.js` teljes refaktorálása. A tartalom és a logika szétválasztásra került, így az alkalmazás mérete nem nő az új évfolyamok hozzáadásával.
- **Dinamikus feladat betöltés (Lazy Loading)**: A játékmodulok (Maze, Quiz, Memory stb.) mostantól csak akkor töltődnek be, amikor a játékos elér hozzájuk.
- **Multi-Grade shell**: Egységesített konfigurációs struktúra az összes évfolyamnak (Grade 3-6) `taskRegistry` és `portalColors` támogatással.
- **Kontextus-függő diaszövegek**: Automatikus, intelligens leírások a történet diákhoz a hurokban generált szakaszoknál.

### Javítva
- `main.js`: Duplikált importok és hiányzó lezáró kapcsos zárójelek javítva a refaktorálás után.
- `Card.js`: Animációs hiba javítva (null pointer check hozzáadva a `classList` eléréséhez).
- `config.js`: Generikus "Teljesítsétek a kihívást..." placeholder szövegek eltávolítva minden évfolyamból.
- Stíluskezelés: A feladat-specifikus CSS fájlok mostantól dinamikusan töltődnek be a JS modulokkal együtt.

## [0.15.1] - 2026-03-21
### Javítva
- `Card.js`: Animációs időzítő hiba javítva (leálláskor fellépő null pointer hiba).

## [0.15.0] - 2026-03-21
### Hozzáadva
- `VideoPlayer` és `VideoSlide` teljes körű `GameLogger` integrációja.

### Javítva
- `main.js`: Összes maradvány `console.log` és `console.warn` lecserélve a központosított naplózóra.
- Tartalom konfigurációk: Debug hívások és felesleges TODO-k eltávolítva.
- Videó lejátszás: Stabilabb hibakezelés és tekerés-gátlás (seeking prevention) naplózás.

## [0.14.3] - 2026-03-21
### Eltávolítva
- Hub UI: Az "Előrehaladás" (progress bar) funkció eltávolítva a kártyákról (versenyhelyzetben felesleges).

### Javítva
- `Card.js`: Szintaktikai hiba javítva az Előrehaladás sáv eltávolítása után.

## [0.14.2] - 2026-03-21
### Javítva
- Hub UI: Eredeti évfolyam feliratok visszaállítva ("kőbe vésett" állapot).

## [0.14.1] - 2026-03-21
### Javítva
- Hub UI: Kettős 'x. osztály' felirat eltávolítva a kártyákról.
- Hub UI: A 0%-os előrehaladás jelzés elrejtve a letisztultabb felület érdekében.
- Hub UI: Tematikusabb leírások az évfolyam kártyákhoz.

## [0.14.0] - 2026-03-21
### Hozzáadva
- Átfogó unit tesztek a Core modulokhoz (`EventBus`, `GameLogger`, `TimeManager`).
- `DocumentFragment` alapú hatékony renderelés a `Hub` komponensben.
- Egyedi stílus és ikon támogatás a `Card` komponensben.
- Biztonsági timeout az audio fade-out folyamathoz a `PortalTransition`-ben.

### Javítva
- `TimeManager` perzisztencia hiba: az eltelt idő szinkronizálása a belső állapot és a tároló között.
- `Hub` komponens: felesleges `innerHTML` újrarajzolások megszüntetése.
- Unit teszt környezet: `TimeManager` mock-olási anomáliák feloldva.

## [0.13.0] - 2026-03-20
### Hozzáadva
- **Unit Teszt Alapozás (Phase 3)**: A projekt tesztlefedettsége 0%-ról ~89%-ra emelkedett a kritikus magmodulokban (`src/core/`).
- **Teszt Környezet**: Jest és Babel konfiguráció implementálva az ES modulok támogatásához.
- **Mock Rendszer**: Átfogó környezeti mock-ok (localStorage, performance, atob/btoa, fetch) a megbízható teszteléshez.
- **GameStateManager Tesztek**: 88% feletti lefedettség, validációs folyamatok és eseménykezelés ellenőrzése.
- **SecureStorage Tesztek**: 93% feletti lefedettség, titkosítási körfolyamatok és hibatűrés verifikálása.

### Javítva
- **Jest Konfiguráció**: Az elavult és hibás Jest beállítások javítva, a `moduleNameMapper` mostantól helyesen kezeli az útvonal aliasokat.
- **Konzol Hibák**: A tesztelési fázis során azonosított és javított aszinkron hívási és perzisztencia deszinkronizációs hibák.

## [0.12.0] - 2026-03-20
### Hozzáadva
- **Perzisztencia Konszolidáció (Phase 2)**: A projekt teljes szoftverarchitektúrája átállt az egységes `SecureStorage` használatára. Megszűnt minden közvetlen `localStorage` hívás.
- **Rendszer Flag-ek**: A `GameStateManager` mostantól központilag kezeli a rendszer-szintű beállításokat (pl. GDPR logging consent, Master Mode).
- **Debug Persistence**: A `DebugManager` és `DebugPanel` beállításai mostantól titkosítva tárolódnak.

### Javítva
- **SecureStorage Kompatibilitás**: Kijavítva a korábbi, titkosítatlan adatok betöltésekor fellépő hiba. A rendszer mostantól zökkenőmentesen kezeli a régi formátumú adatokat is.
- **Kód Tisztítás**: Az elárvult és backup fájlok (pl. `logging/Game`) eltávolításra kerültek.

## [0.11.0] - 2026-03-20
### Hozzáadva
- **Strukturált Naplózás (Phase 1)**: Az összes közvetlen `console.log`, `console.warn` és `console.error` hívás kivezetése a kritikus modulokból. Mostantól a `GameLogger` biztosítja a perzisztens, kategóriákra bontott és formázott naplózást az egész alkalmazásban.
- **Project Context & Gap Analysis**: Létrejött a `project-context.md` és `gap_analysis.md`, amelyek rögzítik a projekt technikai szabályait, az aszinkron hibakezelési mintákat és az építészeti döntések indoklását (pl. a `localStorage` kontrollált használata).

### Javítva
- **Init és Render hibakezelés**: A `main.js` inicializálási és diamegjelenítési folyamata robusztusabb lett a javított `try-catch` blokkoknak és a részletes hibanaplózásnak köszönhetően.
- **Syntax Fixes**: Kijavítva több, a refaktorálás során keletkezett szintaktikai hiba a skip-logikában és az állapotkezelésben.

## [0.10.0] - 2026-03-19
### Javítva
- **Hub visszatérés és TypeError**: Kijavítva a `showHub` metódusban fellépő hiba, a Hub mostantól tiszta állapotban és újrainicializálva jelenik meg a játék végén (visszatéréskor az évfolyamválasztóhoz).
- **Befejezés gomb**: A `SummarySlide` (összegző dia) „Befejezés” gombja most már kattintható és visszavisz a Hub-ba a központi navigáción keresztül.
- **Időzítő megállítása**: Az időzítő mostantól leáll az utolsó feladat (Finale) befejezésekor, még a mentés előtt, biztosítva a ranglista és a kijelző közötti tökéletes összhangot.
- **UI rétegek kattinthatósága**: A HUD és az alsó sáv átlátszó részei már nem blokkolják a kattintásokat (`pointer-events: none`), így az alatta lévő gombok is interaktívak maradtak.

## [0.9.9] - 2026-03-19
### Hozzáadva
- **Portál SFX**: Prémium MP3 alapú hanghatás a portál átmenethez, automatikus elhalkulással (fade-out).
- **Összegző Dia**: Játék végi statisztikai összefoglaló (Név, Osztály, Pontszám, Idő) elegáns glassmorphism designnal.

## [0.9.8] - 2026-03-19

### Javítva
- **Inventory Lightbox animáció:** Az inventory-ban lévő kulcsok nagyított nézetének bezárása mostantól pontosan a nyitás fordítottja. A korábbi hirtelen eltűnés helyett a kulcs képe visszakicsinyedik és a háttér elmosódása (blur) szinkronizáltan lassan szűnik meg a CSS transition-öknek köszönhetően.
- **Finale feladat trigger:** A Nagy Zár (Finale) feladat indítása mostantól konzisztens a többi állomással. A narráció elhangzása után a feladat modal nem ugrik fel automatikusan, hanem a felhasználónak a "Tovább" (jobbra) nyílra kell kattintania az indításhoz.

## [0.9.7] - 2026-03-15

### Hozzáadva
- **Részletes feladateredmények rögzítése:** Az `onTaskComplete` esemény mostantól egy strukturált `taskResults` tömbben gyűjti össze az egyes játékok eredményét (elért és maximális pontok, megoldási idő, próbálkozások száma, lépések stb.), majd ezt az új adatstruktúrát menti a szerverre az elavult `attempts` és `taskMetrics` helyett.
- **Felhasználóbarát Admin Dashboard:** A `dashboard.js` részletes eredmény modalját teljesen újraírtuk. A korábbi nyers, technikai listák (pl. belső azonosítókkal szereplő tömbök) helyett vizuálisan tiszta, soronkénti kimutatást ad minden feladatról ikonokkal, emberileg olvasható nevekkel, pontszámokkal és időkkel. Új CSS stílusok kerültek a `style.css`-be az adatok rácsos megjelenítéséhez.

### Javítva
- **FinaleGame adatbővítés:** Az utolsó feladat (`FinaleGame`) most már visszaküldi a szavak és a sorrend helyességének különálló adatait is, ami tökéletesen integrálódik az új dashboard nézetbe.
- **Kompatibilitás:** A dashboard képes kezelni a régi (0.9.6 és korábbi) mentéseket is, ilyenkor egy figyelmeztető "fallback" üzenetet jelenít meg a részletek hiányáról, miközben az összesített adatokat továbbra is mutatja.

## [0.9.6] - 2026-03-15

- **Ranglista és admin dashboard:** Teljesen új, önálló ranglista rendszer (`public/ranglista`), amely tartalmazza a statisztikai kimutatásokat (Chart.js), kereshető eredménylistát és az oklevélszerkesztőt.
- **Checkpoint-alapú mentés (v2):** A játékmenet során minden sikeresen teljesített állomás után automatikus mentés történik a szerverre (`manage_leaderboard.php`), minimalizálva az adatvesztés kockázatát.
- **Dinamikus Okmánygenerálás:** Oklevél és Gratulációs lap generálása PDF-szerű látványvilággal, letölthető formátumban.
- **Adminisztrációs elérés:** Rejtett trigger (5 kattintás a Hub címére) a ranglista eléréséhez.

### Javítva
- **Karakter megjelenítés az okmányokon:** Kijavítva a hiba, ami miatt a választott karakter nem jelent meg az oklevélen. Mostantól rétegzett módon jelenik meg a nagy felbontású (`large`) kép a háttérkép és a keret között.
- **Rugalmas útvonalkezelés:** A rendszer mostantól intelligensen felismeri a karakter azonosítóját a mentett adatokból, és a helyes évfolyam-specifikus útvonalat használja a képekhez.
- **Debug beállítások perzisztenciája:** A `DebugPanel.js` most már szelektíven törli a szekcióugrásokat, megőrizve a feladatkonfigurációkat, és szinkronizálva azokat a `build-config.json` fájllal.
- **gameData mappa elhelyezése:** A ranglista adatai a webalkalmazáson belülre, a `public/gameData/` mappába kerültek a jobb hordozhatóság érdekében.

### Módosítva
- **Vizuális finomhangolás:** Az oklevélen és gratulációs lapon a karakterek láthatósága (`opacity: 1`) és pozicionálása korrigálva.
- **Dashboard stílus:** Az admin felület reszponzívabbá vált, és támogatja az előnézeti módokat (`toggleCertificateEditor`).

## [0.9.5] - 2026-03-14

### Hozzáadva
- **Finale feladat (Nagy Zár) teljes implementálása:** A `FinaleGame` komponens (`FinaleGame.js`, `FinaleGame.css`) megvalósítja az 5 kulcs sorrendbe rakását drag-and-drop interakcióval, és a varázsszó bevitelét (`5kulcskell`).
- **Finale időzítő:** Az összefoglaló modalban megjelenik az eltelt idő, az időzítő az első kulcskattintás, bevitel vagy húzás pillanatában indul el – konzisztensen a többi feladatéval.
- **Inventory kulcs lightbox a Finale alatt:** A jobb oldali inventory-ban lévő kulcsokra kattintva a `GameInterface.showKeyLightbox()` hívódik meg, így a nagyított kulcskép megtekinthető a feladat alatt is.
- **Részleges pontozás (Finale):** A varázsszó és a kulcssorrend külön-külön pontozódik (5-5 pont), `help_json.txt` specifikáció alapján.
- **Küldetésnapló (journal) a Finale felett:** A Napló gomb és panel a feladat modal felett jelenik meg, `z-index` és `pointer-events` beállításokkal.
- **Napló csak gombbal zárható:** A Küldetésnapló panelt játék közben csak a „Bezárás" gombbal lehet bezárni, mellékattintásra nem.

### Javítva
- **Visszanavigáció a Finale után (kritikus hiba):** A feladat teljesítése utáni dián a bal nyíl (Vissza) nem reagált. Gyökérok: a `FinaleGame.init()` `finale-active` CSS-osztályt adott a bottom bar-hoz, ami `pointer-events: none`-t okozott (`FinaleGame.css`), és ez az osztály sosem törlődött le dia váltáskor. Javítva: `finale.destroy()` hívása az értékelési callback-ekben (`main.js`).
- **Finale feladat indítása visszalépéskor:** A `final_2` feladat mostantól csak előre haladáskor (`direction === 'forward'`) indul el automatikusan. Visszalépéskor nem nyílik meg a feladat modal újra.
- **`.maze-result-overlay` kattintás blokkolás:** Az összegző overlay `pointer-events: none` lett az alap állapotban, `pointer-events: auto` csak `.open` osztálynál (`Maze.css`). Így a fade-out közben nem blokkolta a navigációs gombokat.
- **`.dkv-task-modal-overlay` kattintás blokkolás:** Azonos `pointer-events` javítás az általános feladat modal overlay-n is (`design-system.css`).
- **Inventory kulcs drag kép torzulása:** A kulcsok húzásakor az inventory slotban a kép összenyomódott. CSS `object-fit: contain` és flexbox igazítással javítva (`FinaleGame.css`).
- **Varázsszó (helyes érték):** A `CORRECT_WORD` értéke `"5kulcskell"` lett a `help_json.txt` specifikáció alapján (`FinaleGame.js`).

### Módosítva
- **Finale summary modal:** A kiértékelés után megjelenő összegző ablak a többi feladathoz hasonló `maze-result-modal` komponenst használja, a Tovább gomb dia váltást végez.
- **Visszalépés-kezelő (`handlePrev`) ideiglenes diagnosztikai naplózás:** A `handlePrev` metódus konzol naplókat ír ki a visszalépés nyomkövetéséhez (fejlesztési segédeszköz).

## [0.9.4] - 2026-03-14

### Javítva
- **Portál és Videó szinkronizáció:** A diák videói mostantól szigorúan csak a portál tranzíció teljes befejezése (az örvény kinyílása) után indulnak el.
- **Portál időzítés korrekciója:** A tranzíció fázisai (anticipáció, nyitás, zoom) újra az eredeti, látványos 11 másodperces dinamikát követik.
- **`StorySlide` videó elem hiba:** Kijavítva a hiba, ami miatt `isPreview` módban nem jött létre a videó elem, így a portál után nem volt mit elindítani.
- **Videó betöltési stabilitás:** Bevezetésre került egy kényszerített `load()` hívás és egy 5 másodperces biztonsági időzítő, amely garantálja a videó elindulását lassabb hálózat esetén is.
- **Kép-fátyol eltűntetése:** A videó feletti statikus kép mostantól minden esetben (sikertelen lejátszáskor is) eltűnik a tranzíció végén, elkerülve a beragadt takarást.
- **Sprint dokumentáció szinkronizálása:** A `docs/` mappában lévő `sprint-3-stories.md` aktualizálva, és létrehozva a `sprint-4-stories.md`, tükrözve a projekt valós előrehaladását (v0.9.4). Minden Tailwind CSS utalás eltávolítva.

### Hozzáadva
- **`project-context.md`:** Áthelyezve a gyökérkönyvtárba. Ez a fájl tartalmazza a projekt alapvető technikai kontextusát, szabályait és az AI ágensek számára kritikus utasításokat.
- **Projektmenedzsment infrastruktúra:** Létrehozva az `_bmad-output` könyvtár, amely tartalmazza az epikeket (`epics.md`) és a sprint állapotát (`sprint-status.yaml`), biztosítva a strukturált fejlesztési folyamatot.
- **`isPreview` mód a diákhoz:** Lehetővé teszi a diák vizuális előnézetét (pl. portál lyukában) a lejátszási logika és a hang elindítása nélkül.
- **`playVideo()` metódus:** Egységes interfész a videólejátszás manuális, késleltetett indításához a `StorySlide` és `VideoSlide` komponensekben.

## [0.9.3] - 2026-03-05

### Hozzáadva
- **Kulcsgyűjtés** animáció implementálása
- **`KeyCollectionAnimation.destroy()` metódus:** Biztonságos, manuális megsemmisítési lehetőség az animációhoz. Visszafelé lapozáskor, valamint bármiféle diaváltáskor a `main.js` megsemmisíti és nullázza az esetleges beragadt kulcsaniámációt.
- **Kulcsanimáció 6 mp-es késleltetése:** A Siker/Öröm dián az animáció (sötétedés, csillogás, nagy kulcs megjelenése) egységesen 6 másodperccel a dia betöltése után indul, hagyva teret a narrációnak. A `_keyAnimationTimer` referencia biztonságosan törölhető lapozáskor.
- **`onAfterFade` callback a `showMazeResultModal`-ban:** Az összegző ablak gombkattintásához egy új, opcionális harmadik paramétert vezettünk be, amellyel pontosan szabályozható az overlay fade-out utáni időzítés.

### Javítva
- **Feladat Modal automatikus megjelenése:** A modal ablak mostantól kizárólag a „Tovább" (jobbra nyíl) gombra kattintva nyílik meg a feladat dián; az automatikus 1500 ms-os indítás eltávolításra került.
- **Beragadó kulcsanimáció (kritikus hiba):** Visszafelé lapozáskor a képernyőn maradt a pulzáló nagy kulcs. A `renderSlide` minden hívásának elején törli a beragadt animációt (és annak időzítőjét), így egyszerre sosem jelenhet meg kettő.
- **Kulcs fájlnevei:** A `KeyCollectionAnimation` belső `keyMap`-jébe visszakerültek a pontos fájlnevek (`keyA_drop`, `keyA_large_part1` stb.), amelyek egyeznek a `public/assets/images/grade3/keys` mappában lévő valódi fájlokkal.
- **Portál utáni pattanás (villanás):** A portál mögött megjelenő következő dia ezentúl `isPreview: false` módban példányosul, és a kész DOM elemét (`prebuiltComponent`, `prebuiltDOM`) közvetlenül kapja meg a `renderSlide`. Így a portál végén nincs újabb átépítés és villanás.
- **Kulcs pop-in animáció „pattanása":** Az overshoot `cubic-bezier` easing `ease-out`-ra cserélve. A `floatKey` CSS-animáció indítása a transition befejezése utánra (900 ms-ra) tolódott, és indítás előtt a `transition: none` kerül a kulcsra, kiküszöbölve a kétféle animáció ütközéséből adódó ugrást.
- **Kulcs sárga fénye a pop-in alatt:** A `drop-shadow` filter mostantól a kulcs kezdeti stílusának része, ezért a fény már a kiscsi méretű megjelenéstől fogva látható, nem csak a pulzáció indulásakor.
- **Összegző modal átmenetek sorrendje:** A „Tovább" gombra kattintva az eseménysor mostantól: 1. azonnali diaváltás (siker/öröm dia jelenik meg a háttérben), 2. 300 ms múlva a feladatmodal tűnik el, 3. az összegző overlay utolsóként halvályul el – a feladat dia többé nem villan vissza.

### Módosítva
- **`renderSlide` signature bővítése:** Új `prebuiltComponent` és `prebuiltDOM` opcionális paraméterekkel egészült ki, amelyek lehetővé teszik a portál alatti előregyártott komponens zökkenőmentes átvételét rendereléskor.
- **`_instantiateSlideComponent` bővítése:** Mostantól átadja a `stateManager`, `timeManager` és `apiService` hivatkozásokat is, biztosítva a teljes adatelérést a portálon átmenő komponenseknek.
- **Pulzálás sebessége:** A `floatKey` CSS animáció ciklusa 4 s-ről 5 s-re nőtt, a mozgás amplitúdója (`translateY(-10px) scale(1.05)` → `-5px` és `1.02`) csökkent a természetesebb lebegés érdekében.

## [0.9.2] - 2026-02-28

### Hozzáadva
- **Automatikus Videófelismerés (Debug & Éles motor):** A `Debug Panel` mellett immár a `SlideManager` is automatikusan ellenőrzi (`HEAD` kérésekkel) a `/public/assets/video/...` mappát pálya (grade) inicializáláskor. Ha a diának megfelelő nevű videót talál (Pl.: `slide_05.mp4`), felülírja a dia típusát `SLIDE_TYPES.VIDEO`-ra és beállítja az elérést. Így a videók (mind az intro, mind az állomásoké) élesben le fognak játszódni `video-config.json` módosítása nélkül is az elhelyezést követően.

### Javítva
- **Debug panel:** A "Videó" fül alatti legördülő dia-kiválasztó (`Select`) mező szélessége korlátozásra került (JS `substring` karakter limit), így hosszú dia-nevek esetén sem nyílik túl a panel határain maga az operációs rendszer által rajzolt popup.
- **Automatikus Videófelismerés Célzottsága:** A `HEAD` kérés feldolgozásához beépült egy `Content-Type` ellenőrzés (kiszűrve a `text/html`-t), kiküszöbölve ezzel a Vite lokális szerver SPA fallbackjéből származó hamis pozitív találatokat (nem létező videók fals validálása).
- **Portál szűréskezelése:** Kijavítva az a hiba, ami miatt a `Debug Panel`-ben történő diaszűréskor a portál átlapolódása alatti háttérkép deszinkronba került a ténylegesen következő prezentált dia hátterével. A pontos DOM-kép generálásához bevezetésre került a `_peekNextValidSlide()` logika.
- **Portál Videólejátszás Kiküszöbölése:** A portál átmenet közben az ideiglenesen legenerált következő dia ezentúl `isPreview` módban példányosul, ami letiltja a `StorySlide` videólejátszását a tranzíció alatt (csak a "poster" statikus kép jelenik meg az átlapolódás során, elkerülve a dupla/zavaró videóidítást).
- Belső transzparens "lyuk" (Alpha átmenet) fekete peremének kijavítása.
- Fehér színkezelés a "core glow" részen `premultiplied alpha` segítségével.

### Módosítva
- **Portál Shader Újratervezés:** A portál korábbi `color / rz` számítási logikája szétbontásra került független skaláris `glow` (fényerő, struktúra) és szín (`color`) rétegekre. Ezáltal a portál domináns fehér sávja és belső lyuk átmérője fix és konzisztens maradt, függetlenül az alkalmazott színektől.
- **Színkeveredési logika:** Teljesen új, súlyozott négyzetes fbm (folyamatos zaj) alapú színkeveredési logika valósult meg, amely 4 db szabadon definiálható, fáziseltolt szín (hex paletta) örvénylő egybeolvadását biztosítja minden állomásnál. Megszűnt a csatorna-klampolás miatti nem kívánt türkizes torzulás a sötétkék színeknél.
- **Állomás-függő portál színek:** A `main.js`-ben paraméterezhetővé váltak az állomásokhoz tartozó portálszínek 4 független hex értékből álló tömbben (pl. a Labirintuskert 4 zöld árnyalatot használ), amely színeket a WebGL ShaderMaterial Uniform változóin keresztül adunk át.

## [0.9.1] - 2026-02-28


### Hozzáadva
- **Portál állomás-függő szín:** Egyetlen `uColor` uniform a shaderben, amely állomásonként eltérő portálszínt biztosít (pl. Labirintuskert: `#4c6d5a`). A szín luminanciája automatikusan normalizálódik, hogy a fehér sáv vastagsága és a belső lyuk mérete bármilyen szín esetén azonos maradjon.
- **Portál → Finálé tranzíció:** Az 5. állomás (`station_5`) utolsó diájáról a Finálé (`section: 'final'`) első diájára is portál tranzíció indul.

### Módosítva
- **UI z-index javítás:** A `#dkv-layer-ui` z-index értéke 1000-ről 2500-ra emelve, hogy a kezelőszervek (gombok, idővonal, avatar, pontszám) mindig a portál rétegek (2200–2400) felett legyenek.
- **Finish pattanás javítás:** A portál DOM cleanup `requestAnimationFrame` kettős késleltetéssel (double rAF) történik, így az új dia kirajzolása után törlődnek a portál rétegek – nincs fekete villanás.
- **Portál maskContainer kezdeti opacity:** CSS-ben `opacity: 0`-ról indulva a DOM-ba kerüléskor láthatatlan, a JS animáció állítja fokozatosan láthatóvá – nincs indulási pattanás.
- **Háttérkép ovális tágulás leválasztása:** Az ovális clip-path saját `ovalZoom = pow(uZoom, 1.5)` ütemmel tágul, függetlenül a portál shader `uZoom`-jától – lassabban indul, a végén beéri.
- **Háttérkép teljes képernyős lefedés:** Az ellipszis `120vh × 120vh`-ra nő (`uZoom=1`-nél), ami a 16:9-es képernyő átlóját (≈102vh) bőven lefedi.
- **Fehér sáv vastagságának szabályozása:** A `circ()` függvény meredeksége hangolhatóvá vált a szorzó értékkel (eredeti: `3.`, jelenlegi: felhasználó által beállított).

## [0.9.0] - 2026-02-27

### Hozzáadva
- **Portál VFX szekvencia** ✨
  - **Three.js Points részecske rendszer:** 4 darab izzó, 3D-s pályákon keringő energiapont, `AdditiveBlending`-gel és radiális gradiens `CanvasTexture`-rel igazi ragyogás érdekében.
  - **Kétpasszos renderelés:** `renderer.autoClear = false` – az 1. passz a részecskéket additívan rajzolja, a 2. passz a portál shader-t normál blendinggel rétegezi rá.
  - **Anticipáció fázis (0–4 mp):** A részecskék a portál megjelenését előzik meg, jelezve, hogy valami készülődik.
  - **Portál belső kép:** A portál fánk közepén (`alphaInner` által átlátszó zóna) a `maskContainer` CSS `clip-path: ellipse()` segítségével a következő helyszín képe jelenik meg, `uOpen`-nel szinkronban tágulva.
  - **Körkörös maszk megnyitás:** A portál nem koordináta-skálázással, hanem `smoothstep` körkörös maszkkal jelenik meg – `uOpen=0`-nál rejtett, `uOpen=1`-nél teljes méret.
  - **Core glow:** Kékes–fehér izzás a portál belső peremén.

### Módosítva
- **Portál shader letisztítása:** Az `uPhase`, `uFlash` és `ACESFilm` kódok eltávolítva – a shader most kizárólag a portál mintázatát és a körkörös maszkot kezeli.
- **Portál teljes színnel jelenik meg:** Az `* uOpen` szorzó eltávolítva az alfából – a portál soha nem átlátszó/fakó a nyitás során.
- **Click-blocker `pointer-events: none`:** A kezelőszervek (idővonal, avatar, gombok) kattinthatóak a portál réteg felett.

## [0.8.9] - 2026-02-23

### Hozzáadva
- **Hangerdő (Sound) 5. állomás feladat implementálása** 🎧
  - JS Audio API alapú, Vanilla JS egyedi lejátszó sebességszabályzóval (0.25x - 4x) a feladat megoldásához.
  - Feltételes feladatmegjelenítés (Reveal), mely animálva fedi fel a kérdéseket a hang legelső végighallgatása után.
  - Dinamikus sorrendfüggő (fő üzenet) és sorrendfüggetlen (suttogások, számok) szöveg-/számkiértékelő rendszere.
  - Integráció a központi 15 perces időkorláttal és pontrendszerrel (fix 5 pont az 5. állomás teljesítéséért).

## [0.8.8] - 2026-02-22

### Hozzáadva
- **Pixel Palota (Puzzle) feladat implementálása** 🧩
  - Teljes értékű Vanilla JS átirat a React alapú kódokból (jigsaw generátor, bezier görbék, canvas rajzolás).
  - Drag and drop (vonszolás) funkció egyedi árnyék / lebegés animációval, és automatikus mágneses összeillesztéssel (snapping) a szomszédos elemek megtalálására.
  - Középre igazított, reszponzív játékmező: a generált puzzle csoport minden indításkor a látható képernyő (viewport) közepén inicializálódik a könnyű játszhatóság érdekében.
  - Integráció az 1-es állomáshoz hasonló (Maze) keretrendszeri szolgáltatásokkal: előre számoló stopper, pontozás és modals ablakok.
  - **Debug Panel Támogatás:** A 'Tasks' fül alatt valós időben állíthatóvá vált a feladat nehézsége (darabszám). Bevezetésre került egy központosított **Egységes Időkorlát** beállítás, amely az összes játék állomására érvényes, és alapértelmezetten 900 másodperc (15 perc).

## [0.8.7] - 2026-02-22

### Javítva
- **Üres modal az Intróban/Fináléban:** Pontosítva lett a feladat dia felismertetése a `main.js`-ben (`section?.startsWith('station_')`), ami megakadályozza, hogy a bevezető, illetve lezáró képsorok feladatnak érzékeljék magukat és nem várt, tartalom nélküli modál ablakot dobjanak fel.
- **Hiányzó OK gomb a jövőbeli feladatoknál:** A nem implementált állomások (pl. Pixel Palota) visszajelző - helyőrző - ablakain most már újra ott a továbblépéshez szükséges OK gomb, miután a `showTaskModal` hívásakor törlésre kerül a gomb inline `display: none` rejtése, amit a korábbi, saját navigációt használó feladatok hagytak hátra.

## [0.8.6] - 2026-02-22

### Hozzáadva
- **Tudás Torony (Kvíz) feladat implementálása** 🧠
  - Kvíz betöltése dinamikusan a `public/assets/data/grade3/quiz/3.txt` fájlból.
  - Új `QuizGame.js` és `Quiz.css` komponensek az alkalmazás neon vizuális nyelvezetével.
  - Lapozható felület 1 kérdés / oldal beállítással, ami biztosítja a tökéletes illeszkedést a képernyőre.
  - **Véletlenszerűség (Anti-Cheat):** Fájlból olvasás után a rendszer megkeveri a kérdések listáját, és azokon belül a lehetséges válaszok (A,B,C,D) sorrendjét is! Így két játékos sosem kapja ugyanazt a tesztsort azonos sorrendben.
  - **Valós idejű pontozás:** "Lebegő pont" (+1, +0) animációk implementálva az egyes válaszelemek (`quiz-option`) kiválasztásakor (referencia: onboarding design). A szerzett pontok azonnal megjelennek a játék HUD felületén is.

### Módosítva
- **Eredmények Modál (`main.js`)**
  - A korábbi "Labirintus" specifikus összesítő ablak most már minden állomásnál dinamikusan testreszabott címeket jelenít meg (pl. "Megválaszoltad a kérdéseket!").
  - A "Lépések száma" statisztikai elem elrejtésre kerül, amennyiben a feladat nem labirintus (nincs `stepCount` paraméter).
  - A kiértékelés az eddigi "fix pont" helyett rögzíti, és ki is írja a maximálisan szerezhető pontot, az elért eredményhez viszonyítva.

## [0.8.5] - 2026-02-22


### Módosítva
- **Adat-tenger (Memory) finomhangolása** 🧩
  - **Vizuális fejlesztések:** fehér kártyaszegélyek, teljes méretű ikonok (`background-size: cover`), megtalált párok animált eltűnése.
  - **Fejléc korrekció:** olvashatóbb betűtípus a modalban, egymás alá rendezett cím és alcím a jobb helykihasználásért.
  - **Időzítő:** előre számoló óra (⏱️ 00:00), amely a fejléc jobb felső sarkában kapott helyet az átláthatóbb játéktér érdekében.
  - **Pontozás:** fix 5 pont a teljesítéskor (labirintus feladattal szinkronizálva).
- **Debug & Konfiguráció** 🛠️
  - **Memory időkorlát:** a Debug Panelen mostantól másodperc alapú időkorlát is megadható (0 = végtelen).
  - **StateManager:** javított feladat-visszaállítási logika a Debug Panelen.
- **Rendszerszintű javítások** ⚙️
  - Robusztusabb audio lejátszás kezelés (`readyState` ellenőrzés és `load()` kényszerítés).
  - Rugalmasabb `showTaskModal` fejléc kezelés (dinamikus cím/alcím támogatás).

## [0.8.3] - 2026-02-22

### Hozzáadva
- **Adat-tenger (Memory) feladat implementálása** 🌊
  - Teljesen új `MemoryGame.js` és `Memory.css` komponensek.
  - 28 darab egyedi informatikai ikon, dinamikus rácsméret (alap: 16 kártya).
  - Modern, cyberpunk vizuális világ (neon keretek, bináris minták, animált kártyafordítás).
  - Debug Panel támogatás: a memóriajáték nehézsége (kártyák száma) mostantól állítható és menthető.
- **Feladatok egyszeri kitöltésének védelme** 🛡️
  - A `GameStateManager` már perzisztensen tárolja a befejezett diák ID-it.
  - Ha egy feladatot egyszer már megoldottak, visszalépéskor a modal nem nyílik meg újra, és a pontszerzés is korlátozva lett.

## [0.8.2] - 2026-02-22

### Javítva
- **`build-config.json` skip logika javítása (éles szerver):**
  - `_prodShouldSkipSlide()` mostantól `slide.id` (string, pl. `"st1_s1"`) alapján hasonlít a `skipSlides` tömbhöz – korábban numerikus indexet (`slideIndex`) használt, ami soha nem egyezett. A kihagyás most shuffle-biztos és helyes PROD módban.
  - `useDummyData: true` esetén az onboarding skip PROD módban is alkalmazza az alapértelmezett profil adatokat (felhasználói profil + karakterválasztás).
- **Labirintus nehézség (PROD):**
  - `mazeDifficulty` és `mazeTimeLimit` mostantól `buildConfig`-ból töltődik be, ha `debugManager` nincs jelen – korábban hardkódolt `12`-es és `600`-as fallback volt. Mindkét `MazeGame` példányosítási ponton javítva.
- **Képek kiterjesztés-korrekciója:**
  - JPEG tartalmú, tévesen `.png` kiterjesztésű fájlok átnevezve: `hub-bg.png` → `hub-bg.jpg`, `icon-192.png` → `icon-192.jpg`, `icon-512.png` → `icon-512.jpg`.
  - `grade3/onboarding_bg.png` törölve (a `.jpg` változat már létezett).
  - `grade4–6/config.js` hivatkozások szintén `onboarding_bg.jpg`-re mutatnak.
  - `design-system.css` és `manifest.json` frissítve (type: `image/jpeg`).

### Módosítva
- **Labirintus vizuális stílus:**
  - Neon ragyogás eltávolítva a canvas falak rajzolóból (`ctx.shadowColor`, `ctx.shadowBlur`).
  - `box-shadow` eltávolítva a `#mazeCanvas`-ról.
  - Az eredmény modal (`success`/`failure`) `box-shadow` intenzitása csökkentve (40px → 20px).
  - A feladatmodal általános `box-shadow` értéke mérsékelve.

## [0.8.1] - 2026-02-22

### Hozzáadva
- **Éles szerverre telepítés támogatása** 🚀
  - Új `public/build-config.json` fájl: a fejlesztői Debug Panelen elvégzett beállítások (szekcióugrás, időlimit, nehézség stb.) ebbe a fájlba exportálódnak, és `npm run build` után bekerülnek a `dist/` könyvtárba, így éles szerveren is érvényesülnek.
  - Új `/__api/build-config` GET/POST Vite plugin endpoint: a Debug Panel mentéskor automatikusan frissíti a `public/build-config.json`-t.
  - `base: './'` beállítás a `vite.config.js`-ben: az összes asset-hivatkozás relatív útvonalú lesz a buildben, így a program **bármilyen nevű almappából** működik az éles szerveren.
- **Éles szerveren is érvényes skip logika** 🎮
  - Új `_loadBuildConfig()` metódus a `main.js`-ben: DEV és PROD módban egyaránt betölti a `build-config.json`-t.
  - Új `_prodShouldSkipSlide()` metódus: éles szerveren a `buildConfig.skipSections` és `skipSlides` alapján dönti el, hogy egy dia kihagyandó-e (a debugManager nélkül).
  - A `renderSlide()` section skip logikája mostantól mindkét módban (DEV/PROD) helyesen működik.
- **Video konfig localStorage-tárolás** 💾
  - A videóbeállítások (késleltetés, ismétlés) mostantól `localStorage`-ban is tárolódnak (`dkv-video-config-grade3` stb.), így éles szerveren is megmaradnak – a fejlesztői API-tól függetlenül.

### Módosítva
- **Labirintus nehézség alapértéke:** 12×12 → **16×16**-os rács.
- **Labirintus lépésszámláló layout javítás:** A lépések 3 számjegyűre váltásakor már nem tolja el a „Juss el a kulcsig!" feliratot. A `.maze-steps` fix szélességű (`width: 160px`), a `.step-count` `min-width: 3ch` értékű, jobbra igazított.
- **Debug Panel Tasks fül:** Az időlimit és nehézség mentésgombja együttesen exportálja a beállításokat a `build-config.json`-ba.

## [0.8.0] - 2026-02-22

### Added
- **Stabil Slide ID Rendszer** 🛡️
  - **100% Metadata-alapú mapping:** Megszüntettem az összes keménykódolt indexet a `DebugConfig.js`-ben. Mostantól minden szekció és dia azonosítása a `metadata.section` és `slide.id` alapján történik, ami immúnissá teszi a rendszert a Station Shuffle-re és a diák számának változására.
  - A Debug Panel mostantól megjeleníti az ID-kat a listában ([id] formátum) a pontosabb tesztelés érdekében.
  - **Auto-save:** A Debug Panel beállításai (skip list) azonnal mentésre kerülnek a `localStorage`-ba.

### Fixed
- **Debug Panel Persistence:** Megszűnt a beállítások elcsúszása az állomások sorsolása után az ID-alapú mentésnek köszönhetően.
- **Maze Vertical Centering (Végleges Javítás):** A Labirintuskert feladat most már tökéletesen és biztonságosan középre igazítva jelenik meg a 900px-es modálban.
    - A valódi hibaok a `main.js`-ben volt: a `maze-task-container`-ből hiányzott a `height: 100%` stílus, emiatt nem töltötte ki a Grid cellát.
    - A Task Modal Overlay Grid struktúrát kapott (`grid-template-rows: 1fr`), ahol a törzs, a fejléc és az OK gomb egymásra rétegezve jelennek meg.
    - A törzs (`dkv-task-modal-body`) `display: grid; place-items: center;` segítségével centerezi a tartalmát.
    - **Izolált Architektúra:** A módosítások kizárólag a Task Modalt és a `main.js` Maze-indítási logikáját érintik.
- **Debug UI Finomhangolás:**
  - A szekciók neve mellől eltávolítva a zavaró "(X slides)" felirat.
  - A szekció kiválasztása (névre kattintás) mostantól elválik a skip funkciótól (checkbox).
  - Vizuális visszajelzés (kurzor és aláhúzás) a kattintható szekciónevekhez.

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