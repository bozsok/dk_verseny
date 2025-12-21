# DIGITÁLIS KULTÚRA VERSENY - SPRINT 1 STORIES
## 2025. január 15-31. | "MVP Alap Infrastruktúra"

---

## 🎯 SPRINT 1 CÉLOK

### Fő Célok:
1. **Fejlesztői Infrastruktúra**: GitHub repository és CI/CD pipeline
2. **Core Architecture**: SEL architektúra alapok implementálása  
3. **Hub Navigation**: Évfolyam választó rendszer létrehozása
4. **UI Foundation**: Alapvető komponensek fejlesztése

### Sprint Összes Story Point: 43 SP

---

## 🔧 1. DEVELOPMENT ENVIRONMENT SETUP

### Story 1.1: GitHub Repository Létrehozása
**Story Point: 3 | Felelős: Lead Frontend Developer**

**Mint** fejlesztői csapat,  
**Szeretnénk** egy GitHub repository-t,  
**Hogy** elkezdhessük a kódolást és verziókezelést.

**Elfogadási kritériumok:**
- [x] GitHub repository létrehozva: "digitális-kultúra-verseny"
- [x] .gitignore fájl konfigurálva (Node.js, IDE files, OS files)
- [x] License file hozzáadva (MIT)
- [x] README.md alapverzió létrehozva projekttel
- [x] Repository public/private beállítása
- [x] Collaborators hozzáadása (4 csapattag)

### Story 1.2: CI/CD Pipeline Beállítása
**Story Point: 5 | Felelős: Lead Frontend Developer**

**Mint** fejlesztői csapat,  
**Szeretnénk** automatikus build és deployment pipeline-t,  
**Hogy** minden commit automatikusan tesztelve és telepítve legyen.

**Elfogadási kritériumok:**
- [ ] GitHub Actions workflow létrehozva (.github/workflows/)
- [ ] Node.js 18+ environment setup
- [ ] npm install és build parancsok
- [ ] ESLint és Prettier automatikus futtatása
- [ ] Unit tesztek automatikus futtatása (Jest)
- [ ] Build artifacts mentése
- [ ] Deploy to staging option

### Story 1.3: Projekt Struktúra Létrehozása
**Story Point: 3 | Felelős: Frontend Developer**

**Mint** fejlesztői csapat,  
**Szeretnénk** egy moduláris mappa struktúrát,  
**Hogy** tiszta és karbantartható legyen a kód.

**Elfogadási kritériumok:**
- [x] Mappa struktúra létrehozva (src/, tests/, docs/, videos/)
- [x] Core modulok mappái (state/, events/, logging/)
- [x] Feature modulok mappái (authentication/, video/, puzzles/, navigation/, scoring/)
- [x] UI mappák (components/, styles/, assets/)
- [x] Package.json alapkonfiguráció
- [x] Konfigurációs fájlok (.eslintrc.js, .prettierrc)

---

## 🏗️ 2. SEL ARCHITECTURE IMPLEMENTATION

### Story 2.1: State Manager Implementálása
**Story Point: 5 | Felelős: Lead Frontend Developer**

**Mint** fejlesztő,  
**Szeretnék** egy State Manager osztályt,  
**Hogy** központilag kezelhessem a játék állapotát.

**Elfogadási kritériumok:**
- [x] GameStateManager class létrehozása
- [x] State validation és initialization
- [x] State update és getState metódusok
- [x] EventBus integráció
- [x] LocalStorage wrapper
- [x] State persistence funkciók
- [ ] Unit tesztek (minimum 80% coverage)

### Story 2.2: EventBus Rendszer Létrehozása
**Story Point: 3 | Felelős: Lead Frontend Developer**

**Mint** fejlesztő,  
**Szeretnék** egy EventBus rendszert,  
**Hogy** modulok közötti kommunikációt megvalósíthassak.

**Elfogadási kritériumok:**
- [x] EventBus class implementálása
- [x] on() és emit() metódusok
- [x] Multiple listeners támogatása
- [x] Error handling és logging
- [x] Event types definiálása
- [x] Middleware support
- [ ] Unit tesztek

### Story 2.3: Logger System Implementálása
**Story Point: 3 | Felelős: Lead Frontend Developer**

**Mint** fejlesztő,  
**Szeretnék** egy Logger rendszert,  
**Hogy** strukturáltan tudjam naplózni az eseményeket.

**Elfogadási kritériumok:**
- [x] GameLogger class létrehozása
- [x] Log levels (ERROR, WARN, INFO, DEBUG)
- [x] LocalStorage és console output
- [x] Timestamp és context információ
- [x] GDPR-compliant logging
- [x] Performance impact minimalizálás

---

## 🏠 3. HUB NAVIGATION SYSTEM

### Story 3.1: Hub Főoldal Implementálása
**Story Point: 5 | Felelős: Frontend Developer**

**Mint** diák,  
**Szeretnék** látni a központi hub-ot,  
**Hogy** válasszak évfolyamot vagy folytassam a játékot.

**Elfogadási kritériumok:**
- [x] Hub HTML struktúra létrehozása
- [x] 4 évfolyam kártya megjelenítése (3-6. osztály)
- [x] Minden kártyán: osztály neve, rövid leírás
- [x] Progress bar minden évfolyamnál
- [x] Reszponzív design (tablet/desktop)
- [x] Alapvető CSS styling
- [x] Hub navigációs logika

