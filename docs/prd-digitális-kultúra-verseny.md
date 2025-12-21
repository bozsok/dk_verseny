# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## DIGITÁLIS KULTÚRA VERSENY
### Video-alapú Interaktív Logikai Rejtvény Játék Általános Iskolásoknak

---

## 1. EXECUTIVE SUMMARY

### 1.1 Termék Áttekintés
A **Digitális Kultúra Verseny** egy webes alapú, video-történetmesélésen alapuló interaktív oktatási játék, amelyet kifejezetten 3-6. osztályos diákok (8-12 év) számára terveztünk. A platform a "Kód Királyság" fantáziauniverzumban játszódik, és video-narratívával kombinált interaktív rejtvényeken keresztül tanít logikai gondolkodást és programozási alapfogalmakat.

### 1.2 Üzleti Cél
- **Elsődleges cél**: A magyar oktatási piacra egyedülálló, video-alapú programozási oktató játék bevezetése
- **Piaci cél**: 50+ iskola elérése az első évben, 500+ aktív diák
- **Oktatási cél**: A digitális kompetenciák fejlesztése játékos formában

### 1.3 Kulcs Értékajánlat
**"Az első magyar nyelvű, video-narratívával támogatott programozási oktató játék, amely a kaland és rejtvények segítségével teszi érdekessé a kódolás tanulását."**

---

## 2. ÜZLETI CÉLOK ÉS KPI-K

### 2.1 Stratégiai Célok
1. **Piacvezető pozíció**: Első video-alapú oktatási játék a magyar piacon
2. **Oktatási hatás**: 80%+ rejtvény megoldási arány elérése
3. **Skálázhatóság**: 4 évfolyam (3-6. osztály) teljes lefedése
4. **Fenntarthatóság**: Havi 50-90k Ft működési költség mellett

### 2.2 Kulcs Teljesítménymutatók (KPI-k)

#### 2.2.1 Használati Metrikák
| Metrika | Célérték | Mérési periódus |
|---------|----------|-----------------|
| Napi Aktív Felhasználók (DAU) | 100+ | Naponta |
| Átlagos Session Idő | >15 perc | Hetente |
| Teljesítési Arány | >80% | Havonta |
| Visszatérő Felhasználók | >60% | Havonta |

#### 2.2.2 Oktatási Metrikák
| Metrika | Célérték | Mérési periódus |
|---------|----------|-----------------|
| Rejtvény Megoldási Arány | >70% | Havonta |
| Tanár Elégedettség | >4.5/5 | Negyedévente |
| Diák Elköteleződés | >85% | Havonta |
| Történet Befejezési Arány | >60% | Havonta |

#### 2.2.3 Technikai Metrikák
| Metrika | Célérték | Mérési periódus |
|---------|----------|-----------------|
| Lap Betöltési Idő | <3 másodperc | Naponta |
| Video Streaming Hibaarány | <2% | Naponta |
| Cross-browser Kompatibilitás | 95%+ | Hetente |
| Uptime | >99.5% | Havonta |

---

## 3. CÉLKÖZÖNSÉG ÉS PIACI ELEMZÉS

### 3.1 Elsődleges Célközönség

#### 3.1.1 Diákok (8-12 év)
- **Demográfia**: 3-6. osztályos általános iskolások
- **Digitális kompetencia**: Alapszintű böngészőhasználat
- **Motívációk**: Játék, kaland, verseny
- **Kihívások**: Rövid figyelmi idő, vizuális tanulás preferenciája

#### 3.1.2 Tanárok (25-55 év)
- **Szerep**: Digitális kultúra és informatika oktatók
- **Igények**: Egyszerű használat, tanulási eredmények nyomon követése
- **Kihívások**: Technológiai adaptáció, időkorlátok

#### 3.1.3 Iskolák
- **Döntéshozók**: Igazgatók, IT vezetők
- **Követelmények**: GDPR compliance, költséghatékonyság
- **Infrastruktúra**: Internet kapcsolat, eszközök

### 3.2 Másodlagos Célközönség
- **Szülők**: Gyermekeik digitális kompetenciájának fejlesztése
- **Képzési központok**: Programozás oktatást nyújtó szervezetek
- **Oktatási intézmények**: Modern pedagógiai eszközöket kereső iskolák

### 3.3 Piaci Pozíció
- **Közvetlen versenytársak**: Khan Academy (angol), Scratch (angol), Code.org (angol)
- **Közvetett versenytársak**: Hagyományos oktatási szoftverek, tankönyvek
- **Különbségtevő tényezők**: Video-narratíva, magyar nyelv, korosztály-specifikus tartalom

---

## 4. FUNKCIONÁLIS KÖVETELMÉNYEK

### 4.1 Diák Funkciók

#### 4.1.1 Regisztráció és Profilkezelés
- **FUNC-001**: Diák regisztráció név, becenév, osztály megadásával
- **FUNC-002**: Karakterválasztás 10 különböző avatar közül
- **FUNC-003**: Profil adatok mentése és visszatöltése
- **FUNC-004**: Becenév alapján azonosítás (név valódi nevek védelme)

#### 4.1.2 Hub Navigáció
- **FUNC-005**: 4 évfolyam (3-6. osztály) közötti választás
- **FUNC-006**: Haladás állapotának megjelenítése minden évfolyamnál
- **FUNC-007**: Kétszintű menürendszer (Hub → Évfolyam → Állomás)

