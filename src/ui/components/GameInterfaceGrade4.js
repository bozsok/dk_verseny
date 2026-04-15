// import { animate, stagger } from 'animejs';

const STATION_NAMES = {
    'onboarding': 'AZONOSÍTÁS',
    'intro': 'RENDSZER-BETÖLTÉS',
    'station_1': 'ÜZENETEK KRIPTÁJA',
    'station_2': 'MEMÓRIA TÜKÖRTERME',
    'station_3': 'LOGIKAI KÖNYVTÁR',
    'station_4': 'ANOMÁLIÁK SZIGETE',
    'station_5': 'BIT-FOLYAM ZSILIPJE',
    'final': 'RENDSZERMAG'
};

export class GameInterfaceGrade4 {
    constructor(options = {}) {
        this.options = options;

        // Callbacks
        this.onNext = options.onNext || (() => { });
        this.onPrev = options.onPrev || (() => { });
        this.onOpenJournal = options.onOpenJournal || (() => { });
        this.onOpenNarrator = options.onOpenNarrator || (() => { });
        this.onOpenSettings = options.onOpenSettings || (() => { });
        this.onMusicVolumeChange = options.onMusicVolumeChange || (() => { });
        this.onNarrationVolumeChange = options.onNarrationVolumeChange || (() => { });
        this.onSfxVolumeChange = options.onSfxVolumeChange || (() => { });

        // State initialization
        this.currentMusicVolume = options.musicVolume !== undefined ? Math.round(options.musicVolume * 100) : 50;
        this.currentNarrationVolume = options.narrationVolume !== undefined ? Math.round(options.narrationVolume * 100) : 100;
        this.currentSfxVolume = options.sfxVolume !== undefined ? Math.round(options.sfxVolume * 100) : 40;

        this.totalSlides = options.totalSlides || 28;
        this.currentSlideIndex = options.currentSlideIndex || 1;
        this.currentDisplayedScore = 0;
        this.lastInventoryCount = 0;

        this.element = null;
        this.contentContainer = null;
        this.currentNarration = "Transmission Incoming // Decrypting...";

        this.eventBus = options.eventBus || null;
        this.timeManager = options.timeManager || null;
        this.timerTickHandler = null;
        this.timerStartHandler = null;

        this.attentionTimer = null;
        this.attentionPulseTimer = null;
    }

    /**
     * A komponens DOM elemének létrehozása és visszaadása.
     * @returns {HTMLElement} A gyökér interfész elem (.dkv-g4-interface)
     */
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'dkv-g4-interface';

        // 1. BACKGROUND & SCANLINE LAYER
        const bgLayer = document.createElement('div');
        bgLayer.className = 'dkv-g4-bg-layer';
        bgLayer.innerHTML = `
            <div class="dkv-g4-scanline"></div>
            <div class="dkv-g4-bg-container">
                <div class="dkv-g4-bg-image"></div>
                <div class="dkv-g4-bg-grid"></div>
            </div>
        `;
        this.element.appendChild(bgLayer);

        // 2. TOP HUD
        const header = document.createElement('header');
        header.className = 'dkv-g4-top-hud';

        const hudLeft = document.createElement('div');
        hudLeft.className = 'dkv-g4-hud-left';
        hudLeft.innerHTML = `
            <div class="dkv-g4-avatar-wrapper">
                <div class="dkv-g4-avatar-border">
                    <div class="dkv-g4-avatar-image"></div>
                </div>
            </div>
            <div class="dkv-g4-user-info">
                <span class="dkv-g4-username">PLAYER</span>
                <span class="dkv-g4-points-container"><span class="dkv-g4-points-label">PONTJAID:</span> <span class="dkv-g4-points-value">0</span></span>
            </div>
        `;
        this.avatarEl = hudLeft.querySelector('.dkv-g4-avatar-image');
        this.usernameEl = hudLeft.querySelector('.dkv-g4-username');
        this.pointsEl = hudLeft.querySelector('.dkv-g4-points-value');

        const hudRight = document.createElement('div');
        hudRight.className = 'dkv-g4-hud-right';

        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'dkv-g4-btn-settings';
        settingsBtn.innerHTML = `<span class="material-symbols-outlined">settings</span>`;
        settingsBtn.onclick = () => this.onOpenSettings();

