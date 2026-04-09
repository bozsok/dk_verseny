export default class GameInterfaceGrade4 {
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

        this.element = null;
        this.contentContainer = null;
        this.currentNarration = "Transmission Incoming // Decrypting...";
        
        this.eventBus = options.eventBus || null;
        this.timeManager = options.timeManager || null;
        this.timerTickHandler = null;
        this.timerStartHandler = null;
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
                <div class="dkv-g4-avatar-dot"></div>
            </div>
            <div class="dkv-g4-user-info">
                <span class="dkv-g4-username">PLAYER</span>
                <span class="dkv-g4-points-container"><span class="dkv-g4-points-label">PTS:</span> <span class="dkv-g4-points-value">0</span></span>
            </div>
        `;
        this.avatarEl = hudLeft.querySelector('.dkv-g4-avatar-image');
        this.usernameEl = hudLeft.querySelector('.dkv-g4-username');
        this.pointsEl = hudLeft.querySelector('.dkv-g4-points-value');

        const hudRight = document.createElement('div');
        hudRight.className = 'dkv-g4-hud-right';

        const timerContainer = document.createElement('div');
        timerContainer.className = 'dkv-g4-timer-container';
        timerContainer.style.display = 'none';
        this.timerContainerEl = timerContainer;
        timerContainer.innerHTML = `
            <span class="material-symbols-outlined dkv-g4-timer-icon">timer</span>
            <span class="dkv-g4-timer-value">00:00:00</span>
        `;

        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'dkv-g4-btn-settings';
        settingsBtn.innerHTML = `<span class="material-symbols-outlined">settings</span>`;
        settingsBtn.onclick = () => this.onOpenSettings();

        hudRight.appendChild(timerContainer);
        hudRight.appendChild(settingsBtn);
        header.appendChild(hudLeft);
        header.appendChild(hudRight);
        this.element.appendChild(header);

        // 3. SIDE NAV
        const sideNav = document.createElement('nav');
        sideNav.className = 'dkv-g4-side-nav';

        const narratorBtn = document.createElement('button');
        narratorBtn.className = 'dkv-g4-nav-item';
        narratorBtn.innerHTML = `<span class="material-symbols-outlined">terminal</span>`;
        narratorBtn.onclick = () => this.onOpenNarrator();

        const journalBtn = document.createElement('button');
        journalBtn.className = 'dkv-g4-nav-item';
        journalBtn.innerHTML = `<span class="material-symbols-outlined">history_edu</span>`;
        journalBtn.onclick = () => this.onOpenJournal();

        sideNav.appendChild(narratorBtn);
        sideNav.appendChild(journalBtn);
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
        prevBtn.onclick = () => this.onPrev();

        const nextBtn = document.createElement('button');
        nextBtn.className = 'dkv-g4-btn-next';
        nextBtn.setAttribute('aria-label', 'Következő');
        const nextIcon = document.createElement('span');
        nextIcon.className = 'material-symbols-outlined';
        nextIcon.textContent = 'chevron_right';
        nextBtn.appendChild(nextIcon);
        nextBtn.onclick = () => this.onNext();

        navControls.appendChild(prevBtn);
        navControls.appendChild(nextBtn);
        this.element.appendChild(navControls);

        // (Story szövegdoboz a képernyő aljáról eltávolítva)

        // 7. BOTTOM HUD
        const footer = document.createElement('footer');
        footer.className = 'dkv-g4-bottom-hud';

        const stationInfo = document.createElement('div');
        stationInfo.className = 'dkv-g4-station-info';
        stationInfo.innerHTML = `
            <span class="dkv-g4-station-label">Sector</span>
            <span class="dkv-g4-station-value">STATION_00 <span class="dkv-g4-station-total">/ ${this.totalSlides}</span></span>
        `;

        const timeline = document.createElement('div');
        timeline.className = 'dkv-g4-timeline';
        this.timelineContainerEl = timeline;

        const inventoryArea = document.createElement('div');
        inventoryArea.className = 'dkv-g4-inventory-area';
        inventoryArea.innerHTML = `
            <span class="dkv-g4-inventory-label">Updates</span>
            <div class="dkv-g4-inventory-slots">
                <div class="dkv-g4-slot"><div class="dkv-g4-slot-icon bg-active"><span class="material-symbols-outlined">extension</span></div></div>
                <div class="dkv-g4-slot"><div class="dkv-g4-slot-icon"><span class="material-symbols-outlined">extension</span></div></div>
                <div class="dkv-g4-slot"><div class="dkv-g4-slot-icon"><span class="material-symbols-outlined">extension</span></div></div>
                <div class="dkv-g4-slot"><div class="dkv-g4-slot-icon"><span class="material-symbols-outlined">extension</span></div></div>
                <div class="dkv-g4-slot"><div class="dkv-g4-slot-icon"><span class="material-symbols-outlined">extension</span></div></div>
            </div>
        `;
        this.inventorySlotsEl = inventoryArea.querySelector('.dkv-g4-inventory-slots');

        footer.appendChild(stationInfo);
        footer.appendChild(timeline);
        footer.appendChild(inventoryArea);
        this.element.appendChild(footer);
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
                    <h2>SYSTEM_OVERRIDE: TASK REQUIRED</h2>
                </div>
                <div class="dkv-g4-task-modal-body"></div>
                <button class="dkv-g4-task-ok-btn">EXECUTE</button>
            </div>
        `;
        this.element.appendChild(this.taskModalOverlay);

        this.taskOkBtn = this.taskModalOverlay.querySelector('.dkv-g4-task-ok-btn');
        this.taskModalBody = this.taskModalOverlay.querySelector('.dkv-g4-task-modal-body');

        // 9. TASK MODAL (már előzőleg konfigurálva)
        // Note: the taskModal logic is mapped similarly to GameInterface

        // Időmérő megjelenítés eseményfigyelőjének beállítása
        if (this.eventBus) {
            this.timerStartHandler = () => {
                if (this.timerContainerEl) this.timerContainerEl.style.display = 'flex';
            };
            this.timerTickHandler = (data) => {
                if (this.timerContainerEl) this.timerContainerEl.style.display = 'flex';
                this.updateTimer(data.elapsed);
            };
            this.eventBus.on('timer:competition-started', this.timerStartHandler);
            this.eventBus.on('timer:tick', this.timerTickHandler);
        }

        // Kezdeti megjelenítés, ha az időmérő már fut (pl. Onboarding skip / Debug override esetén)
        // Kezdeti megjelenítés, ha az időmérő már fut (pl. Onboarding skip / Debug override esetén)
        if (this.timeManager && this.timeManager.globalTimer.isRunning) {
            if (this.timerContainerEl) this.timerContainerEl.style.display = 'flex';
            this.updateTimer(this.timeManager.getElapsedTime());
        }

        // Kezdeti HUD frissítés, ha van StateManager
        if (this.options.stateManager) {
            this.updateHUD(this.options.stateManager.getState());
        }

        return this.element;
    }

    /**
     * Időmérő felület frissítése a Grade 4 UI-n
     * @param {number} ms - Eltelt idő milliszekundumban
     */
    updateTimer(ms) {
        if (!this.element) return;
        const timerValueEl = this.element.querySelector('.dkv-g4-timer-value');
        if (!timerValueEl) return;

        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        const pad = (num) => num.toString().padStart(2, '0');
        timerValueEl.textContent = `${pad(minutes)}:${pad(seconds)}`;
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
     */
    updateTimeline(currentSlide) {
        if (!this.timelineContainerEl) return;
        this.timelineContainerEl.innerHTML = '';

        if (this.stationTextEl) {
            this.stationTextEl.innerHTML = `STATION_${String(currentSlide).padStart(2, '0')} <span class="dkv-g4-station-total">/ ${this.totalSlides}</span>`;
        }

        const segments = 10;
        const offset = 1;
        const current = Math.max(0, currentSlide - offset);
        const progressPct = current / this.totalSlides;
        const filledSegments = Math.round(progressPct * segments);

        for (let i = 0; i < segments; i++) {
            const seg = document.createElement('div');
            seg.className = i < filledSegments ? 'dkv-g4-timeline-segment filled' : 'dkv-g4-timeline-segment';
            this.timelineContainerEl.appendChild(seg);
        }
    }

    /**
     * HUD elemek frissítése: avatar, felhasználónév, pontszám, leltár.
     * @param {Object} [state={}] - GameStateManager állapotobjektum
     * @param {string} [state.avatar] - Avatar kép URL
     * @param {Object} [state.userProfile] - Felhasználói profil ({ nickname })
     * @param {number} [state.score] - Aktuális pontszám
     * @param {Object} [state.progress] - Haladás adatok ({ inventory: string[] })
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
            slot.innerHTML = `<div class="dkv-g4-slot-icon"><span class="material-symbols-outlined">extension</span></div>`;
        });

        // Fill based on acquired keys
        for (let i = 0; i < inventory.length; i++) {
            if (i >= slots.length) break;
            const stationId = inventory[i];
            const keyPrefix = keyMap[stationId];

            if (keyPrefix) {
                slots[i].innerHTML = `<div class="dkv-g4-slot-icon active-item"><span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">extension</span></div>`;
            }
        }
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

        let narratorBox = this.element ? this.element.querySelector('.dkv-g4-narrator-panel') : null;
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
                <div class="dkv-g4-panel-header">
                    <h2>SYSTEM LOG</h2>
                </div>
                <div class="dkv-g4-panel-body">
                    <textarea placeholder="Encrypting notes..."></textarea>
                </div>
                <div class="dkv-g4-panel-footer">
                    <button class="dkv-g4-btn-close">DISCONNECT</button>
                </div>
            `;

            journalPanel.querySelector('.dkv-g4-btn-close').onclick = () => journalPanel.classList.remove('open');
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
                    <h2>TERMINAL_FEED</h2>
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
                <div class="dkv-g4-panel-header">
                    <h2>SYSTEM_CONFIG</h2>
                </div>
                <div class="dkv-g4-panel-body">
                    <div class="dkv-g4-setting-row">
                        <label>AUDIO_FREQ</label>
                        <input type="range" min="0" max="100" value="50">
                    </div>
                    <div class="dkv-g4-setting-row">
                        <label>VOCAL_FEED</label>
                        <input type="range" min="0" max="100" value="80">
                    </div>
                    <div class="dkv-g4-setting-row">
                        <label>HAPTIC_FB</label>
                        <input type="range" min="0" max="100" value="40">
                    </div>
                </div>
            `;

            this.element.appendChild(settingsPanel);

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

            this._settingsMousedownHandler = (e) => {
                if (settingsPanel.classList.contains('open') &&
                    !settingsPanel.contains(e.target) &&
                    !e.target.closest('.dkv-g4-btn-settings')) {
                    settingsPanel.classList.remove('open');
                }
            };
            document.addEventListener('mousedown', this._settingsMousedownHandler);

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
        const modal = this.taskModalOverlay.querySelector('.dkv-g4-task-modal');

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
    setNextButtonState(enabled, options = {}) {
        const btn = this.element.querySelector('.dkv-g4-btn-next');
        if (!btn) return;

        btn.disabled = !enabled;
        if (enabled) {
            btn.classList.add('dkv-g4-btn-active');
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        } else {
            btn.classList.remove('dkv-g4-btn-active');
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
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
        if (this._settingsMousedownHandler) {
            document.removeEventListener('mousedown', this._settingsMousedownHandler);
            this._settingsMousedownHandler = null;
        }
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
        this.contentContainer = null;
        this.taskModalOverlay = null;
        this.taskOkBtn = null;
        this.taskModalBody = null;
        this.timelineContainerEl = null;
        this.stationTextEl = null;
        this.inventorySlotsEl = null;
        this.usernameEl = null;
        this.pointsEl = null;
        this.avatarEl = null;
    }
}
