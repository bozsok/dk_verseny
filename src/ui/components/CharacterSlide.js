/**
 * CharacterSlide - Karakterválasztó képernyő
 * 
 * Funkciók:
 * - Nem választás (Switch) -> Nézetet vált
 * - Karakter választás -> Elmenti a kiválasztott karaktert (Nemet és Indexet is)
 * - Preview Modal (Focus Trap-pel, ESC támogatással)
 * - Error Modal (Focus Trap-pel)
 */
class CharacterSlide {
  constructor(slideData, options = {}) {
    this.slideData = slideData;
    this.onNext = options.onNext || (() => { });
    this.stateManager = options.stateManager;

    // DOM elemek
    this.element = null;
    this.nextBtn = null;
    this.previewModal = null;
    this.errorModal = null;

    // Állapot (State)
    this.viewIsGirl = false; // Mit NÉZÜNK éppen? 
    this.confirmedSelection = null;
    this.previewSelection = null;

    // Focus Trap változók
    this.lastFocusedElement = null;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'dkv-slide-container dkv-character-slide';

    // CSS Stílusok (Inline)
    const style = document.createElement('style');
    style.textContent = `
      .dkv-toggle-switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 26px;
      }
      .dkv-toggle-switch input { 
        opacity: 0;
        width: 0;
        height: 0;
      }
      .dkv-slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: #374151;
        transition: .4s;
        border-radius: 34px;
        border: 1px solid #4b5563;
      }
      .dkv-slider:before {
        position: absolute;
        content: "";
        height: 18px; width: 18px;
        left: 3px; bottom: 3px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
      input:checked + .dkv-slider {
        background-color: #6b7280;
      }
      input:checked + .dkv-slider:before {
        transform: translateX(24px);
      }
      
      .dkv-char-card {
        width: 130px;
        height: 290px;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        cursor: pointer;
        transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255,255,255,0.3);
      }
      .dkv-char-card:hover {
        transform: scale(1.08);
        border-color: rgba(255, 255, 255, 0.6);
        background: rgba(255, 255, 255, 0.1);
      }
      .dkv-char-card.selected {
        border-color: #4ade80;
        box-shadow: 0 0 15px rgba(74, 222, 128, 0.5);
        background: rgba(74, 222, 128, 0.1);
      }

      .dkv-preview-close {
        position: absolute;
        top: 20px;
        right: 20px;
        cursor: pointer;
        font-size: 20px;
        color: #e5e7eb;
        line-height: 1;
        transition: transform 0.2s, color 0.2s;
      }
      .dkv-preview-close:hover { 
        transform: scale(1.2);
        color: #fff;
      }

      .dkv-preview-select-btn {
        position: absolute;
        bottom: 30px;
        right: 30px;
        padding: 12px 24px;
        background: #4ade80;
        color: #064e3b;
        border: none;
        border-radius: 8px;
        font-weight: bold;
        font-size: 1.1rem;
        cursor: pointer;
        transition: transform 0.2s;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      }
      .dkv-preview-select-btn:hover { transform: scale(1.05); }
      
      /* Focus stílusok billentyűzethez */
      .dkv-char-card:focus, 
      .dkv-preview-select-btn:focus, 
      .dkv-preview-close:focus,
      .dkv-button:focus,
      .dkv-toggle-switch input:focus + .dkv-slider {
        outline: 2px solid #3b82f6; 
        outline-offset: 2px;
      }
    `;
    this.element.appendChild(style);

    // Belső konténer
    const container = document.createElement('div');
    container.className = 'dkv-onboarding-container';
    container.style.flexDirection = 'column';
    container.style.justifyContent = 'center';
    container.style.gap = '0';

    // 1. Címsor 
    const headerBlock = document.createElement('div');
    headerBlock.style.textAlign = 'center';
    headerBlock.style.marginBottom = '25px';

    const title = document.createElement('h2');
    title.textContent = 'Következő feladatként válassz egy karaktert az alábbiak közül!';
    title.style.fontSize = '1.4rem';
    title.style.marginBottom = '5px';
    title.style.color = 'white';

    const subtitle = document.createElement('p');
    subtitle.textContent = 'A karakterek kattintással nagyíthatók!';
    subtitle.style.fontSize = '1.1rem';
    subtitle.style.color = '#cbd5e1';

    headerBlock.appendChild(title);
    headerBlock.appendChild(subtitle);

    // 2. Csúszka
    const toggleBlock = document.createElement('div');
    toggleBlock.style.display = 'flex';
    toggleBlock.style.alignItems = 'center';
    toggleBlock.style.justifyContent = 'center';
    toggleBlock.style.gap = '20px';
    toggleBlock.style.marginBottom = '35px';

    const toggleLabel = document.createElement('span');
    toggleLabel.textContent = 'Ha lány karaktert szeretnél választani, kattints a csúszkára!';
    toggleLabel.style.fontSize = '1.1rem';
    toggleLabel.style.color = '#e2e8f0';

    const toggleLabelWrapper = document.createElement('label');
    toggleLabelWrapper.className = 'dkv-toggle-switch';

    const toggleInput = document.createElement('input');
    toggleInput.type = 'checkbox';
    toggleInput.checked = this.viewIsGirl;
    toggleInput.onchange = (e) => this._handleGenderToggle(e.target.checked);
    // Billentyűzet támogatás csúszkához (Enter)
    toggleInput.onkeydown = (e) => {
      if (e.key === 'Enter') {
        toggleInput.click();
      }
    };

    const sliderSpan = document.createElement('span');
    sliderSpan.className = 'dkv-slider';

    toggleLabelWrapper.appendChild(toggleInput);
    toggleLabelWrapper.appendChild(sliderSpan);
    toggleBlock.appendChild(toggleLabel);
    toggleBlock.appendChild(toggleLabelWrapper);

    // 3. Karakter Kártyák
    this.cardsContainer = document.createElement('div');
    this.cardsContainer.style.display = 'flex';
    this.cardsContainer.style.justifyContent = 'center';
    this.cardsContainer.style.gap = '30px';
    this.cardsContainer.style.marginBottom = '35px';

    this._renderCards();

    // 4. Alsó Instrukció
    const footerText = document.createElement('p');
    footerText.innerHTML = 'Ha választottál egy neked tetsző karaktert, akkor nyomd meg a <strong>Tovább</strong> gombot a játékfelület megismeréséhez!';
    footerText.style.textAlign = 'center';
    footerText.style.fontSize = '1rem';
    footerText.style.color = '#cbd5e1';
    footerText.style.maxWidth = '800px';
    footerText.style.marginTop = '10px';

    // Tovább Gomb
    this.nextBtn = document.createElement('button');
    this.nextBtn.className = 'dkv-button dkv-onboarding-next-btn';
    this.nextBtn.textContent = 'Tovább';
    this.nextBtn.onclick = () => this.handleSubmit();

    this._updateNextButton();

    container.appendChild(headerBlock);
    container.appendChild(toggleBlock);
    container.appendChild(this.cardsContainer);
    container.appendChild(footerText);
    container.appendChild(this.nextBtn);

    this.element.appendChild(container);

    // Modals
    this._createPreviewModal();
    this._createErrorModal();

    return this.element;
  }

