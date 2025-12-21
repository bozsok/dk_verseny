# DIGITÁLIS KULTÚRA VERSENY - EPIKUSOK ÉS USER STORY-K

## 📋 Áttekintés

Ez a dokumentum tartalmazza a Digitális Kultúra Verseny projekt összes epikusát és hozzá tartozó user story-jait magyar nyelven. Az epikusok a nagyobb üzleti funkciókat reprezentálják, míg a user story-k konkrét felhasználói igényeket írnak le.

---

## 🎮 1. FELHASZNÁLÓI REGISZTRÁCIÓ ÉS PROFILKEZELÉS

### Epic 1.1: Diák Regisztrációs Rendszer
**Üzleti érték**: A diákok könnyedén regisztrálhatnak és elkezdhetik a játékot
**Prioritás**: Magas

#### User Story 1.1.1: Első alkalommal regisztráló diák
**Mint** diák,  
**Szeretnék** regisztrálni a játékba,  
**Hogy** elkezdhessem a kalandot a Kód Királyságban.

**Elfogadási kritériumok:**
- [ ] Regisztrációs űrlap név, becenév, osztály megadásával
- [ ] Becenév validáció (egyedi, 3-20 karakter)
- [ ] Osztály választás (3, 4, 5, 6)
- [ ] Automatikus mentés LocalStorage-ba
- [ ] Sikeres regisztráció után üdvözlő üzenet

#### User Story 1.1.2: Karakterválasztás
**Mint** diák,  
**Szeretnék** választani egy karaktert,  
**Hogy** személyre szabhassam a játékélményt.

**Elfogadási kritériumok:**
- [ ] 10 különböző karakter avatar megjelenítése
- [ ] Karakterek: Varázsló, Tűz-orák, Tündér, Szellem, Vámpír, Sárkány stb.
- [ ] Preview funkció karakter kiválasztásakor
- [ ] Választás mentése profilba
- [ ] Későbbi módosítási lehetőség

#### User Story 1.1.3: Profil adatok kezelése
**Mint** diák,  
**Szeretnék** megtekinteni és szerkeszteni a profilomat,  
**Hogy** naprakész információkat tartsak.

**Elfogadási kritériumok:**
- [ ] Profil adatok megtekintése
- [ ] Becenév módosítása
- [ ] Karakter váltás lehetősége
- [ ] Osztály módosítása (korlátozott)
- [ ] Adatok mentése LocalStorage-ba

---

## 🏠 2. HUB NAVIGÁCIÓ ÉS ÉVFOLYAM VÁLASZTÁS

### Epic 2.1: Központi Hub Rendszer
**Üzleti érték**: A diákok könnyen navigálhatnak a különböző évfolyamok között
**Prioritás**: Magas

#### User Story 2.1.1: Hub főoldal megtekintése
**Mint** diák,  
**Szeretnék** látni a központi hub-ot,  
**Hogy** válasszak évfolyamot vagy folytassam a játékot.

**Elfogadási kritériumok:**
- [ ] 4 évfolyam kártya megjelenítése (3-6. osztály)
- [ ] Minden kártyán: osztály neve, rövid leírás, haladás állapot
- [ ] "Bejelentkezés" gomb tanárok számára
- [ ] Progress bar minden évfolyamnál
- [ ] Reszponzív design tablet és desktop-on

#### User Story 2.1.2: Évfolyam választás
**Mint** diák,  
**Szeretnék** kiválasztani egy évfolyamot,  
**Hogy** elkezdhessem vagy folytathassam a tanulást.

**Elfogadási kritériumok:**
- [ ] Évfolyam kártyára kattintás
- [ ] Haladás állapot ellenőrzése
- [ ] Automatikus átirányítás a megfelelő állomásra
- [ ] Ha új évfolyam: intro videó automatikus indítása
- [ ] Ha folytatás: utolsó állomás visszatöltése

#### User Story 2.1.3: Haladás állapot megjelenítése
**Mint** diák,  
**Szeretnék** látni a haladásomat minden évfolyamban,  
**Hogy** motivált legyek a befejezéshez.

**Elfogadási kritériumok:**
- [ ] Progress bar minden évfolyam kártyán
- [ ] Befejezett állomások száma (pl. "3/5 állomás")
- [ ] Összegyűjtött pontok megjelenítése
- [ ] Utolsó játék dátum
- [ ] Státusz ikonok (befejezve, folyamatban, új)

