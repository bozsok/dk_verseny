/**
 * Hub - Központi navigációs oldal (Új Cyber-Magic Design)
 * 
 * A játék központi hub-ja, ahol a diákok kiválaszthatják az évfolyamot.
 * Implementálja a splash_2 tervet: sugaras elrendezés, nebula háttér,
 * Glowing Portal hover effekt és scanline animációk.
 */

class Hub {
  constructor(options = {}) {
    this.element = null;
    this.options = {
      stateManager: options.stateManager || null,
      eventBus: options.eventBus || null,
      logger: options.logger || null,
      onGradeSelect: options.onGradeSelect || null,
      onContinueGame: options.onContinueGame || null
    };

    this.levelButtons = new Map(); // Gombok tárolása a frissítéshez
    this.eventListeners = new Map();
    this.clickCount = 0;
    this.lastClickTime = 0;

    // Master Mode lekérése a StateManager-en keresztül
    this.isMasterMode = this.options.stateManager
      ? this.options.stateManager.getSystemFlag('master_mode', false)
      : false;

    this.init();
  }

  /**
   * Hub inicializálása
   */
  init() {
    this.createElement();
    this.setupEventListeners();
    this.updateProgress();

    if (this.options.logger) {
      this.options.logger.info('Hub initialized with new Cyber-Magic design');
    }
  }

  /**
   * DOM elem létrehozása és rétegek felépítése
   */
  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'dkv-hub';
    this.element.id = 'dkv-hub';

    // 1. Háttér rétegek
    const bgLayers = document.createElement('div');
    bgLayers.className = 'dkv-hub-bg-layers';
    
    // Nebula kép
    const nebula = document.createElement('img');
    nebula.className = 'dkv-hub-nebula';
    nebula.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGW3y1amoOFhyby0WW9VJ53plEJjqIQ2vwtVf4UXKeyqxT7kKVDcNUx3FLlj1XtB7C4SBTc8odX1WaY3w6Tjvl0LvG7-2BlHGI7xFxOpjnDaTalidV6qamwIffUnlXMEFEmkE4ngiktvWFE1WTyzQifeiBF8AXM-6T1TJW6VvMVrycQjn_WU4Q65Yn0kp0XZn2EtDA39iJDFbn9In7f1IsOkp4PGwHQ_LiRfA6fZgQxvAjcHNAG7cOShEYImKcuEe8TbXFBBsTVxIJ';
    
    const gradient = document.createElement('div');
    gradient.className = 'dkv-hub-gradient';
    
    const dots = document.createElement('div');
    dots.className = 'dkv-hub-dots';
    
    const grid = document.createElement('div');
    grid.className = 'dkv-hub-grid';
    
    bgLayers.appendChild(nebula);
    bgLayers.appendChild(gradient);
    bgLayers.appendChild(dots);
    bgLayers.appendChild(grid);
    this.element.appendChild(bgLayers);

    // 2. Scanlines
    const scanlines = document.createElement('div');
    scanlines.className = 'dkv-hub-scanlines';
    const scanlineMove = document.createElement('div');
    scanlineMove.className = 'dkv-hub-scanline-move';
    this.element.appendChild(scanlines);
    this.element.appendChild(scanlineMove);

