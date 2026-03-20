import GameLogger from '@/core/logging/GameLogger.js';
import SecureStorage from '@/core/utils/SecureStorage.js';

jest.mock('@/core/utils/SecureStorage.js');

describe('GameLogger', () => {
    let logger;

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock performance.now
        jest.spyOn(performance, 'now').mockReturnValue(100);
        
        // Alapértelmezett SecureStorage mockok
        SecureStorage.getItem.mockReturnValue(true); // Consent granted
        
        logger = new GameLogger({
            enableConsole: true,
            level: 'DEBUG'
        });
    });

    describe('Initialization & Level Control', () => {
        it('should initialize with correct levels', () => {
            expect(logger.currentLevel).toBe(3); // DEBUG
            expect(logger.userConsent).toBe(true);
        });

        it('should change level correctly', () => {
            logger.setLevel('ERROR');
            expect(logger.currentLevel).toBe(0);
            
            // Should not log INFO when level is ERROR
            const result = logger.info('hidden');
            expect(result).toBe(false);
            expect(logger.logHistory.length).toBe(0);
        });
    });

    describe('GDPR & Consent', () => {
        it('should respect user consent from SecureStorage', () => {
            SecureStorage.getItem.mockReturnValue(false);
            const newLogger = new GameLogger();
            expect(newLogger.userConsent).toBe(false);
        });

        it('should update consent and persist it', () => {
            logger.setUserConsent(false);
            expect(logger.userConsent).toBe(false);
            expect(SecureStorage.setItem).toHaveBeenCalledWith('dkv-logging-consent', 'false');
        });

        it('should sanitize sensitive data in context', () => {
            const context = {
                user: 'secret',
                password: 'abc',
                safe: 'public'
            };
            logger.info('test', context);
            const entry = logger.logHistory[0];
            expect(entry.context.user).toBe('[REDACTED]');
            expect(entry.context.password).toBe('[REDACTED]');
            expect(entry.context.safe).toBe('public');
        });
    });

    describe('Output Handling', () => {
        it('should output to console', () => {
            const spy = jest.spyOn(console, 'info').mockImplementation();
            logger.info('hello console');
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });

        it('should output to storage when consent is granted', () => {
            SecureStorage.getItem.mockReturnValue([]); // Initial logs
            logger.info('to storage');
            expect(SecureStorage.setItem).toHaveBeenCalledWith('dkv-game-logs', expect.arrayContaining([
                expect.objectContaining({ message: 'to storage' })
            ]));
        });

        it('should NOT output to storage when consent is denied', () => {
            logger.setUserConsent(false);
            SecureStorage.setItem.mockClear();
            logger.info('no storage');
            expect(SecureStorage.setItem).not.toHaveBeenCalledWith('dkv-game-logs', expect.anything());
        });
    });

    describe('History & Lifecycle', () => {
        it('should limit history size', () => {
            logger = new GameLogger({ maxStorageEntries: 2 });
            logger.info('1');
            logger.info('2');
            logger.info('3');
            expect(logger.logHistory.length).toBe(2);
            expect(logger.logHistory[0].message).toBe('2');
        });

        it('should reset state', () => {
            logger.info('test');
            logger.reset();
            expect(logger.logHistory.length).toBe(0);
            expect(logger.logCount).toBe(0);
        });

        it('should clear logs and storage', () => {
            logger.info('test');
            logger.clearLogs();
            expect(logger.logHistory.length).toBe(0);
            expect(SecureStorage.removeItem).toHaveBeenCalledWith('dkv-game-logs');
        });
    });

    describe('Stats & Export', () => {
        it('should provide statistics', () => {
            logger.error('err');
            logger.info('inf');
            const stats = logger.getStats();
            expect(stats.totalLogs).toBe(2);
            expect(stats.levelCounts.ERROR).toBe(1);
            expect(stats.levelCounts.INFO).toBe(1);
        });

        it('should export logs in CSV format', () => {
            SecureStorage.getItem.mockReturnValue([
                { timestamp: '2026', level: 'INFO', message: 'test', context: {} }
            ]);
            const csv = logger.exportLogs('csv');
            expect(csv).toContain('timestamp,level,message,context');
            expect(csv).toContain('2026,INFO,"test","{}"');
        });
    });

    describe('Event Support', () => {
        it('should notify listeners on log', () => {
            const listener = jest.fn();
            logger.on('log', listener);
            logger.info('msg');
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({ message: 'msg' }));
        });
    });
});