        hudRight.appendChild(settingsBtn);
        header.appendChild(hudLeft);
        header.appendChild(hudRight);
        this.element.appendChild(header);

        // 3. SIDE NAV
        const sideNav = document.createElement('nav');
        sideNav.className = 'dkv-g4-side-nav';

        const narratorBtn = document.createElement('button');
        narratorBtn.className = 'dkv-g4-nav-item dkv-g4-btn-narrator';
        narratorBtn.innerHTML = `<span class="material-symbols-outlined">terminal</span>`;
        narratorBtn.onclick = () => this.onOpenNarrator();

        const journalBtn = document.createElement('button');
        journalBtn.className = 'dkv-g4-nav-item dkv-g4-btn-journal';
        journalBtn.innerHTML = `<span class="material-symbols-outlined">history_edu</span>`;
        journalBtn.onclick = () => this.onOpenJournal();

        sideNav.appendChild(journalBtn);
        sideNav.appendChild(narratorBtn);
        this.element.appendChild(sideNav);

        // 4. MAIN CONTENT AREA
        this.contentContainer = document.createElement('div');
        this.contentContainer.className = 'dkv-g4-content-area';
        this.element.appendChild(this.contentContainer);

        // 5. NAVIGATION CONTROLS
        const navControls = document.createElement('div');
        navControls.className = 'dkv-g4-nav-controls';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'dkv-g4-btn-prev';
        prevBtn.setAttribute('aria-label', 'Előző');
        const prevIcon = document.createElement('span');
        prevIcon.className = 'material-symbols-outlined';
        prevIcon.textContent = 'chevron_left';
        prevBtn.appendChild(prevIcon);
        prevBtn.onclick = () => {
            this._clearAttentionTimer();
            this.onPrev();
        };

        const nextBtn = document.createElement('button');
        nextBtn.className = 'dkv-g4-btn-next';
        nextBtn.setAttribute('aria-label', 'Következő');
        const nextIcon = document.createElement('span');
        nextIcon.className = 'material-symbols-outlined';
        nextIcon.textContent = 'chevron_right';
        nextBtn.appendChild(nextIcon);
        nextBtn.onclick = () => {
            this._clearAttentionTimer();
            this.onNext();
        };

        navControls.appendChild(prevBtn);
        navControls.appendChild(nextBtn);
        this.element.appendChild(navControls);

        // 7. BOTTOM HUD
        const footer = document.createElement('footer');
        footer.className = 'dkv-g4-bottom-hud';

        const stationInfo = document.createElement('div');
        stationInfo.className = 'dkv-g4-station-info';
        stationInfo.innerHTML = `
            <span class="dkv-g4-station-label">ÁLLOMÁS</span>
            <span class="dkv-g4-station-value">STATION_00</span>
        `;

        const timeline = document.createElement('div');
        timeline.className = 'dkv-g4-timeline';
        this.timelineContainerEl = timeline;

        this.timelineFillEls = [];
        for (let i = 0; i < 7; i++) {
            const track = document.createElement('div');
            track.className = 'dkv-g4-timeline-track';
            const fill = document.createElement('div');
            fill.className = 'dkv-g4-timeline-fill';
            track.appendChild(fill);
            timeline.appendChild(track);
            this.timelineFillEls.push(fill);
        }

        const inventoryArea = document.createElement('div');
        inventoryArea.className = 'dkv-g4-inventory-area';
        inventoryArea.innerHTML = `
            <span class="dkv-g4-inventory-label">SZKRIPTEK</span>
            <div class="dkv-g4-inventory-slots">
                <div class="dkv-g4-slot"><div class="dkv-g4-slot-icon"><span class="material-symbols-outlined">deployed_code</span></div></div>
                <div class="dkv-g4-slot"><div class="dkv-g4-slot-icon"><span class="material-symbols-outlined">deployed_code</span></div></div>
                <div class="dkv-g4-slot"><div class="dkv-g4-slot-icon"><span class="material-symbols-outlined">deployed_code</span></div></div>
                <div class="dkv-g4-slot"><div class="dkv-g4-slot-icon"><span class="material-symbols-outlined">deployed_code</span></div></div>
                <div class="dkv-g4-slot"><div class="dkv-g4-slot-icon"><span class="material-symbols-outlined">deployed_code</span></div></div>
            </div>
        `;
        this.inventorySlotsEl = inventoryArea.querySelector('.dkv-g4-inventory-slots');

