
/**
 * GlitchTransition - Digitális zavar alapú tranzíció a Grade 4-hez.
 * 
 * Kiváltja a nehézkes WebGL portált egy könnyebb, CSS és Canvas alapú
 * tematikus átmenetre.
 */
export class GlitchTransition {
    /**
     * @param {Object} options 
     * @param {HTMLElement} options.newSlideHtml - Az új dia DOM eleme
     * @param {Function} options.onComplete - Callback a tranzíció végén
     * @param {number} options.duration - A tranzíció hossza ms-ban (default: 2500)
     */
    constructor(options = {}) {
        this.options = options;
        this.newSlideHtml = options.newSlideHtml;
        this.onComplete = options.onComplete || (() => { });
        this.duration = options.duration || 2500;
        this.logger = options.logger || null;

        this.container = null;
        this.contentLayer = null;
        this.canvas = null;
        this.ctx = null;
        this.animationFrameId = null;
        this.startTime = null;

        this.messages = [
            "KVANTUM_ÚJRASZINKRONIZÁLÁS_FOLYAMATBAN...",
            "TÉRIDŐ_KONFIGURÁCIÓ_FRISSÍTÉSE...",
            "ÁLLOMÁSADATOK_DEKÓDOLÁSA...",
            "NEURÁLIS_KAPCSOLAT_STABILIZÁLVA.",
            "TERMINÁL_MAGHOZ_VALÓ_HOZZÁFÉRÉS..."
        ];
        
        this._resizeHandler = this._handleResize.bind(this);
        this._finishTimer = null;
        this._isDestroyed = false;

        this._audioCtx = null; // Web Audio API kontextus (lazy init)
        this._noiseSource = null; // AudioBufferSourceNode
        this._noiseGain = null; // GainNode a hangerőhöz
    }

    /**
     * DOM elemek létrehozása
     */
    createElement() {
        const fragment = document.createDocumentFragment();

        // Fő konténer
        this.container = document.createElement('div');
        this.container.className = 'dkv-glitch-container';

        // Tartalom réteg (ide kerül az új dia)
        this.contentLayer = document.createElement('div');
        this.contentLayer.className = 'dkv-glitch-content';
        if (this.newSlideHtml) {
            this.contentLayer.appendChild(this.newSlideHtml);
        }
        this.container.appendChild(this.contentLayer);

        // RGB rétegek szimulációhoz (opcionális, CSS animációval is megoldható)
        const layers = document.createElement('div');
        layers.className = 'dkv-glitch-layers';
        ['red', 'blue', 'green'].forEach(color => {
            const layer = document.createElement('div');
            layer.className = `dkv-glitch-layer dkv-glitch-${color}`;
            layers.appendChild(layer);
        });
        this.container.appendChild(layers);
        this.layers = layers;

        // Static Noise Canvas
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'dkv-glitch-canvas';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // Üzenet sáv
        this.textElement = document.createElement('div');
        this.textElement.className = 'dkv-glitch-text';
        this.container.appendChild(this.textElement);

        fragment.appendChild(this.container);
        this._handleResize();
        window.addEventListener('resize', this._resizeHandler);

        return fragment;
    }