---

## 🎬 3. VIDEO-ALAPÚ TÖRTÉNETMESÉLÉS

### Epic 3.1: Video Player Rendszer
**Üzleti érték**: A diákok élvezetes, vizuális történeteket nézhetnek
**Prioritás**: Magas

#### User Story 3.1.1: Videó lejátszás
**Mint** diák,  
**Szeretnék** videókat nézni a történetről,  
**Hogy** megértsem a kontextust a rejtvények előtt.

**Elfogadási kritériumok:**
- [ ] HTML5 video player használata
- [ ] Alapvető vezérlők: play, pause, stop, hangerő
- [ ] Fullscreen opció
- [ ] Progress bar megjelenítése
- [ ] Külön hangcsatorna szinkronizálása

#### User Story 3.1.2: Automatikus navigáció videók után
**Mint** diák,  
**Szeretnék** automatikusan továbblépni a videó befejezése után,  
**Hogy** zökkenőmentes legyen a játékmenet.

**Elfogadási kritériumok:**
- [ ] Videó befejezése észlelése
- [ ] "Tovább" gomb automatikus aktiválása
- [ ] 3 másodperces késleltetés a videó végén
- [ ] Manuális visszanézés lehetősége
- [ ] Automatikus mentés videó pozícióban

#### User Story 3.1.3: Progress tracking videókon
**Mint** diák,  
**Szeretnék** látni hol tartok a történetben,  
**Hogy** tudjam mennyi van még hátra.

**Elfogadási kritériumok:**
- [ ] Jelenlegi állomás megjelenítése (pl. "2/5 állomás")
- [ ] Összes állomás progress bar
- [ ] Történet címe és rövid leírása
- [ ] Becenév és karakter megjelenítése
- [ ] Jelenlegi pontszám

---

## 🧩 4. INTERAKTÍV REJTVÉNYEK ÉS JÁTÉKMENET

### Epic 4.1: Rejtvény Rendszer
**Üzleti érték**: A diákok változatos, szórakoztató feladatokon keresztül tanulnak
**Prioritás**: Magas

#### User Story 4.1.1: Szöveges kérdések megoldása
**Mint** diák,  
**Szeretnék** szöveges kérdésekre válaszolni,  
**Hogy** teszteljem a tudásomat.

**Elfogadási kritériumok:**
- [ ] Több válasz opció megjelenítése (A, B, C)
- [ ] Nagy, touch-friendly gombok
- [ ] Azonnali visszajelzés helyes/hibás válaszról
- [ ] Magyarázat helyes válasz esetén
- [ ] Pontszám számítás (25 pont alap)

#### User Story 4.1.2: Vizuális puzzle megoldása
**Mint** diák,  
**Szeretnék** vizuális puzzle-t megoldani,  
**Hogy** fejlesszem a logikai gondolkodásomat.

**Elfogadási kritériumok:**
- [ ] Képek, színek, formák használata
- [ ] Drag & drop vagy kattintásos interakció
- [ ] Vizuális visszajelzés (zöld/piros keret)
- [ ] Időkorlát nélküli megoldás
- [ ] Pontszám számítás (50 pont alap)

#### User Story 4.1.3: Kódolási feladatok megoldása
**Mint** diák,  
**Szeretnék** egyszerű kódolási feladatokat megoldani,  
**Hogy** megértsem a programozás alapjait.

**Elfogadási kritériumok:**
- [ ] Bináris számok, algoritmusok
- [ ] Szekvenciális programozás fogalmai
- [ ] Vizuális programozási blokkok
- [ ] Helyes sorrend felismerése
- [ ] Pontszám számítás (75 pont alap)

#### User Story 4.1.4: Memóriajátékok
**Mint** diák,  
**Szeretnék** memóriajátékot játszani,  
**Hogy** fejlesszem a memóriámat.

**Elfogadási kritériumok:**
- [ ] Szekvencia felidézés
- [ ] Képek, hangok, színek memorizálása
- [ ] Növekvő nehézségi szint
- [ ] Hint opció korlátozott számban
- [ ] Pontszám számítás (35 pont alap)

