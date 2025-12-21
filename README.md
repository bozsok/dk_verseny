# 🏆 Digitális Kultúra Verseny
> *"Egy fantasy kaland vár, tele kódolási kihívásokkal és rejtvényekkel!"*

Üdvözlünk a **Digitális Kultúra Verseny** hivatalos oldalán! Ez az alkalmazás egy interaktív, történetvezérelt versenyplatform, amelyet kifejezetten általános iskolás diákok (3-6. osztály) számára készítettünk.

## 🌟 A Kaland
Nem egy átlagos tesztet kell kitöltened. Egy küldetésre hívunk!
A verseny során egy izgalmas történet főszereplőjévé válsz. Videókon keresztül ismersz meg egy fantáziavilágot, ahol problémák merülnek fel - és csak TE tudod megoldani őket a logikáddal és digitális tudásoddal.

### 🗺️ Az Út
A verseny **30 állomásból** (diából) áll, amely végigvezet a történeten:
1.  **Bevezetés:** Megismered a világot és a konfliktust.
2.  **5 Állomás:** Különböző helyszíneken kell helytállnod. Mindenhol videók vezetnek fel egy-egy kihívást.
3.  **A Feladat:** Itt a te tudásodra van szükség! Logika, kódolás, rejtvények.
4.  **Végjáték:** A legnagyobb próbatétel a kaland végén.

## 🎓 Tanároknak és Szervezőknek
Ez az alkalmazás modern webes technológiákra épül (HTML5, JavaScript), hogy bármilyen iskolai gépen gördülékenyen fusson.
- **Biztonságos:** A versenyállás titkosítva mentődik, így áramszünet esetén is folytatható.
- **Fair Play:** Precíz időmérés gondoskodik a rangsorolásról.
- **Offline-First:** A rendszer úgy lett tervezve, hogy minimális internetkapcsolattal is stabilan működjön (hamarosan).

Jó versenyezést és sikeres küldetést kívánunk! ⚔️🛡️

A Digitális Kultúra Verseny egy modern, web-alapú oktatási platform, amely segít a diákoknak fejleszteni digitális készségeiket. Az alkalmazás SEL (State-Event-Logger) architektúrával épül, és reszponzív design-t kínál minden eszközön.

### 🎯 Célok
- **Digitális kompetenciák fejlesztése**: Alapvető digitális készségek oktatása
- **Játékos tanulás**: Interaktív feladatok és kihívások
- **Évfolyamonkénti differenciálás**: 3-6. osztályig tartalom
- **Progress tracking**: Haladás követése és eredmények rögzítése

## 🚀 Főbb Funkciók

### ✅ Sprint 1 (MVP Alap Infrastruktúra)
- [x] **SEL Architektúra**: State Manager, EventBus, Logger System
- [x] **Hub Navigation**: Központi évfolyam választó felület
- [x] **UI Komponensek**: Button, Card, Progress Bar
- [x] **Design System**: Teljes CSS design system
- [x] **Build System**: Vite, PostCSS, Jest konfiguráció

### 🔄 Tervezett Funkciók (Sprint 2+)
- [ ] **Játékmodulok**: Évfolyamonkénti feladatok
- [ ] **Progress System**: Részletes haladás követés
- [ ] **Achievements**: Eredmények és jelvények
- [ ] **Teacher Dashboard**: Tanári felület
- [ ] **Analytics**: Haladás statisztikák

## 🏗️ Architektúra

### SEL (State-Event-Logger) Architektúra
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GameState     │    │    EventBus     │    │   GameLogger    │
│   Manager       │◄──►│                 │◄──►│                 │
│                 │    │                 │    │                 │
│ - State         │    │ - Events        │    │ - Logging       │
│ - Validation    │    │ - Listeners     │    │ - Storage       │
│ - Persistence   │    │ - Middleware    │    │ - GDPR          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Komponens Struktúra
- **Core Components**: State Manager, EventBus, Logger
- **UI Components**: Button, Card, Progress Bar
- **Features**: Hub, Grade Selection, Game Modules
- **Styles**: Design System CSS

## 🛠️ Technológiák

