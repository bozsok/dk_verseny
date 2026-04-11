# Analízis: Onboarding és Állomás Skip Logikai Hibák

Ez a dokumentum részletezi a "Quantum Terminal" Grade 4 felületén azonosított pontozási és navigációs anomáliákat, amelyek a fejlesztői (debug) mód használata során merültek fel.

## 1. Az Onboarding "Túlpontozás" szindróma

### Jelenség
A felhasználó 5 pontot lát az Intro fázis elején, pedig a várt érték 4 (Registration: 3 + Character: 1).

### Technikai ok
A hiba a `main.js` és a `DebugManager.js` közötti "túlbuzgó" interakcióból ered.
- **Trigger**: [main.js:628](file:///d:/dev/dk_verseny/src/main.js#L628)
- **Folyamat**: Amint a rendszer átugorja a legelső Onboarding diát (`welcome`), azonnal meghívja a `applyDummyData()`-t.
- **Hiba**: A `DebugManager` feltételezi, hogy a teljes Onboardingot befejeztük, ezért [DebugDummyData.js:24](file:///d:/dev/dk_verseny/src/core/debug/DebugDummyData.js#L24) alapján beállít fix **4 pontot**.
- **Duplázódás**: Ha a felhasználó a karakterválasztó diánál megáll (nem skippeli), akkor a `CharacterSlide.js` hozzáadja a saját 1 pontját a már meglévő 4-hez. **Eredmény: 5 pont.**

---

## 2. Az Állomások "Alulpontozás" hibája

### Jelenség
Az állomások (Station 1-5) átugrásakor a felhasználó megkapja a szükséges kulcsokat, de a pontszáma nem növekszik.

### Technikai ok
A `main.js` tartalmaz egy fix logikát a kulcsok pótlására, de elfelejti szimulálni a pontszerzést.
- **Helyszín**: [main.js:641-651](file:///d:/dev/dk_verseny/src/main.js#L641-L651)
- **Következmény**: A tesztelés során a HUD-on lévő pontszám inkonzisztens lesz az elért haladással (pl. 5 kulccsal is csak 4 pontja van a játékosnak). Ez a végjáték (Final) kiértékelését is elrontja.

---

## 3. Javasolt megoldás: Granuláris Skip Kezelés

A "mindent vagy semmit" alapú pontozás helyett egy diánkénti (atomic) kiértékelést kell bevezetni.

### Logikai vázlat
A `DebugManager` kap egy `handleSlideSkip(slide)` metódust, amit a `main.js` hív meg minden egyes átugrott diánál.

| Dia típusa | Művelet skip esetén | Pontszám változás |
| :--- | :--- | :--- |
| **Welcome** | Idő offset hozzáadása | 0 |
| **Registration** | Dummy profil injektálása | +3 |
| **Character** | Dummy avatar injektálása | +1 |
| **Station Task** | Kulcs hozzáadása | +10 (szimulált átlag) |

### Előnyök
- **Konzisztencia**: Bármilyen kombinációban skippel a felhasználó, a pontszám mindig pontos marad.
- **Tesztelhetőség**: Az állomások átugrása után a végjáték statisztikái is értelmes adatokat mutatnak.

---

## 4. Feladat Függőségek és Állapotkezelés (MÉLYELEMZÉS)

A vizsgálat során kiderült, hogy a skippelés nemcsak a pontokat érinti, hanem a játékmenet integritását is veszélyezteti az alábbi függőségek miatt:

### A. Statisztikai adatok (`taskResults`)
A `main.js` egy belső listában (`this.taskResults`) gyűjti az összes elvégzett feladat részletes adatait (idő, siker, próbálkozások).
- **Hiba**: A jelenlegi skippelés kikerüli a feladat-lejelentő logikát, így ez a lista üres marad.
- **Következmény**: A végjáték összesítő képernyője és a ranglista statisztika hibás vagy hiányos lesz.

### B. Állapotjelzők (`markSlideCompleted`)
Minden sikeres feladat után a rendszer megjelöli a diát befejezettnek a `stateManager`-ben.
- **Hiba**: Skippeléskor ez a flag nem állítódik be.
- **Következmény**: A mentett állás visszatöltésekor a rendszer újra felajánlhatja (vagy kényszerítheti) a már átugrott feladatot.

### C. Ranglista Szinkronizáció
A feladatok végén fut le a `saveResultToLeaderboard`.
- **Hiba**: A skippelés során nincs köztes mentés.
- **Következmény**: Egy véletlen oldalfrissítés után a skippelt állomások "elvesznek", és a legutolsó manuális pontszám töltődik vissza.

### D. Időkezelés (`TimeManager`)
A versenyidőt a `TimeManager` méri.
- **Hiba**: A skippelés jelenleg "0 másodperces" teljesítményt sugallna, ami irreális rekordokat szülne.
- **Javaslat**: A skippelt diákhoz egy szimulált idő offset-et (pl. állomásonként 2-3 perc) kell hozzáadni.

---

## 5. Évfolyam Specifikus Megfigyelések

- **Grade 3**: Komplex, registry alapú feladatokat használ (Quiz, Puzzle, Sound). Itt a skippelésnek bonyolultabb `result` objektumot kell szimulálnia.
- **Grade 4**: Jelenleg egy **fallback** mechanizmust használ (registry bejegyzés hiányában egy üres modalt mutat). A skippelésnek ezt a fallback modalt és annak lezárását is szimulálnia kell.

---

> [!NOTE]
> Ez a kibővített analízis rávilágít arra, hogy a skippelés nem egy egyszerű navigációs ugrás, hanem a feladat-életciklus teljes (szimulált) végigvitele kell legyen.

## Kritikai megjegyzések

1. **Ranglista túlterhelés**: A tömeges skip feleslegesen sok HTTP kérést indíthat a szerver felé minden skippelt feladatnál.
2. **Dupla pontozás (Backward/Repeat)**: Visszalépéskor vagy ismételt áthaladáskor fennáll a pontok többszöri elszámolásának veszélye.
3. **Időmérő anomáliák**: A szimulált idő és a valós futási idő összeakadása irreális ranglista eredményeket szülhet.
4. **Rejtett logikai függőségek**: Bizonyos feladatok speciális state-változókat állíthatnak be, amik hiánya megállíthatja a későbbi diákat.
5. **Shuffle bizonytalanság**: Az állomások véletlenszerű sorrendje miatt a metadata alapú azonosításnak golyóállónak kell lennie.

### Észrevételek az átvizsgálás után

Az alapos kódvizsgálat során kiderült, hogy a rendszer bizonyos pontokra már szoftveresen fel van készítve:

- **Ad 2. (Dupla pontozás)**: A program **fel van készítve**. A `main.js` navigációs logikája tartalmaz `direction === 'forward'` ellenőrzést, az állomásoknál pedig egy `!stateManager.hasKey()` feltételt, ami megakadályozza, hogy egy már megszerzett kulcsért újra pontot kapjunk visszalépéskor.
- **Ad 5. (Shuffle bizonytalanság)**: A program **fel van készítve**. A rendszer mindenhol a `metadata.section` és `slide.id` azonosítókat használja az állomások felismeréséhez, ami független a fizikai sorrendtől (shuffled index).
- **Ad 1. (Ranglista túlterhelés)**: A program **részben védett**. Mivel skippeléskor a `_launchTask` metódus nem hívódik meg, jelenleg egyáltalán nincs hálózati forgalom a skip lánc alatt. A kihívás inkább a skippelt eredmények *egyszeri, lánc végi* mentése lesz.
- **Ad 3. (Időmérő)**: A program **nincs felkészítve**, de a `TimeManager` architektúrája (transzparens `startTime` kezelés) lehetővé teszi, hogy a skippelt idővel egyszerűen "eltoljuk a múltba" a kezdő időpontot.
- **Ad 4. (Rejtett függőségek)**: Ez marad a **legnagyobb kockázat**. A skippelés jelenleg teljesen vak az egyedi feladat-specifikus state változókra (pl. extra flag-ek a state-ben), ezeket a `handleSlideSkip` metódusban kell majd definiálhatóvá tenni.
