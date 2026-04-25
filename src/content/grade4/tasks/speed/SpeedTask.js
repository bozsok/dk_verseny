import GameLogger from '../../../../core/logging/GameLogger.js';
import Typewriter from '../../../../utils/Typewriter.js';
import './SpeedTask.css';

/**
 * Menet-állapotok definíciója.
 */
const ROUND_STATE = {
    IDLE: 'idle',
    WAITING: 'waiting',
    COUNTDOWN: 'countdown',
    ACTIVE: 'active',
    ENDED: 'ended'
};

/**
 * @class SpeedTask
 * @description Bit-folyam Zsilipje feladat (Station 5) – Kattintás Csata V4.
 *
 * Három egymás utáni 60 másodperces menetben az OPERATOR (játékos) kattintási
 * sebességét méri egy AI (CORE_AI) ellen. A dominancia%-ból számol pontot.
 */
export class SpeedTask {
    /**
     * @param {HTMLElement} container - A befoglaló DOM elem (a modál body-jából).
     * @param {Object} [options={}] - Feladat beállítások.
     */
    constructor(container, options = {}) {
        /** @type {HTMLElement} */
        this.container = container;
        /** @type {Function} */
        this.onComplete = options.onComplete || (() => { });
        /** @type {GameLogger} */
        this.logger = options.logger || new GameLogger({ level: 'INFO', enableConsole: true });
        /** @type {Typewriter} */
        this.typewriter = new Typewriter();

        /** @type {number[]} - Aktív időzítők listája a takarításhoz. */
        this.timeouts = [];
        /** @type {number|null} - UI frissítő setInterval ID. */
        this.uiRefreshInterval = null;

        /** @type {HTMLElement|null} */
        this.element = null;
        /** @type {HTMLElement|null} */
        this.executeBtn = null;

        /** @type {number} - Feladat kezdési időpont. */
        this.startTime = Date.now();

        // --- Menet-rendszer ---
        /** @type {number} - Aktuális szekció (1–3). */
        this.currentSection = 1;
        /** @type {number} */
        this.maxSections = 3;
        /** @type {number} - Egy menet időtartama (ms). */
        this.roundDuration = 60000;
        /** @type {string} - Aktuális menet állapota. */
        this.roundState = ROUND_STATE.IDLE;
        /** @type {boolean} - AI le van-e fagyasztva (Csapás miatt). */
        this.aiIsFrozen = false;

        // --- Szekciónkénti adatok ---
        /** @type {Array<Object>} */
        this.sections = [];
        for (let i = 0; i < this.maxSections; i++) {
            this.sections.push({
                opClicks: 0,
                aiClicks: 0,
                opPercent: 0,
                aiPercent: 0,
                score: 0,
                strikeCharge: 0
            });
        }

        // Cél kattintásszám 100%-hoz egy menet alatt (pl. 450 kattintás 60mp alatt = 7.5 CPS)
        this.targetClicks = 450;

        // --- Timer ---
        /** @type {number} - Menet kezdési időpont (performance.now). */
        this.roundStartTime = 0;

        // --- Debounce ---
        /** @type {number} */
        this.lastClickTime = 0;
        /** @type {number} - Minimális idő két kattintás között (ms). */
        this.minClickInterval = 10;

        // --- Bound handlerek (a removeEventListener-hez) ---
        this._boundHandleClick = this.handleClick.bind(this);

        // Felhasználói becenév lekérése a StateManager-ből
        this.userNickname = 'OPERATOR';
        try {
            if (window.DKV_APP && window.DKV_APP.stateManager) {
                const nickname = window.DKV_APP.stateManager.getState('userProfile.nickname');
                if (nickname) {
                    this.userNickname = nickname.toUpperCase();
                }
            }
        } catch (e) {
            this.logger.warn('Nem sikerült lekérni a becenevet, marad az OPERATOR fallback.');
        }

        this.logger.info('SpeedTask initialized (Station 5)');
        this.init();
    }

    /**
     * Inicializálás.
     */
    init() {
        this.render();
    }