#### 4.1.3 Video-alapú Történetmesélés
- **FUNC-008**: MP4 videók lejátszása HTML5 video player-rel
- **FUNC-009**: Külön hangcsatorna szinkronizálása
- **FUNC-010**: Videó vezérlők (play, pause, stop, hangerő)
- **FUNC-011**: Videó befejezése után automatikus "Tovább" gomb aktiválás
- **FUNC-012**: Progress bar megjelenítése (3/10 állomás stb.)

#### 4.1.4 Interaktív Rejtvények
- **FUNC-013**: 8+ különböző rejtvény típus támogatása
  - Szöveges kérdések (több válasz opció)
  - Vizuális puzzle (képek, színek, formák)
  - Kódolási feladatok (bináris, algoritmusok)
  - Memóriajátékok (szekvencia felidézés)
  - Hangalapú rejtvények (hangfelismerés)
  - Logikai puzzle (következtetés, rendszerlogika)
  - Kreatív feladatok (innovatív megoldások)
  - Kritikai gondolkodás (problémamegoldás)

#### 4.1.5 Játékmenet
- **FUNC-014**: Pontszámítás rendszer (25-80 pont rejtvény típusonként)
- **FUNC-015**: Bónusz pontok (gyors teljesítés +50, kreatív megoldás +25)
- **FUNC-016**: Végső bónusz (teljes történet +500 pont)
- **FUNC-017**: Lineáris haladás (mindig előre, helyes válasz nem kötelező)
- **FUNC-018**: Automatikus mentés minden állomás végén

#### 4.1.6 Haladás és Statisztikák
- **FUNC-019**: Személyes eredménylista megtekintése
- **FUNC-020**: Teljesítmény statisztikák (pontok, idő, rejtvények)
- **FUNC-021**: Kulcsok/tárgyak összegyűjtési állapota
- **FUNC-022**: Helyi ranglista (osztályon belüli összehasonlítás)

### 4.2 Tanár/Admin Funkciók

#### 4.2.1 Dashboard
- **FUNC-023**: Részletes eredménylista diákokról
- **FUNC-024**: Szűrési lehetőségek (osztály, időtartomány, teljesítmény)
- **FUNC-025**: Aggregált statisztikák megjelenítése
- **FUNC-026**: Eredmény exportálás CSV/PDF formátumban

#### 4.2.2 Elemző Eszközök
- **FUNC-027**: Átlagos teljesítmény számítása
- **FUNC-028**: Legnépszerűbb rejtvények azonosítása
- **FUNC-029**: Haladási statisztikák időtengelyen
- **FUNC-030**: Időelemzés (átlagos megoldási idő)

### 4.3 Évfolyam-specifikus Követelmények

#### 4.3.1 3. Osztály: "A Kód Királyság Titka"
- **GRADE3-001**: 5 állomás (Tudás Torony, Pixel Palota, Labirintuskert, Hangerdő, Adat-tenger)
- **GRADE3-002**: Egyszerű szöveges rejtvények és vizuális puzzle
- **GRADE3-003**: Színes ikonok és nagy méretű UI elemek
- **GRADE3-004**: Alapvető logikai fogalmak (igaz/hamis, jobbra/balra)

#### 4.3.2 4. Osztály: "A Rejtett Frissítés Kódja"
- **GRADE4-001**: 5 állomás komplexebb rejtvényekkel
- **GRADE4-002**: Időrendi sorrend és anomália felismerés
- **GRADE4-003**: Logikai kapuk (ÉS, VAGY, NEM) bevezetése
- **GRADE4-004**: Parancssorok alapfogalmai

#### 4.3.3 5. Osztály: "A Töréspont Rejtélye"
- **GRADE5-001**: 5 állomás algoritmikus gondolkodással
- **GRADE5-002**: Hibás sorminták felismerése és javítása
- **GRADE5-003**: Adathalmazok közötti kapcsolatok
- **GRADE5-004**: Hálózati kombinációk megértése

#### 4.3.4 6. Osztály: "A Fragmentumok Tükre"
- **GRADE6-001**: 5 állomás komplex feladatokkal
- **GRADE6-002**: Eredeti vs. tükrözött adatok megkülönböztetése
- **GRADE6-003**: Kronológiai logika és időrétegek
- **GRADE6-004**: Sodródó bináris tömbök kezelése

---

## 5. NEM FUNKCIONÁLIS KÖVETELMÉNYEK

### 5.1 Teljesítmény Követelmények
- **NFR-001**: Lap betöltési idő <3 másodperc (Core Web Vitals LCP <2.5s)
- **NFR-002**: Video streaming 1280x720 HD, 30 FPS minőségben
- **NFR-003**: Böngésző memória használat <100MB
- **NFR-004**: Videó buffering arány <5%

### 5.2 Kompatibilitás
- **NFR-005**: Támogatott böngészők: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **NFR-006**: Cross-browser funkcionalitás biztosítása
- **NFR-007**: Reszponzív design (tablet 768px+, desktop 1024px+)
- **NFR-008**: Keyboard navigáció támogatása

### 5.3 Biztonság és Adatvédelem
- **NFR-009**: GDPR compliance biztosítása
- **NFR-010**: HTTPS only kapcsolat
- **NFR-011**: Nincs felhasználói adat gyűjtés tracking nélkül
- **NFR-012**: LocalStorage only adatmentés (nincs szerver oldali tárolás)
- **NFR-013**: Tartalom szűrés és biztonságos videó/hang tartalom

