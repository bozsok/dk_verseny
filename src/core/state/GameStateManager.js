/**
 * GameStateManager - Központi játék állapot kezelő
 * 
 * Ez az osztály kezeli a játék teljes állapotát, beleértve:
 * - Évfolyam választást és progress
 * - Felhasználói progress
 * - Teljesítmény adatok
 * - LocalStorage persistence
 */
import SecureStorage from '../utils/SecureStorage.js';

class GameStateManager {
  constructor() {
    this.state = this.getInitialState();
    this.listeners = new Map();
    this.eventBus = null;
    this.logger = null;
  }

  /**
   * Alapállapot inicializálása
   */
  getInitialState() {
    return {
      // Alapvető játék állapot
      currentGrade: null,        // Kiválasztott évfolyam (3, 4, 5, 6)
      gamePhase: 'hub',          // hub, grade-select, game, completed
      currentLevel: 1,           // Jelenlegi szint
      currentSlideIndex: 0,      // Jelenlegi dia indexe (ÚJ - Perzisztenciához)

      // Felhasználói adatok (ÚJ)
      userProfile: null,         // { name, nickname, classId }
      avatar: null,              // Választott karakter URL vagy ID
      score: 0,                  // Aktuális pontszám (Rövid távú / Session)

      progress: {
        completedLevels: [],     // Befejezett szintek listája
        completedSlides: [],     // Befejezett diák (feladatok) listája (ÚJ)
        inventory: [],           // Megszerzett kulcsok (állomás azonosítók pl. 'station_1')
        totalScore: 0,           // Teljes pontszám (Hosszú távú)
        timeSpent: 0,            // Eltöltött idő (másodpercben)
        achievements: []         // Elért eredmények
      },

      // Évfolyam specifikus progress
      grades: {
        3: { unlocked: true, progress: 0, bestScore: 0 },
        4: { unlocked: true, progress: 0, bestScore: 0 },
        5: { unlocked: false, progress: 0, bestScore: 0 },
        6: { unlocked: false, progress: 0, bestScore: 0 }
      },

      // UI állapot
      ui: {
        isLoading: false,
        showModal: false,
        modalType: null,
        theme: 'light',
        isTransitioning: false,
        energyTimeLeft: 4800
      },

      // Rendszer adatok
      metadata: {
        lastSaved: null,
        version: '0.30.3',
        totalPlayTime: 0,
        sessionsPlayed: 0
      }
    };
  }

  /**
   * EventBus integráció beállítása
   */
  setEventBus(eventBus) {
    this.eventBus = eventBus;
  }

  /**
   * Logger integráció beállítása
   */
  setLogger(logger) {
    this.logger = logger;
    SecureStorage.setLogger(logger);
  }

  /**
   * State frissítése
   * @param {Object} updates - A módosítandó state részlet
   * @param {boolean} persist - Megadja, hogy történjen-e mentés a LocalStorage-ba (default: true)
   */
  updateState(updates, persist = true) {
    try {
      // State validáció
      const validatedUpdates = this.validateState(updates);

      // State merge
      this.state = { ...this.state, ...validatedUpdates };

      // Persistence mentése (csak ha a persist flag igaz)
      if (persist) {
        this.saveState();
      }

      // Event emitálás
      if (this.eventBus) {
        this.eventBus.emit('state:updated', {
          previousState: this.getPreviousState(),
          newState: this.state,
          updates: validatedUpdates
        });
      }

      // Listener-ek értesítése
      this.notifyListeners('state:updated', {
        state: this.state,
        updates: validatedUpdates
      });

      // Logger
      if (this.logger) {
        this.logger.info('GameState updated', {
          updates: Object.keys(validatedUpdates),
          currentGrade: this.state.currentGrade,
          gamePhase: this.state.gamePhase
        });
      }

      return true;
    } catch (error) {
      if (this.logger) {
        this.logger.error('State update failed', { error: error.message, updates });
      }
      return false;
    }
  }

  /**
   * State lekérése
   */
  getState(path = null) {
    if (!path) {
      return { ...this.state };
    }

    return this.getNestedValue(this.state, path);
  }

  /**
   * Specifikus state érték lekérése
   */
  getStateValue(key, defaultValue = null) {
    return this.state[key] !== undefined ? this.state[key] : defaultValue;
  }

  /**
   * Évfolyam progress lekérése
   */
  getGradeProgress(grade) {
    return this.state.grades[grade] || { unlocked: false, progress: 0, bestScore: 0 };
  }

  /**
   * Évfolyam feloldása
   */
  unlockGrade(grade) {
    if (this.state.grades[grade]) {
      this.updateState({
        grades: {
          ...this.state.grades,
          [grade]: { ...this.state.grades[grade], unlocked: true }
        }
      });

      if (this.eventBus) {
        this.eventBus.emit('grade:unlocked', { grade });
      }
    }
  }

