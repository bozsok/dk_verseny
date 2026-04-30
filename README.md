# 🏆 Digitális Kultúra Verseny (v0.40.0-s)
> *"Egy fantasy kaland vár, tele kódolási kihívásokkal és rejtvényekkel!"*

Üdvözlünk a **Digitális Kultúra Verseny** hivatalos oldalán! Ez az alkalmazás egy interaktív, történetvezérelt versenyplatform, amelyet kifejezetten általános iskolás diákok (3–6. osztály) számára készítettünk. Nem egy átlagos tesztet kell kitöltened. Egy küldetésre hívunk!
A verseny során egy izgalmas történet főszereplőjévé válsz. Videókon keresztül ismersz meg egy fantáziavilágot, ahol problémák merülnek fel – és csak TE tudod megoldani őket a logikáddal és digitális tudásoddal.

### 🗺️ Az út
A verseny évfolyamtól függően **több mint 30 diából** áll, amely végigvezet a történeten:
1.  **Bevezetés:** Megismered a világot és a konfliktust.
2.  **5 állomás:** Különböző helyszíneken kell helytállnod. Mindenhol videók vezetnek fel egy-egy kihívást.
3.  **Játékmodulok:** Labirintus, kvíz, memória, puzzle és hangalapú feladatok.
4.  **Végjáték (Finale):** A végső próbatétel, ahol az összegyűjtött kulcsokat kell használnod.

## 🎓 Tanároknak és szervezőknek
Ez az alkalmazás modern webes technológiákra épül (HTML5, JavaScript, Vite), hogy bármilyen iskolai gépen gördülékenyen fusson.
- **Biztonságos (Checkpoint System):** A versenyállás minden sikeres állomás után automatikusan mentődik a szerverre, így technikai hiba esetén is pontosan onnan folytatható, ahol abbamaradt.
- **Fair Play:** Precíz időmérés és véletlenszerűen generált állomássorrend gondoskodik a tisztaságról.
- **Ranglista és adminisztrációs felület:** Beépített statisztikák, kereshető eredmények, részletes feladatonkénti vizuális kimutatások és letölthető oklevélgenerálás a verseny végén.

## 🚀 Főbb funkciók

### ✅ Megvalósult fejlesztések
- [x] **SEL-architektúra**: State Manager, EventBus, Logger System.
- [x] **Dinamikus történetvezetés**: Unified App Shell architektúra videóháttérrel.
- [x] **Játékmodulok**: Teljes körűen implementált feladatok (3–6. osztály).
- [x] **Neon Terminál finálé**: Összetett győzelmi szekvencia, mátrixeső és kódrekonstrukció.
- [x] **Integrált súgórendszer**: Kontextusfüggő segítség minden állomáshoz.
- [x] **Intelligens hangrendszer**: Web Audio API alapú SFX és narráció.
- [x] **Leaderboard-rendszer**: Szerveroldali (PHP/JSON) tárolás és adminfelület.
- [x] **Build-config és Debug**: Rugalmas konfigurálhatóság éles és fejlesztői környezetben.

## 🏗️ Architektúra

### SEL (State-Event-Logger) architektúra
Az alkalmazás egy reaktív, eseményvezérelt magra épül, amely biztosítja az adatok konzisztenciáját és a haladás pontos követését.

### Adattárolás
A versenyzők adatai a `public/gameData/` mappában tárolódnak JSON formátumban. A mentésről a `manage_leaderboard.php` gondoskodik.

## 🛠️ Technológiák
- **Frontend**: JavaScript (ES6+), Vite, Vanilla CSS.
- **VFX és grafika**: Three.js (WebGL), GLSL Shaderek, Anime.js.
- **Backend**: PHP (adatkezelés és ranglista).
- **Adat**: JSON alapú perzisztencia.
- **Grafika és okmányok**: html-to-image (SVG ForeignObject) alapú dinamikus generálás.

## 📁 Projektstruktúra
```
digitális-kultúra-verseny/
├── src/
│   ├── core/                 # SEL architektúra mag
│   ├── features/             # Játékmodulok és játékmenet
│   ├── ui/                   # Vizualizáció és komponensek
│   └── main.js               # Alkalmazás belépési pont
├── public/                   # Statikus fájlok és eszközök
│   ├── assets/               # Képek, videók, hangok
│   ├── ranglista/            # Ranglista és adminfelület
│   └── gameData/             # Játékos adatok (szerveroldal)
└── package.json              # Projektkonfiguráció
```

## 🛠️ Segédeszközök (Tools)

### Puzzle kódgenerátor
Ez egy belső használatú eszköz a játékhoz szükséges puzzle képek alapanyagainak legyártásához. Sűrű, technikai jellegű "nonsense" kódsorokat generál.
- **Elérés:** `npm run tool:puzzle`
- **Funkciók:** Dinamikus oszlopkezelés (1–5), kódszigetrendszer (blokkok), magyar nyelvű megjegyzésfejlécek, egyedi színválasztók minden elemhez és a háttérhez, CRT scanline-effekt és konfigurációmentés. Professzionális SVG-alapú képmentés.

---

**© 2026 Digitális Kultúra Verseny – Minden jog fenntartva**

*Utolsó frissítés: 2026. április 30.*


### Hogyan járulhatsz hozzá?
1. A tárhely fork-olása (Fork)
2. Feature branch létrehozása (`git checkout -b feature/AmazingFeature`)
3. Változtatások commit-olása (`git commit -m 'Add some AmazingFeature'`)
4. Branch push-olása (`git push origin feature/AmazingFeature`)
5. Pull Request nyitása

## 📄 Licenc

Ez a projekt MIT licenc alatt áll – lásd a [LICENSE](LICENSE) fájlt a részletekért.

## 📞 Kapcsolat

- **Projektmenedzser**: Bmad Master
- **E-mail**: [project-email@example.com]
- **Hibajelentés**: [GitHub Issues](https://github.com/[username]/digitális-kultúra-verseny/issues)

## 🙏 Köszönetnyilvánítás

- **Digitális Kultúra Verseny Csapat**: A projekt megvalósításáért
- **Nyílt forráskódú közösség**: A használt könyvtárakért és eszközökért
- **Tanárok és diákok**: A visszajelzésekért és tesztelésért

---

**© 2026 Digitális Kultúra Verseny – Minden jog fenntartva**

*Utolsó frissítés: 2026. április 30.*