#### User Story 4.1.5: Pontszám és bónusz rendszer
**Mint** diák,  
**Szeretnék** pontokat gyűjteni a rejtvények megoldásáért,  
**Hogy** motivált legyek és versenyezzek.

**Elfogadási kritériumok:**
- [ ] Alap pontszám rejtvény típusonként (25-80 pont)
- [ ] Gyors teljesítés bónusz (+50 pont)
- [ ] Kreatív megoldás bónusz (+25 pont)
- [ ] Teljes történet bónusz (+500 pont)
- [ ] Valós idejű pontszám megjelenítés

---

## 💾 5. HALADÁS MENTÉSE ÉS STATISZTIKÁK

### Epic 5.1: Játékállás Mentési Rendszer
**Üzleti érték**: A diákok haladása nem vész el, bármikor folytathatják
**Prioritás**: Közepes

#### User Story 5.1.1: Automatikus mentés
**Mint** diák,  
**Szeretnék**, hogy a haladásom automatikusan elmentésre kerüljön,  
**Hogy** ne veszítsem el a munkámat.

**Elfogadási kritériumok:**
- [ ] Minden állomás végén automatikus mentés
- [ ] LocalStorage használata adatmentéshez
- [ ] JSON formátumú mentés
- [ ] Mentési állapot visszajelzés
- [ ] Hiba esetén retry mechanizmus

#### User Story 5.1.2: Játék folytatása
**Mint** diák,  
**Szeretnék** folytatni egy korábban megkezdett játékot,  
**Hogy** időben befejezhessem a történetet.

**Elfogadási kritériumok:**
- [ ] Hub-on "Folytatás" gomb
- [ ] Automatikus átirányítás az utolsó állomásra
- [ ] Előző videó visszajátszás opció
- [ ] Haladás visszatöltése LocalStorage-ból
- [ ] Adatok konzisztencia ellenőrzése

#### User Story 5.1.3: Személyes statisztikák
**Mint** diák,  
**Szeretnék** látni a saját teljesítményemet,  
**Hogy** tudjam, hogyan fejlődöm.

**Elfogadási kritériumok:**
- [ ] Összes pontszám megjelenítése
- [ ] Befejezett évfolyamok listája
- [ ] Legnépszerűbb rejtvény típusok
- [ ] Összes játékidő
- [ ] Átlagos pontszám rejtvényenként

#### User Story 5.1.4: Helyi ranglista
**Mint** diák,  
**Szeretnék** látni az osztálytársaim eredményeit,  
**Hogy** versenyezzek velük.

**Elfogadási kritériumok:**
- [ ] Top 10 diák lista az osztályból
- [ ] Becenév alapú megjelenítés
- [ ] Pontszám és évfolyam információ
- [ ] Saját pozíció kiemelése
- [ ] Rangsor frissítése real-time

---

## 👩‍🏫 6. TANÁR/ADMIN DASHBOARD ÉS ELEMZÉS

### Epic 6.1: Tanári Felügyeleti Rendszer
**Üzleti érték**: A tanárok nyomon követhetik diákjaik haladását és elemezhetik az eredményeket
**Prioritás**: Közepes

#### User Story 6.1.1: Admin bejelentkezés
**Mint** tanár,  
**Szeretnék** bejelentkezni az admin felületre,  
**Hogy** hozzáférjek a diákok adataihoz.

**Elfogadási kritériumok:**
- [ ] Egyszerű bejelentkezési űrlap
- [ ] Admin jogosultság ellenőrzése
- [ ] Session kezelés
- [ ] Biztonságos kijelentkezés
- [ ] Visszajelzés sikeres bejelentkezésről

#### User Story 6.1.2: Diákok listájának megtekintése
**Mint** tanár,  
**Szeretnék** látni az összes diákomat egy listában,  
**Hogy** áttekintsem a teljesítményüket.

**Elfogadási kritériumok:**
- [ ] Táblázatos megjelenítés
- [ ] Diák neve, osztálya, pontszáma
- [ ] Haladás állapota évfolyamonként
- [ ] Legutóbbi aktivitás dátuma
- [ ] Reszponzív design

#### User Story 6.1.3: Szűrési és rendezési funkciók
**Mint** tanár,  
**Szeretnék** szűrni és rendezni a diákokat,  
**Hogy** megtaláljam a konkrét információkat.

