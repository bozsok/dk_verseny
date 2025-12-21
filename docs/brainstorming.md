# Digitális Kultúra Verseny - Brainstorming Dokumentum

## Projekt Áttekintés

### Alapkoncepció
Egy webes alapú, történetmesélésen alapuló logikai rejtvény verseny általános iskolásoknak (3-6. osztály), amely a "Kód Királyság" univerzumban játszódik. Minden évfolyam saját kalandot kap, a bonyolultság fokozatosan növekszik.

### Főbb Jellemzők
- **Platform**: Webes alkalmazás (böngésző alapú)
- **Célcsoport**: 3-6. osztályos diákok (8-12 év)
- **Játékmód**: Lineáris kaland - mindig előre haladás
- **Haladás**: Játékállás mentése kötelező
- **Versenyelemek**: Pontszámítás + eredménylista
- **Időkorlát**: Nincs - nyugodt gondolkodás
- **Architektúra**: SEL (State-Eventbus-Logger) mintakövetés

## Felhasználói Interfész Tervezés

### 1. Fő Hub (Kezdőoldal)
```
┌─────────────────────────────────────────┐
│       DIGITÁLIS KULTÚRA VERSENY         │
│                                         │
│  ┌─────────────┐ ┌─────────────┐        │
│  │ 3. OSZTÁLY  │ │ 4. OSZTÁLY  │        │
│  │ A Kód       │ │ A Rejtett   │        │
│  │ Királyság   │ │ Frissítés   │        │
│  │ Titka       │ │ Kódja       │        │
│  └─────────────┘ └─────────────┘        │
│                                         │
│  ┌─────────────┐ ┌─────────────┐        │
│  │ 5. OSZTÁLY  │ │ 6. OSZTÁLY  │        │
│  │ A Töréspont │ │ A Fragmentum│        │
│  │ Rejtélye    │ │ ok Tükre    │        │
│  └─────────────┘ └─────────────┘        │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │          [BEJELENTKEZÉS]             │ │
│  │       (Admin Dashboard)             │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 2. Regisztráció (2. dia)
```
┌─────────────────────────────────────────┐
│          ÜDVÖZÖLLEK KÓDMESTER!          │
│                                         │
│ Név: [______________]                   │
│ Becenév: [______________]               │
│ Osztály: [3] [4] [5] [6]                │
│                                         │
│        [TOVÁBB A KARAKTERVÁLASZTÁSHOZ]  │
└─────────────────────────────────────────┘
```

### 3. Karakterválasztó (3. dia)
```
┌─────────────────────────────────────────┐
│         VÁLASSZ KARAKTERT!              │
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ 🧙‍♂️      │ │ 🧝‍♀️      │ │ 🧚‍♂️      │    │
│  │ VARÁZSLÓ│ │ TŰZ-    │ │ TÜNDÉR  │    │
│  │         │ │ TŰZ-    │ │         │    │
│  │         │ │ ORÁK    │ │         │    │
│  └─────────┘ └─────────┘ └─────────┘    │
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ 🧞‍♂️      │ │ 🧛‍♂️      │ │ 🐉      │    │
│  │ SZELLEM │ │ VÁMPÍR  │ │ SÁRKÁNY │    │
│  │         │ │         │ │         │    │
│  │         │ │         │ │         │    │
│  └─────────┘ └─────────┘ └─────────┘    │
│                                         │
│        [INDÍTSD EL A KALANDOT!]         │
└─────────────────────────────────────────┘
```

### 4. Videó-alapú Történetmesélés
```
┌─────────────────────────────────────────┐
│ Kód Királyság - 3. osztály             │
│ Pontok: 1250 | Állomás: 2/5            │
├─────────────────────────────────────────┤
│                                         │
│ ┌─ Videó Lejátszás ───────────────────┐ │
│ │                                     │ │
│ │        🎬 [VIDEO PLAYER]            │ │
│ │                                     │ │
│ │ [▶️] [⏸️] [⏹️] [🔊]                  │ │
│ │                                     │ │
│ │ [VISSZA] [TOVÁBB A REJTVÉNYHEZ]     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Progressz: ●●●○○○○○○○ (3/10)            │
└─────────────────────────────────────────┘
```

### 5. Rejtvény Felület
```
┌─────────────────────────────────────────┐
│ Kód Királyság - 3. osztály             │
│ Pontok: 1250 | Állomás: 2/5            │
├─────────────────────────────────────────┤
│                                         │
│ ┌─ Történet Kontextus ────────────────┐ │
│ │ A varázsló varázsereje segítségével │ │
│ │ megnyithatod az első kaput...       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─ Rejtvény ─────────────────────────┐ │
│ │ Melyik a helyes kód?                │ │
│ │                                     │ │
│ │ A) 1010  B) 1100  C) 1001          │ │
│ │                                     │ │
│ │ [Válasz A] [Válasz B] [Válasz C]    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Progressz: ●●●○○○○○○○ (3/10)            │
└─────────────────────────────────────────┘
```

## Részletes Történetek Évfolyamonként

### 3. OSZTÁLY: "A Kód Királyság Titka"

**Főgonosz**: Árnyporgram
**Küldetés**: 5 mágikus kulcs összegyűjtése a Királyság megmentéséhez

#### Állomások:
1. **Tudás Torony** 
   - Informatikai alapfogalmak
   - Egyszerű logikai rejtvények
   - Színes ikonok és vizuális elemek

2. **Pixel Palota**
   - Digitális mozaik puzzle
   - Színkódok felismerése
   - Egyszerű mintázatok

3. **Labirintuskert**
   - Vizuális útvesztő
   - Egyszerű irányítási feladatok
   - Nyilak és szimbólumok

4. **Hangerdő**
   - Hangüzenet dekódolás
   - Ritmus és dallam felismerés
   - Sonora karakter segítségével

5. **Adat-tenger**
   - Alapvető kódok megfejtése
   - Egyszerű szöveges üzenetek
   - Vizuális kódok

**Végső helyszín**: Nagy Zár
- Az 5 kulcs összekapcsolása
- Egyszerű logikai műveletek
- Árnyporgram legyőzése

### 4. OSZTÁLY: "A Rejtett Frissítés Kódja"

**Probléma**: Rendszer instabilitás
**Küldetés**: 5 rejtett frissítőszkript összegyűjtése

#### Állomások:
1. **Rendszernaplók Temploma**
   - Naplóbejegyzések időrendi sorrendbe rendezése
   - Hibakeresés logikai sorozatokban
   - Anomália felismerése

2. **Futtatókör**
   - Mozgó platformokon való navigálás
   - Kódútvonalak helyes lefuttatása
   - Időnyomás alatti logikai döntések

3. **Töréspont-híd**
   - Hibás fájlblokkok felismerése
   - Hasznos vs. káros adatok megkülönböztetése
   - Adatátviteli protokollok megértése

4. **Kernel-pajzs Galéria**
   - Holografikus védelmi algoritmusok
   - Logikai kapuk (ÉS, VAGY, NEM)
   - Parancssorok dekódolása

5. **Reboot-sivatag**
   - Szunnyadó modulok újraélesztése
   - Ritmikus kódsorok
   - Memóriahívások

**Végső helyszín**: Magrendszer Kamrája
- Kódsorok helyes sorrendbe illesztése
- Időzített rendszer futtatása
- Rendszer stabilizálása

### 5. OSZTÁLY: "A Töréspont Rejtélye"

**Probléma**: Digitális anomália szétválasztja az adatvilágokat
**Küldetés**: 5 Hídcsomópont aktiválása

#### Állomások:
1. **Kódvár**
   - Hibás sorminták felismerése és javítása
   - Programozási logikai csapdák
   - Algoritmikus gondolkodás

2. **Színszektor**
   - Holografikus térben navigálás
   - Színes bináris jelzések dekódolása
   - Színkombinációk és sorrend felismerése

3. **Töredezett Képernyő**
   - Vizuális mozaik visszaállítása
   - Hiányzó részletek kiegészítése
   - Rendszer eredeti megjelenésének rekonstruálása

4. **Meta-horizont**
   - Adathalmazok közötti kapcsolatok
   - Valódi vs. ál-logikai összefüggések
   - Hálózati kombinációk

5. **Zajzóna**
   - Zavarjelek közti utasítások
   - Figyelem és kitartás próbája
   - Ritmusérzék és szétválasztás

**Végső helyszín**: Töréspont Kapuja
- Kód Királyság digitális DNS rekonstrukciója
- Forrásszál összeállítása
- Világok újraegyesítése

### 6. OSZTÁLY: "A Fragmentumok Tükre"

**Probléma**: Alapkód tükörmásolata széttört
**Küldetés**: 5 fragmentum összegyűjtése

#### Állomások:
1. **Tükrözött Archívum**
   - Eredeti vs. tükrözött adatok megkülönböztetése
   - Hatalmas adatlabirintus navigálása
   - Információ hitelességének ellenőrzése

2. **Széthasadt Memóriamező**
   - Darabokra szaggatott emlékek
   - Vizuális és hang információk párosítása
   - Történetek újraépítése

3. **Időpuffer-barlang**
   - Töredékes időrétegek
   - Kronológiai logika
   - Események helyes sorrendje

4. **Reflexiós Lépcsőház**
   - Tükörképes választások
   - Ellentmondó információk szűrése
   - Valódi előrehaladás megtalálása

5. **Kódfelhő Zóna**
   - Sodródó bináris tömbök
   - Mozgó adatfolyamok
   - Mintázatok kiragadása

**Végső helyszín**: Szinkrontükör Csarnoka
- Fragmentumokból tükörkód szerkezet
- Alapkód rekonstrukció
- Világ szinkronizálása

## Technikai Architektúra

### SEL Mintakövetés (State-Eventbus-Logger)

#### 1. State Management
```javascript
// Game State Structure
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

