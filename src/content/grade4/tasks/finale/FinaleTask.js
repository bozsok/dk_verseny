import GameLogger from '../../../../core/logging/GameLogger.js';
import Typewriter from '../../../../utils/Typewriter.js';
import { MatrixRain } from './MatrixRain.js';
import './FinaleTask.css';

/**
 * @class FinaleTask
 * @description A Grade 4 modul záró feladata (Neon Terminal).
 * - Verzió: 0.53.0
 * - Állapot: Győzelmi szekvencia, hanghatások és digitális vihar véglegesítve
 * A versenyzőnek a Mátrix-esőben kell megtalálnia az indító kód karaktereit.
 */
export class FinaleTask {
    constructor(container, options = {}) {
        this.container = container;
        this.onComplete = options.onComplete || (() => { });
        this.options = options;
        this.logger = options.logger || new GameLogger({ level: 'INFO', enableConsole: true });
        this.typewriter = new Typewriter();

        // Alapértelmezett indító kód (Grade 4)
        const defaultCode = `*** CORE_REBOOT_INIT ***
async_fragments(5);
execute_override();`;

        this.targetCode = (options.targetCode || defaultCode).replace(/\r\n/g, '\n').trim();

        // Állapotkezelés
        this.collected = new Array(this.targetCode.length).fill(false);
        this.isComplete = false;
        this.startTime = Date.now();

        // UI referenciák
        this.element = null;
        this.matrix = null;
        this.codeDisplay = null;
        this.executeBtn = null;
        this.codeScreen = null;
        this.rebootOverlay = null;
        this.rebootTextEl = null;
        this.winCountdownEl = null;
        this.winBlackoutEl = null;

        /** @type {number[]} - Aktív időzítők listája a takarításhoz */
        this.timeouts = [];

        this.init();
    }

    /**
     * Inicializálja a feladatot.
     */
    init() {
        this.render();
        this.setupMatrix();
        this.runIntroAnimation();
    }

    /**
     * Elindítja a bevezető írógép animációt.
     */
    runIntroAnimation() {
        const titleEl = this.element.querySelector('.dkv-finale-task__title');
        const subtitleEl = this.element.querySelector('.dkv-finale-task__subtitle');
        const container = this.element.querySelector('.dkv-finale-task__intro-container');
        if (!titleEl || !subtitleEl) return;

        const titleText = `RENDSZER FELÜLÍRÁS ELINDÍTVA: <span class="dkv-finale-task__title-highlight">INDÍTÓKÓD ÖSSZEÁLLÍTÁSA</span>`;
        const subtitleText = `Kattints a lehulló fénylő karakterekre, amellyel az indítókódot állíthatod össze. Ha összeállítottad, akkor az ELLENŐRZÉS gombbal kezdeményezheted a Rendszermag újraindítását.`;

        this.typewriter.type(titleEl, titleText, {
            speed: 25,
            beep: true,
            hideCursorOnComplete: true,
            onComplete: () => {
                const t1 = setTimeout(() => {
                    titleEl.classList.add('is-hidden');
                    const t2 = setTimeout(() => {
                        titleEl.style.display = 'none';
                        this._playTaskAudio('finale');
                        this.typewriter.type(subtitleEl, subtitleText, {
                            speed: 25,
                            onComplete: () => {
                                const t3 = setTimeout(() => {
                                    if (container) {
                                        container.classList.add('is-hidden');
                                        const t4 = setTimeout(() => { container.remove(); }, 1000);
                                        this.timeouts.push(t4);
                                    }
                                }, 5000);
                                this.timeouts.push(t3);
                            }
                        });
                    }, 1000);
                    this.timeouts.push(t2);
                }, 5000);
                this.timeouts.push(t1);
            }
        });
    }

