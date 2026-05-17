
/**
 * CountdownAnimation - 3-2-1 visszaszámlálás Grade 4-hez.
 * 
 * Megjeleníti a 3.png, 2.png és 1.png képeket a képernyő közepén
 * állomás váltás előtt.
 */
export class CountdownAnimation {
    /**
     * @param {Object} options 
     * @param {Function} options.onComplete - Callback a visszaszámlálás végén
     */
    constructor(options = {}) {
        this.onComplete = options.onComplete || (() => { });
        this.logger = options.logger || null;
        this.container = null;
        this.images = [
            'assets/images/grade4/others/3.png',
            'assets/images/grade4/others/2.png',
            'assets/images/grade4/others/1.png'
        ];

        this._timers = []; // Aktív időzítők követése
        this._isDestroyed = false;

        // Stílus konténer animációkhoz
        this.styleTag = document.getElementById('dkv-countdown-animation-styles');
        if (!this.styleTag) {
            this.styleTag = document.createElement('style');
            this.styleTag.id = 'dkv-countdown-animation-styles';
            this.styleTag.innerHTML = `
                @keyframes countdownGlitch {
                    0% { transform: scale(1) translate(0,0); filter: drop-shadow(0 0 10px #00f2ff); opacity: 1; }
                    5% { transform: scale(1.1) translate(-5px, 2px) skewX(10deg); filter: drop-shadow(-5px 0 #ff00c1) drop-shadow(5px 0 #00f2ff); opacity: 0.8; }
                    10% { transform: scale(1) translate(5px, -2px) skewX(-10deg); filter: drop-shadow(0 0 15px #00f2ff); opacity: 1; }
                    15% { clip-path: inset(20% 0 50% 0); transform: translate(-2px, 2px); }
                    20% { clip-path: inset(0 0 0 0); transform: translate(0,0); }
                    100% { transform: scale(1) translate(0,0); filter: drop-shadow(0 0 10px #00f2ff); opacity: 1; }
                }
                @keyframes countdownScanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
                @keyframes labelPulse {
                    0% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); text-shadow: 0 0 15px #00f2ff; }
                    100% { opacity: 0.6; transform: scale(1); }
                }
                .dkv-countdown-image {
                    animation: countdownGlitch 0.4s infinite;
                }
                .dkv-countdown-label {
                    color: #00f2ff;
                    font-family: 'Source Code Pro', monospace;
                    font-size: 1.2rem;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-top: 40px;
                    text-shadow: 0 0 10px rgba(0, 242, 252, 0.7);
                    animation: labelPulse 2s ease-in-out infinite;
                    opacity: 0.8;
                }
                .dkv-countdown-scanline {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 4px;
                    background: rgba(0, 242, 255, 0.3);
                    box-shadow: 0 0 15px #00f2ff;
                    animation: countdownScanline 2s linear infinite;
                    pointer-events: none;
                    z-index: 10011;
                }
            `;
            document.head.appendChild(this.styleTag);
        }

        this._audioCtx = null; // Web Audio API kontextus (lazy init)
    }

