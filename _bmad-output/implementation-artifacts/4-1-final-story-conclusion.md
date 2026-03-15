# Story 4.1: Final Story Conclusion

Status: done

## Story

As a diák (8-12 év),
I want megismerni a Kód Királyság történetének végét és a Nagy Zár titkát,
so that sikeresen befejezhessem a küldetésemet és megmenthessem a királyságot.

## Acceptance Criteria

1. **Narratív folytonosság**: A 25-28. diák (Grade 3 Finale) szövegeinek és videóinak hibátlanul kell megjelenniük a `src/content/grade3/config.js` alapján.
2. **Chronosz karaktere**: Megjelenik Chronosz, az idő és tudás őrzője (Slide 25).
3. **Kihívás kontextus**: A 26-os diának elő kell készítenie a Nagy Zár végső feladatát (amely a 4.2-es story lesz).
4. **Felbontás**: A 27-es diának be kell mutatnia az Árnyprogram legyőzését és a királyság helyreállítását.
5. **Gratuláció**: A 28-as diának egyértelmű sikerélményt kell nyújtania a végén.
6. **Technikai megfelelőség**: Minden slide-hoz tartoznia kell videónak (`.mp4`) és narrációnak (`.mp3`), a `video-config.json` késleltetéseit figyelembe véve.

## Tasks / Subtasks

- [x] Finale slide-ok (25-28) ellenőrzése a `grade3/config.js` fájlban (AC: #1)
- [x] Szövegek (narration) pontosságának ellenőrzése a PRD/UX alapján (AC: #1, #2, #3, #4)
- [x] Videó hivatkozások validálása (`assets/video/grade3/slide_25.mp4` stb.) (AC: #6)
- [x] Audió szinkronizáció beállítása (AC: #6)
- [x] Videólejátszás és tranzíciók finomhangolása a Fináléhoz (AC: #6)

## Dev Notes

- **Architektúra**: SEL (State-Eventbus-Logger) alapú navigáció.
- **Fájlok**: 
  - `src/content/grade3/config.js`: Itt vannak definiálva a slide-ok.
  - `src/content/grade3/video-config.json`: Ide kell felvenni a 25-28-as diák késleltetéseit (videoDelay).
- **Konstansok**: `SLIDE_TYPES.STORY` használandó ezekhez a diákhoz.
- **Fontos**: A 26. és 27. dia közé kerül majd be a `4.2 Finale Interaction` feladat, ezt szem előtt kell tartani a navigációnál!

### Project Structure Notes

- A meglévő `StorySlide` komponenst használjuk.
- A videók elérhetőségét ellenőrizni kell (ha hiányzik, a placeholder rendszernek működnie kell).

### References

- [Source: docs/prd-digitális-kultúra-verseny.md#4.3.1]
- [Source: docs/ux-user-flows-interaction-patterns.md#FLOW 4]

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Pro

### File List

- `src/content/grade3/config.js`
- `src/content/grade3/video-config.json`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