    /**
     * Átméretezés kezelése a canvas-hez
     */
    _handleResize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth / 2; // Kisebb felbontás a zajhoz
            this.canvas.height = window.innerHeight / 2;
        }
    }

    /**
     * Tranzíció indítása
     */
    start() {
        if (this.logger) this.logger.info('[Glitch] Tranzíció indítása');
        this.startTime = performance.now();

        // Statikus zaj hanghatás indítása
        this._playStaticNoise();

        this._animate();
    }

    /**
     * Animációs ciklus
     */
    _animate() {
        if (this._isDestroyed || !this.startTime) return;

        const now = performance.now();
        const elapsed = now - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1.0);

        // 1. Statikus zaj renderelése
        this._renderNoise();

        // 2. Üzenetek váltása
        const msgIdx = Math.floor(progress * (this.messages.length * 2)) % this.messages.length;
        this.textElement.textContent = `> ${this.messages[msgIdx]}`;

        // 3. Fázisok kezelése
        if (progress < 0.2) {
            // Kezdeti intenzív glitch
            this.layers.style.display = 'block';
            this.container.classList.add('dkv-glitch-vibrate');
        } else if (progress < 0.7) {
            // Köztes állapot: zaj és üzenetek
            this.layers.style.display = (Math.random() > 0.8) ? 'block' : 'none';
        } else if (progress < 1.0) {
            // Levezetés: az új dia megjelenik
            if (this.contentLayer.style.opacity === '0') {
              this.contentLayer.style.opacity = '1';
            }
            this.container.classList.remove('dkv-glitch-vibrate');
            this.layers.style.display = (Math.random() > 0.95) ? 'block' : 'none';
            this.canvas.style.opacity = (1 - progress) * 0.5; // Erősebb zaj a végén is
        } else {
            // Kész
            this.finish();
            return;
        }

        this.animationFrameId = requestAnimationFrame(() => this._animate());
    }

    /**
     * Véletlenszerű digitális zaj generálása
     */
    _renderNoise() {
        if (!this.ctx || !this.canvas) return;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const imageData = this.ctx.createImageData(w, h);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const val = Math.random() * 255;
            data[i] = val;
            data[i+1] = val;
            data[i+2] = val;
            data[i+3] = 255;
        }

        this.ctx.putImageData(imageData, 0, 0);

        // Véletlenszerű horizontális sávok (Analóg TV hiba szimuláció)
        if (Math.random() > 0.85) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            this.ctx.fillRect(0, Math.random() * h, w, Math.random() * 30);
        }
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
                this.logger.warn('[Glitch] AudioContext init failed', e);
            }
        }
    }

    /**
     * Fehér zaj aszinkron pufferelése a főszál tehermentesítése érdekében.
     * @param {number} durationSec - A tranzíció hossza másodpercben.
     * @returns {Promise<AudioBuffer>} Az elkészült zaj puffer.
     * @private
     */
    _generateWhiteNoiseBuffer(durationSec) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const ctx = this._audioCtx;
                if (!ctx) {
                    resolve(null);
                    return;
                }
                const sampleRate = ctx.sampleRate;
                const bufferSize = Math.floor(sampleRate * durationSec);
                const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
                const data = buffer.getChannelData(0);

                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                resolve(buffer);
            }, 0);
        });
    }

    /**
     * Dinamikus analóg fehér zaj szintetizálása szűrőkkel és aszinkron puffereléssel.
     */
    async _playStaticNoise() {
        this._initAudioContext();
        if (!this._audioCtx || this._audioCtx.state === 'closed') return;

        if (this._audioCtx.state === 'suspended') {
            this._audioCtx.resume().catch(() => {});
        }

        const ctx = this._audioCtx;
        const durationSec = this.duration / 1000;

        try {
            // Aszinkron pufferelés a project-context.md Audio szabályainak megfelelően
            const buffer = await this._generateWhiteNoiseBuffer(durationSec);
            
            // Ha a generálás közben a komponenst megsemmisítették, lépjünk ki
            if (this._isDestroyed || !this._audioCtx) return;

            const now = ctx.currentTime;

            // 2. Buffer forrás inicializálása
            this._noiseSource = ctx.createBufferSource();
            this._noiseSource.buffer = buffer;
            this._noiseSource.loop = false;

            // 3. Hangerő (Gain Node)
            this._noiseGain = ctx.createGain();
            this._noiseGain.gain.setValueAtTime(0.001, now);
            // Gyors felfutás (50ms attack)
            this._noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.05);

            // Hardveresen gyorsított, natív elhalványítás beütemezése (GC Safety)
            // A teljes hossz 70%-áig tartja a hangerőt, majd fokozatosan elcsendesedik nullára
            const fadeStart = now + durationSec * 0.7;
            const fadeEnd = now + durationSec;
            
            this._noiseGain.gain.setValueAtTime(0.18, fadeStart);
            this._noiseGain.gain.linearRampToValueAtTime(0.001, fadeEnd);

            // 4. Szűrők az igazi "analóg tévé zizegés" (Static Fuzz) eléréséhez
            const lowpass = ctx.createBiquadFilter();
            lowpass.type = 'lowpass';
            lowpass.Q.setValueAtTime(3.5, now); // Markánsabb analóg karakterisztika
            lowpass.frequency.setValueAtTime(2000, now);

            // Felüláteresztő szűrő (Highpass) - toljuk le 100 Hz-re a nehezebb, testesebb mély búgásért
            const highpass = ctx.createBiquadFilter();
            highpass.type = 'highpass';
            highpass.frequency.setValueAtTime(100, now);

            // Összekötések: Source -> Lowpass -> Highpass -> Gain -> Destination
            this._noiseSource.connect(lowpass);
            lowpass.connect(highpass);
            highpass.connect(this._noiseGain);
            this._noiseGain.connect(ctx.destination);

            // Indítás
            this._noiseSource.start(now);
        } catch (e) {
            if (this.logger && typeof this.logger.error === 'function') {
                this.logger.error('[Glitch] Sikertelen zajgenerálás', e);
            }
        }
    }

    /**
     * Zaj hanghatás leállítása és erőforrások biztonságos lecsatolása.
     */
    _stopStaticNoise() {
        try {
            if (this._noiseSource) {
                this._noiseSource.stop();
                this._noiseSource.disconnect();
                this._noiseSource = null;
            }
            if (this._noiseGain) {
                this._noiseGain.disconnect();
                this._noiseGain = null;
            }
        } catch (e) {
            // Csendes fallback
        }
    }

    /**
     * Befejezés és takarítás
     */
    finish() {
        // Hanghatás leállítása
        this._stopStaticNoise();

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        this.onComplete();

        // DOM eltávolítása (késleltetve, hogy a rendszert ne akassza meg)
        this._finishTimer = setTimeout(() => {
            if (this._isDestroyed) return;
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
            this._finishTimer = null;
        }, 100);
    }

    /**
     * Erőforrások felszabadítása
     */
    destroy() {
        if (this.logger) this.logger.info('[Glitch] Megsemmisítés...');
        this._isDestroyed = true;

        // Hanghatás leállítása
        this._stopStaticNoise();
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        if (this._finishTimer) {
            clearTimeout(this._finishTimer);
            this._finishTimer = null;
        }

        window.removeEventListener('resize', this._resizeHandler);

        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        this.container = null;
        this.ctx = null;
        this.canvas = null;
        this._audioCtx = null;
    }
}