    /**
     * UI renderelés: keret + Typewriter bevezető szekvencia.
     */
    render() {
        this.container.innerHTML = '';

        this.element = document.createElement('div');
        this.element.className = 'dkv-speed-container';

        const titleText = `RENDSZER FELÜLÍRÁS ELINDÍTVA: <span style="color: var(--spd-cyan);">NYOMÁSSZABÁLYOZÁS ENGEDÉLYEZVE</span>`;
        const subtitleText = `Akadályozd meg egérkattintásokkal a Zéró-szekvencia támadását! A START gombbal kezdheted a zsilip nyomásának szinkronizálását`;

        this.element.innerHTML = `
            <div class="dkv-speed__glass-panel">
                <div class="dkv-speed__scanline"></div>

                <div class="dkv-speed__header">
                    <span class="dkv-speed__header-label">RENDSZERSZINTŰ KIVÉTEL // ADATFOLYAM ENERGETIZÁLÁS</span>
                    <h1 class="dkv-speed__title"></h1>
                    <p class="dkv-speed__subtitle"></p>
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
                            Indtsd el a játékot a START gombbal és a visszaszámlálás után kattintgass folyamatosan a villám gombra! Miközben gyűjtöd a százalákokat, a gomb körül látható indikátor jelzi a CSAPÁS töltését. Ha a töltés befejeződik, akkor a jobb egérgombbal süssed el a villám gombot! Ez egy kis előnyt biztosít neked ahhoz, hogy legyőzzed a Zéró-szekvencia támadását. Háromszor kell legyőznöd a Zéró-szekvenciát.
                        </p>
                    </div>
                </div>

                <div class="dkv-speed__main-viewport">
                    <!-- Dot-grid háttér -->
                    <div class="dkv-speed__dot-grid"></div>

                    <!-- Viewport Header -->
                    <div class="dkv-speed__vp-header">
                        <div class="dkv-speed__vp-header-left">
                            <span class="dkv-speed__vp-label">RENDSZER_MODE:</span>
                            <span class="dkv-speed__vp-mode">SZINKRONIZÁCIÓ INICIALIZÁLVA</span>
                        </div>
                        <div class="dkv-speed__vp-timer-box">
                            <span class="dkv-speed__vp-timer-label">HÁTRALÉVŐ IDŐ</span>
                            <div class="dkv-speed__vp-timer-clock">01:00</div>
                        </div>
                        <div class="dkv-speed__vp-header-right">
                            <span class="dkv-speed__vp-label">ZSILIP_AZONOSÍTÓ:</span>
                            <span class="dkv-speed__vp-ref">AX-772-BETA</span>
                        </div>
                    </div>

                    <!-- Battle Grid: 3 szekció -->
                    <div class="dkv-speed__battle-grid">
                        ${this._renderSections()}
                    </div>
                </div>

                <!-- Viewport Footer – adatfolyam OUTSIDE main-viewport -->
                <div class="dkv-speed__data-stream">
                    <div class="dkv-speed__stream-content">
                        <span><span class="dkv-speed__stream-dot"></span> RENDSZER_STABIL</span>
                        <span>ADATVESZTÉS: 0.0003%</span>
                        <span>SZINKRON_FREKVENCIA: 44.1kHz</span>
                        <span>KÉSLELTETÉS: <span class="dkv-speed__latency-val">12ms</span></span>
                        <span class="dkv-speed__stream-op">OPERATOR_ID: ${this.userNickname}_BATTLE_STATION</span>
                        <span class="dkv-speed__stream-ai">ELLENFÉL: ZÉRÓ-SZEKVENCIA_SIMULATION_V2</span>
                    </div>
                    <div class="dkv-speed__location-tag">LOC: 47.4979° N, 19.0402° E (BUDAPEST_HQ)</div>
                </div>

                <div class="dkv-speed__footer">
                    <div class="dkv-speed__system-status">
                        <div><span class="dkv-speed__status-dot dkv-speed__status-dot--green"></span> NEURÁLIS KAPCSOLAT: AKTÍV</div>
                        <div><span class="dkv-speed__status-dot dkv-speed__status-dot--magenta" style="background: #ff51fa; animation: pulse 1s infinite;"></span> BIT-FOLYAM: SZINKRONIZÁLÁS</div>
                    </div>
                    <button class="dkv-speed__execute-btn" disabled>VÉGREHAJTÁS</button>
                </div>
            </div>
        `;

        this.container.appendChild(this.element);

        // --- DOM referenciák ---
        this.executeBtn = this.element.querySelector('.dkv-speed__execute-btn');
        this.timerClock = this.element.querySelector('.dkv-speed__vp-timer-clock');
        this.battleGrid = this.element.querySelector('.dkv-speed__battle-grid');

        // --- Event-ek ---
        this.setupHelpLogic();
        this.executeBtn.addEventListener('click', () => this.handleExecute());

        // --- Typewriter szekvencia ---
        const titleEl = this.element.querySelector('.dkv-speed__title');
        const subtitleEl = this.element.querySelector('.dkv-speed__subtitle');
        const viewport = this.element.querySelector('.dkv-speed__main-viewport');
        const footer = this.element.querySelector('.dkv-speed__footer');
        const dataStream = this.element.querySelector('.dkv-speed__data-stream');

        this.typewriter.type(titleEl, titleText, {
            speed: 25,
            hideCursorOnComplete: true,
            onComplete: () => {
                const t = setTimeout(() => {
                    this.typewriter.type(subtitleEl, subtitleText, {
                        speed: 15,
                        onComplete: () => {
                            viewport.classList.add('visible');
                            footer.classList.add('visible');
                            if (dataStream) dataStream.classList.add('visible');
                            // Kis késleltetés után indítjuk az első menetet
                            const t2 = setTimeout(() => this.startBattle(), 600);
                            this.timeouts.push(t2);
                        }
                    });
                }, 200);
                this.timeouts.push(t);
            }
        });
    }

