import Typewriter from '../../utils/Typewriter.js';

/**
 * CharacterSlide - Karakterválasztó képernyő
 * 
 * Funkciók:
 * - Nem választás (Switch) -> Nézetet vált
 * - Karakter választás -> Elmenti a kiválasztott karaktert (Nemet és Indexet is)
 * - Preview Modal (Focus Trap-pel, ESC támogatással)
 * - Error Modal (Focus Trap-pel)
 * - HTML támogatás a Címben és Leírásban
 * - Dinamikus Stílus (Configból)
 */
class CharacterSlide {
  constructor(slideData, options = {}) {
    this.slideData = slideData;
    this.onNext = options.onNext || (() => { });
    this.stateManager = options.stateManager;
    this.typewriter = new Typewriter();

    // DOM elemek
    this.element = null;
    this.nextBtn = null;
    this.previewModal = null;
    this.errorModal = null;

    // Állapot (State)
    this.viewIsGirl = false;
    this.confirmedSelection = null;
    this.previewSelection = null;
    this.selectionBonusShown = false;

    this.lastFocusedElement = null;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'dkv-slide-container dkv-character-slide';



    // CSS Stílusok (Inline) - TÖRÖLVE (Character.css kezeli)

    // Belső konténer
    const container = document.createElement('div');
    container.className = 'dkv-onboarding-container';

    // 1. Címsor (MOST MÁR HTML TÁMOGATÁSSAL ÉS GÉPELÉSSEL!)
    const headerBlock = document.createElement('div');
    headerBlock.className = 'dkv-character-header';

    const rawTitle = this.slideData.title || '';
    const titleLines = rawTitle.split('\n');
    const titleTypingSpeed = (this.slideData.content && this.slideData.content.typingSpeed) || 0;

    // Cím sorainak feldolgozása
    const titleParagraphs = [];

    titleLines.forEach((line, index) => {
      if (!line.trim()) return;

      const el = document.createElement(index === 0 ? 'h2' : 'p');
      el.className = 'dkv-slide-title'; // CSS osztály használata

      if (index === 0) {
        // CSS kezeli
      } else {
        // CSS kezeli
      }

      // Typewriter INIT
      if (titleTypingSpeed > 0) {
        this.typewriter.init(el, line);
      } else {
        el.innerHTML = line;
      }

      headerBlock.appendChild(el);
      titleParagraphs.push({ element: el, speed: titleTypingSpeed });
    });

    // Subtitle (Leírás)
    const subtitle = document.createElement('p');
    const descTypingSpeed = (this.slideData.content && this.slideData.content.typingSpeed) || 0;

    if (this.slideData.description) {
      if (descTypingSpeed > 0) {
        this.typewriter.init(subtitle, this.slideData.description);
        // Hozzáadjuk a közös listához
        titleParagraphs.push({ element: subtitle, speed: descTypingSpeed });
      } else {
        subtitle.innerHTML = this.slideData.description;
      }
    }

    headerBlock.appendChild(subtitle);

    // Csak EGY HELYEN indítjuk a szekvenciát a metódus végén!

    // 2. Csúszka
    const toggleBlock = document.createElement('div');
    toggleBlock.className = 'dkv-toggle-block';

    const toggleLabel = document.createElement('span');
    toggleLabel.className = 'dkv-toggle-label';
    // Szöveget majd az animáció írja be!

    const toggleLabelWrapper = document.createElement('label');
    toggleLabelWrapper.className = 'dkv-switch';
    toggleLabelWrapper.style.opacity = '0'; // Kezdetben rejtve
    toggleLabelWrapper.style.transition = 'opacity 1s ease';

    const toggleInput = document.createElement('input');
    toggleInput.type = 'checkbox';
    toggleInput.checked = this.viewIsGirl;
    toggleInput.onchange = (e) => this._handleGenderToggle(e.target.checked);
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
    this.cardsContainer.className = 'dkv-cards-container';
    // A kártyákat majd egyenként jelenítjük meg, de a konténer lehet látható

    this._renderCards();
    // Kártyák alapból legyenek rejtve (renderCards-ban kezeljük vagy itt stílusozzuk felül)
    // Utólagos style a cardsContainer gyerekeire:
    Array.from(this.cardsContainer.children).forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.8)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // 4. Alsó Instrukció
    const footerText = document.createElement('p');
    footerText.className = 'dkv-footer-text';
    // Szöveget majd az animáció írja be!