  _renderCards() {
    this.cardsContainer.innerHTML = '';

    for (let i = 0; i < 4; i++) {
      const card = document.createElement('div');
      // A11y: Tab index + Keydown
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${this.viewIsGirl ? 'Lány' : 'Fiú'} karakter ${i + 1}`);

      let isSelected = false;
      if (this.confirmedSelection) {
        if (this.confirmedSelection.isGirl === this.viewIsGirl && this.confirmedSelection.index === i) {
          isSelected = true;
        }
      }

      card.className = `dkv-char-card ${isSelected ? 'selected' : ''}`;

      const placeholderText = document.createElement('span');
      placeholderText.textContent = `${this.viewIsGirl ? 'Lány' : 'Fiú'} ${i + 1}`;
      card.appendChild(placeholderText);

      // Klikk -> Preview Modal
      card.onclick = () => this._openPreviewModal(i);
      // Enter -> Preview Modal
      card.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this._openPreviewModal(i);
        }
      };

      this.cardsContainer.appendChild(card);
    }
  }

  _handleGenderToggle(isChecked) {
    this.viewIsGirl = isChecked;
    this._renderCards();
  }

  _updateNextButton() {
    const hasSelection = this.confirmedSelection !== null;
    this.nextBtn.disabled = !hasSelection;
    this.nextBtn.style.opacity = hasSelection ? '1' : '0.5';
    this.nextBtn.style.cursor = hasSelection ? 'pointer' : 'not-allowed';
  }

  // === PREVIEW MODAL ===
  _createPreviewModal() {
    this.previewModal = document.createElement('div');
    this.previewModal.style.position = 'fixed';
    this.previewModal.style.top = '0';
    this.previewModal.style.left = '0';
    this.previewModal.style.width = '100vw';
    this.previewModal.style.height = '100vh';
    this.previewModal.style.background = 'rgba(0,0,0,0.85)';
    this.previewModal.style.display = 'none';
    this.previewModal.style.alignItems = 'center';
    this.previewModal.style.justifyContent = 'center';
    this.previewModal.style.zIndex = '2000';
    // Accessibility
    this.previewModal.setAttribute('role', 'dialog');
    this.previewModal.setAttribute('aria-modal', 'true');

    this.previewModal.onclick = (e) => {
      if (e.target === this.previewModal) this._closePreviewModal();
    };

    // Focus Trap & ESC
    this.previewModal.addEventListener('keydown', (e) => this._handleTrapFocus(e, this.previewModal));

    const content = document.createElement('div');
    content.style.position = 'relative';
    content.style.width = '770px';
    content.style.height = '700px';
    content.style.maxWidth = '95vw';
    content.style.maxHeight = '95vh';
    content.style.background = '#111';
    content.style.borderRadius = '12px';
    content.style.display = 'flex';
    content.style.alignItems = 'center';
    content.style.justifyContent = 'center';
    content.style.boxShadow = '0 0 30px rgba(0,0,0,0.5)';
    content.style.border = '1px solid rgba(255,255,255,0.1)';

    this.previewImage = document.createElement('div');
    this.previewImage.style.width = '100%';
    this.previewImage.style.height = '100%';
    this.previewImage.style.display = 'flex';
    this.previewImage.style.alignItems = 'center';
    this.previewImage.style.justifyContent = 'center';
    this.previewImage.style.color = '#555';
    this.previewImage.textContent = 'KÉP HELYE (770x700)';

    this.closePreviewBtn = document.createElement('div'); // Referencia
    this.closePreviewBtn.className = 'dkv-preview-close';
    this.closePreviewBtn.textContent = '✕';
    this.closePreviewBtn.setAttribute('tabindex', '0'); // Fókuszálható
    this.closePreviewBtn.setAttribute('role', 'button');
    this.closePreviewBtn.onclick = () => this._closePreviewModal();
    this.closePreviewBtn.onkeydown = (e) => { if (e.key === 'Enter') this._closePreviewModal(); };

    this.selectPreviewBtn = document.createElement('button'); // Referencia
    this.selectPreviewBtn.className = 'dkv-preview-select-btn';
    this.selectPreviewBtn.textContent = 'Kiválasztom';
    this.selectPreviewBtn.onclick = () => this._confirmSelection();

    content.appendChild(this.previewImage);
    content.appendChild(this.closePreviewBtn);
    content.appendChild(this.selectPreviewBtn);
    this.previewModal.appendChild(content);

    document.body.appendChild(this.previewModal);
  }

  _openPreviewModal(index) {
    this.lastFocusedElement = document.activeElement; // Fókusz megőrzése

    this.previewSelection = {
      isGirl: this.viewIsGirl,
      index: index
    };

    this.previewImage.textContent = `${this.viewIsGirl ? 'Lány' : 'Fiú'} ${index + 1} - NAGYÍTVA`;
    this.previewModal.style.display = 'flex';

    // Fókusz a Kiválasztom gombra (UX)
    setTimeout(() => {
      this.selectPreviewBtn.focus();
    }, 50);
  }

  _closePreviewModal() {
    this.previewModal.style.display = 'none';
    this.previewSelection = null;

    // Fókusz visszaállítása (ha nem lenne felülírva máshol)
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
  }

  // === ERROR MODAL ===
  _createErrorModal() {
    this.errorModal = document.createElement('div');
    this.errorModal.style.position = 'absolute';
    this.errorModal.style.top = '0';
    this.errorModal.style.left = '0';
    this.errorModal.style.width = '100%';
    this.errorModal.style.height = '100%';
    this.errorModal.style.background = 'rgba(0,0,0,0.8)';
    this.errorModal.style.display = 'none';
    this.errorModal.style.alignItems = 'center';
    this.errorModal.style.justifyContent = 'center';
    this.errorModal.style.zIndex = '3000';
    this.errorModal.setAttribute('role', 'dialog');
    this.errorModal.setAttribute('aria-modal', 'true');

    this.errorModal.addEventListener('keydown', (e) => this._handleTrapFocus(e, this.errorModal));

    const content = document.createElement('div');
    content.style.background = '#1f2937';
    content.style.border = '2px solid #ef4444';
    content.style.padding = '2rem';
    content.style.borderRadius = '12px';
    content.style.maxWidth = '400px';
    content.style.textAlign = 'center';
    content.style.color = 'white';

    this.errorMsg = document.createElement('p');
    this.errorMsg.style.marginBottom = '1.5rem';
    this.errorMsg.style.fontSize = '1.1rem';
    this.errorMsg.style.whiteSpace = 'pre-line';
    this.errorMsg.style.lineHeight = '1.5';

    this.errorOkBtn = document.createElement('button'); // Referencia
    this.errorOkBtn.className = 'dkv-button';
    this.errorOkBtn.textContent = 'OK';
    this.errorOkBtn.onclick = () => this._closeErrorModal();

    content.appendChild(this.errorMsg);
    content.appendChild(this.errorOkBtn);
    this.errorModal.appendChild(content);

    this.element.appendChild(this.errorModal);
  }

  _showError(msg) {
    this.lastFocusedElement = document.activeElement;
    this.errorMsg.textContent = msg;
    this.errorModal.style.display = 'flex';
    setTimeout(() => { this.errorOkBtn.focus(); }, 50);
  }

  _closeErrorModal() {
    this.errorModal.style.display = 'none';
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
  }

  // === Általános Focus Trap ===
  _handleTrapFocus(e, modalElement) {
    // ESC billentyűvel való bezárás (első prioritás!)
    if (e.key === 'Escape') {
      if (modalElement === this.previewModal) {
        this._closePreviewModal();
        return;
      }
      if (modalElement === this.errorModal) {
        this._closeErrorModal();
        return;
      }
    }

    const isTab = (e.key === 'Tab' || e.keyCode === 9);
    if (!isTab) return;

    const focusable = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) { // Shift + Tab
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else { // Tab
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // ... (többi metódus unchanged) ...

  _confirmSelection() {
    if (this.previewSelection) {
      this.confirmedSelection = { ...this.previewSelection };
      this._renderCards(); // UI Frissítés
      this._updateNextButton(); // Gomb aktiválás
    }

    // Modal bezárása
    this.previewModal.style.display = 'none';
    this.previewSelection = null;

    // Fókusz áthelyezése a Tovább gombra (UX: haladjon tovább a folyamat)
    // Töröljük a lastFocusedElement-et, hogy a _closeModal ne írja felül
    this.lastFocusedElement = null;
    setTimeout(() => {
      if (this.nextBtn) this.nextBtn.focus();
    }, 50);
  }

  handleSubmit() {
    if (!this.confirmedSelection) {
      this._showError('Sajnos nem választottál magadnak karaktert!\nKérlek, válassz ki egyet az alábbiak közül!');
      return;
    }

    const gender = this.confirmedSelection.isGirl ? 'girl' : 'boy';
    const characterId = `${gender}_${this.confirmedSelection.index + 1}`;

    if (this.stateManager) {
      this.stateManager.updateState({
        avatar: characterId
      });
    }

    this.onNext();
  }
}

export default CharacterSlide;
