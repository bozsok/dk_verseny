# Z-Index Hierarchia Térkép (Z-Index Map)

Ez a dokumentum a projektben használt összes `z-index` értéket és azok hierarchikus sorrendjét tartalmazza. A sorrend a legfelső (legközelebb a felhasználóhoz) elemtől a legalsó (háttér) elemig halad.

## Rétegek Erősorrendje (Z-Index Hierarchy)

| Prioritás | Z-Index Érték | Funkció / Meghatározás | CSS Változó |
| :--- | :--- | :--- | :--- |
| **LEGFELSŐ** | **99999** | **Lebegő Panelek & Pontok**<br>Pl. Quiz +pont animációk, globális tooltip panel. | `--z-tooltip-floating`<br>`--z-quiz-floating-pt` |
| | **10002** | **Régi Tooltip Konténer**<br>Hagyományos CSS-alapú tooltipek. | `--z-tooltip-legacy` |
| | **10001** | **Feladat Modal Fejléc**<br>Biztosítja, hogy a modal fejléce minden tartalom felett legyen. | `--z-task-modal-header` |
| | **10000** | **Debug Panel**<br>Fejlesztői eszközök, csak DEV módban látható. | `--z-debug` |
| | **9999** | **Eredmény Összegzők**<br>Játék végi/feladat végi modalok (Maze, Sound). | `--z-result-modal` |
| | **5000** | **Lightbox Panel**<br>Nagyított tárgyak (pl. kulcsok) megjelenítése. | `--z-lightbox` |
| | **4000** | **Lightbox Overlay**<br>A nagyítás mögötti sötétítő réteg. | `--z-lightbox-overlay` |
| | **3201** | **Finálé Napló Gomb**<br>A finálé alatt megjelenő speciális gomb. | `--z-finale-journal-btn` |
| | **3200** | **Finálé Napló Panel**<br>A finálé során elérhető történeti napló. | `--z-finale-journal` |
| | **3100** | **Finálé Oldalsáv**<br>Kiemelt oldalsáv a finálé jelenetben. | `--z-finale-sidebar` |
| | **3000** | **Feladat Modal Overlay**<br>A feladatok (puzzle, kódfejtés) sötétítő háttere. | `--z-task-modal-overlay` |
| | **2602** | **Tutorial Buborék**<br>Súgó szövegek és gombok a tutorial alatt. | `--z-tutorial-tooltip` |
| | **2601** | **Tutorial Kiemelés**<br>A tutorial során aktuálisan magyarázott elem. | `--z-tutorial-highlight` |
| | **2600** | **Tutorial Sötétítő**<br>Általános sötétítő réteg a tutorial indításakor. | `--z-tutorial-overlay` |
| | **2500** | **UI Réteg (HUD)**<br>Navigációs nyilak, HUD elemek, Glitch effektek. | `--z-ui-layer` |
| | **2400** | **Portál Részecskék**<br>Three.js részecskerendszer a portál átvezetésben. | `--z-portal-particles` |
| | **2300** | **Portál Shader**<br>Speciális shader effekt a portál belsejében. | `--z-portal-shader` |
| | **2201** | **Portál Örvény**<br>A portál visual vortex/örvény rétege. | `--z-portal-vortex` |
| | **2200** | **Portál Alap**<br>A portál átvezetés legalapvetőbb vizuális rétege. | `--z-portal-bg` |
| | **2000** | **Onboarding Modal**<br>Regisztráció, karakterválasztás és karakter előnézet. | `--z-onboarding-modal` |
| | **1500** | **Lebegő Animációk**<br>Kulcsgyűjtés animáció, úszó pontfelhők. | `--z-float-animation` |
| | **1400** | **Portál Maszk Háttér**<br>A portál bevezető animációjának maszk rétege. | `--z-portal-mask-bg` |
| | **1100** | **Vezérlő Panelek**<br>Napló (Journal), Beállítások (Settings), Narrátor. | `--z-panel` |
| | **1000** | **UI Vezérlők / Húzás**<br>Billentyűzet, éppen húzott (drag) puzzle darabok. | `--z-ui-controls`<br>`--z-dragging` |
| | **100** | **Tartalom Réteg (Main)**<br>Az oldalak fő tartalma, inventory slotok, overlayek. | `--z-content` |
| | **10** | **Belső UI Elemek**<br>Időmérő sávok a feladatokban, összefoglaló gombok. | `--z-inner-ui` |
| | **6** | **Összefoglaló Felső**<br>A summary slide legfelső belső elemei. | `--z-inner-top` |
| | **5** | **Összefoglaló Elemek**<br>A summary slide általános belső elemei. | `--z-inner-elements` |
| | **2** | **Belső Másodlagos**<br>Kártyák hátlapja (Memory), átfedő rétegek. | `--z-inner-secondary` |
| | **1** | **Belső Alap**<br>Grid rétegek, alap tárolók komponenseken belül. | `--z-inner-base` |
| **LEGALUL** | **-1 / 0** | **Háttér Réteg**<br>Fő háttérkép, blur effektek, overlay mögötti rétegek. | `--z-background` |

## Fontos Megjegyzések

1.  **Forrás:** A z-index értékek elsődleges forrása a `src/ui/styles/z-index.css` fájl.
2.  **Használat:** Mindig a CSS változókat (`var(--z-...)`) használd a hardkódolt értékek helyett a konzisztencia érdekében!
3.  **Kivétel:** A `!important` jelzőt csak kritikus esetekben (pl. `--z-dragging`) szabad alkalmazni, hogy felülírja a komponens szintű specifikusságot.
4.  **Rétegek közötti kapcsolat:** A legtöbb UI elem a `#dkv-layer-ui` tárolón belül helyezkedik el, amely globálisan `z-index: 2500`-zal rendelkezik. A tárolón belüli relatív sorrendet a fenti táblázat belső értékei szabályozzák.

---
*Utoljára frissítve: 2026-04-12*