#### 2. Event System
```javascript
// Event Types
const Events = {
  GAME_START: 'game:start',
  STATION_COMPLETE: 'station:complete',
  KEY_COLLECTED: 'key:collected',
  SCORE_UPDATE: 'score:update',
  STORY_PROGRESS: 'story:progress',
  SAVE_GAME: 'game:save',
  LOAD_GAME: 'game:load'
}

// Event Bus Implementation
class EventBus {
  events = new Map();
  
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
  }
  
  emit(event, data) {
    const callbacks = this.events.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }
}
```

#### 3. Logger System
```javascript
class GameLogger {
  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      gameState: this.getCurrentState()
    };
    
    // Console log for development
    console.log(`[${level.toUpperCase()}] ${message}`, data);
    
    // Save to localStorage for persistence
    this.saveToStorage(logEntry);
  }
  
  saveGameState(state) {
    localStorage.setItem('kodKiralySaga_progress', JSON.stringify(state));
  }
}
```

### Web Technológiai Stack

#### Frontend (Döntött: Vanilla JavaScript + HTML5)
- **HTML5 + CSS3**: Strukturálás és styling
- **Vanilla JavaScript**: Logika és interaktivitás
- **LocalStorage**: Játékállás mentése
- **HTML5 Video API**: Videó lejátszás kezelése
- **Audio API**: Hangcsatorna kezelése
- **Slide Navigation**: Diák közötti navigáció