    /**
     * Visszaszámlálás lejátszása
     */
    play() {
        return new Promise((resolve) => {
            if (this.logger) this.logger.info('[Countdown] Visszaszámlálás indítása');
            
            this.container = document.createElement('div');
            this.container.className = 'dkv-countdown-overlay';
            Object.assign(this.container.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '10010',
                pointerEvents: 'none',
                backgroundColor: 'rgba(0, 5, 15, 0.6)',
                backdropFilter: 'blur(8px) contrast(1.2)',
                overflow: 'hidden'
            });

            // Scanline hozzáadása
            const scanline = document.createElement('div');
            scanline.className = 'dkv-countdown-scanline';
            this.container.appendChild(scanline);

            // Felirat hozzáadása
            const label = document.createElement('div');
            label.className = 'dkv-countdown-label';
            label.textContent = 'Kvantumugrás a következő szektorba...';
            this.container.appendChild(label);

            document.body.appendChild(this.container);

            this._showStep(0).then(() => {
                if (this._isDestroyed) return;
                this._cleanup();
                if (this.onComplete) this.onComplete();
                resolve();
            });
        });
    }

    /**
     * Egy-egy szám megjelenítése
     */
    async _showStep(index) {
        if (this._isDestroyed || index >= this.images.length) return;

        // Dinamikus, kardinálisan eltérő kvantumugrás hanghatás szintetizálása
        this._playQuantumBeep(index);

        const img = document.createElement('img');
        img.src = this.images[index];
        img.className = 'dkv-countdown-image';

        Object.assign(img.style, {
            maxWidth: '300px',
            maxHeight: '300px',
            objectFit: 'contain',
            opacity: '0',
            transform: 'scale(2)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            filter: 'drop-shadow(0 0 20px rgba(0, 242, 255, 0.8))',
            marginBottom: '20px'
        });

        // Az img-t a felirat elé (fölé) szúrjuk be
        this.container.insertBefore(img, this.container.querySelector('.dkv-countdown-label'));

        // Beúszás
        await new Promise(r => {
            requestAnimationFrame(() => {
                if (this._isDestroyed) return;
                img.style.opacity = '1';
                img.style.transform = 'scale(1)';
                
                const t = setTimeout(r, 600);
                this._timers.push(t);
            });
        });

        if (this._isDestroyed) return;

        // Kiúszás
        img.style.opacity = '0';
        img.style.transform = 'scale(0.5) rotate(10deg)';
        img.style.filter = 'blur(15px) brightness(2)';

        await new Promise(r => {
            const t = setTimeout(r, 200);
            this._timers.push(t);
        });

        if (this._isDestroyed) return;
        img.remove();

        // Rövid szünet a következõ elõtt
        await new Promise(r => {
            const t = setTimeout(r, 100);
            this._timers.push(t);
        });

        if (this._isDestroyed) return;
        await this._showStep(index + 1);
    }

    /**
     * Web Audio API kontextus inicializálása (lazy, egyszeri).
     */
    _initAudioContext() {
        if (this._audioCtx) return;
        try {
            this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            if (this.logger && typeof this.logger.warn === 'function') {
                this.logger.warn('[Countdown] AudioContext init failed', e);
            }
        }
    }

    /**
     * Egyedi, dinamikus "kvantumugrás / teleport" sci-fi hanghatás szintetizálása.
     * Reprezentálja a visszaszámlálást:
     * - Súlyos, mély cyber sub-drop (basszus boom) minden egyes visszaszámlálási lépésnél (3, 2, 1)
     * @param {number} index - A visszaszámlálás aktuális lépése (0: "3", 1: "2", 2: "1")
     */
    _playQuantumBeep(index) {
        this._initAudioContext();
        if (!this._audioCtx || this._audioCtx.state === 'closed') return;

        if (this._audioCtx.state === 'suspended') {
            this._audioCtx.resume().catch(() => {});
        }

        const ctx = this._audioCtx;
        const now = ctx.currentTime;

        // === Súlyos, mély cyber sub-drop (Boom!) minden visszaszámlálási lépésnél ===
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Szinusz és háromszög keveréke a rendkívül tiszta és masszív szub-basszusért
        osc1.type = 'sine';
        osc2.type = 'triangle';

        const startFreq = 220; // Alap frekvencia (A3)
        const endFreq = 55; // Sub-bass frekvencia (A1)
        const duration = 0.8; // Hosszabb, 800ms lecsengés

        // Frekvencia exponenciális csökkenése (sub-drop)
        osc1.frequency.setValueAtTime(startFreq, now);
        osc1.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

        osc2.frequency.setValueAtTime(startFreq * 1.01, now);
        osc2.frequency.exponentialRampToValueAtTime(endFreq * 1.01, now + duration);

        // ADSR hangerő burkológörbe: azonnali beütés, hosszú lecsengés
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.22, now + 0.03); // 30ms attack
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // Szigorú aluláteresztő szűrő (Lowpass), hogy csak a tiszta mély hang zengjen
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.Q.setValueAtTime(4, now); // Kis rezonancia a vágásnál
        filter.frequency.setValueAtTime(250, now);
        filter.frequency.exponentialRampToValueAtTime(80, now + duration);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);
    }

    _cleanup() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        
        // Időzítők kipucolása
        this._timers.forEach(t => clearTimeout(t));
        this._timers = [];
    }

    destroy() {
        if (this.logger) this.logger.info('[Countdown] Megsemmisítés...');
        this._isDestroyed = true;
        this._cleanup();
    }
}