  /**
   * Progress frissítése
   */
  updateProgress(levelData) {
    const { level, score, timeSpent, completed } = levelData;

    const currentProgress = this.state.progress;
    const newCompletedLevels = completed
      ? [...new Set([...currentProgress.completedLevels, level])]
      : currentProgress.completedLevels;

    const newProgress = {
      ...currentProgress,
      completedLevels: newCompletedLevels,
      totalScore: currentProgress.totalScore + (score || 0),
      timeSpent: currentProgress.timeSpent + (timeSpent || 0)
    };

    // Évfolyam specifikus progress
    const currentGrade = this.state.currentGrade;
    if (currentGrade) {
      const gradeProgress = this.getGradeProgress(currentGrade);
      const newGradeProgress = {
        ...gradeProgress,
        bestScore: Math.max(gradeProgress.bestScore, score || 0)
      };

      this.updateState({
        progress: newProgress,
        grades: {
          ...this.state.grades,
          [currentGrade]: newGradeProgress
        }
      });
    } else {
      this.updateState({ progress: newProgress });
    }
  }

  /**
   * Dia megjelölése befejezettként (ÚJ)
   * 
   * @param {string|number} slideId - A dia azonosítója
   */
  markSlideCompleted(slideId) {
    if (!slideId) return;

    const currentProgress = this.state.progress;
    const completedSlides = currentProgress.completedSlides || [];

    if (!completedSlides.includes(slideId)) {
      const newProgress = {
        ...currentProgress,
        completedSlides: [...completedSlides, slideId]
      };
      this.updateState({ progress: newProgress });
    }
  }

  /**
   * Ellenőrzi, hogy a dia már befejezett-e (ÚJ)
   * 
   * @param {string|number} slideId - A dia azonosítója
   * @returns {boolean}
   */
  isSlideCompleted(slideId) {
    if (!slideId) return false;
    const completedSlides = this.state.progress.completedSlides || [];
    return completedSlides.includes(slideId);
  }

  /**
   * Kulcs hozzáadása az inventory-hoz
   * 
   * @param {string} stationId - Az állomás azonosítója (pl. 'station_1')
   */
  addKey(stationId) {
    if (!stationId) return;

    const currentProgress = this.state.progress;
    const inventory = currentProgress.inventory || [];

    if (!inventory.includes(stationId)) {
      const newProgress = {
        ...currentProgress,
        inventory: [...inventory, stationId]
      };
      this.updateState({ progress: newProgress });

      if (this.eventBus) {
        this.eventBus.emit('inventory:key_added', { stationId, inventory: newProgress.inventory });
      }
    }
  }

  /**
   * Ellenőrzi, hogy egy adott kulcs már megvan-e
   * 
   * @param {string} stationId - Az állomás azonosítója
   * @returns {boolean}
   */
  hasKey(stationId) {
    if (!stationId) return false;
    const inventory = this.state.progress.inventory || [];
    return inventory.includes(stationId);
  }

  /**
   * Teljes inventory lekérése
   * 
   * @returns {Array} - A megszerzett kulcsok listája
   */
  getInventory() {
    return this.state.progress.inventory || [];
  }

  /**
   * State validáció
   */
  validateState(updates) {
    // Alapértelmezésben minden mezőt elfogadunk a merge-höz
    const validated = { ...updates };

    // Csak a speciális típusellenőrzést igénylő mezőket validáljuk
    if (updates.currentGrade !== undefined) {
      if (updates.currentGrade !== null && ![3, 4, 5, 6].includes(updates.currentGrade)) {
        delete validated.currentGrade;
      }
    }

    if (updates.gamePhase !== undefined) {
      const phases = ['hub', 'grade-select', 'game', 'completed'];
      if (!phases.includes(updates.gamePhase)) {
        delete validated.gamePhase;
      }
    }

    if (updates.currentSlideIndex !== undefined) {
      if (typeof updates.currentSlideIndex !== 'number' || updates.currentSlideIndex < 0) {
        delete validated.currentSlideIndex;
      }
    }

    if (updates.progress) {
      validated.progress = this.validateProgress(updates.progress);
    }

    if (updates.grades) {
      validated.grades = this.validateGrades(updates.grades);
    }

    return validated;
  }

  /**
   * Progress validáció
   */
  validateProgress(progress) {
    return {
      completedLevels: Array.isArray(progress.completedLevels)
        ? progress.completedLevels.filter(level => typeof level === 'number')
        : [],
      completedSlides: Array.isArray(progress.completedSlides)
        ? progress.completedSlides
        : [],
      inventory: Array.isArray(progress.inventory)
        ? progress.inventory
        : [],
      totalScore: typeof progress.totalScore === 'number' && progress.totalScore >= 0
        ? progress.totalScore
        : 0,
      timeSpent: typeof progress.timeSpent === 'number' && progress.timeSpent >= 0
        ? progress.timeSpent
        : 0,
      achievements: Array.isArray(progress.achievements)
        ? progress.achievements
        : []
    };
  }

