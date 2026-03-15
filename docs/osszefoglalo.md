# Projekt Összefoglaló: Digitális Kultúra Verseny

Ez a dokumentum a "Digitális Kultúra Verseny" projekt architektúrájának, technológiai hátterének és működési logikájának összefoglalását tartalmazza.

## 1. A Projekt Célja és Működése

A "Digitális Kultúra Verseny" egy böngészőben futó, interaktív, történetvezérelt oktatási alkalmazás, amely 3-6. osztályos általános iskolás diákokat céloz meg. A cél a digitális írástudás és a logikai gondolkodás fejlesztése egy játékos, "Kód Királyság" nevű fantáziavilágba ágyazott kalandon keresztül.

A felhasználói élmény egy lineáris, "diákból" (slide-okból) álló folyamat, amely a következő lépésekből épül fel:
1.  **Regisztráció és Karakterválasztás:** A diák megadja az adatait és választ egy avatárt.
2.  **Évfolyamválasztás (Hub):** A központi képernyőn választ évfolyamot.
3.  **Történeti Diák:** Videók és narrációk vezetik végig a kalandon.
4.  **Interaktív Feladatok:** Minden történeti szegmens egy interaktív feladattal (logikai rejtvény, kvíz, memóriajáték stb.) zárul.
5.  **Haladás:** A rendszer minden állomás után menti a játékos haladását, pontszámát és a megszerzett "kulcsokat".

Minden adat a felhasználó böngészőjének `LocalStorage`-ében tárolódik, az alkalmazás nem igényel szerveroldali adatbázist a felhasználói adatokhoz.

## 2. Technológiai Stack és Architektúra

Bár a `package.json` fájl tartalmaz Vue.js-hez kapcsolódó függőségeket, a projekt valójában **tiszta (Vanilla) JavaScript** alapokon nyugszik, modern ES6+ szintaktikát (osztályok, modulok, async/await) használva.

### Főbb Technológiák:
-   **JavaScript (ES6+):** A teljes alkalmazáslogika ezen a nyelven íródott.
-   **Vite:** A projekt build-elését és a fejlesztői szerver futtatását végzi.
-   **CSS3:** Egyedi CSS változókkal és modern elrendezési technikákkal (Grid, Flexbox) felépített design system.
-   **Jest:** Unit teszteléshez használt keretrendszer.
-   **ESLint & Prettier:** Kódminőség és formázás biztosítására.
-   **Three.js:** A diák közötti átmeneteknél használt WebGL alapú "portál" effektus megvalósítására.

### Architektúra:
A projekt egyedi, jól strukturált, komponensalapú architektúrát követ:

1.  **SEL (State-Event-Logger) Architektúra:**
    *   **`GameStateManager`:** A teljes alkalmazás állapotát kezeli (pl. pontszám, aktuális dia, felhasználói profil). Felelős az állapot mentéséért és betöltéséért a `LocalStorage`-ből.
    *   **`EventBus`:** Eseményvezérelt kommunikációs csatornát biztosít a különböző modulok között, csökkentve a közvetlen függőségeket.
    *   **`GameLogger`:** Naplózási feladatokat lát el, segítve a fejlesztést és a hibakeresést.

2.  **`DigitalKulturaVerseny` Fő Osztály:**
    *   Ez az alkalmazás központi belépési pontja (`src/main.js`).
    *   Inicializálja és összefogja az összes fő komponenst (SEL, UI, motor).
    *   Kezeli a fő alkalmazás-ciklust.

3.  **App Shell (Alkalmazás Héj):**
    *   Egy rétegzett DOM struktúra, amely perzisztens UI elemeket (pl. a játék felületét, HUD-ot) választ el a dinamikusan változó tartalomtól (az aktuális diáktól).
    *   Rétegei: háttér, tartalom (`layerContent`), és a felhasználói felület (`layerUI`).

4.  **`SlideManager` és "Komponensek":**
    *   A `SlideManager` felelős a diák sorrendjének kezeléséért, a köztük való navigációért.
    *   Minden dia-típushoz (pl. `WelcomeSlide`, `VideoSlide`, `TaskSlide`) tartozik egy saját JavaScript osztály, amely a hozzá tartozó DOM-elem létrehozását és a viselkedését menedzseli. Ez a minta a modern frontend keretrendszerek (React, Vue) komponens-alapú logikáját idézi.

## 3. A Projekt Felépítése (`src` mappa)

-   `core/`: Az alkalmazás magja, itt található a SEL architektúra, az időzítést kezelő `TimeManager` és a `SlideManager` motor.
-   `content/`: Itt helyezkednek el az évfolyam-specifikus tartalmak, beleértve a feladatok (`tasks`) logikáját (pl. `MazeGame.js`, `MemoryGame.js`).
-   `ui/`: A felhasználói felülethez tartozó osztályok (`components`), stíluslapok (`styles`) és a `GameInterface` (a játék HUD-ja).
-   `features/`: Önálló funkciókat megvalósító modulok, mint pl. a `Hub.js` (évfolyamválasztó).
-   `main.js`: Az alkalmazás belépési pontja, amely mindent inicializál és elindít.

## 4. Összegzés

A "Digitális Kultúra Verseny" egy gondosan megtervezett, tiszta JavaScriptre épülő webalkalmazás. Annak ellenére, hogy nem használ külső frontend keretrendszert, a belső architektúrája modern, jól strukturált és karbantartható. A SEL-modell és a komponens-szerű felépítés robusztus alapot biztosít a komplex, interaktív tartalom kezeléséhez. A projekt dokumentációja (README, PRD) nagyrészt pontos, kivéve a technológiai stackre vonatkozó (Vue.js) téves információt, amelyet a `package.json` félrevezető tartalma okozhatott.
