# Upgrade Audio & UI Architecture: Unified App Shell

**Koncepció:** A "Destructive Rendering" (mindent törlő) módszer leváltása a **"Unified App Shell"** (Perzisztens Keretrendszer) architektúrára. Ez biztosítja, hogy a DOM eseményláncok (`event bubbling`) soha ne szakadjanak meg, garantálva a hangok lejátszását és a zökkenőmentes vizuális élményt.

## 1. Az Új Perzisztens Struktúra
A `main.js` az induláskor (`init`) létrehoz egy **egyetlen, örök életű** DOM szerkezetet. A `renderSlide` soha többé nem használ `innerHTML = ''`-t a gyökér elemen, csak a rétegek tartalmát frissíti.

```html
<div id="app">
    <!-- RÉTEG 1: Rendszer/Háttér (Z-Index: 0) -->
    <!-- Ide jöhetnek a globális hátterek, videók, ha átnyúlnak több dián -->
    <div id="dkv-layer-background"></div>

    <!-- RÉTEG 2: Dinamikus Tartalom (Z-Index: 10) -->
    <!-- Ide renderelődnek a komponensek (WelcomeSlide, StorySlide, RegistrationSlide) -->
    <!-- SOHA nem töröljük magát a konténert, csak a child elementet cseréljük -->
    <div id="dkv-layer-content" class="dkv-content-area"></div>

    <!-- RÉTEG 3: Persistent UI / HUD (Z-Index: 100) -->
    <!-- A GameInterface ide renderel. Onboarding alatt hidden, játék alatt visible. -->
    <div id="dkv-layer-ui"></div>
</div>
```

---

## 2. Mélyreható Kockázatelemzés és Buktatók (Deep Dive Risk Analysis)

A legkritikusabb rész. Hol fog eltörni a kód, ha nem figyelünk?

### I. CSS Szelektor Összeomlás (Critical)
**Helyzet:** Jelenleg sok CSS szabály (`grade3/styles/*.css`) közvetlen leszármazottakra vagy `body` szintű elemekre hivatkozik.
**Veszély:** Az új rétegrendszer (`#dkv-layer-content`) beékelődése miatt a meglévő szelektorok (pl. `#app > .dkv-welcome-slide`) érvénytelenné válhatnak, és a layout szétesik (fehér képernyő, torz gombok).
**Megoldás:**
*   Át kell nézni a CSS fájlokat (`Welcome.css`, `Registration.css`, `Character.css`).
*   A `position: fixed` elemeket (`StorySlide`) ellenőrizni kell: ha a `layer-content`-en belül vannak, a `fixed` a viewport-hoz igazodik (jó), de ha `absolute`-ot használunk, akkor a szülőhöz.
*   *Akció:* A slide komponenseket `100% width/height`-re kell állítani, hogy kitöltsék a `layer-content`-et.

### II. Z-Index Háború (HUD Takarás)
**Helyzet:** A `StorySlide` jelenleg tartalmaz "Fullscreen" elemeket (`z-index: -1`, `position: fixed`).
**Veszély:** Ha betesszük a `dkv-layer-content`-be, és a `dkv-layer-ui` (HUD) felette van, a StorySlide interaktív elemei (ha vannak) kattinthatóak maradnak? Vagy fordítva: a StorySlide kitakarja a HUD-ot (`z-index` conflict)?
**Megoldás:**
*   Szigorú Z-Index hierarchia definiálása CSS-ben:
    *   Background: 0
    *   Content: 10-90
    *   UI/HUD: 100+
    *   Modals/Overlays: 1000+
*   A `StorySlide.js`-ben lévő inline style `z-index: -1` törlése vagy korrigálása, mert az új rendszerben már eleve rétegezve van, nem kell negatív indexszel bűvészkedni.

### III. Eseményfigyelő "Zombik" (Memory Leak)
**Helyzet:** A jelenlegi rendszerben a `innerHTML = ''` brutálisan, de hatékonyan takarított. Minden DOM elemhez kötött listener meghalt.
**Veszély:** Az új rendszerben a komponenseket (JS osztályok) példányosítjuk. Ha a `RegistrationSlide` feliratkozik a `window.resize`-ra vagy `document` eseményre, és diaváltáskor nem hívjuk meg a `destroy()`-t (vagy nincs implementálva), a listener ott marad. 100 diaváltás után 100 zombi listener lassítja a gépet és okoz furcsa hibákat.
**Megoldás:**
*   **KÖTELEZŐ DESTROY PROTOKOLL:** Minden egyes slide komponensnek (`WelcomeSlide`, `StorySlide`, stb.) *kell* hogy legyen egy `destroy()` metódusa, ami takarít.
*   A `main.js`-ben diaváltáskor *kötelező* meghívni az előző komponens `destroy()`-át az új létrehozása előtt.

