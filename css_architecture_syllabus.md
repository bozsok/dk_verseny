# DKV CSS Architektúra - Elemzés és Theming Szilábusz

Ez a dokumentum a "Single Source of Truth" (Igazság Alapja) a projekt Theming (témázó) rendszerének kialakításához. Célja, hogy bármely fejlesztő (vagy LLM asszisztens) lépésről lépésre, vizuális törés nélkül tudja elvégezni a `design-system.css` megtisztítását és moduláris átépítését.

## 1. Jelenlegi Helyzetkép (Kapcsolatok és Konfliktusok)

A rendszer három fő rétegből áll, amik jelenleg túlzottan összefonódnak:

1. **`design-system.css` (Központ)**: Eredetileg a "csontváz" (Flexbox, Grid, Modal z-index) lenne, de magában hordozza a 3. évfolyam esztétikájának egy részét (pl. `.dkv-func-btn` `border-radius: 50%`, neon kék színek, sötét #333 hátterek).
2. **`grade3/styles/main.css`**: A Sci-Fi (Kód Királyság) téma. Folyamatosan ".dkv-grade-3" szelektorokkal "visszaírja" a design-system elemeit a nekifüggő, szögletesebb formákra (`border-radius: 10px`, `background: #00636e`, `font-family: Source Code Pro`).
3. **`grade4/styles/main.css`**: A Várkastély (Lovag) téma. Brutális mennyiségű felülírást végez (`.dkv-grade-4 .dkv-button`), hogy a neon kék/türkiz alapokat mélyvörösre (`#5c1818`), aranyra (`#ffd700`) és talpas betűtípusokra (`Georgia`) cserélje.

**A Gyökérprobléma:** A struktúra (csontváz) és a design (hús) egybe van gyúrva a fájlokban, így minden új évfolyam egy specifikussági háborút (Specificity War) vív az alap-CSS-szel.

---

## 2. Az Új Theming Architektúra (Cél)

A refaktorálás végén az alábbi logikai szétválasztásnak kell érvényesülnie:

- **`design-system.css`**: **A CSONTVÁZ.** Nincs benne egyetlen hardkódolt szín, keretstílus, háttérszín vagy betűtípus sem a játéktéren! Kizárólag elrendezés (Flex/Grid, pozíciók), animációs mechanika és z-indexek. Minden vizuális elem CSS változóra (`var(--th-...)`) hivatkozik.
- **`themes.css` (Új)**: **A BŐR.** Ez tartalmazza a témákat leíró változó-kötegeket.
  - `.dkv-theme-hub`: A főmenü színei.
  - `.dkv-theme-grade3`: A 3. évfolyam paraméterei (`--th-btn-bg: #00636e; --th-btn-radius: 10px; --th-font-main: 'Source Code Pro';`).
  - `.dkv-theme-grade4`: A 4. évfolyam paraméterei (`--th-btn-bg: #5c1818; --th-btn-radius: 4px; --th-font-main: 'Georgia';`).
- **`gradeX/styles/main.css`**: **A LOKÁLIS IZMOK.** Csak és kizárólag az évfolyamspecifikus animációkat, egyedi slide-ok (pl. Lovagi pajzs csúszka) és minijátékok belső kódjait tartalmazza, amik nem részei a globális UI-nak. Felülíró osztályok nincsenek többé.

---

## 3. Szilábusz: Refaktorálási Lépések (Vizuális Törés Nélkül!)

A feladatot apró, izolált DOM komponensekre bontva kell elvégezni. Kövesd az alábbi lépéseket!

### FÁZIS 1: Változó Regiszter Kialakítása (themes.css bevezetése)
1. Hozd létre a Változó-leírókat (pl. `design-system.css` elején vagy külön `themes.css` fájlban).
2. Vedd fel a kötelező palettát a `.dkv-theme-grade3` alá a `grade3/styles/main.css` alapján:
   - `--th-font-display`: 'Impact', sans-serif;
   - `--th-font-main`: 'Source Code Pro', monospace;
   - `--th-panel-bg`: rgba(255, 255, 255, 0.1);
   - `--th-panel-border`: 2px solid #00d2d3;
   - `--th-panel-radius`: 10px;
   - `--th-btn-bg`: #00636e;
   - `--th-btn-bg-hover`: #007582;
   - `--th-btn-border`: 2px solid #00eaff;
   - `--th-btn-radius`: 10px;
   - `--th-btn-color`: #ffffff;
   - `--th-accent-color`: #00eaff;
   - `--th-shadow-glow`: 0 0 15px rgba(0, 234, 255, 0.3);
3. Hivatkozd be a `main.js`-ben (vagy ahol a Grade 3 init történik), hogy a teljes body vagy `.dkv-app-container` kapja meg a `.dkv-theme-grade3` CSS osztályt, amikor ez a kvíz/osztály megy!

### FÁZIS 2: A Gombok (Button System) Témázása
1. Keresd meg a `design-system.css`-ben a `.dkv-button`, `.dkv-func-btn`, `.dkv-nav-arrow` szabályokat.
2. Cseréld ki a színeket, border-radiust a megfelelő `var(--th-...)` értékre. Adj meg fallback-et a biztonság kedvéért: `background: var(--th-btn-bg, #333);`
3. Menj a `grade3/styles/main.css`-be, és TÖRÖLD ki az összes `.dkv-grade-3-button`, `.dkv-grade-3 .dkv-button` szabályblokkot! Mivel a változókat a szülő (pl. body) adja át, az alap-gomb a változókon át **automatikusan** felveszi a Grade 3-as kinézetet! 
4. Teszteld (Start játék). A gomboknak hajszálpontosan sci-fi kéknek és 10px kerekítettnek kell lenniük. Semmi nem törhet el.

### FÁZIS 3: A Játék Ablakok és Layout Panelek Témázása
1. Az eljárás megegyezik a gombokéval. Menj a `design-system.css`-be a Súgó Modal, Eredmény Modal, Napló Panel szabályokhoz.
2. A `background`, `border`, `border-radius`, `box-shadow` hivatkozásokat cseréld a `--th-panel-...` változókra.
3. Biztosítsd, hogy a tipográfia (font-family) a konténerből öröklődjön (`inherit` vagy `var(--th-font-main)` használata).
4. Menj a `grade3/styles/main.css`-be, és töröld az összes `.dkv-grade-3 .dkv-modal-content`, `.dkv-journal-panel` stb. felülírást.
5. Teszteld a játékban.

### FÁZIS 4: Tipográfia (Headings és Szövegek)
1. A Címsorokat (H1, H2, H3) kösd be a `--th-font-display` és `--th-accent-color` értékekre a design szerkezetben.
2. Tisztítsd ki a grade-specifikus stíluslapokból a h1/h2 felülírásokat.

### FÁZIS 5: Jövőbeli Kiterjesztés (Tervezet)
Miután a Grade 3 tökéletesen fut a struktúrán...
*(Megjegyzés: Jelenleg a 4. osztályos fájlok kísérletiek, így azokat még nem vonjuk be a refaktorálásba. Ezen fázis csak a jövőre vonatkozó előkészület.)*
1. Később írható egy `.dkv-theme-grade4` paletta ugyanazokra a változókra.
2. A JS-ben beköthető a váltás.

---

## Fontos Szabályok:
- **Fallback (Biztonsági Háló)**: A `var()` hívásoknál MINDIG hagyj alapértéket! Pl: `border-radius: var(--th-btn-radius, 8px);`. Így, ha egy theme betöltése elmarad, a gomb akkor sem esik szét, csak felveszi default alakját.
- **Micro-lépések**: Ahogy a szilábusz mutatja, ne nyúlj bele mindenbe egyszerre! Csináld meg a Gombokat -> validáld. Csináld meg a Paneleket -> validáld. Így azonnal szűkíted a debugolás körét, ha valami elcsúszik.

---

## 4. Kockázatelemzés és Gyenge Pontok (Devil's Advocate)

A tiszta Theming (CSS változó) architektúrának is vannak korlátai. A projekt jelenlegi kódjának mélyebb elemzése során az alábbi *támadási felületeket* és problémákat azonosítottuk a javasolt architektúrában, amelyekre azonnal megoldást (ellenlépést) is definiálunk:

### 1. Kockázat: SVG Ikonok és Háttérképek Színezése
**A Probléma:** A 4. évfolyam esetenként `background-image: url("data:image/svg+xml,...fill='%23ffd700'...")` formátumban használ SVG ikonokat a gombokon. A CSS Változók (`var(...)`) **nem használhatók** beágyazott `url()` adat-URI-kon belül! Így egy ikon színének dinamikus változtatása lehetetlen csupán a változó felülírásával.
**A Megoldás (Ellenlépés):** Át kell térni a `mask-image` technológiára. A `design-system.css`-ben az ikont maszkként használjuk, a színét pedig `background-color: var(--th-icon-color);` adja meg. Így egyetlen változóval színezhető az ikon!

### 2. Kockázat: Radikális Strukturális Eltérések (Formák korlátai)
**A Probléma:** A Témázás (változók) tökéletes a színek, keretek és árnyékok cseréjére. De mi van, ha az 5. évfolyam (Viking) gombja nem egy szimpla doboz, hanem egy letépett papírdarab forma, amihez kötelező `::before` és `::after` pszeudo-elemeket építeni egyedi méretekkel? A `design-system.css` nem készülhet fel minden jövőbeli, extrém formára.
**A Megoldás (Ellenlépés):** El kell fogadni, hogy a Theming nem mindenható. Extrém vizuális eltéréseknél (pl. extra textúrák, aszimmetrikus rátétek) a `gradeX/styles/main.css`-ben **igenis szabad és kötelező** új, kiegészítő (additív) CSS szabályokat írni. A szabály: *Ha csak a szín/keret változik, használd a Theming változót. Ha a DOM elem fizikájába/geometriájába kell nyúlni drasztikusan, azt tartsd meg a lokális CSS-ben!*

### 3. Kockázat: A Téma Kontextus Elvesztése (Modal és Tooltip)
**A Probléma:** Ha az új `.dkv-theme-grade3` osztályt a `main.js`-ben egy belső `<div class="dkv-slide-container">` kapja meg, akkor a játékterület szépen beleszíneződik a témába. Viszont az újonnan fejlesztett Tooltip panel vagy az Eredmény Modal (amiket JS-ből a `document.body`-ba fűzünk be a Z-index problémák elkerülésére!) **ki fognak esni a téma hatóköréből**, mivel a szülőjük a natív `<body>` lesz, nem a téma-div!
**A Megoldás (Ellenlépés):** Szigorú architektúrális szabály: A felület betöltésekor a JS a `document.body` elemen (vagy a lepleggökeresebb `#app` konténeren) kell cserélgesse a téma-osztályokat, így minden befűzött utólagos DOM elem (modals, tooltips) globálisan megörökli a változókat.

### 4. Kockázat: Keyframe Animációk Inflexibilitása
**A Probléma:** A Sci-Fi (3. évf) `floatUp` animációja csak skálázza a pontokat felvillanáskor, míg a lovagi (4. évf) lassan úsztatja őket felfelé. A `@keyframes` szabályokon belül a CSS változók használata részben korlátozott és nehezen olvasható.
**A Megoldás (Ellenlépés):** Az alapvető tranzíciók (gombra vivés ideje) mehetnek globális változóval (`--th-transition-speed`), de a teljes `@keyframes` blokkok leírását a lokális `gradeX/styles/main.css` fájlokban HAGYJUK MEG. Ne próbáljunk meg komplex animációkat változósítani, mert karbantarthatatlanná válnak.