### Frontend
- **JavaScript ES6+**: Modern JavaScript features
- **Vite**: Build tool és development server
- **CSS3**: Custom properties, Grid, Flexbox
- **PostCSS**: CSS processing

### Testing & Quality
- **Jest**: Unit testing framework
- **ESLint**: JavaScript linting
- **Prettier**: Code formatting

### Build & Deploy
- **Vite**: Modern build tool
- **PostCSS**: CSS optimization
- **GitHub Actions**: CI/CD pipeline (tervezett)

## 📁 Projekt Struktúra

```
digitális-kultúra-verseny/
├── src/
│   ├── core/                 # SEL architektúra
│   │   ├── state/
│   │   ├── events/
│   │   └── logging/
│   ├── features/             # Funkcionális modulok
│   │   └── navigation/
│   ├── ui/                   # UI komponensek
│   │   ├── components/
│   │   └── styles/
│   └── main.js              # Alkalmazás belépési pont
├── tests/                    # Tesztek
│   ├── unit/
│   └── e2e/
├── public/                   # Statikus fájlok
│   └── index.html
├── docs/                     # Dokumentáció
├── package.json             # Projekt konfiguráció
├── vite.config.js           # Build konfiguráció
└── jest.config.js           # Teszt konfiguráció
```

## 🚀 Gyors Kezdés

### Előfeltételek
- **Node.js** 18+ verzió
- **npm** vagy **yarn** package manager
- **Modern böngésző** (Chrome, Firefox, Safari, Edge)

### Telepítés

1. **Klónozás**
   ```bash
   git clone https://github.com/[username]/digitális-kultúra-verseny.git
   cd digitális-kultúra-verseny
   ```

2. **Függőségek telepítése**
   ```bash
   npm install
   ```

3. **Development server indítása**
   ```bash
   npm run dev
   ```

4. **Build production**
   ```bash
   npm run build
   ```

### Tesztelés

```bash
# Unit tesztek futtatása
npm test

# Coverage riport
npm run test:coverage

# Watch mode
npm run test:watch
```

## 📱 Böngésző Támogatás

| Böngésző | Verzió | Támogatás |
|----------|--------|-----------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| IE | 11 | ❌ Not Supported |

## 🎨 Design System

### Színpaletta
- **Primary**: Blue (#3b82f6)
- **Secondary**: Green (#22c55e)
- **Accent**: Amber (#d97706)
- **Neutral**: Gray skála

### Komponensek
- **Button**: Primary, secondary, outline variánsok
- **Card**: Évfolyam kártyák progress barokkal
- **Progress Bar**: Haladás megjelenítése
- **Typography**: Fluid typography system

## 🔧 Fejlesztés

### Code Quality
- **ESLint**: JavaScript kód minőség ellenőrzése
- **Prettier**: Automatikus kód formázás
- **Pre-commit hooks**: Automatikus ellenőrzés

### Git Workflow
1. **Branch létrehozása**: `git checkout -b feature/feature-name`
2. **Változtatások**: Kódolás és tesztelés
3. **Commit**: `git commit -m "feat: add new feature"`
4. **Push**: `git push origin feature/feature-name`
5. **Pull Request**: Code review és merge

### Commit Message Konvenció
- `feat:` Új funkció
- `fix:` Hiba javítás
- `docs:` Dokumentáció frissítés
- `style:` Kód formázás
- `refactor:` Kód refaktorálás
- `test:` Tesztek hozzáadása
- `chore:` Egyéb változtatások

## 📊 Projekt Állapot

### Sprint 1 (2025. január 15-31.)
- **Status**: 77% kész
- **Kész Stories**: 10/13
- **Story Points**: 32/43

### Milestones
- [x] **Január 20**: Core architektúra kész
- [x] **Január 31**: Hub navigation működik
- [ ] **Február 15**: Játékmodulok implementálása
- [ ] **Február 28**: Teacher dashboard

## 🤝 Közreműködés

### Fejlesztői Csapat
- **Project Manager**: Bmad Master
- **Lead Frontend Developer**: TBD
- **Frontend Developer**: TBD
- **UI/UX Designer**: TBD

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

**© 2025 Digitális Kultúra Verseny - Minden jog fenntartva**

*Utolsó frissítés: 2025. január 21.*