        footer.appendChild(stationInfo);
        footer.appendChild(timeline);
        footer.appendChild(inventoryArea);
        this.element.appendChild(footer);
        this.stationLabelEl = stationInfo.querySelector('.dkv-g4-station-label');
        this.stationTextEl = stationInfo.querySelector('.dkv-g4-station-value');

        // 8. DECORATIVE CORNERS
        const corners = document.createElement('div');
        corners.className = 'dkv-g4-decorative-corners';
        corners.innerHTML = `
            <div class="dkv-g4-corner dkv-g4-corner-tl"></div>
            <div class="dkv-g4-corner dkv-g4-corner-tr"></div>
            <div class="dkv-g4-corner dkv-g4-corner-bl"></div>
            <div class="dkv-g4-corner dkv-g4-corner-br"></div>
        `;
        this.element.appendChild(corners);

        // 9. TASK MODAL
        this.taskModalOverlay = document.createElement('div');
        this.taskModalOverlay.className = 'dkv-g4-task-modal-overlay';
        this.taskModalOverlay.innerHTML = `
            <div class="dkv-g4-task-modal">
                <div class="dkv-g4-task-modal-header">
                    <h2>FINÁLÉ FELADAT</h2>
                </div>
                <div class="dkv-g4-task-modal-body"></div>
                <button class="dkv-g4-task-ok-btn">EXECUTE</button>
            </div>
        `;
        this.element.appendChild(this.taskModalOverlay);

        this.taskOkBtn = this.taskModalOverlay.querySelector('.dkv-g4-task-ok-btn');
        this.taskModalBody = this.taskModalOverlay.querySelector('.dkv-g4-task-modal-body');

        // Időmérő megjelenítés eseményfigyelőjének beállítása (globális elem vezérlése)
        if (this.eventBus) {
            this.timerStartHandler = () => {
                const globalTimer = document.getElementById('dkv-timer-display');
                if (globalTimer) globalTimer.style.display = 'flex';
            };
            this.timerTickHandler = () => {
                const globalTimer = document.getElementById('dkv-timer-display');
                if (globalTimer) globalTimer.style.display = 'flex';
            };
            this.eventBus.on('timer:competition-started', this.timerStartHandler);
            this.eventBus.on('timer:tick', this.timerTickHandler);
        }

        // Kezdeti megjelenítés, ha az időmérő már fut
        if (this.timeManager && this.timeManager.globalTimer.isRunning) {
            const globalTimer = document.getElementById('dkv-timer-display');
            if (globalTimer) globalTimer.style.display = 'flex';
        }

