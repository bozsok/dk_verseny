/**
 * Card - Univerzális kártya komponens
 * 
 * Évfolyam kártyák és egyéb tartalom kártyák megjelenítésére
 * Progress bar, interaktív állapotok és reszponzív design támogatással
 */
class Card {
  constructor(options = {}) {
    this.element = null;
    this.options = {
      title: options.title || '',
      description: options.description || '',
      grade: options.grade || null, // 3, 4, 5, 6
      progress: options.progress || 0, // 0-100
      unlocked: options.unlocked || false,
      bestScore: options.bestScore || 0,
      clickable: options.clickable || false,
      variant: options.variant || 'default', // default, grade, feature
      size: options.size || 'medium', // small, medium, large
      eventBus: options.eventBus || null,
      logger: options.logger || null,
      onClick: options.onClick || null,
      onHover: options.onHover || null
    };
    
    this.eventListeners = new Map();
    this.init();
  }

  /**
   * Komponens inicializálása
   */
  init() {
    this.createElement();
    this.setupEventListeners();
    this.updateAppearance();
  }

  /**
   * DOM elem létrehozása
   */
  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'dkv-card';
    
    // Card tartalom
    this.createCardContent();
    
    // Progress bar (ha szükséges)
    if (this.options.variant === 'grade' && this.options.progress !== null) {
      this.createProgressBar();
    }
    
