import GameLogger from '../../../../core/logging/GameLogger.js';
import './LibraryTask.css';

/**
 * LibraryTask - Logikai Könyvtár feladat (Station 3)
 */
export class LibraryTask {
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
        this.logger.info('LibraryTask initialized (Station 3)');
        this.render();
    }

    render() {
        this.container.innerHTML = '';

        this.element = document.createElement('div');
        this.element.className = 'dkv-library-container';

        const titleText = `RENDSZER FELÜLÍRÁS ELINDÍTVA: <span style="color: var(--lib-cyan);">LOGIKAI KÖNYVTÁR INICIALIZÁLVA</span>`;
        const subtitleText = `Rendszerezd a könyvtár adatait! Használd a logikai kapukat a helyes archiváláshoz.`;

        this.element.innerHTML = `
            <div class="glass-panel">
                <div class="scanline"></div>
                
                <div class="dkv-library__header">
                    <span class="dkv-library__header-label">RENDSZERSZINTŰ KIVÉTEL // KÖNYVTÁRI PROTOKOLL</span>
                    <h1 class="dkv-library__title">${titleText}</h1>
                    <p class="dkv-library__subtitle">${subtitleText}</p>
                    <button class="dkv-library__help-btn">?</button>
                </div>

                <!-- HELP OVERLAY -->
                <div class="dkv-library__help-overlay">
                    <div class="dkv-library__help-content">
                        <div class="dkv-library__help-header">
                            <span class="dkv-library__help-label">RENDSZER SEGÉDLET // KÖNYVTÁRI ADATBÁZIS</span>
                            <button class="dkv-library__help-close">×</button>
                        </div>
                        <p class="dkv-library__help-text">
                            A könyvek kategorizálásához használd a logikai kapukat. Figyeld a jelzéseket és húzd a megfelelő helyre az elemeket a sikeres archiváláshoz.
                        </p>
                    </div>
                </div>

                <div class="dkv-library__main-viewport">
                    <!-- A tényleges feladat helye -->
                </div>

                <div class="dkv-library__footer">
                    <div class="dkv-library__system-status">
                        <div><span class="status-dot status-dot--green"></span> NEURÁLIS KAPCSOLAT: AKTÍV</div>
                        <div><span class="status-dot status-dot--magenta" style="background: #ff51fa; animation: pulse 1s infinite;"></span> KÖNYVTÁR ANALÍZIS: FOLYAMATBAN</div>
                    </div>
                    <button class="dkv-library__execute-btn">VÉGREHAJTÁS</button>
                </div>
            </div>
        `;

        this.container.appendChild(this.element);

        this.executeBtn = this.element.querySelector('.dkv-library__execute-btn');
        this.setupHelpLogic();

        this.executeBtn.addEventListener('click', () => {
            this.logger.info('LibraryTask completed via unified button');
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
        const helpBtn = this.element.querySelector('.dkv-library__help-btn');
        const helpOverlay = this.element.querySelector('.dkv-library__help-overlay');
        const closeBtn = this.element.querySelector('.dkv-library__help-close');

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