**Elfogadási kritériumok:**
- [ ] Osztály szerinti szűrés (3-6. osztály)
- [ ] Teljesítmény szerinti rendezés
- [ ] Dátumtartomány szűrés
- [ ] Haladás állapot szűrés
- [ ] Keresés becenév alapján

#### User Story 6.1.4: Export funkciók
**Mint** tanár,  
**Szeretnék** exportálni az eredményeket,  
**Hogy** használhassam őket további elemzésekhez.

**Elfogadási kritériumok:**
- [ ] CSV formátum export
- [ ] PDF formátum export
- [ ] Kiválasztott diákok exportálása
- [ ] Teljes adatok exportálása
- [ ] Excel kompatibilis formátum

#### User Story 6.1.5: Aggregált statisztikák
**Mint** tanár,  
**Szeretnék** aggregált statisztikákat látni,  
**Hogy** átfogó képet kapjak a teljesítményről.

**Elfogadási kritériumok:**
- [ ] Osztály átlagos pontszám
- [ ] Legnépszerűbb rejtvény típusok
- [ ] Teljesítmény eloszlás grafikon
- [ ] Haladási statisztikák időtengelyen
- [ ] Interaktív dashboard

---

## 📚 7. ÉVFOLYAM-SPECIFIKUS TARTALMAK

### Epic 7.1: 3. Osztály Történet - "A Kód Királyság Titka"
**Üzleti érték**: A legfiatalabb diákok egyszerű, színes kalandban tanulhatnak
**Prioritás**: Magas

#### User Story 7.1.1: 3. osztály intro videó
**Mint** 3. osztályos diák,  
**Szeretnék** egy bevezető videót látni,  
**Hogy** megértsem a történetet és a szerepemet.

**Elfogadási kritériumok:**
- [ ] 60-90 másodperces intro videó
- [ ] Egyszerű, érthető narráció
- [ ] Színes, vonzó grafika
- [ ] Karakterek bemutatása
- [ ] Küldetés elmagyarázása

#### User Story 7.1.2: Tudás Torony állomás
**Mint** 3. osztályos diák,  
**Szeretnék** az első állomáson rejtvényt megoldani,  
**Hogy** megszerezzem az első kulcsot.

**Elfogadási kritériumok:**
- [ ] Informatikai alapfogalmak rejtvény
- [ ] Egyszerű igaz/hamis kérdések
- [ ] Színes ikonok használata
- [ ] Nagy UI elemek (touch-friendly)
- [ ] 25-50 pont szerezhető

#### User Story 7.1.3: Pixel Palota állomás
**Mint** 3. osztályos diák,  
**Szeretnék** vizuális puzzle-t megoldani,  
**Hogy** fejlesszem a vizuális gondolkodásomat.

**Elfogadási kritériumok:**
- [ ] Digitális mozaik puzzle
- [ ] Színkódok felismerése
- [ ] Egyszerű mintázatok
- [ ] Drag & drop interakció
- [ ] 50 pont szerezhető

#### User Story 7.1.4: Labirintuskert állomás
**Mint** 3. osztályos diák,  
**Szeretnék** vizuális útvesztőben navigálni,  
**Hogy** megtaláljam a helyes utat.

**Elfogadási kritériumok:**
- [ ] Egyszerű irányítási feladatok
- [ ] Nyilak és szimbólumok használata
- [ ] Vizuális útvesztő
- [ ] Hint opció
- [ ] 40 pont szerezhető

#### User Story 7.1.5: Hangerdő állomás
**Mint** 3. osztályos diák,  
**Szeretnék** hangüzeneteket dekódolni,  
**Hogy** megtanuljam a hangok jelentését.

**Elfogadási kritériumok:**
- [ ] Hangfelismerés alapú rejtvény
- [ ] Ritmus és dallam felismerés
- [ ] Sonora karakter segítsége
- [ ] Audio kontrollok
- [ ] 40 pont szerezhető

#### User Story 7.1.6: Adat-tenger állomás
**Mint** 3. osztályos diák,  
**Szeretnék** alapvető kódokat megfejteni,  
**Hogy** befejezzem a kalandomat.

**Elfogadási kritériumok:**
- [ ] Egyszerű szöveges üzenetek
- [ ] Vizuális kódok
- [ ] Alapvető kódok megfejtése
- [ ] Összes eddigi tudás alkalmazása
- [ ] 60 pont szerezhető