### 5.4 Használhatóság
- **NFR-014**: Intuitív UI, 8-12 éves korosztálynak optimalizálva
- **NFR-015**: Hozzáférhetőség (WCAG 2.1 AA szint)
- **NFR-016**: Offline képesség kritikus tartalmak cache-elésével
- **NFR-017**: Egyértelmű hibakezelés és visszajelzés

### 5.5 Skálázhatóság
- **NFR-018**: Több évfolyam egyidejű használata
- **NFR-019**: 500+ egyidejű felhasználó támogatása
- **NFR-020**: Video tartalom dinamikus betöltése
- **NFR-021**: Moduláris architektúra további évfolyamok hozzáadásához

---

## 6. FELHASZNÁLÓI TÖRTÉNETEK (USER STORIES)

### 6.1 Diák Szerepkör

#### US-001: Első alkalommal játszó diák
**Mint** diák,  
**Szeretnék** regisztrálni a játékba,  
**Hogy** elkezdhessem a kalandot a Kód Királyságban.

**Elfogadási kritériumok:**
- [ ] Regisztrációs űrlap név, becenév, osztály megadásával
- [ ] Karakterválasztás 10 avatar közül
- [ ] Automatikus átirányítás az első évfolyam hub-jára
- [ ] Első játékállás automatikus mentése

#### US-002: Történetet játszó diák
**Mint** diák,  
**Szeretnék** videókat nézni a történetről,  
**Hogy** értsem a kontextust a rejtvények előtt.

**Elfogadási kritériumok:**
- [ ] Videó lejátszás vezérlőkkel (play, pause, stop)
- [ ] Hangszinkronizálás videóval
- [ ] Videó befejezése után "Tovább" gomb aktiválása
- [ ] Progress bar megjelenítése

#### US-003: Rejtvényt megoldó diák
**Mint** diák,  
**Szeretnék** különböző típusú rejtvényeket megoldani,  
**Hogy** pontokat gyűjtsek és haladást érjek el.

**Elfogadási kritériumok:**
- [ ] Legalább 5 különböző rejtvény típus elérhetősége
- [ ] Azonnali visszajelzés helyes/hibás válaszról
- [ ] Pontszám megjelenítése minden rejtvény után
- [ ] Bónusz pontok automatikus számítása

#### US-004: Haladását nyomon követő diák
**Mint** diák,  
**Szeretnék** látni a saját teljesítményemet,  
**Hogy** motivált legyek továbblépni.

**Elfogadási kritériumok:**
- [ ] Személyes statisztikák megtekintése
- [ ] Helyi ranglista megjelenítése
- [ ] Összegyűjtött kulcsok/tárgyak listája
- [ ] Történet befejezési státusz

### 6.2 Tanár Szerepkör

#### US-005: Diákok haladását nyomon követő tanár
**Mint** tanár,  
**Szeretnék** látni a diákok teljesítményét,  
**Hogy** segíthessek nekik fejlődni.

**Elfogadási kritériumok:**
- [ ] Admin dashboard bejelentkezés
- [ ] Diákok listája szűrési lehetőségekkel
- [ ] Részletes teljesítmény statisztikák
- [ ] Export funkciók (CSV, PDF)

#### US-006: Eredményeket elemző tanár
**Mint** tanár,  
**Szeretnék** elemezni a tanulási eredményeket,  
**Hogy** javíthassam az oktatási módszereimet.

**Elfogadási kritériumok:**
- [ ] Aggregált statisztikák megtekintése
- [ ] Legnépszerűbb rejtvények azonosítása
- [ ] Időbeli haladás grafikonok
- [ ] Osztályonkénti összehasonlítás

---

## 7. HASZNÁLATI ESETEK (USE CASES)

### 7.1 Diák Használati Esetek

#### UC-001: Új játék indítása
**Cél**: Diák új játékot kezd  
**Főszereplő**: Diák  
**Előfeltételek**: Regisztrált profil

**Folyamat:**
1. Diák belép a hub-ra
2. Évfolyamot választ
3. Karaktert választ vagy meglévőt használ
4. Első videó automatikusan elindul
5. Diák végignézi a videót
6. Rejtvény megjelenik
7. Diák megoldja a rejtvényt
8. Pontok hozzáadása és mentés

**Kivételek**:
- Video betöltési hiba → Retry mechanizmus
- Rejtvény hibás → Visszajelzés és újrapróbálkozás

#### UC-002: Játék folytatása
**Cél**: Diák folytatja korábban megkezdett játékot  
**Főszereplő**: Diák  
**Előfeltételek**: Mentett játékállás

**Folyamat:**
1. Diák belép a hub-ra
2. Évfolyamot választ
3. "Folytatás" gomb megnyomása
4. Automatikus átirányítás az utolsó állomásra
5. Utolsó videó visszajátszása opció
6. Következő rejtvény vagy állomás

#### UC-003: Statisztikák megtekintése
**Cél**: Diák megtekinti saját teljesítményét  
**Főszereplő**: Diák  
**Előfeltételek**: Legalább egy befejezett rejtvény

**Folyamat:**
1. Diák a profil menüben
2. "Statisztikák" opció választása
3. Személyes eredmények megjelenítése
4. Ranglista betöltése
5. Haladási diagram megtekintése

### 7.2 Tanár Használati Esetek

#### UC-004: Admin bejelentkezés
**Cél**: Tanár belép az admin felületre  
**Főszereplő**: Tanár  
**Előfeltételek**: Admin jogosultság

