# 🏆 Digitális Kultúra Verseny
> *"Egy fantasy kaland vár, tele kódolási kihívásokkal és rejtvényekkel!"*

Üdvözlünk a **Digitális Kultúra Verseny** hivatalos oldalán! Ez az alkalmazás egy interaktív, történetvezérelt versenyplatform, amelyet kifejezetten általános iskolás diákok (3-6. osztály) számára készült. Nem egy átlagos tesztet kell kitöltened. Egy küldetésre hívunk!
A verseny során egy izgalmas történet főszereplőjévé válsz. Videókon keresztül ismersz meg egy fantáziatemet, ahol problémák merülnek fel - és csak TE tudod megoldani őket a logikáddal és digitális tudásoddal.

### 🗺️ Az Út
A verseny évfolyamtól függően **több mint 30 diából** áll, amely végigvezet a történeten:
1.  **Bevezetés:** Megismered a világot és a konfliktust.
2.  **5 Állomás:** Különböző helyszíneken kell helytállnod. Mindenhol videók vezetnek fel egy-egy kihívást.
3.  **Játékmodulok:** Labirintus, Kvíz, Memória, Puzzle és Hangalapú feladatok.
4.  **Végjáték (Finale):** A végső próbatétel, ahol az összegyűjtött kulcsokat kell használnod.

## 🎓 Tanároknak és Szervezőknek
Ez az alkalmazás modern webes technológiákra épül (HTML5, JavaScript, Vite), hogy bármilyen iskolai gépen gördülékenyen fusson.
- **Biztonságos (Checkpoint System):** A versenyállás minden sikeres állomás után automatikusan mentődik a szerverre, így technikai hiba esetén is pontosan onnan folytatható, ahol abbamaradt.
- **Fair Play:** Precíz időmérés és véletlenszerűen generált állomássorrend gondoskodik a tisztaságról.
- **Ranglista & Admin DashBoard:** Beépített statisztikák, kereshető eredmények, részletes feladatonkénti vizuális kimutatások és letölthető oklevélgenerálás a verseny végén.

## 🚀 Főbb Funkciók

### ✅ Megvalósult Fejlesztések
- [x] **SEL Architektúra**: State Manager, EventBus, Logger System.
- [x] **Dinamikus Történetvezetés**: Unified App Shell architektúra videós háttérrel.
- [x] **Játékmodulok**: Teljes körűen implementált feladatok (3-6. osztály).
- [x] **Intelligens Hangrendszer**: Web Audio API alapú SFX és narráció.
- [x] **Leaderboard System**: Szerveroldali (PHP/JSON) tárolás és admin felület.
- [x] **Build-config & Debug**: Rugalmas konfigurálhatóság éles és fejlesztői környezetben.

## 🏗️ Architektúra

### SEL (State-Event-Logger) Architektúra
Az alkalmazás egy reaktív, eseményvezérelt magra épül, amely biztosítja az adatok konzisztenciáját és a haladás pontos követését.

### Adattárolás
A versenyzők adatai a `public/gameData/` mappában tárolódnak JSON formátumban. A mentésről a `manage_leaderboard.php` gondoskodik.

## 🛠️ Technológiák
- **Frontend**: JavaScript (ES6+), Vite, Vanilla CSS.
- **Backend**: PHP (adatkezelés és ranglista).
- **Adat**: JSON alapú perzisztencia.
- **Grafika & Okmányok**: html2canvas alapú dinamikus generálás.

## 📁 Projekt Struktúra
```
digitális-kultúra-verseny/
├── src/
│   ├── core/                 # SEL architektúra mag
│   ├── features/             # Játékmodulok és játékmenet
│   ├── ui/                   # Vizualizáció és komponensek
│   └── main.js               # Alkalmazás belépési pont
├── public/                   # Statikus fájlok és eszközök
│   ├── assets/               # Képek, videók, hangok
│   ├── ranglista/            # Ranglista és Admin Dashboard
│   └── gameData/             # Játékos adatok (szerveroldal)
└── package.json              # Projekt konfiguráció
```

## 📊 Projekt Állapot
### Jelenlegi Verzió: v0.9.7 (2026-03-15)
A projekt elérte a végleges, versenyre kész állapotot! Minden tervezett funkció (feladatok, pontozás, ranglista) stabilan működik.

---

**© 2026 Digitális Kultúra Verseny - Minden jog fenntartva**

*Utolsó frissítés: 2026. március 15.*


### Hogyan járulhatsz hozzá?
1. Fork a repository
2. Feature branch létrehozása (`git checkout -b feature/AmazingFeature`)
3. Változtatások commit-olása (`git commit -m 'Add some AmazingFeature'`)
4. Branch push-olása (`git push origin feature/AmazingFeature`)
5. Pull Request nyitása

## 📄 Licenc

Ez a projekt MIT licenc alatt áll - lásd a [LICENSE](LICENSE) fájlt a részletekért.

## 📞 Kapcsolat

- **Project Manager**: Bmad Master
- **Email**: [project-email@example.com]
- **Issues**: [GitHub Issues](https://github.com/[username]/digitális-kultúra-verseny/issues)

## 🙏 Köszönetnyilvánítás

- **Digital Kultúra Verseny Team**: A projekt megvalósításáért
- **Open Source Community**: A használt library-kért és eszközökért
- **Tanárok és diákok**: A visszajelzésekért és tesztelésért

---

**© 2026 Digitális Kultúra Verseny - Minden jog fenntartva**

*Utolsó frissítés: 2026. március 15.*
