# Sprint 2: Verseny Logika és Rendszer Alapok

**Időtartam:** 2 hét
**Cél:** A verseny-specifikus funkcionalitás (időmérés, hitelesített pontszámítás, biztonságos mentés) implementálása és a backend kommunikáció szimulációja.

## 🎯 Sprint Célok
1. **Időmérés**: Precíz `TimeManager` implementálása a bruttó és feladat-specifikus idő mérésére.
2. **Biztonságos Adatkezelés**: `LocalStorage` átalakítása titkosított "biztonsági mentéssé" és a szerver kommunikáció előkészítése.
3. **Verseny Folyamat**: A "Videó -> Feladat -> Beküldés" szigorú sorrendjének kikényszerítése.
4. **Mock Backend**: API réteg szimulálása a pontszámok azonnali "beküldéséhez".

---

## 📝 User Stories

### Story 1: Precíz Időmérés (TimeManager)
**Mint** versenyszervező,
**Szeretném**, ha a rendszer pontosan mérné a versenyzők idejét,
**Azért, hogy** pontegyenlőség esetén a gyorsaság dönthessen.

#### Elfogadási Kritériumok (Acceptance Criteria)
- [x] Létrejön a `src/core/time/TimeManager.js` modul.
- [x] A rendszer mér egy globális "Verseny Időt" (~~visszaszámláló vagy~~ stopper - *User request: csak stopper*).
- [x] ~~A rendszer külön méri az "Aktív Feladatmegoldási Időt" (csak amikor a feladat látható).~~ (*User request: global timer only*)
- [x] ~~A videók megtekintése alatt az "Aktív Feladat Idő" áll (vagy külön mérjük).~~
- [x] Az időmérés ~~szüneteltethető (pl. rendszerüzenet alatt) és~~ pontos (performance.now() használata).
- [x] Az időállapot mentésre kerül a `LocalStorage`-ba (crash recovery esetére).

---

### Story 2: Biztonsági Mentés és Adatvédelem
**Mint** fejlesztő,
**Szeretném**, ha a helyi adatok védve lennének a manipuláció ellen,
**Azért, hogy** a versenyzők ne tudják egyszerűen átírni a helyi pontszámaikat.

#### Elfogadási Kritériumok (Acceptance Criteria)
- [x] A `GameStateManager` átalakítása: az állapot 'privát' tárolása.
- [x] A `LocalStorage` csak titkosított (vagy kódolt - pl. Base64 + Salt) formában tárol adatot.
- [x] Az oldal újratöltésekor a rendszer képes visszaállítani az állapotot a kódolt mentésből.
- [x] Sérült/manipulált mentés esetén a rendszer hibaüzenetet ad és új munkamenetet ajánl fel.

---

### Story 3: Mock Backend API és Beküldés
**Mint** rendszertervező,
**Szeretném**, ha a pontszámok azonnal "beküldésre" kerülnének egy szerver felé,
**Azért, hogy** a kliens gépen ne tároljunk végleges versenyeredményt (csalásvédelem).

#### Elfogadási Kritériumok (Acceptance Criteria)
- [x] Létrejön a `src/core/api/MockApiService.js` modul.
- [x] Implementálva van a `submitScore(taskId, score, timeSpent)` metódus (egyelőre konzol log + siker szimuláció).
- [x] Implementálva van a `initSession(studentId)` metódus.
- [x] Sikeres beküldés esetén a helyi "ideiglenes" pontszám törlődik/archiválódik.
- [x] Hálózati hiba szimulációja esetén a rendszer "retry" (újrapróbálkozás) mechanizmust alkalmaz.

---

### Story 4: Lineáris Történet Motor (Story Engine & Slide System)
**Mint** játéktervező,
**Szeretném**, ha a verseny egy lineáris, 30 diából álló sorozat lenne (Bevezetés -> Állomások -> Végjáték -> Levezetés),
**Azért, hogy** a történetmesélés és a feladatok szorosan összekapcsolódjanak.

#### Elfogadási Kritériumok (Acceptance Criteria)
- [x] Létrejön a `src/core/engine/SlideManager.js`, ami vezérli a léptetést (State: `currentSlideIndex`).
- [x] Létrejön a konfigurációs fájl (`src/core/engine/slides-config.js`), ami definiálja a 30 diát.
- [x] Támogatott dia típusok implementálása:
    - **VideoSlide:** Videó lejátszása (SKIP tilos), "Tovább" gomb csak a végén.
    - **TaskSlide:** Feladat megjelenítése, időmérés, beküldés után automatikus tovább.
    - **RewardSlide:** Jutalmazó videó/animáció.
- [x] A rendszer a `TimeManager`-t használja a versenyidő mérésére a teljes folyamat alatt.
- [x] Állapotmentés: minden sikeres tovább lépésnél mentjük a `currentSlideIndex`-et (crash recovery).

---

## 🛠️ Technikai Feladatok (Tasks)

### 1. TimeManager Implementáció
- [x] `TimeManager` osztály létrehozása Singleton mintával.
- [x] Integrálás a `GameStateManager`-be (és a `main.js`-be).
- [x] UI komponens készítése az idő megjelenítésére (`TimerDisplay`).

### 2. Adatbiztonság
- [x] `StorageManager` / `SecureStorage` bővítése egyszerű titkosítással (CryptoJS vagy saját XOR/Base64 megoldás).
- [x] Integritás-ellenőrzés (hash/checksum) hozzáadása a mentett adatokhoz (Base64 szerkezet által).

### 3. API Réteg
- [x] `MockApiService` létrehozása aszinkron (Promise-based) metódusokkal.
- [x] Hibakezelés és válaszkódok (200, 400, 500 szimuláció).

### 4. Story Engine & Slides
- [x] `src/core/engine` mappa és struktúra létrehozása.
- [x] `slides-config.js` séma kidolgozása (Intro, Stations, Outro).
- [x] `SlideManager` osztály implementálása.
- [x] `VideoSlide` komponens (a korábbi VideoPlayer felhasználásával).
- [x] `TaskSlide` keretrendszer (placeholder a feladatokhoz).

---

## ✅ Definition of Done (DoD)
- A TimeManager pontosan mér és visszaállítható hiba esetén.
- A LocalStorage adatok nem olvashatók sima szövegként.
- A "Mock API" aszinkron módon fogadja az adatokat.
- A videó -> feladat -> beküldés folyamat megszakítás nélkül működik.
- Unit tesztek (Jest) fedik a kritikus logikát (időmérés, pontszámítás).
- A kód megfelel a projekt stíluskiegészítőinek (ESLint/Prettier).
