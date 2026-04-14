import GameLogger from '../../core/logging/GameLogger.js';

/**
 * ScriptPartAnimation - Szkriptrészlet gyűjtésének vizuális animációja a Grade 4-hez.
 * 
 * FÁZIS A: Megjeleníti a szkriptrészletet középen (neon ragyogás + glitch effektek).
 * FÁZIS B: Áthelyezi a HUD inventory slotjába.
 */
export class ScriptPartAnimation {
    /**
     * @param {Object} options 
     * @param {string} options.stationId - Az állomás azonosítása (pl. 'station_1')
     * @param {HTMLElement} options.targetSlot - A HUD-ban cél slot, ahova repülnie kell
     * @param {Function} options.onComplete - Callback a fázis A befejezésekor
     */
    constructor(options = {}) {
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
        this.glow = null;
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
                    0% { filter: drop-shadow(0 0 20px rgba(0, 242, 255, 0.6)) contrast(1); }
                    50% { filter: drop-shadow(0 0 40px rgba(188, 0, 255, 0.9)) contrast(1.2); }
                    100% { filter: drop-shadow(0 0 20px rgba(0, 242, 255, 0.6)) contrast(1); }
                }
                @keyframes scriptPulse {
                    0% { transform: translate(-50%, -50%) scale(1.1); }
                    50% { transform: translate(-50%, -50%) scale(1.16); }
                    100% { transform: translate(-50%, -50%) scale(1.1); }
                }
            `;
            document.head.appendChild(this.styleTag);
        }
    }

    /**
     * FÁZIS A: Megjelenítés és Ragyogás
     */
    playPhaseA() {
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

        // Ragyogás effektus a háttérben
        this.glow = document.createElement('div');
        Object.assign(this.glow.style, {
            position: 'absolute', top: '50%', left: '50%',
            width: '40vh', height: '40vh',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 242, 255, 0.4) 0%, rgba(188, 0, 255, 0.1) 70%, transparent 100%)',
            transform: 'translate(-50%, -50%)',
            zIndex: '9999',
            opacity: '0',
            transition: 'opacity 1s ease-in'
        });

        // Nagy Szkriptrészlet Kép
        this.largeScript = document.createElement('img');
        this.largeScript.src = `assets/images/grade4/scripts/${this.scriptName}.jpg`;
        Object.assign(this.largeScript.style, {
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%) scale(0.01)',
            maxHeight: '50vh', maxWidth: '70vw',
            borderRadius: '8px',
            border: '2px solid rgba(0, 242, 255, 0.5)',
            boxShadow: '0 0 30px rgba(0, 242, 255, 0.3)',
            objectFit: 'contain', zIndex: '10000',
            opacity: '0',
            transition: 'opacity 0.6s ease-out'
        });

        // Felirat a kép alatt
        const label = document.createElement('div');
        label.textContent = `SZRIPTRÉSZLET MENTÉSE: ${this.scriptName.toUpperCase()}`;
        Object.assign(label.style, {
            position: 'absolute', top: 'calc(50% + 30vh)', left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#00f2ff',
            fontFamily: '"Orbitron", "Inter", sans-serif',
            fontSize: '1.2rem',
            letterSpacing: '2px',
            textShadow: '0 0 10px rgba(0, 242, 255, 0.8)',
            opacity: '0',
            transition: 'opacity 1s ease-in'
        });
        this._label = label;

        this.container.appendChild(this.overlay);
        this.container.appendChild(this.glow);
        this.container.appendChild(this.largeScript);
        this.container.appendChild(label);
        document.body.appendChild(this.container);

        requestAnimationFrame(() => {
            if (this._isDestroyed || !this.glow) return;

            // this.overlay.style.opacity = '1'; // Overlay elrejtve aUSER kérésére
            this.glow.style.opacity = '1';
            this.largeScript.style.opacity = '1';
            label.style.opacity = '1';

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

                // 2. szakasz: LASSÚ PULZÁLÁS (1.16 -> 1.1 -> 1.16) - Infinite loop
                // Megjegyzés: A ciklus a csúcsról indul, így az első mozdulat a lassú zsuporodás lesz
                const pulseAnim = this.largeScript.animate([
                    { transform: 'translate(-50%, -50%) scale(1.16)' },
                    { transform: 'translate(-50%, -50%) scale(1.1)' },
                    { transform: 'translate(-50%, -50%) scale(1.16)' }
                ], {
                    duration: 5000,
                    iterations: Infinity,
                    easing: 'ease-in-out'
                });
                this._animations.push(pulseAnim);
            };

            this.largeScript.style.animation = 'scriptGlow 4s infinite ease-in-out';

            if (this.onComplete) this.onComplete();

            // 5mp után a sötétítés elhalványul, de a tárgy marad
            const t = setTimeout(() => {
                if (this._isDestroyed) return;
                if (this.overlay) this.overlay.style.opacity = '0';
                if (this._label) this._label.style.opacity = '0';
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

            this.glow.style.transition = 'opacity 0.4s';
            this.glow.style.opacity = '0';
            if (this._label) this._label.style.opacity = '0';

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
            const scriptHeight = this.largeScript.offsetHeight;
            const targetScale = slotRect.height / scriptHeight;

            // ELINDÍTJUK A REPÜLÉST
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
        this.glow = null;
        this._label = null;

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
