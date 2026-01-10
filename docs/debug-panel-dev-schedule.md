# 🐛 Debug Panel - Fejlesztési Ütemterv

> **Verzió:** 1.0  
> **Létrehozva:** 2026-01-10  
> **Utolsó frissítés:** 2026-01-10

## 📋 Áttekintés

Ez a dokumentum a Debug Panel funkció részletes fejlesztési ütemtervét tartalmazza. A fejlesztés moduláris, így bármikor abbahagyható és később folytatható.

---

## 🎯 Funkció Célja

**Debug Panel**: Fejlesztői eszköz, amely lehetővé teszi:
- Slide-ok csoportos vagy egyedi skip-elését
- Onboarding dummy adatok automatikus kitöltését
- Gyors tesztelést és iterációt

**Aktiválás:** `Ctrl + Shift + D`

---

## 📦 Fő Komponensek

1. **DebugManager** - Skip logika és state management
2. **DebugPanel** - UI komponens (modal)
3. **DebugConfig** - Section struktúra definíció
4. **DebugDummyData** - Teszt adatok
5. **CSS** - Debug panel stílusok
6. **Integration** - main.js, config.js módosítások

---

## 🗓️ Részletes Fejlesztési Lépések

---

### **PHASE 1: Alapok és Infrastruktúra**

#### ✅ **1.1 - Fájlstruktúra létrehozása**
**Időigény:** 5 perc  
**Státusz:** ⏳ Pending

**Feladat:**
```bash
src/core/debug/
├── DebugManager.js
├── DebugPanel.js
├── DebugConfig.js
└── DebugDummyData.js

src/ui/styles/
└── debug.css
```

**Ellenőrzés:**
- [ ] Minden fájl létezik
- [ ] Export/import működik

---

#### ✅ **1.2 - DebugDummyData.js létrehozása**
**Időigény:** 10 perc  
**Státusz:** ⏳ Pending

**Kód:**
```javascript
// src/core/debug/DebugDummyData.js

/**
 * Dummy data az Onboarding skip-hez
 */
export const DUMMY_PROFILE = {
  userProfile: {
    name: "Debug Teszt",
    nickname: "DebugUser",
    classId: "3.a"
  },
  avatar: "b1", // Első fiú karakter
  score: 4      // Registration (3) + Character (1)
};

/**
 * Onboarding kitöltésének szimulált ideje
 */
export const ONBOARDING_SIMULATION_TIME = 38000; // 38 sec (ms)

export default {
  DUMMY_PROFILE,
  ONBOARDING_SIMULATION_TIME
};
```

**Ellenőrzés:**
- [ ] Fájl létezik
- [ ] Konstansok exportálva

---

#### ✅ **1.3 - DebugConfig.js - Section struktúra**
**Időigény:** 30 perc  
**Státusz:** ⏳ Pending

**Kód:**
```javascript
// src/core/debug/DebugConfig.js

/**
 * Debug Section struktúra builder
 * @param {Array} slides - SlideManager.slides
 * @param {number} grade - Current grade (3-6)
 * @returns {Array} Section configuration
 */
export const buildSectionMap = (slides, grade = 3) => {
  const sections = [
    {
      id: 'onboarding',
      name: 'Onboarding',
      description: '3 slides (Welcome, Registration, Character)',
      slideIndices: [0, 1, 2], // Fix indices
      requiresDummyData: true
    },
    {
      id: 'intro',
      name: 'Intro',
      description: '4 slides (Story Introduction)',
      slideIndices: [3, 4, 5, 6], // Fix indices
      requiresDummyData: false
    }
  ];

  // Állomások (Dinamikus - Shuffle miatt metadata alapján)
  for (let i = 1; i <= 5; i++) {
    sections.push({
      id: `station_${i}`,
      name: `${i}. Állomás`,
      description: '4 slides (Context, Problem, Task, Reward)',
      slideIndices: slides
        .map((s, idx) => ({ s, idx }))
        .filter(({ s }) => s.metadata?.section === `station_${i}`)
        .map(({ idx }) => idx),
      requiresDummyData: false
    });
  }

  // Final (Fix indices - Grade dependent)
  const finalIndices = grade === 3 ? [25, 26, 27, 28] : []; // TODO: Grade 4-6
  sections.push({
    id: 'final',
    name: 'Final',
    description: '4 slides (Finale)',
    slideIndices: finalIndices,
    requiresDummyData: false
  });

  return sections;
};

export default {
  buildSectionMap
};
```