    /**
     * Megsemmisíti a komponenst.
     */
    destroy() {
        this.typewriter.stop();
        this.timeouts.forEach(t => clearTimeout(t));
        this.timeouts = [];

        // Feladathang takarítás
        if (this._taskAudio) {
            this._taskAudio.pause();
            this._taskAudio = null;
        }

        if (this.matrix) this.matrix.destroy();
        if (this.element) this.element.remove();

        const helpBtn = this.element?.querySelector('.dkv-finale-task__help-btn');
        const helpOverlay = this.element?.querySelector('.dkv-finale-task__help-overlay');
        const closeBtn = this.element?.querySelector('.dkv-finale-task__help-close');

        if (helpBtn && this._boundOpenHelp) helpBtn.removeEventListener('click', this._boundOpenHelp);
        if (closeBtn && this._boundCloseHelp) closeBtn.removeEventListener('click', this._boundCloseHelp);
        if (helpOverlay && this._boundOverlayClick) helpOverlay.removeEventListener('click', this._boundOverlayClick);
    }

    /**
     * HTML struktúra kirajzolása.
     */
    render() {
        this.container.innerHTML = '';

        this.element = document.createElement('div');
        this.element.className = 'dkv-finale-task';

        this.element.innerHTML = `
            <div id="dkv-matrix-bg"></div>
            <div class="dkv-finale-task__intro-container">
                <h1 class="dkv-finale-task__title"></h1>
                <p class="dkv-finale-task__subtitle"></p>
            </div>
            <div class="dkv-finale-task__code-block">
                <div class="dkv-finale-task__code-header">
                    <span class="dkv-finale-task__header-label">SZKRIPTRÉSZLETEK SZINKRONIZÁLÁSA - ALAP ARCHITEKTÚRA</span>
                    <div class="dkv-finale-task__header-stats">
                        <span class="dkv-finale-task__header-label" id="dkv-collect-stats">BEGYŰJTVE: 0 / 0</span>
                        <button class="dkv-finale-task__help-btn">?</button>
                    </div>
                </div>
                <div class="dkv-finale-task__code-screen">
                    <div class="dkv-finale-task__code-lines" id="dkv-final-lines"></div>
                    <div class="dkv-finale-task__code-display" id="dkv-final-code"></div>
                    <div class="dkv-finale-task__code-reflection"></div>
                    <div class="dkv-finale-task__code-status">
                        <span>SZKRIPT: <span class="dkv-finale-task__status-value">INDÍTÓKÓD</span></span>
                        <span>CÉL: 0x8F2C</span>
                        <span>STÁTUSZ: ÖSSZEÁLLÍTÁS</span>
                    </div>
                </div>
            </div>
            <div class="dkv-finale-task__status-bar">
                <div class="dkv-finale-task__status-indicator">
                    <div class="dkv-finale-task__status-dot dkv-finale-task__status-dot--pulse"></div>
                    <span>REKONSTRUKCIÓS FOLYAMAT</span>
                </div>
                <div id="dkv-finale-status-text">RENDSZER INDÍTÁSÁRA VÁR...</div>
                <div class="dkv-finale-task__status-indicator">
                    <span>ÁLLAPOT: STABIL</span>
                </div>
            </div>
            <div class="dkv-finale-task__footer-actions">
                <span class="dkv-finale-task__footer-hint">ÖSSZES KARAKTER SZÜKSÉGES</span>
                <button class="dkv-finale-task__execute-btn" disabled>ELLENŐRZÉS</button>
            </div>
            <div class="dkv-finale-task__top-info">
                ELLENŐRZÖTT RENDSZERMAG...<br>
                BIZTONSÁGOS HÉJPROGRAM AKTÍV - [67]_ER
            </div>
            <div class="dkv-finale-task__help-overlay">
                <div class="dkv-finale-task__help-content">
                    <div class="dkv-finale-task__help-header">
                        <span class="dkv-finale-task__help-label">RENDSZER SEGÉDLET // REKONSTRUKCIÓS PROTOKOLL</span>
                        <button class="dkv-finale-task__help-close">×</button>
                    </div>
                    <p class="dkv-finale-task__help-text">
                        A képernyőn lehulló karakterek közül kattints a fényes karakterre. Ekkor az a fényes karakter bekerül a terminál kódblokkjába. Gyűjtsd össze a kódblokkban a hiányzó karaktereket és állítsd össze a hibátlan indítókódot, amelyet az ELLENŐRZÉS gombbal tudsz felülvizsgálni. Helyes indítókód esetén a Rendszermag újraindítása automatikusan megtörténik.
                    </p>
                </div>
            </div>
            <!-- Win Sequence Overlays (Fixed) -->
            <div class="dkv-finale-task__reboot-overlay" style="display: none;">
                <div class="dkv-finale-task__reboot-text"></div>
                <div class="dkv-finale-task__win-countdown" style="display: none;">3</div>
            </div>
        `;

        this.container.appendChild(this.element);

        // Win Blackout (Body level to prevent flicker)
        this.winBlackoutEl = document.createElement('div');
        this.winBlackoutEl.className = 'dkv-finale-task__win-blackout';
        document.body.appendChild(this.winBlackoutEl);

        this.codeDisplay = this.element.querySelector('#dkv-final-code');
        this.statsDisplay = this.element.querySelector('#dkv-collect-stats');
        this.executeBtn = this.element.querySelector('.dkv-finale-task__execute-btn');
        this.statusText = this.element.querySelector('#dkv-finale-status-text');
        this.codeScreen = this.element.querySelector('.dkv-finale-task__code-screen');
        this.rebootOverlay = this.element.querySelector('.dkv-finale-task__reboot-overlay');
        this.rebootTextEl = this.rebootOverlay.querySelector('.dkv-finale-task__reboot-text');
        this.winCountdownEl = this.rebootOverlay.querySelector('.dkv-finale-task__win-countdown');

        this.executeBtn.addEventListener('click', () => this.handleExecute());
        this.setupHelpLogic();
        this.initCodeSpans();
        this.updateStats();
    }

