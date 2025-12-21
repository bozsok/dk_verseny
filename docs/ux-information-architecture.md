# UX Tervezés: Információs Architektúra és Oldaltérkép
## Digitális Kultúra Verseny - Oktatási Játék Platform

---

## 🗺️ INFORMÁCIÓS ARCHITEKTÚRA ÁTTEKINTÉS

### Alapvető Architektúra Elvek
- **Egyszerűség**: Minimális navigációs szintek
- **Konzisztencia**: Egységes struktúra minden évfolyamnál
- **Logikai Haladás**: Lineáris játékmenet állomásokon keresztül
- **Hozzáférhetőség**: Gyors navigáció a fő funkciókhoz
- **Mentési Állapot**: Mindig visszatérhető pontok

---

## 🏗️ OLDALTÉRKÉP (SITE MAP)

```
DIGITÁLIS KULTÚRA VERSENY PLATFORM
│
├── 🏠 HUB (Főoldal)
│   ├── Évfolyam Választó (3-6. osztály)
│   │   ├── 3. osztály - A Kód Királyság Titka
│   │   ├── 4. osztály - A Rejtett Frissítés Kódja
│   │   ├── 5. osztály - A Töréspont Rejtélye
│   │   └── 6. osztály - A Fragmentumok Tükre
│   │
│   ├── Bejelentkezés (Admin/Tanár)
│   │   └── Tanár Dashboard
│   │       ├── Diákok Listája
│   │       ├── Haladási Statisztikák
│   │       ├── Eredménylista
│   │       └── Export Funkciók
│   │
│   └── Profil/Karakter
│       ├── Személyes Statisztikák
│       ├── Haladás Áttekintés
│       └── Beállítások
│
├── 📚 JÁTÉKMENET (Évfolyamonként)
│   ├── Regisztráció
│   │   ├── Név és Becenév
│   │   ├── Osztály Választás
│   │   └── Karakterválasztás (10 avatar)
│   │
│   ├── Történet Videók
│   │   ├── Nyitó Videó
│   │   ├── Állomás Videók (1-5)
│   │   └── Befejező Videó
│   │
│   ├── Interaktív Rejtvények
│   │   ├── Szöveges Kérdések
│   │   ├── Vizuális Puzzle
│   │   ├── Kódolási Feladatok
│   │   ├── Memóriajátékok
│   │   ├── Hangalapú Rejtvények
│   │   ├── Logikai Puzzle
│   │   ├── Kreatív Feladatok
│   │   └── Kritikai Gondolkodás
│   │
│   └── Haladás és Eredmények
│       ├── Pontszám Rendszer
│       ├── Kulcsok/Tárgyak Gyűjtése
│       ├── Állomás Haladás
│       └── Lokális Ranglista
│
├── 📊 ADMIN FUNKCIÓK (Csak Tanároknak)
│   ├── Dashboard
│   │   ├── Napi Aktív Diákok
│   │   ├── Osztály Teljesítmény Áttekintés
│   │   └── Rendszer Állapot
│   │
│   ├── Diákok Kezelése
│   │   ├── Diákok Listája
│   │   ├── Részletes Profil
│   │   ├── Haladási Jelentés
│   │   └── Teljesítmény Elemzés
│   │
│   ├── Statisztikák és Jelentések
│   │   ├── Átlagos Teljesítmény
│   │   ├── Legnépszerűbb Rejtvények
│   │   ├── Időelemzés
│   │   └── Haladási Grafikonok
│   │
│   └── Export és Megosztás
│       ├── CSV Export
│       ├── PDF Jelentések
│       └── Email Küldés
│
└── ⚙️ TECHNIKAI ÉS TÁMOGATÁS
    ├── Súgó és Útmutató
    │   ├── Diák Útmutató
    │   ├── Tanár Kézikönyv
    │   └── GYIK
    │
    ├── Technikai Követelmények
    │   ├── Böngésző Támogatás
    │   ├── Eszköz Követelmények
    │   └── Hálózati Követelmények
    │
    └── Kapcsolat és Támogatás
        ├── Kapcsolatfelvételi Űrlap
        ├── Technikai Támogatás
        └── Hibabejelentés
```

---

## 🔄 FELHASZNÁLÓI FOLYAMOK (USER FLOWS)

### Diák Felhasználói Folyamok