**Folyamat:**
1. "Bejelentkezés" gomb a hub-on
2. Admin azonosító megadása
3. Dashboard betöltése
4. Diákok listájának megjelenítése

#### UC-005: Diákok teljesítményének elemzése
**Cél**: Tanár elemzi a diákok haladását  
**Főszereplő**: Tanár  
**Előfeltételek**: Admin bejelentkezés

**Folyamat:**
1. Dashboard betöltése
2. Szűrők beállítása (osztály, időtartomány)
3. Diákok listájának megtekintése
4. Részletes statisztikák megnyitása
5. Eredmények exportálása

---

## 8. UI/UX KÖVETELMÉNYEK

### 8.1 Design Elvek
- **Egyszerűség**: Minimális komplexitás, intuitív navigáció
- **Vizuális Hierarchia**: Egyértelmű információ strukturálás
- **Konzisztencia**: Egységes színpaletta, tipográfia, ikonográfia
- **Hozzáférhetőség**: Nagy kontrasztok, olvasható betűtípusok

### 8.2 Színpaletta
- **Primer színek**: 
  - Kék: #2563EB (cselekvés, megbízhatóság)
  - Zöld: #16A34A (siker, pozitív visszajelzés)
- **Szekunder színek**:
  - Narancs: #EA580C (figyelemfelhívás)
  - Piros: #DC2626 (hibák, veszély)
- **Neutrális színek**:
  - Szürke: #6B7280 (másodlagos szöveg)
  - Fehér: #FFFFFF (háttér)
  - Fekete: #111827 (főszöveg)

### 8.3 Tipográfia
- **Főcímek**: 24-32px, bold
- **Alcímek**: 18-20px, semibold
- **Test szöveg**: 16px, regular
- **Kis szöveg**: 14px, regular
- **Betűtípus**: Inter vagy hasonló web-barát sans-serif

### 8.4 Komponens Követelmények

#### 8.4.1 Gombok
- **Primer gombok**: 44px minimum magasság (touch-friendly)
- **Secunder gombok**: Átlátszó háttér, border
- **Állapotok**: Normal, hover, active, disabled
- **Íkonok**: 20x20px minimum

#### 8.4.2 Videó Player
- **Kontrollok**: Play/pause, hangerő, teljes képernyő
- **Progress bar**: Video idő jelzése
- **Overlay információk**: Címek, instrukciók

#### 8.4.3 Rejtvény Interface
- **Nagy gombok**: Rejtvény opciókhoz (minimum 44px)
- **Vizuális visszajelzés**: Helyes/hibás válasz jelzése
- **Progress indicator**: Állomás/összes rejtvény mutatása

---

## 9. TECHNIKAI KÖVETELMÉNYEK

### 9.1 Technológiai Stack
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript (ES6+)
- **Video**: HTML5 Video API + Web Audio API
- **Adatmentés**: LocalStorage API
- **Architektúra**: SEL (State-Eventbus-Logger)
- **Deployment**: Statikus web hosting (GitHub Pages, Netlify)
- **FONTOS**: Csak Best Practice-ok használata!!!

### 9.2 Architektúra Specifikációk

#### 9.2.1 State Management
```javascript
const gameState = {
  currentGrade: 3|4|5|6,
  currentStation: 1-5,
  character: {
    name: string,
    nickname: string,
    class: number,
    avatar: string
  },
  progress: {
    keysCollected: number,
    score: number,
    completedStations: string[],
    currentStoryIndex: number
  },
  storyProgress: {
    currentScene: string,
    choices: object,
    visitedLocations: string[]
  }
}
```

#### 9.2.2 Event System
```javascript
const Events = {
  GAME_START: 'game:start',
  STATION_COMPLETE: 'station:complete',
  KEY_COLLECTED: 'key:collected',
  SCORE_UPDATE: 'score:update',
  STORY_PROGRESS: 'story:progress',
  SAVE_GAME: 'game:save',
  LOAD_GAME: 'game:load'
}
```

#### 9.2.3 Adatmodell
```json
{
  "playerData": {
    "character": {
      "name": "string",
      "nickname": "string",
      "class": "number",
      "avatar": "string"
    },
    "grade3": {
      "currentStation": "number",
      "keysCollected": "array",
      "score": "number",
      "completed": "boolean"
    }
  },
  "globalStats": {
    "totalScore": "number",
    "gamesPlayed": "number",
    "completionTime": "datetime"
  }
}
```

### 9.3 Fájlstruktúra
```
digitális-kultúra-verseny/
├── index.html              # Fő Hub oldal
├── css/
│   ├── main.css           # Alap styling
│   ├── hub.css           # Hub-specifikus
│   ├── game.css          # Játékfelület
│   └── video.css         # Videó lejátszás styling
├── js/
│   ├── app.js            # Fő alkalmazás
│   ├── game-engine.js    # Játék logika
│   ├── video-player.js   # Videó vezérlő
│   ├── slide-nav.js      # Diák navigáció
│   ├── story-data.js     # Történet adatok
│   ├── storage.js        # Mentési rendszer
│   └── ui-handlers.js    # Felhasználói interfész
├── videos/
│   ├── grade3/
│   │   ├── intro.mp4
│   │   ├── station1.mp4
│   │   └── ...
│   ├── grade4/
│   ├── grade5/
│   └── grade6/
├── audio/
│   ├── grade3/
│   ├── grade4/
│   ├── grade5/
│   └── grade6/
├── data/
│   ├── grade3-story.json
│   ├── grade4-story.json
│   ├── grade5-story.json
│   └── grade6-story.json
└── assets/
    ├── characters/
    ├── backgrounds/
    └── icons/
```