**Ellenőrzés:**
- [ ] `buildSectionMap()` működik
- [ ] Állomások dinamikusan találva (metadata alapján)
- [ ] Grade-specific logic (3-6)

**Függőség:**
- ⚠️ **BLOCKER:** `config.js` módosítás szükséges (metadata hozzáadása) → Lásd Phase 2.1

---

### **PHASE 2: Config Metadata + Skip Logika**

#### ✅ **2.1 - grade3/config.js módosítás (Metadata)**
**Időigény:** 45 perc  
**Státusz:** ⏳ Pending

**Feladat:**
1. `addSlide()` függvény módosítása metadata paraméterrel
2. Minden slide-hoz metadata hozzáadása

**Példa:**
```javascript
// grade3/config.js

const addSlide = (type, title, description, content = {}, metadata = {}) => {
  slides.push({
    id: idCounter++,
    type,
    title,
    description,
    content: { ...content, typingSpeed: TYPING_SPEED },
    metadata, // ← ÚJ
    isLocked: true,
    completed: false
  });
};

// Onboarding
addSlide(SLIDE_TYPES.WELCOME, '...', '...', { ... }, { section: 'onboarding', step: 0 });
addSlide(SLIDE_TYPES.REGISTRATION, '...', '...', { ... }, { section: 'onboarding', step: 1 });
addSlide(SLIDE_TYPES.CHARACTER, '...', '...', { ... }, { section: 'onboarding', step: 2 });

// Intro
for (let i = 1; i <= 4; i++) {
  addSlide(SLIDE_TYPES.STORY, `Bevezetés ${i}`, '...', { ... }, { section: 'intro', step: i - 1 });
}

// Állomások (Shuffle-olt loop-ban)
for (let slot = 0; slot < 5; slot++) {
  const originalStationIdx = stationIndices[slot];
  for (let step = 0; step < 4; step++) {
    addSlide(
      SLIDE_TYPES.STORY, 
      `${slot + 1}. Állomás: ...`, 
      '...', 
      { ... }, 
      { section: `station_${originalStationIdx + 1}`, step } // ← ORIGINAL station
    );
  }
}

// Final
for (let i = 25; i <= 28; i++) {
  addSlide(SLIDE_TYPES.STORY, '...', '...', { ... }, { section: 'final', step: i - 25 });
}
```

**Ellenőrzés:**
- [ ] Minden slide-nak van `metadata.section`
- [ ] Shuffle után is helyes metadata (station_1, station_2, stb.)
- [ ] Console log: `slides.map(s => s.metadata)`

**Függőség:**
- 🔗 Kell ehhez: Phase 1.3 (DebugConfig)

---

#### ✅ **2.2 - DebugManager.js - Skip Logika**
**Időigény:** 60 perc  
**Státusz:** ⏳ Pending