#### 1. Első Használat Folyam
```
HUB → Regisztráció → Karakterválasztás → Első Évfolyam → Nyitó Videó → Első Rejtvény
```
**Lépések:**
1. **HUB elérése** → Évfolyam kiválasztása
2. **Regisztráció** → Név, becenév, osztály megadása
3. **Karakterválasztás** → 10 avatar közül választás
4. **Első évfolyam** → Automatikus átirányítás
5. **Nyitó videó** → Történet bemutatása
6. **Első rejtvény** → Interaktív tanulás
7. **Haladás mentése** → Automatikus LocalStorage

#### 2. Játék Folytatása Folyam
```
HUB → Évfolyam Kiválasztás → Folytatás Gomb → Utolsó Állomás → Továbblépés
```
**Lépések:**
1. **HUB elérése** → Korábbi évfolyam kiválasztása
2. **Mentett állapot** → Automatikus betöltés
3. **Folytatás** → "Folytatás" gomb aktiválása
4. **Utolsó állomás** → Visszatérés a jelenlegi helyzethez
5. **Továbblépés** → Következő rejtvény vagy videó

#### 3. Történet Befejezése Folyam
```
Évfolyam → Állomások (1-5) → Végső Videó → Pontszám Összesítés → Ranglista
```
**Lépések:**
1. **Évfolyam kiválasztása** → Befejezendő történet
2. **Állomások teljesítése** → Mind az 5 állomás
3. **Végső kihívás** → Összesítő rejtvény
4. **Befejező videó** → Történet lezárása
5. **Pontszám összesítés** → Végső eredmény
6. **Ranglista frissítés** → Osztályon belüli pozíció

#### 4. Haladás Megtekintése Folyam
```
Profil → Személyes Statisztikák → Részletes Eredmények → Ranglista
```
**Lépések:**
1. **Profil elérése** → Karakter profil
2. **Statisztikák megtekintése** → Összesített adatok
3. **Részletes eredmények** → Évfolyamonkénti teljesítmény
4. **Ranglista** → Osztályon belüli összehasonlítás

---

### Tanár Felhasználói Folyamok

#### 1. Első Belépés Folyam
```
HUB → Bejelentkezés → Tanár Dashboard → Diákok Lista → Pilot Beállítás
```
**Lépések:**
1. **HUB elérése** → "Bejelentkezés" gomb
2. **Admin azonosítás** → Tanár jogosultság
3. **Dashboard betöltés** → Áttekintő képernyő
4. **Diákok lista** → Regisztrált diákok megtekintése
5. **Pilot beállítás** → Osztályok és csoportok létrehozása

#### 2. Diák Haladás Követés Folyam
```
Dashboard → Diák Lista → Részletes Profil → Haladási Jelentés → Export
```
**Lépések:**
1. **Dashboard** → Általános áttekintés
2. **Diák kiválasztása** → Lista böngészése
3. **Részletes profil** → Egyéni teljesítmény
4. **Haladási jelentés** → Részletes elemzés
5. **Exportálás** → CSV/PDF formátum

#### 3. Osztály Elemzés Folyam
```
Dashboard → Osztály Szűrő → Aggregált Statisztikák → Jelentés Készítés
```
**Lépések:**
1. **Osztály szűrő** → 3-6. osztály kiválasztása
2. **Aggregált statisztikák** → Csoportos teljesítmény
3. **Jelentés készítés** → Tantervi megfelelőség
4. **Megosztás** → Vezetőségnek és kollégáknak

---

### IT Koordinátor Felhasználói Folyamok

#### 1. Technikai Értékelés Folyam
```
Platform Áttekintés → Technikai Követelmények → Kompatibilitás Teszt → Biztonság Értékelés
```
**Lépések:**
1. **Platform áttekintés** → Funkciók és jellemzők
2. **Technikai követelmények** → Infrastruktúra igények
3. **Kompatibilitás teszt** → Böngésző és eszköz támogatás
4. **Biztonság értékelés** → GDPR és adatvédelem
5. **Jóváhagyási javaslat** → Vezetőségnek

---

## 📱 KÉPERNYŐ HIERARCHIA

### Szint 1: Fő Navigációs Képernyők

#### 1.1 HUB (Főoldal)
```
┌─────────────────────────────────────────┐
│  DIGITÁLIS KULTÚRA VERSENY              │
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

#### 1.2 Regisztráció Képernyő
```
┌─────────────────────────────────────────┐
│          ÜDVÖZÖLLEK KÓDMESTER!          │
│                                         │
│ Név: [____________________]            │
│ Becenév: [____________________]         │
│ Osztály: [3] [4] [5] [6]                │
│                                         │
│        [TOVÁBB A KARAKTERVÁLASZTÁSHOZ]  │
└─────────────────────────────────────────┘
```

#### 1.3 Karakterválasztó Képernyő
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

---

### Szint 2: Játékmenet Képernyők

#### 2.1 Videó Lejátszás Képernyő
```
┌─────────────────────────────────────────┐
│ Kód Királyság - 3. osztály             │
│ Pontok: 1250 | Állomás: 2/5            │
├─────────────────────────────────────────┤
│                                         │
│ ┌─ Videó Lejátszás ────────────────────┐ │
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