    // Tovább Gomb
    this.nextBtn = document.createElement('button');
    this.nextBtn.className = 'dkv-button dkv-onboarding-next-btn';
    this.nextBtn.textContent = 'Tovább';
    this.nextBtn.style.opacity = '0'; // Kezdetben rejtve
    this.nextBtn.style.transition = 'opacity 1s ease';
    this.nextBtn.disabled = true;

    this.nextBtn.onclick = () => this.handleSubmit();

    // this._updateNextButton(); // Ezt majd az animáció végén, vagy ha van selection, felülbíráljuk

    container.appendChild(headerBlock);
    container.appendChild(toggleBlock);
    container.appendChild(this.cardsContainer);
    container.appendChild(footerText);
    container.appendChild(this.nextBtn);

    this.element.appendChild(container);

    this._createPreviewModal();
    this._createErrorModal();

    // Animáció indítása miután minden elem a helyén van
    setTimeout(() => {
      this._playAnimationSequence(titleParagraphs, titleTypingSpeed, toggleLabel, 'Ha lány karaktert szeretnél választani, kattints a csúszkára!', toggleLabelWrapper, footerText, 'Ha választottál egy neked tetsző karaktert, akkor nyomd meg a <strong>Tovább</strong> gombot a játékfelület megismeréséhez!', descTypingSpeed);
    }, 100);