        return this.element;
    }

    /**
     * HUD Adatok (Avatar, Név, Pont) frissítése
     */
    updateHUD(state = {}) {
        if (!state) return;

        if (this.avatarEl && state.avatar) {
            this.avatarEl.style.backgroundImage = `url('${state.avatar}')`;
        }

        if (this.usernameEl) {
            const nick = (state.userProfile && state.userProfile.nickname) || state.nickname || 'PLAYER';
            this.usernameEl.textContent = nick;
        }

        if (this.pointsEl) {
            const targetScore = (state.score !== undefined) ? state.score : 0;
            if (targetScore !== this.currentDisplayedScore || this.pointsEl.textContent === '0') {
                this._animateScore(this.currentDisplayedScore, targetScore);
                this.currentDisplayedScore = targetScore;
            }
        }

        if (state.progress && Array.isArray(state.progress.inventory)) {
            this.updateInventory(state.progress.inventory);
        }
    }

    /**
     * Háttérkép beállítása az interfész saját háttérrétegére.
     * STORY típusú diáknál hívandó, hogy a dia képe látszódjon.
     * @param {string|null} imageUrl - A háttérkép URL-je (pl. 'assets/images/grade4/slides/slide_01.jpg')
     */
    setBackgroundImage(imageUrl) {
        const bgImageEl = this.element ? this.element.querySelector('.dkv-g4-bg-image') : null;
        if (!bgImageEl) return;

        if (imageUrl) {
            bgImageEl.style.backgroundImage = `url('${imageUrl}')`;
        } else {
            bgImageEl.style.backgroundImage = '';
        }
    }

    /**
     * Story panel fejléc (cím és referencia) frissítése.
     * @param {string} title - A dia nevét megjelenítő szöveg
     * @param {string} [ref] - Referencia kód (pl. 'REF_INTRO_01')
     */
    setStoryHeader(title, ref) {
        if (this.storyTitleEl && title) {
            this.storyTitleEl.textContent = title;
        }
        if (this.storyRefEl && ref) {
            this.storyRefEl.textContent = ref;
        }
    }

    /**
     * Tartalom elem beállítása a fő tartalomterületre (dia megjelenítő zóna).
     * @param {HTMLElement} element - A megjelenítendő tartalom DOM eleme
     */
    setContent(element) {
        if (this.contentContainer) {
            this.contentContainer.innerHTML = '';
            this.contentContainer.appendChild(element);
        }
    }

    /**
     * Idővonal (haladásjelző szegmensek) és állomásszámláló frissítése.
     * @param {number} currentSlide - Az aktuális dia sorszáma (1-alapú)
     * @param {Object} slide - Az aktuális dia objektum a metaadatokkal
     */
    updateTimeline(currentSlide, slide = null) {
        if (!this.timelineContainerEl || !this.timelineFillEls) return;

        // Az aktuális fázis detektálása a metaadatok alapján
        const section = slide?.metadata?.section || 'unknown';
        const isIntro = section === 'onboarding' || section === 'intro';
        const isFinal = section === 'final';

        if (this.stationLabelEl) {
            this.stationLabelEl.textContent = isIntro ? 'INTRO' : 'ÁLLOMÁS';
        }

        if (this.stationTextEl) {
            if (isIntro) {
                this.stationTextEl.textContent = 'FELTÖLTÉS';
            } else if (section in STATION_NAMES) {
                this.stationTextEl.textContent = STATION_NAMES[section];
            } else {
                this.stationTextEl.textContent = isFinal ? 'RENDSZERMAG' : 'ISMERETLEN';
            }
        }

        // Ha nem szám (pl. 'welcome'), ne frissítsük a töltöttséget, de legyen alapállapot (0%)
        const slideIdx = typeof currentSlide === 'number' ? currentSlide : parseInt(currentSlide, 10);
        if (isNaN(slideIdx)) {
            this.timelineFillEls.forEach(fill => {
                fill.style.width = '0%';
            });
            return;
        }

        // Korrekció: Az első 3 onboarding diát (Welcome, Reg, Char) nem számoljuk a 28-as idővonalba
        const onboardingOffset = 3;
        const targetIdx = slideIdx - onboardingOffset;

        // Ha még az onboardingban vagyunk, minden csík üres
        if (targetIdx <= 0) {
            this.timelineFillEls.forEach(fill => {
                fill.style.width = '0%';
            });
            return;
        }

        // 7 csoport (Intro, 5 Állomás, Finálé), csoportonként 4 dia = 28 dia
        const groupIndex = Math.floor((targetIdx - 1) / 4);
        const groupProgress = ((targetIdx - 1) % 4) + 1;

        this.timelineFillEls.forEach((fill, i) => {
            if (i < groupIndex) {
                fill.style.width = '100%';
            } else if (i === groupIndex) {
                // Sima töltődés a diák előrehaladtával (25%, 50%, 75%, 100%)
                fill.style.width = `${(groupProgress / 4) * 100}%`;
            } else {
                fill.style.width = '0%';
            }
        });
    }

    /**
     * Leltár (kulcs-slotok) vizuális frissítése a megszerzett állomások alapján.
     * @param {string[]} [inventory=[]] - Megszerzett állomás azonosítók (pl. ['station_1', 'station_3'])
     */
    updateInventory(inventory = []) {
        if (!this.inventorySlotsEl) return;
        const slots = this.inventorySlotsEl.querySelectorAll('.dkv-g4-slot');
        if (!slots || slots.length === 0) return;

        const keyMap = {
            'station_1': 'keyA',
            'station_2': 'keyB',
            'station_3': 'keyC',
            'station_4': 'keyD',
            'station_5': 'keyE'
        };

        // Reset
        slots.forEach(slot => {
            slot.innerHTML = `<div class="dkv-g4-slot-icon"><span class="material-symbols-outlined">deployed_code</span></div>`;
        });

        // Fill based on acquired keys
        for (let i = 0; i < inventory.length; i++) {
            if (i >= slots.length) break;
            const stationId = inventory[i];
            const keyPrefix = keyMap[stationId];

            if (keyPrefix) {
                slots[i].innerHTML = `<div class="dkv-g4-slot-icon active-item"><span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">deployed_code</span></div>`;

                // Ha ez egy újonnan szerzett tárgy, akkor kap egy pulzáló effektet
                if (i === inventory.length - 1 && inventory.length > this.lastInventoryCount) {
                    slots[i].classList.add('dkv-g4-slot-collected');
                }
            }
        }

        this.lastInventoryCount = inventory.length;
    }

    _animateScore(start, end) {
        const duration = 1500;
        const startTime = performance.now();
        const element = this.pointsEl;

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = progress * (2 - progress);

            const current = Math.floor(start + (end - start) * ease);
            element.textContent = `${current}`;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = `${end}`;
            }
        };
        requestAnimationFrame(step);
    }

    /**
     * Narráció szöveg frissítése a narrator panelben.
     * @param {string} text - A megjelenítendő narráció szöveg (HTML tartalmazhat)
     */
    setNarration(text) {
        this.currentNarration = text || "Nincs elérhető adatfolyam.";

        const narratorBox = this.element ? this.element.querySelector('.dkv-g4-narrator-panel') : null;
        if (narratorBox) {
            const body = narratorBox.querySelector('.dkv-g4-panel-body');
            if (body) {
                body.innerHTML = `<div>${this.currentNarration.replace(/\\n/g, '<br>')}</div>`;
            }
        }
    }

    /**
     * Napló panel megnyitása vagy bezárása (toggle). Lazy init: első hívásra jön létre.
     */
    toggleJournal() {
        let journalPanel = this.element.querySelector('.dkv-g4-journal-panel');

        if (!journalPanel) {
            journalPanel = document.createElement('div');
            journalPanel.className = 'dkv-g4-journal-panel';
            journalPanel.innerHTML = `
                <div class="dkv-g4-panel-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h2>RENDSZER NAPLÓ</h2>
                    <div class="dkv-g4-close-icon" style="cursor: pointer;">✕</div>
                </div>
                <div class="dkv-g4-panel-body">
                    <textarea placeholder="Jegyzetek titkosítása..."></textarea>
                </div>
                <div class="dkv-g4-panel-footer">
                    <button class="dkv-g4-btn-close">SZÉTKAPCSOLÁS</button>
                </div>
            `;

            const closeBtn = journalPanel.querySelector('.dkv-g4-btn-close');
            if (closeBtn) {
                closeBtn.onclick = () => journalPanel.classList.remove('open');
            }

            const closeIcon = journalPanel.querySelector('.dkv-g4-close-icon');
            if (closeIcon) {
                closeIcon.onclick = (e) => {
                    e.stopPropagation();
                    journalPanel.classList.remove('open');
                };
            }

            this.element.appendChild(journalPanel);
            void journalPanel.offsetWidth;
        }
        journalPanel.classList.toggle('open');
    }

    /**
     * Narrátor (TERMINAL_FEED) panel megnyitása vagy bezárása (toggle). Lazy init: első hívásra jön létre.
     */
    toggleNarrator() {
        let narratorBox = this.element.querySelector('.dkv-g4-narrator-panel');

        if (!narratorBox) {
            narratorBox = document.createElement('div');
            narratorBox.className = 'dkv-g4-narrator-panel';
            narratorBox.innerHTML = `
                <div class="dkv-g4-panel-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h2>TERMINÁL BEJEGYZÉSEK</h2>
                    <div class="dkv-g4-close-icon" style="cursor: pointer;">✕</div>
                </div>
                <div class="dkv-g4-panel-body">
                    <div>${this.currentNarration.replace(/\n/g, '<br>')}</div>
                </div>
            `;
            this.element.appendChild(narratorBox);

            const closeIcon = narratorBox.querySelector('.dkv-g4-close-icon');
            if (closeIcon) {
                closeIcon.onclick = (e) => {
                    e.stopPropagation();
                    narratorBox.classList.remove('open');
                };
            }
        } else {
            const body = narratorBox.querySelector('.dkv-g4-panel-body');
            if (body) body.innerHTML = `<div>${this.currentNarration.replace(/\n/g, '<br>')}</div>`;
        }

        void narratorBox.offsetWidth;
        narratorBox.classList.toggle('open');
    }

    /**
     * Beállítások panel megnyitása vagy bezárása (toggle). Lazy init: első hívásra jön létre.
     * Hangerő csúszkákat és külső kattintásra záródó logikát tartalmaz.
     */
    toggleSettings() {
        let settingsPanel = this.element.querySelector('.dkv-g4-settings-panel');

        if (!settingsPanel) {
            settingsPanel = document.createElement('div');
            settingsPanel.className = 'dkv-g4-settings-panel';

            settingsPanel.innerHTML = `
                <div class="dkv-g4-panel-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h2>HANGBEÁLLÍTÁSOK</h2>
                    <div class="dkv-g4-close-icon" style="cursor: pointer;">✕</div>
                </div>
                <div class="dkv-g4-panel-body">
                    <div class="dkv-g4-setting-row">
                        <label>HÁTTÉRZENE</label>
                        <input type="range" min="0" max="100" value="50">
                    </div>
                    <div class="dkv-g4-setting-row">
                        <label>NARRÁTOR</label>
                        <input type="range" min="0" max="100" value="80">
                    </div>
                    <div class="dkv-g4-setting-row">
                        <label>EGÉRKATTINTÁS</label>
                        <input type="range" min="0" max="100" value="40">
                    </div>
                </div>
            `;

            this.element.appendChild(settingsPanel);

            const closeIcon = settingsPanel.querySelector('.dkv-g4-close-icon');
            if (closeIcon) {
                closeIcon.onclick = (e) => {
                    e.stopPropagation();
                    settingsPanel.classList.remove('open');
                };
            }

            const inputs = settingsPanel.querySelectorAll('input[type="range"]');
            const musicInput = inputs[0];
            const narratorInput = inputs[1];
            const sfxInput = inputs[2];

            if (musicInput) musicInput.value = this.currentMusicVolume;
            if (narratorInput) narratorInput.value = this.currentNarrationVolume;
            if (sfxInput) sfxInput.value = this.currentSfxVolume;

            if (musicInput) {
                musicInput.addEventListener('input', (e) => {
                    const val = parseInt(e.target.value, 10);
                    this.currentMusicVolume = val;
                    this.onMusicVolumeChange(val / 100);
                });
            }

            if (narratorInput) {
                narratorInput.addEventListener('input', (e) => {
                    const val = parseInt(e.target.value, 10);
                    this.currentNarrationVolume = val;
                    this.onNarrationVolumeChange(val / 100);
                });
            }

            if (sfxInput) {
                sfxInput.addEventListener('input', (e) => {
                    const val = parseInt(e.target.value, 10);
                    this.currentSfxVolume = val;
                    this.onSfxVolumeChange(val / 100);
                });
            }

            void settingsPanel.offsetWidth;
        }
        settingsPanel.classList.toggle('open');
    }

    /**
     * Feladat modal megjelenítése a képernyő közepén.
     * @param {string|HTMLElement} content - A modal törzs tartalma (szöveg vagy DOM elem)
     * @param {Function} [onOk] - Callback az EXECUTE gomb megnyomásakor
     * @param {Object} [options={}] - Megjelenítési opciók
     * @param {boolean} [options.hideHeader] - Fejléc elrejtése
     * @param {string} [options.title] - Egyéni fejléc szöveg
     * @param {string} [options.subtitle] - Egyéni alcím szöveg
     */
    showTaskModal(content, onOk, options = {}) {
        if (!this.taskModalOverlay) return;

        const header = this.taskModalOverlay.querySelector('.dkv-g4-task-modal-header');

        if (header) {
            if (options.hideHeader) {
                header.style.display = 'none';
            } else {
                header.style.display = 'flex';
                if (options.title !== undefined || options.subtitle !== undefined) {
                    header.innerHTML = '';
                    if (options.title) {
                        const h2 = document.createElement('h2');
                        h2.textContent = options.title;
                        header.appendChild(h2);
                    }
                    if (options.subtitle) {
                        const sub = document.createElement('p');
                        sub.textContent = options.subtitle;
                        header.appendChild(sub);
                    }
                } else {
                    header.innerHTML = '<h2>SYSTEM_OVERRIDE: TASK REQUIRED</h2>';
                }
            }
        }

        if (typeof content === 'string') {
            this.taskModalBody.innerHTML = `<div>${content}</div>`;
        } else {
            this.taskModalBody.innerHTML = '';
            this.taskModalBody.appendChild(content);
        }

        this.taskOkBtn.style.display = '';
        this.taskOkBtn.onclick = () => {
            if (onOk) onOk();
            this.hideTaskModal();
        };
        this.taskOkBtn.classList.add('visible');

        this.taskModalOverlay.classList.add('open');
    }

    /**
     * Feladat modal elrejtése és az OK gomb állapotának visszaállítása.
     */
    hideTaskModal() {
        if (this.taskModalOverlay) {
            this.taskModalOverlay.classList.remove('open');
            this.taskOkBtn.classList.remove('visible');
        }
    }

    /**
     * Feladat-OK (EXECUTE) gomb aktív/inaktív állapotának beállítása.
     * @param {boolean} enabled - true: aktív (kattintható), false: letiltott
     */
    setTaskOkButtonState(enabled) {
        if (this.taskOkBtn) {
            this.taskOkBtn.disabled = !enabled;
            this.taskOkBtn.style.opacity = enabled ? '1' : '0.5';
            this.taskOkBtn.style.cursor = enabled ? 'pointer' : 'not-allowed';
        }
    }

    /**
     * Következő gomb "finálé" vizuális megjelenésének beállítása (utolsó dia jelzéséhez).
     * @param {boolean} isFinal - true: finálé stílus, false: normál stílus
     */
    setNextButtonFinal(isFinal) {
        const btn = this.element.querySelector('.dkv-g4-btn-next');
        if (!btn) return;
        if (isFinal) {
            btn.classList.add('dkv-g4-btn-next--final');
        } else {
            btn.classList.remove('dkv-g4-btn-next--final');
        }
    }

    /**
     * Következő gomb aktív/inaktív állapotának és vizuális stílusának beállítása.
     * @param {boolean} enabled - true: aktív (kattintható), false: letiltott
     * @param {Object} [options={}] - Extra opciók (jövőbeli bővítésre fenntartva)
     */
    setNextButtonState(enabled) {
        const btn = this.element.querySelector('.dkv-g4-btn-next');
        if (!btn) return;

        btn.disabled = !enabled;
        if (enabled) {
            btn.classList.add('dkv-g4-btn-active');
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            this._startAttentionTimer();
        } else {
            btn.classList.remove('dkv-g4-btn-active');
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
            this._clearAttentionTimer();
        }
    }

    _startAttentionTimer() {
        this._clearAttentionTimer();
        const nextBtn = this.element.querySelector('.dkv-g4-btn-next');
        if (!nextBtn || nextBtn.disabled) return;

        this.attentionTimer = setTimeout(() => {
            nextBtn.classList.add('dkv-btn-to-orange');
            this.attentionPulseTimer = setTimeout(() => {
                nextBtn.classList.remove('dkv-btn-to-orange');
                nextBtn.classList.add('dkv-btn-attention');
            }, 1200); // Animation duration
        }, 8000); // 8 seconds idle
    }

    _clearAttentionTimer() {
        if (this.attentionTimer) {
            clearTimeout(this.attentionTimer);
            this.attentionTimer = null;
        }
        if (this.attentionPulseTimer) {
            clearTimeout(this.attentionPulseTimer);
            this.attentionPulseTimer = null;
        }
        const nextBtn = this.element.querySelector('.dkv-g4-btn-next');
        if (nextBtn) {
            nextBtn.classList.remove('dkv-btn-to-orange', 'dkv-btn-attention');
        }
    }

    /**
     * Cleanup: eseményfigyelők és DOM elemek eltávolítása a memóriaszivárgás megelőzéséhez.
     */
    destroy() {
        if (this.eventBus) {
            if (this.timerTickHandler) this.eventBus.off('timer:tick', this.timerTickHandler);
            if (this.timerStartHandler) this.eventBus.off('timer:competition-started', this.timerStartHandler);
        }

        this._clearAttentionTimer();

        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
        this.contentContainer = null;
        this.taskModalOverlay = null;
        this.taskOkBtn = null;
        this.taskModalBody = null;
        this.timelineContainerEl = null;
        this.timelineFillEls = null;
        this.stationLabelEl = null;
        this.stationTextEl = null;
        this.inventorySlotsEl = null;
        this.usernameEl = null;
        this.pointsEl = null;
        this.avatarEl = null;
    }
}

export default GameInterfaceGrade4;