    /**
     * Feladathang lejátszása.
     * @param {string} filename - A hangfájl neve kiterjesztés nélkül.
     */
    _playTaskAudio(filename) {
        if (this._taskAudio) {
            this._taskAudio.pause();
            this._taskAudio = null;
        }

        const basePath = import.meta.env?.BASE_URL || '/';
        const cleanBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
        const src = `${cleanBase}/assets/audio/grade4/tasks/${filename}.mp3`;

        const audio = new Audio(src);
        audio.volume = window.DKV_APP?.narrationVolume ?? 1.0;
        this._taskAudio = audio;

        audio.play().catch(err => {
            this.logger.warn(`Feladathang lejátszása sikertelen: ${src}`, { error: err.message });
        });
    }

    setupHelpLogic() {
        const helpBtn = this.element.querySelector('.dkv-finale-task__help-btn');
        const helpOverlay = this.element.querySelector('.dkv-finale-task__help-overlay');
        const closeBtn = this.element.querySelector('.dkv-finale-task__help-close');
        if (helpBtn && helpOverlay) {
            this._boundOpenHelp = () => helpOverlay.classList.add('dkv-finale-task__help-overlay--open');
            this._boundCloseHelp = () => helpOverlay.classList.remove('dkv-finale-task__help-overlay--open');
            this._boundOverlayClick = (e) => { if (e.target === helpOverlay) this._boundCloseHelp(); };
            helpBtn.addEventListener('click', this._boundOpenHelp);
            closeBtn?.addEventListener('click', this._boundCloseHelp);
            helpOverlay.addEventListener('click', this._boundOverlayClick);
        }
    }