    return this.element;
  }

  // --- Animációs Szekvencia Logika ---

  _playAnimationSequence(priorityParagraphs, speed, toggleLabelEl, toggleText, toggleSwitchEl, footerEl, footerHTML, footerSpeed) {
    let sequenceFailed = false;

    // Biztonsági Timeout: Ha 4 másodperc alatt nem jelenik meg a Toggle, akkor kényszerítjük
    const failSafeTimeout = setTimeout(() => {
      if (toggleSwitchEl.style.opacity !== '1') {
        sequenceFailed = true;
        console.warn('Animation sequence timeout - Encouraging visibility');
        toggleLabelEl.textContent = toggleText; // Szöveg beírása
        toggleSwitchEl.style.opacity = '1';
        this._renderCards();
        Array.from(this.cardsContainer.children).forEach(card => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        });
        footerEl.innerHTML = footerHTML;
        this._updateNextButton();
        this.nextBtn.style.opacity = this.nextBtn.disabled ? '0.5' : '1';
      }
    }, 4000);

    // 1. Cím és Leírás (ha van)
    const runTitle = () => {
      if (sequenceFailed) return;
      if (priorityParagraphs.length > 0) {
        this._startTypewriterSequence(priorityParagraphs, {
          onComplete: () => {
            // Cím végén levesszük a kurzort az utolsó elemről
            const lastP = priorityParagraphs[priorityParagraphs.length - 1].element;
            const activeSpan = lastP.querySelector('.dkv-cursor-active');
            if (activeSpan) activeSpan.classList.remove('dkv-cursor-active');
            runToggleText();
          }
        });
      } else {
        runToggleText();
      }
    };

    // 2. Toggle Label ("Ha lány karaktert...")
    const runToggleText = () => {
      if (sequenceFailed) return;
      this.typewriter.type(toggleLabelEl, toggleText, {
        speed: (speed !== undefined && speed !== null) ? speed : 20,
        onComplete: () => {
          // Toggle szöveg végén levesszük a kurzort (VAGY megtartjuk, ha az a kérés, de most levesszük)
          const activeSpan = toggleLabelEl.querySelector('.dkv-cursor-active');
          if (activeSpan) activeSpan.classList.remove('dkv-cursor-active');
          showToggleSwitch();
        }
      });
    };

    // 3. Toggle Switch Megjelenése
    const showToggleSwitch = () => {
      if (sequenceFailed) return;
      clearTimeout(failSafeTimeout); // Sikerült eljutni idáig!
      toggleSwitchEl.style.opacity = '1';
      setTimeout(runCards, 500);
    };

    // 4. Kártyák megjelenése (Staggered)
    const runCards = () => {
      if (sequenceFailed) return;
      const cards = Array.from(this.cardsContainer.children);
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, index * 150); // Gyorsabb kártyamegjelenés
      });

      // Mikor van kész az utolsó?
      const totalTime = cards.length * 150 + 300;
      setTimeout(runFooter, totalTime);
    };

    // 5. Footer Text ("Ha választottál...")
    const runFooter = () => {
      if (sequenceFailed) return;
      this.typewriter.type(footerEl, footerHTML, {
        speed: (footerSpeed !== undefined && footerSpeed !== null) ? footerSpeed : 20,
        onComplete: showNextBtn
      });
    };

    // 6. Next Button
    const showNextBtn = () => {
      if (sequenceFailed) return;
      // Itt hagyjuk a kurzort a footer szövegen, mert ez az utolsó
      this.nextBtn.style.opacity = this.nextBtn.disabled ? '0.5' : '1';
      this._updateNextButton();
    };

    // Indítás
    runTitle();
  }

  _handleGenderToggle(isGirl) {
    this.viewIsGirl = isGirl;
    // Váltáskor töröljük a kiválasztást, hogy ne legyen zavaró
    this.confirmedSelection = null;
    this._renderCards(); // Újragenerálás
    this._updateNextButton();
  }

  _renderCards() {
    this.cardsContainer.innerHTML = '';
    const gender = this.viewIsGirl ? 'girl' : 'boy';
    // Load characters from config or fallback/empty
    const characters = (this.slideData.content && this.slideData.content.characters && this.slideData.content.characters[gender]) || [];

    // Ha nincs config, fallback a régi ciklusra (de a config már frissítve van)
    const count = characters.length > 0 ? characters.length : 4;

    for (let i = 0; i < count; i++) {
      const charData = characters[i] || {};
      const card = document.createElement('div');
      card.className = 'dkv-char-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${this.viewIsGirl ? 'Lány' : 'Fiú'} karakter ${i + 1}`);

      // Kiválasztott állapot
      const isSelected = this.confirmedSelection &&
        this.confirmedSelection.isGirl === this.viewIsGirl &&
        this.confirmedSelection.index === i;

      if (isSelected) {
        card.classList.add('selected');
      }

      // Kép generálása
      const img = document.createElement('img');
      // Config path vagy fallback
      img.src = charData.card || `assets/images/characters/${gender}_${i + 1}.png`;
      img.alt = `Character ${i + 1}`;

      // Ha nincs kép, placeholder
      img.onerror = () => {
        img.onerror = null;
        img.src = 'https://placehold.co/150x200?text=' + (this.viewIsGirl ? 'Girl' : 'Boy') + '+' + (i + 1);
      };

      // Zoom kép útvonala
      const zoomSrc = charData.zoom || img.src; // Fallback a kártyaképre, ha nincs zoom

      card.onclick = () => this._openPreviewModal(i, zoomSrc);
      card.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this._openPreviewModal(i, zoomSrc);
        }
      };

      card.appendChild(img);
      this.cardsContainer.appendChild(card);
    }
  }

  _updateNextButton() {
    if (this.nextBtn) {
      const hasSelection = !!this.confirmedSelection;
      this.nextBtn.disabled = !hasSelection;
      // Csak akkor állítunk opacity-t, ha már látható (nem 0)
      if (this.nextBtn.style.opacity !== '0') {
        this.nextBtn.style.opacity = hasSelection ? '1' : '0.5';
      }
    }
  }

  _createPreviewModal() {
    this.previewModal = document.createElement('div');
    this.previewModal.className = 'dkv-preview-modal-overlay';

    // Grade scope hozzáadása a PREVIEW MODAL-hoz is!
    if (this.stateManager) {
      const currentGrade = this.stateManager.getStateValue('currentGrade');
      if (currentGrade) {
        this.previewModal.classList.add(`dkv-grade-${currentGrade}`);
      }
    }

    this.previewModal.style.display = 'none'; // Inicializálás
    this.previewModal.setAttribute('role', 'dialog');
    this.previewModal.setAttribute('aria-modal', 'true');

    this.previewModal.onclick = (e) => {
      if (e.target === this.previewModal) this._closePreviewModal();
    };

    this.previewModal.addEventListener('keydown', (e) => this._handleTrapFocus(e, this.previewModal));

    const content = document.createElement('div');
    content.className = 'dkv-preview-modal-content';

    this.previewImage = document.createElement('div');
    this.previewImage.className = 'dkv-preview-image-placeholder';
    this.previewImage.textContent = 'KÉP HELYE (770x700)';

    this.closePreviewBtn = document.createElement('div');
    this.closePreviewBtn.className = 'dkv-preview-close';
    this.closePreviewBtn.textContent = '✕';
    this.closePreviewBtn.setAttribute('tabindex', '0');
    this.closePreviewBtn.setAttribute('role', 'button');
    this.closePreviewBtn.onclick = () => this._closePreviewModal();
    this.closePreviewBtn.onkeydown = (e) => { if (e.key === 'Enter') this._closePreviewModal(); };

    this.selectPreviewBtn = document.createElement('button');
    this.selectPreviewBtn.className = 'dkv-preview-select-btn';
    this.selectPreviewBtn.textContent = 'Kiválasztom';
    this.selectPreviewBtn.onclick = () => this._confirmSelection();

    content.appendChild(this.previewImage);
    content.appendChild(this.closePreviewBtn);
    content.appendChild(this.selectPreviewBtn);
    this.previewModal.appendChild(content);

    document.body.appendChild(this.previewModal);
  }

  _openPreviewModal(index, zoomSrc) {
    this.lastFocusedElement = document.activeElement;

    this.previewSelection = {
      isGirl: this.viewIsGirl,
      index: index
    };

    // Töltsük be a Zoom képet
    // Ha szöveg volt (placeholder), cseréljük képre
    this.previewImage.innerHTML = '';
    const img = document.createElement('img');
    img.src = zoomSrc;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.style.objectFit = 'contain';
    img.onerror = () => {
      this.previewImage.textContent = `${this.viewIsGirl ? 'Lány' : 'Fiú'} ${index + 1} - HIÁNYZÓ KÉP`;
    };
    this.previewImage.appendChild(img);

    this.previewModal.style.display = 'flex';

    setTimeout(() => {
      this.selectPreviewBtn.focus();
    }, 50);
  }

  _closePreviewModal() {
    this.previewModal.style.display = 'none';
    this.previewSelection = null;

    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
  }

  _createErrorModal() {
    this.errorModal = document.createElement('div');
    this.errorModal.className = 'dkv-error-modal-overlay';
    this.errorModal.style.display = 'none'; // Inicializálás
    this.errorModal.setAttribute('role', 'dialog');
    this.errorModal.setAttribute('aria-modal', 'true');

    this.errorModal.addEventListener('keydown', (e) => this._handleTrapFocus(e, this.errorModal));

    const content = document.createElement('div');
    content.className = 'dkv-error-modal-content';

    this.errorMsg = document.createElement('p');
    this.errorMsg.className = 'dkv-error-message';

    this.errorOkBtn = document.createElement('button');
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

  _handleTrapFocus(e, modalElement) {
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

  _confirmSelection() {
    if (this.previewSelection) {
      this.confirmedSelection = { ...this.previewSelection };

      // Pontszám lekérése configból (vagy fallback 1)
      const selectionPoints = (this.slideData.content && this.slideData.content.scoring && this.slideData.content.scoring.selection) || 1;

      // Bónusz animáció (csak egyszer)
      // Bónusz animáció (csak egyszer)
      if (!this.selectionBonusShown) {
        const cardIndex = this.confirmedSelection.index;

        // Késleltetjük kicsit, hogy a modal eltűnése után látszódjon
        setTimeout(() => {
          // FONTOS: Újra kell keresni az elemet, mert a _renderCards időközben lefutott!
          if (this.cardsContainer && this.cardsContainer.children[cardIndex]) {
            const currentCardElement = this.cardsContainer.children[cardIndex];
            this._showFloatingPoint(currentCardElement, selectionPoints);
          }
        }, 300);

        this.selectionBonusShown = true;
      }

      this._renderCards(); // Itt kell egy kis trükk, mert az alap renderCards nincs felkészítve a style megőrzésre
      // Frissítés után újra be kell állítani az opacity-t, különben eltűnnek
      Array.from(this.cardsContainer.children).forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      });

      this._updateNextButton();
    }

    this.previewModal.style.display = 'none';
    this.previewSelection = null;

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
    const index = this.confirmedSelection.index;

    // Keressük meg a configból a pontos URL-t
    const characters = (this.slideData.content && this.slideData.content.characters && this.slideData.content.characters[gender]) || [];
    const selectedCharData = characters[index] || {};
    // Fallback URL, ha nincs a configban (ELŐNYBEN RÉSZESÍTVE AZ ICONT)
    const avatarUrl = selectedCharData.icon || selectedCharData.card || `assets/images/characters/${gender}_${index + 1}.png`;

    if (this.stateManager) {
      const currentScore = this.stateManager.getStateValue('score') || 0;

      // Pontszám a configból (vagy fallback 1)
      const selectionPoints = (this.slideData.content && this.slideData.content.scoring && this.slideData.content.scoring.selection) || 1;

      this.stateManager.updateState({
        avatar: avatarUrl, // Ez most már a "small" képre mutat, ha van icon
        score: currentScore + selectionPoints
      });
      console.log(`Karakter választva. +${selectionPoints} Pont. Összpontszám:`, currentScore + selectionPoints);
    }

    this.onNext();
  }

  _startTypewriterSequence(paragraphs, options = {}) {
    let currentIndex = 0;
    const onCompleteAll = options.onComplete || (() => { });

    const typeNext = () => {
      if (currentIndex >= paragraphs.length) {
        onCompleteAll(); // Minden kész
        return;
      }

      // Előző kurzor levétele
      if (currentIndex > 0) {
        const prevEl = paragraphs[currentIndex - 1].element;
        const activeSpan = prevEl.querySelector('.dkv-cursor-active');
        if (activeSpan) activeSpan.classList.remove('dkv-cursor-active');
      }

      const pData = paragraphs[currentIndex];
      // Use item specific speed or default
      const currentSpeed = pData.speed || 30;

      this.typewriter.type(pData.element, null, {
        speed: currentSpeed,
        showCursor: true,
        onComplete: () => {
          currentIndex++;
          typeNext();
        }
      });
    };

    typeNext();
  }
  _showFloatingPoint(element, points) {
    const rect = element.getBoundingClientRect();
    const floatEl = document.createElement('div');
    floatEl.className = 'dkv-floating-point';
    floatEl.textContent = `+${points}`;

    // Pozicionálás: az elem közepe-teteje
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const centerX = rect.left + scrollLeft + (rect.width / 2) - 10;

    floatEl.style.left = `${centerX}px`;
    floatEl.style.top = `${rect.top + scrollTop - 20}px`;

    document.body.appendChild(floatEl);

    setTimeout(() => {
      if (floatEl.parentNode) floatEl.parentNode.removeChild(floatEl);
    }, 1600);
  }
}

export default CharacterSlide;