### Story 3.2: Évfolyam Választó Felület
**Story Point: 3 | Felelős: Frontend Developer**

**Mint** diák,  
**Szeretnék** kiválasztani egy évfolyamot,  
**Hogy** elkezdhessem vagy folytathassam a tanulást.

**Elfogadási kritériumok:**
- [x] Évfolyam kártyák clickableek
- [x] State Manager integráció
- [x] Grade selection logika
- [x] Navigation routing alapok
- [x] Progress state management
- [x] UI feedback (hover, active states)

### Story 3.3: UI Komponensek Létrehozása
**Story Point: 5 | Felelős: UI/UX Designer + Frontend Developer**

**Mint** fejlesztő,  
**Szeretnék** alapvető UI komponenseket,  
**Hogy** konzisztens és használható legyen az interface.

**Elfogadási kritériumok:**
- [x] Button komponens (primary, secondary)
- [x] Card komponens (year grade kártyákhoz)
- [x] ProgressBar funkcionalitás (Card komponensbe integrálva)
- [ ] Modal alapok (future use)
- [x] CSS variables és design system
- [x] Responsive utilities
- [x] Touch-friendly sizing

---

## 🎨 4. UI FOUNDATION

### Story 4.1: CSS Design System
**Story Point: 3 | Felelős: UI/UX Designer**

**Mint** designer,  
**Szeretnék** egy design system-t,  
**Hogy** konzisztens legyen a vizuális megjelenés.

**Elfogadási kritériumok:**
- [x] Színpaletta definiálása (primary, secondary, accent)
- [x] Typography system (font sizes, weights)
- [x] Spacing system (margin, padding scale)
- [x] CSS custom properties
- [x] Grid system alapok
- [x] Animation/transition guidelines

### Story 4.2: Alapvető Animációk
**Story Point: 2 | Felelős: Frontend Developer**

**Mint** felhasználó,  
**Szeretnék** sima átmeneteket látni,  
**Hogy** professzionális legyen a felhasználói élmény.

**Elfogadási kritériumok:**
- [x] Hover animációk (gombok, kártyák)
- [x] Page transition animációk
- [x] Loading state animációk
- [x] CSS transitions és transforms
- [x] Performance optimized animációk

---

## 📦 5. BUILD ÉS DEPLOYMENT

### Story 5.1: Build System Konfigurálása
**Story Point: 2 | Felelős: Lead Frontend Developer**

**Mint** fejlesztő,  
**Szeretnék** egy build rendszert,  
**Hogy** production-ready kódot tudjak generálni.

**Elfogadási kritériumok:**
- [x] Rollup vagy Vite konfigurálása
- [x] Minification és optimization
- [x] Asset copying (images, videos, fonts)
- [x] Source maps generation
- [x] Build script package.json-ban
- [x] Development server beállítása

### Story 5.2: Testing Framework Setup
**Story Point: 3 | Felelős: Frontend Developer**

**Mint** fejlesztő,  
**Szeretnék** tesztelési környezetet,  
**Hogy** biztosíthassam a kód minőségét.

**Elfogadási kritériumok:**
- [x] Jest konfigurálása
- [ ] Cypress E2E tesztek beállítása
- [x] Test coverage reporting
- [x] Mock framework setup
- [x] Test file structure
- [ ] GitHub Actions integration

---

## 📊 SPRINT 1 MÉRFÖLDKÖVEK

### Január 20. (Sprint közepén):
- [x] GitHub repository és CI/CD pipeline működik
- [x] SEL architektúra core modulok kész (State, Events, Logger)
- [x] Alapvető UI komponensek és design system létezik

### Január 31. (Sprint vége):
- [x] Hub navigáció működik (4 évfolyam kártya)
- [x] Build és deployment pipeline kész
- [ ] Unit tesztek futnak (minimum 70% coverage)
- [ ] Code review process működik
- [ ] Sprint 1 demo elkészült

---

## 🎯 DEFINITION OF DONE

### Technikai DoD:
- [x] Code kompilál és fut
- [ ] Unit tesztek írva és futnak (70%+ coverage)
- [ ] Code review completed
- [x] CI/CD pipeline sikeresen fut
- [x] Documentation updated

### Funkcionális DoD:
- [x] Hub navigáció működik
- [x] Évfolyam választás működik
- [x] UI komponensek reszponzívak
- [x] Core architecture stabil
- [x] Development environment setup complete

---

## 📞 SPRINT 1 TEAM ASSIGNMENTS

**Lead Frontend Developer**: Stories 1.1, 1.2, 2.1, 2.2, 2.3, 5.1 (21 SP)
**Frontend Developer**: Stories 1.3, 3.1, 3.2, 4.2, 5.2 (16 SP)  
**UI/UX Designer**: Stories 3.3, 4.1 (8 SP)
**Project Manager**: Coordination, reviews, demos (0 SP - supporting)

**Összesen: 43 Story Points**

---

*Dokumentum verzió: 1.0 | Sprint 1: 2025. január 15-31. | Project Manager: Bmad Master*