**Kód:**
```javascript
// src/core/debug/DebugManager.js

import { buildSectionMap } from './DebugConfig.js';
import { DUMMY_PROFILE, ONBOARDING_SIMULATION_TIME } from './DebugDummyData.js';

class DebugManager {
  constructor(options = {}) {
    this.slideManager = options.slideManager;
    this.stateManager = options.stateManager;
    this.timeManager = options.timeManager;
    this.logger = options.logger;

    this.sections = [];
    this.skipConfig = this.loadSkipConfig();
    this.isEnabled = this.skipConfig.enabled || false;
  }

  /**
   * Inicializálás évfolyamhoz
   */
  initForGrade(grade, slides) {
    this.currentGrade = grade;
    this.slides = slides;
    this.sections = buildSectionMap(slides, grade);
    
    if (this.logger) {
      this.logger.info('[DEBUG] Initialized for grade', { grade, sections: this.sections.length });
    }
  }

  /**
   * Skip config betöltése localStorage-ból
   */
  loadSkipConfig() {
    try {
      const stored = localStorage.getItem('dkv-debug-config');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('[DEBUG] Failed to load config', e);
    }
    
    // Default config
    return {
      enabled: false,
      skipSections: [],
      skipSlides: [],
      useDummyData: false
    };
  }

  /**
   * Skip config mentése
   */
  saveConfig(config) {
    this.skipConfig = config;
    try {
      localStorage.setItem('dkv-debug-config', JSON.stringify(config));
      if (this.logger) {
        this.logger.info('[DEBUG] Config saved', config);
      }
    } catch (e) {
      console.error('[DEBUG] Failed to save config', e);
    }
  }

  /**
   * Config reload (Hot reload)
   */
  reloadConfig() {
    this.skipConfig = this.loadSkipConfig();
    if (this.logger) {
      this.logger.info('[DEBUG] Config reloaded', this.skipConfig);
    }
  }

  /**
   * Ellenőrzi, hogy skip-elni kell-e egy slide-ot
   * @param {number} slideIndex - Slide index (0-based)
   * @returns {boolean}
   */
  shouldSkipSlide(slideIndex) {
    if (!this.isEnabled || !this.skipConfig.enabled) return false;

    const slide = this.slides[slideIndex];
    if (!slide) return false;

    // 1. Individual slide skip (prioritás)
    if (this.skipConfig.skipSlides.includes(slideIndex)) {
      return true;
    }

    // 2. Section skip
    const section = this.findSectionBySlideIndex(slideIndex);
    if (section && this.skipConfig.skipSections.includes(section.id)) {
      return true;
    }

    return false;
  }

  /**
   * Section keresése slide index alapján
   */
  findSectionBySlideIndex(slideIndex) {
    return this.sections.find(s => s.slideIndices.includes(slideIndex));
  }

  /**
   * Section skip ellenőrzése
   */
  isSectionSkipped(sectionId) {
    return this.skipConfig.skipSections.includes(sectionId);
  }

  /**
   * Dummy adatok alkalmazása (Onboarding skip esetén)
   */
  applyDummyData() {
    if (!this.skipConfig.useDummyData) return;

    this.stateManager.updateState({
      userProfile: DUMMY_PROFILE.userProfile,
      avatar: DUMMY_PROFILE.avatar,
      score: DUMMY_PROFILE.score,
      isDebugSession: true
    });

    // Timer indítás + 38mp offset
    if (this.timeManager && !this.timeManager.isRunning) {
      this.timeManager.startCompetition();
      this.timeManager.startTime -= ONBOARDING_SIMULATION_TIME;
      
      if (this.logger) {
        this.logger.info('[DEBUG] Timer started with 38s offset');
      }
    }

    if (this.logger) {
      this.logger.info('[DEBUG] Dummy data applied', DUMMY_PROFILE);
    }
  }

  /**
   * Debug mód kikapcsolása (biztonsági fallback)
   */
  disable() {
    this.isEnabled = false;
    this.skipConfig.enabled = false;
    this.saveConfig(this.skipConfig);
    
    console.warn('[DEBUG] Debug mode DISABLED (safety)');
  }

  /**
   * Statisztikák
   */
  getStats() {
    const skippedSectionSlides = this.skipConfig.skipSections
      .flatMap(secId => {
        const sec = this.sections.find(s => s.id === secId);
        return sec ? sec.slideIndices : [];
      });

    return {
      enabled: this.isEnabled,
      skippedSections: this.skipConfig.skipSections.length,
      skippedSectionSlides: skippedSectionSlides.length,
      skippedIndividualSlides: this.skipConfig.skipSlides.length,
      totalSkipped: new Set([...skippedSectionSlides, ...this.skipConfig.skipSlides]).size
    };
  }
}

export default DebugManager;
```

**Ellenőrzés:**
- [ ] `shouldSkipSlide()` működik
- [ ] `applyDummyData()` beállítja a state-et
- [ ] Timer offset működik
- [ ] LocalStorage mentés/betöltés működik

**Függőség:**
- 🔗 Phase 1.2, 1.3, 2.1

---

### **PHASE 3: UI Komponens (DebugPanel)**

#### ✅ **3.1 - DebugPanel.js - Alapstruktúra**
**Időigény:** 90 perc  
**Státusz:** ⏳ Pending