### 9.4 Video Technikai Specifikációk
- **Formátum**: .mp4 (H.264 codec)
- **Hang**: Külön audio csatorna (.mp3)
- **Hossz**: 30-90 másodperc videónként
- **Felbontás**: 1280x720 (HD) vagy 1920x1080 (FHD)
- **Minőség**: Web optimalizált (2-8 MB per videó)
- **Képkocka**: 30 FPS

---

## 10. KORLÁTOZÁSOK ÉS FELTEVÉSEK

### 10.1 Technikai Korlátok
- **Internet kapcsolat**: Videó streaminghez szükséges stabil kapcsolat
- **Böngésző korlátok**: Modern böngészők támogatása kötelező
- **Eszköz követelmények**: Tablet vagy desktop (minimum 768px szélesség)
- **Tároló korlát**: LocalStorage limitációk (5-10MB)

### 10.2 Szabályozási Korlátok
- **GDPR compliance**: Adatvédelmi szabályozások betartása
- **Gyermekvédelem**: COPPA compliance szükséges lehet
- **Oktatási szabványok**: Nemzeti curriculum követelmények

### 10.3 Forráskorlátok
- **Költségvetés**: 4.2-6.3M Ft fejlesztési költség
- **Időkeret**: 6-9 hónap fejlesztési idő
- **Csapat méret**: 3-4 fős fejlesztői csapat
- **Video tartalom**: Korlátozott video produkciós költségvetés

### 10.4 Feltevések
- **Internet hozzáférés**: Iskolákban elérhető stabil internet
- **Technikai jártasság**: Diákok alapvető böngészőhasználat ismerete
- **Tanár támogatás**: Oktatók hajlandósága a technológia használatára
- **Diák motiváció**: Játékos elemek fenntartják az érdeklődést

---

## 11. KOCKÁZATOK ÉS MITIGÁCIÓK

### 11.1 Technikai Kockázatok

#### 11.1.1 Video Streaming Problémák
**Kockázat**: Videók nem töltődnek be vagy akadoznak  
**Valószínűség**: Közepes  
**Hatás**: Magas  
**Mitigáció**: 
- CDN használat video hosting-hoz
- Multiple format támogatás (MP4, WebM)
- Fallback mechanizmusok
- Offline cache kritikus videókhoz

#### 11.1.2 Cross-browser Inkompatibilitás
**Kockázat**: Funkciók nem működnek minden böngészőben  
**Valószínűség**: Közepes  
**Hatás**: Közepes  
**Mitigáció**:
- Extensive cross-browser testing
- Progressive enhancement megközelítés
- Fallback solutions alternatív böngészőkhöz
- Polyfills használata szükséges API-khoz

#### 11.1.3 Performance Issues
**Kockázat**: Lassú betöltés, rossz felhasználói élmény  
**Valószínűség**: Közepes  
**Hatás**: Magas  
**Mitigáció**:
- Teljesítmény optimalizálás (lazy loading, minification)
- Image és video compression
- Code splitting és moduláris betöltés
- Performance monitoring

### 11.2 Oktatási Kockázatok

#### 11.2.1 Tanár Elfogadás
**Kockázat**: Tanárok nem adoptálják az új technológiát  
**Valószínűség**: Közepes  
**Hatás**: Magas  
**Mitigáció**:
- Átfogó training program
- User-friendly design
- Pilot program sikeres esettanulmányokkal
- Tanár support és helpdesk

#### 11.2.2 Diák Érdektelenség
**Kockázat**: Diákok nem motiváltak a használatra  
**Valószínűség**: Alacsony  
**Hatás**: Magas  
**Mitigáció**:
- Engaging video content és gamification
- Különböző nehézségi szintek
- Versenyelemek és díjazás
- Folyamatos tartalom frissítés

#### 11.2.3 Curriculum Alignment
**Kockázat**: Tartalom nem illeszkedik a tantervi követelményekhez  
**Valószínűség**: Közepes  
**Hatás**: Közepes  
**Mitigáció**:
- Tanárok bevonása a fejlesztésbe
- Curriculum expert konzultációk
- Pilot tesztelés valós osztályokkal
- Folyamatos feedback integrálás

### 11.3 Üzleti Kockázatok

#### 11.3.1 Finanszírozás Hiánya
**Kockázat**: Nem elég forrás a projekt befejezéséhez  
**Valószínűség**: Alacsony  
**Hatás**: Magas  
**Mitigáció**:
- Phased development approach
- MVP (Minimum Viable Product) prioritizálás
- Multiple funding source keresés
- Cost-effective technológiai döntések

#### 11.3.2 Verseny
**Kockázat**: Nagy tech cégek hasonló terméket dobnak piacra  
**Valószínűség**: Közepes  
**Hatás**: Közepes  
**Mitigáció**:
- Unique positioning (video-narratíva)
- Continuous innovation
- Strong brand building
- First-mover advantage kihasználása

#### 11.3.3 Skálázási Nehézségek
**Kockázat**: Nehezen skálázható sok felhasználóra  
**Valószínűség**: Alacsony  
**Hatás**: Közepes  
**Mitigáció**:
- Cloud-based architecture
- Modular design
- CDN használat
- Performance monitoring

---

