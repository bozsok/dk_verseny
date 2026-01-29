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
        this.onClose = options.onClose;

        this.element = null;
        this.leftPanel = null;
        this.rightPanel = null;
        this.selectedSection = null;
        this._escListener = null;

        // Tab state
        this.activeTab = 'selection'; // 'selection' | 'video'
        this.tabContentContainer = null;

        // Video config state
        this.videoConfig = { slides: {} };
        this.selectedVideoSlide = null;
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
            { id: 'video', label: '🎬 Video', icon: '🎬' }
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
        sections.forEach(section => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = section.name;

            section.slideIndices.forEach(idx => {
                const slide = this.debugManager.slides[idx];
                if (!slide) return;

                const option = document.createElement('option');
                const slideKey = this._getSlideKey(slide);
                option.value = slideKey;
                option.dataset.slideIndex = idx; // Store index for lookup
                option.textContent = slide.title;

                // Mark if has video config
                if (this.videoConfig.slides[slideKey]) {
                    option.textContent += ' ⚙️';
                }

                // Mark if has video URL
                if (slide.content?.videoUrl) {
                    option.textContent += ' 📹';
                }

                optgroup.appendChild(option);
            });

            select.appendChild(optgroup);
        });

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
     * Video config betöltése API-ból
     */
    async _loadVideoConfig() {
        try {
            const grade = this.debugManager.currentGrade;
            const response = await fetch(`/__api/video-config/${grade}`);
            if (response.ok) {
                this.videoConfig = await response.json();
            }
        } catch (err) {
            console.warn('[DebugPanel] Failed to load video config:', err);
            this.videoConfig = { slides: {} };
        }
    }

    /**
     * Video beállítások mentése API-ba
     */
    async _saveVideoConfig() {
        try {
            const grade = this.debugManager.currentGrade;
            const response = await fetch(`/__api/video-config/${grade}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.videoConfig)
            });
            if (response.ok) {
                console.log('[DebugPanel] Video config saved');
            }
        } catch (err) {
            console.error('[DebugPanel] Failed to save video config:', err);
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
            if (slide?.content?.videoUrl) {
                statusDiv.innerHTML = `<span class="status-ok">✅ Videó van: ${slide.content.videoUrl.split('/').pop()}</span>`;
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
            text.textContent = `${section.name} (${section.slideIndices.length} slides)`;

            label.appendChild(checkbox);
            label.appendChild(text);

            // Click to view details (de ne a checkbox-on)
            label.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    this._selectSection(section);
                }
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
            checkbox.value = idx;
            checkbox.checked = this.debugManager.skipConfig.skipSlides.includes(idx);
            checkbox.disabled = isSectionSkipped; // Disabled ha section skip

            checkbox.addEventListener('change', () => {
                this._onSlideCheckboxChange(idx, checkbox.checked);
            });

            const text = document.createElement('span');
            text.textContent = `Slide ${idx + 1}: ${slide.title}`;

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
    }

    /**
     * Individual slide checkbox change handler
     * 
     * @param {number} slideIndex - Slide index
     * @param {boolean} checked - Checkbox állapot
     */
    _onSlideCheckboxChange(slideIndex, checked) {
        const config = this.debugManager.skipConfig;

        if (checked) {
            // Hozzáadás
            if (!config.skipSlides.includes(slideIndex)) {
                config.skipSlides.push(slideIndex);
            }
        } else {
            // Eltávolítás
            const idx = config.skipSlides.indexOf(slideIndex);
            if (idx > -1) {
                config.skipSlides.splice(idx, 1);
            }
        }

        this._updateStats();
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

        // useDummyData mindig true lesz (Onboarding skip auto-enable)
        const config = {
            enabled: true, // Automatikusan enabled
            skipSections: this.debugManager.skipConfig.skipSections,
            skipSlides: this.debugManager.skipConfig.skipSlides,
            useDummyData: true, // Mindig true, az Onboarding skip automatikusan engedélyezi
            muteMusic: muteCheckbox ? muteCheckbox.checked : true // Default: true (némítva)
        };

        this.debugManager.saveConfig(config);
        this.debugManager.reloadConfig(); // Hot reload

        console.log('[DEBUG] Config saved and reloaded', config);

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