**Kód vázlat:**
```javascript
// src/core/debug/DebugPanel.js

class DebugPanel {
  constructor(options = {}) {
    this.debugManager = options.debugManager;
    this.onClose = options.onClose;
    
    this.element = null;
    this.leftPanel = null;
    this.rightPanel = null;
    this.selectedSection = null;
  }

  /**
   * Panel létrehozása
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

  _createHeader() {
    const header = document.createElement('div');
    header.className = 'dkv-debug-header';
    header.innerHTML = `
      <h2>🐛 DEBUG PANEL</h2>
      <div class="dkv-debug-stats" id="dkv-debug-stats">Loading...</div>
    `;
    return header;
  }

  _createLeftPanel() {
    const panel = document.createElement('div');
    panel.className = 'dkv-debug-left-panel';
    panel.innerHTML = '<h3>Section Skip</h3>';
    
    // Section checkboxes
    this.debugManager.sections.forEach(section => {
      const label = document.createElement('label');
      label.className = 'dkv-debug-section-item';
      
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
      
      // Click to view details
      label.addEventListener('click', (e) => {
        if (e.target !== checkbox) {
          this._selectSection(section);
        }
      });
      
      panel.appendChild(label);
    });
    
    // Dummy data checkbox
    const dummyLabel = document.createElement('label');
    dummyLabel.className = 'dkv-debug-dummy-data';
    dummyLabel.innerHTML = `
      <input type="checkbox" id="dkv-debug-dummy" ${this.debugManager.skipConfig.useDummyData ? 'checked' : ''}>
      <span>Auto Dummy Data</span>
    `;
    panel.appendChild(dummyLabel);
    
    return panel;
  }

  _createRightPanel() {
    const panel = document.createElement('div');
    panel.className = 'dkv-debug-right-panel';
    panel.innerHTML = `
      <h3>Detailed Slide Skip</h3>
      <p class="dkv-debug-placeholder">Select a section on the left to see individual slides.</p>
    `;
    return panel;
  }

  _createFooter() {
    const footer = document.createElement('div');
    footer.className = 'dkv-debug-footer';
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save & Close';
    saveBtn.className = 'dkv-debug-btn dkv-debug-btn-primary';
    saveBtn.addEventListener('click', () => this._onSave());
    
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear All';
    clearBtn.className = 'dkv-debug-btn dkv-debug-btn-secondary';
    clearBtn.addEventListener('click', () => this._onClearAll());
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'dkv-debug-btn';
    cancelBtn.addEventListener('click', () => this.close());
    
    footer.appendChild(saveBtn);
    footer.appendChild(clearBtn);
    footer.appendChild(cancelBtn);
    
    return footer;
  }

  _selectSection(section) {
    this.selectedSection = section;
    this._renderDetailedSlides(section);
    
    // Visual highlight
    const items = this.leftPanel.querySelectorAll('.dkv-debug-section-item');
    items.forEach(item => item.classList.remove('selected'));
    
    const selectedItem = Array.from(items).find(item => 
      item.querySelector('input').value === section.id
    );
    if (selectedItem) selectedItem.classList.add('selected');
  }

  _renderDetailedSlides(section) {
    const isSectionSkipped = this.debugManager.isSectionSkipped(section.id);
    
    this.rightPanel.innerHTML = `
      <h3>${section.name} - Slides</h3>
      ${isSectionSkipped ? '<p class="dkv-debug-warning">⚠️ Entire section is skipped. Uncheck section to enable individual control.</p>' : ''}
    `;
    
    section.slideIndices.forEach(idx => {
      const slide = this.debugManager.slides[idx];
      if (!slide) return;
      
      const label = document.createElement('label');
      label.className = 'dkv-debug-slide-item';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = idx;
      checkbox.checked = this.debugManager.skipConfig.skipSlides.includes(idx);
      checkbox.disabled = isSectionSkipped;
      
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

  _onSectionCheckboxChange(section, checked) {
    const config = this.debugManager.skipConfig;
    
    if (checked) {
      if (!config.skipSections.includes(section.id)) {
        config.skipSections.push(section.id);
      }
    } else {
      const idx = config.skipSections.indexOf(section.id);
      if (idx > -1) config.skipSections.splice(idx, 1);
    }
    
    // Refresh right panel if this section is selected
    if (this.selectedSection?.id === section.id) {
      this._renderDetailedSlides(section);
    }
    
    this._updateStats();
  }

  _onSlideCheckboxChange(slideIndex, checked) {
    const config = this.debugManager.skipConfig;
    
    if (checked) {
      if (!config.skipSlides.includes(slideIndex)) {
        config.skipSlides.push(slideIndex);
      }
    } else {
      const idx = config.skipSlides.indexOf(slideIndex);
      if (idx > -1) config.skipSlides.splice(idx, 1);
    }
    
    this._updateStats();
  }

  _updateStats() {
    const stats = this.debugManager.getStats();
    const statsEl = document.getElementById('dkv-debug-stats');
    if (statsEl) {
      statsEl.textContent = `Skipped: ${stats.skippedSections} sections (${stats.skippedSectionSlides} slides), ${stats.skippedIndividualSlides} individual slides | Total: ${stats.totalSkipped}`;
    }
  }

  _onSave() {
    const dummyCheckbox = document.getElementById('dkv-debug-dummy');
    
    const config = {
      enabled: true,
      skipSections: this.debugManager.skipConfig.skipSections,
      skipSlides: this.debugManager.skipConfig.skipSlides,
      useDummyData: dummyCheckbox ? dummyCheckbox.checked : false
    };
    
    this.debugManager.saveConfig(config);
    this.debugManager.reloadConfig(); // Hot reload
    
    this.close();
  }

  _onClearAll() {
    if (!confirm('Clear all skip settings?')) return;
    
    const config = {
      enabled: false,
      skipSections: [],
      skipSlides: [],
      useDummyData: false
    };
    
    this.debugManager.saveConfig(config);
    this.debugManager.reloadConfig();
    
    this.close();
  }

  show() {
    if (!this.element) this.createElement();
    document.body.appendChild(this.element);
    this._updateStats();
    
    // ESC listener
    this._escListener = (e) => {
      if (e.key === 'Escape') this.close();
    };
    document.addEventListener('keydown', this._escListener);
  }

  close() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
    if (this._escListener) {
      document.removeEventListener('keydown', this._escListener);
    }
    if (this.onClose) this.onClose();
  }

  destroy() {
    this.close();
  }
}

export default DebugPanel;
```