    initCodeSpans() {
        this.codeDisplay.innerHTML = '';
        let charIndex = 0;
        const lines = this.targetCode.split('\n');
        lines.forEach((line, lineIdx) => {
            const lineWrapper = document.createElement('div');
            lineWrapper.className = 'dkv-finale-task__code-line';
            for (let i = 0; i < line.length; i++) {
                const span = document.createElement('span');
                span.textContent = line[i];
                span.className = 'dkv-finale-task__char dkv-finale-task__char--inactive';
                span.setAttribute('data-char-index', charIndex++);
                lineWrapper.appendChild(span);
            }
            this.codeDisplay.appendChild(lineWrapper);
            if (lineIdx < lines.length - 1) charIndex++;
        });
        const linesContainer = this.element.querySelector('#dkv-final-lines');
        if (linesContainer) {
            linesContainer.innerHTML = lines.map((_, i) => `<div>${(i + 1).toString().padStart(2, '0')}</div>`).join('');
        }
    }

    setupMatrix() {
        const needed = this.targetCode.split('').filter((char, idx) => char.trim() !== '' && !this.collected[idx]);
        this.matrix = new MatrixRain(this.element.querySelector('#dkv-matrix-bg'), {
            onCharClick: (char) => this.handleCharMatch(char)
        });
        this.matrix.setNeededChars(needed);
    }

    handleCharMatch(char) {
        let foundIdx = -1;
        for (let i = 0; i < this.targetCode.length; i++) {
            if (this.targetCode[i] === char && !this.collected[i]) {
                foundIdx = i;
                break;
            }
        }
        if (foundIdx !== -1) {
            this.collected[foundIdx] = true;
            const span = this.codeDisplay.querySelector(`[data-char-index="${foundIdx}"]`);
            if (span) {
                span.classList.remove('dkv-finale-task__char--inactive');
                void span.offsetWidth;
                span.classList.add('dkv-finale-task__char--active');
            }
            this.updateStats();
            this.checkWinCondition();
            this.updateMatrixNeeded();
        }
    }

    updateMatrixNeeded() {
        const needed = this.targetCode.split('').filter((char, idx) => char.trim() !== '' && !this.collected[idx]);
        this.matrix.setNeededChars(needed);
    }

    updateStats() {
        const total = this.targetCode.replace(/[\s\n]/g, '').length;
        const current = this.collected.filter((c, idx) => c && this.targetCode[idx].trim() !== '').length;
        this.statsDisplay.textContent = `BEGYŰJTVE: ${current} / ${total}`;
    }

    checkWinCondition() {
        const allCollected = this.targetCode.split('').every((char, idx) => (char === ' ' || char === '\n') ? true : this.collected[idx]);
        if (allCollected && !this.isComplete) {
            this.isComplete = true;
            this.executeBtn.classList.add('dkv-finale-task__execute-btn--active');
            this.executeBtn.disabled = false;
            if (this.statusText) {
                this.statusText.textContent = 'INICIALIZÁLÁS_KÉSZ';
                this.statusText.style.color = 'var(--finale-cyan)';
            }
            const hint = this.element.querySelector('.dkv-finale-task__footer-hint');
            if (hint) hint.textContent = 'RENDSZER INDÍTÁSRA KÉSZ';
        }
    }

    /**
     * Kezeli az ELLENŐRZÉS gomb megnyomását.
     */
    handleExecute() {
        if (!this.isComplete || this.isExecuting) return;
        this.isExecuting = true;

        // Gomb azonnali letiltása és állapotának módosítása
        if (this.executeBtn) {
            this.executeBtn.disabled = true;
            this.executeBtn.classList.remove('dkv-finale-task__execute-btn--active');
            this.executeBtn.classList.add('dkv-finale-task__execute-btn--spent');
        }

        // Erőteljes glitch effekt 2 másodpercig
        if (this.codeScreen) {
            this.codeScreen.classList.add('is-glitching');
        }

        if (this.statusText) {
            this.statusText.textContent = 'ADATOK_ELLENŐRZÉSE...';
        }

        const t = setTimeout(() => {
            if (this.codeScreen) this.codeScreen.classList.remove('is-glitching');

            // Azonnali befejezés jelezése a keretrendszernek, átadva saját magát (this)
            this.onComplete({
                success: true,
                points: 10,
                maxPoints: 10,
                timeElapsed: (Date.now() - this.startTime) / 1000
            }, this);
        }, 2000); // 2 másodperces "kiélvezhető" glitch
        this.timeouts.push(t);
    }

