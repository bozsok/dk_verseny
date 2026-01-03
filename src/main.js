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
  }

  /**
   * Alkalmazás inicializálása
   */
  async init() {
    try {
      // Loading screen megjelenítése
      this.showLoadingScreen();

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

    if (this.logger) {
      this.logger.info('Core components initialized');
    }
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

    if (this.logger) {
      this.logger.info('Event listeners setup completed');
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
  renderSlide(slide) {
    if (!slide) return;

    // Stop any currently playing audio immediately (prevents audio bleed)
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }


    const app = document.getElementById('app');
    if (!app) return;

    // Grade scope osztály (Fontos a CSS miatt!)
    const currentGrade = this.stateManager ? this.stateManager.getStateValue('currentGrade') : null;
    const gradeClass = currentGrade ? `dkv-grade-${currentGrade}` : '';

    // Globális grade osztály beállítása a BODY-ra a komponens-független stílusokhoz (pl. Timer)
    if (gradeClass) {
      document.body.classList.forEach(cls => {
        if (cls.startsWith('dkv-grade-')) document.body.classList.remove(cls);
      });
      document.body.classList.add(gradeClass);
    }

    // Típus ellenőrzése
    const isFullscreen = [
      SLIDE_TYPES.WELCOME,
      SLIDE_TYPES.REGISTRATION,
      SLIDE_TYPES.CHARACTER
    ].includes(slide.type);

    // --- Background Music Control ---
    const totalSlides = this.slideManager.slides.length;
    const currentIndex = this.slideManager.currentIndex;

    // 1. Start Music: If in Game Phase (not fullscreen) AND music not playing
    if (!isFullscreen && !this.backgroundMusic) {
      // Ensure we are not on the last slide (edge case)
      if (currentIndex < totalSlides - 1 && currentGrade) {
        this.playBackgroundMusic(currentGrade);
      }
    }

    // 2. Stop Music (Immediate): If back to Onboarding
    if (isFullscreen && this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic = null;
    }

    // 3. Stop Music (Fade): If Last Slide
    if (currentIndex === totalSlides - 1 && this.backgroundMusic) {
      this.stopBackgroundMusicWithFade();
    }
    // -------------------------------

    // 1. GameInterface kezelése
    if (!isFullscreen) {
      // In-Game mód: Szükség van a GameInterface-re
      if (!this.gameInterface) {
        app.innerHTML = ''; // Előző tartalom törlése

        this.gameInterface = new GameInterface({
          onNext: () => {
            const next = this.slideManager.nextSlide();
            if (next) this.renderSlide(next);
          },
          onPrev: () => {
            const prev = this.slideManager.prevSlide();
            if (prev) this.renderSlide(prev);
          },
          onOpenSettings: () => this.gameInterface.toggleSettings(),
          onOpenJournal: () => this.gameInterface.toggleJournal(),
          onOpenNarrator: () => this.gameInterface.toggleNarrator(),
          onMusicVolumeChange: (v) => this.setMusicVolume(v),
          onNarrationVolumeChange: (v) => this.setNarrationVolume(v),
          musicVolume: this.musicVolume,
          narrationVolume: this.narrationVolume,
          stateManager: this.stateManager,
          totalSlides: this.slideManager.slides.length - 1 // Welcome dia nem számít a progressben
        });

        const giElement = this.gameInterface.createElement();
        if (gradeClass) giElement.classList.add(gradeClass);

        app.appendChild(giElement);

        // Kezdeti HUD frissítés
        this.gameInterface.updateHUD(this.stateManager.getState());
      }
    } else {
      // Fullscreen mód: Ha van GameInterface, töröljük
      if (this.gameInterface) {
        this.gameInterface.element.remove();
        this.gameInterface = null;
      }
    }

    // 2. Slide Komponens létrehozása
    let slideComponent;
    const commonOptions = {
      onComplete: () => {
        this.slideManager.completeCurrentSlide();
      },
      onNext: () => {
        const next = this.slideManager.nextSlide();
        if (next) this.renderSlide(next);
      },
      apiService: this.apiService,
      stateManager: this.stateManager
    };

    switch (slide.type) {
      case SLIDE_TYPES.WELCOME:
        slideComponent = new WelcomeSlide(slide, { ...commonOptions, timeManager: this.timeManager });
        break;
      case SLIDE_TYPES.REGISTRATION:
        slideComponent = new RegistrationSlide(slide, { ...commonOptions, stateManager: this.stateManager });
        break;
      case SLIDE_TYPES.CHARACTER:
        slideComponent = new CharacterSlide(slide, { ...commonOptions, stateManager: this.stateManager });
        break;
      case SLIDE_TYPES.STORY:
        slideComponent = new StorySlide(slide, commonOptions);
        break;
      case SLIDE_TYPES.VIDEO:
      case SLIDE_TYPES.REWARD:
        slideComponent = new VideoSlide(slide, commonOptions);
        break;
      case SLIDE_TYPES.TASK:
        slideComponent = new TaskSlide(slide, commonOptions);
        break;
      default:
        console.warn('Unknown slide type:', slide.type);
        slideComponent = new VideoSlide(slide, commonOptions);
    }

    // 3. Renderelés
    const element = slideComponent.createElement();

    if (isFullscreen) {
      // Fullscreen Wrapper
      const slideWrapper = document.createElement('div');
      slideWrapper.className = 'dkv-slide-wrapper';
      if (gradeClass) slideWrapper.classList.add(gradeClass);

      if (slide.content && slide.content.backgroundUrl) {
        slideWrapper.style.backgroundImage = `url('${slide.content.backgroundUrl}')`;
        slideWrapper.style.backgroundSize = 'cover';
        slideWrapper.style.backgroundPosition = 'center';
      }

      slideWrapper.appendChild(element);
      app.innerHTML = '';
      app.appendChild(slideWrapper);
    } else {
      // GameInterface Content Area
      this.gameInterface.setContent(element);
      this.gameInterface.updateTimeline(this.slideManager.currentIndex + 1);
      this.gameInterface.updateHUD(this.stateManager.getState());

      // Narráció frissítése
      const narrationText = (slide.content && slide.content.narration) || slide.description || "Nincs elérhető történet ehhez a diához.";
      this.gameInterface.setNarration(narrationText);
    }

    // 4. Hang lejátszása és Navigáció blokkolása
    const audioSrc = slide.content ? slide.content.audioSrc : null;
    const isLastSlide = (currentIndex >= totalSlides - 1);

    if (audioSrc) {
      // Logic: Always play audio. 
      // Button State: 
      // - If Last Slide: ALWAYS BLOCKED (false).
      // - If Not Last: Block only if NOT already played.
      const alreadyPlayed = this.playedAudioSlides && this.playedAudioSlides.has(slide.id);
      const enableButton = !isLastSlide && alreadyPlayed;

      // Set initial button state
      if (!isFullscreen && this.gameInterface) {
        this.gameInterface.setNextButtonState(enableButton);
      } else if (isFullscreen && slideComponent.setNextButtonState) {
        slideComponent.setNextButtonState(enableButton);
      }

      this.playAudio(audioSrc, () => {
        // Unlock on completion?
        // Only if NOT last slide!
        if (isLastSlide) {
          // Keep disabled, mark as played
          if (this.playedAudioSlides && slide.id) {
            this.playedAudioSlides.add(slide.id);
          }
          return;
        }

        if (!isFullscreen && this.gameInterface) {
          this.gameInterface.setNextButtonState(true);
        } else if (isFullscreen && slideComponent.setNextButtonState) {
          slideComponent.setNextButtonState(true);
        }

        // Mark as played
        if (this.playedAudioSlides && slide.id) {
          this.playedAudioSlides.add(slide.id);
        }
      });
    } else {
      // Ha nincs hang
      // Ha utolsó dia -> Blokkoljuk
      // Ha nem utolsó -> Engedélyezzük

      const shouldEnable = !isLastSlide;

      if (!isFullscreen && this.gameInterface) {
        this.gameInterface.setNextButtonState(shouldEnable);
      }
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