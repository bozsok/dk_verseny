
/**
 * ScriptPartAnimation - Szkriptrészlet gyűjtésének vizuális animációja a Grade 4-hez.
 * 
 * FÁZIS A: Megjeleníti a szkriptrészletet középen (neon ragyogás + glitch effektek).
 * FÁZIS B: Áthelyezi a HUD inventory slotjába.
 */
import { puzzleService } from '../../features/puzzles/PuzzleService.js';
import { PuzzlePiece } from '../../features/puzzles/PuzzlePiece.js';
import '../../features/puzzles/PuzzlePiece.css';

export class ScriptPartAnimation {
    /**
     * @param {Object} options 
     * @param {string} options.stationId - Az állomás azonosítása (pl. 'station_1')
     * @param {HTMLElement} options.targetSlot - A HUD-ban cél slot, ahova repülnie kell
     * @param {Function} options.onComplete - Callback a fázis A befejezésekor
     */
    constructor(options = {}) {
        console.log('[ScriptAnim] Példányosítva!', options); // eslint-disable-line no-console
        this.stationId = options.stationId;
        this.targetSlot = options.targetSlot;
        this.onComplete = options.onComplete;
        this.logger = options.logger || null;

        // Állomás -> Szkript kép index térkép
        this.scriptMap = {
            'station_1': 'script_1',
            'station_2': 'script_2',
            'station_3': 'script_3',
            'station_4': 'script_4',
            'station_5': 'script_5'
        };

        this.scriptName = this.scriptMap[this.stationId] || 'script_1';

        // DOM Elemek
        this.overlay = null;
        this.largeScript = null;
        this.dropIcon = null; // A repülő ikon (mivel a képet nem kicsinyítjük)
        this.container = null;

        this._animations = []; // Aktív animációk követése
        this._timers = []; // Aktív időzítők
        this._isDestroyed = false;

        // Stílus konténer animációkhoz
        this.styleTag = document.getElementById('dkv-script-animation-styles');
        if (!this.styleTag) {
            this.styleTag = document.createElement('style');
            this.styleTag.id = 'dkv-script-animation-styles';
            this.styleTag.innerHTML = `
                @keyframes scriptGlow {
                    0% { filter: drop-shadow(0 0 10px #ffffff) brightness(1); }
                    50% { filter: drop-shadow(0 0 25px #ffffff) brightness(1.2); }
                    100% { filter: drop-shadow(0 0 10px #ffffff) brightness(1); }
                }
                @keyframes scriptPulse {
                    0% { transform: translate(-50%, -50%) scale(1.1); }
                    50% { transform: translate(-50%, -50%) scale(1.16); }
                    100% { transform: translate(-50%, -50%) scale(1.1); }
                }
                .dkv-puzzle-preview {
                    position: absolute;
                    top: 30px;
                    right: 30px;
                    display: grid;
                    grid-template-columns: repeat(5, 40px);
                    grid-template-rows: repeat(3, 30px);
                    gap: 4px;
                    padding: 10px;
                    background: rgba(0, 0, 0, 0.6);
                    border: 1px solid rgba(0, 242, 255, 0.3);
                    border-radius: 4px;
                    z-index: 10001;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.5s ease-out;
                }
                .dkv-preview-slot {
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-sizing: border-box;
                }
                .dkv-preview-slot--active {
                    background: rgba(0, 242, 255, 0.3);
                    border-color: #00f2ff;
                    box-shadow: 0 0 10px #00f2ff;
                }
            `;
            document.head.appendChild(this.styleTag);
        }
    }

