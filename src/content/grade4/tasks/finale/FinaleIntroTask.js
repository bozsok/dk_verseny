/**
 * FinaleIntroTask.js
 * Bit-pontos implementáció a LeetPuzzle.js struktúrája alapján, integrált puzzle motorral.
 */

import './FinaleIntroTask.css';
import Typewriter from '../../../../utils/Typewriter.js';
import { PuzzleGenerator } from './puzzle/puzzleGenerator.js';
import { PolyPiece } from './puzzle/PolyPiece.js';
import { mmax, mmin } from './puzzle/puzzleGeometry.js';

export class FinaleIntroTask {
    /**
     * @constructor
     * @param {HTMLElement} container - A befoglaló DOM elem.
     * @param {Object} [options={}] - Konfigurációs opciók.
     */
    constructor(container, options = {}) {
        this.container = container;
        this.onComplete = options.onComplete || (() => { });
        this.typewriter = new Typewriter();
        this.element = null;
        this._handlers = [];

        // Puzzle állapot
        this.numPieces = options.numPieces || 16;
        this.imagePath = 'assets/images/grade4/finale/prefinale-puzzle.jpg';
        this.polyPieces = [];
        this.puzzleObj = null;
        this.containerRect = { left: 0, top: 0 };
        this.isCompleted = false;

        // Időzítő állapot
        this.timerSeconds = 0;
        this.timerInterval = null;
        this.timerStarted = false;

        this.init();
    }

    /**
     * Inicializálja a feladatot.
     */
    init() {
        this.render();
        this.updateContainerRect();
        
        const onResize = this.updateContainerRect.bind(this);
        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onResize, true);
        this._handlers.push({ target: window, type: 'resize', handler: onResize });
        this._handlers.push({ target: window, type: 'scroll', handler: onResize, options: true });