#### User Story 7.1.7: Nagy Zár végső küzdelem
**Mint** 3. osztályos diák,  
**Szeretnék** legyőzni az Árnyporgramot,  
**Hogy** megmenthessem a Királyságot.

**Elfogadási kritériumok:**
- [ ] Az 5 kulcs összekapcsolása
- [ ] Egyszerű logikai műveletek
- [ ] Végső konfrontáció
- [ ] Diadalmas befejezés
- [ ] 500 pont bónusz + tanúsítvány

### Epic 7.2: 4. Osztály Történet - "A Rejtett Frissítés Kódja"
**Üzleti érték**: A diákok összetettebb logikai feladatokat oldhatnak meg
**Prioritás**: Közepes

#### User Story 7.2.1: Rendszernaplók Temploma
**Mint** 4. osztályos diák,  
**Szeretnék** naplóbejegyzéseket időrendi sorrendbe rendezni,  
**Hogy** megtaláljam a hibát.

**Elfogadási kritériumok:**
- [ ] Naplóbejegyzések időrendi sorrendezése
- [ ] Hibakeresés logikai sorozatokban
- [ ] Anomália felismerése
- [ ] Drag & drop rendezés
- [ ] 60 pont szerezhető

#### User Story 7.2.2: Futtatókör
**Mint** 4. osztályos diák,  
**Szeretnék** kódútvonalon navigálni,  
**Hogy** helyesen futtassam a programot.

**Elfogadási kritériumok:**
- [ ] Mozgó platformokon való navigálás
- [ ] Kódútvonalak helyes lefuttatása
- [ ] Időnyomás alatti logikai döntések
- [ ] Animált környezet
- [ ] 70 pont szerezhető

#### User Story 7.2.3: Töréspont-híd
**Mint** 4. osztályos diák,  
**Szeretnék** hibás fájlblokkokat felismerni,  
**Hogy** helyreállítsam a rendszert.

**Elfogadási kritériumok:**
- [ ] Hibás vs. helyes fájlblokkok megkülönböztetése
- [ ] Hasznos vs. káros adatok azonosítása
- [ ] Adatátviteli protokollok megértése
- [ ] Vizuális összehasonlítás
- [ ] 75 pont szerezhető

#### User Story 7.2.4: Kernel-pajzs Galéria
**Mint** 4. osztályos diák,  
**Szeretnék** logikai kapukkal dolgozni,  
**Hogy** megértsem a programozás alapjait.

**Elfogadási kritériumok:**
- [ ] Logikai kapuk (ÉS, VAGY, NEM)
- [ ] Holografikus védelmi algoritmusok
- [ ] Parancssorok dekódolása
- [ ] Interaktív logikai kapuk
- [ ] 80 pont szerezhető

#### User Story 7.2.5: Reboot-sivatag
**Mint** 4. osztályos diák,  
**Szeretnék** szunnyadó modulokat újraéleszteni,  
**Hogy** stabilizáljam a rendszert.

**Elfogadási kritériumok:**
- [ ] Szunnyadó modulok aktiválása
- [ ] Ritmikus kódsorok
- [ ] Memóriahívások
- [ ] Zenei ritmus alapú kódolás
- [ ] 65 pont szerezhető

### Epic 7.3: 5. Osztály Történet - "A Töréspont Rejtélye"
**Üzleti érték**: A diákok algoritmikus gondolkodást és komplex problémamegoldást tanulnak
**Prioritás**: Közepes

#### User Story 7.3.1: Kódvár
**Mint** 5. osztályos diák,  
**Szeretnék** hibás sormintákat felismerni és javítani,  
**Hogy** megtaláljam a probléma gyökerét.

**Elfogadási kritériumok:**
- [ ] Hibás sorminták felismerése
- [ ] Programozási logikai csapdák
- [ ] Algoritmikus gondolkodás
- [ ] Kód szintaxis javítása
- [ ] 75 pont szerezhető

#### User Story 7.3.2: Színszektor
**Mint** 5. osztályos diák,  
**Szeretnék** holografikus térben navigálni,  
**Hogy** dekódoljam a színes bináris jelzéseket.

**Elfogadási kritériumok:**
- [ ] 3D holografikus tér
- [ ] Színes bináris jelzések dekódolása
- [ ] Színkombinációk és sorrend felismerése
- [ ] Interaktív 3D navigáció
- [ ] 80 pont szerezhető