### IV. GameInterface API Hívások
**Helyzet:** Jelenleg a `GameInterface` újrapéldányosul (re-init). A gombok (`main.js` callbackek) frissek.
**Veszély:** Ha a `GameInterface` perzisztens, akkor az `onNext` callback, amit a konstruktorban kapott, az *eredeti* `main.js` állapotra mutathat (closure trap), bár `this.renderSlide`-ot hív, ami elvileg jó. Nagyobb baj, ha a `main.js` belső állapota változik, és a UI nem értesül róla (pl. hangerő state).
**Megoldás:**
*   A `main.js` metódusainak (`handleNext`, `handlePrev`) stabilnak kell lenniük.
*   A `GameInterface`-nek reaktívnak kell lennie a `updateHUD` és `setNextButtonState` hívásokra (ez már nagyrészt megvan).

---

## 3. Érintett Fájlok és Teendők Listája

### `src/main.js` (Az Építész)
1.  **`initAppShell()` metódus:** Létrehozza a 3 réteget.
2.  **`renderSlide()` refaktor:**
    *   Ellenőrzi: Van-e aktív komponens? -> `currentSlideComponent.destroy()`.
    *   Létrehozza az újat.
    *   `dkv-layer-content.appendChild(newComponent.element)`.
    *   Kezeli a `dkv-layer-ui` láthatóságát (`classList.toggle('hidden', isBypassed)`).

### `src/ui/components/GameInterface.js` (A UI Réteg)
1.  Jelenleg ez egy "keret", ami *tartalmazza* a contentet. **EZT MEG KELL VÁLTOZTATNI.**
2.  Az új koncepcióban a `GameInterface` **CSAK a HUD-ot és a Gombokat** rajzolja ki a `dkv-layer-ui`-ba.
3.  A `dkv-game-content-area` (a fehér terület) kezelése kiesik a hatásköréből, VAGY a `GameInterface` marad a wrapper, de akkor az Onboarding alatt is használnunk kell (csak rejtett HUD-dal)? -> **NEM.**
4.  **Döntés:** A `GameInterface` legyen egy overlay komponens (Top Bar + Bottom Bar + Sidebar). A középső tartalom (`content-layer`) független tőle.
5.  *Veszély:* A layout (CSS grid) jelenleg a `GameInterface`-ben van definiálva. Ha szétszedjük, a content pozicionálását a `layer-content`-nek kell átvennie.

### `src/ui/components/StorySlide.js` (A Tartalom)
1.  **Z-Index/Position korrekció:** Ne legyen `fixed`, vagy ha igen, akkor kezeljük helyén a rétegrendben.
2.  **Destroy implementáció:** Videók leállítása, timeoutok tisztítása (már megvan, ellenőrizni).

---

## 4. Akcióterv (Sorrend)

### Fázis 0: Component Cleanup & Stabilitás (AZONNAL)
**Indoklás:** Az audit során kiderült, hogy a jelenlegi komponensek (`RegistrationSlide`, `CharacterSlide`) súlyos memóriaszivárgást és DOM-szemetelést okoznak (Modalok a `body`-ban maradnak, Timeout-ok futnak tovább). Ezt **kötelező** javítani az architektúraváltás előtt.
- [ ] **`StorySlide.js`:** Timeout törlése a `destroy`-ban.
- [ ] **`CharacterSlide.js`:** `destroy()` megírása (Timeoutok, Modal a body-ból ki, Event Listeners).
- [ ] **`RegistrationSlide.js`:** `destroy()` megírása (Modal, Timeoutok).
- [ ] **`WelcomeSlide.js`:** `destroy()` megírása (ha szükséges).

### Fázis 1: CSS és Layout Előkészítés
- [ ] `GameInterface` CSS szétválasztása.
- [ ] Rétegrendszer (`z-index`) definiálása.

### Fázis 2: Shell Implementáció (`main.js`)
- [ ] `initAppShell` megírása.
- [ ] `renderSlide` refaktorálás.

### Fázis 3: Tesztelés
...

---
## 5. Audit Report (2026-01-03)
**Feltárt kritikus hibák, melyek javítása elengedhetetlen:**
1.  **Zombie Modals:** A `RegistrationSlide` és `CharacterSlide` közvetlenül a `document.body`-ba fűzi a modális ablakokat, de soha nem távolítja el őket. Újrarendereléskor ezek felhalmozódnak.
2.  **Unmanaged Timeouts:** Számos animációs `setTimeout` (gépelés, kártyák megjelenése) nincs eltárolva és törölve. Gyors navigációnál ezek hibaüzeneteket okoznak a konzolon.
3.  **Hiányzó Lifecycle:** A legtöbb komponensből hiányzik a standard `destroy()` metódus.

**Javítási stratégia:** Minden komponens kap egy `this.timeouts = []` tömböt és egy robusztus `destroy()` metódust.


---
**Státusz:** Mélyelemzés kész. A legnagyobb kockázat a **CSS Layout** szétesése a GameInterface "kibelezett" szerepe miatt. Erre külön figyelmet fordítunk.
