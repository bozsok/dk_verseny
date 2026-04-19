import GameLogger from '../../../../core/logging/GameLogger.js';
import './SpeedTask.css';

/**
 * SpeedTask - Bit-folyam Zsilipje feladat (Station 5)
 */
export class SpeedTask {
    /**
     * @param {HTMLElement} container - A befoglaló DOM elem
     * @param {Object} options - Feladat beállítások
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = options;
        this.onComplete = options.onComplete || (() => { });
        this.logger = options.logger || new GameLogger({ level: 'INFO', enableConsole: true });
        
        this.element = null;
        this.init();
    }

    init() {
        this.logger.info('SpeedTask initialized (Station 5)');
        this.render();
    }

    render() {
        this.container.innerHTML = '';

        this.element = document.createElement('div');
        this.element.className = 'dkv-speed-container';

        const titleText = `RENDSZER FELÜLÍRÁS ELINDÍTVA: <span style="color: var(--spd-cyan);">SZINKRONIZÁCIÓ INICIALIZÁLVA</span>`;
        const subtitleText = `A zsilip kinyitásához synchronizálnod kell a bit-folyamot! Kattints a megfelelő időben a gombokra az adatok áramlásához.`;

        this.element.innerHTML = `
            <div class="glass-panel">
                <div class="scanline"></div>
                
                <div class="dkv-speed__header">
                    <span class="dkv-speed__header-label">RENDSZERSZINTŰ KIVÉTEL // ADATFOLYAM ZSILIP</span>
                    <h1 class="dkv-speed__title">${titleText}</h1>
                    <p class="dkv-speed__subtitle">${subtitleText}</p>
                    <button class="dkv-speed__help-btn">?</button>
                </div>

                <!-- HELP OVERLAY -->
                <div class="dkv-speed__help-overlay">
                    <div class="dkv-speed__help-content">
                        <div class="dkv-speed__help-header">
                            <span class="dkv-speed__help-label">RENDSZER SEGÉDLET // SZINKRONIZÁCIÓS PROTOKOLL</span>
                            <button class="dkv-speed__help-close">×</button>
                        </div>
                        <p class="dkv-speed__help-text">
                            A zsilip kinyitásához synchronizálnod kell a bit-folyamot. Kattints a megfelelő időben a gombokra a csatlakozáshoz. A pontos időzítés kulcsfontosságú a sikeres áttöréshez.
                        </p>
                    </div>
                </div>

                <div class="dkv-speed__main-viewport">
                    <!-- A tényleges feladat helye -->
                </div>

                <div class="dkv-speed__footer">
                    <div class="dkv-speed__system-status">
                        <div><span class="status-dot status-dot--green"></span> NEURÁLIS KAPCSOLAT: AKTÍV</div>
                        <div><span class="status-dot status-dot--magenta" style="background: #ff51fa; animation: pulse 1s infinite;"></span> BIT-FOLYAM: SZINKRONIZÁLÁS</div>
                    </div>
                    <button class="dkv-speed__execute-btn">VÉGREHAJTÁS</button>
                </div>
            </div>
        `;

        this.container.appendChild(this.element);

        this.executeBtn = this.element.querySelector('.dkv-speed__execute-btn');
        this.setupHelpLogic();

        this.executeBtn.addEventListener('click', () => {
            this.logger.info('SpeedTask completed via unified button');
            this.onComplete({
                success: true,
                points: 100,
                maxPoints: 100,
                timeElapsed: 0
            });
        });
    }

    /**
     * Segítség panel kezelése.
     */
    setupHelpLogic() {
        const helpBtn = this.element.querySelector('.dkv-speed__help-btn');
        const helpOverlay = this.element.querySelector('.dkv-speed__help-overlay');
        const closeBtn = this.element.querySelector('.dkv-speed__help-close');

        if (helpBtn && helpOverlay) {
            helpBtn.addEventListener('click', () => {
                helpOverlay.classList.add('open');
            });

            closeBtn?.addEventListener('click', () => {
                helpOverlay.classList.remove('open');
            });

            helpOverlay.addEventListener('click', (e) => {
                if (e.target === helpOverlay) {
                    helpOverlay.classList.remove('open');
                }
            });
        }
    }

    destroy() {
        if (this.element) {
            this.element.remove();
        }
    }
}