#### Miért Vanilla JavaScript?
- **Egyszerűbb fejlesztés**: Video slide show nem igényel keretrendszert
- **Jobb teljesítmény**: Gyorsabb betöltés kritikus oktatási környezetben
- **Tanulhatóbb**: Diákok és fejlesztők számára is érthető
- **Stabilabb**: Kevesebb függőség = kevesebb hiba
- **Gyorsabb megvalósítás**: Nincs build process overhead

#### Backend (opcionális jövőbeli fejlesztéshez)
- **Node.js + Express**: Egyszerű API
- **JSON fájlok**: Eredménylista tárolása
- **File system**: Mentések mentése

### Adatmodell

#### Játékállás (localStorage)
```json
{
  "playerData": {
    "character": {
      "name": "Kovács Péter",
      "nickname": "Péter",
      "class": 3,
      "avatar": "wizard"
    },
    "grade3": {
      "currentStation": 2,
      "keysCollected": ["knowledgeTower", "pixelPalace"],
      "score": 250,
      "completed": false,
      "storyProgress": {
        "currentScene": "labyrinthGarden",
        "choices": {
          "towerChoice": "blueKey"
        }
      }
    },
    "grade4": {
      "currentStation": 1,
      "scriptsCollected": [],
      "score": 0,
      "completed": false
    }
  },
  "globalStats": {
    "totalScore": 250,
    "gamesPlayed": 1,
    "completionTime": null
  }
}
```