#### 2.2 Rejtvény Képernyő
```
┌─────────────────────────────────────────┐
│ Kód Királyság - 3. osztály             │
│ Pontok: 1250 | Állomás: 2/5            │
├─────────────────────────────────────────┤
│                                         │
│ ┌─ Történet Kontextus ─────────────────┐ │
│ │ A varázsló varázsereje segítségével │ │
│ │ megnyithatod az első kaput...       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─ Rejtvény ──────────────────────────┐ │
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

#### 2.3 Haladás és Eredmények Képernyő
```
┌─────────────────────────────────────────┐
│          SZEMÉLYES STATISZTIKÁK         │
│                                         │
│ Összes Pontszám: 3,750                  │
│ Befejezett Évfolyamok: 2/4              │
│                                    [   ] │
│ ┌─────────────────────────────────────┐ │
│ │ 3. OSZTÁLY: ✓ BEFEJEZVE             │ │
│ │ 4. OSZTÁLY: ●●●○○ ÁLLOMÁS (3/5)     │ │
│ │ 5. OSZTÁLY: ○○○○○ ÁLLOMÁS (0/5)     │ │
│ │ 6. OSZTÁLY: ○○○○○ ÁLLOMÁS (0/5)     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [PROFIL SZERKESZTÉSE] [RANGLISTA]       │
└─────────────────────────────────────────┘
```

---

### Szint 3: Admin/Tanár Képernyők

#### 3.1 Tanár Dashboard
```
┌─────────────────────────────────────────┐
│          TANÁR DASHBOARD                │
│                                         │
│ Napi Aktív Diákok: 28                   │
│ Átlagos Teljesítmény: 85%               │
│─────────────────────────────────────────│
│ ┌─ OSZTÁLY TELJESÍTMÉNY ──────────────┐ │
│ │ 3.A: 87% | 3.B: 82% | 4.A: 91%      │ │
│ │ 4.B: 78% | 5.A: 89% | 5.B: 84%      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [DIAKOK LISTÁJA] [STATISZTIKÁK]         │
│ [EXPORTÁLÁS] [JELENTÉSEK]               │
└─────────────────────────────────────────┘
```

#### 3.2 Diákok Lista Képernyő
```
┌─────────────────────────────────────────┐
│              DIAKOK LISTÁJA             │
│                                         │
│ Szűrés: [Összes osztály ▼] [Teljesítmény ▼] │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Nagy Anna (3.A) - 3,750 pont        │ │
│ │ Kovács Péter (3.B) - 3,200 pont     │ │
│ │ Szabó Mária (4.A) - 2,850 pont      │ │
│ │ Tóth Gábor (5.A) - 4,100 pont       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [EXPORTÁLÁS] [ÚJ DIAK HOZZÁADÁSA]       │
└─────────────────────────────────────────┘
```

#### 3.3 Részletes Diák Profil
```
┌─────────────────────────────────────────┐
│         NAGY ANNA PROFIL                │
│                                         │
│ Becenév: Anna | Osztály: 3.A            │
│─────────────────────────────────────────│
│ ┌─ TELJESÍTMÉNY ÁTTEKINTÉS ───────────┐ │
│ │ 3. osztály: ✓ BEFEJEZVE (4,500 pont)│ │
│ │ 4. osztály: ●●●○○ (2,750 pont)      │ │
│ │ 5. osztály: ○○○○○ (0 pont)          │ │
│ │ 6. osztály: ○○○○○ (0 pont)          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─ KEDVENC REJTVÉNYEK ────────────────┐ │
│ │ 1. Vizuális Puzzle (95% megoldás)   │ │
│ │ 2. Logikai Feladat (88% megoldás)   │ │
│ │ 3. Kódolási Feladat (76% megoldás)  │ │
│ └─────────────────────────────────────┘ │
│VISSZA                                         │
│ [ A LISTÁHOZ] [EXPORTÁLÁS]        │
└─────────────────────────────────────────┘
```

---

## 🧭 NAVIGÁCIÓS MINTÁK

### Globális Navigáció
- **HUB vissza gomb**: Mindig elérhető, bal felső sarok
- **Profil menü**: Jobb felső sarok (karakter ikon)
- **Progressz sáv**: Minden játékmenet képernyőn
- **Mentés állapot**: Automatikus, vizuális visszajelzés

### Kontextuális Navigáció
- **Tovább gomb**: Videó befejezése után aktiválódik
- **Vissza gomb**: Korábbi állomásra visszalépés
- **Navigációs kör**: Állomások közötti gyors ugrás
- **Kerés funkció**: Rejtvény típusok szerint

### Hozzáférhetőség Navigáció
- **Tab navigáció**: Billentyűzet használat támogatása
- **Screen reader**: Képernyőolvasó optimalizálás
- **Nagy kontraszt**: Látáskárosodott felhasználóknak
- **Nagy gombok**: Érintés-barát vezérlők

---

## 📋 TARTALOM SZERVEZÉS

### Történet Struktúra Évfolyamonként

#### 3. Osztály: "A Kód Királyság Titka"
```
1. Tudás Torony - Informatikai alapfogalmak
2. Pixel Palota - Digitális mozaik puzzle
3. Labirintuskert - Vizuális útvesztő
4. Hangerdő - Hangüzenet dekódolás
5. Adat-tenger - Alapvető kódok megfejtése
VÉGSŐ: Nagy Zár - 5 kulcs összekapcsolása
```

#### 4. Osztály: "A Rejtett Frissítés Kódja"
```
1. Rendszernaplók Temploma - Időrendi sorrend
2. Futtatókör - Mozgó platformok navigálás
3. Töréspont-híd - Hibás fájlblokk felismerés
4. Kernel-pajzs Galéria - Logikai kapuk
5. Reboot-sivatag - Szunnyadó modulok
VÉGSŐ: Magrendszer Kamrája - Időzített rendszer
```

#### 5. Osztály: "A Töréspont Rejtélye"
```
1. Kódvár - Hibás sorminták javítása
2. Színszektor - Holografikus térben navigálás
3. Töredezett Képernyő - Vizuális mozaik visszaállítás
4. Meta-horizont - Adathalmazok kapcsolatai
5. Zajzóna - Zavarjelek közti utasítások
VÉGSŐ: Töréspont Kapuja - DNS rekonstrukció
```

#### 6. Osztály: "A Fragmentumok Tükre"
```
1. Tükrözött Archívum - Eredeti vs. tükrözött adatok
2. Széthasadt Memóriamező - Darabokra szaggatott emlékek
3. Időpuffer-barlang - Töredékes időrétegek
4. Reflexiós Lépcsőház - Tükörképes választások
5. Kódfelhő Zóna - Sodródó bináris tömbök
VÉGSŐ: Szinkrontükör Csarnoka - Tükörkód szerkezet
```

### Rejtvény Típusok Hierarchiája

#### Alapvető Szint (3. osztály)
- **Szöveges kérdések**: Egyszerű több válasz opció
- **Vizuális puzzle**: Színek és formák felismerése
- **Memóriajátékok**: Egyszerű szekvencia felidézés

#### Közepes Szint (4. osztály)
- **Kódolási feladatok**: Bináris és algoritmusok
- **Logikai puzzle**: Következtetés és rendszerlogika
- **Hangalapú rejtvények**: Ritmus és dallam felismerés

#### Haladó Szint (5-6. osztály)
- **Kreatív feladatok**: Innovatív megoldások
- **Kritikai gondolkodás**: Komplex problémamegoldás
- **Meta-gondolkodás**: Rendszer szintű megértés

---

## 🎯 INFORMÁCIÓS ARCHITEKTÚRA PRINCIPES

### 1. Felhasználó Központúság
- Minden navigációs elem a diákok igényeit szolgálja
- Tanár funkciók külön, de könnyen elérhető helyen
- Minimális kognitív terhelés

### 2. Logikai Haladás
- Lineáris játékmenet állomásokon keresztül
- Mindig világos, hogy hol van a felhasználó
- Könnyű visszakeresés és folytatás

### 3. Méretezhetőség
- Új évfolyamok könnyen hozzáadhatók
- Rejtvény típusok bővíthetők
- Admin funkciók skálázhatók

### 4. Technikai Optimalizálás
- LocalStorage alapú mentés
- Gyors betöltési idők
- Cross-browser kompatibilitás

---

*Ez az információs architektúra dokumentum a Digitális Kultúra Verseny platform felhasználói élményének alapját képezi, biztosítva az intuitív navigációt és hatékony információ szervezést minden felhasználói típus számára.*