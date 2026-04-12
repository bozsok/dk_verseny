# Knowledge Item: Modern Slide Transitions (View Transitions API)
**Tags:** #frontend #animation #ux #performance #view-transitions #javascript #css
**Language:** Magyar / English

## 📝 Összefoglaló / Summary
A **View Transitions API** egy modern böngésző-szabvány, amely lehetővé teszi két különböző DOM állapot (pl. diák közötti váltás) közötti vizuális áttűnést anélkül, hogy bonyolult animációs könyvtárakat vagy manuális CSS `opacity` trükköket kellene használnunk. A módszer kulcsa, hogy a böngésző snapshot-ot (képernyőképet) készít a váltás elött és után, majd ezeket mossa össze szoftveresen.

## 🚀 Megoldott probléma / Problem Solved
*   **Sequential Flicker**: Megszünteti a diaváltásoknál tapasztalt villogást, amit a régi "elhalványít -> töröl -> betölt -> megjelenít" szekvencia okozott.
*   **Zero Logic Lag**: Az animáció GPU gyorsított, így a nehéz slide-ok renderelése közben sem akad meg a kép.
*   **Simultaneous Cross-fade**: Lehetővé teszi, hogy az új tartalom már akkor látszódjon, amikor a régi még halványodik.

## 🛠️ Implementáció / Implementation

### 1. CSS Réteg (Transitions.css)
A tartalom-tárolónak és az állandó elemeknek egyedi azonosítót kell adni.

```css
/* A váltakozó tartalom azonosítója */
#slide-container {
  view-transition-name: slide-content;
}

/* Az állandó (flicker-free) elemek izolálása */
.game-hud {
  view-transition-name: persistent-hud;
}

/* Egyéni animáció definiálása (opcionális, az alapértelmezett a cross-fade) */
::view-transition-old(slide-content),
::view-transition-new(slide-content) {
  animation: 0.6s ease-in-out both dkv-fade;
}
```

### 2. JavaScript Réteg (main.js)
A váltást egy callback függvénybe kell csomagolni.

```javascript
async function changeSlide(newContent) {
  // Ellenőrzés: támogatja-e a böngésző az API-t?
  if (!document.startViewTransition) {
    performDomUpdate(); // Fallback: azonnali váltás
    return;
  }

  const transition = document.startViewTransition(() => {
    performDomUpdate(); // Itt végezzük el a DOM ürítést és az új elem hozzáadását
  });

  // Biztonsági hibakezelés (InvalidStateError elkerülése)
  try {
    await transition.finished;
  } catch (e) {
    console.warn("View Transition interrupted", e);
  }
}
```

## ⚠️ Kritikus szabályok / Best Practices
1.  **Identitás Ütközés (Uniqueness)**: **SZIGORÚAN TILOS** ugyanazt a `view-transition-name`-t adni egynél több elemnek a DOM-ban! Ha a Grade 3 és Grade 4 elemei egyszerre is ott lehetnek, adj nekik különböző neveket (pl. `hud-g3`, `hud-g4`).
2.  **Perzisztencia**: Minden olyan elemnek, amelynek NEM szabad villannia a váltás alatt (footer, gombok, profilkép), saját `view-transition-name`-t kell kapnia.
3.  **Hibakezelés**: Mindig használj `.catch()`-et vagy `try-catch`-et a JS hívásnál, mert ha a felhasználó túl gyorsan kattint, a böngésző megszakíthatja a tranzíciót.

## 🏁 Eredmény / UX Result
Ezzel a módszerrel a webalkalmazás "Native App" érzetet kelt: nincsenek darabos váltások, a felhasználó szemét nem zavarják a villogó elemek, és a navigáció professzionális szintűvé válik.
