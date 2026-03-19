# Story 4.3: Portal SFX Integration

Status: in-progress

## Story

As a diák (8-12 év),
I want hallani a portál megnyílásának és az áthaladásnak a hangjait,
so that a vizuális élmény (Vortex) még intenzívebb és érthetőbb legyen a narráció hiánya ellenére.

## Acceptance Criteria

1. **Szinkronizált indítás**: A hangeffekt a portál tranzíció (`PortalTransition`) elindításakor (`start()` metódus) azonnal elindul.
2. **Fázisolt hangélmény**: A hanganyag (vagy hangok sorozata) követi a vizuális fázisokat:
    - **0-4mp (Anticipation)**: Misztikus, finom aura/részecske hangok.
    - **4-5mp (Opening)**: Erőteljes megnyílási effekt (woosh/robbanás).
    - **5-9mp (Steady)**: Folyamatos, mély örvénylő morajlás (drone).
    - **9-11mp (Traverse)**: Intenzív, szippantó/vákuum hatás a zoom-mal egy időben.
3. **Lezárás**: A hang a tranzíció végén (11mp-nél) tisztán lezárul (vagy elhalkul), mielőtt az új dia narrációja elindulna.
4. **Technikai megoldás**: A `AudioManager` vagy közvetlenül a `PortalTransition.js` kezeli a hang lejátszását.

## Tasks / Subtasks

- [ ] Megfelelő SFX fájl(ok) beszerzése/generálása (`portal_transition.mp3`).
- [ ] `PortalTransition.js` módosítása: hang indítása a `start()` metódusban.
- [ ] Kísérleti fázisolt hangerő-vezérlés (ha egyetlen loop-olt fájlt használunk) vagy szekvenciális lejátszás.
- [ ] Tesztelés és finomhangolás.

## Dev Notes

- **Időzítések**: 
    - 0s: Start
    - 4s: `uOpen` indul
    - 9s: `uZoom` indul
    - 11s: Finish
- **Fájl helye**: `public/assets/audio/sfx/portal_transition.mp3`
