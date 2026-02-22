/**
 * Digitális Kultúra Verseny - Fő alkalmazás belépési pont
 * 
 * Ez a fájl inicializálja az alkalmazást, beállítja a SEL architektúra
 * komponenseket és elindítja a Hub navigációt.
 */

import GameStateManager from './core/state/GameStateManager.js';
import EventBus from './core/events/EventBus.js';
import GameLogger from './core/logging/GameLogger.js';
import Hub from './features/navigation/Hub.js';
import TimeManager from './core/time/TimeManager.js';
import TimerDisplay from './ui/components/TimerDisplay.js';
import MockApiService from './core/api/MockApiService.js';
import SlideManager from './core/engine/SlideManager.js';
import VideoSlide from './ui/components/VideoSlide.js';
import TaskSlide from './ui/components/TaskSlide.js';
import WelcomeSlide from './ui/components/WelcomeSlide.js';
import RegistrationSlide from './ui/components/RegistrationSlide.js';
import CharacterSlide from './ui/components/CharacterSlide.js';
import StorySlide from './ui/components/StorySlide.js';
import GameInterface from './ui/components/GameInterface.js';
import { SLIDE_TYPES } from './core/engine/slides-config.js';
import './ui/styles/design-system.css';

// Debug System (csak DEV módban töltődik be)
let DebugManager = null;
let DebugPanel = null;
if (__DEV__) {
  DebugManager = (await import('./core/debug/DebugManager.js')).default;
  DebugPanel = (await import('./core/debug/DebugPanel.js')).default;
  await import('./ui/styles/debug.css');
}

/**
 * Alkalmazás osztály
 */
class DigitalKulturaVerseny {
  constructor() {
    this.stateManager = null;
    this.eventBus = null;
    this.logger = null;
    this.timeManager = null;
    this.apiService = null; // API Service
    this.timerDisplay = null;
    this.hub = null;
    this.isInitialized = false;
    this.currentAudio = null; // Track current audio playback
    this.playedAudioSlides = new Set();
    this.backgroundMusic = null; // Track background music
    this.musicVolume = 0.5;
    this.narrationVolume = 1.0;
    this.sfxVolume = 0.2; // Default SFX (click) volume

    // App Shell Layers
    this.layerBackground = null;
    this.layerContent = null;
    this.layerUI = null;
    this.activeGameInterface = null;
    this.currentSlideComponent = null;

    // Debug System
    this.debugManager = null;
    this.debugPanel = null;
    this.debugBadge = null;
  }

  /**
   * Alkalmazás inicializálása
   */
  async init() {
    try {
      // Loading screen megjelenítése
      this.showLoadingScreen();

      // App Shell felépítése (Perzisztens rétegek)
      this.setupAppShell();

      // Core komponensek inicializálása
      await this.initCoreComponents();

      // API Session indítása (Silent login)
      if (this.apiService) {
        try {
          await this.apiService.initSession('student_guest_01');
        } catch (err) {
          console.warn('Offline mode or API error:', err.message);
        }
      }

      // UI komponensek inicializálása
      await this.initUIComponents();

      // Hub inicializálása
      await this.initHub();

      // Event listeners beállítása
      this.setupEventListeners();

      // State betöltése
      await this.loadState();

      // Loading screen elrejtése
      this.hideLoadingScreen();

      // Hub megjelenítése
      this.showHub();

      this.isInitialized = true;

      if (this.logger) {
        this.logger.info('Application initialized successfully');
      }

    } catch (error) {
      console.error('Application initialization failed:', error);
      this.showError(error);
    }
  }

