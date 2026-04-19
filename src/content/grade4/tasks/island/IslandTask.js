import GameLogger from '../../../../core/logging/GameLogger.js';
import './IslandTask.css';

/**
 * IslandTask - Anomáliák Szigete feladat (Station 4)
 */
export class IslandTask {
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
        this.logger.info('IslandTask initialized (Station 4)');
        this.render();
    }

    render() {
        this.container.innerHTML = '';

        this.element = document.createElement('div');
        this.element.className = 'dkv-island-container';

        const titleText = `RENDSZER FELÜLÍRÁS ELINDÍTVA: <span style="color: var(--isl-cyan);">ANOMÁLIA ANALÍZIS KÉSZÜLTSÉG</span>`;
        const subtitleText = `Keresd meg az anomáliákat a szigeten! A gyanús területeket vizsgáld meg alaposabban a szkenner segítségével a helyreállításhoz.`;

        this.element.innerHTML = `
            <div class="glass-panel">
                <div class="scanline"></div>
                
                <div class="dkv-island__header">
                    <span class="dkv-island__header-label">RENDSZERSZINTŰ KIVÉTEL // MEGJELENÍTÉSI ANOMÁLIA</span>
                    <h1 class="dkv-island__title">${titleText}</h1>
                    <p class="dkv-island__subtitle">${subtitleText}</p>
                    <button class="dkv-island__help-btn">?</button>
                </div>

                <!-- HELP OVERLAY -->
                <div class="dkv-island__help-overlay">
                    <div class="dkv-island__help-content">
                        <div class="dkv-island__help-header">
                            <span class="dkv-island__help-label">RENDSZER SEGÉDLET // ANOMÁLIA PROTOKOLL</span>
                            <button class="dkv-island__help-close">×</button>
                        </div>
                        <p class="dkv-island__help-text">
                            Keresd meg az anomáliákat a szigeten. A gyanús területeket vizsgáld meg alaposabban a szkenner segítségével. A sikeres azonosítás után az adatok helyreállnak.
                        </p>
                    </div>
                </div>

                <div class="dkv-island__main-viewport">
                    <!-- A tényleges feladat helye -->
                </div>

                <div class="dkv-island__footer">
                    <div class="dkv-island__system-status">
                        <div><span class="status-dot status-dot--green"></span> NEURÁLIS KAPCSOLAT: AKTÍV</div>
                        <div><span class="status-dot status-dot--magenta" style="background: #ff51fa; animation: pulse 1s infinite;"></span> SZKENNER ÁLLAPOT: ONLINE</div>
                    </div>
                    <button class="dkv-island__execute-btn">VÉGREHAJTÁS</button>
                </div>
            </div>
        `;

        this.container.appendChild(this.element);

        this.executeBtn = this.element.querySelector('.dkv-island__execute-btn');
        this.setupHelpLogic();

        this.executeBtn.addEventListener('click', () => {
            this.logger.info('IslandTask completed via unified button');
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
        const helpBtn = this.element.querySelector('.dkv-island__help-btn');
        const helpOverlay = this.element.querySelector('.dkv-island__help-overlay');
        const closeBtn = this.element.querySelector('.dkv-island__help-close');

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
