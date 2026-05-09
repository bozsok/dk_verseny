/**
 * SummarySlide - Verseny végi összegző dia
 * 
 * Megjeleníti:
 * - Gratuláció
 * - Név és Osztály
 * - Elért összpontszám
 * - Teljesített idő (P:M formátumban)
 */
import GameStateManager from '../../core/state/GameStateManager.js';
import TimeManager from '../../core/time/TimeManager.js';

export class SummarySlide {
    constructor(slideData, options = {}) {
        this.slideData = slideData;
        this.options = options;
        this.stateManager = options.stateManager || GameStateManager;
        this.timeManager = options.timeManager || TimeManager;
        this.element = null;
        this.contentElement = null;
        this.scalerElement = null;
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'summary-slide-container';

        const userProfile = this.stateManager.getStateValue('userProfile') || {};
        const score = this.stateManager.getStateValue('score') || 0;
        const timeMs = this.timeManager.getElapsedTime();
        const avatar = this.stateManager.getStateValue('avatar');
        
        // Karakter kép meghatározása (Grade 3 esetén ID: "b1", "g1")
        let charSrc = '';
        if (avatar && typeof avatar === 'string') {
            let charId = 'boy_1';
            if (avatar.startsWith('b')) {
                charId = `boy_${avatar.substring(1)}`;
            } else if (avatar.startsWith('g')) {
                charId = `girl_${avatar.substring(1)}`;
            } else if (avatar.includes('_')) {
                charId = avatar;
            }
            charSrc = `assets/images/grade3/karakter/large/${charId}_n.jpg`;
        } else {
            charSrc = `assets/images/grade3/karakter/large/boy_1_n.jpg`;
        }

        const dateStr = new Date().toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' });

        const bgUrl = this.slideData.content?.imageUrl || '';
        const bgStyle = bgUrl ? `style="background-image: url('${bgUrl}')"` : '';

        this.element.innerHTML = `
            <div class="summary-bg-blur" ${bgStyle}></div>
            <div class="certificate-scaler">
                <div class="certificate-content">
                    <img src="assets/images/grade3/slides/gratulaciol_alap_fekvo.jpg" 
                         class="certificate-bg" 
                         alt="Háttér">
                    
                    <div class="cert-character-container">
                        <img id="cert-img-summary" src="${charSrc}" alt="Karakter">
                        <img class="cert-character-frame" 
                             src="assets/images/grade3/slides/oklevel_keret_fekvo.png" 
                             alt="Keret">
                    </div>

                    <div id="summary-name" class="cert-text">${userProfile.name || 'Hős'}</div>
                    <div id="summary-class" class="cert-text">${userProfile.classId || '-'}</div>
                    <div id="summary-score" class="cert-text">${score}</div>
                    <div id="summary-time" class="cert-text">${this._formatTime(timeMs)}</div>
                    <div id="summary-date" class="cert-text">${dateStr}</div>
                </div>
            </div>
        `;

        this.scalerElement = this.element.querySelector('.certificate-scaler');
        this.contentElement = this.element.querySelector('.certificate-content');

        // Skálázás indítása
        this._handleResizeBound = this._handleResize.bind(this);
        setTimeout(() => this._handleResizeBound(), 100);
        window.addEventListener('resize', this._handleResizeBound);

        return this.element;
    }

    _handleResize() {
        if (!this.scalerElement || !this.contentElement) return;

        const containerWidth = this.scalerElement.offsetWidth;
        const scale = containerWidth / 3508;
        this.contentElement.style.transform = `scale(${scale})`;
    }

    _formatTime(ms) {
        if (isNaN(ms) || ms < 0) return "0 perc 0 másodperc";
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes} perc ${seconds} másodperc`;
    }

    destroy() {
        if (this._handleResizeBound) {
            window.removeEventListener('resize', this._handleResizeBound);
        }
    }
}

export default SummarySlide;
