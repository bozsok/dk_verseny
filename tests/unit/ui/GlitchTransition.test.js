import { GlitchTransition } from '../../../src/ui/components/GlitchTransition';

describe('GlitchTransition', () => {
    let transition;
    let onComplete;
    let newSlide;

    beforeEach(() => {
        jest.useFakeTimers();
        onComplete = jest.fn();
        newSlide = document.createElement('div');
        newSlide.id = 'new-slide';
        const logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
        
        transition = new GlitchTransition({
            newSlideHtml: newSlide,
            onComplete,
            duration: 1000,
            logger
        });

        // Mock canvas context
        const mockCtx = {
            createImageData: jest.fn().mockReturnValue({ data: new Uint8ClampedArray(100) }),
            putImageData: jest.fn(),
            fillRect: jest.fn(),
            fillStyle: ''
        };
        HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(mockCtx);
        
        // Mock performance.now - NE 0-ról induljon, mert a !this.startTime elhasal
        let currentTime = 1000;
        jest.spyOn(performance, 'now').mockImplementation(() => currentTime);
        
        // Mock requestAnimationFrame using setTimeout
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
            return setTimeout(() => {
                currentTime += 16;
                cb(currentTime);
            }, 16);
        });
        
        jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => {
            clearTimeout(id);
        });
    });

    afterEach(() => {
        if (transition) transition.destroy();
        jest.useRealTimers();
        jest.restoreAllMocks();
        
        document.body.innerHTML = '';
        transition = null;
    });

    test('should initialize and create elements', () => {
        const fragment = transition.createElement();
        document.body.appendChild(fragment);
        
        expect(document.querySelector('.dkv-glitch-container')).not.toBeNull();
        expect(document.querySelector('#new-slide')).not.toBeNull();
        expect(document.querySelector('canvas')).not.toBeNull();
    });

    test('should run animation and call onComplete', async () => {
        document.body.appendChild(transition.createElement());
        transition.start();
        
        // Szimulálunk elegendő időt az animáció befejezéséhez (duration = 1000ms)
        for(let i=0; i<100; i++) {
            jest.advanceTimersByTime(16);
        }
        
        expect(onComplete).toHaveBeenCalled();
        
        // A finish() 100ms delay-el takarít
        jest.advanceTimersByTime(200);
        expect(document.querySelector('.dkv-glitch-container')).toBeNull();
    });

    test('should cleanup on destroy', () => {
        document.body.appendChild(transition.createElement());
        transition.start();
        
        const removeSpy = jest.spyOn(window, 'removeEventListener');
        
        transition.destroy();
        
        expect(document.querySelector('.dkv-glitch-container')).toBeNull();
        expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
        
        jest.advanceTimersByTime(2000);
        expect(onComplete).not.toHaveBeenCalled();
    });

    test('should log start and destroy if logger provided', () => {
        const logger = { info: jest.fn() };
        const loggedTransition = new GlitchTransition({ logger });
        
        loggedTransition.createElement(); // Essential!
        loggedTransition.start();
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Tranzíció indítása'));
        
        loggedTransition.destroy();
        expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Megsemmisítés'));
    });

    test('should handle window resize', () => {
        transition.createElement();
        window.innerWidth = 1000;
        window.innerHeight = 800;
        window.dispatchEvent(new Event('resize'));
        
        expect(transition.canvas.width).toBe(500); // innerWidth / 2
        expect(transition.canvas.height).toBe(400); // innerHeight / 2
    });

    test('should cancel finish timer on destroy', () => {
        transition.createElement();
        transition.finish(); // Starts a 100ms timer
        
        transition.destroy(); // Should clear the timer
        
        jest.advanceTimersByTime(200);
        // It should have been cleared, no errors or double removals
    });

    test('should show content layer if opacity is 0 during animation', () => {
        transition.createElement();
        transition.contentLayer.style.opacity = '0';
        transition.start();
        
        // Advance to levezetés phase (progress > 0.7)
        // duration is 1000ms, start at 1000 in performance.now
        // for progress > 0.7, we need elapsed > 700ms
        for(let i=0; i<50; i++) {
            jest.advanceTimersByTime(16);
        }
        
        expect(transition.contentLayer.style.opacity).toBe('1');
    });
});