    createPreviewGrid(activeIndex) {
        const grid = document.createElement('div');
        grid.className = 'dkv-puzzle-preview';
        
        // Stílus finomítás a hálóhoz (kisebb darabkák, teljes tartalommal)
        Object.assign(grid.style, {
            gridTemplateColumns: 'repeat(5, 60px)',
            gridTemplateRows: 'repeat(3, 45px)',
            gap: '2px',
            transform: 'scale(1)',
            transformOrigin: 'top right'
        });

        for (let i = 0; i < 15; i++) {
            const pieceData = puzzleService.getPiece(i);
            const piece = new PuzzlePiece(pieceData);
            const pieceEl = piece.render();
            
            // Lekicsinyítjük a darabkát a rácscellához
            // Alapméret: (400 + 200) x (300 + 200) = 600x500 a padding miatt
            // Célméret: 60x45 (+ extra a fülnek)
            const scale = 0.1; 
            
            const slot = document.createElement('div');
            slot.style.position = 'relative';
            slot.style.width = '60px';
            slot.style.height = '45px';
            slot.style.overflow = 'visible'; // Hogy a fülek átlógjanak

            Object.assign(pieceEl.style, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) scale(${scale})`,
                pointerEvents: 'none',
                opacity: (i === activeIndex) ? '1' : '0.4',
                filter: (i === activeIndex) ? 'drop-shadow(0 0 20px #ffffff) brightness(1.5)' : 'none'
            });

            slot.appendChild(pieceEl);
            grid.appendChild(slot);
        }
        return grid;
    }

    /**
     * FÁZIS A: Megjelenítés és Ragyogás
     */
    playPhaseA() {
        console.log('[ScriptAnim] playPhaseA meghívva! container létezik?', !!this.container, 'destroyed?', this._isDestroyed); // eslint-disable-line no-console
        if (this._isDestroyed || this.container) return;

        if (this.logger) this.logger.info('[ScriptAnim] Phase A indítása', { station: this.stationId });

        this.container = document.createElement('div');
        this.container.className = 'script-animation-container';
        Object.assign(this.container.style, {
            position: 'fixed', top: '0', left: '0',
            width: '100vw', height: '100vh',
            pointerEvents: 'none',
            zIndex: '9998',
            overflow: 'hidden'
        });

        // Overlay - Terminal sötétkék/fekete
        this.overlay = document.createElement('div');
        Object.assign(this.overlay.style, {
            position: 'absolute', top: '0', left: '0',
            width: '100%', height: '100%',
            backgroundColor: 'transparent',
            backdropFilter: 'none',
            opacity: '0',
            transition: 'opacity 0.4s ease-out'
        });


        // Nagy Szkriptrészlet (Mostantól dinamikus PuzzlePiece a sorsolt indexek alapján)
        const stationNum = parseInt(this.stationId.split('_')[1]);
        const pieceData = puzzleService.getPiece(stationNum, true);
        const pieceIndex = pieceData ? pieceData.index : 0;
        
        const puzzlePiece = new PuzzlePiece({
            ...pieceData,
            isPulsing: true
        });

        this.largeScript = puzzlePiece.render();
        
        // Előnézeti háló – kikapcsolva (debug célú volt, a darabka renderelése kész)
        // this.previewGrid = this.createPreviewGrid(pieceIndex);

        // Darabka elmentése a StateManager-be
        const stateManager = puzzleService.stateManager || (window.DKV_APP?.stateManager);
        if (stateManager) {
            const puzzleState = stateManager.getState('puzzle') || { seed: null, earnedPieces: [] };
            const earned = puzzleState.earnedPieces || [];
            if (!earned.includes(pieceIndex)) {
                stateManager.updateState({
                    puzzle: { ...puzzleState, earnedPieces: [...earned, pieceIndex] }
                });
                console.log(`[PuzzleDebug] Piece ${pieceIndex} (from Station ${stationNum}) added to earnedPieces`); // eslint-disable-line no-console
            }
        }

        if (this.largeScript) {
            Object.assign(this.largeScript.style, {
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%) scale(0.01)',
                zIndex: '10000',
                opacity: '0',
                visibility: 'hidden',
                // BoxShadow törölve, mert a clip-path levágja. 
                // A CSS-ben lévő drop-shadow fog érvényesülni.
            });
        } else {
            // Fallback ha a puzzleService még nem él (ne legyen fehér képernyő)
            this.largeScript = document.createElement('div');
            this.largeScript.textContent = 'SCRIPT_' + stationNum;
        }

        this.container.appendChild(this.overlay);
        this.container.appendChild(this.largeScript);
        // this.container.appendChild(this.previewGrid); // kikapcsolva
        document.body.appendChild(this.container);

        requestAnimationFrame(() => {
            if (this._isDestroyed || !this.largeScript) return;

            // Elemek láthatóvá tétele (az animáció innentől indulhat villanás nélkül)
            // FONTOS: Az opacity-t NEM állítjuk '1'-re, mert az animáció
            // opacity: 0-ról indul! Ha itt '1'-re állítanánk, egy frame-ig full opacitás
            // villanás lenne, mielőtt az animáció felülírná.
            this.largeScript.style.visibility = 'visible';
            // this.previewGrid.style.visibility = 'visible'; // kikapcsolva
            // this.previewGrid.style.opacity = '1';          // kikapcsolva

            // 1. szakasz: GYORS ELŐBUKKANÁS a csúcsértékre (0.01 -> 1.16)
            const enterAnim = this.largeScript.animate([
                { transform: 'translate(-50%, -50%) scale(0.01)', opacity: 0 },
                { transform: 'translate(-50%, -50%) scale(1.16)', opacity: 1 }
            ], {
                duration: 700,
                easing: 'ease-out',
                fill: 'forwards'
            });
            this._animations.push(enterAnim);

            // Amikor elérte a csúcsot (1.16), átadjuk a lassú pulzálásnak
            enterAnim.onfinish = () => {
                if (this._isDestroyed || !this.largeScript) return;

                // Az inline opacity szinkronizálása az animáció végállapotával,
                // hogy ne legyen villanás a fill:forwards és a pulseAnim közötti résben
                this.largeScript.style.opacity = '1';

                // 2. szakasz: LASSÚ PULZÁLÁS (1.16 -> 1.1 -> 1.16) - Infinite loop
                const pulseAnim = this.largeScript.animate([
                    { transform: 'translate(-50%, -50%) scale(1.16)' },
                    { transform: 'translate(-50%, -50%) scale(1.1)' },
                    { transform: 'translate(-50%, -50%) scale(1.16)' }
                ], {
                    duration: 4000,
                    iterations: Infinity,
                    easing: 'ease-in-out'
                });
                this._animations.push(pulseAnim);

                // MEGJEGYZÉS: A korábbi scriptGlow CSS animáció (drop-shadow + brightness)
                // szürkévé tette a hátteret, mert a fehér drop-shadow átszüremlett
                // az rgba(0,0,0,0.8) félig áttetsző háttéren. Eltávolítva.
                // A fehér körvonal ragyogást az SVG réteg saját glow filtere biztosítja.
            };

            if (this.onComplete) this.onComplete();

            // 5mp után a sötétítés elhalványul, de a tárgy marad
            const t = setTimeout(() => {
                if (this._isDestroyed) return;
                if (this.overlay) this.overlay.style.opacity = '0';
            }, 5500);
            this._timers.push(t);
        });
    }

    playPhaseB() {
        return new Promise((resolve) => {
            if (this._isDestroyed || !this.container || !this.largeScript) {
                resolve();
                return;
            }

            if (this.logger) this.logger.info('[ScriptAnim] Phase B indítása');

            // 1. Állítsuk le a pulzáló animációkat
            const animations = this.largeScript.getAnimations();
            const currentTransform = window.getComputedStyle(this.largeScript).transform;
            animations.forEach(anim => anim.pause());

            // 2. Töröljük az automatikus Pulse animációt, de tartsuk meg a vizuális állapotot
            this.largeScript.style.animation = 'none';
            this.largeScript.style.transform = currentTransform;


            if (!this.targetSlot) {
                this.largeScript.animate([
                    { opacity: 1, transform: currentTransform },
                    { opacity: 0, transform: currentTransform + ' scale(0.8)' }
                ], { duration: 500, fill: 'forwards' });

                this.overlay.style.opacity = '0';
                const t = setTimeout(() => {
                    if (this._isDestroyed) { resolve(); return; }
                    this._cleanup();
                    resolve();
                }, 500);
                this._timers.push(t);
                return;
            }

            // 3. Repülés az inventory-ba (Kizárólag transform használatával, ugrás nélkül)
            const slotRect = this.targetSlot.getBoundingClientRect();

            // Kiszámítjuk a célpozíciót a középponthoz képest (mivel az elem 50%, 50%-on van)
            const targetX = slotRect.left + slotRect.width / 2 - window.innerWidth / 2;
            const targetY = slotRect.top + slotRect.height / 2 - window.innerHeight / 2;

            // Cél skálázás (az eredeti mérethez képest, ami kb. 50vh magas)
            const scriptHeight = this.largeScript.offsetHeight || window.innerHeight * 0.5;
            const targetScale = isNaN(slotRect.height / scriptHeight) || !isFinite(slotRect.height / scriptHeight) ? 0.1 : (slotRect.height / scriptHeight);

            // ELINDÍTJUK A REPÜLÉST
            try {
                const travelAnim = this.largeScript.animate([
                    { transform: currentTransform, opacity: 1 },
                    {
                        transform: `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px)) scale(${targetScale})`,
                        opacity: 0.3
                    }
                ], {
                duration: 900,
                easing: 'cubic-bezier(0.5, 0, 0.5, 1)',
                fill: 'forwards'
            });
            this._animations.push(travelAnim);

            this.overlay.style.opacity = '0';

                travelAnim.onfinish = () => {
                    if (this._isDestroyed) { resolve(); return; }
                    this._cleanup();
                    resolve();
                };

            } catch (err) {
                if (this.logger) this.logger.error('[ScriptAnim] Repülés animációs hiba:', err);
                console.error('[ScriptAnim] Repülés animációs hiba:', err, { currentTransform, targetX, targetY, targetScale }); // eslint-disable-line no-console
                this._cleanup();
                resolve();
            }
        });
    }

    play() {
        return new Promise((resolve) => {
            this.playPhaseA();
            const t = setTimeout(() => {
                if (this._isDestroyed) { resolve(); return; }
                this.playPhaseB().then(resolve);
            }, 2000);
            this._timers.push(t);
        });
    }

    _cleanup() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.overlay = null;
        this.largeScript = null;
        this.dropIcon = null;

        // Erőforrások takarítása
        this._animations.forEach(anim => anim.cancel());
        this._animations = [];
        this._timers.forEach(t => clearTimeout(t));
        this._timers = [];
    }

    destroy() {
        if (this.logger) this.logger.info('[ScriptAnim] Megsemmisítés...');
        this._isDestroyed = true;
        this._cleanup();
    }
}