        this.loadImage();
    }

    updateContainerRect() {
        if (!this.containerBoxEl) return;
        const rect = this.containerBoxEl.getBoundingClientRect();
        this.containerRect = { left: rect.left, top: rect.top };
        this.polyPieces.forEach(pp => {
            if (pp.instance) pp.instance.updateData(null, null, null, this.containerRect);
        });
    }

    /**
     * Felépíti a feladat DOM struktúráját és elindítja az animációkat.
     */
    render() {
        this.container.innerHTML = '';

        this.element = document.createElement('div');
        this.element.className = 'dkv-finale-intro-container';

        const titleText = `RENDSZER FELÜLÍRÁS ELINDÍTVA: <span style="color: var(--finale-cyan);">FRISSÍTŐSZKRIPT ÖSSZEILLESZTÉSE</span>`;
        const subtitleText = `Az összegyűjtött és a megmaradt szkriptrészletekett állítsd össze egy teljes kóddá!`;

        this.element.innerHTML = `
            <!-- ABSZOLÚT POZÍCIONÁLT IDŐZÍTŐ -->
            <div class="dkv-finale-intro__timer-box">
                <span class="dkv-finale-intro__timer-label">ANALÍZIS IDŐTARTAMA</span>
                <span class="dkv-finale-intro__timer-clock">00:00</span>
            </div>

            <div class="dkv-finale-intro__glass-panel">
                <div class="scanline"></div>
                
                <div class="dkv-finale-intro__header">
                    <span class="dkv-finale-intro__header-label">RENDSZERSZINTŰ KIVÉTEL // KIEMELT FONTOSSÁGÚ</span>
                    <h1 class="dkv-finale-intro__title"></h1>
                    <p class="dkv-finale-intro__subtitle"></p>
                    <button class="dkv-finale-intro__help-btn">?</button>
                </div>

                <!-- HELP OVERLAY -->
                <div class="dkv-finale-intro__help-overlay">
                    <div class="dkv-finale-intro__help-content">
                        <div class="dkv-finale-intro__help-header">
                            <span class="dkv-finale-intro__help-label">RENDSZER SEGÉDLET // FINÁLÉ PROTOKOLL</span>
                            <button class="dkv-finale-intro__help-close">×</button>
                        </div>
                        <div class="dkv-finale-intro__help-text">
                            <p>A frissítőszkript összeállítása kritikus folyamat. A rendelkezésre álló kódtöredékek egyesítésével a rendszer magja újraindítható. A darabok automatikusan összeilleszkednek, ha elég közel kerülnek egymáshoz.</p>
                            <p style="color: var(--finale-cyan); margin-top: 1.5rem; font-weight: bold;">STRATÉGIAI SEGÉDLET:</p>
                            <p>Keresd az egyenes szélű darabokat! Ezeken a darabokon egy fehér csík jelzi, hogy ez a legszélső puzzle darabka lesz.</p>
                            <img src="assets/images/grade3/puzzle/puzzle_help.png" class="dkv-finale-intro__help-img" alt="Segítség">
                        </div>
                    </div>
                </div>

                <div class="dkv-finale-intro__main-viewport">
                    <div class="puzzle-container-box">
                        <canvas class="full-image-canvas" width="1200" height="675"></canvas>
                    </div>
                </div>
            </div>
        `;

        this.container.appendChild(this.element);

        this.titleEl = this.element.querySelector('.dkv-finale-intro__title');
        this.subtitleEl = this.element.querySelector('.dkv-finale-intro__subtitle');
        this.timerClockEl = this.element.querySelector('.dkv-finale-intro__timer-clock');
        this.containerBoxEl = this.element.querySelector('.puzzle-container-box');
        this.mainViewport = this.element.querySelector('.dkv-finale-intro__main-viewport');
        this.fullImageCanvas = this.element.querySelector('.full-image-canvas');

        // HELP OVERLAY KIEMELÉSE A BODY SZINTRE (Stacking Context fix)
        this.helpOverlay = this.element.querySelector('.dkv-finale-intro__help-overlay');
        if (this.helpOverlay) {
            document.body.appendChild(this.helpOverlay);
        }

        this.overlayEl = document.createElement('div');
        this.overlayEl.className = 'puzzle-overlay';
        this.overlayEl.style.display = 'none';
        this.overlayEl.style.position = 'fixed';
        this.overlayEl.style.top = '0';
        this.overlayEl.style.left = '0';
        this.overlayEl.style.width = '100vw';
        this.overlayEl.style.height = '100vh';
        this.overlayEl.style.pointerEvents = 'none';
        this.overlayEl.style.zIndex = '10000';
        document.body.appendChild(this.overlayEl);

        // Segítség rendszer inicializálása
        this.setupHelpLogic();

        // Szekvenciális írógép effekt
        this.typewriter.type(this.titleEl, titleText, {
            speed: 20,
            hideCursorOnComplete: true,
            onComplete: () => {
                setTimeout(() => {
                    this.typewriter.type(this.subtitleEl, subtitleText, {
                        speed: 10,
                        onComplete: () => {
                            // AUTOMATIKUSAN BEZÁRJUK A SÚGÓT, HA NYITVA VOLNA
                            if (this.helpOverlay) this.helpOverlay.classList.remove('open');

                            this.mainViewport.classList.add('visible');
                            if (this.overlayEl) this.overlayEl.style.display = 'block';
                        }
                    });
                }, 300);
            }
        });
    }

    loadImage() {
        const img = new Image();
        let loaded = false;

        // 117. SZABÁLY: onload/onerror regisztrálása a src beállítása ELŐTT
        img.onload = () => {
            if (loaded) return;
            loaded = true;
            this.prepareGame(img);
        };

        img.onerror = () => {
            if (loaded) return;
            loaded = true;
            console.error('Hiba a puzzle kép betöltésekor:', this.imagePath);
            // Fallback: üres canvas vagy hibaüzenet (itt most megállunk)
        };

        // Biztonsági időtúllépés (3s)
        setTimeout(() => {
            if (!loaded) {
                loaded = true;
                console.warn('Képbetöltési időtúllépés, fallback indítása...');
                this.prepareGame(img); // Megpróbáljuk betölteni amit tudunk
            }
        }, 3000);

        img.src = `${this.imagePath}?t=${Date.now()}`;

        // Gyorsítótár ellenőrzése
        if (img.complete && img.naturalWidth > 0) {
            if (!loaded) {
                loaded = true;
                this.prepareGame(img);
            }
        }
    }

    prepareGame(img) {
        this.updateContainerRect();
        const VIEW_W = 1200, VIEW_H = 675;
        const { nx, ny } = PuzzleGenerator.computeGridSize(img.naturalWidth, img.naturalHeight, this.numPieces);
        const flatPieces = PuzzleGenerator.generatePieces(nx, ny).flat();
        const scaling = PuzzleGenerator.calculateScaling(img.naturalWidth, img.naturalHeight, VIEW_W, VIEW_H, nx, ny);

        this.puzzleObj = { nx, ny, scalex: scaling.scalex, scaley: scaling.scaley, offsx: scaling.offsx, offsy: scaling.offsy, gameWidth: scaling.gameWidth, gameHeight: scaling.gameHeight, gameCanvas: this.fullImageCanvas, dConnect: mmax(12, mmin(scaling.scalex, scaling.scaley) / 8) };

        const ctx = this.fullImageCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, scaling.offsx, scaling.offsy, scaling.gameWidth, scaling.gameHeight);
        flatPieces.forEach(p => p.scale(this.puzzleObj));

        const initial = flatPieces.map((p, i) => ({ id: `p-${i}`, pieces: [p], position: { x: Math.random() * (VIEW_W - scaling.scalex), y: Math.random() * (VIEW_H - scaling.scaley) }, zIndex: i + 10 }));
        const shuffled = PuzzleGenerator.shuffleArray(initial);

        this.polyPieces = shuffled.map(d => {
            const pp = new PolyPiece(this.overlayEl, { id: d.id, pieces: d.pieces, puzzle: this.puzzleObj, position: d.position, viewportOffset: this.containerRect, zIndex: d.zIndex, onMove: (id, pos) => { const x = this.polyPieces.find(p => p.id === id); if(x) x.position = pos; }, onDragStart: () => { if (!this.timerStarted) this.startTimer(); }, onDragEnd: this.handlePieceDragEnd.bind(this) });
            return { ...d, instance: pp };
        });
    }

    startTimer() {
        if (this.timerStarted) return;
        this.timerStarted = true;
        this.startTime = performance.now(); // 112. SZABÁLY: delta-alapú mérés

        this.timerInterval = setInterval(() => {
            const currentTime = performance.now();
            this.timerSeconds = Math.floor((currentTime - this.startTime) / 1000);
            
            const m = Math.floor(this.timerSeconds / 60).toString().padStart(2, '0'), 
                  s = (this.timerSeconds % 60).toString().padStart(2, '0');
            
            if (this.timerClockEl) this.timerClockEl.textContent = `${m}:${s}`;
        }, 1000 / 30); // 30 FPS UI frissítés, nem időforrás!
    }

    getIndexBounds(pp) { let minKx = Infinity, minKy = Infinity; pp.pieces.forEach(p => { if (p) { minKx = Math.min(minKx, p.kx); minKy = Math.min(minKy, p.ky); } }); return { minKx, minKy }; }
    getPieceCenter(pp, pc) { const { minKx, minKy } = this.getIndexBounds(pp); return { x: pp.position.x + (pc.kx - minKx + 0.5) * this.puzzleObj.scalex, y: pp.position.y + (pc.ky - minKy + 0.5) * this.puzzleObj.scaley }; }

    handlePieceDragEnd(id, pos) {
        const idx = this.polyPieces.findIndex(p => p.id === id); if (idx === -1) return;
        const moved = this.polyPieces[idx]; moved.position = pos || moved.position;
        const others = this.polyPieces.filter(p => p.id !== id), dirs = [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }];
        let merged = false, mp = [...moved.pieces], mpos = { ...moved.position }, mz = moved.zIndex, tod = [];

        const pass = (list, pieces, position, z) => {
            for (const o of list) {
                const oMap = new Map(); o.pieces.forEach(p => oMap.set(`${p.kx},${p.ky}`, p));
                for (const a of pieces) {
                    for (const d of dirs) {
                        const b = oMap.get(`${a.kx + d.dx},${a.ky + d.dy}`); if (!b) continue;
                        const cA = this.getPieceCenter({ pieces, position }, a), cB = this.getPieceCenter(o, b);
                        const sX = cB.x - cA.x - d.dx * this.puzzleObj.scalex, sY = cB.y - cA.y - d.dy * this.puzzleObj.scaley;
                        if (Math.hypot(sX, sY) <= (this.puzzleObj.dConnect || 15)) {
                            const sp = { x: position.x + sX, y: position.y + sY }, mB = this.getIndexBounds({ pieces }), oB = this.getIndexBounds(o);
                            const minKx = Math.min(mB.minKx, oB.minKx), minKy = Math.min(mB.minKy, oB.minKy);
                            return { newList: list.filter(p => p.id !== o.id), newG: { pieces: [...pieces, ...o.pieces], position: { x: sp.x - (mB.minKx - minKx) * this.puzzleObj.scalex, y: sp.y - (mB.minKy - minKy) * this.puzzleObj.scaley }, z: Math.max(z, o.zIndex) + 1 }, oldId: o.id };
                        }
                    }
                }
            } return null;
        };

        let currentList = others;
        while (true) {
            const res = pass(currentList, mp, mpos, mz); if (!res) break;
            mp = res.newG.pieces; mpos = res.newG.position; mz = res.newG.z; tod.push(res.oldId); currentList = res.newList; merged = true;
        }

        if (merged) {
            if (moved.instance) moved.instance.destroy();
            tod.forEach(tid => { const old = this.polyPieces.find(p => p.id === tid); if (old?.instance) old.instance.destroy(); });
            const nid = `m-${Date.now()}`, npp = new PolyPiece(this.overlayEl, { id: nid, pieces: mp, puzzle: this.puzzleObj, position: mpos, viewportOffset: this.containerRect, zIndex: mz, onMove: (id, pos) => { const x = this.polyPieces.find(p => p.id === id); if(x) x.position = pos; }, onDragStart: () => {}, onDragEnd: this.handlePieceDragEnd.bind(this) });
            this.polyPieces = [...currentList, { id: nid, pieces: mp, position: mpos, zIndex: mz, instance: npp }];
            if (this.polyPieces.length === 1) this.handleWin();
        }
    }

    handleWin() {
        if (this.isCompleted) return; this.isCompleted = true;
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.overlayEl.style.display = 'none'; this.fullImageCanvas.style.opacity = '1';
        setTimeout(() => { this.onComplete({ success: true, timeElapsed: this.timerSeconds, points: 10, maxPoints: 10 }); }, 1500);
    }

    /**
     * Beállítja a segítség-rendszer eseménykezelőit.
     */
    setupHelpLogic() {
        const helpBtn = this.element.querySelector('.dkv-finale-intro__help-btn');
        // A helpOverlay már ki van emelve a body-ba, használjuk a mentett referenciát
        const helpOverlay = this.helpOverlay;
        const closeBtn = helpOverlay ? helpOverlay.querySelector('.dkv-finale-intro__help-close') : null;

        if (helpBtn && helpOverlay) {
            helpBtn.addEventListener('click', () => {
                helpOverlay.classList.add('open');
            });

            closeBtn?.addEventListener('click', () => {
                helpOverlay.classList.remove('open');
            });
        }
    }

    /**
     * Megsemmisíti a komponenst és felszabadítja az erőforrásokat.
     */
    destroy() {
        this._handlers.forEach(({ target, type, handler, options }) => {
            target.removeEventListener(type, handler, options);
        });
        this._handlers = [];
        this.typewriter.stop();
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.polyPieces.forEach(pp => { if (pp.instance) pp.instance.destroy(); });
        if (this.helpOverlay && this.helpOverlay.parentNode) {
            this.helpOverlay.parentNode.removeChild(this.helpOverlay);
        }
        if (this.overlayEl && this.overlayEl.parentNode) this.overlayEl.parentNode.removeChild(this.overlayEl);
        if (this.element) this.element.remove();
    }
}
