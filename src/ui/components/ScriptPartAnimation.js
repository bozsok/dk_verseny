/**
 * ScriptPartAnimation - Szkriptrészlet gyűjtésének vizuális animációja a Grade 4-hez.
 * 
 * FÁZIS A: Megjeleníti a szkriptrészletet középen (neon ragyogás + glitch effektek).
 * FÁZIS B: Áthelyezi a HUD inventory slotjába.
 */
class ScriptPartAnimation {
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
                @keyframes scriptFloat {
                    0% { transform: translate(-50%, -50%) translateY(0px) scale(1.1); }
                    50% { transform: translate(-50%, -50%) translateY(-10px) scale(1.12); }
                    100% { transform: translate(-50%, -50%) translateY(0px) scale(1.1); }
                }
                @keyframes scriptGlitch {
                    0% { clip-path: inset(0 0 0 0); transform: translate(-50%, -50%) skew(0deg); }
                    2% { clip-path: inset(10% 0 80% 0); transform: translate(-50%, -50%) skew(5deg); }
                    4% { clip-path: inset(0 0 0 0); transform: translate(-50%, -50%) skew(0deg); }
                    95% { clip-path: inset(0 0 0 0); transform: translate(-50%, -50%) skew(0deg); }
                    97% { clip-path: inset(40% 0 30% 0); transform: translate(-51%, -50%) skew(-5deg); }
                    100% { clip-path: inset(0 0 0 0); transform: translate(-50%, -50%) skew(0deg); }
                }
            `;
            document.head.appendChild(this.styleTag);
        }
    }

    /**
     * FÁZIS A: Megjelenítés és Ragyogás
     */
    playPhaseA() {
        if (this.container) return;

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
            backgroundColor: 'rgba(0, 10, 20, 0.85)',
            backdropFilter: 'blur(5px)',
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
            transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });

        // Felirat a kép alatt
        const label = document.createElement('div');
        label.textContent = `SYSTEM_FRAGMENT_LOADED: ${this.scriptName.toUpperCase()}`;
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
            this.overlay.style.opacity = '1';
            this.glow.style.opacity = '1';
            this.largeScript.style.opacity = '1';
            this.largeScript.style.transform = 'translate(-50%, -50%) scale(1.1)';
            label.style.opacity = '1';

            if (this.onComplete) this.onComplete();

            setTimeout(() => {
                if (this.largeScript) {
                    this.largeScript.style.animation = 'scriptFloat 4s infinite ease-in-out, scriptGlow 3s infinite ease-in-out, scriptGlitch 5s infinite linear';
                }
            }, 700);

            // 5mp után a sötétítés elhalványul, de a tárgy marad
            setTimeout(() => {
                if (this.overlay) this.overlay.style.opacity = '0';
                if (this._label) this._label.style.opacity = '0';
            }, 5000);
        });
    }

    /**
     * FÁZIS B: Berepülés az inventory slotba
     */
    playPhaseB() {
        return new Promise((resolve) => {
            if (!this.container || !this.largeScript) {
                resolve();
                return;
            }

            // Állítsuk le a díszítő animációkat
            this.largeScript.style.animation = 'none';
            this.glow.style.transition = 'opacity 0.4s';
            this.glow.style.opacity = '0';
            if (this._label) this._label.style.opacity = '0';

            // A kép elhalványul és kicsit osszezsugorodik
            this.largeScript.style.transition = 'opacity 0.3s ease-in, transform 0.3s ease-in';
            this.largeScript.style.opacity = '0';
            this.largeScript.style.transform = 'translate(-50%, -50%) scale(0.8)';

            if (!this.targetSlot) {
                this.overlay.style.opacity = '0';
                setTimeout(() => {
                    this._cleanup();
                    resolve();
                }, 500);
                return;
            }

            // Berepülő ikon (kriksz-kraksz szimbólum - terminal ikon)
            this.dropIcon = document.createElement('div');
            this.dropIcon.className = 'script-drop-icon';
            this.dropIcon.innerHTML = `<span class="material-symbols-outlined" style="font-size: 40px;">terminal</span>`;

            const largeRect = this.largeScript.getBoundingClientRect();

            Object.assign(this.dropIcon.style, {
                position: 'fixed',
                top: `${largeRect.top + largeRect.height / 2 - 20}px`,
                left: `${largeRect.left + largeRect.width / 2 - 20}px`,
                padding: '10px',
                borderRadius: '4px',
                backgroundColor: 'rgba(0, 242, 255, 0.2)',
                border: '1px solid #00f2ff',
                color: '#00f2ff',
                zIndex: '10000',
                transition: 'all 0.8s cubic-bezier(0.5, 0, 0.5, 1)',
                boxShadow: '0 0 15px rgba(0, 242, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            });

            this.container.appendChild(this.dropIcon);

            const slotRect = this.targetSlot.getBoundingClientRect();

            requestAnimationFrame(() => {
                this.dropIcon.style.top = `${slotRect.top}px`;
                this.dropIcon.style.left = `${slotRect.left}px`;
                this.dropIcon.style.width = `${slotRect.width}px`;
                this.dropIcon.style.height = `${slotRect.height}px`;
                this.dropIcon.style.transform = 'scale(0.8)';
                this.dropIcon.style.opacity = '0.7';

                this.overlay.style.opacity = '0';

                setTimeout(() => {
                    this._cleanup();
                    resolve();
                }, 850);
            });
        });
    }

    play() {
        return new Promise((resolve) => {
            this.playPhaseA();
            setTimeout(() => {
                this.playPhaseB().then(resolve);
            }, 2000);
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
    }

    destroy() {
        this._cleanup();
    }
}

export default ScriptPartAnimation;
