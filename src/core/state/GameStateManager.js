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
      progress: {
        completedLevels: [],     // Befejezett szintek listája
        totalScore: 0,           // Teljes pontszám
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
        theme: 'light'
      },

      // Rendszer adatok
      metadata: {
        lastSaved: null,
        version: '1.0.0',
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
  }

  /**
   * State frissítése
   */
  updateState(updates) {
    try {
      // State validáció
      const validatedUpdates = this.validateState(updates);

      // State merge
      this.state = { ...this.state, ...validatedUpdates };

      // Persistence mentése
      this.saveState();

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
   * State validáció
   */
  validateState(updates) {
    const validated = {};

    // currentGrade validáció
    if (updates.currentGrade !== undefined) {
      const grade = updates.currentGrade;
      if (grade === null || [3, 4, 5, 6].includes(grade)) {
        validated.currentGrade = grade;
      }
    }

    // gamePhase validáció
    if (updates.gamePhase !== undefined) {
      const phases = ['hub', 'grade-select', 'game', 'completed'];
      if (phases.includes(updates.gamePhase)) {
        validated.gamePhase = updates.gamePhase;
      }
    }

    // progress validáció
    if (updates.progress) {
      validated.progress = this.validateProgress(updates.progress);
    }

    // grades validáció
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
        this.state = { ...this.getInitialState(), ...parsedState };

        if (this.logger) {
          this.logger.info('State loaded and decrypted from storage', {
            lastSaved: this.state.metadata.lastSaved,
            currentGrade: this.state.currentGrade
          });
        }
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
    localStorage.removeItem('digitális-kultúra-verseny-state');

    if (this.eventBus) {
      this.eventBus.emit('state:reset');
    }

    if (this.logger) {
      this.logger.info('Game state reset');
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
}

export default GameStateManager;