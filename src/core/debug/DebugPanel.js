/**
 * Debug Panel - UI komponens
 * 
 * Interaktív panel a slide skip és debug beállításokhoz.
 * Funkciók:
 * - Tab rendszer: Selection / Video
 * - Section-based skip (Selection tab - bal oldal)
 * - Individual slide skip (Selection tab - jobb oldal)
 * - Video settings per-slide (Video tab)
 * - Auto dummy data (Onboarding skip esetén)
 * - Hot reload (Save után azonnal érvényesül)
 * - Stats display
 */

class DebugPanel {
    constructor(options = {}) {
        this.debugManager = options.debugManager;
        this.stateManager = options.stateManager;
        this.onClose = options.onClose;

        this.element = null;
        this.leftPanel = null;
        this.rightPanel = null;
        this.selectedSection = null;
        this._escListener = null;

        // Tab state
        this.activeTab = 'selection'; // 'selection' | 'video' | 'tasks'
        this.tabContentContainer = null;

        // Video config state
        this.videoConfig = { slides: {} };
        this.selectedVideoSlide = null;

        // Tasks config state (lapbetöltéskor a debugManager-ből öröklünk)
        this.tasksConfig = Object.assign(
            { globalTimeLimit: 900, mazeDifficulty: 16, memoryDifficulty: 16, puzzleDifficulty: 16 },
            options.debugManager?.tasksConfig || {}
        );
    }

    /**
     * Panel létrehozása
     * 
     * @returns {HTMLElement} Panel overlay elem
     */
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'dkv-debug-panel-overlay';

        // Panel container
        const panel = document.createElement('div');
        panel.className = 'dkv-debug-panel';

        // Header
        const header = this._createHeader();
        panel.appendChild(header);

        // Tab Bar
        const tabBar = this._createTabBar();
        panel.appendChild(tabBar);

        // Tab Content Container
        this.tabContentContainer = document.createElement('div');
        this.tabContentContainer.className = 'dkv-debug-tab-content';
        panel.appendChild(this.tabContentContainer);

        // Render active tab
        this._renderTabContent();

        // Footer
        const footer = this._createFooter();
        panel.appendChild(footer);