## 12. SIKERMETRIKÁK ÉS MÉRÉS

### 12.1 Használati Metrikák Gyűjtése

#### 12.1.1 Automatikus Adatgyűjtés
```javascript
// Példa analytics implementáció
class Analytics {
  trackEvent(eventName, properties) {
    const event = {
      event: eventName,
      properties: properties,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      userId: this.getUserId()
    };
    
    // LocalStorage mentés (GDPR compliance)
    this.saveToLocalStorage(event);
    
    // Opcionális: anonim analytics küldése
    if (userConsents) {
      this.sendToAnalytics(event);
    }
  }
  
  trackPageView(pageName) {
    this.trackEvent('page_view', {
      page: pageName,
      grade: this.getCurrentGrade(),
      station: this.getCurrentStation()
    });
  }
  
  trackPuzzleCompletion(puzzleType, success, timeSpent) {
    this.trackEvent('puzzle_completed', {
      type: puzzleType,
      success: success,
      timeSpent: timeSpent,
      score: this.getCurrentScore()
    });
  }
}
```

#### 12.1.2 Tanár Dashboard Metrikák
- **Napi aktív diákok száma**
- **Átlagos session idő**
- **Rejtvény megoldási arányok évfolyamonként**
- **Legnépszerűbb rejtvény típusok**
- **Teljesítmény eloszlás**
- **Haladási statisztikák**

### 12.2 Oktatási Hatás Mérése

#### 12.2.1 Pre/Post Assessment
- **Logikai gondolkodás tesztek**
- **Programozási alapfogalmak felmérése**
- **Digitális kompetencia skála**
- **Tanulási motiváció felmérés**

#### 12.2.2 Kvalitatív Feedback
- **Diák interjúk** (félévente)
- **Tanár fókuszcsoportok** (negyedévente)
- **Szülői visszajelzések** (éventente)
- **Pilot iskola esettanulmányok**

### 12.3 Üzleti Metrikák

#### 12.3.1 Piaci Teljesítmény
- **Aktív iskolák száma**
- **Diák regisztrációk száma**
- **Havi visszatérő felhasználók**
- **Net Promoter Score (NPS)**

#### 12.3.2 Pénzügyi Metrikák
- **Customer Acquisition Cost (CAC)**
- **Lifetime Value (LTV)**
- **Monthly Recurring Revenue (MRR)**
- **Churn rate**

---

## 13. ÜTEMTERV ÉS MÉRFÖLDKÖVEK

### 13.1 Fejlesztési Fázisok

#### 13.1.1 Fázis 1: MVP Alap Infrastruktúra (4-6 hét)
**Cél**: Működő alapvető játékmenet

**Feladatok**:
- [ ] Hub interfész és navigáció
- [ ] Regisztráció és karakterválasztó
- [ ] Video player rendszer (HTML5 + Audio API)
- [ ] LocalStorage mentési rendszer
- [ ] Alapvető UI komponensek
- [ ] SEL architektúra implementálás

**Mérföldkő**: Első játszható verzió 3. osztály tartalommal

#### 13.1.2 Fázis 2: 3. Osztály Teljes Tartalom (6-8 hét)
**Cél**: Teljes 3. osztály történet implementálása

**Feladatok**:
- [ ] "A Kód Királyság Titka" videók elkészítése
- [ ] 5 állomás video tartalma + végső videó
- [ ] Egyszerű rejtvény típusok implementálása
- [ ] Hangcsatorna integráció és szinkronizálás
- [ ] Pontszámítás rendszer
- [ ] Tesztelés és optimalizálás

**Mérföldkő**: Teljes 3. osztály játékmenet

#### 13.1.3 Fázis 3: 4-5. Osztály Bővítés (8-10 hét)
**Cél**: További évfolyamok hozzáadása

**Feladatok**:
- [ ] "A Rejtett Frissítés Kódja" videó tartalom
- [ ] "A Töréspont Rejtélye" videó tartalom
- [ ] Közepes komplexitású rejtvény típusok
- [ ] Puzzle és kódolási feladatok
- [ ] Rendszer stabilizálás
- [ ] Cross-browser kompatibilitás

**Mérföldkő**: 3 évfolyam teljes funkcionalitással

#### 13.1.4 Fázis 4: 6. Osztály + Admin (6-8 hét)
**Cél**: Teljes termék és admin funkciók

**Feladatok**:
- [ ] "A Fragmentumok Tükre" videó tartalom
- [ ] Haladó rejtvény típusok
- [ ] Admin dashboard és bejelentkezés
- [ ] Eredménylista és rangsort
- [ ] Export funkciók (CSV/PDF)
- [ ] Statisztika dashboard

**Mérföldkő**: Teljes termék 4 évfolyammal

#### 13.1.5 Fázis 5: Optimalizálás és Deployment (4-6 hét)
**Cél**: Production-ready verzió

**Feladatok**:
- [ ] Video streaming optimalizálás
- [ ] Performance tuning
- [ ] Mobile responsive finomítás
- [ ] Bug javítások és polish
- [ ] Beta tesztelés diákokkal
- [ ] Dokumentáció és deployment

**Mérföldkő**: Production release

### 13.2 Kritikus Mérföldkövek

| Dátum | Mérföldkő | Leírás |
|-------|-----------|---------|
| 2025. 02. 15. | MVP Alpha | Alap játékmenet működik |
| 2025. 03. 31. | 3. Osztály Beta | Teljes 3. osztály tartalom |
| 2025. 05. 15. | Multi-grade Beta | 3 évfolyam kész |
| 2025. 07. 01. | Production Ready | Teljes termék + Admin |
| 2025. 08. 15. | Pilot Launch | Első iskolákban való tesztelés |