#### Eredménylista (JSON)
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "name": "Nagy Anna",
      "class": 6,
      "totalScore": 1250,
      "grade6Completed": true,
      "grade5Completed": true,
      "completionTime": "2025-12-20T15:30:00Z"
    }
  ]
}
```

## Játékmécanika Részletek

### Pontszámítás Rendszere
- **Alap pontszám**: Minden állomás teljesítéséért 100 pont
- **Rejtvény típusok**: Különböző pontokért (Tervezés alatt)
  - Szöveges kérdés: 25 pont
  - Puzzle: 50 pont
  - Kódolási feladat: 75 pont
  - Hangalapú: 40 pont
  - Memóriajáték: 35 pont
  - Logikai feladat: 60 pont
  - Kreatív feladat: 80 pont
- **Bónusz pontok**: Gyors teljesítésért (+50), kreatív megoldásért (+25)
- **Végső bónusz**: Teljes történet befejezéséért +500 pont

### Progresszió Követés
- **Lineáris haladás**: Mindig előre, helyes válasz nem kötelező
- **Slide-alapú navigáció**: Videó → Gomb → Rejtvény → Videó
- **Videó sorrend**: Állomásonként több videó egybe fűzve
- **Interaktív elemek**: Videó lejátszás + gomb navigáció

### Mentési Rendszer
- **Automatikus mentés**: Minden állomás végén
- **Manuális mentés**: "Mentés" gomb
- **Több slot**: 3 mentési pozíció játékosonként

## Fejlesztési Ütemterv

### 1. Fázis: Alap Infrastruktúra (2-3 hét)
- [ ] Hub interfész + slide navigációs rendszer
- [ ] Video player rendszer (HTML5 Video + Audio API)
- [ ] Regisztráció és karakterválasztó
- [ ] LocalStorage mentési rendszer
- [ ] Alapvető UI komponensek

### 2. Fázis: 3. Osztály + Video Tartalom (3-4 hét)
- [ ] "A Kód Királyság Titka" videók elkészítése
- [ ] 5 állomás videó tartalma + végső videó
- [ ] Egyszerű rejtvény implementálás
- [ ] Hangcsatorna integráció
- [ ] Tesztelés és optimalizálás

### 3. Fázis: 4. Osztály + Közepes Rejtvények (3-4 hét)
- [ ] "A Rejtett Frissítés Kódja" videó tartalom
- [ ] Közepes komplexitású rejtvény típusok
- [ ] Puzzle és kódolási feladatok
- [ ] Rendszer stabilizálás

### 4. Fázis: 5-6. Osztály + Haladó Funkciók (4-5 hét)
- [ ] Bonyolultabb történetek videó tartalma
- [ ] Haladó rejtvény típusok implementálása
- [ ] Meta-gondolkodás feladatok
- [ ] Teljesítmény optimalizálás

### 5. Fázis: Admin Dashboard + Eredménylista (2-3 hét)
- [ ] Admin bejelentkezési rendszer
- [ ] Eredménylista és rangsort
- [ ] Export funkciók (CSV/PDF)
- [ ] Statisztika dashboard
- [ ] Osztály szűrési funkciók

### 6. Fázis: Teljes Rendszer Integráció + Finomítás (2-3 hét)
- [ ] Mind a 4 évfolyam tesztelése
- [ ] Video streaming optimalizálás
- [ ] Cross-browser kompatibilitás
- [ ] Mobile responsive finomítás
- [ ] Bug javítások és polish

### 7. Fázis: Dokumentáció + Deployment (1 hét)
- [ ] Felhasználói dokumentáció
- [ ] Admin útmutató
- [ ] Technikai dokumentáció
- [ ] Éles környezetbe telepítés
- [ ] Beta tesztelés diákokkal

## Összes Fejlesztési Idő: 17-25 hét (4-6 hónap)

## Kritikus Fejlesztési Komponensek

### Video Tartalom Készítés
- **Storyboard tervezés**: Minden videóhoz részletes forgatókönyv
- **Grafikai elemek**: Karakter design, háttér, animációk
- **Hangfelvétel**: Magyar narráció professzionális minőségben
- **Videó szerkesztés**: Final Cut Pro / Adobe Premiere
- **Optimalizálás**: Web formátum (H.264, megfelelő bitrate)

### Technikai Kihívások
- **Video streaming**: Megbízható betöltés és lejátszás
- **Audio szinkronizálás**: Hang és videó összehangolása
- **Cross-browser kompatibilitás**: Video formátumok támogatása
- **Teljesítmény optimalizálás**: Gyors betöltés, smooth playback
- **Offline támogatás**: Kritikus videók cache-elése

## Technikai Megvalósítás Részletei

### Fájlstruktúra
```
kod-kiraly-saga/
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
│   │   ├── intro.mp4     # Üdvözlő videó
│   │   ├── station1.mp4  # 1. állomás
│   │   ├── station2.mp4  # 2. állomás
│   │   ├── station3.mp4  # 3. állomás
│   │   ├── station4.mp4  # 4. állomás
│   │   ├── station5.mp4  # 5. állomás
│   │   └── finale.mp4    # Végső videó
│   ├── grade4/           # Ugyanaz a struktura
│   ├── grade5/           # Ugyanaz a struktura
│   └── grade6/           # Ugyanaz a struktura
├── audio/
│   ├── grade3/
│   │   ├── narration1.mp3 # Hangcsatorna 1
│   │   ├── narration2.mp3 # Hangcsatorna 2
│   │   └── ...
│   ├── grade4/           # Ugyanaz a struktura
│   ├── grade5/           # Ugyanaz a struktura
│   └── grade6/           # Ugyanaz a struktura
├── data/
│   ├── grade3-story.json # Történet struktura
│   ├── grade4-story.json # Történet struktura
│   ├── grade5-story.json # Történet struktura
│   └── grade6-story.json # Történet struktura
└── assets/
    ├── characters/       # Karakter képek
    ├── backgrounds/     # Háttér képek
    └── icons/          # UI ikonok
