# Story 4.2: Finale Interaction

Status: done

## Story

As a diák (8-12 év),
I- **Interakció:** Drag-and-drop felület 5 kulccsal és egy szöveges beviteli mezővel a "varázsszóhoz".
- **Megoldás:** 
    - **Szó:** "5kulcskell" (A kulcsokon lévő betűpárok összeolvasva).
    - **Sorrend:** A-B-C-D-E (eredeti sorrend).
- **Trigger:** A 26. dia narrációjának befejeződése után automatikusan megnyílik a feladat modal.
- **Pontozás:** 
    - Helyes szó: 5 pont.
    - Helyes sorrend: 5 pont.
    - Összesen: 10 pont.

## Acceptance Criteria

1. **Interaktív felület**: Egy speciális "Zár" interfész megjelenítése, ahol 5 kulcshely található.
2. **Kulcs vizualizáció**: A korábban megszerzett 5 kulcs (Maze, Puzzle, Quiz, Memory, Sound) ikonjainak megjelenítése.
3. **Mechanika**: A diákoknak a megfelelő helyre kell húzniuk vagy kattintással belehelyezniük a kulcsokat.
4. **Validáció**: Csak akkor tekinthető sikeresnek, ha mind az 5 kulcs a helyén van.
5. **Visszajelzés**: Audiovizuális visszacsatolás minden jól behelyezett kulcsnál.
6. **Siker áramlás**: A feladat sikeres megoldása után automatikus továbbítás a 27-es (Siker) diára.

## Tasks / Subtasks

- [x] `FinaleGame` komponens létrehozása a `src/content/grade3/tasks/finale/` mappában. (AC: #1)
- [x] Az 5 kulcs logikai implementálása az inventory (`StateManager`) alapján. (AC: #2)
- [x] Drag-and-drop mechanika implementálása a kulcsok sorrendbe rakásához. (AC: #3)
- [x] Szöveges beviteli mező a varázsszóhoz (`5kulcskell`). (AC: #4)
- [x] Validáció és részleges pontozás (sorrend 5p + varázsszó 5p). (AC: #4, #5)
- [x] `main.js` integrációja (feladat indítása, összegző modal, dia váltás). (AC: #6)
- [x] `config.js` frissítése a finale slide-ok adataival (final_1–final_4). (AC: #1)
- [x] Inventory kulcs lightbox bekötése a Finale feladatba. (AC: #2)
- [x] Visszanavigáció javítása (`finale-active` CSS osztályok cleanup). (AC: #6)
- [x] Ellenőrzés és tesztelés.

## Dev Notes

- **Helyszín**: `src/content/grade3/tasks/finale/FinaleGame.js` és `FinaleGame.css`.
- **Integráció**: A slide 26 után kell beszúrni egy új slide-ot a `config.js`-be, amelynek típusa `SLIDE_TYPES.TASK` és a tartalmát ez a komponens adja.
- **State**: Ellenőrizni kell, hogy az `Epic 3` alatt megszerezték-e a diákok a `keysCollected` flag-eket.

### Project Structure Notes

- Követni kell a többi task (`maze`, `puzzle`) mintáját.
- A `destroy()` metódus implementálása kötelező a cleanup miatt.

### References

- [Source: src/content/grade3/config.js#L217]
- [Source: docs/ux-user-flows-interaction-patterns.md#Rejtvény Interakciók]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Pro

### File List

- `src/content/grade3/tasks/finale/FinaleGame.js`
- `src/content/grade3/tasks/finale/FinaleGame.css`
- `src/content/grade3/config.js`
