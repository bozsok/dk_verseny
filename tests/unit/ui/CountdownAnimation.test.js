import { CountdownAnimation } from '../../../src/ui/components/CountdownAnimation';

describe('CountdownAnimation', () => {
    let animation;
    let onComplete;

    beforeEach(() => {
        jest.useFakeTimers();
        onComplete = jest.fn();
        
        // Mock requestAnimationFrame
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => setTimeout(cb, 16));
        jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => clearTimeout(id));

        const logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
        animation = new CountdownAnimation({ onComplete, logger });
    });

    afterEach(() => {
        if (animation) animation.destroy();
        jest.useRealTimers();
        jest.restoreAllMocks();
        document.body.innerHTML = '';
        animation = null;
    });

    // Segédfüggvény az aszinkron időzítők léptetéséhez
    async function advanceAsync(ms) {
        let chunk = 50;
        for (let i = 0; i < ms; i += chunk) {
            jest.advanceTimersByTime(chunk);
            await Promise.resolve();
        }
    }

    test('should create overlay container and label on play', () => {
        animation.play();
        const overlay = document.querySelector('.dkv-countdown-overlay');
        expect(overlay).not.toBeNull();
        
        const label = document.querySelector('.dkv-countdown-label');
        expect(label).not.toBeNull();
        expect(label.textContent).toBe('Kvantumugrás a következő szektorba...');
    });

    test('should show 3-2-1 images sequentially', async () => {
        const playPromise = animation.play();
        
        // Először a '3' jelenik meg
        await advanceAsync(100); 
        
        let getImages = () => document.querySelectorAll('.dkv-countdown-image');
        
        expect(getImages().length).toBeGreaterThan(0);
        expect(getImages()[0].src).toContain('3.png');

        // Várjuk végig az első számot (600 + 200 + 100 + delta)
        // Összesen ~1000ms kell biztosan
        await advanceAsync(1200);
        expect(getImages().length).toBeGreaterThan(0);
        expect(getImages()[0].src).toContain('2.png');

        await advanceAsync(1200);
        expect(getImages().length).toBeGreaterThan(0);
        expect(getImages()[0].src).toContain('1.png');

        await advanceAsync(2000);
        
        await playPromise;
        expect(onComplete).toHaveBeenCalled();
        expect(document.querySelector('.dkv-countdown-overlay')).toBeNull();
    });

    test('should stop and cleanup on destroy', () => {
        animation.play();
        expect(document.querySelector('.dkv-countdown-overlay')).not.toBeNull();
        
        animation.destroy();
        expect(document.querySelector('.dkv-countdown-overlay')).toBeNull();
        
        jest.advanceTimersByTime(5000);
        expect(onComplete).not.toHaveBeenCalled();
    });

    test('should work with default options', () => {
        const defaultAnim = new CountdownAnimation();
        expect(defaultAnim.onComplete).toBeDefined();
        expect(defaultAnim.logger).toBeNull();
    });

    test('should log start and destroy if logger provided', () => {
        const logger = { info: jest.fn() };
        const loggedAnim = new CountdownAnimation({ logger });
        
        loggedAnim.play();
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Visszaszámlálás indítása'));
        
        loggedAnim.destroy();
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Megsemmisítés'));
    });

    test('should NOT continue steps if destroyed', async () => {
        const playPromise = animation.play();
        
        // Step 0 starts
        await advanceAsync(100); 
        
        // Destroy while step 0 is running
        animation.destroy();
        
        await advanceAsync(2000);
        
        const overlay = document.querySelector('.dkv-countdown-overlay');
        expect(overlay).toBeNull();
    });
});
