import GameStateManager from '@/core/state/GameStateManager.js';
import SecureStorage from '@/core/utils/SecureStorage.js';

// Mock SecureStorage
jest.mock('@/core/utils/SecureStorage.js', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  setLogger: jest.fn()
}));

describe('GameStateManager', () => {
  let stateManager;
  let mockLogger;

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
        debug: jest.fn()
    };
    stateManager = new GameStateManager();
    stateManager.setLogger(mockLogger);
  });

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      const state = stateManager.getInitialState();
      expect(stateManager.state).toEqual(state);
      expect(stateManager.state.gamePhase).toBe('hub');
    });
  });

  describe('updateState', () => {
    it('should update partial state and log success', () => {
      stateManager.updateState({ currentGrade: 3 });
      expect(stateManager.state.currentGrade).toBe(3);
      expect(mockLogger.info).toHaveBeenCalledWith('GameState updated', expect.any(Object));
    });

    it('should notify state:updated listener on update', () => {
      const callback = jest.fn();
      stateManager.addListener('state:updated', callback);
      
      const updates = { currentGrade: 4 };
      stateManager.updateState(updates);
      
      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        updates: expect.objectContaining(updates)
      }));
    });

    it('should return false on validation error', () => {
        // We trigger an error in validateState by giving it something that could crash it?
        // Actually we can just spy on validateState and make it throw.
        const spy = jest.spyOn(stateManager, 'validateState').mockImplementation(() => {
            throw new Error('Validation crash');
        });
        const success = stateManager.updateState({ foo: 'bar' });
        expect(success).toBe(false);
        expect(mockLogger.error).toHaveBeenCalled();
        spy.mockRestore();
    });
  });

  describe('Validation', () => {
    it('should validate all fields including userProfile and avatar', () => {
        const updates = {
            currentGrade: 4,
            gamePhase: 'game',
            userProfile: { name: 'Test' },
            avatar: 'img.png',
            score: 100,
            progress: {},
            grades: {}
        };
        const validated = stateManager.validateState(updates);
        expect(validated.currentGrade).toBe(4);
        expect(validated.gamePhase).toBe('game');
        expect(validated.userProfile).toEqual(updates.userProfile);
        expect(validated.avatar).toBe('img.png');
        expect(validated.score).toBe(100);
    });

    it('should fall back to defaults for invalid progress data', () => {
      const validated = stateManager.validateProgress({
        totalScore: -5,
        timeSpent: 'none'
      });
      expect(validated.totalScore).toBe(0);
      expect(validated.timeSpent).toBe(0);
    });
  });

  describe('Persistence', () => {
    const STORAGE_KEY = 'digitális-kultúra-verseny-state';

    it('should save and load state', () => {
      stateManager.saveState();
      expect(SecureStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, expect.any(Object));

      const mockState = { currentGrade: 6, score: 50, metadata: { lastSaved: 'now' } };
      SecureStorage.getItem.mockReturnValue(mockState);
      
      const success = stateManager.loadState();
      expect(success).toBe(true);
      expect(stateManager.state.currentGrade).toBe(6);
    });

    it('should handle loadState failure', () => {
      SecureStorage.getItem.mockImplementation(() => { throw new Error('Fail'); });
      expect(stateManager.loadState()).toBe(false);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('resetState', () => {
    it('should reset and clear storage', () => {
      stateManager.updateState({ score: 100 });
      stateManager.resetState();
      expect(stateManager.state.score).toBe(0);
      expect(SecureStorage.removeItem).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith('Game state reset');
    });
  });

  describe('Progress/Inventory', () => {
      it('should manage inventory and slides', () => {
          stateManager.addKey('key1');
          expect(stateManager.hasKey('key1')).toBe(true);
          expect(stateManager.getInventory()).toContain('key1');

          stateManager.markSlideCompleted('slide1');
          expect(stateManager.isSlideCompleted('slide1')).toBe(true);
      });

      it('should update grade-specific progress', () => {
          stateManager.updateState({ currentGrade: 3 });
          stateManager.updateProgress({ level: 1, score: 200, completed: true });
          expect(stateManager.state.grades[3].bestScore).toBe(200);
      });
  });

  describe('Helper methods', () => {
      it('should get nested values and state values', () => {
          stateManager.updateState({ score: 5 });
          expect(stateManager.getStateValue('score')).toBe(5);
          expect(stateManager.getStateValue('non-existent', 'def')).toBe('def');
          expect(stateManager.getState('progress.totalScore')).toBe(0);
      });

      it('should handle eventBus and snapshots', () => {
          const bus = { emit: jest.fn() };
          stateManager.setEventBus(bus);
          stateManager.unlockGrade(5);
          expect(bus.emit).toHaveBeenCalledWith('grade:unlocked', { grade: 5 });

          const snap = stateManager.createSnapshot();
          expect(snap.version).toBeDefined();
      });

      it('should handle listener removal and errors', () => {
          const cb = jest.fn();
          stateManager.addListener('test', cb);
          stateManager.removeListener('test', cb);
          stateManager.notifyListeners('test', {});
          expect(cb).not.toHaveBeenCalled();

          stateManager.addListener('error-test', () => { throw new Error('!'); });
          stateManager.notifyListeners('error-test', {});
          expect(mockLogger.error).toHaveBeenCalledWith('Listener error', expect.any(Object));
      });
  });
});