**Ellenőrzés:**
- [ ] Panel megjelenik `Ctrl+Shift+D`-re
- [ ] Checkbox-ok működnek
- [ ] Section kattintás → Jobb panel frissül
- [ ] Save & Close menti a config-ot
- [ ] Clear All törli a beállításokat
- [ ] ESC bezárja a panelt

**Függőség:**
- 🔗 Phase 2.2 (DebugManager)
- 🔗 Phase 3.2 (CSS)

---

#### ✅ **3.2 - debug.css - Panel Stílusok**
**Időigény:** 45 perc  
**Státusz:** ⏳ Pending

**Kód vázlat:**
```css
/* src/ui/styles/debug.css */

/* Overlay */
.dkv-debug-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: dkv-debug-fade-in 0.2s ease;
}

@keyframes dkv-debug-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Panel Container */
.dkv-debug-panel {
  background: #1e1e1e;
  border: 2px solid #ff0000;
  border-radius: 10px;
  width: 90%;
  max-width: 1200px;
  height: 80%;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  box-shadow: 0 10px 50px rgba(255, 0, 0, 0.5);
}

/* Header */
.dkv-debug-header {
  padding: 20px;
  border-bottom: 2px solid #ff0000;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dkv-debug-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #ff0000;
}

.dkv-debug-stats {
  font-size: 0.9rem;
  color: #aaa;
}

/* Content (2 Columns) */
.dkv-debug-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
}

/* Left Panel */
.dkv-debug-left-panel {
  border-right: 1px solid #444;
  padding-right: 20px;
  overflow-y: auto;
}

.dkv-debug-left-panel h3 {
  margin-top: 0;
  color: #00d2d3;
  font-size: 1.2rem;
}

.dkv-debug-section-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.2s;
}

.dkv-debug-section-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dkv-debug-section-item.selected {
  background: rgba(0, 210, 211, 0.2);
  border-left: 3px solid #00d2d3;
}

.dkv-debug-section-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.dkv-debug-dummy-data {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #444;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffeb3b;
}

/* Right Panel */
.dkv-debug-right-panel {
  overflow-y: auto;
  padding-left: 20px;
}

.dkv-debug-right-panel h3 {
  margin-top: 0;
  color: #00d2d3;
  font-size: 1.2rem;
}

.dkv-debug-placeholder {
  color: #888;
  font-style: italic;
}

.dkv-debug-warning {
  background: rgba(255, 235, 59, 0.1);
  border-left: 3px solid #ffeb3b;
  padding: 10px;
  margin-bottom: 15px;
  color: #ffeb3b;
}

.dkv-debug-slide-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  margin-bottom: 3px;
  border-radius: 3px;
  cursor: pointer;
}

.dkv-debug-slide-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.dkv-debug-slide-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.dkv-debug-slide-item input[type="checkbox"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Footer */
.dkv-debug-footer {
  padding: 20px;
  border-top: 2px solid #ff0000;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.dkv-debug-btn {
  padding: 10px 20px;
  border: 1px solid #666;
  border-radius: 5px;
  background: #333;
  color: #fff;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.dkv-debug-btn:hover {
  background: #444;
  border-color: #888;
}

.dkv-debug-btn-primary {
  background: #00d2d3;
  border-color: #00d2d3;
  color: #000;
  font-weight: bold;
}

.dkv-debug-btn-primary:hover {
  background: #00a8a9;
}

.dkv-debug-btn-secondary {
  background: #ff9800;
  border-color: #ff9800;
  color: #000;
  font-weight: bold;
}

.dkv-debug-btn-secondary:hover {
  background: #e68900;
}

/* Scrollbar Styling */
.dkv-debug-left-panel::-webkit-scrollbar,
.dkv-debug-right-panel::-webkit-scrollbar {
  width: 8px;
}

.dkv-debug-left-panel::-webkit-scrollbar-track,
.dkv-debug-right-panel::-webkit-scrollbar-track {
  background: #2a2a2a;
}

.dkv-debug-left-panel::-webkit-scrollbar-thumb,
.dkv-debug-right-panel::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

.dkv-debug-left-panel::-webkit-scrollbar-thumb:hover,
.dkv-debug-right-panel::-webkit-scrollbar-thumb:hover {
  background: #777;
}
```

