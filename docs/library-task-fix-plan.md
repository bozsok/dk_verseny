# LibraryTask (Station 3) – Kritikus hibajegyzék és javítási terv

## A probléma leírása

A 3. állomás (Logikai Könyvtár) feladatának viewport tartalma (kép + 3 metaadat kártya) **nem válik teljesen láthatóvá és kattinthatóvá** az animáció során. Az írógépszerű bevezető és a Súgó rendben működik, de a feladat interaktív része „befagy" egy félig animált állapotban. A konzolban nincs hibaüzenet.

## Gyökér ok

**Race condition** a kép cache-elése és az `onload` handler regisztrálása között, kombinálva a **CSS és JS közötti `opacity` ütközéssel**.

---

## Érintett fájlok

| Fájl | Útvonal |
|---|---|
| **LibraryTask.js** | `src/content/grade4/tasks/library/LibraryTask.js` |
| **LibraryTask.css** | `src/content/grade4/tasks/library/LibraryTask.css` |

---

## Javítási terv – Részletes vázlatpontok

### 1. JAVÍTÁS: Kép betöltés race condition megszüntetése

**Fájl:** `LibraryTask.js` → `startRound()` metódus (246–292. sor)

**Jelenlegi hibás kód (270–288. sor):**

```js
// UI frissítése képletöltés védelemmel (Cache-biztos)
this.imageEl.style.transition = 'none';
this.imageEl.style.opacity = '0';
this.imageEl.style.transform = 'scale(0.95)';

// Kényszerített renderelés a DOM-ban a kezdőállapothoz
void this.imageEl.offsetWidth;

this.imageEl.onload = () => {
    this.imageEl.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    this.imageEl.style.opacity = '1';
    this.imageEl.style.transform = 'scale(1)';
};

// Ráhegesztjük a requestAnimationFrame-re, hogy gyors internet (Cache)
// esetén is érvényesüljön a 0 opacity fázis.
requestAnimationFrame(() => {
    this.imageEl.src = round.image;
});
```

**Mi a baj:**

1. Az `onload` handler a `src` beállítás ELŐTT van regisztrálva, de a `requestAnimationFrame` wrapper **nem garantálja**, hogy az `onload` handler él, mire a böngésző a cache-ből azonnal betölti a képet
2. Ha a kép cache-ből jön, az `onload` **nem biztos, hogy tüzel** – a böngésző a `src` beállítás pillanatában `complete = true` státuszt ad, és az `onload` handler már nem hívódik
3. Nincs `onerror` handler – ha a kép nem tölthető be, a feladat örökre elakad

**Javított kód:**

```js
// UI frissítése – kezdőállapot (rejtett, kicsinyített)
this.imageEl.style.transition = 'none';
this.imageEl.style.opacity = '0';
this.imageEl.style.transform = 'scale(0.95)';

// Kényszerített reflow a DOM-ban a kezdőállapothoz
void this.imageEl.offsetWidth;

// Közös reveal függvény – akár onload, akár cache, akár fallback hívja
const revealImage = () => {
    if (!this.element) return; // Komponens már megsemmisítve
    this.imageEl.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    this.imageEl.style.opacity = '1';
    this.imageEl.style.transform = 'scale(1)';
};

// 1. Onload handler regisztrálása SRC beállítás ELŐTT
this.imageEl.onload = revealImage;

// 2. Onerror handler – project-context.md: No Floating Promises + Robustness
this.imageEl.onerror = () => {
    this.logger.error('Image load failed', { src: round.image });
    revealImage(); // Akkor is megjeleníti (üres/broken kép), ne akadjon el a feladat
};

// 3. SRC beállítása
this.imageEl.src = round.image;

// 4. Cache-ellenőrzés – ha a böngésző azonnal betöltötte, onload nem tüzel
if (this.imageEl.complete && this.imageEl.naturalWidth > 0) {
    revealImage();
}

// 5. Biztonsági fallback időzítő – ha sem onload, sem complete nem tüzelt 3mp-en belül
const imgFallbackTimeout = setTimeout(() => {
    if (this.imageEl && this.imageEl.style.opacity === '0') {
        this.logger.warn('Image reveal fallback triggered', { src: round.image });
        revealImage();
    }
}, 3000);
this.timeouts.push(imgFallbackTimeout);
```

