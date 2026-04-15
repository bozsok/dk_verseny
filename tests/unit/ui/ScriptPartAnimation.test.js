import { ScriptPartAnimation } from '../../../src/ui/components/ScriptPartAnimation';

describe('ScriptPartAnimation', () => {
    let animation;
    let onComplete;

    beforeEach(() => {
        jest.useFakeTimers();
        onComplete = jest.fn();
        
        // Mock requestAnimationFrame
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => setTimeout(cb, 16));
        jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => clearTimeout(id));

        // Mock animate API
        Element.prototype.animate = jest.fn().mockReturnValue({
            onfinish: null,
            cancel: jest.fn(),
            pause: jest.fn()
        });
        
        // Mock getAnimations
        Element.prototype.getAnimations = jest.fn().mockReturnValue([]);

        const logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
        animation = new ScriptPartAnimation({
            stationId: 'station_1',
            targetSlot: document.createElement('div'),
            onComplete,
            logger
        });
    });

    afterEach(() => {
        if (animation) animation.destroy();
        jest.useRealTimers();
        if (window.requestAnimationFrame?.mockRestore) window.requestAnimationFrame.mockRestore();
        if (window.cancelAnimationFrame?.mockRestore) window.cancelAnimationFrame.mockRestore();
        document.body.innerHTML = '';
        delete Element.prototype.animate;
        delete Element.prototype.getAnimations;
    });

    test('should start phase A and trigger pulse animation on finish', () => {
        animation.playPhaseA();
        jest.advanceTimersByTime(50);
        
        const img = document.querySelector('.script-animation-container img');
        const animResult = Element.prototype.animate.mock.results[0].value;
        
        // Simulating completion of entry animation
        if (animResult.onfinish) animResult.onfinish();
        
        // This should trigger the pulse animation
        expect(Element.prototype.animate).toHaveBeenCalledTimes(2);
        expect(Element.prototype.animate).toHaveBeenLastCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ transform: expect.stringContaining('scale(1.16)') })
            ]),
            expect.objectContaining({ iterations: Infinity })
        );
    });


    test('should execute phase B without target slot (fade out)', async () => {
        // Re-create animation without target slot
        animation.destroy();
        animation = new ScriptPartAnimation({
            stationId: 'station_1',
            targetSlot: null
        });
        
        animation.playPhaseA();
        jest.advanceTimersByTime(50);
        
        const bPromise = animation.playPhaseB();
        jest.advanceTimersByTime(1200); // 500ms anim + buffer
        
        await bPromise;
        expect(document.querySelector('.script-animation-container')).toBeNull();
    });

    test('should run full play() sequence', async () => {
        const playPromise = animation.play();
        
        // Phase A starts
        jest.advanceTimersByTime(50);
        expect(document.querySelector('.script-animation-container')).not.toBeNull();
        
        // Advance to Phase B trigger (2000ms delay in play())
        jest.advanceTimersByTime(2100);
        
        // Simulate animation completion in phase B
        const lastAnim = Element.prototype.animate.mock.results[Element.prototype.animate.mock.results.length - 1].value;
        if (lastAnim.onfinish) lastAnim.onfinish();
        
        await playPromise;
        expect(document.querySelector('.script-animation-container')).toBeNull();
    });

    test('should log actions if logger is provided', () => {
        const logger = { info: jest.fn() };
        const loggedAnim = new ScriptPartAnimation({ stationId: 'station_1', logger });
        
        loggedAnim.playPhaseA();
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Phase A indítása'), expect.any(Object));
        
        loggedAnim.destroy();
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Megsemmisítés'));
    });

    test('should stop if destroyed during phase A', () => {
        animation.playPhaseA();
        animation.destroy();
        
        jest.advanceTimersByTime(100);
        // It should not crash and should be cleaned up
        expect(document.querySelector('.script-animation-container')).toBeNull();
    });
});
