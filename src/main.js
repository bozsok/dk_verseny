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
import SummarySlide from './ui/components/SummarySlide.js';
import GameInterface from './ui/components/GameInterface.js';
import { GameInterfaceGrade4 } from './ui/components/GameInterfaceGrade4.js';
import { PortalTransition } from './ui/components/PortalTransition.js';
import { GlitchTransition } from './ui/components/GlitchTransition.js';
import KeyCollectionAnimation from './ui/components/KeyCollectionAnimation.js';
import { ScriptPartAnimation } from './ui/components/ScriptPartAnimation.js';
import { CountdownAnimation } from './ui/components/CountdownAnimation.js';
import TutorialManager from './features/tutorial/TutorialManager.js';
import { SLIDE_TYPES } from './core/engine/slides-config.js';
import './ui/styles/design-system.css';
import './ui/styles/Tutorial.css';
import './ui/styles/Portal.css';
import './ui/styles/Glitch.css';
import './ui/styles/Summary.css';
import './ui/styles/Transitions.css';

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
    this.buildConfig = null; // build-config.json tartalma (DEV és PROD módban egyaránt)

    // Tutorial System
    this.tutorialManager = new TutorialManager(this);
    this.tutorialCompletedInSession = false;

    // Leaderboard Tracking
    this.leaderboardId = null;
    this.isSaving = false;
    this.taskResults = []; // Feladatonkénti részletes eredmény a dashboardhoz
    
    // Életciklus-kezelés: Aktív tranzíciók és időzítők követése
    this.currentGlitchTransition = null;
    this.currentCountdownAnimation = null;
    this._activeTimers = new Set();
    this._isDestroyed = false;
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
          if (this.logger) this.logger.warn('Offline mode or API error:', { error: err.message });
        }
      }

      // Betűtípusok betöltése (FOUIF megelőzése)
      await this.loadCriticalFonts();

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
      if (this.logger) this.logger.error('Application initialization failed:', { error: error.message, stack: error.stack });
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

    // Build config betöltése (DEV és PROD módban egyaránt)
    await this._loadBuildConfig();

    if (this.logger) {
      this.logger.info('Core components initialized');
    }
  }

  /**
   * Kritikus betűtípusok betöltése a FOUIF elkerülése érdekében.
   * Szabványos DKV aszinkron boilerplate (Rule 39).
   */
  async loadCriticalFonts() {
    try {
      if (this.logger) this.logger.info('Betűtípusok betöltése folyamatban...');

      // A Material Symbols Outlined az elsődleges FOUIF forrás
      // Google Fonts ?display=swap nélkül vagy document.fonts API-val kezelve
      if (document.fonts && document.fonts.load) {
        // Megvárjuk a konkrét ikonkészletet
        await document.fonts.load('1em "Material Symbols Outlined"');
        // Megvárjuk az összes többi készenlétet is (Inter, Orbitron, stb.)
        await document.fonts.ready;
      }
    } catch (error) {
      if (this.logger) {
        this.logger.error('Sikertelen betűtípus betöltés:', { error: error.message });
      }
    }
  }

  /**
   * Build config betöltése a public/build-config.json fájlból.
   * Fejlesztői módban: debugManager localStorage-a van előnyben.
   * Éles szerveren: ez az egyetlen forrás.
   */
  async _loadBuildConfig() {
    try {
      const response = await fetch('./build-config.json', { signal: AbortSignal.timeout(3000) });
      if (response.ok) {
        const config = await response.json();
        this.buildConfig = config;
        // DEV módban: a debugManager localStorage-os konfigja felülírja
        if (this.debugManager) {
          const lsConfig = this.debugManager.skipConfig;
          if (lsConfig && lsConfig.enabled !== undefined) {
            // localStorage-ban van konfig -> az a mérvadó
            return;
          }
          // Különben: build-config átkerül a debugManager-be is
          this.debugManager.skipConfig = config;
          this.debugManager.isEnabled = config.enabled || false;
          this.debugManager.tasksConfig = Object.assign(
            { mazeTimeLimit: 600, mazeDifficulty: 16 },
            config.tasksConfig || {}
          );
        }
        if (this.logger) {
          this.logger.info('[App] build-config.json betöltve', config);
        }
      }
    } catch {
      // Ha nem érhető el, halógatjuk (alapértelmezettekkel működik)
    }
  }

  /**
   * Éles szerveren: eldönti, hogy egy dia kihagyandó-e a buildConfig alapján.
   * Ez a debugManager.shouldSkipSlide() production megfelelője.
   * @param {Object} slide
   * @param {number} slideIndex
   * @returns {boolean}
   */
  _prodShouldSkipSlide(slide, slideIndex) {
    const cfg = this.buildConfig;
    if (!cfg || !cfg.enabled) return false;

    // Individual slide skip - ID-alapú (shuffle-safe), fallback indexre
    // FONTOS: skipSlides string ID-kat tartalmaz (pl. "st1_s1"), nem numerikus indexet!
    if (cfg.skipSlides && cfg.skipSlides.length > 0) {
      if (slide.id && cfg.skipSlides.includes(slide.id)) return true;
      if (!slide.id && cfg.skipSlides.includes(slideIndex)) return true;
    }

    // Szekció skip - metadata.section alapján
    if (cfg.skipSections && slide.metadata?.section) {
      if (cfg.skipSections.includes(slide.metadata.section)) return true;
    }

    return false;
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
      position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '0', backgroundColor: '#000'
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
      position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '2500', pointerEvents: 'none'
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
  initHub() {
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
          if (this.logger) this.logger.warn(`Failed to load SFX: ${url}`, { error: e.message });
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
      if (this.logger) this.logger.warn('Web Audio API not supported or failed', { error: err.message });
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

    // State frissítése (Reseteljük a session ÉS a progress adatokat új játék esetén)
    this.stateManager.updateState({
      currentGrade: grade,
      gamePhase: 'grade-select',
      score: 0,
      userProfile: null,
      avatar: null,
      progress: {
        completedLevels: [],
        completedSlides: [],
        inventory: [],
        totalScore: 0,
        timeSpent: 0,
        achievements: []
      }
    });

    // Verseny időzítő alaphelyzetbe állítása minden új játék előtt
    if (this.timeManager) {
      this.timeManager.reset();
    }

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
        this.hub = null;
      }

      // Aktív interfész (HUD, Panels) megsemmisítése évfolyamváltáskor
      if (this.activeGameInterface) {
        if (typeof this.activeGameInterface.destroy === 'function') {
          this.activeGameInterface.destroy();
        }
        this.activeGameInterface = null;
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
  renderSlide(slide, skipDepth = 0, direction = 'forward', prebuiltComponent = null, prebuiltDOM = null) {
    if (!slide) return;

    // --- Változók inicializálása a függvény elején (Standard SEL mintát követve) ---
    const slides = this.slideManager.slides;
    const totalSlides = slides.length;
    const slideIndex = slides.findIndex(s => s.id === slide.id);
    // Ha a slide nem található a listában (pl. dinamikus), a manager aktuális indexét használjuk
    const currentIndex = slideIndex !== -1 ? slideIndex : this.slideManager.currentIndex;
    const isLastSlide = (currentIndex >= totalSlides - 1);
    const audioSrc = slide.content ? slide.content.audioSrc : null;

    const MAX_SKIP_DEPTH = 50; // Safety limit

    // === SKIP CHECK (DEV: debugManager, PROD: buildConfig) ===
    const shouldSkip = slideIndex !== -1 && (
      this.debugManager
        ? this.debugManager.shouldSkipSlide(slideIndex)
        : (this.buildConfig?.enabled && this._prodShouldSkipSlide(slide, slideIndex))
    );

    if (shouldSkip) {
      if (this.logger) this.logger.info(`[Skip] Skipping slide ${slide.id} (index=${slideIndex}, depth=${skipDepth}, direction=${direction})`);

      if (skipDepth > MAX_SKIP_DEPTH) {
        if (this.logger) this.logger.error('[Skip] Max skip depth reached!');
        if (this.debugManager) this.debugManager.disable();
        // Tovább a normál renderelőssel (fallback)
      } else {
        // --- GRAUNLÁRIS ATOMI SZIMULÁCIÓ (PONTOK, KULCSOK, IDŐ) ---
        if (direction === 'forward') {
          if (this.debugManager) {
            // Fejlesztői módban az intelligens szimulátort használjuk
            this.debugManager.handleSlideSkip(slide);
          } else if (this.buildConfig?.enabled) {
            // PROD skip fallback (alapszintű szimuláció ha a debugManager nincs jelen)
            if (slide.metadata?.section === 'onboarding' && !this.stateManager.getStateValue('userProfile')) {
              this.stateManager?.updateState({
                userProfile: { name: 'Tanuló', nickname: 'Player', classId: '4.a' },
                characterSelected: true
              });
            }
            if (slide.metadata?.section?.startsWith('station_')) {
              const stId = slide.metadata.section;
              if (this.stateManager && !this.stateManager.hasKey(stId)) {
                this.stateManager.addKey(stId);
              }
            }
          }
        }

        const targetSlide = direction === 'forward'
          ? this.slideManager.nextSlide()
          : this.slideManager.prevSlide();

        if (targetSlide) {
          this.renderSlide(targetSlide, skipDepth + 1, direction);
          return;
        } else {
          if (this.logger) this.logger.warn(`[Skip] No more slides to skip to (${direction}), ending skip chain at index=${slideIndex}`);
          return;
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
    if (!this.layerContent || !this.layerUI || !this.layerContent.isConnected || !this.layerUI.isConnected) {
      if (this.logger) this.logger.warn('App Shell detached or missing, rebuilding...');
      this.setupAppShell();
    }

    // --- Grade Scope ---
    const currentGrade = this.stateManager ? this.stateManager.getStateValue('currentGrade') : null;
    const gradeClass = currentGrade ? `dkv-grade-${currentGrade}` : '';

    if (gradeClass) {
      document.body.className = '';
      document.body.classList.add(gradeClass);
    }

    // --- Beragadt Animációk és Időzítők Törlése ---
    if (this._keyAnimationTimer) {
      clearTimeout(this._keyAnimationTimer);
      this._keyAnimationTimer = null;
    }

    if (this.currentKeyAnimation) {
      if (typeof this.currentKeyAnimation.destroy === 'function') {
        this.currentKeyAnimation.destroy();
      } else if (this.currentKeyAnimation.container && this.currentKeyAnimation.container.parentNode) {
        this.currentKeyAnimation.container.parentNode.removeChild(this.currentKeyAnimation.container);
      }
      this.currentKeyAnimation = null;
    }

    if (this.currentCountdownAnimation) {
      if (typeof this.currentCountdownAnimation.destroy === 'function') {
        this.currentCountdownAnimation.destroy();
      }
      this.currentCountdownAnimation = null;
    }

    if (this.currentGlitchTransition) {
      if (typeof this.currentGlitchTransition.destroy === 'function') {
        this.currentGlitchTransition.destroy();
      }
      this.currentGlitchTransition = null;
    }

    // Összes egyéb aktív timer törlése
    if (this._activeTimers) {
      this._activeTimers.forEach(timer => clearTimeout(timer));
      this._activeTimers.clear();
    }

    // --- Slide Type Logic ---
    const isFullscreen = [
      SLIDE_TYPES.WELCOME,
      SLIDE_TYPES.REGISTRATION,
      SLIDE_TYPES.CHARACTER
    ].includes(slide.type);

    // --- Background Music Logic ---
    const isTutorialPending = !this.tutorialCompletedInSession && !isFullscreen;
    if (this.logger) this.logger.info(`[TUTORIAL-DEBUG] renderSlide - isActive: ${this.tutorialManager.isActive}, isPending: ${isTutorialPending}`);

    if (!isFullscreen && !this.backgroundMusic && !this.tutorialManager.isActive && !isTutorialPending) {
      if (currentIndex < totalSlides - 1 && currentGrade) {
        this.playBackgroundMusic(currentGrade);
      }
    } else if (isFullscreen && this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic = null;
    } else if (currentIndex === totalSlides - 1 && this.backgroundMusic) {
      this.stopBackgroundMusicWithFade();
    }

    // --- Component Creation & Rendering ---
    const useTransition = !prebuiltComponent && skipDepth === 0;

    const performRender = () => {
      try {
        let newComponent = prebuiltComponent;
        let newContent = prebuiltDOM;

        if (!newComponent || !newContent) {
          const { newComponent: instComponent } = this._instantiateSlideComponent(slide, false);
          newComponent = instComponent;
          newContent = this._createSlideDOMElement(newComponent, slide, isFullscreen, gradeClass);
        }

        // 1. Cleanup Old Content
        if (this.currentSlideComponent && this.currentSlideComponent !== newComponent) {
          if (typeof this.currentSlideComponent.destroy === 'function') {
            this.currentSlideComponent.destroy();
          }
          this.currentSlideComponent = null;
        }
        this.layerContent.innerHTML = '';

        // 2. Render New Content TO DOM
        if (newComponent && newContent) {
          if (slide.id === 'summary' && this.timeManager && this.timeManager.globalTimer.isRunning) {
            if (this.logger) this.logger.info('Summary slide reached, stopping timer...');
            this.timeManager.stopCompetition();
          }

          this.layerContent.appendChild(newContent);
          this.currentSlideComponent = newComponent;
        }
      } catch (renderError) {
        if (this.logger) this.logger.error("CRITICAL RENDER ERROR:", { error: renderError.message, stack: renderError.stack });
        alert("Hiba történt a megjelenítéskor: " + renderError.message);
      }
    };

    // --- TRANSITION EXECUTION ---
    if (useTransition && this.isInitialized) {
      if (document.startViewTransition) {
        // Modern View Transitions API (Cross-fade 0.6s definíció szerint a Transitions.css-ben)
        const transition = document.startViewTransition(() => {
          performRender();
          this._updateUIAfterRender(slide, currentIndex, totalSlides, isLastSlide, isFullscreen, currentGrade, gradeClass, audioSrc, isTutorialPending);
        });

        // Biztonsági hibakezelés: Elnyeljük az InvalidStateError-t, ha pl. névütközés miatt a böngésző megszakítaná az animációt.
        // Ilyenkor a rendszer automatikusan fallback módban (animáció nélkül) vált, ami jobb, mint a konzol hiba.
        if (transition && transition.finished) {
          transition.finished.catch(e => {
            if (this.logger) this.logger.warn("View Transition interrupted (fallback active)", { error: e.message });
          });
        }
      } else {
        // Fallback a régi (szekvenciális) módra ha a böngésző nem támogatja
        document.body.classList.add('dkv-slide-fade-out');
        setTimeout(() => {
          performRender();
          document.body.classList.remove('dkv-slide-fade-out');
          document.body.classList.add('dkv-slide-entering');
          setTimeout(() => {
            document.body.classList.remove('dkv-slide-entering');
          }, 300);
          this._updateUIAfterRender(slide, currentIndex, totalSlides, isLastSlide, isFullscreen, currentGrade, gradeClass, audioSrc, isTutorialPending);
        }, 300);
      }
      return;
    } else {
      performRender();
      this._updateUIAfterRender(slide, currentIndex, totalSlides, isLastSlide, isFullscreen, currentGrade, gradeClass, audioSrc, isTutorialPending);
    }
  }

  /**
   * UI elemek frissítése a dia renderelése után (segédfüggvény a transition támogatásához).
   */
  _updateUIAfterRender(slide, currentIndex, totalSlides, isLastSlide, isFullscreen, currentGrade, gradeClass, audioSrc, isTutorialPending) {
    try {

      // 3. UI Layer Management
      if (!isFullscreen) {
        const isGrade4 = (String(currentGrade) === '4');
        const ExpectedInterfaceClass = isGrade4 ? GameInterfaceGrade4 : GameInterface;

        // Ha van meglévő interfész, de nem a megfelelő típusú (pl. grade váltás miatt)
        if (this.activeGameInterface && !(this.activeGameInterface instanceof ExpectedInterfaceClass)) {
          if (typeof this.activeGameInterface.destroy === 'function') {
            this.activeGameInterface.destroy();
          }
          this.activeGameInterface = null;
        }

        if (!this.activeGameInterface) {
          const InterfaceClass = ExpectedInterfaceClass;

          this.activeGameInterface = new InterfaceClass({
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
            eventBus: this.eventBus,
            timeManager: this.timeManager,
            totalSlides: totalSlides - 1
          });
          const uiEl = this.activeGameInterface.createElement();
          if (gradeClass) uiEl.classList.add(gradeClass);
          this.layerUI.appendChild(uiEl);
        }

        this.layerUI.style.display = 'block';

        this.activeGameInterface.updateHUD(this.stateManager.getState());
        this.activeGameInterface.updateTimeline(currentIndex + 1, slide);
        this.activeGameInterface.setNextButtonFinal(isLastSlide);

        const narrationText = (slide.content && slide.content.narration) || slide.description || "Nincs elérhető történet ehhez a diához.";
        this.activeGameInterface.setNarration(narrationText);

        // --- GRADE 4 SPECIFIKUS: Háttérkép frissítése ---
        if (this.activeGameInterface.setBackgroundImage) {
          const bgImage = (slide.type === SLIDE_TYPES.STORY || slide.type === SLIDE_TYPES.VIDEO || slide.type === SLIDE_TYPES.TASK || slide.type === SLIDE_TYPES.INFO)
            ? (slide.content?.imageUrl || slide.content?.backgroundUrl || null)
            : null;
          this.activeGameInterface.setBackgroundImage(bgImage);
        }

        // --- ANIMÁCIÓ FÁZIS (Key vagy Script) ---
        const isStationEnd = slide.metadata?.step === 3 && slide.metadata?.section?.startsWith('station_');
        if (isStationEnd) {
          const stationId = slide.metadata.section;
          const hasItem = this.stateManager && this.stateManager.hasKey(stationId);

          if (!hasItem) {
            const currentGrade = this.stateManager ? this.stateManager.getStateValue('currentGrade') : null;
            const isGrade4 = String(currentGrade) === '4';

            if (isGrade4) {
              this.currentKeyAnimation = new ScriptPartAnimation({
                stationId: stationId,
                targetSlot: null,
                logger: this.logger
              });
            } else {
              this.currentKeyAnimation = new KeyCollectionAnimation({
                stationId: stationId,
                targetSlot: null
              });
            }

            this._keyAnimationTimer = setTimeout(() => {
              if (this.currentKeyAnimation) {
                this.currentKeyAnimation.playPhaseA();
              }
            }, 6000);
          }
        }

      } else {
        this.layerUI.style.display = 'none';
      }

      // --- TUTORIAL TRIGGER ---
      // Csak ha nem fullscreen (onboarding után), és még nincs kész
      const isTutorialNeeded = !isFullscreen && !this.tutorialCompletedInSession;
      if (isTutorialNeeded && !this.tutorialManager.isActive) {
        if (this.logger) this.logger.info('Tutorial trigger conditions met, starting...');
        setTimeout(() => this.tutorialManager.start(), 1000); // Kicsi várakozás a render után
      }
    } catch (renderError) {
      if (this.logger) this.logger.error("CRITICAL RENDER ERROR:", { error: renderError.message, stack: renderError.stack });
      alert("Hiba történt a megjelenítéskor: " + renderError.message);
    }

    // 4. Audio & Buttons
    if (slide.metadata && slide.metadata.step === 2) {
      if (this.logger) this.logger.info(`[DKV DIAG] Feladat dia betöltés: ID=${slide.id}, currentIndex=${currentIndex}`);
    }

    const setBtnState = (enabled, extraOptions = {}) => {
      if (!isFullscreen && this.activeGameInterface) {
        this.activeGameInterface.setNextButtonState(enabled, extraOptions);
      } else if (isFullscreen && this.currentSlideComponent && this.currentSlideComponent.setNextButtonState) {
        this.currentSlideComponent.setNextButtonState(enabled);
      }
    };

    if (audioSrc && !this.tutorialManager.isActive && !isTutorialPending) {
      const alreadyPlayed = this.playedAudioSlides && this.playedAudioSlides.has(slide.id);
      const isTaskSlide = slide.metadata && slide.metadata.step === 2 && slide.metadata.section?.startsWith('station_');
      const isCompleted = this.stateManager?.isSlideCompleted(slide.id);
      const btnOptions = isTaskSlide ? { suppressOrange: true } : {};
      const enableButton = isLastSlide || (alreadyPlayed && (!isTaskSlide || isCompleted));

      setBtnState(enableButton, btnOptions);
      this.playAudio(audioSrc, () => {
        if (isLastSlide) {
          if (this.playedAudioSlides) this.playedAudioSlides.add(slide.id);
          return;
        }
        setBtnState(true, btnOptions);
        if (this.playedAudioSlides) this.playedAudioSlides.add(slide.id);
      });
    } else {
      const isTaskSlide = slide.metadata && slide.metadata.step === 2 && slide.metadata.section?.startsWith('station_');
      const isFinalTask = slide.id === 'final_2';
      const btnOptions = (isTaskSlide || isFinalTask) ? { suppressOrange: true } : {};

      // HA TUTORIAL VAN, MINDIG DISABLE!
      const shouldDisable = this.tutorialManager.isActive || isTutorialPending;
      setBtnState(!shouldDisable, btnOptions);
    }

    // 5. Preloading
    this.preloadNextSlide(currentIndex);
  }


  /**
   * Maze eredmény modal megjelenítése
   * @param {{ success: boolean, timeElapsed: number, stepCount: number, points: number }} result
   * @param {Function} onContinue - Callback a Tovább gomb megnyomásakor
   */
  showMazeResultModal(result, onContinue, onAfterFade) {
    const elapsed = result.timeElapsed || 0;
    const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const secs = Math.floor(elapsed % 60).toString().padStart(2, '0');
    const timeStr = `${mins}:${secs}`;

    const overlay = document.createElement('div');
    overlay.className = 'maze-result-overlay';

    const isMaze = Object.prototype.hasOwnProperty.call(result, 'stepCount') && result.stepCount !== undefined;

    const modal = document.createElement('div');
    modal.className = `maze-result-modal ${result.success ? 'success' : 'failure'}`;

    modal.innerHTML = `
      <div class="maze-result-icon">${result.success ? '🎉' : '😢'}</div>
      <h2 class="maze-result-title">
        ${result.title ? result.title : (result.success
        ? 'Gratulálunk! Sikerült eljutni a kulcsig!'
        : 'Sajnáljuk, nem sikerült teljesíteni a labirintus pályát!')}
      </h2>
      <div class="maze-result-stats">
        <div class="maze-result-stat">
          <span class="maze-result-stat-label">Felhasznált időd:</span>
          <span class="maze-result-stat-value">${timeStr}</span>
        </div>
        ${isMaze ? `
        <div class="maze-result-stat">
          <span class="maze-result-stat-label">Lépések száma:</span>
          <span class="maze-result-stat-value">${result.stepCount}</span>
        </div>
        ` : ''}
        <div class="maze-result-stat">
          <span class="maze-result-stat-label">Szerezhető pontok max:</span>
          <span class="maze-result-stat-value">${result.maxPoints ? result.maxPoints : '5'} pont</span>
        </div>
        <div class="maze-result-stat">
          <span class="maze-result-stat-label">Kapott pontok:</span>
          <span class="maze-result-stat-value points">${result.points} pont</span>
        </div>
      </div>
      <button class="dkv-button dkv-grade-3-button dkv-btn--result-modal">Tovább</button>
    `;


    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Megjelenítési animáció
    requestAnimationFrame(() => overlay.classList.add('open'));

    // Tovább gomb
    modal.querySelector('.dkv-btn--result-modal').addEventListener('click', () => {
      // 1. Azonnal: dia váltás (siker/öröm dia megjelenik a háttérben)
      if (onContinue) onContinue();

      // 2. 300ms múlva: task modal eltűnik
      setTimeout(() => {
        if (onAfterFade) onAfterFade();

        // 3. Majd az összegző overlay fade-outol utoljára
        overlay.classList.remove('open');
        setTimeout(() => overlay.remove(), 300);
      }, 300);
    });
  }

  // --- DOM GENERÁLÓ SEGÉDFÜGGVÉNYEK A PORTÁLHOZ ---
  _instantiateSlideComponent(slide, isPreview = false) {
    const isFullscreenType = [
      SLIDE_TYPES.WELCOME,
      SLIDE_TYPES.REGISTRATION,
      SLIDE_TYPES.CHARACTER
    ].includes(slide.type);

    const isTutorialPending = !this.tutorialCompletedInSession && !isFullscreenType;

    const commonOptions = {
      logger: this.logger,
      slideManager: this.slideManager,
      stateManager: this.stateManager,
      timeManager: this.timeManager,
      apiService: this.apiService,
      onNext: () => this.handleNext(),
      onPrev: () => this.handlePrev(),
      onComplete: () => this.slideManager.completeCurrentSlide(),
      isPreview,
      isTutorialActive: (this.tutorialManager.isActive || isTutorialPending) && !isFullscreenType
    };
    if (this.logger) this.logger.info(`[TUTORIAL-DEBUG] _instantiateSlideComponent - type: ${slide.type}, isTutorialActive: ${commonOptions.isTutorialActive}`);
    let newComponent;
    switch (slide.type) {
      case SLIDE_TYPES.WELCOME: newComponent = new WelcomeSlide(slide, commonOptions); break;
      case SLIDE_TYPES.REGISTRATION: newComponent = new RegistrationSlide(slide, commonOptions); break;
      case SLIDE_TYPES.CHARACTER: newComponent = new CharacterSlide(slide, commonOptions); break;
      case SLIDE_TYPES.STORY: newComponent = new StorySlide(slide, commonOptions); break;
      case SLIDE_TYPES.VIDEO:
      case SLIDE_TYPES.REWARD: newComponent = new VideoSlide(slide, commonOptions); break;
      case SLIDE_TYPES.TASK: newComponent = new TaskSlide(slide, commonOptions); break;
      case SLIDE_TYPES.INFO: newComponent = new SummarySlide(slide, commonOptions); break;
      default:
        if (this.logger) this.logger.warn('Unknown slide type:', { type: slide.type });
        newComponent = new VideoSlide(slide, commonOptions); // Fallback to VideoSlide
    }
    return { newComponent, commonOptions };
  }

  _createSlideDOMElement(component, slide, isFullscreen, gradeClass) {
    if (!component) return null;
    const el = component.createElement();
    if (isFullscreen && slide.content && slide.content.backgroundUrl) {
      const wrapper = document.createElement('div');
      wrapper.className = 'dkv-slide-wrapper';
      if (gradeClass) wrapper.classList.add(gradeClass);
      wrapper.style.backgroundImage = `url('${slide.content.backgroundUrl}')`;
      wrapper.style.backgroundSize = 'cover';
      wrapper.style.backgroundPosition = 'center';
      wrapper.appendChild(el);
      return wrapper;
    }
    return el;
  }

  // --- SAFE NAVIGATION HANDLERS ---

  /**
   * Visszadja a ténylegesen következő diát a skip-szabályok (Debug/Prod) figyelembevételével,
   * anélkül, hogy megváltoztatná az állapotot.
   */
  _peekNextValidSlide() {
    let peekIndex = this.slideManager.currentIndex + 1;
    const slides = this.slideManager.slides;

    while (peekIndex < slides.length) {
      const slide = slides[peekIndex];
      const shouldSkip = this.debugManager
        ? this.debugManager.shouldSkipSlide(peekIndex)
        : (this.buildConfig?.enabled && this._prodShouldSkipSlide(slide, peekIndex));

      if (!shouldSkip) {
        return slide; // Ez lesz az első NEM skippelt dia
      }
      peekIndex++;
    }
    return null; // Nincs több valid dia
  }

  async handleNext() {
    if (this.isTransitioning) {
      if (this.logger) this.logger.warn('Navigáció blokkolva: Portál tranzíció folyamatban van.');
      return;
    }

    await this.ensureAudioFeedback();

    const currentSlide = this.slideManager.getCurrentSlide();

    // --- FELADAT MODAL ELINDÍTÁSA A GOMBNYOMÁSRA ---
    // Ha mi egy feladat slide-on vagyunk (step === 2) és még nincs megoldva...
    // A Finálé (final_2) is ide tartozik már!
    const isTaskSlideActive = (currentSlide?.metadata?.step === 2 && currentSlide?.metadata?.section?.startsWith('station_')) || currentSlide?.id === 'final_2';
    const isSlideCompleted = this.stateManager?.isSlideCompleted(currentSlide?.id);

    if (isTaskSlideActive && !isSlideCompleted) {
      // Indítjuk a feladatot, és megszakítjuk a manuális lapozást!
      // Az onComplete logika fog ezen a dián automatikusan továbbvinni.
      this._launchTask(currentSlide);
      return;
    }

    // A sima `this.slideManager.slides[this.slideManager.currentIndex + 1]` helyett okos peek-et használunk,
    // amely ismeri a Debug Panel (vagy Prod build) skip beállításait, így a portál jó képre vált!
    const nextSlide = this._peekNextValidSlide();

    if (!nextSlide) {
      // Ha nincs több dia, játsszuk le a vége-folyamatot a sima nextSlide meghívásával
      const next = this.slideManager.nextSlide();
      if (next) {
        this.renderSlide(next, 0, 'forward');
      } else {
        // NINCS TÖBB DIA -> Vissza a Hub-ba
        if (this.logger) this.logger.info('End of slides reached, returning to Hub');
        this.stopBackgroundMusicWithFade();
        this.showHub();
      }
      return;
    }

    const isStationEnd = currentSlide?.metadata?.step === 3 && (
      currentSlide?.metadata?.section?.startsWith('station_') ||
      currentSlide?.metadata?.section === 'intro'
    );
    const isNextSectionStart = nextSlide?.metadata?.step === 0 && (
      nextSlide?.metadata?.section?.startsWith('station_') ||
      nextSlide?.metadata?.section === 'final'
    );

    if (isStationEnd && isNextSectionStart) {
      if (this.logger) this.logger.info('Portal Transition Triggered! (WebGL)');

      const currentGrade = this.stateManager ? this.stateManager.getStateValue('currentGrade') : null;
      const gradeClass = currentGrade ? `dkv-grade-${currentGrade}` : '';
      const isFullscreen = [SLIDE_TYPES.WELCOME, SLIDE_TYPES.REGISTRATION, SLIDE_TYPES.CHARACTER].includes(nextSlide.type);

      // A Portál alatt lévő következő diát ELŐNÉZET módban példányosítjuk (isPreview = true),
      // így a videó/komponens nem indul el a tranzíció alatt.
      const { newComponent } = this._instantiateSlideComponent(nextSlide, true);
      const nextSlideDOM = this._createSlideDOMElement(newComponent, nextSlide, isFullscreen, gradeClass);

      // --- ANIMÁCIÓ BEKÖTÉSE (FÁZIS B) ---
      const stationId = currentSlide?.metadata?.section; // pl. 'station_1'
      const hasItem = this.stateManager && this.stateManager.hasKey(stationId);

      let animationPromise = Promise.resolve();

      if (!hasItem && stationId && stationId.startsWith('station_')) {
        this.isTransitioning = true; // Zároljuk az inputot amíg be nem repül

        // Keresünk egy üres slot-ot
        const inventoryCount = this.stateManager ? this.stateManager.getInventory().length : 0;
        const slots = this.activeGameInterface ? this.activeGameInterface.element.querySelectorAll('.dkv-g4-slot, .dkv-inventory-slot') : [];
        const targetSlot = slots[inventoryCount] || null;

        const currentGrade = this.stateManager ? this.stateManager.getStateValue('currentGrade') : null;
        const isGrade4 = String(currentGrade) === '4';

        if (this.currentKeyAnimation) {
          // Ha 'A' fázis már fut, adjuk meg neki a célt és indítsuk a B fázist.
          this.currentKeyAnimation.targetSlot = targetSlot;
          animationPromise = this.currentKeyAnimation.playPhaseB().then(() => {
            if (this.stateManager) {
              this.stateManager.addKey(stationId);
              if (this.activeGameInterface) {
                this.activeGameInterface.updateInventory(this.stateManager.getInventory());
              }
            }
            this.currentKeyAnimation = null; // Takarítás
          });
        } else {
          // Biztonsági fallback: ha valamiért nem indult el az A fázis, játsszuk le egyben
          const AnimClass = isGrade4 ? ScriptPartAnimation : KeyCollectionAnimation;
          const anim = new AnimClass({
            stationId: stationId,
            targetSlot: targetSlot
          });

          animationPromise = anim.play().then(() => {
            if (this.stateManager) {
              this.stateManager.addKey(stationId);
              if (this.activeGameInterface) {
                this.activeGameInterface.updateInventory(this.stateManager.getInventory());
              }
            }
          });
        }
      }

      // Várjuk meg a kulcs/szkript animációt, majd indulhat a Tranzíció (Portal vagy Glitch)
      animationPromise.then(async () => {
        const currentGrade = this.stateManager ? this.stateManager.getStateValue('currentGrade') : null;
        const isGrade4 = String(currentGrade) === '4';

        if (isGrade4) {
          // --- GRADE 4: DELAY BEFORE COUNTDOWN ---
          // Csak ha állomásról jövünk (ahol volt szkriptgyűjtés), várunk 2mp-et, 
          // hogy a játékos lássa az animáció végét. Az intro után azonnal indulhat.
          const isFromStation = currentSlide?.metadata?.section?.startsWith('station_');
          if (isFromStation) {
            await this._wait(2000);
          } else {
            // Rövid szünet az intro után, mielőtt a visszaszámláló overlay beúszik
            await this._wait(300);
          }

          if (this.isTransitioning === false) return; // Megszakítva időközben

          // --- GRADE 4: COUNTDOWN (3-2-1) ---
          this.currentCountdownAnimation = new CountdownAnimation({
            logger: this.logger
          });
          await this.currentCountdownAnimation.play();
          this.currentCountdownAnimation = null;

          if (this.isTransitioning === false) return; // Megszakítva időközben

          // --- GRADE 4: GLITCH TRANSITION ---
          this.currentGlitchTransition = new GlitchTransition({
            newSlideHtml: nextSlideDOM,
            duration: 2500,
            logger: this.logger,
            onComplete: () => {
              this.isTransitioning = false;
              this.currentGlitchTransition = null;
              const next = this.slideManager.nextSlide();
              if (next) {
                this.renderSlide(next, 0, 'forward', newComponent, nextSlideDOM);
                if (newComponent && typeof newComponent.playVideo === 'function') {
                  newComponent.playVideo();
                }
              }
            }
          });
          document.body.appendChild(this.currentGlitchTransition.createElement());
          this.currentGlitchTransition.start();
        } else {
          // --- EGYÉB: CLASSIC PORTAL TRANSITION (WebGL) ---
          // Állomás-függő portál színek (Hex -> RGB konverzió)
          const hexToRgb = (hex) => {
            if (!hex) return [0, 0.5, 1]; // Fallback kék
            const n = parseInt(hex.replace('#', ''), 16);
            return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
          };

          const portalColors = this.slideManager.portalColors || {};
          const stationColors = portalColors[nextSlide?.metadata?.section] || portalColors['final'] || null;
          const activeColors = stationColors ? stationColors.map(hex => hexToRgb(hex)) : null;

          const portal = new PortalTransition({
            newSlideHtml: nextSlideDOM,
            colors: activeColors,
            audioSrc: 'assets/audio/sfx/portal_transition.mp3',
            volume: this.sfxVolume,
            animationConfig: {
              duration: 11000,
              keyframes: [
                { time: 0, maskRadius: 0 },
                { time: 0.1, maskRadius: 3 },
                { time: 0.4, maskRadius: 25 },
                { time: 0.7, maskRadius: 80 },
                { time: 1.0, maskRadius: 151 }
              ]
            },
            onComplete: () => {
              this.isTransitioning = false;
              const next = this.slideManager.nextSlide();
              if (next) {
                this.renderSlide(next, 0, 'forward', newComponent, nextSlideDOM);
                if (newComponent && typeof newComponent.playVideo === 'function') {
                  newComponent.playVideo();
                }
              }
            }
          });

          document.body.appendChild(portal.createElement());
          portal.start();
        }
      });
      return;
    }

    const next = this.slideManager.nextSlide();
    if (next) {
      this.renderSlide(next, 0, 'forward'); // Direction: forward (explicit)
    } else {
      // NINCS TÖBB DIA -> Vissza a Hub-ba
      if (this.logger) this.logger.info('End of slides reached, returning to Hub (Direct)');
      this.stopBackgroundMusicWithFade();
      this.showHub();
    }
  }

  async handlePrev() {
    if (this.logger) this.logger.info(`[DKV handlePrev] Called. isTransitioning=${this.isTransitioning}, currentIndex=${this.slideManager?.currentIndex}, currentSlide=${this.slideManager?.getCurrentSlide()?.id}`);
    if (this.isTransitioning) {
      if (this.logger) this.logger.warn('[DKV handlePrev] BLOCKED by isTransitioning!');
      return;
    }
    await this.ensureAudioFeedback();
    const prev = this.slideManager.prevSlide();
    if (this.logger) this.logger.info(`[DKV handlePrev] prevSlide result: ${prev?.id || 'null'}`);
    if (prev) this.renderSlide(prev, 0, 'backward'); // Direction: backward
  }

  async ensureAudioFeedback() {
    // Növelt biztonsági késleltetés (100ms), hogy a hang biztosan elinduljon
    return new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Tutorial befejezésekor hívódik meg
   */
  onTutorialFinished() {
    this.tutorialCompletedInSession = true;
    if (this.logger) this.logger.info('Tutorial finished callback in App');

    // 1. Zene indítása (ha eddig tiltottuk a tutorial miatt)
    const currentIndex = this.slideManager.getCurrentIndex();
    const slides = this.slideManager.getSlides();
    const currentGrade = this.stateManager.getStateValue('currentGrade');
    if (currentIndex < slides.length - 1 && currentGrade && !this.backgroundMusic) {
      this.playBackgroundMusic(currentGrade);
    }

    // 2. Narráció indítása (ha el lett fojtva) ÉS gomb engedélyezése a végén
    const slide = slides[currentIndex];
    const audioSrc = slide.content?.audioSrc;
    if (audioSrc) {
      this.playAudio(audioSrc, () => {
        // Csak ha még mindig ezen a dián vagyunk
        if (this.slideManager.getCurrentIndex() === currentIndex) {
          this.activeGameInterface?.setNextButtonState(true);
          if (this.playedAudioSlides) this.playedAudioSlides.add(slide.id);
        }
      });
    } else {
      // Ha nincs audio, akkor engedélyezzük azonnal
      this.activeGameInterface?.setNextButtonState(true);
    }

    // 3. Videó indítása (ha van)
    if (this.currentSlideComponent && typeof this.currentSlideComponent.playVideo === 'function') {
      if (this.logger) this.logger.info('Starting video after tutorial completion');
      this.currentSlideComponent.playVideo();
    }
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
    if (!app) return;

    // 1. Ellenőrizzük, hogy a Hub létezik-e és van-e eleme (ha korábban destroy-olva lett, újrainicializáljuk)
    if (!this.hub || !this.hub.getElement()) {
      if (this.logger) this.logger.info('Hub was destroyed or missing, re-initializing...');
      this.initHub();
    }

    if (this.hub) {
      // 2. Állapot alaphelyzetbe állítása (Nincs aktív évfolyam, Hub fázis)
      if (this.stateManager) {
        this.stateManager.updateState({
          currentGrade: null,
          gamePhase: 'hub'
        });
      }

      // 3. Konténer ürítése és Hub hozzáadása
      app.innerHTML = '';
      app.appendChild(this.hub.getElement());

      // 4. Kártyák újra-renderelése (Biztosítjuk, hogy láthatóak legyenek)
      if (typeof this.hub.renderGradeCards === 'function') {
        this.hub.renderGradeCards();
      }

      this.hub.show();

      // Időzítő elrejtése a Hub-ban
      if (this.timerDisplay) {
        this.timerDisplay.hide();
      }

      if (this.logger) {
        this.logger.info('Hub displayed (re-initialized and fresh render)');
      }
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

    // Időzítők kipucolása
    if (this._activeTimers) {
      this._activeTimers.forEach(timer => clearTimeout(timer));
      this._activeTimers.clear();
    }

    this.logger = null;
    this.isInitialized = false;
    this._isDestroyed = true;
  }

  /**
   * Biztonságos aszinkron várakozás, amely figyeli az életciklust.
   * @param {number} ms 
   */
  _wait(ms) {
    return new Promise(resolve => {
      if (this._isDestroyed) {
        resolve();
        return;
      }

      const timer = setTimeout(() => {
        this._activeTimers.delete(timer);
        resolve();
      }, ms);
      this._activeTimers.add(timer);
    });
  }

  /**
   * Debug Panel megnyitása
   * (Ctrl+Shift+D hotkey)
   */
  openDebugPanel() {
    if (!this.debugManager || !DebugPanel) {
      if (this.logger) this.logger.warn('[DEBUG] Debug system not available');
      return;
    }

    if (!this.debugPanel) {
      this.debugPanel = new DebugPanel({
        debugManager: this.debugManager,
        stateManager: this.stateManager,
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
        if (this.logger) this.logger.info('[DEBUG] Stopping background music (Muted)');
        this.stopBackgroundMusicWithFade();
      }
    } else {
      if (!this.backgroundMusic && this.stateManager) {
        // Ha nincs zene, de kéne, indítsuk el (ha van aktív grade)
        const currentGrade = this.stateManager.getStateValue('currentGrade');
        if (currentGrade) {
          if (this.logger) this.logger.info('[DEBUG] Restarting background music (Unmuted)');
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
      // Tisztítjuk az előző UI-t, ha megszakítjuk a lejátszást
      document.querySelectorAll('.dkv-btn-narrator').forEach(btn => {
        btn.classList.remove('audio-playing');
        btn.classList.remove('audio-ended');
      });
    }

    const audio = new Audio(src);
    audio.volume = this.narrationVolume;
    this.currentAudio = audio;

    let callbackFired = false;
    const handleEnd = () => {
      if (callbackFired) return;
      callbackFired = true;
      this.currentAudio = null;

      // UI visszaállítása befejezéskor
      document.querySelectorAll('.dkv-btn-narrator').forEach(btn => {
        btn.classList.remove('audio-playing');
        btn.classList.add('audio-ended');
        btn.style.setProperty('--audio-progress', '100%');
      });

      if (onComplete) onComplete();
    };

    audio.addEventListener('ended', handleEnd);

    // Hiba esetén is feloldunk (Fallback), hogy ne ragadjon be a játék
    audio.addEventListener('error', (e) => {
      if (this.logger) this.logger.warn(`Audio playback failed for: ${src}`, { error: e.message });
      handleEnd();
    });

    // Audio UI Progress bindolás a Narrátor gombokra
    audio.addEventListener('play', () => {
      document.querySelectorAll('.dkv-btn-narrator').forEach(btn => {
        btn.classList.add('audio-playing');
        btn.classList.remove('audio-ended');
        btn.style.setProperty('--audio-progress', '0%');
      });
    });

    audio.addEventListener('timeupdate', () => {
      const progress = (audio.currentTime / audio.duration) * 100;
      if (!isNaN(progress)) {
        document.querySelectorAll('.dkv-btn-narrator').forEach(btn => {
          btn.style.setProperty('--audio-progress', `${progress}%`);
        });
      }
    });

    // Biztosítjuk, hogy a lejátszás mindig megindul:
    // Ha az audio már betöltött állapotban van (cache), a 'canplay' nem tüzel újra.
    const tryPlay = () => {
      if (this.currentAudio !== audio) return;
      audio.play().catch(err => {
        if (this.logger) this.logger.warn('Audio autoplay blocked or failed:', { error: err.message });
        handleEnd();
      });
    };

    if (audio.readyState >= 3) {
      tryPlay();
    } else {
      audio.addEventListener('canplay', tryPlay, { once: true });
    }

    audio.load();
  }

  /**
   * Háttérzene indítása
   * @param {string} grade - '3', '4', stb.
   */
  playBackgroundMusic(grade) {
    // Debug Mute Check
    if (this.debugManager && this.debugManager.shouldMuteMusic()) {
      if (this.logger) this.logger.info('[DEBUG] Background music muted by config');
      return;
    }

    if (this.backgroundMusic) return;
    try {
      const src = `assets/audio/grade${grade}/default_bg.mp3`;
      this.backgroundMusic = new Audio(src);
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = this.musicVolume;
      this.backgroundMusic.play().catch(e => {
        if (this.logger) this.logger.warn("Background music autoplay blocked", { error: e.message });
        this.backgroundMusic = null;
      });
    } catch (err) {
      if (this.logger) this.logger.warn("Error starting background music", { error: err.message });
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
      if (this.logger) this.logger.warn('System sound error', { error: e.message });
    }
  }

  /**
   * Eredmény mentése a ranglistába (Checkpoint rendszer)
   */
  async saveResultToLeaderboard() {
    if (this.isSaving) return;

    const state = this.stateManager.getState();
    if (!state.userProfile) return;

    this.isSaving = true;

    try {
      const payload = {
        action: this.leaderboardId ? 'update' : 'create',
        id: this.leaderboardId,
        data: {
          id: this.leaderboardId,
          nickname: state.userProfile.nickname,
          heroName: state.userProfile.name,
          playerClass: state.userProfile.classId,
          score: state.score || 0,
          timeMs: this.timeManager ? this.timeManager.getElapsedTime() : 0,
          selectedCharacterId: state.avatar,
          taskResults: this.taskResults
        }
      };

      const response = await fetch('./ranglista/manage_leaderboard.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success' && result.id) {
          this.leaderboardId = result.id; // Mentjük az ID-t a következő checkpoint-hoz
          if (this.logger) this.logger.info(`[Leaderboard] Checkpoint saved successfully (ID: ${this.leaderboardId})`);
        }
      }
    } catch (err) {
      if (this.logger) this.logger.warn('[Leaderboard] Failed to save result:', { error: err.message });
    } finally {
      this.isSaving = false;
    }
  }

  /**
   * Feladat automatikus meghívása és inicializálása
   * A renderSlide-ban került leválasztásra az audió eseménykezelésből
   */
  async _launchTask(slide) {
    const isCompleted = this.stateManager?.isSlideCompleted(slide.id);
    if (!this.activeGameInterface || isCompleted) return;

    const section = slide.metadata?.section || 'unknown';
    const registry = this.slideManager.taskRegistry || {};
    // Keresünk a registry-ben slide.id vagy section alapján
    const taskConfig = registry[slide.id] || registry[section];

    if (!taskConfig) {
      if (this.logger) this.logger.warn(`[DKV] No task configuration found for slide ${slide.id} / section ${section}`);
      const taskContent = slide.description || "Hajtsd végre a feladatot a továbblépéshez!";
      this.activeGameInterface.showTaskModal(taskContent, () => {
        this.stateManager?.markSlideCompleted(slide.id);
        this.handleNext();
      });
      return;
    }

    if (this.logger) this.logger.info(`[DKV] Dynamic TASK TRIGGERED - Slide: ${slide.id}, Section: ${section}, Type: ${taskConfig.type}`);

    // --- Feladat megnevezése ---
    const taskLabel = slide.id === 'final_2' ? 'Nagy Zár – Végjáték' : (slide.title || slide.id);

    const onTaskComplete = (result) => {
      const alreadyDone = this.stateManager?.isSlideCompleted(slide.id);
      if (!alreadyDone) {
        const currentScore = this.stateManager ? this.stateManager.getStateValue('score') || 0 : 0;
        this.stateManager?.updateState({ score: currentScore + (result.points || 0) });
        this.activeGameInterface?.updateHUD(this.stateManager?.getState());
        this.stateManager?.markSlideCompleted(slide.id);

        this.taskResults.push({
          slideId: slide.id,
          label: taskLabel,
          success: result.success ?? false,
          points: result.points ?? 0,
          maxPoints: result.maxPoints ?? null,
          timeElapsed: result.timeElapsed ?? null,
          attempts: result.attempts ?? null,
          stepCount: result.stepCount ?? null,
          wordCorrect: result.wordCorrect ?? null,
          orderCorrect: result.orderCorrect ?? null
        });

        if (taskConfig.type === 'finale' && this.timeManager) {
          this.timeManager.stopCompetition();
        }

        this.saveResultToLeaderboard();
      }

      const modalTitle = result.success ? 'Gratulálunk, sikeresen teljesítetted!' : 'Sajnos lejárt az idő vagy nem volt sikeres!';

      // Dinamikus üzenet generálása
      let customTitle = result.title || modalTitle;

      if (taskConfig.type === 'sound' && result.resultsByPart) {
        const { mainMessages, whisperedWords, hiddenNumbers } = result.resultsByPart;
        const correctCount = [mainMessages, whisperedWords, hiddenNumbers].filter(v => v).length;

        if (correctCount === 3) {
          customTitle = "Micsoda hallás! Minden feladatot hibátlanul megoldottál, igazi Kódmester vagy!";
        } else if (correctCount === 2) {
          customTitle = "Majdnem tökéletes! Két rejtélyt már megfejtettél, de egy még kifogott rajtad. Legközelebb sikerülni fog!";
          if (whisperedWords) customTitle += " A suttogást már remekül érted!";
          else if (mainMessages) customTitle += " A sebességkülönbségeket már jól hallod!";
          else if (hiddenNumbers) customTitle += " A hangjelzések számolása már jól megy!";
        } else if (correctCount === 1) {
          customTitle = "Ügyesen figyeltél, egy feladatot már kipipáltál! A többihez fülelj még jobban!";
          if (whisperedWords) customTitle += " A suttogás már nem titok előtted!";
        } else {
          customTitle = "Ez most nehéz volt, de ne add fel! Figyelj jól a hangokra, és próbáld meg újra!";
        }
      }

      this.showMazeResultModal(
        { ...result, title: customTitle },
        () => this.handleNext(),
        () => this.activeGameInterface.hideTaskModal()
      );
    };

    const globalTimeLimit = this.debugManager?.tasksConfig?.globalTimeLimit
      ?? this.buildConfig?.tasksConfig?.globalTimeLimit
      ?? 900;

    try {
      // Dinamikus modul betöltés
      const module = await taskConfig.module();
      const GameClass = module.default || (Object.values(module)[0]); // Handle both default and named exports

      const taskContainer = document.createElement('div');
      taskContainer.className = `${taskConfig.type}-task-container`;
      taskContainer.style.width = '100%';
      taskContainer.style.height = '100%';

      // Modal megjelenítése (prioritás a registry beli címeknek)
      const modalOptions = {
        title: taskConfig.modalTitle ?? slide.title,
        subtitle: taskConfig.modalSubtitle ?? slide.description,
        hideHeader: taskConfig.type === 'maze',
        modalClass: taskConfig.type === 'finale' ? 'finale-modal' : '',
        helpContent: taskConfig.helpContent
      };
      this.activeGameInterface.showTaskModal(taskContainer, null, modalOptions);

      // Opciók összeállítása
      const gameOptions = {
        ...taskConfig.options,
        timeLimit: globalTimeLimit,
        onComplete: onTaskComplete,
        gameInterface: this.activeGameInterface // FinaleGame-nek kell
      };

      // Nehézség felülírása ha szükséges
      if (taskConfig.options?.difficultyKey) {
        gameOptions.difficulty = this.debugManager?.tasksConfig?.[taskConfig.options.difficultyKey]
          ?? this.buildConfig?.tasksConfig?.[taskConfig.options.difficultyKey]
          ?? taskConfig.options.defaultDifficulty
          ?? 16;
      }

      const gameInstance = new GameClass(taskContainer, gameOptions);

      // Speciális kezelés gombokhoz (FinaleGame OK gomb)
      const okBtn = document.querySelector('.dkv-task-ok-btn');
      if (okBtn) {
        if (taskConfig.type === 'finale') {
          okBtn.style.display = 'block';
          okBtn.disabled = true;
          okBtn.onclick = () => {
            const result = gameInstance.evaluate();
            gameInstance.destroy();
            onTaskComplete(result);
          };
        } else {
          okBtn.style.display = 'none';
        }
      }

    } catch (err) {
      if (this.logger) this.logger.error(`Failed to launch task ${taskConfig.type}:`, { error: err.message });
      alert("Hiba történt a feladat indításakor.");
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
    window.DKV_DEBUG = () => {
      if (window.DKV_APP.logger) {
        window.DKV_APP.logger.info('Debug Info:', window.DKV_APP.getDebugInfo());
      }
    };
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