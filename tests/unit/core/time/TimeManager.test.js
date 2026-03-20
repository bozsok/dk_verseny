import TimeManager from '@/core/time/TimeManager.js';

describe('TimeManager', () => {
    let timeManager;
    let mockEventBus;
    let mockLogger;
    let mockStateManager;
    let currentTime = 1000;

    beforeEach(() => {
        currentTime = 1000;
        jest.useFakeTimers();
        
        // Mock performance.now to be controllable
        jest.spyOn(performance, 'now').mockImplementation(() => currentTime);

        mockEventBus = { emit: jest.fn() };
        mockLogger = { info: jest.fn(), error: jest.fn() };
        mockStateManager = {
            getStateValue: jest.fn(),
            updateState: jest.fn()
        };

        timeManager = new TimeManager({
            eventBus: mockEventBus,
            logger: mockLogger,
            stateManager: mockStateManager
        });
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    const advanceTime = (ms) => {
        // Frissítjük a kontrollált időt
        currentTime += ms;
        // Léptetjük a Jest időzítőket (setInterval callbackek lefutnak)
        jest.advanceTimersByTime(ms);
    };

    describe('Initialization', () => {
        it('should restore elapsed time from stateManager', () => {
            mockStateManager.getStateValue.mockReturnValue({ timeSpent: 30 }); // 30 seconds
            const tm = new TimeManager({ stateManager: mockStateManager });
            expect(tm.globalTimer.elapsed).toBe(30000);
        });

        it('should initialize with zero if no state is found', () => {
            mockStateManager.getStateValue.mockReturnValue(null);
            const tm = new TimeManager({ stateManager: mockStateManager });
            expect(tm.globalTimer.elapsed).toBe(0);
        });
    });

    describe('Competition Timer', () => {
        it('should start the competition and emit event', () => {
            timeManager.startCompetition();
            expect(timeManager.globalTimer.isRunning).toBe(true);
            expect(mockEventBus.emit).toHaveBeenCalledWith('timer:competition-started', expect.any(Object));
        });

        it('should stop the competition and return final time', () => {
            timeManager.startCompetition();
            advanceTime(5500);
            const finalTime = timeManager.stopCompetition();
            
            expect(finalTime).toBe(5500);
            expect(timeManager.globalTimer.isRunning).toBe(false);
            expect(mockEventBus.emit).toHaveBeenCalledWith('timer:competition-ended', { duration: 5500 });
        });

        it('should handle resuming correctly', () => {
            timeManager.globalTimer.elapsed = 10000; // 10s pre-elapsed
            timeManager.startCompetition();
            advanceTime(5000);
            expect(timeManager.getElapsedTime()).toBe(15000);
        });
    });

    describe('Ticker & State Sync', () => {
        it('should emit tick events every second', () => {
            timeManager.startCompetition();
            
            // 1 másodperc múlva kell jönnie az első ticknek
            advanceTime(1000);
            expect(mockEventBus.emit).toHaveBeenCalledWith('timer:tick', { elapsed: 1000 });
            
            advanceTime(2000);
            expect(mockEventBus.emit).toHaveBeenCalledWith('timer:tick', { elapsed: 3000 });
        });

        it('should sync time to stateManager every second', () => {
            mockStateManager.getStateValue.mockReturnValue({ timeSpent: 0 });
            timeManager.startCompetition();
            
            advanceTime(1000);
            expect(mockStateManager.updateState).toHaveBeenCalled();
        });

        it('should not redundant sync if second hasn\'t changed', () => {
            mockStateManager.getStateValue.mockReturnValue({ timeSpent: 1 });
            timeManager.startCompetition();
            
            // 1.5s passed, but second is still 1 (floor(1500/1000))
            advanceTime(500); 
            timeManager._updateStateTime(1500);
            
            expect(mockStateManager.updateState).not.toHaveBeenCalled();
        });
    });

    describe('State Update Logic', () => {
        it('should update state with correct seconds', () => {
             mockStateManager.getStateValue.mockReturnValue({ timeSpent: 0 });
             timeManager._updateStateTime(1999);
             expect(mockStateManager.updateState).toHaveBeenCalledWith(expect.objectContaining({
                 progress: expect.objectContaining({ timeSpent: 1 })
             }));
        });
    });

    describe('Edge Cases', () => {
        it('should return correct elapsed time when not running', () => {
            timeManager.globalTimer.elapsed = 1234;
            expect(timeManager.getElapsedTime()).toBe(1234);
        });

        it('should handle multiple start calls safely', () => {
            timeManager.startCompetition();
            const originalStartTime = timeManager.globalTimer.startTime;
            advanceTime(1000);
            timeManager.startCompetition();
            expect(timeManager.globalTimer.startTime).toBe(originalStartTime);
        });
        
        it('should return current duration on stopCompetition even if not running', () => {
            timeManager.globalTimer.elapsed = 5000;
            const result = timeManager.stopCompetition();
            expect(result).toBe(5000);
        });
    });
});