  /**
   * Core komponensek inicializálása
   */
  async initCoreComponents() {
    // Logger inicializálása
    this.logger = new GameLogger({
      level: __DEV__ ? 'DEBUG' : 'INFO',
      enableConsole: true,
      enableStorage: true
    });

    // EventBus inicializálása
    this.eventBus = new EventBus();
    this.eventBus.setLogger(this.logger);

    // State Manager inicializálása
    this.stateManager = new GameStateManager();
    this.stateManager.setEventBus(this.eventBus);
    this.stateManager.setLogger(this.logger);

    // TimeManager inicializálása
    this.timeManager = new TimeManager({
      eventBus: this.eventBus,
      logger: this.logger,
      stateManager: this.stateManager // Hozzáadva a mentéshez
    });

    // API Service inicializálása
    this.apiService = new MockApiService({
      logger: this.logger
    });

    // SlideManager inicializálása
    this.slideManager = new SlideManager({
      stateManager: this.stateManager,
      eventBus: this.eventBus,
      logger: this.logger
    });

    // Middleware hozzáadása EventBus-hez
    this.eventBus.use((eventData) => {
      if (this.logger) {
        this.logger.debug('Event processed', {
          event: eventData.event,
          source: eventData.source
        });
      }
      return eventData;
    });

    // Debug Manager inicializálása (csak DEV módban)
    if (__DEV__ && DebugManager) {
      this.debugManager = new DebugManager({
        slideManager: this.slideManager,
        stateManager: this.stateManager,
        timeManager: this.timeManager,
        logger: this.logger
      });
      if (this.logger) {
        this.logger.info('[DEBUG] DebugManager initialized');
      }
    }

    if (this.logger) {
      this.logger.info('Core components initialized');
    }
  }

  /**
   * App Shell (Rétegek) inicializálása
   */
  setupAppShell() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = ''; // Tiszta alap

    // CLEANUP: Mivel a DOM törlődött, a JS referenciákat is el kell dobni!
    this.activeGameInterface = null;
    this.currentSlideComponent = null;

    // 1. Background Layer (z-index: 0)
    this.layerBackground = document.createElement('div');
    this.layerBackground.id = 'dkv-layer-background';
    Object.assign(this.layerBackground.style, {
      position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '0'
    });

    // 2. Content Layer (z-index: 100)
    this.layerContent = document.createElement('div');
    this.layerContent.id = 'dkv-layer-content';
    Object.assign(this.layerContent.style, {
      position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '100', pointerEvents: 'auto'
    });

    // 3. UI Layer (z-index: 1000)
    this.layerUI = document.createElement('div');
    this.layerUI.id = 'dkv-layer-ui';
    // Stílust a belekerülő GameInterface adja majd, de alapból áteresztő
    Object.assign(this.layerUI.style, {
      position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '1000', pointerEvents: 'none'
    });