        this.element.appendChild(panel);
        return this.element;
    }

    /**
     * Header létrehozása
     */
    _createHeader() {
        const header = document.createElement('div');
        header.className = 'dkv-debug-header';

        const title = document.createElement('h2');
        title.textContent = '🐛 DEBUG PANEL';

        const stats = document.createElement('div');
        stats.className = 'dkv-debug-stats';
        stats.id = 'dkv-debug-stats';
        stats.textContent = 'Loading...';

        header.appendChild(title);
        header.appendChild(stats);

        return header;
    }

    /**
     * Tab Bar létrehozása
     */
    _createTabBar() {
        const tabBar = document.createElement('div');
        tabBar.className = 'dkv-debug-tabs';

        const tabs = [
            { id: 'selection', label: '📋 Selection', icon: '📋' },
            { id: 'video', label: '🎬 Video', icon: '🎬' },
            { id: 'tasks', label: '🎯 Tasks', icon: '🎯' }
        ];

        tabs.forEach(tab => {
            const tabBtn = document.createElement('button');
            tabBtn.className = 'dkv-debug-tab' + (tab.id === this.activeTab ? ' active' : '');
            tabBtn.textContent = tab.label;
            tabBtn.dataset.tab = tab.id;

            tabBtn.addEventListener('click', () => {
                this.activeTab = tab.id;
                this._updateTabBar();
                this._renderTabContent();
            });

            tabBar.appendChild(tabBtn);
        });

        this.tabBar = tabBar;
        return tabBar;
    }

    /**
     * Tab Bar frissítése (aktív tab kijelölés)
     */
    _updateTabBar() {
        if (!this.tabBar) return;
        const tabs = this.tabBar.querySelectorAll('.dkv-debug-tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === this.activeTab);
        });
    }

    /**
     * Tab tartalom renderelése
     */
    _renderTabContent() {
        if (!this.tabContentContainer) return;
        this.tabContentContainer.innerHTML = '';

        if (this.activeTab === 'selection') {
            this._renderSelectionTab();
        } else if (this.activeTab === 'video') {
            this._renderVideoTab();
        } else if (this.activeTab === 'tasks') {
            this._renderTasksTab();
        }
    }

    /**
     * Selection Tab renderelése (eredeti 2-oszlopos layout)
     */
    _renderSelectionTab() {
        const content = document.createElement('div');
        content.className = 'dkv-debug-content';

        this.leftPanel = this._createLeftPanel();
        this.rightPanel = this._createRightPanel();

        content.appendChild(this.leftPanel);
        content.appendChild(this.rightPanel);
        this.tabContentContainer.appendChild(content);
    }

    /**
     * Video Tab renderelése
     */
    async _renderVideoTab() {
        const container = document.createElement('div');
        container.className = 'dkv-debug-video-tab';

        // Load video config
        await this._loadVideoConfig();

        // === Slide Selector ===
        const selectorSection = document.createElement('div');
        selectorSection.className = 'dkv-debug-video-section';

        const selectorLabel = document.createElement('label');
        selectorLabel.textContent = 'Dia kiválasztása:';
        selectorLabel.className = 'dkv-debug-video-label';

        const select = document.createElement('select');
        select.className = 'dkv-debug-video-select';
        select.id = 'dkv-debug-video-slide-select';

        // Group by section
        const sections = this.debugManager.sections;

        // Asynchronous videó meglét ellenőrzés
        const videoExistsCache = {};
        const checkVideoExists = async (slide, slideKey) => {
            if (slide.content?.videoUrl) return true; // Ha benne van a configban, biztosan van
            const url = `/assets/video/grade${this.debugManager.currentGrade}/${slideKey}.mp4`;
            try {
                const response = await fetch(url, { method: 'HEAD', cache: 'no-cache' });
                if (response.ok) {
                    const contentType = response.headers.get('content-type');
                    // Ha Vite visszadobja az index.html-t (SPA fallback), akkor text/html lesz
                    if (contentType && contentType.includes('text/html')) {
                        return false;
                    }
                    return true;
                }
                return false;
            } catch {
                return false;
            }
        };

        for (const section of sections) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = section.name;

            for (const idx of section.slideIndices) {
                const slide = this.debugManager.slides[idx];
                if (!slide) continue;

                const option = document.createElement('option');
                const slideKey = this._getSlideKey(slide);
                option.value = slideKey;
                option.dataset.slideIndex = idx; // Store index for lookup

                // Truncate title to avoid infinite width dropdown in OS level rendering
                let displayTitle = slide.title || slideKey;
                if (displayTitle.length > 40) {
                    displayTitle = displayTitle.substring(0, 37) + '...';
                }
                option.textContent = displayTitle;

                // Mark if has video config
                if (this.videoConfig.slides[slideKey]) {
                    option.textContent += ' ⚙️';
                }

                // Async fetch-check a fájl létezésére
                const hasVideo = await checkVideoExists(slide, slideKey);
                if (hasVideo) {
                    option.textContent += ' 📹';
                    videoExistsCache[slideKey] = true; // Mentjük le a későbbi _updateVideoSettings() -hoz

                    // AUTO-DETECT: Ha a json configban nem volt videoUrl, de a hálózaton létezik a fájl,
                    // beinjektáljuk a slide objektumba a futásidejű állapotba, hogy a VideoSlide használja
                    if (!slide.content) slide.content = {};
                    if (!slide.content.videoUrl) {
                        slide.content.videoUrl = `/assets/video/grade${this.debugManager.currentGrade}/${slideKey}.mp4`;
                    }
                }

                optgroup.appendChild(option);
            }

            select.appendChild(optgroup);
        }

        // Kimentjük az osztály szintjére az eredményt, hogy a Settings frissítő is tudjon róla
        this.videoExistsCache = videoExistsCache;

        select.addEventListener('change', () => {
            this.selectedVideoSlide = select.value;
            this.selectedVideoSlideIndex = parseInt(select.selectedOptions[0]?.dataset.slideIndex, 10);
            this._updateVideoSettings();
        });

        selectorSection.appendChild(selectorLabel);
        selectorSection.appendChild(select);
        container.appendChild(selectorSection);

        // Select first slide
        if (select.options.length > 0) {
            this.selectedVideoSlide = select.options[0].value;
            this.selectedVideoSlideIndex = parseInt(select.options[0].dataset.slideIndex, 10);
        }

        // === Video Settings Section ===
        const settingsSection = document.createElement('div');
        settingsSection.className = 'dkv-debug-video-section';
        settingsSection.id = 'dkv-debug-video-settings';

        const settingsTitle = document.createElement('h3');
        settingsTitle.textContent = '📹 Videó beállítások';
        settingsSection.appendChild(settingsTitle);

        // Status indicator
        const statusDiv = document.createElement('div');
        statusDiv.className = 'dkv-debug-video-status';
        statusDiv.id = 'dkv-debug-video-status';
        settingsSection.appendChild(statusDiv);

        // Delay input
        const delayRow = document.createElement('div');
        delayRow.className = 'dkv-debug-video-row';

        const delayLabel = document.createElement('label');
        delayLabel.textContent = 'Várakozás videó indítása előtt:';
        delayLabel.htmlFor = 'dkv-debug-video-delay';

        const delayInput = document.createElement('input');
        delayInput.type = 'number';
        delayInput.id = 'dkv-debug-video-delay';
        delayInput.className = 'dkv-debug-video-input';
        delayInput.min = 0;
        delayInput.max = 60;
        delayInput.value = 10;

        const delayUnit = document.createElement('span');
        delayUnit.textContent = ' másodperc';

        delayRow.appendChild(delayLabel);
        delayRow.appendChild(delayInput);
        delayRow.appendChild(delayUnit);
        settingsSection.appendChild(delayRow);

        // Loop checkbox
        const loopRow = document.createElement('div');
        loopRow.className = 'dkv-debug-video-row';

        const loopLabel = document.createElement('label');
        loopLabel.className = 'dkv-debug-video-checkbox-label';

        const loopCheckbox = document.createElement('input');
        loopCheckbox.type = 'checkbox';
        loopCheckbox.id = 'dkv-debug-video-loop';

        const loopText = document.createElement('span');
        loopText.textContent = 'Loop (ismétlés)';

        loopLabel.appendChild(loopCheckbox);
        loopLabel.appendChild(loopText);
        loopRow.appendChild(loopLabel);
        settingsSection.appendChild(loopRow);

        // Apply button for this slide
        const applyBtn = document.createElement('button');
        applyBtn.className = 'dkv-debug-btn dkv-debug-btn-apply';
        applyBtn.textContent = 'Alkalmazás erre a diára';
        applyBtn.addEventListener('click', () => this._applyVideoSettings());
        settingsSection.appendChild(applyBtn);

        container.appendChild(settingsSection);
        this.tabContentContainer.appendChild(container);

        // Initial update
        this._updateVideoSettings();
    }

    /**
     * Tasks Tab renderélése
     */
    _renderTasksTab() {
        const container = document.createElement('div');
        container.className = 'dkv-debug-video-tab'; // Azonos stilus, recycláljuk

        const heading = document.createElement('h3');
        heading.textContent = '🎯 Feladat beállítások';
        heading.style.marginBottom = '16px';
        container.appendChild(heading);

        // === Globális Időkorlát ===
        const timeLimitRow = document.createElement('div');
        timeLimitRow.className = 'dkv-debug-video-row';
        timeLimitRow.style.marginBottom = '20px'; // Kis távolság az első játéktól

        const timeLimitLabel = document.createElement('label');
        timeLimitLabel.textContent = 'Egységes Időkorlát (másodperc, 0 = nincs):';
        timeLimitLabel.htmlFor = 'dkv-debug-global-timelimit';
        timeLimitLabel.style.flex = '1';

        const timeLimitInput = document.createElement('input');
        timeLimitInput.type = 'number';
        timeLimitInput.id = 'dkv-debug-global-timelimit';
        timeLimitInput.className = 'dkv-debug-video-input';
        timeLimitInput.min = 0;
        timeLimitInput.max = 3600;
        timeLimitInput.step = 30;
        timeLimitInput.value = this.tasksConfig.globalTimeLimit ?? 900;
        timeLimitInput.style.width = '80px';

        const timeLimitUnit = document.createElement('span');
        timeLimitUnit.textContent = ' mp';
        timeLimitUnit.style.color = 'rgba(255,255,255,0.6)';

        timeLimitRow.appendChild(timeLimitLabel);
        timeLimitRow.appendChild(timeLimitInput);
        timeLimitRow.appendChild(timeLimitUnit);
        container.appendChild(timeLimitRow);

        // === Maze (Labirintus) ===
        const mazeSection = document.createElement('div');
        mazeSection.className = 'dkv-debug-video-section';

        const mazeTitle = document.createElement('h4');
        mazeTitle.textContent = '🌀 Labirintus';
        mazeTitle.style.cssText = 'color: #00eaff; margin: 0 0 12px; font-size: 1rem;';
        mazeSection.appendChild(mazeTitle);

        // === Nehézség (pályaméret) ===
        const diffRow = document.createElement('div');
        diffRow.className = 'dkv-debug-video-row';
        diffRow.style.marginTop = '12px';

        const diffLabel = document.createElement('label');
        diffLabel.textContent = 'Nehézség / pályaméret (NxN, páros):';
        diffLabel.htmlFor = 'dkv-debug-maze-difficulty';
        diffLabel.style.flex = '1';

        const diffInput = document.createElement('input');
        diffInput.type = 'number';
        diffInput.id = 'dkv-debug-maze-difficulty';
        diffInput.className = 'dkv-debug-video-input';
        diffInput.min = 6;
        diffInput.max = 30;
        diffInput.step = 2; // Csak páros értékek: 6, 8, 10, 12, 14, ...
        diffInput.value = this.tasksConfig.mazeDifficulty ?? 12;
        diffInput.style.width = '80px';

        const diffUnit = document.createElement('span');
        diffUnit.textContent = ' cella';
        diffUnit.style.color = 'rgba(255,255,255,0.6)';

        diffRow.appendChild(diffLabel);
        diffRow.appendChild(diffInput);
        diffRow.appendChild(diffUnit);
        mazeSection.appendChild(diffRow);

        const diffInfo = document.createElement('p');
        diffInfo.style.cssText = 'font-size: 0.8rem; color: rgba(255,255,255,0.5); margin: 4px 0 0;';
        diffInfo.textContent = 'Alap: 16 (16×16). Értékek: 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30.';
        mazeSection.appendChild(diffInfo);

        const infoEl = document.createElement('p');
        infoEl.style.cssText = 'font-size: 0.8rem; color: rgba(255,255,255,0.5); margin: 8px 0 0;';
        infoEl.textContent = 'A változás azonnal érvényesül a következő indításnál.';
        mazeSection.appendChild(infoEl);

        // Apply gomb
        const applyBtn = document.createElement('button');
        applyBtn.className = 'dkv-debug-btn dkv-debug-btn-apply';
        applyBtn.textContent = 'Mentés';
        applyBtn.style.marginTop = '12px';
        applyBtn.addEventListener('click', () => {
            const globalTimeVal = parseInt(timeLimitInput.value, 10);
            let diffVal = parseInt(diffInput.value, 10);
            // Kényszerítünk páros értéket
            if (isNaN(diffVal) || diffVal < 6) diffVal = 12;
            if (diffVal % 2 !== 0) diffVal = diffVal - 1;

            this.tasksConfig.globalTimeLimit = isNaN(globalTimeVal) ? 900 : globalTimeVal;
            this.tasksConfig.mazeDifficulty = diffVal;

            if (this.debugManager) {
                this.debugManager.tasksConfig = { ...this.tasksConfig };
                this.debugManager.saveConfig({
                    ...this.debugManager.skipConfig,
                    tasksConfig: this.tasksConfig
                });
            }
            applyBtn.textContent = '✅ Mentve!';
            applyBtn.disabled = true;
            setTimeout(() => {
                applyBtn.textContent = 'Mentés';
                applyBtn.disabled = false;
            }, 1500);
        });
        mazeSection.appendChild(applyBtn);

        container.appendChild(mazeSection);

        // === Memory (Adat-tenger) ===
        const memorySection = document.createElement('div');
        memorySection.className = 'dkv-debug-video-section';
        memorySection.style.marginTop = '20px';

        const memoryTitle = document.createElement('h4');
        memoryTitle.textContent = '🌊 Adat-tenger (Memória)';
        memoryTitle.style.cssText = 'color: #00eaff; margin: 0 0 12px; font-size: 1rem;';
        memorySection.appendChild(memoryTitle);

        const memDiffRow = document.createElement('div');
        memDiffRow.className = 'dkv-debug-video-row';

        const memDiffLabel = document.createElement('label');
        memDiffLabel.textContent = 'Kártyák száma (8, 12, 16, 20, 24):';
        memDiffLabel.htmlFor = 'dkv-debug-memory-difficulty';
        memDiffLabel.style.flex = '1';

        const memDiffInput = document.createElement('input');
        memDiffInput.type = 'number';
        memDiffInput.id = 'dkv-debug-memory-difficulty';
        memDiffInput.className = 'dkv-debug-video-input';
        memDiffInput.min = 4;
        memDiffInput.max = 48;
        memDiffInput.step = 2;
        memDiffInput.value = this.tasksConfig.memoryDifficulty ?? 16;
        memDiffInput.style.width = '80px';

        memDiffRow.appendChild(memDiffLabel);
        memDiffRow.appendChild(memDiffInput);
        memorySection.appendChild(memDiffRow);

        const memInfo = document.createElement('p');
        memInfo.style.cssText = 'font-size: 0.8rem; color: rgba(255,255,255,0.5); margin: 4px 0 0;';
        memInfo.textContent = 'Páros kártyaszám kell. Alap: 16 kártya (8 pár).';
        memorySection.appendChild(memInfo);

        const memApplyBtn = document.createElement('button');
        memApplyBtn.className = 'dkv-debug-btn dkv-debug-btn-apply';
        memApplyBtn.textContent = 'Mentés';
        memApplyBtn.style.marginTop = '12px';
        memApplyBtn.addEventListener('click', () => {
            let mDiff = parseInt(memDiffInput.value, 10);
            if (isNaN(mDiff) || mDiff < 4) mDiff = 16;
            if (mDiff % 2 !== 0) mDiff += 1;

            const globalTimeVal = parseInt(timeLimitInput.value, 10);

            this.tasksConfig.memoryDifficulty = mDiff;
            this.tasksConfig.globalTimeLimit = isNaN(globalTimeVal) ? 900 : globalTimeVal;

            if (this.debugManager) {
                this.debugManager.tasksConfig = { ...this.tasksConfig };
                this.debugManager.saveConfig({
                    ...this.debugManager.skipConfig,
                    tasksConfig: this.tasksConfig
                });
            }
            memApplyBtn.textContent = '✅ Mentve!';
            memApplyBtn.disabled = true;
            setTimeout(() => {
                memApplyBtn.textContent = 'Mentés';
                memApplyBtn.disabled = false;
            }, 1500);
        });
        memorySection.appendChild(memApplyBtn);

        container.appendChild(memorySection);

        // === Puzzle (Pixel Palota) ===
        const puzzleSection = document.createElement('div');
        puzzleSection.className = 'dkv-debug-video-section';
        puzzleSection.style.marginTop = '20px';

        const puzzleTitle = document.createElement('h4');
        puzzleTitle.textContent = '🧩 Pixel Palota (Puzzle)';
        puzzleTitle.style.cssText = 'color: #00eaff; margin: 0 0 12px; font-size: 1rem;';
        puzzleSection.appendChild(puzzleTitle);

        const puzzleDiffRow = document.createElement('div');
        puzzleDiffRow.className = 'dkv-debug-video-row';

        const puzzleDiffLabel = document.createElement('label');
        puzzleDiffLabel.textContent = 'Irányadó darabszám (kb. érték):';
        puzzleDiffLabel.htmlFor = 'dkv-debug-puzzle-difficulty';
        puzzleDiffLabel.style.flex = '1';

        const puzzleDiffInput = document.createElement('input');
        puzzleDiffInput.type = 'number';
        puzzleDiffInput.id = 'dkv-debug-puzzle-difficulty';
        puzzleDiffInput.className = 'dkv-debug-video-input';
        puzzleDiffInput.min = 4;
        puzzleDiffInput.max = 100;
        puzzleDiffInput.step = 1;
        puzzleDiffInput.value = this.tasksConfig.puzzleDifficulty ?? 16;
        puzzleDiffInput.style.width = '80px';

        puzzleDiffRow.appendChild(puzzleDiffLabel);
        puzzleDiffRow.appendChild(puzzleDiffInput);
        puzzleSection.appendChild(puzzleDiffRow);

        const puzzleInfo = document.createElement('p');
        puzzleInfo.style.cssText = 'font-size: 0.8rem; color: rgba(255,255,255,0.5); margin: 4px 0 0;';
        puzzleInfo.textContent = 'A játék a képarány miatt az optimális rácsot (pl. 5×3=15) generálja le ehhez a legközelebb.';
        puzzleSection.appendChild(puzzleInfo);

        const puzzleApplyBtn = document.createElement('button');
        puzzleApplyBtn.className = 'dkv-debug-btn dkv-debug-btn-apply';
        puzzleApplyBtn.textContent = 'Mentés';
        puzzleApplyBtn.style.marginTop = '12px';
        puzzleApplyBtn.addEventListener('click', () => {
            let pDiff = parseInt(puzzleDiffInput.value, 10);
            if (isNaN(pDiff) || pDiff < 4) pDiff = 16;

            const globalTimeVal = parseInt(timeLimitInput.value, 10);

            this.tasksConfig.puzzleDifficulty = pDiff;
            this.tasksConfig.globalTimeLimit = isNaN(globalTimeVal) ? 900 : globalTimeVal;

            if (this.debugManager) {
                this.debugManager.tasksConfig = { ...this.tasksConfig };
                this.debugManager.saveConfig({
                    ...this.debugManager.skipConfig,
                    tasksConfig: this.tasksConfig
                });
            }
            puzzleApplyBtn.textContent = '✅ Mentve!';
            puzzleApplyBtn.disabled = true;
            setTimeout(() => {
                puzzleApplyBtn.textContent = 'Mentés';
                puzzleApplyBtn.disabled = false;
            }, 1500);
        });
        puzzleSection.appendChild(puzzleApplyBtn);

        container.appendChild(puzzleSection);

        // === RESET ===
        const resetSection = document.createElement('div');
        resetSection.className = 'dkv-debug-video-section';
        resetSection.style.cssText = 'margin-top: 24px; border-top: 1px solid rgba(255,50,50,0.3); padding-top: 16px;';

        const resetTitle = document.createElement('h4');
        resetTitle.textContent = '🔄 Haladás visszaállítása';
        resetTitle.style.cssText = 'color: #ff6b6b; margin: 0 0 8px; font-size: 1rem;';
        resetSection.appendChild(resetTitle);

        const resetInfo = document.createElement('p');
        resetInfo.style.cssText = 'font-size: 0.8rem; color: rgba(255,255,255,0.5); margin: 0 0 12px;';
        resetInfo.textContent = 'Törli a befejezett feladatok listáját és a pontszámot, így a modalok újra megjelennek.';
        resetSection.appendChild(resetInfo);

        const resetBtn = document.createElement('button');
        resetBtn.className = 'dkv-debug-btn';
        resetBtn.style.cssText = 'background: rgba(255,60,60,0.2); border-color: #ff6b6b; color: #ff6b6b; width: 100%;';
        resetBtn.textContent = '🗑️ Feladatok reset';
        resetBtn.addEventListener('click', () => {
            if (!this.stateManager) {
                alert('StateManager nem elérhető!');
                return;
            }
            this.stateManager.updateState({
                progress: {
                    ...this.stateManager.state.progress,
                    completedSlides: [],
                    score: 0
                }
            });
            resetBtn.textContent = '✅ Törölve!';
            resetBtn.disabled = true;
            setTimeout(() => {
                resetBtn.textContent = '🗑️ Feladatok reset';
                resetBtn.disabled = false;
            }, 1500);
        });
        resetSection.appendChild(resetBtn);

        container.appendChild(resetSection);
        this.tabContentContainer.appendChild(container);
    }

    /**
     * Slide key generálása (slide_01, slide_02, stb.)
     */
    _getSlideKey(slide) {
        // Try to extract from imageUrl or videoUrl
        const url = slide.content?.videoUrl || slide.content?.imageUrl || '';
        const match = url.match(/slide_(\d+)/);
        if (match) {
            return `slide_${match[1]}`;
        }
        // Fallback to id
        return `slide_${String(slide.id).padStart(2, '0')}`;
    }

    /**
     * Video config betöltése
     * Elsőlegesen localStorage-ból, fejlesztői API másodlagos (csak ha elérhető)
     */
    async _loadVideoConfig() {
        const grade = this.debugManager.currentGrade;
        const lsKey = `dkv-video-config-grade${grade}`;

        // 1. localStorage-ból tölt
        try {
            const stored = localStorage.getItem(lsKey);
            if (stored) {
                this.videoConfig = JSON.parse(stored);
                console.log('[DebugPanel] Video config loaded from localStorage');
            }
        } catch (e) {
            this.videoConfig = { slides: {} };
        }

        // 2. API (csak fejlesztői környezetben érhető el - felülírja a localStorage-t)
        try {
            const response = await fetch(`/__api/video-config/${grade}`, { signal: AbortSignal.timeout(1000) });
            if (response.ok) {
                const apiConfig = await response.json();
                // Merge: API-ban lévő értékek felülírják a localStorage-t
                this.videoConfig = apiConfig;
                // Szinkronizálás visszafelé is
                localStorage.setItem(lsKey, JSON.stringify(this.videoConfig));
                console.log('[DebugPanel] Video config loaded from API (dev mode)');
            }
        } catch {
            // Éles szerveren ez normális - nem hiba
        }

        if (!this.videoConfig) {
            this.videoConfig = { slides: {} };
        }
    }

    /**
     * Video beállítások mentése
     * Mindig localStorage-ba ment (éles szerveren is működik),
     * ezenfelül megpróbálja az API-t is (csak fejlesztői környezetben sikeres)
     */
    async _saveVideoConfig() {
        const grade = this.debugManager.currentGrade;
        const lsKey = `dkv-video-config-grade${grade}`;

        // 1. localStorage mentés (mindig működik)
        try {
            localStorage.setItem(lsKey, JSON.stringify(this.videoConfig));
            console.log('[DebugPanel] Video config saved to localStorage');
        } catch (e) {
            console.error('[DebugPanel] localStorage save failed:', e);
        }

        // 2. API mentés (csak fejlesztői - ha nem érhető el, csendesen sikertelen)
        try {
            const response = await fetch(`/__api/video-config/${grade}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.videoConfig),
                signal: AbortSignal.timeout(2000)
            });
            if (response.ok) {
                console.log('[DebugPanel] Video config also saved to API (dev mode)');
            }
        } catch {
            // Éles szerveren normális - nem hiba
        }
    }

    /**
     * Video settings UI frissítése a kiválasztott dia alapján
     */
    _updateVideoSettings() {
        const slideKey = this.selectedVideoSlide;
        if (!slideKey) return;

        const config = this.videoConfig.slides[slideKey] || {};
        const delayInput = document.getElementById('dkv-debug-video-delay');
        const loopCheckbox = document.getElementById('dkv-debug-video-loop');
        const statusDiv = document.getElementById('dkv-debug-video-status');

        if (delayInput) {
            delayInput.value = config.videoDelay ? config.videoDelay / 1000 : 10;
        }
        if (loopCheckbox) {
            loopCheckbox.checked = config.videoLoop ?? false;
        }

        // Find slide using stored index (more reliable than key matching)
        const slideIndex = this.selectedVideoSlideIndex;
        const slide = (slideIndex !== undefined && slideIndex >= 0)
            ? this.debugManager.slides[slideIndex]
            : null;

        if (statusDiv) {
            // Check mind a json config arrayt, mind a valós (fetched) cache arrayt
            if (slide?.content?.videoUrl || (this.videoExistsCache && this.videoExistsCache[slideKey])) {
                const videoName = slide?.content?.videoUrl ? slide.content.videoUrl.split('/').pop() : `${slideKey}.mp4`;
                statusDiv.innerHTML = `<span class="status-ok">✅ Videó van: ${videoName}</span>`;
            } else {
                statusDiv.innerHTML = `<span class="status-warn">⚠️ Nincs videó ehhez a diához</span>`;
            }
        }
    }

    /**
     * Video beállítások alkalmazása a kiválasztott diára
     */
    async _applyVideoSettings() {
        const slideKey = this.selectedVideoSlide;
        if (!slideKey) return;

        const delayInput = document.getElementById('dkv-debug-video-delay');
        const loopCheckbox = document.getElementById('dkv-debug-video-loop');

        const delay = parseFloat(delayInput?.value || 10) * 1000; // Convert to ms
        const loop = loopCheckbox?.checked ?? false;

        this.videoConfig.slides[slideKey] = {
            videoDelay: delay,
            videoLoop: loop
        };

        await this._saveVideoConfig();

        // Update dropdown to show configured indicator
        const select = document.getElementById('dkv-debug-video-slide-select');
        if (select) {
            const option = Array.from(select.options).find(o => o.value === slideKey);
            if (option && !option.textContent.includes('⚙️')) {
                option.textContent += ' ⚙️';
            }
        }

        // Visual feedback
        const btn = document.querySelector('.dkv-debug-btn-apply');
        if (btn) {
            const original = btn.textContent;
            btn.textContent = '✅ Mentve!';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = original;
                btn.disabled = false;
            }, 1500);
        }
    }

    /**
     * Left Panel létrehozása (Section Skip)
     */
    _createLeftPanel() {
        const panel = document.createElement('div');
        panel.className = 'dkv-debug-left-panel';

        const heading = document.createElement('h3');
        heading.textContent = 'Section Skip';
        panel.appendChild(heading);

        // Section checkboxes
        this.debugManager.sections.forEach(section => {
            const label = document.createElement('label');
            label.className = 'dkv-debug-section-item';
            label.dataset.sectionId = section.id;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = section.id;
            checkbox.checked = this.debugManager.isSectionSkipped(section.id);

            checkbox.addEventListener('change', () => {
                this._onSectionCheckboxChange(section, checkbox.checked);
            });

            const text = document.createElement('span');
            text.className = 'dkv-debug-section-name';
            text.textContent = section.name;

            label.appendChild(checkbox);
            label.appendChild(text);

            // Csak a névre kattintás válassza ki a szekciót
            text.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this._selectSection(section);
            });

            panel.appendChild(label);
        });

        // Separator + Mute Music checkbox
        const separator = document.createElement('div');
        separator.className = 'dkv-debug-separator';
        panel.appendChild(separator);

        const muteLabel = document.createElement('label');
        muteLabel.className = 'dkv-debug-mute-music';

        const muteCheckbox = document.createElement('input');
        muteCheckbox.type = 'checkbox';
        muteCheckbox.id = 'dkv-debug-mute-music';
        muteCheckbox.checked = this.debugManager.skipConfig.muteMusic !== false; // Default: true

        const muteText = document.createElement('span');
        muteText.textContent = '🔇 Háttérzene némítása';

        muteLabel.appendChild(muteCheckbox);
        muteLabel.appendChild(muteText);
        panel.appendChild(muteLabel);

        return panel;
    }

    /**
     * Right Panel létrehozása (Detailed Slide Skip)
     */
    _createRightPanel() {
        const panel = document.createElement('div');
        panel.className = 'dkv-debug-right-panel';

        const heading = document.createElement('h3');
        heading.textContent = 'Detailed Slide Skip';
        panel.appendChild(heading);

        const placeholder = document.createElement('p');
        placeholder.className = 'dkv-debug-placeholder';
        placeholder.textContent = '← Select a section on the left to see individual slides.';
        panel.appendChild(placeholder);

        return panel;
    }

    /**
     * Footer létrehozása (gombok)
     */
    _createFooter() {
        const footer = document.createElement('div');
        footer.className = 'dkv-debug-footer';

        // Save & Close button
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save & Close';
        saveBtn.className = 'dkv-debug-btn dkv-debug-btn-primary';
        saveBtn.addEventListener('click', () => this._onSave());

        // Clear All button
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear All';
        clearBtn.className = 'dkv-debug-btn dkv-debug-btn-secondary';
        clearBtn.addEventListener('click', () => this._onClearAll());

        // Cancel button
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.className = 'dkv-debug-btn';
        cancelBtn.addEventListener('click', () => this.close());

        footer.appendChild(saveBtn);
        footer.appendChild(clearBtn);
        footer.appendChild(cancelBtn);

        return footer;
    }

    /**
     * Section kiválasztása (jobb panel frissítés)
     * 
     * @param {Object} section - Section objektum
     */
    _selectSection(section) {
        this.selectedSection = section;
        this._renderDetailedSlides(section);

        // Visual highlight (bal oldalon)
        const items = this.leftPanel.querySelectorAll('.dkv-debug-section-item');
        items.forEach(item => item.classList.remove('selected'));

        const selectedItem = this.leftPanel.querySelector(`[data-section-id="${section.id}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }
    }

    /**
     * Detailed slides renderelése (jobb panel)
     * 
     * @param {Object} section - Section objektum
     */
    _renderDetailedSlides(section) {
        const isSectionSkipped = this.debugManager.isSectionSkipped(section.id);

        // Clear
        this.rightPanel.innerHTML = '';

        // Heading
        const heading = document.createElement('h3');
        heading.textContent = `${section.name} - Slides`;
        this.rightPanel.appendChild(heading);

        // Warning ha section skip-elve
        if (isSectionSkipped) {
            const warning = document.createElement('p');
            warning.className = 'dkv-debug-warning';
            warning.textContent = '⚠️ Entire section is skipped. Uncheck section to enable individual control.';
            this.rightPanel.appendChild(warning);
        }

        // Slide checkboxes
        section.slideIndices.forEach(idx => {
            const slide = this.debugManager.slides[idx];
            if (!slide) return;

            const label = document.createElement('label');
            label.className = 'dkv-debug-slide-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            const slideValue = slide.id || idx;
            checkbox.value = slideValue;

            // Ha van ID, csak azt nézzük (index-mentesítés)
            if (slide.id) {
                checkbox.checked = this.debugManager.skipConfig.skipSlides.includes(slide.id);
            } else {
                checkbox.checked = this.debugManager.skipConfig.skipSlides.includes(idx);
            }

            checkbox.disabled = isSectionSkipped; // Disabled ha section skip

            checkbox.addEventListener('change', () => {
                this._onSlideCheckboxChange(slideValue, checkbox.checked);
            });

            const text = document.createElement('span');
            text.textContent = `[${slide.id}] ${slide.title}`;

            label.appendChild(checkbox);
            label.appendChild(text);
            this.rightPanel.appendChild(label);
        });
    }

    /**
     * Section checkbox change handler
     * 
     * @param {Object} section - Section objektum
     * @param {boolean} checked - Checkbox állapot
     */
    _onSectionCheckboxChange(section, checked) {
        const config = this.debugManager.skipConfig;

        if (checked) {
            // Hozzáadás
            if (!config.skipSections.includes(section.id)) {
                config.skipSections.push(section.id);
            }
        } else {
            // Eltávolítás
            const idx = config.skipSections.indexOf(section.id);
            if (idx > -1) {
                config.skipSections.splice(idx, 1);
            }
        }

        // Refresh right panel ha ez a section van kiválasztva
        if (this.selectedSection?.id === section.id) {
            this._renderDetailedSlides(section);
        }

        this._updateStats();

        // AUTO-SAVE: Mentés azonnal, hogy code-reload esetén ne vesszen el
        this._autoSave();
    }

    _autoSave() {
        const muteCheckbox = document.getElementById('dkv-debug-mute-music');
        const config = {
            enabled: true,
            skipSections: this.debugManager.skipConfig.skipSections,
            skipSlides: this.debugManager.skipConfig.skipSlides,
            useDummyData: true,
            muteMusic: muteCheckbox ? muteCheckbox.checked : true,
            tasksConfig: this.tasksConfig
        };
        this.debugManager.saveConfig(config);
        this._exportBuildConfig(config);
    }

    /**
     * Debug beállításokat elmenti a public/build-config.json-be (fejlesztői API)
     * Ez a fájl bekerül a dist/-be és éles szerveren is érvényes lesz.
     * @param {Object} config
     */
    async _exportBuildConfig(config) {
        try {
            await fetch('/__api/build-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
                signal: AbortSignal.timeout(2000)
            });
        } catch {
            // Éles szerveren néma hiba - nem zár az API
        }
    }

    /**
     * Slide checkbox change handler
     * 
     * @param {string|number} slideId - Slide ID vagy index
     * @param {boolean} checked - Checkbox állapot
     */
    _onSlideCheckboxChange(slideId, checked) {
        const config = this.debugManager.skipConfig;

        if (checked) {
            if (!config.skipSlides.includes(slideId)) {
                config.skipSlides.push(slideId);
            }
        } else {
            const idx = config.skipSlides.indexOf(slideId);
            if (idx > -1) {
                config.skipSlides.splice(idx, 1);
            }
        }

        this._updateStats();
        // AUTO-SAVE: Mentés azonnal
        this._autoSave();
    }

    /**
     * Statisztikák frissítése (header)
     */
    _updateStats() {
        const stats = this.debugManager.getStats();
        const statsEl = document.getElementById('dkv-debug-stats');

        if (statsEl) {
            statsEl.textContent = `Skipped: ${stats.skippedSections} sections (${stats.skippedSectionSlides} slides), ${stats.skippedIndividualSlides} individual | Total: ${stats.totalSkipped} of ${stats.totalSlides} slides`;
        }
    }

    /**
     * Save & Close gomb handler
     */
    _onSave() {
        const muteCheckbox = document.getElementById('dkv-debug-mute-music');

        const config = {
            enabled: true,
            skipSections: this.debugManager.skipConfig.skipSections,
            skipSlides: this.debugManager.skipConfig.skipSlides,
            useDummyData: true,
            muteMusic: muteCheckbox ? muteCheckbox.checked : true,
            tasksConfig: this.tasksConfig
        };

        this.debugManager.saveConfig(config);
        this.debugManager.reloadConfig();
        this._exportBuildConfig(config);

        console.log('[DEBUG] Config saved, reloaded and exported to build-config.json', config);

        this.close();
    }

    /**
     * Clear All gomb handler
     */
    _onClearAll() {
        if (!confirm('Clear all skip settings? This will reset the debug configuration.')) {
            return;
        }

        const config = {
            enabled: false,
            skipSections: [],
            skipSlides: [],
            useDummyData: false
        };

        this.debugManager.saveConfig(config);
        this.debugManager.reloadConfig();

        console.log('[DEBUG] All settings cleared');

        this.close();
    }

    /**
     * Panel megjelenítése
     */
    show() {
        if (!this.element) {
            this.createElement();
        }

        document.body.appendChild(this.element);
        this._updateStats();

        // ESC listener
        this._escListener = (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        };
        document.addEventListener('keydown', this._escListener);

        console.log('[DEBUG] Panel opened');
    }

    /**
     * Panel bezárása
     */
    close() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }

        if (this._escListener) {
            document.removeEventListener('keydown', this._escListener);
            this._escListener = null;
        }

        if (this.onClose) {
            this.onClose();
        }

        console.log('[DEBUG] Panel closed');
    }

    /**
     * Cleanup
     */
    destroy() {
        this.close();
    }
}

export default DebugPanel;