    // Locked state overlay
    if (!this.options.unlocked) {
      this.createLockedOverlay();
    }
  }

  /**
   * Kártya tartalom létrehozása
   */
  createCardContent() {
    const content = document.createElement('div');
    content.className = 'dkv-card-content';
    
    // Header
    if (this.options.title || this.options.grade) {
      const header = document.createElement('div');
      header.className = 'dkv-card-header';
      
      if (this.options.grade) {
        const gradeBadge = document.createElement('div');
        gradeBadge.className = 'dkv-card-grade';
        gradeBadge.textContent = `${this.options.grade}. osztály`;
        header.appendChild(gradeBadge);
      }
      
      if (this.options.title) {
        const title = document.createElement('h3');
        title.className = 'dkv-card-title';
        title.textContent = this.options.title;
        header.appendChild(title);
      }
      
      content.appendChild(header);
    }
    
    // Leírás
    if (this.options.description) {
      const description = document.createElement('p');
      description.className = 'dkv-card-description';
      description.textContent = this.options.description;
      content.appendChild(description);
    }
    
    // Meta információk
    const meta = document.createElement('div');
    meta.className = 'dkv-card-meta';
    
    if (this.options.bestScore > 0) {
      const score = document.createElement('span');
      score.className = 'dkv-card-score';
      score.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Legjobb: ${this.options.bestScore}`;
      meta.appendChild(score);
    }
    
    if (meta.children.length > 0) {
      content.appendChild(meta);
    }
    
    this.element.appendChild(content);
  }

  /**
   * Progress bar létrehozása
   */
  createProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'dkv-card-progress';
    
    const progressLabel = document.createElement('div');
    progressLabel.className = 'dkv-progress-label';
    progressLabel.textContent = 'Előrehaladás';
    progressContainer.appendChild(progressLabel);
    
    const progressBar = document.createElement('div');
    progressBar.className = 'dkv-progress-bar';
    
    const progressFill = document.createElement('div');
    progressFill.className = 'dkv-progress-fill';
    progressFill.style.width = `${Math.max(0, Math.min(100, this.options.progress))}%`;
    progressBar.appendChild(progressFill);
    
    const progressText = document.createElement('div');
    progressText.className = 'dkv-progress-text';
    progressText.textContent = `${this.options.progress}%`;
    progressBar.appendChild(progressText);
    
    progressContainer.appendChild(progressBar);
    this.element.appendChild(progressContainer);
  }

  /**
   * Zárolt állapot overlay létrehozása
   */
  createLockedOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'dkv-card-locked-overlay';
    
    const lockIcon = document.createElement('div');
    lockIcon.className = 'dkv-card-lock-icon';
    lockIcon.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/></svg>';
    
    const lockText = document.createElement('div');
    lockText.className = 'dkv-card-lock-text';
    lockText.textContent = 'Zárolva';
    
    overlay.appendChild(lockIcon);
    overlay.appendChild(lockText);
    
    this.element.appendChild(overlay);
  }

  /**
   * Eseménykezelők beállítása
   */
  setupEventListeners() {
    if (this.options.clickable) {
      this.addEventListener('click', (event) => {
        if (!this.options.unlocked) {
          event.preventDefault();
          return;
        }
        
        if (this.options.onClick) {
          this.options.onClick(event);
        }
        
        if (this.options.eventBus) {
          this.options.eventBus.emit('card:clicked', {
            grade: this.options.grade,
            title: this.options.title,
            progress: this.options.progress,
            element: this.element
          });
        }
      });

      this.addEventListener('mouseenter', () => {
        if (this.options.unlocked) {
          this.element.classList.add('dkv-card-hover');
        }
      });

      this.addEventListener('mouseleave', () => {
        this.element.classList.remove('dkv-card-hover');
      });
    }
  }

  /**
   * Megjelenés frissítése
   */
  updateAppearance() {
    // Alapvető osztályok
    this.element.className = `dkv-card dkv-card-${this.options.variant} dkv-card-${this.options.size}`;
    
    if (this.options.clickable && this.options.unlocked) {
      this.element.classList.add('dkv-card-clickable');
    }
    
    if (!this.options.unlocked) {
      this.element.classList.add('dkv-card-locked');
    }
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
   * Progress frissítése
   */
  setProgress(progress) {
    this.options.progress = Math.max(0, Math.min(100, progress));
    
    const progressFill = this.element.querySelector('.dkv-progress-fill');
    const progressText = this.element.querySelector('.dkv-progress-text');
    
    if (progressFill) {
      progressFill.style.width = `${this.options.progress}%`;
    }
    
    if (progressText) {
      progressText.textContent = `${this.options.progress}%`;
    }
  }

  /**
   * Legjobb pontszám frissítése
   */
  setBestScore(score) {
    this.options.bestScore = score;
    
    const scoreElement = this.element.querySelector('.dkv-card-score');
    if (scoreElement) {
      scoreElement.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Legjobb: ${score}`;
    }
  }

  /**
   * Feloldás állapot módosítása
   */
  setUnlocked(unlocked) {
    this.options.unlocked = Boolean(unlocked);
    this.updateAppearance();
    
    // Locked overlay eltávolítása/hozzáadása
    const overlay = this.element.querySelector('.dkv-card-locked-overlay');
    if (unlocked && overlay) {
      overlay.remove();
    } else if (!unlocked && !overlay) {
      this.createLockedOverlay();
    }
  }

  /**
   * Címek frissítése
   */
  setContent(content) {
    if (content.title !== undefined) {
      this.options.title = content.title;
      const titleElement = this.element.querySelector('.dkv-card-title');
      if (titleElement) {
        titleElement.textContent = content.title;
      }
    }
    
    if (content.description !== undefined) {
      this.options.description = content.description;
      const descElement = this.element.querySelector('.dkv-card-description');
      if (descElement) {
        descElement.textContent = content.description;
      }
    }
  }

  /**
   * Variáns módosítása
   */
  setVariant(variant) {
    this.options.variant = variant;
    this.updateAppearance();
  }

  /**
   * Animáció indítása
   */
  animate(animationType = 'pulse') {
    this.element.classList.add(`dkv-card-animate-${animationType}`);
    
    setTimeout(() => {
      this.element.classList.remove(`dkv-card-animate-${animationType}`);
    }, 600);
  }

  /**
   * Komponens eltávolítása
   */
  destroy() {
    // Eseménykezelők eltávolítása
    this.eventListeners.forEach((event, handler) => {
      this.element.removeEventListener(event, handler);
    });
    this.eventListeners.clear();
    
    // DOM elem eltávolítása
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    
    this.element = null;
  }

  /**
   * DOM elem lekérése
   */
  getElement() {
    return this.element;
  }

  /**
   * Beállítások lekérése
   */
  getOptions() {
    return { ...this.options };
  }

  /**
   * Adatok lekérése
   */
  getData() {
    return {
      grade: this.options.grade,
      progress: this.options.progress,
      unlocked: this.options.unlocked,
      bestScore: this.options.bestScore,
      title: this.options.title,
      description: this.options.description
    };
  }
}

export default Card;