/**
 * FinaleIntroTask.test.js
 */

import { FinaleIntroTask } from './FinaleIntroTask.js';

// Mock Typewriter
jest.mock('../../../../utils/Typewriter.js', () => {
    return jest.fn().mockImplementation(() => {
        return {
            type: jest.fn((el, text, opts) => {
                if (opts.onComplete) opts.onComplete();
            }),
            stop: jest.fn()
        };
    });
});

describe('FinaleIntroTask', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('sikeresen inicializálódik és renderel', () => {
        const task = new FinaleIntroTask(container);
        
        expect(container.querySelector('.dkv-finale-intro-container')).toBeTruthy();
        expect(container.querySelector('.dkv-finale-intro__title')).toBeTruthy();
        expect(container.querySelector('.dkv-finale-intro__execute-btn')).toBeTruthy();
    });

    test('a segítség overlay megnyílik gombnyomásra', () => {
        const task = new FinaleIntroTask(container);
        const helpBtn = container.querySelector('.dkv-finale-intro__help-btn');
        const helpOverlay = container.querySelector('.dkv-finale-intro__help-overlay');

        expect(helpOverlay.classList.contains('open')).toBe(false);
        
        helpBtn.click();
        expect(helpOverlay.classList.contains('open')).toBe(true);
    });

    test('a destroy metódus eltávolítja az elemet és leállítja a typewriter-t', () => {
        const task = new FinaleIntroTask(container);
        const stopSpy = jest.spyOn(task.typewriter, 'stop');
        
        task.destroy();
        
        expect(container.querySelector('.dkv-finale-intro-container')).toBeNull();
        expect(stopSpy).toHaveBeenCalled();
    });
});
