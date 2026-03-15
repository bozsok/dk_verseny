# Projekt Áttekintés - Digitális Kultúra Verseny

Ez a dokumentum összefoglalja a projekt alapvető céljait, technológiai hátterét és szerkezetét.

## 📋 Általános információk

- **Projekt neve:** Digitális Kultúra Verseny
- **Verzió:** 0.9.5
- **Típus:** Interaktív Webalkalmazás (SPA)
- **Célcsoport:** Oktatási intézmények, diákok
- **Fő cél:** Digitális kultúra témakörben versenyfeladatok és interaktív tartalom biztosítása.

## 🛠️ Technológiai Stack

| Kategória | Technológia | Leírás |
| :--- | :--- | :--- |
| **Keretrendszer** | Vue 3.3.0 | Modern komponens-alapú UI keretrendszer. |
| **Állapotkezelés** | Pinia 2.1.0 | Reaktív állapotkezelő rendszer. |
| **3D Engine** | Three.js 0.183.1 | Interaktív 3D vizualizációk és effektusok (pl. Portál). |
| **Build Tool** | Vite 7.3.0 | Gyors fejlesztői környezet és produkciós build. |
| **Tesztelés** | Jest, Cypress | Egységtesztek és end-to-end tesztelés. |
| **Stílus** | PostCSS, Vanilla CSS | Egyedi dizájn rendszer (SEL Architecture). |

## 🏗️ Architektúra (SEL Architecture)

A projekt a **SEL (State, Events, Logging)** architektúrát követi, amely biztosítja az állapotkezelés, eseménybusz és naplózás egységét. A kód bázisa moduláris:
- **Core:** Alapvető infrastruktúra és motorok.
- **Features:** Specifikus játékmechanikák (Kvíz, Labirintus, Hangerdő, Finale).
- **UI:** Újrafelhasználható vizuális elemek.
- **Content:** Konfigurálható tartalom az egyes osztályokhoz (3-6. osztály).

## 📂 Dokumentáció Tartalomjegyzék

- [Forráskód Struktúra](./source-tree-analysis.md)
- [Fejlesztői Útmutató](./development-guide.md)
- [Termék Specifikáció (PRD)](./prd-digitális-kultúra-verseny.md)
- [Epic-ek és User Story-k](./epics-and-stories.md)