    // 3. Fő tartalom
    this.createMainContent();
  }

  /**
   * Fő tartalom (Cím, Sugaras UI, Footer) létrehozása
   */
  createMainContent() {
    const main = document.createElement('main');
    main.className = 'dkv-hub-main';

    // Cím szekció
    const titleSection = document.createElement('div');
    titleSection.className = 'dkv-hub-title-section';
    
    const title = document.createElement('h2');
    title.textContent = 'VÁLASSZ SZINTET';
    title.style.cursor = 'pointer';
    title.style.userSelect = 'none';
    
    title.addEventListener('click', () => {
      const now = Date.now();
      if (now - this.lastClickTime > 2000) this.clickCount = 0;
      this.clickCount++;
      this.lastClickTime = now;

      if (this.clickCount === 5) {
        this.clickCount = 0;
        // Navigáció a ranglistára (relatív útvonal)
        window.location.href = './ranglista/';
      }
    });

    const titleLine = document.createElement('div');
    titleLine.className = 'dkv-hub-title-line';
    
    titleSection.appendChild(title);
    titleSection.appendChild(titleLine);
    main.appendChild(titleSection);

    // Sugaras UI
    this.createRadialUI(main);

    // Footer szekció
    const footer = document.createElement('div');
    footer.className = 'dkv-hub-footer';
    
    const hint = document.createElement('p');
    hint.textContent = 'NYOMD MEG AZ EGYIK SZINTET AZ INDÍTÁSHOZ';
    
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'dkv-hub-status-dots';
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'dkv-hub-dot';
      dotsContainer.appendChild(dot);
    }
    
    footer.appendChild(hint);
    footer.appendChild(dotsContainer);
    main.appendChild(footer);

    this.element.appendChild(main);
  }

  /**
   * Sugaras kiválasztó felület létrehozása
   */
  createRadialUI(parent) {
    const radialContainer = document.createElement('div');
    radialContainer.className = 'dkv-hub-radial-container';

    // Gyűrűk
    const outerRing = document.createElement('div');
    outerRing.className = 'dkv-hub-ring dkv-hub-ring-outer';
    const innerRing = document.createElement('div');
    innerRing.className = 'dkv-hub-ring dkv-hub-ring-inner';
    
    radialContainer.appendChild(outerRing);
    radialContainer.appendChild(innerRing);

    // Központi mag
    const core = document.createElement('div');
    core.className = 'dkv-hub-core';
    const coreIcon = document.createElement('span');
    coreIcon.className = 'material-symbols-outlined';
    coreIcon.textContent = 'token';
    core.appendChild(coreIcon);
    radialContainer.appendChild(core);

    // Szint gombok (Grade 3-6)
    const grades = [
      { grade: 3, pos: 'top', icon: 'school' },
      { grade: 4, pos: 'right', icon: 'shield' },
      { grade: 5, pos: 'bottom', icon: 'swords' },
      { grade: 6, pos: 'left', icon: 'castle' }
    ];

    grades.forEach(cfg => {
      const item = document.createElement('div');
      item.className = 'dkv-hub-level-item';
      item.setAttribute('data-pos', cfg.pos);
      item.id = `grade-btn-${cfg.grade}`;

      const btn = document.createElement('button');
      btn.className = 'dkv-hub-level-btn';
      btn.innerHTML = `
        <span class="material-symbols-outlined">${cfg.icon}</span>
        <span class="level-label">${cfg.grade}. OSZTÁLY</span>
      `;
      
      btn.onclick = (e) => this.handleGradeClick(e, cfg.grade);
      
      item.appendChild(btn);
      radialContainer.appendChild(item);
      
      this.levelButtons.set(cfg.grade, item);
    });

    parent.appendChild(radialContainer);
  }

  /**
   * Évfolyam kártyák renderelése (Kompatibilitási fallback a Main.js-hez)
   */
  renderGradeCards() {
    this.updateProgress();
  }

  /**
   * Évfolyam választás animáció (Kompatibilitási fallback a Main.js-hez)
   */
  animateGradeSelection(grade) {
    const item = this.levelButtons.get(grade);
    if (item) {
      const btn = item.querySelector('.dkv-hub-level-btn');
      if (btn) {
        btn.animate([
          { transform: 'scale(1)', boxShadow: '0 0 20px rgba(255, 0, 127, 0.2)' },
          { transform: 'scale(1.2)', boxShadow: '0 0 40px rgba(255, 0, 127, 0.8)' },
          { transform: 'scale(1)', boxShadow: '0 0 20px rgba(255, 0, 127, 0.2)' }
        ], { duration: 600, easing: 'ease-in-out' });
      }
    }
  }

  /**
   * Évfolyam kattintás kezelése
   */
  handleGradeClick(event, grade) {
    const item = this.levelButtons.get(grade);
    if (item && item.classList.contains('locked')) {
      if (this.options.logger) this.options.logger.warn('Grade is locked');
      return;
    }

    if (this.options.logger) this.options.logger.info('Grade selected', { grade });

    // State frissítés
    if (this.options.stateManager) {
      this.options.stateManager.updateState({
        currentGrade: grade,
        gamePhase: 'grade-select'
      });
    }

    // Callback hívása
    if (this.options.onGradeSelect) {
      this.options.onGradeSelect(grade);
    }

    // Esemény küldése
    if (this.options.eventBus) {
      this.options.eventBus.emit('hub:grade-selected', { grade });
    }

    // Teljes képernyő kérése (felhasználói interakcióhoz kötve)
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  /**
   * Haladás és állapot frissítése
   */
  updateProgress() {
    if (!this.options.stateManager) return;

    const state = this.options.stateManager.getState();
    const grades = state.grades || {};

    // Gombok állapotának frissítése (unlocked)
    this.levelButtons.forEach((item, grade) => {
      const gradeData = grades[grade] || { unlocked: grade <= 4 }; // Alapértelmezetten 3-4 nyitva
      
      if (!gradeData.unlocked) {
        item.classList.add('locked');
      } else {
        item.classList.remove('locked');
      }
      
      // Best score megjelenítése ha van (opcionális extra a splash_2-höz képest)
      if (gradeData.bestScore > 0) {
        const label = item.querySelector('.level-label');
        if (label) label.title = `Legjobb pontszám: ${gradeData.bestScore}`;
      }
    });
  }

  /**
   * Eseménykezelők beállítása
   */
  setupEventListeners() {
    if (this.options.stateManager) {
      this.options.stateManager.addListener('state:updated', () => {
        this.updateProgress();
      });
    }

    // Keyboard navigáció (opcionális, de megtartjuk a kompatibilitást)
    this.element.addEventListener('keydown', (event) => {
      if (event.key.startsWith('Arrow')) {
        event.preventDefault();
        // Egyszerű fókusz váltás a gombok között
        const grades = [3, 4, 5, 6];
        const currentFocus = document.activeElement;
        const currentBtn = Array.from(this.levelButtons.values()).find(item => item.contains(currentFocus));
        let nextIdx = 0;
        
        if (currentBtn) {
            const currentGrade = parseInt(currentBtn.id.split('-').pop());
            const currentIdx = grades.indexOf(currentGrade);
            nextIdx = (currentIdx + 1) % grades.length;
        }
        
        const nextBtn = this.levelButtons.get(grades[nextIdx]).querySelector('button');
        if (nextBtn) nextBtn.focus();
      }
    });
  }

  show() {
    if (this.element) {
      this.element.style.display = 'flex';
      this.updateProgress();
    }
  }

  hide() {
    if (this.element) {
      this.element.style.display = 'none';
    }
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.levelButtons.clear();
    this.element = null;
  }

  getElement() {
    return this.element;
  }
}

export default Hub;