**Ellenőrzés:**
- [ ] Panel kinézet megfelelő
- [ ] Hover effektek működnek
- [ ] Selected section kiemelt
- [ ] Gombok stílusosak

---

### **PHASE 4: Integration (main.js)**

#### ✅ **4.1 - main.js - DebugManager inicializálás**
**Időigény:** 30 perc  
**Státusz:** ⏳ Pending

**Módosítások:**

```javascript
// main.js - Import
import DebugManager from './core/debug/DebugManager.js';
import DebugPanel from './core/debug/DebugPanel.js';
import './ui/styles/debug.css';

// Constructor
constructor() {
  // ... existing ...
  this.debugManager = null;
  this.debugPanel = null;
  this.debugBadge = null;
}

// initCoreComponents() után
async initCoreComponents() {
  // ... existing code ...
  
  // Debug Manager (csak DEV módban)
  if (__DEV__) {
    this.debugManager = new DebugManager({
      slideManager: this.slideManager,
      stateManager: this.stateManager,
      timeManager: this.timeManager,
      logger: this.logger
    });
  }
}

// setupEventListeners()
setupEventListeners() {
  // ... existing ...
  
  // Debug Panel aktiválás (csak DEV)
  if (__DEV__ && this.debugManager) {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.openDebugPanel();
      }
    });
  }
}

openDebugPanel() {
  if (!this.debugManager) return;
  
  if (!this.debugPanel) {
    this.debugPanel = new DebugPanel({
      debugManager: this.debugManager,
      onClose: () => {
        this.debugPanel = null;
        this.updateDebugBadge();
      }
    });
  }
  
  this.debugPanel.show();
}

// handleGradeSelect() - DebugManager init
async handleGradeSelect(grade) {
  // ... existing ...
  
  if (this.slideManager) {
    const firstSlide = await this.slideManager.initForGrade(grade);
    
    // Debug Manager init
    if (this.debugManager) {
      this.debugManager.initForGrade(grade, this.slideManager.slides);
      this.createDebugBadge(); // Visual indicator
    }
    
    // ... rest of code ...
  }
}
```