```

### Kódolási Konvenciók
- **ES6+ JavaScript**: Modern szintaxis
- **Kommentek magyarul**: Érthetőség miatt
- **Moduláris felépítés**: Könnyen karbantartható
- **Responsive design**: Tablet és desktop optimalizált
- **Video Player**: HTML5 video vezérlés
- **Audio Handling**: Külön hangcsatorna kezelés

### Tesztelési Stratégia
- **Unit tesztek**: Kritikus függvényekhez
- **Integrációs tesztek**: Komponensek együttműködése
- **Felhasználói teszt**: Diákokkal való próba
- **Cross-browser teszt**: Különböző böngészőkben

## Jövőbeli Fejlesztési Lehetőségek

### Rövid Távú (3-6 hónap)
- **Tanári felület**: Eredmények nyomon követése
- **Többnyelvűség**: Angol verzió
- **Mobil optimalizálás**: Touch barátságos UI
- **Hang effektek**: Történethez illő hangok

### Középtávú (6-12 hónap)
- **Online multiplayer**: Csapat versenyek
- **További történetek**: 7-8. osztály verziók
- **AI asszisztens**: Okosabb rejtvény generálás
- **Közösségi funkciók**: Eredmények megosztása

### Hosszú Távú (1+ év)
- **VR/AR támogatás**: Immersive élmény
- **Kiterjesztett valóság**: Mobil app verzió
- **Tanári dashboard**: Részletes analitika
- **API fejlesztés**: Más platformok integrációja

## Videó Technikai Specifikációk

### Videó Formátum Követelmények
- **Kiterjesztés**: .mp4 (H.264 codec)
- **Hang**: Külön audio csatorna (.mp3)
- **Hossz**: 30-90 másodperc videónként
- **Felbontás**: 1280x720 (HD)
- **Minőség**: Web optimalizált (2-5 MB per videó)
- **Képkocka**: 30 FPS

### Videó Lejátszás Kezelése
```javascript
class VideoSlidePlayer {
  constructor(videoElement, audioElement) {
    this.video = videoElement;
    this.audio = audioElement;
    this.currentSlide = 0;
    this.isPlaying = false;
  }
  