**A javítás lényege:**

- `onload` handler a `src` ELŐTT → sorrendi garancia
- `onerror` handler → project-context.md Error Handling szabály
- `complete` + `naturalWidth` ellenőrzés → cache-elt kép azonnali kezelése
- 3 másodperces fallback → project-context.md Robustness szabály
- `revealImage()` közös függvény → DRY, egyetlen felelős a megjelenítésért
- `requestAnimationFrame` wrapper eltávolítva → felesleges volt és okozta a race condition-t

---

### 2. JAVÍTÁS: CSS opacity ütközés megszüntetése

**Fájl:** `LibraryTask.css` → 149–160. sor

**Jelenlegi hibás kód:**

```css
.dkv-library__task-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;                    /* ← Alap: rejtett */
    transition: opacity 0.3s ease; /* ← CSS transition */
    cursor: zoom-in;
}

.dkv-library__main-viewport.visible .dkv-library__task-image {
    opacity: 1;                    /* ← CSS: viewport látható → kép is 1 */
}
```

**Mi a baj:**

A `.visible` osztály hozzáadásakor a CSS azonnal `opacity: 1`-et ad a képnek. Közben a JS `startRound()`-ban a kép inline `style.opacity = '0'`-t kap, majd az `onload`-ban `style.opacity = '1'`-et. Az inline stílus magasabb specificitású, tehát a CSS szabály semmit nem csinál – DE ha a JS `opacity` beállítás valamilyen okból kimarad (race condition), akkor a CSS szabály veszi át az irányítást és a kép villanásszerűen jelenik meg, nem animálódik.

**Ez a két rendszer (CSS + JS) egymással harcol az `opacity` felett.**

**Javított kód:**

```css
.dkv-library__task-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    /* transition eltávolítva – a JS kezeli az animációt inline */
    cursor: zoom-in;
}

/* TÖRÖLVE: Ez a szabály ütközött a JS inline opacity kezeléssel
.dkv-library__main-viewport.visible .dkv-library__task-image {
    opacity: 1;
}
*/
```

**A javítás lényege:**

- A `.visible .dkv-library__task-image { opacity: 1 }` CSS szabály **törlése**
- A kép `opacity`-jét kizárólag a **JS kezeli** (az 1. javítás `revealImage()` függvényén keresztül)
- A CSS `transition` eltávolítása a képről – a JS saját transition-t állít be (`all 0.5s cubic-bezier(...)`)
- Ezzel megszűnik a CSS ↔ JS opacity háború

---

### 3. JAVÍTÁS: Timeout tömb tisztítása körváltáskor

**Fájl:** `LibraryTask.js` → `startRound()` metódus eleje

**Jelenlegi helyzet:**

A `this.timeouts` tömb **soha nem tisztítódik** a körök között – csak a `destroy()`-ban. Így egy 6 körös játék alatt 6×3 = 18 felesleges timeout referencia halmozódik, és régi timeout-ok potenciálisan régi DOM elemeket próbálnak módosítani.

**Hozzáadandó kód a `startRound()` metódus elejéhez (az `if (this.currentIndex >= this.taskCount)` ellenőrzés UTÁN):**

```js
// Előző kör timeout-jainak tisztítása (memóriavédelem)
this.timeouts.forEach(t => clearTimeout(t));
this.timeouts = [];
```

---

### 4. JAVÍTÁS: BEM prefix hiányzó osztálynevek

**Fájl:** `LibraryTask.css` és `LibraryTask.js`

**Érintett osztályok** (project-context.md: `.dkv-` prefix kötelező):

| Jelenlegi | Javított |
|---|---|
| `.stage-dot` | `.dkv-library__stage-dot` |
| `.stage-text` | `.dkv-library__stage-text` |
| `.status-dot` | `.dkv-library__status-dot` |
| `.status-dot--green` | `.dkv-library__status-dot--green` |
| `.status-dot--magenta` | `.dkv-library__status-dot--magenta` |
| `.phase-label` | `.dkv-library__phase-label` |
| `.glass-panel` | `.dkv-library__glass-panel` |
| `.scanline` | `.dkv-library__scanline` |