**Ellenőrzés:**
- [ ] `Ctrl+Shift+D` megnyitja a panelt
- [ ] DebugManager inicializálva grade választáskor
- [ ] Panel működik

---

#### ✅ **4.2 - main.js - Skip Logic Integration**
**Időigény:** 45 perc  
**Státusz:** ⏳ Pending

**renderSlide() módosítás:**

```javascript
renderSlide(slide, skipDepth = 0) {
  if (!slide) return;
  
  const MAX_SKIP_DEPTH = 50;
  
  // === DEBUG SKIP CHECK ===
  if (this.debugManager && this.debugManager.shouldSkipSlide(this.slideManager.currentIndex)) {
    console.log(`[DEBUG] Skipping slide ${slide.id} (depth=${skipDepth})`);
    
    // Depth limit check
    if (skipDepth > MAX_SKIP_DEPTH) {
      console.error('[DEBUG] Max skip depth reached! Disabling debug mode.');
      this.debugManager.disable();
      // Continue with normal render
    } else {
      // Onboarding skip → Dummy data
      if (slide.metadata?.section === 'onboarding' && !this.stateManager.getStateValue('userProfile')) {
        this.debugManager.applyDummyData();
      }
      
      // Skip to next
      const nextSlide = this.slideManager.nextSlide();
      if (nextSlide) {
        this.renderSlide(nextSlide, skipDepth + 1); // Recursive
        return;
      }
    }
  }
  
  // === AUDIO CLEANUP (SILENT SKIP) ===
  if (this.currentAudio) {
    this.currentAudio.pause();
    this.currentAudio.currentTime = 0;
    this.currentAudio = null;
  }
  
  // ... REST OF EXISTING CODE ...
}
```

**Ellenőrzés:**
- [ ] Skip működik (átugrik a kiválasztott slide-okat)
- [ ] Dummy data betöltődik Onboarding skip-nél
- [ ] Timer 38mp-ről indul
- [ ] Nincs audio leak
- [ ] Max depth működik

---

#### ✅ **4.3 - Debug Badge (Visual Indicator)**
**Időigény:** 20 perc  
**Státusz:** ⏳ Pending

**main.js:**

```javascript
createDebugBadge() {
  if (this.debugBadge) return;
  
  this.debugBadge = document.createElement('div');
  this.debugBadge.className = 'dkv-debug-badge';
  this.debugBadge.innerHTML = '🐛 DEBUG MODE';
  document.body.appendChild(this.debugBadge);
  
  this.updateDebugBadge();
}

updateDebugBadge() {
  if (!this.debugBadge || !this.debugManager) return;
  
  const isActive = this.debugManager.skipConfig.enabled;
  this.debugBadge.classList.toggle('active', isActive);
}
```

**CSS (debug.css):**

```css
.dkv-debug-badge {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 9999;
  background: rgba(255, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: bold;
  pointer-events: none;
  display: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.dkv-debug-badge.active {
  display: block;
  animation: dkv-debug-pulse 2s infinite;
}

@keyframes dkv-debug-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

**Ellenőrzés:**
- [ ] Badge megjelenik, ha debug aktív
- [ ] Eltűnik, ha clear all
- [ ] Nem kattintható

---

### **PHASE 5: Production Deploy védelem**

#### ✅ **5.1 - Conditional Import (Tree-shaking)**
**Időigény:** 15 perc  
**Státusz:** ⏳ Pending

**vite.config.js:**
```javascript
define: {
  __DEV__: process.env.NODE_ENV !== 'production',
  __DEBUG_ENABLED__: process.env.NODE_ENV !== 'production',
  // ... existing ...
}
```

**main.js:**
```javascript
// Conditional import
let DebugManager = null;
let DebugPanel = null;

if (__DEBUG_ENABLED__) {
  DebugManager = (await import('./core/debug/DebugManager.js')).default;
  DebugPanel = (await import('./core/debug/DebugPanel.js')).default;
  await import('./ui/styles/debug.css');
}