#### User Story 7.3.3: Töredezett Képernyő
**Mint** 5. osztályos diák,  
**Szeretnék** vizuális mozaikot visszaállítani,  
**Hogy** helyreállítsam a rendszer eredeti megjelenését.

**Elfogadási kritériumok:**
- [ ] Hiányzó részletek kiegészítése
- [ ] Vizuális mozaik visszaállítása
- [ ] Rendszer eredeti megjelenésének rekonstruálása
- [ ]拼图 jellegű interakció
- [ ] 70 pont szerezhető

#### User Story 7.3.4: Meta-horizont
**Mint** 5. osztályos diák,  
**Szeretnék** adathalmazok közötti kapcsolatokat megérteni,  
**Hogy** megoldjam a komplex rejtvényt.

**Elfogadási kritériumok:**
- [ ] Adathalmazok közötti kapcsolatok
- [ ] Valódi vs. ál-logikai összefüggések
- [ ] Hálózati kombinációk
- [ ] Gráf alapú vizualizáció
- [ ] 85 pont szerezhető

#### User Story 7.3.5: Zajzóna
**Mint** 5. osztályos diák,  
**Szeretnék** zavarjelek közti utasításokat megtalálni,  
**Hogy** áthaladjak a zónán.

**Elfogadási kritériumok:**
- [ ] Zavarjelek közti utasítások
- [ ] Figyelem és kitartás próbája
- [ ] Ritmusérzék és szétválasztás
- [ ] Audio vizuális interferencia
- [ ] 75 pont szerezhető

### Epic 7.4: 6. Osztály Történet - "A Fragmentumok Tükre"
**Üzleti érték**: A legidősebb diákok haladó programozási koncepciókat tanulnak
**Prioritás**: Alacsony

#### User Story 7.4.1: Tükrözött Archívum
**Mint** 6. osztályos diák,  
**Szeretnék** eredeti vs. tükrözött adatokat megkülönböztetni,  
**Hogy** megtaláljam a valódi információkat.

**Elfogadási kritériumok:**
- [ ] Eredeti vs. tükrözött adatok megkülönböztetése
- [ ] Hatalmas adatlabirintus navigálása
- [ ] Információ hitelességének ellenőrzése
- [ ] Tükrözött szöveg felismerése
- [ ] 80 pont szerezhető

#### User Story 7.4.2: Széthasadt Memóriamező
**Mint** 6. osztályos diák,  
**Szeretnék** darabokra szaggatott emlékeket összeilleszteni,  
**Hogy** rekonstruáljam a történetet.

**Elfogadási kritériumok:**
- [ ] Vizuális és hang információk párosítása
- [ ] Történetek újraépítése
- [ ] Emlékezet puzzle
- [ ] Időrendi sorrend helyreállítása
- [ ] 85 pont szerezhető

#### User Story 7.4.3: Időpuffer-barlang
**Mint** 6. osztályos diák,  
**Szeretnék** töredékes időrétegekben navigálni,  
**Hogy** helyes kronológiát állítsak helyre.

**Elfogadási kritériumok:**
- [ ] Töredékes időrétegek
- [ ] Kronológiai logika
- [ ] Események helyes sorrendje
- [ ] Időutazás mechanika
- [ ] 90 pont szerezhető

#### User Story 7.4.4: Reflexiós Lépcsőház
**Mint** 6. osztályos diák,  
**Szeretnék** tükörképes választásokkal szembenézni,  
**Hogy** megtaláljam a valódi előrehaladást.

**Elfogadási kritériumok:**
- [ ] Tükörképes választások
- [ ] Ellentmondó információk szűrése
- [ ] Valódi előrehaladás megtalálása
- [ ] Logikai csapdák
- [ ] 85 pont szerezhető

#### User Story 7.4.5: Kódfelhő Zóna
**Mint** 6. osztályos diák,  
**Szeretnék** sodródó bináris tömbök között navigálni,  
**Hogy** megtaláljam a mintázatokat.

**Elfogadási kritériumok:**
- [ ] Sodródó bináris tömbök
- [ ] Mozgó adatfolyamok
- [ ] Mintázatok kiragadása
- [ ] Dinamikus objektumok kezelése
- [ ] 95 pont szerezhető