> [!WARNING]
> Ez a javítás **opcionális** – nem okoz funkcionális hibát, csak konvenció-sértés. Ha az időnyomás nagy, ez kihagyható. De a `stage-dot` és `stage-text` osztályneveket a JS is használja (`querySelectorAll('.stage-dot')`), tehát a CSS-ben és a JS-ben is egyszerre kell átnevezni.

---

### 5. JAVÍTÁS: `onerror` handler regisztrálása a kép lightbox-ához

**Fájl:** `LibraryTask.js` → `showLightbox()` metódus (451–481. sor)

A lightbox kép betöltésekor sincs `onerror` handler. Ha a nagyított kép nem töltődik be, a felhasználó egy üres lightbox-ot lát bezárhatatlanul.

**Hozzáadandó:** `onerror` handler a lightbox képre, amely naplózza a hibát és bezárja az overlay-t.

---

## Javítások végrehajtási sorrendje

1. **1. JAVÍTÁS** (KRITIKUS) – `startRound()` kép betöltés újraírása → Ez oldja meg a bejelentett hibát
2. **2. JAVÍTÁS** (KRITIKUS) – CSS opacity ütközés törlése → Ez szükséges az 1. javítás helyes működéséhez
3. **3. JAVÍTÁS** (FONTOS) – Timeout tömb tisztítása → Memóriavédelem
4. **5. JAVÍTÁS** (FONTOS) – Lightbox onerror → Robustness
5. **4. JAVÍTÁS** (OPCIONÁLIS) – BEM átnevezés → Konvenció

---

## Ellenőrzési terv (Verification)

### Tesztelési forgatókönyv

1. **Normál betöltés:** Indítsd el az alkalmazást (`npm run dev`), navigálj a 3. állomásig, és ellenőrizd:
   - A kép és a kártyák **teljesen megjelennek** (opacity: 1, scale: 1)
   - A kép **kattintható** (lightbox megnyílik)
   - A kártyák **kattinthatók** (kiválasztás működik)
   - A „TOVÁBB" gomb aktiválódik kiválasztás után

2. **Cache teszt:** Az első sikeres betöltés után **frissítsd az oldalt** (F5), és navigálj újra a 3. állomásig. A cache-elt képek miatt az `onload` nem tüzelhet – ellenőrizd, hogy a `complete` ellenőrzés átveszi a vezérlést és a kép megjelenik.

3. **Hálózati hiba teszt:** A böngésző DevTools → Network → Offline módban próbáld meg betölteni a feladatot. Ellenőrizd:
   - Az `onerror` handler tüzel
   - A kép helye megjelenik (üres/broken, de nem fagy le)
   - A kártyák továbbra is kattinthatók

4. **Több kör teszt:** Játssz végig legalább 3 kört, és ellenőrizd:
   - Minden körben új kép töltődik be sikeresen
   - A timeout tömb nem halmozódik (konzolban ellenőrizhető: `console.log(this.timeouts.length)`)

5. **Konzol ellenőrzés:** Minden teszteset közben ellenőrizd, hogy:
   - Nincs hibaüzenet a konzolban
   - A GameLogger INFO üzenetek megjelennek: `'Starting first round, making viewport visible'`
   - Ha fallback tüzel, WARNING üzenet jelenik meg: `'Image reveal fallback triggered'`

---

## Megjegyzés az implementálónak

> [!IMPORTANT]
> - **NE módosíts** más fájlokat – a hiba kizárólag a `LibraryTask.js` és `LibraryTask.css` fájlokban van
> - A `LibraryData.js` (képútvonalak) **rendben van** – minden kép létezik a `public/assets/images/grade4/library/` mappában
> - A `GameInterfaceGrade4.js` `showTaskModal()` metódusa **rendben van** – a modal megnyitás és a konténer átadás helyesen működik
> - A `Typewriter.js` **rendben van** – az intro animáció és a skip funkció helyesen működik
> - A `config.js` task registry bejegyzése (`station_3: { type: 'library', ... }`) **rendben van**
