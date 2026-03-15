# Rendszer Architektúra Dokumentáció

Ez a dokumentum a projekt mély technikai felépítését és a SEL Architecture megvalósítását részletezi.

## 🏛️ SEL Architecture (State, Events, Logging)

A projekt alapköve a **SEL** modell, amely három fő pillérre épül:

1.  **State (Állapot):** Pinia tárolók használata a globális adatok (felhasználó, játékmenet, pontszámok) kezelésére.
    - Helye: `src/core/state/`
2.  **Events (Események):** Egy központi eseménybusz, amely lehetővé teszi a komponensek közötti laza csatolást.
    - Helye: `src/core/events/`
3.  **Logging (Naplózás):** Strukturált hibakezelés és eseménynaplózás a hibakeresés és analitika segítésére.
    - Helye: `src/core/logging/`

## 🧩 Moduláris Felépítés

### Core Engine
A játék motorja felelős a feladatok (puzzles) vezérléséért, a szövegek „írógép” effektusáért és a navigációért.
- `TypewriterEngine`: Dinamikus szövegmegjelenítés.
- `NavigationManager`: A diák és jelenetek közötti váltás vezérlése.

### Játék Funkciók (Features)
Minden versenyfeladat egy önálló funkcionális modul:
- **Kvíz:** Feleletválasztós kérdések.
- **Labirintus:** Interaktív 2D navigáció.
- **Hangerdő:** Audió alapú feladvány.
- **Finale:** Összetett zárófeladat (kódfejtés, drag-and-drop).

### Megjelenítési Réteg (UI)
Vue 3 SFC (Single File Components) alapú felépítés.
- Globális stílusok: `src/ui/styles/`
- Renderelés: Vanilla HTML5 Canvas és Three.js (3D effektusokhoz).

## 📡 Adatáramlás

1.  **Input:** Felhasználói interakciók vagy videó események.
2.  **Action:** Esemény kiváltása az Event Bus-on.
3.  **State Update:** A Store frissíti az állapotot (pl. pontszám növelése).
4.  **UI Update:** A Vue komponensek automatikusan frissülnek a reaktív állapot alapján.

## 🛠️ Külső Függőségek Integrációja

- **Three.js:** A portál átmeneteknél és speciális részecske-effektusoknál kerül felhasználásra.
- **Web Audio API:** A háttérzene és a hangeffektusok precíz kezeléséhez.
- **Vite:** A fejlesztői szerver és a build folyamat alapja.