    app.appendChild(this.layerBackground);
    app.appendChild(this.layerContent);
    app.appendChild(this.layerUI);
  }

  /**
   * UI komponensek inicializálása
   */
  async initUIComponents() {
    this.timerDisplay = new TimerDisplay({
      timeManager: this.timeManager,
      eventBus: this.eventBus,
      parentElement: this.app
    });
  }

  /**
   * Hub inicializálása
   */
  async initHub() {
    this.hub = new Hub({
      stateManager: this.stateManager,
      eventBus: this.eventBus,
      logger: this.logger,
      onGradeSelect: (grade) => this.handleGradeSelect(grade),
      onContinueGame: () => this.handleContinueGame()
    });

    if (this.logger) {
      this.logger.info('Hub initialized');
    }
  }

  /**
   * Eseménykezelők beállítása
   */
  setupEventListeners() {
    // NOTE: Click/Hover SFX is handled by initSFX() - Web Audio preloaded sounds below

    // State change események
    this.stateManager.addListener('state:updated', (data) => {
      if (this.logger) {
        this.logger.debug('State updated', data);
      }
    });

    // EventBus események
    this.eventBus.on('hub:grade-selected', (data) => {
      if (this.logger) {
        this.logger.info('Grade selected from hub', data);
      }
    });

    // Window események
    window.addEventListener('beforeunload', () => {
      this.handleBeforeUnload();
    });

    window.addEventListener('error', (event) => {
      this.handleGlobalError(event);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleUnhandledRejection(event);
    });

    // SFX rendszer inicializálása
    this.initSFX();

    // Debug Panel aktiválás (Ctrl+Shift+D, csak DEV)
    if (__DEV__ && this.debugManager && DebugPanel) {
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
          e.preventDefault();
          this.openDebugPanel();
        }
      });
      if (this.logger) {
        this.logger.info('[DEBUG] Debug Panel hotkey registered (Ctrl+Shift+D)');
      }
    }

    if (this.logger) {
      this.logger.info('Event listeners setup completed');
    }
  }

  /**
   * Hangeffektek (Hover/Click) inicializálása
   */
  /**
   * Hangeffektek (Hover/Click) inicializálása Web Audio API-val (Zero Latency)
   */
  async initSFX() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();

      this.sfxBuffers = {};

      const loadSound = async (key, url) => {
        try {
          const response = await fetch(url);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
          this.sfxBuffers[key] = audioBuffer;
        } catch (e) {
          console.warn(`Failed to load SFX: ${url}`, e);
        }
      };

      // Bufferek betöltése
      await Promise.all([
        loadSound('hover', 'assets/audio/sfx/hover.mp3'),
        loadSound('click', 'assets/audio/sfx/click.mp3')
      ]);

      // Helper a lejátszáshoz
      const playSound = (key, volume = 1.0) => {
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const buffer = this.sfxBuffers[key];
        if (!buffer) return;

        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        const gainNode = this.audioCtx.createGain();
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
        source.start(0);
      };

      let lastHovered = null;

      // Global Hover Listener
      document.body.addEventListener('mouseover', (e) => {
        const target = e.target.closest('button, a, .dkv-nav-arrow, .dkv-button, .dkv-btn, .dkv-card, .dkv-char-card, .clickable, input[type="range"]');
        if (target && target !== lastHovered) {
          lastHovered = target;
          if (!target.disabled && !target.classList.contains('disabled')) {
            playSound('hover', 0.2); // Fixed volume - hover should stay subtle
          }
        } else if (!target) {
          lastHovered = null;
        }
      });

      // Global Click Listener
      document.body.addEventListener('click', (e) => {
        const target = e.target.closest('button, a, .dkv-nav-arrow, .dkv-button, .dkv-btn, .dkv-card, .clickable, input[type="range"]');
        if (target && !target.disabled && !target.classList.contains('disabled')) {
          playSound('click', this.sfxVolume);
        }
      });

    } catch (err) {
      console.warn('Web Audio API not supported or failed', err);
    }
  }

  /**
   * State betöltése
   */
  async loadState() {
    try {
      const loaded = this.stateManager.loadState();
      if (loaded && this.logger) {
        this.logger.info('State loaded from storage');
      } else if (this.logger) {
        this.logger.info('No saved state found, using initial state');
      }
    } catch (error) {
      if (this.logger) {
        this.logger.error('Failed to load state', { error: error.message });
      }
    }
  }

  /**
   * Évfolyam választás kezelése
   */
  async handleGradeSelect(grade) {
    if (this.logger) {
      this.logger.info('Grade selected', { grade });
    }

    // State frissítése (Reseteljük a session adatokat)
    this.stateManager.updateState({
      currentGrade: grade,
      gamePhase: 'grade-select',
      score: 0,
      userProfile: null,
      avatar: null
    });

    // Reset played audios
    if (this.playedAudioSlides) this.playedAudioSlides.clear();

    // Stop background music if playing (New Game)
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic = null;
    }

    // Verseny időzítő indítása - KIVÉVE! A WelcomeSlide indítja majd.
    // if (this.timeManager) {
    //   this.timeManager.startCompetition();
    // }

    // Story Engine indítása
    if (this.slideManager) {
      const firstSlide = await this.slideManager.initForGrade(grade);
      if (this.logger) {
        this.logger.info('Story Engine started', { firstSlide });
      }

      // Debug Manager inicializálás grade-hez (csak DEV)
      if (__DEV__ && this.debugManager) {
        this.debugManager.initForGrade(grade, this.slideManager.slides);
        this.createDebugBadge(); // Visual indicator
        this.updateDebugBadge();
      }

      // Hub eltüntetése
      if (this.hub) {
        this.hub.destroy();
      }

      this.renderSlide(firstSlide);
    }
  }

  /**
   * Játék folytatása kezelése
   */
  handleContinueGame() {
    if (this.logger) {
      this.logger.info('Continue game requested');
    }

    const currentGrade = this.stateManager.getStateValue('currentGrade');
    if (currentGrade) {
      this.handleGradeSelect(currentGrade);
    } else {
      // Ha nincs mentett játék, a Hub-ot mutatjuk
      this.showHub();
    }
  }

  /**
   * Slide megjelenítése
   */
  /**
   * Slide megjelenítése (App Shell Architecture)
   * 
   * @param {Object} slide - Slide objektum
   * @param {number} skipDepth - Recursion depth tracking (infinite loop protection)
   * @param {string} direction - Skip direction: 'forward' or 'backward' (default: 'forward')
   */
  renderSlide(slide, skipDepth = 0, direction = 'forward') {
    if (!slide) return;

    const MAX_SKIP_DEPTH = 50; // Safety limit

    // === DEBUG SKIP CHECK (PHASE 4.2 - BIDIRECTIONAL) ===
    // FONTOS: Ne a currentIndex-et használjuk, mert az már módosult a prev/nextSlide() hívással!
    // Helyette a slide objektumból keressük meg az indexet.
    const slideIndex = this.slideManager.slides.findIndex(s => s.id === slide.id);

    if (this.debugManager && slideIndex !== -1 && this.debugManager.shouldSkipSlide(slideIndex)) {
      console.log(`[DEBUG] Skipping slide ${slide.id} (index=${slideIndex}, depth=${skipDepth}, direction=${direction}, title="${slide.title}")`);

      // Depth limit check (infinite loop protection)
      if (skipDepth > MAX_SKIP_DEPTH) {
        console.error('[DEBUG] Max skip depth reached! Disabling debug mode for safety.');
        this.debugManager.disable();
        // Continue with normal render (fallback)
      } else {
        // Onboarding skip → Apply dummy data (csak forward irányban)
        if (direction === 'forward' && slide.metadata?.section === 'onboarding' && !this.stateManager.getStateValue('userProfile')) {
          this.debugManager.applyDummyData();
          console.log('[DEBUG] Onboarding skipped, dummy data applied');
        }

        // Skip to next/prev slide (bidirectional)
        const targetSlide = direction === 'forward'
          ? this.slideManager.nextSlide()
          : this.slideManager.prevSlide();

        if (targetSlide) {
          this.renderSlide(targetSlide, skipDepth + 1, direction); // +1 depth, preserve direction
          return; // EARLY EXIT - nem folytatjuk a renderelést
        } else {
          // Nincs több slide ebben az irányban
          // NE rendereljük az aktuálisat, ha az is skip-elve van!
          // Csak logoljuk és visszatérünk (skip chain vége)
          console.warn(`[DEBUG] No more slides to skip to (${direction}), ending skip chain at index=${slideIndex}`);
          return; // EARLY EXIT - ne rendereljük a skip-elt slide-ot
        }
      }
    }

    // --- Audio Cleanup (Silent skip - no audio leak) ---
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    // --- App Shell Check ---
    // Javítás: Ellenőrizzük, hogy a rétegek a DOM-ban vannak-e (.isConnected).
    // A Hub megjelenítése (showHub) törölheti őket az app.innerHTML = '' hívással.
    if (!this.layerContent || !this.layerUI || !this.layerContent.isConnected || !this.layerUI.isConnected) {
      console.warn('App Shell detached or missing, rebuilding...');
      this.setupAppShell();
    }

    // --- Grade Scope ---
    const currentGrade = this.stateManager ? this.stateManager.getStateValue('currentGrade') : null;
    const gradeClass = currentGrade ? `dkv-grade-${currentGrade}` : '';

    if (gradeClass) {
      document.body.className = '';
      document.body.classList.add(gradeClass);
    }

    // --- Slide Type Logic ---
    const isFullscreen = [
      SLIDE_TYPES.WELCOME,
      SLIDE_TYPES.REGISTRATION,
      SLIDE_TYPES.CHARACTER
    ].includes(slide.type);

    // --- Background Music Logic ---
    const totalSlides = this.slideManager.slides.length;
    const currentIndex = this.slideManager.currentIndex;

    if (!isFullscreen && !this.backgroundMusic) {
      if (currentIndex < totalSlides - 1 && currentGrade) {
        this.playBackgroundMusic(currentGrade);
      }
    } else if (isFullscreen && this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic = null;
    } else if (currentIndex === totalSlides - 1 && this.backgroundMusic) {
      this.stopBackgroundMusicWithFade();
    }

    // --- Component Creation & Rendering (Protected) ---
    try {
      let newComponent = null;
      const commonOptions = {
        stateManager: this.stateManager,
        timeManager: this.timeManager,
        apiService: this.apiService,
        onNext: () => this.handleNext(),
        onPrev: () => this.handlePrev(),
        onComplete: () => this.slideManager.completeCurrentSlide()
      };

      switch (slide.type) {
        case SLIDE_TYPES.WELCOME:
          newComponent = new WelcomeSlide(slide, commonOptions);
          break;
        case SLIDE_TYPES.REGISTRATION:
          newComponent = new RegistrationSlide(slide, commonOptions);
          break;
        case SLIDE_TYPES.CHARACTER:
          newComponent = new CharacterSlide(slide, commonOptions);
          break;
        case SLIDE_TYPES.STORY:
          newComponent = new StorySlide(slide, commonOptions);
          break;
        case SLIDE_TYPES.VIDEO:
        case SLIDE_TYPES.REWARD:
          newComponent = new VideoSlide(slide, commonOptions);
          break;
        case SLIDE_TYPES.TASK:
          newComponent = new TaskSlide(slide, commonOptions);
          break;
        default:
          console.warn('Unknown slide type:', slide.type);
          newComponent = new VideoSlide(slide, commonOptions);
      }

      // --- RENDER STRATEGY (Non-Destructive) ---

      // 1. Cleanup Old Content (Content Layer Only)
      if (this.currentSlideComponent) {
        if (typeof this.currentSlideComponent.destroy === 'function') {
          this.currentSlideComponent.destroy();
        }
        this.currentSlideComponent = null;
      }
      this.layerContent.innerHTML = '';

      // 2. Render New Content
      if (newComponent) {
        const el = newComponent.createElement();

        if (isFullscreen && slide.content && slide.content.backgroundUrl) {
          // Fullscreen Wrapper for Backgrounds
          const wrapper = document.createElement('div');
          wrapper.className = 'dkv-slide-wrapper';
          if (gradeClass) wrapper.classList.add(gradeClass);
          wrapper.style.backgroundImage = `url('${slide.content.backgroundUrl}')`;
          wrapper.style.backgroundSize = 'cover';
          wrapper.style.backgroundPosition = 'center';
          wrapper.appendChild(el);
          this.layerContent.appendChild(wrapper);
        } else {
          // Standard Rendering
          this.layerContent.appendChild(el);
        }
        this.currentSlideComponent = newComponent;
      }

      // 3. UI Layer Management (Persistent GameInterface)
      if (!isFullscreen) {
        // JÁTÉK FÁZIS: Mutasd a HUD-ot
        if (!this.activeGameInterface) {
          // Ha nincs, hozd létre (Perzisztens)
          this.activeGameInterface = new GameInterface({
            onNext: () => this.handleNext(),
            onPrev: () => this.handlePrev(),
            onOpenSettings: () => this.activeGameInterface.toggleSettings(),
            onOpenJournal: () => this.activeGameInterface.toggleJournal(),
            onOpenNarrator: () => this.activeGameInterface.toggleNarrator(),
            onMusicVolumeChange: (v) => this.setMusicVolume(v),
            onNarrationVolumeChange: (v) => this.setNarrationVolume(v),
            onSfxVolumeChange: (v) => this.setSfxVolume(v),
            musicVolume: this.musicVolume,
            narrationVolume: this.narrationVolume,
            sfxVolume: this.sfxVolume,
            stateManager: this.stateManager,
            totalSlides: totalSlides - 1  // Exclude Welcome slide - GameInterface adds +1 offset, need base of 29 for 100%
          });
          const uiEl = this.activeGameInterface.createElement();
          if (gradeClass) uiEl.classList.add(gradeClass);
          this.layerUI.appendChild(uiEl);
        }

        this.layerUI.style.display = 'block';

        // Frissítések
        this.activeGameInterface.updateHUD(this.stateManager.getState());
        this.activeGameInterface.updateTimeline(currentIndex + 1); // Convert 0-based to 1-based

        const narrationText = (slide.content && slide.content.narration) || slide.description || "Nincs elérhető történet ehhez a diához.";
        this.activeGameInterface.setNarration(narrationText);

      } else {
        // FULLSCREEN FÁZIS: Rejtsd el a HUD-ot
        this.layerUI.style.display = 'none';
      }
    } catch (renderError) {
      console.error("CRITICAL RENDER ERROR:", renderError);
      // Fallback: Ha a UI létezik, próbáljuk megmutatni a hibaüzenetet benne, vagy alert
      alert("Hiba történt a megjelenítéskor: " + renderError.message + ". Próbáld frissíteni az oldalt.");
    }

    // 4. Audio & Buttons
    const audioSrc = slide.content ? slide.content.audioSrc : null;
    const isLastSlide = (currentIndex >= totalSlides - 1);

    // Helper to set button state in whichever interface is active
    const setBtnState = (enabled, extraOptions = {}) => {
      if (!isFullscreen && this.activeGameInterface) {
        this.activeGameInterface.setNextButtonState(enabled, extraOptions);
      } else if (isFullscreen && this.currentSlideComponent && this.currentSlideComponent.setNextButtonState) {
        this.currentSlideComponent.setNextButtonState(enabled);
      }
    };

    if (audioSrc) {
      const alreadyPlayed = this.playedAudioSlides && this.playedAudioSlides.has(slide.id);
      const isTaskSlide = slide.metadata && slide.metadata.step === 2;

      // Alapértelmezett gomb állapot
      const btnOptions = isTaskSlide ? { suppressOrange: true } : {};
      const enableButton = !isLastSlide && alreadyPlayed;
      setBtnState(enableButton, btnOptions);

      this.playAudio(audioSrc, () => {
        if (isLastSlide) {
          if (this.playedAudioSlides) this.playedAudioSlides.add(slide.id);
          return;
        }

        // Feladat slide esetén automatikusan megnyitjuk a modalt
        if (isTaskSlide && this.activeGameInterface) {
          const taskContent = slide.description || "Hajtsd végre a feladatot a továbblépéshez!";
          this.activeGameInterface.showTaskModal(taskContent, () => {
            this.handleNext();
          });
        }

        setBtnState(true, btnOptions);
        if (this.playedAudioSlides) this.playedAudioSlides.add(slide.id);
      });
    } else {
      const isTaskSlide = slide.metadata && slide.metadata.step === 2;
      const btnOptions = isTaskSlide ? { suppressOrange: true } : {};
      const shouldEnable = !isLastSlide;
      setBtnState(shouldEnable, btnOptions);

      // Ha nincs hang, de feladat, akkor is megjeleníthetjük (opcionális késleltetéssel)
      if (isTaskSlide && this.activeGameInterface) {
        setTimeout(() => {
          const taskContent = slide.description || "Hajtsd végre a feladatot a továbblépéshez!";
          this.activeGameInterface.showTaskModal(taskContent, () => {
            this.handleNext();
          });
        }, 1000);
      }
    }

    // 5. Preloading
    this.preloadNextSlide(currentIndex);
  }

  // --- SAFE NAVIGATION HANDLERS ---

  async handleNext() {
    await this.ensureAudioFeedback();
    const next = this.slideManager.nextSlide();
    if (next) this.renderSlide(next, 0, 'forward'); // Direction: forward (explicit)
  }

  async handlePrev() {
    await this.ensureAudioFeedback();
    const prev = this.slideManager.prevSlide();
    if (prev) this.renderSlide(prev, 0, 'backward'); // Direction: backward
  }

  async ensureAudioFeedback() {
    // Növelt biztonsági késleltetés (100ms), hogy a hang biztosan elinduljon
    return new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Loading screen megjelenítése
   */
  showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'flex';
    }
  }

  /**
   * Loading screen elrejtése
   */
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 300);
    }
  }

  /**
   * Hub megjelenítése
   */
  showHub() {
    const app = document.getElementById('app');
    if (app && this.hub) {
      app.innerHTML = '';
      app.appendChild(this.hub.getElement());
      this.hub.show();
    }
  }

  /**
   * Hiba megjelenítése
   */
  showError(error) {
    const errorBoundary = document.getElementById('error-boundary');
    const loadingScreen = document.getElementById('loading-screen');

    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }

    if (errorBoundary) {
      errorBoundary.style.display = 'flex';
      const errorMessage = errorBoundary.querySelector('.dkv-error-message');
      if (errorMessage) {
        errorMessage.textContent = error.message || 'Ismeretlen hiba történt';
      }
    }

    if (this.logger) {
      this.logger.error('Application error', {
        error: error.message,
        stack: error.stack
      });
    }
  }

  /**
   * Before unload esemény kezelése
   */
  handleBeforeUnload() {
    if (this.stateManager) {
      this.stateManager.saveState();
    }
  }

  /**
   * Globális hiba kezelése
   */
  handleGlobalError(event) {
    if (this.logger) {
      this.logger.error('Global error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    }
  }

  /**
   * Kezeletlen Promise rejection kezelése
   */
  handleUnhandledRejection(event) {
    if (this.logger) {
      this.logger.error('Unhandled promise rejection', {
        reason: event.reason
      });
    }
  }

  /**
   * Alkalmazás megsemmisítése
   */
  destroy() {
    if (this.hub) {
      this.hub.destroy();
      this.hub = null;
    }

    if (this.stateManager) {
      this.stateManager.saveState();
      this.stateManager = null;
    }

    if (this.eventBus) {
      this.eventBus.reset();
      this.eventBus = null;
    }

    this.logger = null;
    this.isInitialized = false;
  }

  /**
   * Debug Panel megnyitása
   * (Ctrl+Shift+D hotkey)
   */
  openDebugPanel() {
    if (!this.debugManager || !DebugPanel) {
      console.warn('[DEBUG] Debug system not available');
      return;
    }

    if (!this.debugPanel) {
      this.debugPanel = new DebugPanel({
        debugManager: this.debugManager,
        onClose: () => {
          this.debugPanel = null;
          this.updateDebugBadge(); // Refresh badge
          this.updateDebugMusicState(); // Refresh music state
        }
      });
    }

    this.debugPanel.show();
  }

  /**
   * Debug Badge létrehozása (visual indicator)
   */
  createDebugBadge() {
    if (this.debugBadge) return; // Már létezik

    this.debugBadge = document.createElement('div');
    this.debugBadge.className = 'dkv-debug-badge';
    this.debugBadge.textContent = '🐛 DEBUG MODE';
    document.body.appendChild(this.debugBadge);

    if (this.logger) {
      this.logger.info('[DEBUG] Debug badge created');
    }
  }

  /**
   * Debug Badge frissítése (enabled/disabled)
   */
  updateDebugBadge() {
    if (!this.debugBadge || !this.debugManager) return;

    const isActive = this.debugManager.skipConfig.enabled;
    this.debugBadge.classList.toggle('active', isActive);

    if (this.logger) {
      this.logger.debug('[DEBUG] Badge updated', { active: isActive });
    }
  }

  /**
   * Zene állapot frissítése Debug Config alapján
   * (Panel bezárásakor hívódik)
   */
  updateDebugMusicState() {
    if (!this.debugManager) return;

    if (this.debugManager.shouldMuteMusic()) {
      if (this.backgroundMusic) {
        console.log('[DEBUG] Stopping background music (Muted)');
        this.stopBackgroundMusicWithFade();
      }
    } else {
      if (!this.backgroundMusic && this.stateManager) {
        // Ha nincs zene, de kéne, indítsuk el (ha van aktív grade)
        const currentGrade = this.stateManager.getStateValue('currentGrade');
        if (currentGrade) {
          console.log('[DEBUG] Restarting background music (Unmuted)');
          this.playBackgroundMusic(currentGrade);
        }
      }
    }
  }

  /**
   * Intelligens előre-töltés a következő diához
   * @param {number} currentIndex 
   */
  preloadNextSlide(currentIndex) {
    if (!this.slideManager || !this.slideManager.slides) return;
    const nextSlide = this.slideManager.slides[currentIndex + 1];
    if (!nextSlide) return;

    // 1. Kép preload
    const content = nextSlide.content || {};
    const imgUrl = content.imageUrl || content.backgroundUrl;
    if (imgUrl) {
      const img = new Image();
      img.src = imgUrl;
    }

    // 2. Hang preload
    const audioSrc = content.audioSrc;
    if (audioSrc) {
      const audio = new Audio();
      audio.src = audioSrc;
      audio.preload = 'auto';
    }

    // 3. Videó preload
    const videoUrl = content.videoUrl;
    if (videoUrl) {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.preload = 'auto';
    }

    // 4. Karakter képek (ha van)
    if (content.characters) {
      Object.values(content.characters).forEach(group => {
        group.forEach(char => {
          if (char.card) new Image().src = char.card;
          if (char.zoom) new Image().src = char.zoom;
        });
      });
    }
  }

  /**
   * Debug információk lekérése
   */
  getDebugInfo() {
    return {
      initialized: this.isInitialized,
      stateManager: !!this.stateManager,
      eventBus: !!this.eventBus,
      logger: !!this.logger,
      hub: !!this.hub,
      state: this.stateManager ? this.stateManager.getState() : null,
      eventBusStats: this.eventBus ? this.eventBus.getStats() : null,
      loggerStats: this.logger ? this.logger.getStats() : null
    };
  }

  /**
   * Hang lejátszása
   * @param {string} src - Audio fájl elérési útja
   * @param {Function} onComplete - Callback a végén (vagy hiba esetén)
   */
  playAudio(src, onComplete) {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    // Elérési út javítása (public folder)
    // Ha relatív path, akkor feltételezzük, hogy a gyökérből indul
    const audio = new Audio(src);
    audio.volume = this.narrationVolume;
    this.currentAudio = audio;

    const handleEnd = () => {
      this.currentAudio = null;
      if (onComplete) onComplete();
    };

    audio.addEventListener('ended', handleEnd);

    // Hiba esetén is feloldunk (Fallback), hogy ne ragadjon be a játék
    audio.addEventListener('error', (e) => {
      console.warn(`Audio playback failed for: ${src}`, e);
      handleEnd();
    });

    // Autoplay Policy kezelése: Ha tiltva van, feloldunk
    // Módosítás: Megvárjuk a 'canplay' eseményt a 'play()' előtt a "leharapott" elejének javítására.
    audio.addEventListener('canplay', () => {
      if (this.currentAudio === audio) {
        audio.play().catch(err => {
          console.warn('Audio autoplay blocked or failed', err);
          handleEnd();
        });
      }
    }, { once: true });
  }

  /**
   * Háttérzene indítása
   * @param {string} grade - '3', '4', stb.
   */
  playBackgroundMusic(grade) {
    // Debug Mute Check
    if (this.debugManager && this.debugManager.shouldMuteMusic()) {
      console.log('[DEBUG] Background music muted by config');
      return;
    }

    if (this.backgroundMusic) return;
    try {
      const src = `assets/audio/grade${grade}/default_bg.mp3`;
      this.backgroundMusic = new Audio(src);
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = this.musicVolume;
      this.backgroundMusic.play().catch(e => {
        console.warn("Background music autoplay blocked", e);
        this.backgroundMusic = null;
      });
    } catch (err) {
      console.warn("Error starting background music", err);
    }
  }

  /**
   * Háttérzene leállítása fade-out effekttel (3mp)
   */
  stopBackgroundMusicWithFade() {
    if (!this.backgroundMusic) return;

    const audio = this.backgroundMusic;
    this.backgroundMusic = null; // Referencia törlése azonnal

    const duration = 3000; // 3 sec
    const steps = 30;
    const intervalTime = duration / steps;
    const volStep = audio.volume / steps;

    const fadeInterval = setInterval(() => {
      if (audio.volume > volStep) {
        audio.volume -= volStep;
      } else {
        audio.volume = 0;
        audio.pause();
        clearInterval(fadeInterval);
        audio.currentTime = 0;
      }
    }, intervalTime);
  }

  setMusicVolume(vol) {
    this.musicVolume = vol;
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = vol;
    }
  }

  setNarrationVolume(vol) {
    this.narrationVolume = vol;
    if (this.currentAudio) {
      this.currentAudio.volume = vol;
    }
  }

  setSfxVolume(vol) {
    this.sfxVolume = vol;
    // SFX volume affects future playSound calls, no need to update existing sounds
  }

  /**
 * Rendszerhangok (pl. kattintás) azonnali generálása Web Audio API-val
 */
  playSystemSound(type) {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(() => { });
      }

      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.1);
      }
    } catch (e) {
      console.warn('System sound error', e);
    }
  }
}

/**
 * Alkalmazás indítása
 */
async function startApp() {
  // Globális app instance
  window.DKV_APP = new DigitalKulturaVerseny();

  // Inicializálás
  await window.DKV_APP.init();

  // Debug információk elérhetővé tétele
  if (__DEV__) {
    window.DKV_DEBUG = () => console.log(window.DKV_APP.getDebugInfo());
  }
}

// DOM betöltődése után indítjuk az alkalmazást
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}

// Exportálás modulok számára
export default DigitalKulturaVerseny;