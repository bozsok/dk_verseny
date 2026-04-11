# 📐 Implementációs Terv: Granuláris Skip és Pontozás Javítása

**Készítette:** Architect-Pampa
**Küldetés:** A "Quantum Terminal" (Grade 4) pontozási és skippelési anomáliák végleges felszámolása.

## 🏛️ Architecturális Analízis (Az "Abszolút Tökéletes Út")

A projekt jelenlegi debug-skippelési mechanizmusa ("mindent vagy semmit") inkonzisztenciát szül a pontos haladás és a megszerzett pontok között. A megoldás egy **atomic (atomivá tett) feladat-szimuláció** bevezetése a hurokban. Ez azt jelenti, hogy skippeléskor a rendszer nem egyszerűen átugorja a diát, hanem a háttérben "lejátssza" a sikeres teljesítést: injektálja a statisztikákat, hozzáadja a pontokat és kulcsokat, valamint kényszeríti az állapotmentést.

## 🛡️ Kockázatelemzés és Technikai Adósság

| Kockázat | Megoldási stratégia |
| :--- | :--- |
| **Ranglista túlterhelés** | A skip-lánc alatt blokkoljuk a hálózati kéréseket, és csak a folyamat végén indítunk egyetlen szinkron mentést. |
| **Időmérő anomáliák** | Skippelt feladatonként szimulált időt (offset) adunk a globális időhöz, elkerülve a 0 másodperces rekordokat. |
| **Dupla pontozás** | A navigációs `forward/backward` logic és a `stateManager` meglévő kulcs-ellenőrzésének szigorúbb integrációja. |

## 📋 Logikai Vázlat (Implementációs Lépések)

### 1. `DebugManager.js` & `DebugDummyData.js`
- Új `handleSlideSkip(slide)` metódus implementálása.
- Diatípus specifikus logikák:
    - **Registration**: Profilnév + 3 pont injektálása.
    - **Character**: Avatar + 1 pont injektálása.
    - **Station Task**: Kulcs, 10 pont és statisztikai bejegyzés (`taskResults`) generálása.

### 2. `TimeManager.js`
- `addSimulationOffset(ms)` metódus hozzáadása, amely módosítja a `globalTimer` kezdőpontját.

### 3. `main.js` refaktor
- A `renderSlide()` navigációs loopba történő beavatkozás a skip-ágon.
- Lánc végi mentési logika (`saveResultToLeaderboard`) optimalizálása.

### 4. Konfigurációs bővítés (`config.js`)
- `simulatedState` mezők támogatása a diák metadata részében az egyedi flag-ek (pl. `hasUsedKey`) kezeléséhez.

## 🏁 Záró Megjegyzés

A javaslat elfogadása után a küldetés átkerül a **Manager** szakaszba, ahol az egyes feladatok ütemezése megtörténik.

**Következő lépés:** Amennyiben a terv megfelel, írd be: `proceed` vagy `go`.