### 13.3 Függőségek és Rizikófaktorok

#### 13.3.1 Video Tartalom Készítés
- **Függőség**: Storyboard → Video production → Editing
- **Rizikó**: Késés a video készítésben
- **Mitigáció**: Parallel development, placeholder content

#### 13.3.2 Technikai Fejlesztés
- **Függőség**: Frontend → Video integration → Testing
- **Rizikó**: Cross-browser kompatibilitás problémák
- **Mitigáció**: Korai és gyakori tesztelés

#### 13.3.3 Pilot Program
- **Függőség**: Beta release → Pilot schools → Feedback
- **Rizikó**: Iskolák nem állnak rendelkezésre
- **Mitigáció**: Multiple backup pilot schools

---

## 14. KÖLTSÉGVETÉS ÉS ERŐFORRÁSOK

### 14.1 Fejlesztési Költségek

#### 14.1.1 Emberi Erőforrások
| Szerepkör | Időtartam | Óradíj | Összesen |
|-----------|-----------|--------|----------|
| Frontend Developer | 200-300 óra | 15.000 Ft | 3.000.000 - 4.500.000 Ft |
| UI/UX Designer | 40-60 óra | 12.000 Ft | 480.000 - 720.000 Ft |
| Content Creator (Video) | 50-80 óra | 8.000 Ft | 400.000 - 640.000 Ft |
| QA/Tester | 30-40 óra | 10.000 Ft | 300.000 - 400.000 Ft |
| Project Manager | 100 óra | 10.000 Ft | 1.000.000 Ft |

**Összes fejlesztési költség**: 5.180.000 - 7.260.000 Ft

#### 14.1.2 Technológiai Költségek
| Kategória | Költség | Részletezés |
|-----------|---------|-------------|
| Video Hosting/CDN | 50.000 - 100.000 Ft | 6 hónap |
| Domain + SSL | 20.000 Ft/év | .hu domain |
| Design Tools | 30.000 Ft | Adobe Creative Suite |
| Development Tools | 25.000 Ft | Licencdíjak |

**Összes technológiai költség**: 125.000 - 175.000 Ft

### 14.2 Működési Költségek (Havi)

#### 14.2.1 Hosting és Infrastruktúra
- **Web hosting**: 10.000 - 20.000 Ft/hó
- **Video streaming/CDN**: 5.000 - 15.000 Ft/hó
- **Backup és monitoring**: 5.000 Ft/hó

#### 14.2.2 Karbantartás és Támogatás
- **Fejlesztői karbantartás**: 20.000 - 30.000 Ft/hó
- **Customer support**: 15.000 - 25.000 Ft/hó
- **Tartalom frissítés**: 10.000 - 20.000 Ft/hó

**Összes havi működési költség**: 65.000 - 115.000 Ft

### 14.3 Bevételi Modell

#### 14.3.1 Freemium Struktúra
- **Alap verzió**: Ingyenes (3. osztály + limitált rejtvények)
- **Premium verzió**: 2.000 - 5.000 Ft/felhasználó/év
  - Mind a 4 évfolyam
  - Korlátlan rejtvény hozzáférés
  - Részletes statisztikák
  - Offline mód

#### 14.3.2 Iskolai Licencelés
- **Osztály licenc**: 50.000 - 100.000 Ft/osztály/év
- **Iskola licenc**: 200.000 - 400.000 Ft/év
- **Pilot program**: Ingyenes próbaidőszak

### 14.4 ROI Projekció

#### 14.4.1 Első Év Célok
- **Felhasználók**: 500 diák
- **Premium arány**: 30% (150 diák)
- **Bevétel**: 150 × 3.000 Ft = 450.000 Ft
- **Iskolai licencelés**: 10 iskola × 300.000 Ft = 3.000.000 Ft

**Összes bevétel**: 3.450.000 Ft
**Teljes költség**: 5.500.000 Ft (fejlesztés + 6 hónap működés)
**Net ROI**: -59% (befektetési fázis)

#### 14.4.2 Második Év Projekció
- **Felhasználók**: 1.500 diák
- **Premium arány**: 40% (600 diák)
- **Bevétel**: 600 × 3.500 Ft = 2.100.000 Ft
- **Iskolai licencelés**: 25 iskola × 350.000 Ft = 8.750.000 Ft

**Összes bevétel**: 10.850.000 Ft
**Működési költség**: 1.200.000 Ft
**Nettó profit**: 9.650.000 Ft

---

## 15. JÖVŐBELI FEJLESZTÉSI LEHETŐSÉGEK

### 15.1 Rövid Távú Bővítések (3-6 hónap)
- **Tanári felület**: Részletes dashboard és analitika
- **Többnyelvűség**: Angol verzió fejlesztése
- **Mobil optimalizálás**: Touch-barátságos UI
- **Hang effektek**: Történethez illő háttérzene és hangok
- **Haladási export**: PDF tanúsítványok generálása

### 15.2 Középtávú Fejlesztések (6-12 hónap)
- **Online multiplayer**: Csapat versenyek és együttműködés
- **További évfolyamok**: 1-2. osztály és 7-8. osztály verziók
- **AI asszisztens**: Okosabb rejtvény generálás és adaptív nehézség
- **Közösségi funkciók**: Eredmények megosztása, diák profilok
- **API fejlesztés**: Harmadik fél integrációk

