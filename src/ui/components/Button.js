/**
 * Button - Univerzális gomb komponens
 * 
 * Primary, secondary és egyéb típusokat támogató gomb komponens
 * Touch-friendly sizing és animációkkal
 */
class Button {
  constructor(options = {}) {
    this.element = null;
    this.options = {
      text: options.text || 'Gomb',
      variant: options.variant || 'primary', // primary, secondary, outline
      size: options.size || 'medium', // small, medium, large
      disabled: options.disabled || false,
      loading: options.loading || false,
      icon: options.icon || null,
      iconPosition: options.iconPosition || 'left', // left, right
      fullWidth: options.fullWidth || false,
      eventBus: options.eventBus || null,
      logger: options.logger || null,
      onClick: options.onClick || null
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
    this.element = document.createElement('button');
    this.element.className = 'dkv-btn';
    this.element.type = 'button';
    
    // Alapvető struktúra
    if (this.options.icon && this.options.iconPosition === 'left') {
      this.element.appendChild(this.createIcon());
    }
    
    const textSpan = document.createElement('span');
    textSpan.className = 'dkv-btn-text';
    textSpan.textContent = this.options.text;
    this.element.appendChild(textSpan);
    
    if (this.options.icon && this.options.iconPosition === 'right') {
      this.element.appendChild(this.createIcon());
    }
    
    // Loading spinner
    this.loadingSpinner = this.createLoadingSpinner();
    this.loadingSpinner.style.display = 'none';
    this.element.appendChild(this.loadingSpinner);
  }

  /**
   * Ikon létrehozása
   */
  createIcon() {
    const iconElement = document.createElement('span');
    iconElement.className = `dkv-btn-icon dkv-btn-icon-${this.options.iconPosition}`;
    iconElement.innerHTML = this.getIconSVG(this.options.icon);
    return iconElement;
  }

  /**
   * Loading spinner létrehozása
   */
  createLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'dkv-btn-spinner';
    spinner.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416" opacity="0.3"/>
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="23.562" class="dkv-spinner-circle"/>
      </svg>
    `;
    return spinner;
  }

  /**
   * Ikon SVG lekérése
   */
  getIconSVG(iconName) {
    const icons = {
      play: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
      pause: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
      star: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>',
      settings: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>'
    };
    
    return icons[iconName] || '';
  }

  /**
   * Eseménykezelők beállítása
   */
  setupEventListeners() {
    this.addEventListener('click', (event) => {
      if (this.options.disabled || this.options.loading) {
        event.preventDefault();
        return;
      }
      
      if (this.options.onClick) {
        this.options.onClick(event);
      }
      
      if (this.options.eventBus) {
        this.options.eventBus.emit('button:clicked', {
          variant: this.options.variant,
          text: this.options.text,
          element: this.element
        });
      }
    });

    this.addEventListener('mousedown', () => {
      if (!this.options.disabled && !this.options.loading) {
        this.element.classList.add('dkv-btn-pressed');
      }
    });

    this.addEventListener('mouseup', () => {
      this.element.classList.remove('dkv-btn-pressed');
    });

    this.addEventListener('mouseleave', () => {
      this.element.classList.remove('dkv-btn-pressed');
    });

    // Keyboard support
    this.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.element.click();
      }
    });
  }

  /**
   * Megjelenés frissítése
   */
  updateAppearance() {
    // Variáns osztályok
    this.element.className = `dkv-btn dkv-btn-${this.options.variant} dkv-btn-${this.options.size}`;
    
    if (this.options.fullWidth) {
      this.element.classList.add('dkv-btn-full');
    }
    
    if (this.options.disabled) {
      this.element.classList.add('dkv-btn-disabled');
      this.element.disabled = true;
    } else {
      this.element.classList.remove('dkv-btn-disabled');
      this.element.disabled = false;
    }
    
    if (this.options.loading) {
      this.element.classList.add('dkv-btn-loading');
      this.loadingSpinner.style.display = 'block';
    } else {
      this.element.classList.remove('dkv-btn-loading');
      this.loadingSpinner.style.display = 'none';
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
   * Szöveg frissítése
   */
  setText(text) {
    this.options.text = text;
    const textSpan = this.element.querySelector('.dkv-btn-text');
    if (textSpan) {
      textSpan.textContent = text;
    }
  }

  /**
   * Loading állapot beállítása
   */
  setLoading(loading) {
    this.options.loading = Boolean(loading);
    this.updateAppearance();
  }

  /**
   * Disabled állapot beállítása
   */
  setDisabled(disabled) {
    this.options.disabled = Boolean(disabled);
    this.updateAppearance();
  }

  /**
   * Variáns módosítása
   */
  setVariant(variant) {
    this.options.variant = variant;
    this.updateAppearance();
  }

  /**
   * Méret módosítása
   */
  setSize(size) {
    this.options.size = size;
    this.updateAppearance();
  }

  /**
   * Teljes szélesség beállítása
   */
  setFullWidth(fullWidth) {
    this.options.fullWidth = Boolean(fullWidth);
    this.updateAppearance();
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
}

export default Button;