  playSlide(slideId) {
    // Videó és hang szinkronizálása
    this.video.src = `videos/grade${this.currentGrade}/station${slideId}.mp4`;
    this.audio.src = `audio/grade${this.currentGrade}/narration${slideId}.mp3`;
    
    this.video.play();
    this.audio.play();
    this.isPlaying = true;
  }
  
  onVideoEnd() {
    this.isPlaying = false;
    // "Tovább" gomb engedélyezése
    this.enableNextButton();
  }
}
```

### Slide Navigáció Rendszer
```javascript
class SlideNavigation {
  constructor() {
    this.currentSlide = 0;
    this.slides = [];
    this.videoPlayer = new VideoSlidePlayer();
  }
  
  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
      this.loadSlide(this.currentSlide);
    }
  }
  
  loadSlide(slideIndex) {
    const slide = this.slides[slideIndex];
    
    switch(slide.type) {
      case 'video':
        this.videoPlayer.playSlide(slide.videoId);
        break;
      case 'puzzle':
        this.showPuzzle(slide.puzzleData);
        break;
      case 'text':
        this.showText(slide.content);
        break;
    }
  }
}
```

## Következtetés

A "Digitális Kultúra Verseny" egy átgondolt, pedagógiailag megalapozott és technikailag megvalósítható projekt. A videó-alapú slide show megközelítés egyedülálló élményt nyújt, amely ötvözi a történetmesélést az interaktív tanulással.

A projekt sikeressége kulcsfontosságú elemei:
- **Videó-vezérelt narratíva**: A vizuális történetmesélés fokozza az elköteleződést
- **Slide-alapú interakció**: Egyszerű navigáció, diák logika
- **Fokozatos nehézség**: Minden évfolyam megfelelő kihívást kap
- **Technológiai hozzáférhetőség**: Webes platform, nincs telepítés szükséges
- **Mentési lehetőség**: A haladás nem vész el
- **Versenyelemek**: A motiváció fenntartása

A videó-alapú megközelítés különlegessé teszi a projektet a hagyományos oktatási szoftverekkel szemben, és valódi tanulási eredményeket biztosít a diákoknak, miközben felkészíti őket a digitális világ kihívásaira.

### Rejtvény Típusok és Évfolyam Elosztás

**📝 Megjegyzés**: A rejtvény típusok és évfolyam-elosztás még fejlesztés alatt áll. A projekt vezetője már kidolgozott konkrét feladatokat, de még nem véglegesítette a nehézségi elosztást.

#### Elérhető Rejtvény Típusok
- **Szöveges kérdések**: Több válasz opció
- **Vizuális puzzle**: Képek, színek, formák
- **Kódolási feladatok**: Bináris, algoritmusok
- **Memóriajátékok**: Szekvencia felidézés
- **Hangalapú rejtvények**: Hangfelismerés
- **Logikai puzzle**: Következtetés, rendszerlogika
- **Kreatív feladatok**: Innovatív megoldások
- **Kritikai gondolkodás**: Problémamegoldás

#### Évfolyam Specifikáció (Tervezés alatt)
- **3. osztály**: Alapvető szint (egyszerű feladatok)
- **4. osztály**: Közepes szint (bonyolultabb feladatok)
- **5. osztály**: Fejlett szint (összetett feladatok)
- **6. osztály**: Haladó szint (komplex feladatok)

#### Pontszámítás (Tervezés alatt)
- **Alap pontok**: Rejtvény típusonként eltérő
- **Bónusz pontok**: Teljesítmény alapján
- **Végső bónusz**: Teljes história befejezéséért

#### Következő Lépések
1. **Rejtvény típusok véglegesítése** évfolyamonként
2. **Pontszám rendszer** kalibrálása
3. **Feladat példák** készítése minden típushoz
4. **Pilot tesztelés** diákokkal

### Admin Dashboard Funkciók
- **Eredménylista**: Teljes rangsort
- **Osztály szűrés**: 3-6. osztály külön-külön
- **Exportálás**: CSV/PDF formátum
- **Statisztikák**: Részletes elemzés
  - Átlagos teljesítmény
  - Legnépszerűbb rejtvények
  - Haladási statisztikák
  - Időelemzés