    /**
     * A győzelmi szekvencia futtatása az összegző modal bezárása után.
     */
    runWinSequence(onNextSlide) {
        if (!this.codeScreen) { onNextSlide(); return; }

        // 1. Mini monitor összeomlás effekt ("ütős effekt")
        this.codeScreen.classList.add('is-collapsing');

        const t1 = setTimeout(() => {
            // 2. Újraindítás felirat megjelenítése a KÉPERNYŐ közepén
            if (this.rebootOverlay && this.rebootTextEl) {
                this.rebootOverlay.style.display = 'flex';
                const rebootHtml = `RENDSZERMAG ÚJRAINDÍTÁS: <span class="dkv-finale-task__reboot-highlight">ELKEZDŐDÖTT</span>`;

                this.typewriter.type(this.rebootTextEl, rebootHtml, {
                    speed: 25,
                    beep: true,
                    hideCursorOnComplete: true,
                    onComplete: () => {
                        // 3. Várakozás 4 másodpercig a kiírás után
                        const t2 = setTimeout(() => {
                            this.rebootTextEl.style.display = 'none';
                            this.startFinalCountdown(onNextSlide);
                        }, 4000);
                        this.timeouts.push(t2);
                    }
                });
            }
        }, 1000);
        this.timeouts.push(t1);
    }

    /**
     * Elindítja a végső 3-2-1 visszaszámlálást a lezárás előtt.
     * @param {Function} onNext - A lezárás utáni callback.
     */
    startFinalCountdown(onNext) {
        if (!this.winCountdownEl) {
            onNext();
            return;
        }

        this.winCountdownEl.style.display = 'block';

        const startTime = performance.now();
        const duration = 3000;
        let lastLoggedSecond = -1;

        const update = () => {
            const now = performance.now();
            const elapsed = now - startTime;
            const remaining = Math.max(0, duration - elapsed);
            const currentSecond = Math.ceil(remaining / 1000);

            // Csak akkor frissítünk és csipogunk, ha változott a másodperc
            if (currentSecond !== lastLoggedSecond && currentSecond > 0) {
                this.winCountdownEl.textContent = currentSecond;
                this.typewriter.playBeep();
                lastLoggedSecond = currentSecond;
            }

            if (elapsed < duration) {
                // UI frissítési ütem (UI refresh trigger) - megfelel a 112. szabálynak
                const t = setTimeout(update, 50);
                this.timeouts.push(t);
            } else {
                // A visszaszámlálás véget ért
                this.winCountdownEl.style.display = 'none';
                this.performFinalBlackout(onNext);
            }
        };

        update();
    }

    /**
     * Utolsó elsötétítés és várakozás 3mp-ig.
     */
    performFinalBlackout(onNext) {
        if (this.winBlackoutEl) this.winBlackoutEl.classList.add('is-active');

        const t = setTimeout(() => {
            // 1. Diaváltás a háttérben
            onNext();

            // 2. Feladat bezárása és takarítás
            setTimeout(() => {
                if (this.options.gameInterface) this.options.gameInterface.hideTaskModal();
                this.destroy();

                // 3. Elsötétítés (blackout) eltávolítása (fokozatosan)
                setTimeout(() => {
                    if (this.winBlackoutEl) {
                        this.winBlackoutEl.classList.remove('is-active');
                        setTimeout(() => this.winBlackoutEl.remove(), 1000);
                    }
                }, 500);
            }, 200); // Rövid várakozás a diaváltás után
        }, 3000); // 3 másodperces sötétség
        this.timeouts.push(t);
    }
}