---

## 📊 8. TECHNIKAI ÉS NEM FUNKCIONÁLIS KÖVETELMÉNYEK

### Epic 8.1: Teljesítmény és Kompatibilitás
**Üzleti érték**: Minden diák zökkenőmentesen használhatja a rendszert
**Prioritás**: Magas

#### User Story 8.1.1: Gyors betöltési idő
**Mint** diák,  
**Szeretnék**, hogy az oldal gyorsan betöltődjön,  
**Hogy** azonnal elkezdhessem a játékot.

**Elfogadási kritériumok:**
- [ ] Lap betöltési idő <3 másodperc
- [ ] Core Web Vitals LCP <2.5s
- [ ] Video buffering <5%
- [ ] Optimalizált képek és erőforrások
- [ ] CDN használat videókhoz

#### User Story 8.1.2: Cross-browser kompatibilitás
**Mint** diák,  
**Szeretnék** használni a játékot bármilyen böngészőben,  
**Hogy** otthon és az iskolában is működjön.

**Elfogadási kritériumok:**
- [ ] Chrome 80+ támogatás
- [ ] Firefox 75+ támogatás
- [ ] Safari 13+ támogatás
- [ ] Edge 80+ támogatás
- [ ] Progressive enhancement

#### User Story 8.1.3: Reszponzív design
**Mint** diák,  
**Szeretnék** használni a játékot tableten és desktop-on,  
**Hogy** kényelmesen játszhassak.

**Elfogadási kritériumok:**
- [ ] Tablet optimalizáció (768px+)
- [ ] Desktop optimalizáció (1024px+)
- [ ] Touch-friendly UI elemek
- [ ] Megfelelő betűméretek
- [ ] Optimalizált gomb méretek

### Epic 8.2: Biztonság és Adatvédelem
**Üzleti érték**: A diákok és szülők bizalma a rendszer iránt
**Prioritás**: Magas

#### User Story 8.2.1: GDPR compliance
**Mint** szülő,  
**Szeretnék**, hogy gyermekem adatai védve legyenek,  
**Hogy** megfeleljen az adatvédelmi szabályozásnak.

**Elfogadási kritériumok:**
- [ ] GDPR szabályozás betartása
- [ ] Adatvédelmi nyilatkozat
- [ ] Szülői beleegyezés
- [ ] Adatok törlésének lehetősége
- [ ] Átlátható adatkezelés

#### User Story 8.2.2: Biztonságos kapcsolat
**Mint** diák,  
**Szeretnék**, hogy az adatok biztonságosan átadásra kerüljenek,  
**Hogy** ne férjenek hozzá illetéktelenek.

**Elfogadási kritériumok:**
- [ ] HTTPS only kapcsolat
- [ ] Biztonságos videó streaming
- [ ] Tartalom szűrés
- [ ] No tracking policy
- [ ] LocalStorage only adatmentés

---

## 🎯 PRIORITÁS ÉS ÜTEMTERV

### Magas Prioritás (Első fázis - 2-3 hónap)
1. **Felhasználói regisztráció és profilkezelés**
2. **Hub navigáció és évfolyam választás**
3. **Video-alapú történetmesélés**
4. **Interaktív rejtvények és játékmenet**
5. **3. osztály teljes tartalom**

### Közepes Prioritás (Második fázis - 1-2 hónap)
6. **Haladás mentése és statisztikák**
7. **Tanár/admin dashboard**
8. **4-5. osztály tartalmak**

### Alacsony Prioritás (Harmadik fázis - 1 hónap)
9. **6. osztály tartalom**
10. **Technikai optimalizálások**

---

## 📋 ÖSSZEGZÉS

Ez a dokumentum **10 fő epikust** és **47 részletes user story-t** tartalmaz, amelyek lefedik a Digitális Kultúra Verseny projekt teljes funkcionalitását. Minden epic tartalmaz üzleti értéket és prioritást, míg a user story-k részletes elfogadási kritériumokkal rendelkeznek.

A strukturált megközelítés biztosítja, hogy a fejlesztés fokozatosan, logikus sorrendben történjen, és minden fontos funkció időben elkészüljön a sikeres piaci bevezetéshez.

---

*Dokumentum verzió: 1.0 | Dátum: 2025-12-21 | Nyelv: Magyar*