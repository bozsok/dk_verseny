# Projekt Szintű Kód-Audit és Stabilizációs Terv

A projekt hatalmas kódbázissal rendelkezik (a `main.js` önmagában közel 2800 sor), és az egyedi SEL (State-Eventbus-Logger) architektúra, illetve a nyers (vanilla) JavaScript miatt a hibák könnyen megbújhatnak. Kifejezetten célszerű egy strukturált, fázisokra bontott átvizsgálás, hogy elkerüljük az éles verseny során felbukkanó kritikus hibákat (pl. elakadó feladatok, memóriaszivárgás, pontvesztés).

Mivel a teljes kódot "szemmel" átolvasni irreális és nem is hatékony, az alábbi célzott, 5 fázisú stratégiát javaslom.

## 1. Fázis: Statikus kódanalízis (Automatizált ellenőrzés)
Mielőtt manuálisan belemerülnénk, a meglévő eszközöket használjuk a nyilvánvaló hibák kiszűrésére.
- **Linter futtatása:** Az `npm run lint` futtatásával megkeressük az összes definiálatlan változót (amilyen a legutóbbi `gameInstance` hiba is volt), a nem használt változókat, és a potenciális hatóköri (scope) hibákat.
- **Javítások:** A linter által kidobott hibák és figyelmeztetések szisztematikus javítása fájlról fájlra.

## 2. Fázis: Életciklus és Memóriaszivárgás (Memory Leak) Audit
A Vanilla JS SPA (Single Page App) leggyakoribb rákfenéje, hogy az időzítők és eseménykezelők a memóriában maradnak a képernyőváltás után.
- **Időzítők vizsgálata:** Végigkeressük a kódot a `setTimeout` és `setInterval` hívásokra. Ellenőrizzük, hogy minden esetben van-e hozzájuk tartozó `clearTimeout` / `clearInterval` a komponensek `destroy()` metódusában.
- **Eseménykezelők:** Megvizsgáljuk, hogy az `addEventListener`-ek (főleg a `window` vagy `document` szintűek) megfelelően el vannak-e távolítva (`removeEventListener`).
- **Feladat (Task) megsemmisítés:** Ellenőrizzük, hogy a `main.js` `activeTaskInstance` logikája valóban minden modulban egységesen és hiba nélkül lefut-e.

## 3. Fázis: Aszinkron Műveletek és Állapotkezelés (Race Conditions)
A verseny során a hálózat lassulhat, vagy a diákok túl gyorsan kattinthatnak.
- **Try-Catch blokkok:** Végignézzük az összes `async` / `await` és `fetch` hívást, biztosítva, hogy minden hálózati és aszinkron művelet megfelelően le van kezelve hibás ágon (`catch`) is.
- **Gyors kattintások (Debouncing):** Megvizsgáljuk a kritikus gombokat (pl. "OK", "Tovább", "Mentés"). Zárjuk-e (disable) a gombokat, amíg az aszinkron folyamat tart, hogy elkerüljük az adatbázisba történő többszörös beírást vagy az alkalmazás összeomlását?
- **EventBus:** Ellenőrizzük, hogy nincsenek-e végtelen ciklust okozó (circular) esemény-visszacsatolások.

## 4. Fázis: CSS Névtér (Namespace) Audit
Korábban gondot okoztak a globális osztálynevek (pl. `.glass-panel`).
- **BEM ellenőrzés:** Célzott kereséssel átnézzük a feladatok (Grade 3 és 4) `.css` fájljait, kiszűrve azokat az osztályneveket, amelyek nincsenek az adott modulhoz rendelve (pl. nincs `.dkv-taskname__` prefixük).

## 5. Fázis: Szélsőérték-tesztelés (Edge Case Simulation)
- A projektben már meglévő Debug Mode és belső tesztelő eszközök használatával szándékosan "rossz" adatokat adunk be.
- Gyors diaváltások szimulálása, feladatok félbehagyása, és lejárt idő tesztelése minden modulon.

## Kérdés a felhasználóhoz (User Review Required)
> [!IMPORTANT]
> Egyetértesz ezzel a fázisokra bontott megközelítéssel? 
> Ha igen, első lépésként elindíthatom az **1. Fázist** (az `npm run lint` parancs futtatásával és a kimenet elemzésével), majd haladhatunk sorban. Melyik területtel szeretnéd, hogy kezdjem?