### 15.3 Hosszú Távú Vízió (1+ év)
- **VR/AR támogatás**: Immersive tanulási élmény
- **Mobil app**: iOS és Android natív alkalmazások
- **Kiterjesztett valóság**: Fizikai világ integráció
- **Tanári dashboard Pro**: Haladó analitika és jelentéskészítés
- **Nemzetközi terjeszkedés**: Több európai nyelv támogatása

### 15.4 Technológiai Innovációk
- **Gépi tanulás**: Személyre szabott tanulási útvonalak
- **Adaptív tartalom**: Dinamikus nehézség beállítás
- **Predictive analytics**: Tanulási nehézségek előrejelzése
- **Voice interface**: Hang alapú navigáció

---

## 16. ÖSSZEGZÉS ÉS KÖVETKEZŐ LÉPÉSEK

### 16.1 Projekt Összegzése
A **Digitális Kultúra Verseny** egy innovatív oktatási platform, amely video-narratívával kombinált interaktív rejtvényeken keresztül tanítja meg a diákoknak a programozási alapfogalmakat és logikai gondolkodást. A projekt egyedülálló pozíciót foglal el a magyar oktatási piacon, és jelentős hatást gyakorolhat a diákok digitális kompetenciájának fejlesztésére.

### 16.2 Kulcs Sikerfaktorok
1. **Minőségi video tartalom**: Professzionális produkció szükséges
2. **Pedagógiai megalapozottság**: Tanár közösség bevonása
3. **Technikai kiválóság**: Stabil, gyors platform
4. **Felhasználói élmény**: Diák-barátságos interface
5. **Skálázhatóság**: Fokozatos bővítési lehetőség

### 16.3 Azonnali Lépések (30 nap)

#### 16.3.1 Csapat Összeállítás
- [ ] **Frontend Developer** toborzása és szerződtetése
- [ ] **UI/UX Designer** kiválasztása
- [ ] **Content Creator** megbízása video produkcióhoz
- [ ] **Project Manager** kijelölése

#### 16.3.2 Technikai Előkészületek
- [ ] **Development environment** beállítása
- [ ] **Version control** rendszer (Git) konfigurálása
- [ ] **CI/CD pipeline** tervezés
- [ ] **Testing framework** kiválasztása

#### 16.3.3 Pilot Program Előkészítés
- [ ] **Pilot iskolák** felkutatása és megkeresése
- [ ] **Tanár partnerek** azonosítása
- [ ] **Pilot agreement** sablon készítése
- [ ] **Feedback system** tervezése

#### 16.3.4 Finanszírozás
- [ ] **Budget finalizálás** és jóváhagyás
- [ ] **Funding secured** források biztosítása
- [ ] **Cost tracking** rendszer beállítása

### 16.4 Következő 90 Nap

#### 16.4.1 MVP Fejlesztés
- [ ] **Alap infrastruktúra** implementálása
- [ ] **Hub és navigáció** elkészítése
- [ ] **Video player** rendszer fejlesztése
- [ ] **3. osztály prototípus** elkészítése

#### 16.4.2 Video Tartalom
- [ ] **Storyboard készítés** minden videóhoz
- [ ] **Video production** indítása
- [ ] **Hangfelvétel** és narráció
- [ ] **Post-production** és optimalizálás

#### 16.4.3 Pilot Tesztelés
- [ ] **Beta verzió** készítése
- [ ] **Pilot iskolák** onboarding
- [ ] **Tanár tréning** program
- [ ] **Feedback gyűjtés** és elemzés

### 16.5 Projekt Sikerességének Kritériumai
- [ ] **Technikai**: MVP időben és költségkereten belül elkészül
- [ ] **Pedagógiai**: Pilot tesztelés pozitív eredményeket mutat
- [ ] **Üzleti**: Első évben 300+ aktív felhasználó
- [ ] **Minőségi**: >4.5/5 tanár elégedettség
- [ ] **Hatás**: 70%+ rejtvény megoldási arány

---

## 17. DOKUMENTUM INFORMÁCIÓK

**Dokumentum típusa**: Product Requirements Document (PRD)  
**Projekt neve**: Digitális Kultúra Verseny  
**Verzió**: 1.0  
**Dátum**: 2025-12-21  
**Szerző**: Projekt Manager  
**Jóváhagyás**: Projekt Stakeholderek  

### 17.1 Dokumentum Történet
- **v1.0** (2025-12-21): Első teljes PRD verzió

### 17.2 Stakeholder Lista
- **Projekt Sponsor**: [Név, Pozíció]
- **Product Owner**: [Név, Pozíció]
- **Tech Lead**: [Név, Pozíció]
- **Pedagógiai Tanácsadó**: [Név, Pozíció]
- **UI/UX Designer**: [Név, Pozíció]

### 17.3 Kapcsolódó Dokumentumok
- Product Brief (product-brief.md)
- Brainstorming Dokumentum (brainstorming.md)
- Technology Comparison (technology-comparison.md)
- Fejlesztési Roadmap (külön dokumentum)
- Pilot Program Terv (külön dokumentum)

---

**Ez a PRD dokumentum a "Digitális Kultúra Verseny" projekt teljes követelményeit és specifikációit tartalmazza. A dokumentumot rendszeresen frissíteni kell a fejlesztési folyamat során, és minden jelentős változást dokumentálni kell.**