  /**
   * Grades validáció
   */
  validateGrades(grades) {
    const validated = {};
    for (const [grade, data] of Object.entries(grades)) {
      if (['3', '4', '5', '6'].includes(grade)) {
        validated[grade] = {
          unlocked: Boolean(data.unlocked),
          progress: typeof data.progress === 'number' && data.progress >= 0
            ? data.progress
            : 0,
          bestScore: typeof data.bestScore === 'number' && data.bestScore >= 0
            ? data.bestScore
            : 0
        };
      }
    }
    return validated;
  }

  /**
   * Nested value lekérése
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }

  /**
   * State mentése localStorage-ba (Biztonságos módon)
   */
  saveState() {
    try {
      const stateToSave = {
        ...this.state,
        metadata: {
          ...this.state.metadata,
          lastSaved: new Date().toISOString()
        }
      };

      // SecureStorage használata közvetlen localStorage helyett
      const success = SecureStorage.setItem('digitális-kultúra-verseny-state', stateToSave);
      return success;
    } catch (error) {
      if (this.logger) {
        this.logger.error('Failed to save state', { error: error.message });
      }
      return false;
    }
  }

  /**
   * State betöltése localStorage-ból (Biztonságos módon)
   */
  loadState() {
    try {
      // SecureStorage használata
      const parsedState = SecureStorage.getItem('digitális-kultúra-verseny-state');

      if (parsedState) {
        const initialState = this.getInitialState();
        this.state = { ...initialState, ...parsedState };
        
        // Kényszerített visszazárás 5-6 számára (ha a mentett állásban nyitva maradtak volna)
        if (this.state.grades) {
          if (this.state.grades[5]) this.state.grades[5].unlocked = false;
          if (this.state.grades[6]) this.state.grades[6].unlocked = false;
        }

        if (this.logger) {
          this.logger.info('State loaded and decrypted from storage', {
            lastSaved: this.state.metadata.lastSaved,
            currentGrade: this.state.currentGrade
          });
        }

        // Értesítjük a figyelőket
        this.notifyListeners('state:updated', {
          state: this.state,
          updates: parsedState
        });

        return true;
      }
    } catch (error) {
      if (this.logger) {
        this.logger.error('Failed to load state', { error: error.message });
      }
    }
    return false;
  }

  /**
   * State reset
   */
  resetState() {
    this.state = this.getInitialState();
    SecureStorage.removeItem('digitális-kultúra-verseny-state');

    if (this.eventBus) {
      this.eventBus.emit('state:reset');
    }

    if (this.logger) {
      this.logger.info('Game state reset');
    }
  }

  /**
   * Rendszer-szintű flag lekérése (pl. GDPR, Master Mode)
   * 
   * @param {string} key - A keresett kulcs
   * @param {*} defaultValue - Alapértelmezett érték
   * @returns {*}
   */
  getSystemFlag(key, defaultValue = null) {
    const value = SecureStorage.getItem(`dkv-sys-${key}`);
    return value !== null ? value : defaultValue;
  }

  /**
   * Rendszer-szintű flag mentése
   * 
   * @param {string} key - A mentendő kulcs
   * @param {*} value - A mentendő érték
   */
  setSystemFlag(key, value) {
    SecureStorage.setItem(`dkv-sys-${key}`, value);

    if (this.logger) {
      this.logger.debug(`System flag set: ${key}`, { value });
    }
  }

  /**
   * Listener regisztrálása
   */
  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  /**
   * Listener eltávolítása
   */
  removeListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  /**
   * Listener-ek értesítése
   */
  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          if (this.logger) {
            this.logger.error('Listener error', { event, error: error.message });
          }
        }
      });
    }
  }

  /**
   * Előző state mentése (debugging)
   */
  getPreviousState() {
    return this._previousState || null;
  }

  /**
   * State snapshot készítése
   */
  createSnapshot() {
    return {
      timestamp: new Date().toISOString(),
      state: { ...this.state },
      version: this.state.metadata.version
    };
  }
  /**
   * Teljes játékmenet reset (ÚJ - Debug célokra)
   * Törli a progress-t, pontszámot, profilt és a jelenlegi dia indexet
   */
  clearFullProgress() {
    this.updateState({
      currentGrade: null,
      score: 0,
      userProfile: null,
      avatar: null,
      currentSlideIndex: 0,
      progress: {
        completedLevels: [],
        completedSlides: [],
        inventory: [],
        totalScore: 0,
        timeSpent: 0,
        achievements: []
      },
      ui: {
        ...this.state.ui,
        energyTimeLeft: 4800,
        isTransitioning: false
      }
    });

    if (this.logger) {
      this.logger.info('[DEBUG] Full game progress cleared via StateManager');
    }
  }
}

export default GameStateManager;