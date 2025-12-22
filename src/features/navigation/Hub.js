/**
 * Hub - Központi navigációs oldal
 * 
 * A játék központi hub-ja, ahol a diákok kiválaszthatják az évfolyamot
 * vagy folytathatják a már megkezdett játékot.
 */
import Card from '../../ui/components/Card.js';

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

    this.gradeCards = new Map();
    this.eventListeners = new Map();
    this.init();
  }

  /**
   * Hub inicializálása
   */
  init() {
    this.createElement();
    this.setupEventListeners();
    this.renderGradeCards();
    this.updateProgress();

    if (this.options.logger) {
      this.options.logger.info('Hub initialized');
    }
  }

  /**
   * DOM elem létrehozása
   */
  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'dkv-hub';
    this.element.id = 'dkv-hub';

    this.createHeader();
    this.createMainContent();
    // this.createFooter(); // Footer removed
  }

  /**
   * Fejléc létrehozása
   */
  createHeader() {
    const header = document.createElement('header');
    header.className = 'dkv-hub-header';

    const container = document.createElement('div');
    container.className = 'dkv-container';

    const title = document.createElement('h1');
    title.className = 'dkv-hub-title';
    title.textContent = 'Digitális Kultúra Verseny';

    const selectionTitle = document.createElement('h2');
    selectionTitle.className = 'dkv-hub-selection-title';
    selectionTitle.textContent = 'Válaszd ki az osztályodat!';

    const subtitle = document.createElement('p');
    subtitle.className = 'dkv-hub-subtitle';
    subtitle.textContent = 'Egy fantasy kaland vár, tele rejtvényekkel és kódolási feladatokkal!';

    container.appendChild(title);
    container.appendChild(selectionTitle);
    container.appendChild(subtitle);
    header.appendChild(container);

    this.element.appendChild(header);
  }

  /**
   * Fő tartalom létrehozása
   */
  createMainContent() {
    const main = document.createElement('main');
    main.className = 'dkv-hub-main';

    const container = document.createElement('div');
    container.className = 'dkv-container';

    // Progress summary
    // Progress summary removed
    // this.createProgressSummary(container);

    // Grade selection section
    this.createGradeSection(container);

    main.appendChild(container);
    this.element.appendChild(main);
  }



  /**
   * Évfolyam szekció létrehozása
   */
  createGradeSection(parent) {
    const gradeSection = document.createElement('section');
    gradeSection.className = 'dkv-hub-grades';

    // Removed section title as requested

    const gradeGrid = document.createElement('div');
    gradeGrid.className = 'dkv-grades-grid';
    gradeGrid.id = 'dkv-grades-grid';

    gradeSection.appendChild(gradeGrid);

    parent.appendChild(gradeSection);
  }



  /**
   * Évfolyam kártyák renderelése
   */
  renderGradeCards() {
    const gradeGrid = this.element.querySelector('#dkv-grades-grid');
    if (!gradeGrid) return;

    // Clear existing cards
    gradeGrid.innerHTML = '';
    this.gradeCards.clear();

    // Grade configurations
    // Grade configurations based on the new design
    const grades = [
      {
        grade: 3,
        title: '3. osztály',
        description: 'A Kód Királyság titka',
        icon: '<svg viewBox="0 0 24 24"><path d="M21 10h-8.35A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4zM7 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>', // Key icon
        unlocked: true
      },
      {
        grade: 4,
        title: '4. osztály',
        description: 'A rejtett frissítés kódja',
        icon: '<svg viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>', // Code brackets
        unlocked: true
      },
      {
        grade: 5,
        title: '5. osztály',
        description: 'A töréspont rejtélye',
        icon: '<svg viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>', // Lightning
        unlocked: true
      },
      {
        grade: 6,
        title: '6. osztály',
        description: 'A fragmentumok tükre',
        icon: '<svg viewBox="0 0 24 24"><path d="M12 2L2 19h20L12 2zm0 3l7.53 12H4.47L12 5z"/></svg>', // Shard/Crystal-like
        unlocked: true
      }
    ];

    grades.forEach(gradeConfig => {
      // Create card container
      const card = document.createElement('div');
      card.className = `dkv-card ${gradeConfig.unlocked ? '' : 'dkv-card-locked'}`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', gradeConfig.unlocked ? '0' : '-1');

      // Icon
      const iconDiv = document.createElement('div');
      iconDiv.className = 'dkv-card-icon';
      iconDiv.innerHTML = gradeConfig.icon;

      // Content container
      const contentDiv = document.createElement('div');
      contentDiv.className = 'dkv-card-content';

      // Title
      const title = document.createElement('div');
      title.className = 'dkv-card-title';
      title.textContent = gradeConfig.title;

      // Description (Subtitle)
      const desc = document.createElement('div');
      desc.className = 'dkv-card-description';
      desc.textContent = gradeConfig.description;

      contentDiv.appendChild(title);
      contentDiv.appendChild(desc);

      card.appendChild(iconDiv);
      card.appendChild(contentDiv);

      // Click handler
      if (gradeConfig.unlocked) {
        card.addEventListener('click', (e) => this.handleGradeClick(e, gradeConfig.grade));

        // Allow storing reference for animations if needed via a wrapper class or map
        // but for now direct DOM is fine
      }

      gradeGrid.appendChild(card);
    });
  }

  /**
   * Évfolyam kattintás kezelése
   */
  handleGradeClick(event, grade) {
    if (this.options.logger) {
      this.options.logger.info('Grade selected', { grade });
    }

    // State update
    if (this.options.stateManager) {
      this.options.stateManager.updateState({
        currentGrade: grade,
        gamePhase: 'grade-select'
      });
    }

    // Custom callback
    if (this.options.onGradeSelect) {
      this.options.onGradeSelect(grade);
    }

    // Event emit
    if (this.options.eventBus) {
      this.options.eventBus.emit('hub:grade-selected', { grade });
    }

    // Visual feedback
    this.animateGradeSelection(grade);
  }

  /**
   * Évfolyam választás animáció
   */
  animateGradeSelection(grade) {
    const card = this.gradeCards.get(grade);
    if (card) {
      card.animate('pulse');
    }
  }

  /**
   * Progress frissítése
   */
  updateProgress() {
    if (!this.options.stateManager) return;

    const state = this.options.stateManager.getState();
    const progress = state.progress || {};
    const grades = state.grades || {};

    // Summary cards frissítése
    if (this.summaryCards) {
      this.summaryCards.score.textContent = (progress.totalScore || 0).toString();
      this.summaryCards.levels.textContent = (progress.completedLevels || []).length.toString();
      this.summaryCards.time.textContent = this.formatTime(progress.timeSpent || 0);
      this.summaryCards.achievements.textContent = (progress.achievements || []).length.toString();
    }

    // Grade cards progress frissítése
    this.gradeCards.forEach((card, grade) => {
      const gradeData = grades[grade] || { progress: 0, bestScore: 0, unlocked: false };

      card.setProgress(gradeData.progress);
      card.setBestScore(gradeData.bestScore);
      card.setUnlocked(gradeData.unlocked);
    });
  }

  /**
   * Idő formázása
   */
  formatTime(seconds) {
    if (seconds < 60) {
      return `${Math.floor(seconds)} mp`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} perc`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}ó ${minutes}perc`;
    }
  }

  /**
   * Eseménykezelők beállítása
   */
  setupEventListeners() {
    // State updates
    if (this.options.stateManager) {
      this.options.stateManager.addListener('state:updated', () => {
        this.updateProgress();
      });
    }

    // Keyboard navigation
    this.addEventListener('keydown', (event) => {
      this.handleKeyboardNavigation(event);
    });
  }

  /**
   * Billentyűzet navigáció
   */
  handleKeyboardNavigation(event) {
    const cards = Array.from(this.gradeCards.values());
    const currentFocus = document.activeElement;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusNextCard(cards, currentFocus);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusPreviousCard(cards, currentFocus);
    }
  }

  /**
   * Következő kártya fókuszálása
   */
  focusNextCard(cards, currentFocus) {
    const currentIndex = cards.findIndex(card => card.getElement() === currentFocus);
    const nextIndex = (currentIndex + 1) % cards.length;
    cards[nextIndex].getElement().focus();
  }

  /**
   * Előző kártya fókuszálása
   */
  focusPreviousCard(cards, currentFocus) {
    const currentIndex = cards.findIndex(card => card.getElement() === currentFocus);
    const prevIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
    cards[prevIndex].getElement().focus();
  }

  /**
   * Eseménykezelő hozzáadása
   */
  addEventListener(event, handler) {
    this.element.addEventListener(event, handler);
    this.eventListeners.set(handler, event);
  }

  /**
   * Eseménykezelő eltávolítása
   */
  removeEventListener(handler) {
    const event = this.eventListeners.get(handler);
    if (event) {
      this.element.removeEventListener(event, handler);
      this.eventListeners.delete(handler);
    }
  }

  /**
   * Hub megjelenítése
   */
  show() {
    if (this.element) {
      this.element.style.display = 'block';
      this.updateProgress();
    }
  }

  /**
   * Hub elrejtése
   */
  hide() {
    if (this.element) {
      this.element.style.display = 'none';
    }
  }

  /**
   * Hub eltávolítása
   */
  destroy() {
    // Event listeners cleanup
    this.eventListeners.forEach((event, handler) => {
      this.element.removeEventListener(event, handler);
    });
    this.eventListeners.clear();

    // Cards cleanup
    this.gradeCards.forEach(card => card.destroy());
    this.gradeCards.clear();

    // DOM cleanup
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.element = null;

    if (this.options.logger) {
      this.options.logger.info('Hub destroyed');
    }
  }

  /**
   * DOM elem lekérése
   */
  getElement() {
    return this.element;
  }

  /**
   * Évfolyam kártyák lekérése
   */
  getGradeCards() {
    return new Map(this.gradeCards);
  }
}

export default Hub;