// Constructor
if (__DEBUG_ENABLED__ && DebugManager) {
  this.debugManager = new DebugManager({ ... });
}
```

**Ellenőrzés:**
- [ ] `npm run build` → Debug kód NINCS a bundle-ben
- [ ] Production: `Ctrl+Shift+D` nem csinál semmit
- [ ] Dev: Minden működik

---

### **PHASE 6: Tesztelés**

#### ✅ **6.1 - Unit tesztek**
**Időigény:** 60 perc  
**Státusz:** ⏳ Pending

**Tesztek:**
- [ ] DebugManager.shouldSkipSlide()
- [ ] DebugManager.applyDummyData()
- [ ] Section mapping shuffle után
- [ ] LocalStorage save/load

#### ✅ **6.2 - Integration tesztek**
**Időigény:** 45 perc  
**Státusz:** ⏳ Pending

**Tesztek:**
- [ ] Teljes Onboarding skip
- [ ] Részleges skip (1 állomás)
- [ ] Individual slide skip
- [ ] Hot reload működik
- [ ] Audio nem "leakul"

#### ✅ **6.3 - Edge case tesztek**
**Időigény:** 30 perc  
**Státusz:** ⏳ Pending

**Tesztek:**
- [ ] Minden slide skip-elve (infinite loop védelem)
- [ ] Conflict: Section + Individual skip
- [ ] Grade váltás közben
- [ ] LocalStorage corruption

---

## 📊 Összesítés

| Phase | Feladat | Időigény | Függőség |
|-------|---------|----------|----------|
| 1.1 | Fájlstruktúra | 5' | - |
| 1.2 | DummyData | 10' | - |
| 1.3 | DebugConfig | 30' | 2.1 |
| 2.1 | Config metadata | 45' | - |
| 2.2 | DebugManager | 60' | 1.2, 1.3, 2.1 |
| 3.1 | DebugPanel UI | 90' | 2.2, 3.2 |
| 3.2 | CSS | 45' | - |
| 4.1 | main.js init | 30' | 2.2, 3.1 |
| 4.2 | Skip logic | 45' | 4.1 |
| 4.3 | Debug badge | 20' | 4.1 |
| 5.1 | Production védelem | 15' | 4.2 |
| 6.1 | Unit tesztek | 60' | 5.1 |
| 6.2 | Integration tesztek | 45' | 6.1 |
| 6.3 | Edge case tesztek | 30' | 6.2 |
| **TOTAL** | | **~8.5 óra** | |

---

## ✅ Checklist (Progress Tracking)

### Phase 1: Infrastruktúra
- [ ] 1.1 - Fájlstruktúra
- [ ] 1.2 - DebugDummyData
- [ ] 1.3 - DebugConfig

### Phase 2: Config + Logika
- [ ] 2.1 - Metadata config.js
- [ ] 2.2 - DebugManager

### Phase 3: UI
- [ ] 3.1 - DebugPanel
- [ ] 3.2 - CSS

### Phase 4: Integration
- [ ] 4.1 - main.js init
- [ ] 4.2 - Skip logic
- [ ] 4.3 - Debug badge

### Phase 5: Deploy
- [ ] 5.1 - Production védelem

### Phase 6: Tesztek
- [ ] 6.1 - Unit
- [ ] 6.2 - Integration
- [ ] 6.3 - Edge cases

---

## 🚨 Blocker Issues (Ha elakad a fejlesztés)

Ha bármelyik fázisban elakadsz:

1. **Ellenőrizd a Függőségeket**: Lásd fenti táblázat "Függőség" oszlop
2. **Console log**: Adj hozzá debug log-ot (`console.log('[DEBUG] ...')`)
3. **Isolate**: Teszteld a komponenst külön (pl. csak DebugPanel standalone)
4. **Rollback**: Ha elromlik, git commit előtt álló állapothoz térj vissza

---

## 📌 Fontos Megjegyzések

- **Időbecslés**: Tapasztalt fejlesztőnek ~8.5 óra, kezdőnek 12-15 óra
- **Prioritás**: Phases 1-4 kritikus, Phase 5-6 opcionális (de ajánlott)
- **Bővíthetőség**: Plugin system Phase 7-ként később hozzáadható
- **Dokumentáció**: Minden metódushoz JSDoc comments szükséges

---

**Készítette:** Antigravity AI  
**Utolsó módosítás:** 2026-01-10 20:57
