# Forráskód Struktúra Elemzése

Ez a dokumentum bemutatja a projekt könyvtárszerkezetét és az egyes mappák felelősségi köreit.

## 📂 Könyvtárfa (Annotált)

```text
dk_verseny/
├── _bmad/              # BMAD modulkészlet és konfigurációk
├── docs/               # Technikai és üzleti dokumentációk (PRD, UX, Sprint)
├── public/             # Statikus fájlok (videók, hangok, képek)
├── src/                # Alkalmazás forráskódja
│   ├── content/        # Osztály-specifikus tartalomdefiníciók (3-6. osztály)
│   ├── core/           # Alaprendszer (Infrastruktúra)
│   │   ├── api/        # Kommunikációs réteg
│   │   ├── engine/     # Játék motorok (Typewriter, SEL)
│   │   ├── state/      # Globális állapotkezelés (Pinia)
│   │   └── logging/    # Esemény- és hiba naplózás
│   ├── features/       # Játék modulok és funkciók
│   │   ├── puzzles/    # Versenyfeladatok (Maze, Quiz, Sound, Finale)
│   │   └── video/      # Videókezelés és szinkronizáció
│   ├── ui/             # Felhasználói felület
│   │   ├── components/ # Újrafelhasználható Vue komponensek
│   │   └── styles/     # Globális és komponens stílusok (CSS)
│   └── main.js         # Alkalmazás belépési pont
├── Source/             # Nyers dizájn assetek és tervdokumentumok
├── package.json        # Függőségek és scriptek
└── vite.config.js      # Build konfiguráció
```

## 🎯 Kritikus Útvonalak

- **Fő belépési pont:** `src/main.js` - Itt inicializálódik a Vue app és a SEL mag.
- **Tartalom bővítése:** `src/content/` - Új évfolyamok vagy feladatok itt adhatók hozzá.
- **Logika módosítása:** `src/features/puzzles/` - A feladatok (pl. Finale) belső logikája itt található.
- **Stílus frissítése:** `src/ui/styles/` és egyedi komponens CSS-ek.

## 🔗 Integrációs Pontok

- **SEL Bus:** A `core/events` biztosítja a modulok közötti aszinkron kommunikációt.
- **Pinia Stores:** A `core/state` mappában található tárolók (pl. `gameStore`, `userStore`) kötik össze a funkciókat.
