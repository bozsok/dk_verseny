/**
 * FinaleIntroTask.js
 * Bit-pontos implementáció a LeetPuzzle.js struktúrája alapján.
 */

import './FinaleIntroTask.css';
import Typewriter from '../../../../utils/Typewriter.js';

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
        
        this.init();
    }

    /**
     * Inicializálja a feladatot.
     */
    init() {
        this.render();
    }

    /**
     * Felépíti a feladat DOM struktúráját és elindítja az animációkat.
     */
    render() {
        this.container.innerHTML = '';

        this.element = document.createElement('div');
        this.element.className = 'dkv-finale-intro-container';

        const titleText = `RENDSZER FELÜLÍRÁS ELINDÍTVA: <span style="color: var(--finale-cyan);">FRISSÍTŐSZKRIPT ÖSSZEILLESZTÉSE</span>`;
        // Bit-pontos szöveg a felhasználói kérés alapján (szándékos elírással)
        const subtitleText = `Az összegyűjtött és a megmaradt szkriptrészletekett állítsd össze egy teljes kóddá!`;

        this.element.innerHTML = `
            <div class="glass-panel">
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
                        <p class="dkv-finale-intro__help-text">
                            A frissítőszkript összeállítása kritikus folyamat. A rendelkezésre álló kódtöredékek egyesítésével a rendszer magja újraindítható. Kövesd az utasításokat a sikeres végrehajtáshoz!
                        </p>
                    </div>
                </div>

                <div class="dkv-finale-intro__main-viewport">
                    <div class="dkv-finale-intro__grid-overlay"></div>
                    <span class="material-symbols-outlined dkv-finale-intro__decorative-icon">terminal</span>
                </div>

                <div class="dkv-finale-intro__footer">
                    <div class="dkv-finale-intro__system-status">
                        <div><span class="status-dot status-dot--green"></span> NEURÁLIS KAPCSOLAT: AKTÍV</div>
                        <div><span class="status-dot status-dot--magenta"></span> ADATFOLYAM: KÉSZENLÉT</div>
                    </div>
                    <button class="dkv-finale-intro__execute-btn">VÉGREHAJTÁS</button>
                </div>
            </div>
        `;

        this.container.appendChild(this.element);

        const titleEl = this.element.querySelector('.dkv-finale-intro__title');
        const subtitleEl = this.element.querySelector('.dkv-finale-intro__subtitle');
        const mainViewport = this.element.querySelector('.dkv-finale-intro__main-viewport');
        const footer = this.element.querySelector('.dkv-finale-intro__footer');
        const executeBtn = this.element.querySelector('.dkv-finale-intro__execute-btn');

        // Szekvenciális írógép effekt a LeetPuzzle mintájára
        this.typewriter.type(titleEl, titleText, {
            speed: 25,
            hideCursorOnComplete: true,
            onComplete: () => {
                setTimeout(() => {
                    this.typewriter.type(subtitleEl, subtitleText, {
                        speed: 15,
                        onComplete: () => {
                            // Csak a szöveg után jelennek meg a szekciók
                            mainViewport.classList.add('visible');
                            footer.classList.add('visible');
                        }
                    });
                }, 300);
            }
        });

        // Segítség rendszer inicializálása
        this.setupHelpLogic();

        executeBtn.addEventListener('click', () => {
            this.onComplete();
        });
    }

    /**
     * Beállítja a segítség-rendszer eseménykezelőit.
     */
    setupHelpLogic() {
        const helpBtn = this.element.querySelector('.dkv-finale-intro__help-btn');
        const helpOverlay = this.element.querySelector('.dkv-finale-intro__help-overlay');
        const closeBtn = this.element.querySelector('.dkv-finale-intro__help-close');

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

    /**
     * Megsemmisíti a komponenst és felszabadítja az erőforrásokat.
     */
    destroy() {
        this.typewriter.stop();
        if (this.element) {
            this.element.remove();
        }
    }
}
