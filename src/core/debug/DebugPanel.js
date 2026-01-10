/**
 * Debug Panel - UI komponens
 * 
 * Interaktív panel a slide skip és debug beállításokhoz.
 * Funkciók:
 * - Section-based skip (bal oldal)
 * - Individual slide skip (jobb oldal)
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

        // Content (2 oszlop)
        const content = document.createElement('div');
        content.className = 'dkv-debug-content';

        this.leftPanel = this._createLeftPanel();
        this.rightPanel = this._createRightPanel();

        content.appendChild(this.leftPanel);
        content.appendChild(this.rightPanel);
        panel.appendChild(content);

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
