# Grade 4 HUD Stabilizáció - Architektúrális Korrekció

A projekt SZENTÍRÁSA (project-context.md) alapján a korábbi javítási kísérletek elbuktak, mert megsértették a SEL architektúra eseményvezérelt elvét. Ez a terv a szabályoknak megfelelő megoldást vázolja fel.

## Összefüggés a "Szentírással"

A HUD konténer azért marad üres, mert az App Shell és a UI komponensek közötti közvetlen kapcsolat (Tight Coupling) sérti a **Rule 51**-es szabályt. A konténer törlése és újraépítése nincs szinkronizálva az **EventBus**-on keresztül (**Rule 42**), így a komponensek nem tudják, mikor kell visszacsatlakozniuk a perzisztens réteghez.

## Javasolt Módosítások

### 1. [CORE] App Shell & EventBus (main.js)
- A `setupAppShell()` metódus végén kibocsátjuk a `DKV_APP_SHELL_READY` eseményt.
- Az `initUIComponents()` metódust felkészítjük arra, hogy kezelje a DOM-ba való újracsatlakozást is.
- **Redundancia-mentesítés:** Véglegesen eltávolítjuk a maradvány `currentGrade` és `gradeClass` duplikációkat a `handleNext`-ből.

### 2. [UI] HUD Komponensek (TimerDisplay.js)
- A komponensek feliratkoznak a `DKV_APP_SHELL_READY` eseményre.
- Az esemény hatására ellenőrzik a DOM-beli kapcsolatukat, és ha szükséges, visszacsatolják az `element`-jüket a perzisztens `globalHudStack` alá.

### 3. [STYLING] Interface Specs (Interface.css)
- Megtartjuk a magas specifitású, `!important`-mentes szabályokat.
- Ellenőrizzük a szintaktikai integritást (zárójelek lezárása).

---
**Megjegyzés:** Ez a fájl a felhasználó kérésére jött létre a projekt gyökérkönyvtárában, hogy a "szentíráshoz" hasonlóan bárki számára hozzáférhető legyen.
