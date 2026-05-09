/**
 * SummarySlideGrade4 - 4. évfolyam (Quantum Terminal) összegző dia
 * 
 * Megjeleníti:
 * - Gratuláció (Quantum Terminal stílusban)
 * - Név és Osztály
 * - Elért összpontszám
 * - Teljesített idő
 * 
 * Pixel-pontos elhelyezés a gratulacio_alap_fekvo.jpg háttérképen.
 */
import GameStateManager from '../../core/state/GameStateManager.js';
import TimeManager from '../../core/time/TimeManager.js';
import '../styles/SummaryGrade4.css';

/**
 * @class SummarySlideGrade4
 * @description A 4. évfolyam záróképernyőjéért felelős komponens.
 */
export class SummarySlideGrade4 {
    /**
     * @constructor
     * @param {Object} slideData - A dia adatai a konfigurációból.
     * @param {Object} options - Opcionális függőségek (stateManager, timeManager, onNext).
     */
    constructor(slideData, options = {}) {
        this.slideData = slideData;
        this.options = options;
        this.stateManager = options.stateManager || GameStateManager;
        this.timeManager = options.timeManager || TimeManager;
        this.element = null;
        this.contentElement = null;
        this.scalerElement = null;
    }

    /**
     * Létrehozza a komponens DOM struktúráját.
     * @returns {HTMLElement} A létrehozott HTML elem.
     */
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'dkv-summary-g4';

        const userProfile = this.stateManager.getStateValue('userProfile') || {};
        const score = this.stateManager.getStateValue('score') || 0;
        const timeMs = this.timeManager.getElapsedTime();
        const avatar = this.stateManager.getStateValue('avatar');

        // Karakter kép meghatározása (Grade 4 esetén teljes elérési út)
        let charSrc = '';
        if (avatar && typeof avatar === 'string') {
            if (avatar.includes('/') || avatar.includes('\\')) {
                // Ha teljes útvonal, konvertáljuk large-ra és _n.jpg-re
                charSrc = avatar.replace('/small/', '/large/').replace('_k.jpg', '_n.jpg');
            } else {
                // Fallback ID-alapú logika
                charSrc = `assets/images/grade4/karakter/large/${avatar}_n.jpg`;
            }
        } else {
            charSrc = `assets/images/grade4/karakter/large/boy_1_n.jpg`;
        }

        const dateStr = new Date().toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' });

        // Háttérképek: slide image a blurhöz, gratuláció a tanúsítványhoz
        const blurBgUrl = this.slideData.content?.imageUrl || '';
        const blurBgStyle = blurBgUrl ? `style="background-image: url('${blurBgUrl}')"` : '';
        const certBgUrl = 'assets/images/grade4/slides/gratulacio_alap_fekvo.jpg';

        this.element.innerHTML = `
            <div class="dkv-summary-g4__blur" ${blurBgStyle}></div>
            <div class="dkv-summary-g4__scaler">
                <div class="dkv-summary-g4__content">
                    <img src="${certBgUrl}" 
                         class="dkv-summary-g4__bg" 
                         alt="Háttér">
                    
                    <div class="dkv-summary-g4__character-container">
                        <img id="cert-img-summary-g4" class="dkv-summary-g4__character-img" src="${charSrc}" alt="Karakter">
                    </div>

                    <div id="summary-name-g4" class="dkv-summary-g4__text dkv-summary-g4__text--name">${userProfile.name || 'Hős'}</div>
                    <div id="summary-class-g4" class="dkv-summary-g4__text dkv-summary-g4__text--class">${userProfile.classId || '-'}</div>
                    <div id="summary-score-g4" class="dkv-summary-g4__text dkv-summary-g4__text--score">${score}</div>
                    <div id="summary-time-g4" class="dkv-summary-g4__text dkv-summary-g4__text--time">${this._formatTime(timeMs)}</div>
                    <div id="summary-date-g4" class="dkv-summary-g4__text dkv-summary-g4__text--date">${dateStr}</div>

                    <div class="dkv-summary-g4__kingdom-container">
                        <img class="dkv-summary-g4__kingdom-img" src="assets/images/grade4/slides/kingdome.jpg" alt="Kingdom">
                    </div>
                </div>
            </div>
        `;

        this.scalerElement = this.element.querySelector('.dkv-summary-g4__scaler');
        this.contentElement = this.element.querySelector('.dkv-summary-g4__content');

        // Skálázás indítása
        this._handleResizeBound = this._handleResize.bind(this);
        setTimeout(() => this._handleResizeBound(), 100);
        window.addEventListener('resize', this._handleResizeBound);

        return this.element;
    }

    /**
     * Kiszámítja és beállítja a tartalom méretarányos skálázását.
     * @private
     */
    _handleResize() {
        if (!this.scalerElement || !this.contentElement) return;

        // Az oklevelet a képernyő magasságának 85%-ához igazítjuk, 
        // hogy ne lógjon bele a HUD-ba és ne legyen "túl magas"
        const containerHeight = window.innerHeight;
        const scale = (containerHeight * 0.85) / 2480;

        // Abszolút középre igazítás és skálázás
        this.contentElement.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    /**
     * Formázza az eltelt időt (perc és másodperc).
     * @param {number} ms - Ezredmásodpercben mért idő.
     * @returns {string} Formázott időszöveg.
     * @private
     */
    _formatTime(ms) {
        if (isNaN(ms) || ms < 0) return "0 perc 0 másodperc";
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes} perc ${seconds} másodperc`;
    }

    /**
     * Eseménykezelők és időzítők takarítása.
     */
    destroy() {
        if (this._handleResizeBound) {
            window.removeEventListener('resize', this._handleResizeBound);
        }
    }
}
