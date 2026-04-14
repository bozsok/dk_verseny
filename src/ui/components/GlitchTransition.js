
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
     * Befejezés és takarítás
     */
    finish() {
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
    }
}