    /**
     * A 3 szekció HTML-jének generálása.
     * @returns {string} HTML string.
     */
    _renderSections() {
        let html = '';
        for (let i = 1; i <= this.maxSections; i++) {
            const stateClass = i === 1 ? 'dkv-speed__section--active' : 'dkv-speed__section--locked';
            const isActiveText = i === 1 ? ' (AKTÍV)' : '';

            // Csak az aktív szekcióban van kattintó gomb és látható sávok (kezdetben)
            if (i === 1) {
                html += `
                    <div class="dkv-speed__section ${stateClass}" data-section="${i}">
                        
                        <div class="dkv-speed__section-body">
                            <!-- OPERATOR bar -->
                            <div class="dkv-speed__bar-wrapper">
                                <span class="dkv-speed__bar-label dkv-speed__bar-label--op">${this.userNickname}</span>
                                <div class="dkv-speed__cpm dkv-speed__cpm--op">CPM: 0</div>
                                <div class="dkv-speed__bar-track">
                                    <div class="dkv-speed__bar-fill dkv-speed__bar-fill--op"><div class="dkv-speed__bar-glow"></div></div>
                                </div>
                                <span class="dkv-speed__bar-percent dkv-speed__bar-percent--op">0%</span>
                            </div>

                            <!-- Közép: kattintó gomb -->
                            <div class="dkv-speed__center-area">
                                <div class="dkv-speed__btn-container">
                                    <!-- CSAPÁS GYŰRŰ -->
                                    <div class="dkv-speed__strike-ring-wrapper">
                                        <svg class="dkv-speed__strike-ring-svg" viewBox="0 0 100 100" style="overflow: visible;">
                                            <circle class="dkv-speed__strike-ring-fill" cx="50" cy="50" r="48" 
                                                pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"></circle>
                                        </svg>
                                    </div>

                                    <button class="dkv-speed__click-btn" disabled>
                                        <div class="dkv-speed__click-btn-inner">
                                            <span class="dkv-speed__start-text">START</span>
                                        </div>
                                    </button>
                                </div>
                                <div class="dkv-speed__center-labels">
                                    <div class="dkv-speed__click-label">KATTINTÁS</div>
                                    <div class="dkv-speed__click-sublabel">ENERGETIZÁLÁS</div>
                                </div>
                            </div>

                            <!-- CORE_AI bar -->
                            <div class="dkv-speed__bar-wrapper">
                                <span class="dkv-speed__bar-label dkv-speed__bar-label--ai">ZÉRÓ-SZEKVENCIA</span>
                                <div class="dkv-speed__cpm dkv-speed__cpm--ai">CPM: 0</div>
                                <div class="dkv-speed__bar-track dkv-speed__bar-track--ai">
                                    <div class="dkv-speed__bar-fill dkv-speed__bar-fill--ai"><div class="dkv-speed__bar-glow"></div></div>
                                </div>
                                <span class="dkv-speed__bar-percent dkv-speed__bar-percent--ai">0%</span>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // Lezárt szekció html (nincs gomb, nincsenek belső sáv értékek)
                html += `
                    <div class="dkv-speed__section ${stateClass}" data-section="${i}">
                        

                        <div class="dkv-speed__section-body">
                            <!-- OPERATOR bar (üres) -->
                            <div class="dkv-speed__bar-wrapper">
                                <span class="dkv-speed__bar-label dkv-speed__bar-label--op">${this.userNickname}</span>
                                <div class="dkv-speed__cpm" style="visibility: hidden">CPM: 0</div>
                                <div class="dkv-speed__bar-track"></div>
                                <span class="dkv-speed__bar-percent" style="visibility: hidden">0%</span>
                            </div>

                            <!-- CORE_AI bar (üres) -->
                            <div class="dkv-speed__bar-wrapper">
                                <span class="dkv-speed__bar-label dkv-speed__bar-label--ai">ZÉRÓ-SZEKVENCIA</span>
                                <div class="dkv-speed__cpm" style="visibility: hidden">CPM: 0</div>
                                <div class="dkv-speed__bar-track dkv-speed__bar-track--ai"></div>
                                <span class="dkv-speed__bar-percent" style="visibility: hidden">0%</span>
                            </div>
                        </div>

                        <!-- Lezárt overlay -->
                        <div class="dkv-speed__locked-overlay"><span class="dkv-speed__locked-text">LEZÁRVA</span></div>
                    </div>
                `;
            }
        }
        return html;
    }

    /**
     * Az első menet indítása.
     */
    startBattle() {
        this.logger.info('SpeedTask: Battle started');
        this.currentSection = 1;
        this.setupStartButton();
    }

    /**
     * Beállítja a START gombot a megadott szekcióhoz.
     */
    setupStartButton() {
        this.roundState = ROUND_STATE.WAITING;
        const activeSection = this.battleGrid.querySelector(`.dkv-speed__section[data-section="${this.currentSection}"]`);
        const clickBtn = activeSection?.querySelector('.dkv-speed__click-btn');
        if (clickBtn) {
            clickBtn.disabled = false;
            // Eltávolítjuk a kattintás eseményt biztos ami biztos
            clickBtn.removeEventListener('mousedown', this._boundHandleClick);
            if (this._boundStartHandler) {
                clickBtn.removeEventListener('click', this._boundStartHandler);
            }

            this._boundStartHandler = () => {
                clickBtn.removeEventListener('click', this._boundStartHandler);
                this.startCountdown(clickBtn);
            };
            clickBtn.addEventListener('click', this._boundStartHandler);
        }
    }

    /**
     * Visszaszámlálás indítása a START gomb megnyomása után.
     * @param {HTMLElement} btn 
     */
    startCountdown(btn) {
        this.roundState = ROUND_STATE.COUNTDOWN;
        btn.disabled = true;

        const inner = btn.querySelector('.dkv-speed__click-btn-inner');
        const startText = `<span class="dkv-speed__start-text">3</span>`;
        inner.innerHTML = startText;
        // Referencia a szövegre, hogy ne használjunk innerHTML-t a loopban
        const textSpan = inner.querySelector('.dkv-speed__start-text');

        const startTime = performance.now();
        const duration = 3000;

        const interval = setInterval(() => {
            const elapsed = performance.now() - startTime;
            const remaining = duration - elapsed;

            if (remaining > 0) {
                const count = Math.ceil(remaining / 1000);
                if (textSpan) textSpan.textContent = count;
            } else {
                clearInterval(interval);
                inner.innerHTML = `<span class="material-symbols-outlined dkv-speed__click-icon">bolt</span>`;
                this.startRound();
            }
        }, 100); // 100ms frissítés a pontosságért

        // Eltároljuk az interval id-t
        this.timeouts.push(interval);
    }

    /**
     * Aktív menet indítása: timer, AI, kattintás engedélyezése.
     */
    startRound() {
        // Mid-lifecycle cleanup a menet kezdetén
        this.timeouts.forEach(t => clearTimeout(t));
        this.timeouts = [];

        const idx = this.currentSection - 1;
        const section = this.sections[idx];

        // Adatok resetelése
        section.opClicks = 0;
        section.aiClicks = 0;
        section.opPercent = 0;
        section.aiPercent = 0;

        this.roundState = ROUND_STATE.ACTIVE;
        this.roundStartTime = performance.now();

        // Kattintó gomb és Csapás gyűrű engedélyezése
        const activeSection = this.battleGrid.querySelector(`.dkv-speed__section[data-section="${this.currentSection}"]`);
        const clickBtn = activeSection?.querySelector('.dkv-speed__click-btn');
        const strikeRing = activeSection?.querySelector('.dkv-speed__strike-ring-fill');

        if (clickBtn) {
            clickBtn.disabled = false;
            clickBtn.addEventListener('mousedown', this._boundHandleClick);

            // Jobb klikk elsütés a korongon
            clickBtn.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.handleStrike();
            });
        }

        if (strikeRing) {
            strikeRing.addEventListener('click', () => this.handleStrike());

            // Jobb klikk elsütés a gyűrűn
            strikeRing.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.handleStrike();
            });
        }

        // AI indítása
        this.startAI();

        // Cached UI query to prevent high-frequency DOM access in updateBars
        this.cachedUI = {
            opFill: activeSection?.querySelector('.dkv-speed__bar-fill--op'),
            aiFill: activeSection?.querySelector('.dkv-speed__bar-fill--ai'),
            opCpm: activeSection?.querySelector('.dkv-speed__cpm--op'),
            aiCpm: activeSection?.querySelector('.dkv-speed__cpm--ai'),
            opPercent: activeSection?.querySelector('.dkv-speed__bar-percent--op'),
            aiPercent: activeSection?.querySelector('.dkv-speed__bar-percent--ai'),
            aiWrapper: activeSection?.querySelector('.dkv-speed__bar-label--ai')?.closest('.dkv-speed__bar-wrapper'),
            clickLabel: activeSection?.querySelector('.dkv-speed__click-label')
        };

        // UI frissítő indítása (100ms-enként)
        this.startUIRefresh();

        this.logger.info(`SpeedTask: Round ${this.currentSection} started`);
    }

    /**
     * Kattintás kezelése (debounce + számlálás).
     * @param {MouseEvent} e - mousedown esemény.
     */
    handleClick(e) {
        if (this.roundState !== ROUND_STATE.ACTIVE) return;

        const now = performance.now();
        if (now - this.lastClickTime < this.minClickInterval) return;
        this.lastClickTime = now;

        const idx = this.currentSection - 1;
        this.sections[idx].opClicks++;

        // Felirat módosítása TÖLTÉS...-re az első kattintásnál
        if (this.cachedUI?.clickLabel && this.sections[idx].strikeCharge < 100) {
            this.cachedUI.clickLabel.textContent = 'TÖLTÉS...';
        }

        // Vizuális feedback a gombon
        const btn = e.currentTarget;
        btn.classList.add('dkv-speed__click-btn--pressed');

        // Csapás töltése (100-ig)
        const section = this.sections[idx];
        if (section.strikeCharge < 100) {
            section.strikeCharge++;
            this.updateStrikeRing(section.strikeCharge);
        }

        // Előző visual timeout törlése, hogy ne hízzon az array
        if (this.clickVisualTimeout) clearTimeout(this.clickVisualTimeout);
        this.clickVisualTimeout = setTimeout(() => btn.classList.remove('dkv-speed__click-btn--pressed'), 80);
    }

    /**
     * AI kattintás szimuláció – Rubber-banding (gumikötél) logika.
     */
    startAI() {
        if (this.aiIsFrozen) return; // Ne induljon el, ha le van fagyasztva
        const idx = this.currentSection - 1;

        const tick = () => {
            if (this.roundState !== ROUND_STATE.ACTIVE) return;

            const section = this.sections[idx];
            section.aiClicks++;

            // Rubber-banding (alkalmazkodó) logika
            const diff = section.aiClicks - section.opClicks;

            // Alapértelmezett, gyerekbarát tempó: ~240-280ms (210-250 CPM)
            let minDelay = 240;
            let maxDelay = 280;

            if (diff > 15) {
                // AI túl messze van: szándékosan lelassít (kifáradás)
                minDelay = 350;
                maxDelay = 500;
            } else if (diff > 5) {
                // AI vezet: enyhén lassít
                minDelay = 280;
                maxDelay = 350;
            } else if (diff < -10) {
                // Játékos nagyon elhúzott: AI bepánikol és felgyorsít (maximum limit)
                minDelay = 180;
                maxDelay = 210;
            } else if (diff < -5) {
                // Játékos vezet: AI enyhén gyorsít
                minDelay = 210;
                maxDelay = 240;
            }

            // Menetenkénti "Személyiség" (Agresszivitás)
            if (this.currentSection === 1) {
                // 1. menet: Engedékenyebb (+20ms késleltetés)
                minDelay += 20;
                maxDelay += 20;
            } else if (this.currentSection === 2) {
                // 2. menet: Agresszívabb (-15ms gyorsítás)
                minDelay -= 15;
                maxDelay -= 15;
            }
            // 3. menet: Nincs módosító, precíz rubber-banding

            const delay = minDelay + Math.random() * (maxDelay - minDelay);
            this.aiTimeout = setTimeout(tick, delay);
        };

        // Első AI kattintás kis késleltetéssel indul, hogy a játékos esélyt kapjon kezdeni
        this.aiTimeout = setTimeout(tick, 300 + Math.random() * 200);
    }

    /**
     * CSAPÁS aktiválása.
     */
    handleStrike() {
        if (this.roundState !== ROUND_STATE.ACTIVE) return;

        const idx = this.currentSection - 1;
        const section = this.sections[idx];

        if (section.strikeCharge < 100) return;

        // 1. Értékek módosítása (3% ~ 14 kattintás a 450-es célból)
        const swingAmount = Math.round(this.targetClicks * 0.03);

        // AI visszavágás
        section.aiClicks = Math.max(0, section.aiClicks - swingAmount);
        // Játékos bónusz
        section.opClicks += swingAmount;

        // Töltés reset
        section.strikeCharge = 0;
        this.updateStrikeRing(0);
        if (this.cachedUI?.clickLabel) {
            this.cachedUI.clickLabel.textContent = 'KATTINTÁS';
        }

        // 2. AI lebénítása 2 másodpercre
        this.aiIsFrozen = true;
        this.stopAI();
        const t = setTimeout(() => {
            this.aiIsFrozen = false;
            this.startAI();
        }, 2000);
        this.timeouts.push(t);

        // 3. Vizuális glitch effekt - BRUTÁLIS RGB-SPLIT AZ EGÉSZ SÁVRA
        const aiWrapper = this.cachedUI?.aiWrapper;
        if (aiWrapper) {
            aiWrapper.classList.add('dkv-speed__bar-wrapper--ai-glitch');
            const t2 = setTimeout(() => {
                aiWrapper.classList.remove('dkv-speed__bar-wrapper--ai-glitch');
            }, 500);
            this.timeouts.push(t2);
        }

        this.updateBars();
        this.logger.info('SpeedTask: STRIKE activated!');
    }

    /**
     * Csapás gyűrű vizuális frissítése.
     * @param {number} charge - Töltöttség (0-100).
     */
    updateStrikeRing(charge) {
        const activeEl = this.battleGrid.querySelector(`.dkv-speed__section[data-section="${this.currentSection}"]`);
        const wrapper = activeEl?.querySelector('.dkv-speed__strike-ring-wrapper');
        const fill = activeEl?.querySelector('.dkv-speed__strike-ring-fill');

        if (!fill || !wrapper) return;

        // Mivel pathLength="100" van megadva, az offset közvetlenül 100 - charge
        const offset = 100 - Math.min(100, charge);
        fill.style.strokeDashoffset = offset;

        // Ready állapot toggle
        if (charge >= 100) {
            wrapper.classList.add('dkv-speed__strike-ring-wrapper--ready');
            if (this.cachedUI?.clickLabel) {
                this.cachedUI.clickLabel.textContent = 'FELTÖLTVE';
            }
        } else {
            wrapper.classList.remove('dkv-speed__strike-ring-wrapper--ready');
        }
    }

    /**
     * AI leállítása.
     */
    stopAI() {
        if (this.aiTimeout) {
            clearTimeout(this.aiTimeout);
            this.aiTimeout = null;
        }
    }

    /**
     * UI frissítő setInterval indítása.
     */
    startUIRefresh() {
        this.stopUIRefresh();
        this.uiRefreshInterval = setInterval(() => {
            if (this.roundState !== ROUND_STATE.ACTIVE) return;

            // Hátralévő idő kiszámítása (performance.now delta)
            const elapsed = performance.now() - this.roundStartTime;
            const remaining = Math.max(0, this.roundDuration - elapsed);

            // Timer frissítése
            this.updateTimerDisplay(remaining);

            // Barok frissítése
            this.updateBars();

            // Menet vége ellenőrzés
            if (remaining <= 0) {
                this.endRound();
            }
        }, 100);
    }

    /**
     * UI frissítő setInterval leállítása.
     */
    stopUIRefresh() {
        if (this.uiRefreshInterval) {
            clearInterval(this.uiRefreshInterval);
            this.uiRefreshInterval = null;
        }
    }

    /**
     * Visszaszámláló kijelző frissítése.
     * @param {number} remainingMs - Hátralévő idő milliszekundumban.
     */
    updateTimerDisplay(remainingMs) {
        const totalSeconds = Math.ceil(remainingMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (this.timerClock) {
            this.timerClock.textContent = display;

            // Vörös villogás az utolsó 10 másodpercben
            if (totalSeconds <= 10) {
                this.timerClock.classList.add('dkv-speed__vp-timer-clock--danger');
            } else {
                this.timerClock.classList.remove('dkv-speed__vp-timer-clock--danger');
            }
        }
    }

    /**
     * Bar magasságok, CPM és dominancia% frissítése az aktív szekciónál.
     */
    updateBars() {
        const idx = this.currentSection - 1;
        const section = this.sections[idx];

        // Százalék kiszámítása a célérték alapján (max 100%)
        section.opPercent = Math.min(100, Math.round((section.opClicks / this.targetClicks) * 100));
        section.aiPercent = Math.min(100, Math.round((section.aiClicks / this.targetClicks) * 100));

        // CPM kiszámítása (eltelt idő alapján)
        const elapsedSec = (performance.now() - this.roundStartTime) / 1000;
        const opCPM = elapsedSec > 0 ? Math.round((section.opClicks / elapsedSec) * 60) : 0;
        const aiCPM = elapsedSec > 0 ? Math.round((section.aiClicks / elapsedSec) * 60) : 0;

        // DOM frissítés (cachingelve a GC safety miatt)
        if (!this.cachedUI) return;

        const { opFill, aiFill, opCpm, aiCpm, opPercent, aiPercent } = this.cachedUI;

        if (opFill) opFill.style.height = `${section.opPercent}%`;
        if (aiFill) aiFill.style.height = `${section.aiPercent}%`;
        if (opCpm) opCpm.textContent = `CPM: ${opCPM}`;
        if (aiCpm) aiCpm.textContent = `CPM: ${aiCPM}`;
        if (opPercent) opPercent.textContent = `${section.opPercent}%`;
        if (aiPercent) aiPercent.textContent = `${section.aiPercent}%`;
    }

    /**
     * Menet befejezése: kiértékelés, UI frissítés, átvezetés.
     */
    endRound() {
        if (this.roundState !== ROUND_STATE.ACTIVE) return;
        this.roundState = ROUND_STATE.ENDED;

        // 1. Timer és AI leállítása
        this.stopUIRefresh();
        this.stopAI();
        if (this.clickVisualTimeout) clearTimeout(this.clickVisualTimeout);
        this.timeouts.forEach(t => clearTimeout(t));
        this.timeouts = [];

        // 2. Timer nullázás
        this.updateTimerDisplay(0);

        // 3. Kattintó gomb letiltása
        const activeEl = this.battleGrid.querySelector(`.dkv-speed__section[data-section="${this.currentSection}"]`);
        const clickBtn = activeEl?.querySelector('.dkv-speed__click-btn');
        if (clickBtn) {
            clickBtn.disabled = true;
            clickBtn.removeEventListener('mousedown', this._boundHandleClick);
        }

        // 4. Utolsó bar frissítés
        this.updateBars();

        // 5. Pontszámítás
        const idx = this.currentSection - 1;
        const section = this.sections[idx];
        section.score = this.calculateSectionScore(section.opPercent);

        // 6. Statisztikák HTML-jének előkészítése (rejtve)
        this.showSectionStats(this.currentSection, section);

        this.logger.info(`SpeedTask: Round ${this.currentSection} ended. ` +
            `OP: ${section.opClicks} (${section.opPercent}%), AI: ${section.aiClicks} (${section.aiPercent}%), ` +
            `Score: ${section.score}`);

        // 7. Következő szekció vagy befejezés (glitch azonnal indul)
        if (this.currentSection < this.maxSections) {
            this.transitionToNextSection();
        } else {
            // Ha ez az utolsó szekció, nincs glitch, rögtön animálhatjuk a statisztikát, majd befejezzük
            this.animateSectionStats(this.currentSection);
            const t = setTimeout(() => this.finishTask(), 1500);
            this.timeouts.push(t);
        }
    }

    /**
     * Szekciónkénti pontszám kiszámítása.
     * @param {number} opPercent - A teljesített kattintások százaléka.
     * @returns {number} Pont (0–10).
     */
    calculateSectionScore(opPercent) {
        return Math.floor(opPercent / 10);
    }

    /**
     * Befejezett szekció statisztikáinak megjelenítése.
     * @param {number} sectionNum - Szekció sorszáma (1–3).
     * @param {Object} data - Szekció adatai.
     */
    showSectionStats(sectionNum, data) {
        const sectionEl = this.battleGrid.querySelector(`.dkv-speed__section[data-section="${sectionNum}"]`);
        if (!sectionEl) return;

        // Hide CPM
        const cpms = sectionEl.querySelectorAll('.dkv-speed__cpm');
        cpms.forEach(el => el.style.opacity = '0');

        // Eltávolítjuk a kattintó gombot és a helyére rakjuk a statisztikát
        const centerArea = sectionEl.querySelector('.dkv-speed__center-area');
        if (centerArea) {
            const dominance = Math.round((data.opClicks / Math.max(1, (data.opClicks + data.aiClicks))) * 100);
            centerArea.innerHTML = `
                <div class="dkv-speed__center-stats">
                    <div class="dkv-speed__stat-row" style="opacity: 0">
                        <span class="dkv-speed__stat-label">MIN:</span> 
                        <span class="dkv-speed__stat-value">${Math.max(0, data.opClicks - 50)}</span>
                    </div>
                    <div class="dkv-speed__stat-row" style="opacity: 0">
                        <span class="dkv-speed__stat-label">MAX:</span> 
                        <span class="dkv-speed__stat-value">${data.opClicks + 50}</span>
                    </div>
                    <div class="dkv-speed__stat-row" style="opacity: 0">
                        <span class="dkv-speed__stat-label">AVG:</span> 
                        <span class="dkv-speed__stat-value">${data.opClicks}</span>
                    </div>
                    <div class="dkv-speed__dominance-text" style="opacity: 0">DOMINANCIA: ${dominance}%</div>
                </div>
            `;

            // Csak HTML beállítása, animációt az animateSectionStats csinálja
        }

        // Szekció lezárt állapotba váltása
        sectionEl.classList.remove('dkv-speed__section--active');
        sectionEl.classList.add('dkv-speed__section--completed');
    }

    /**
     * Statisztikák animációja.
     * @param {number} sectionNum 
     */
    animateSectionStats(sectionNum) {
        const sectionEl = this.battleGrid.querySelector(`.dkv-speed__section[data-section="${sectionNum}"]`);
        if (!sectionEl) return;
        const centerArea = sectionEl.querySelector('.dkv-speed__center-area');
        if (!centerArea) return;

        const rows = centerArea.querySelectorAll('.dkv-speed__stat-row, .dkv-speed__dominance-text');
        rows.forEach((row, idx) => {
            row.style.transition = 'opacity 0.3s ease-in';
            const t = setTimeout(() => {
                row.style.opacity = '1';
            }, 300 * (idx + 1));
            this.timeouts.push(t);
        });
    }

    /**
     * Glitch animáció + átvezetés a következő szekcióra.
     */
    transitionToNextSection() {
        const prevSection = this.currentSection;
        const viewport = this.element.querySelector('.dkv-speed__main-viewport');
        viewport.classList.add('dkv-speed__main-viewport--glitch');

        const t1 = setTimeout(() => {
            this.currentSection++;
            this.activateSection(this.currentSection);
            viewport.classList.remove('dkv-speed__main-viewport--glitch');

            // Glitch után animáljuk be az előző szekció statisztikáit!
            this.animateSectionStats(prevSection);

            // Kis szünet után beállítjuk a START gombot
            const t2 = setTimeout(() => this.setupStartButton(), 500);
            this.timeouts.push(t2);
        }, 800);
        this.timeouts.push(t1);
    }

    /**
     * Adott szekció aktiválása a DOM-ban.
     * @param {number} sectionNum - Szekció sorszáma (1–3).
     */
    activateSection(sectionNum) {
        const sectionEl = this.battleGrid.querySelector(`.dkv-speed__section[data-section="${sectionNum}"]`);
        if (!sectionEl) return;

        // Locked overlay eltávolítása
        const lockedOverlay = sectionEl.querySelector('.dkv-speed__locked-overlay');
        if (lockedOverlay) lockedOverlay.remove();

        // Belső tartalom cseréje aktívra
        const bodyEl = sectionEl.querySelector('.dkv-speed__section-body');
        if (bodyEl) {
            bodyEl.innerHTML = `
                <!-- OPERATOR bar -->
                <div class="dkv-speed__bar-wrapper">
                    <span class="dkv-speed__bar-label dkv-speed__bar-label--op">OPERATOR</span>
                    <div class="dkv-speed__cpm dkv-speed__cpm--op">CPM: 0</div>
                    <div class="dkv-speed__bar-track">
                        <div class="dkv-speed__bar-fill dkv-speed__bar-fill--op"><div class="dkv-speed__bar-glow"></div></div>
                    </div>
                    <span class="dkv-speed__bar-percent dkv-speed__bar-percent--op">0%</span>
                </div>

                <!-- Közép: kattintó gomb -->
                <div class="dkv-speed__center-area">
                    <div class="dkv-speed__btn-container">
                        <!-- CSAPÁS GYŰRŰ -->
                        <div class="dkv-speed__strike-ring-wrapper">
                            <svg class="dkv-speed__strike-ring-svg" viewBox="0 0 100 100" style="overflow: visible;">
                                <circle class="dkv-speed__strike-ring-fill" cx="50" cy="50" r="48" 
                                    pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"></circle>
                            </svg>
                        </div>

                        <button class="dkv-speed__click-btn">
                            <div class="dkv-speed__click-btn-inner">
                                <span class="dkv-speed__start-text">START</span>
                            </div>
                        </button>
                    </div>
                    <div class="dkv-speed__center-labels">
                        <div class="dkv-speed__click-label">KATTINTÁS</div>
                        <div class="dkv-speed__click-sublabel">ENERGETIZÁLÁS</div>
                    </div>
                </div>

                <!-- CORE_AI bar -->
                <div class="dkv-speed__bar-wrapper">
                    <span class="dkv-speed__bar-label dkv-speed__bar-label--ai">CORE_AI</span>
                    <div class="dkv-speed__cpm dkv-speed__cpm--ai">CPM: 0</div>
                    <div class="dkv-speed__bar-track dkv-speed__bar-track--ai">
                        <div class="dkv-speed__bar-fill dkv-speed__bar-fill--ai"><div class="dkv-speed__bar-glow"></div></div>
                    </div>
                    <span class="dkv-speed__bar-percent dkv-speed__bar-percent--ai">0%</span>
                </div>
            `;
        }

        // Osztályok frissítése
        sectionEl.classList.remove('dkv-speed__section--locked');
        sectionEl.classList.add('dkv-speed__section--active');

        // ID frissítése
        const idEl = sectionEl.querySelector('.dkv-speed__section-id');
        if (idEl && !idEl.textContent.includes('AKTÍV')) {
            idEl.textContent += ' (AKTÍV)';
        }

        // Timer reset
        this.updateTimerDisplay(this.roundDuration);

        this.logger.info(`SpeedTask: Section ${sectionNum} activated`);
    }

    /**
     * Feladat befejezése – VÉGREHAJTÁS gomb aktiválása.
     */
    finishTask() {
        if (this.executeBtn) {
            this.executeBtn.disabled = false;
            this.executeBtn.classList.add('dkv-speed__execute-btn--ready');
        }
        this.logger.info('SpeedTask: All rounds completed, VÉGREHAJTÁS enabled');
    }

    /**
     * VÉGREHAJTÁS gomb kezelése – onComplete hívás.
     */
    handleExecute() {
        if (this.executeBtn?.disabled) return;
        this.executeBtn.disabled = true;
        this.executeBtn.textContent = 'ADATOK KÜLDÉSE...';

        // Összpontszám kiszámítása
        const totalScore = this.sections.reduce((sum, s) => sum + s.score, 0);

        const t = setTimeout(() => {
            this.onComplete({
                success: true,
                points: totalScore,
                maxPoints: 30,
                timeElapsed: Math.floor((Date.now() - this.startTime) / 1000)
            });
        }, 1000);
        this.timeouts.push(t);
    }

    /**
     * Segítség panel kezelése.
     */
    setupHelpLogic() {
        const helpBtn = this.element.querySelector('.dkv-speed__help-btn');
        const helpOverlay = this.element.querySelector('.dkv-speed__help-overlay');
        const closeBtn = this.element.querySelector('.dkv-speed__help-close');

        if (helpBtn && helpOverlay) {
            this._boundOpenHelp = () => helpOverlay.classList.add('dkv-speed__help-overlay--open');
            this._boundCloseHelp = () => helpOverlay.classList.remove('dkv-speed__help-overlay--open');
            this._boundOverlayClick = (e) => {
                if (e.target === helpOverlay) {
                    helpOverlay.classList.remove('dkv-speed__help-overlay--open');
                }
            };

            helpBtn.addEventListener('click', this._boundOpenHelp);
            closeBtn?.addEventListener('click', this._boundCloseHelp);
            helpOverlay.addEventListener('click', this._boundOverlayClick);
        }
    }

    /**
     * Erőforrások felszabadítása.
     */
    destroy() {
        // 1. Összes timeout leállítása
        this.timeouts.forEach(t => clearTimeout(t));
        this.timeouts = [];

        // 2. setInterval cleanup
        this.stopUIRefresh();
        this.stopAI();
        if (this.clickVisualTimeout) clearTimeout(this.clickVisualTimeout);

        // 3. Typewriter leállítása
        if (this.typewriter) {
            this.typewriter.stop();
        }

        // 4. Event listener cleanup
        if (this.battleGrid) {
            const activeBtn = this.battleGrid.querySelector('.dkv-speed__click-btn');
            if (activeBtn) {
                activeBtn.removeEventListener('mousedown', this._boundHandleClick);
                if (this._boundStartHandler) {
                    activeBtn.removeEventListener('click', this._boundStartHandler);
                }
            }
        }

        const helpBtn = this.element?.querySelector('.dkv-speed__help-btn');
        const helpOverlay = this.element?.querySelector('.dkv-speed__help-overlay');
        const closeBtn = this.element?.querySelector('.dkv-speed__help-close');

        if (helpBtn && this._boundOpenHelp) helpBtn.removeEventListener('click', this._boundOpenHelp);
        if (closeBtn && this._boundCloseHelp) closeBtn.removeEventListener('click', this._boundCloseHelp);
        if (helpOverlay && this._boundOverlayClick) helpOverlay.removeEventListener('click', this._boundOverlayClick);

        // 5. DOM eltávolítása
        if (this.element) {
            this.element.remove();
        }

        this.logger.info('SpeedTask: destroyed');
    }
}
