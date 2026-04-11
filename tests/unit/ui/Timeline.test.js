import { GameInterfaceGrade4 } from '../../../src/ui/components/GameInterfaceGrade4';

describe('GameInterfaceGrade4 Timeline Logic', () => {
    let ui;
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        
        ui = new GameInterfaceGrade4({
            totalSlides: 28
        });
        container.appendChild(ui.createElement());
    });

    afterEach(() => {
        ui.destroy();
        document.body.innerHTML = '';
    });

    test('should initialize with 7 timeline tracks', () => {
        const tracks = container.querySelectorAll('.dkv-g4-timeline-track');
        expect(tracks.length).toBe(7);
        
        const fills = container.querySelectorAll('.dkv-g4-timeline-fill');
        expect(fills.length).toBe(7);
    });

    test('should calculate correct fill for Intro (Slide 4-7)', () => {
        // Slide 4 (Intro 1/4) - because 1-3 is onboarding
        ui.updateTimeline(4, { metadata: { section: 'intro' } });
        expect(ui.timelineFillEls[0].style.width).toBe('25%');
        expect(ui.timelineFillEls[1].style.width).toBe('0%');
        expect(ui.stationLabelEl.textContent).toBe('INTRO');
        expect(ui.stationTextEl.textContent).toBe('FELTÖLTÉS');

        // Slide 7 (Intro 4/4)
        ui.updateTimeline(7, { metadata: { section: 'intro' } });
        expect(ui.timelineFillEls[0].style.width).toBe('100%');
        expect(ui.timelineFillEls[1].style.width).toBe('0%');
    });

    test('should calculate correct fill for Stations (Slide 8-27)', () => {
        // Slide 8 (Station 1, Step 1/4)
        ui.updateTimeline(8, { metadata: { section: 'station_1' } });
        expect(ui.timelineFillEls[0].style.width).toBe('100%');
        expect(ui.timelineFillEls[1].style.width).toBe('25%');
        expect(ui.timelineFillEls[2].style.width).toBe('0%');
        expect(ui.stationLabelEl.textContent).toBe('ÁLLOMÁS');
        expect(ui.stationTextEl.textContent).toBe('ÜZENETEK KRIPTÁJA');

        // Slide 11 (Station 1, Step 4/4)
        ui.updateTimeline(11, { metadata: { section: 'station_1' } });
        expect(ui.timelineFillEls[1].style.width).toBe('100%');
        expect(ui.timelineFillEls[2].style.width).toBe('0%');
    });

    test('should calculate correct fill for Final (Slide 28-31)', () => {
        // Slide 28 (Final 1/4)
        ui.updateTimeline(28, { metadata: { section: 'final' } });
        expect(ui.timelineFillEls[5].style.width).toBe('100%');
        expect(ui.timelineFillEls[6].style.width).toBe('25%');
        expect(ui.stationLabelEl.textContent).toBe('ÁLLOMÁS');
        expect(ui.stationTextEl.textContent).toBe('RENDSZERMAG');

        // Slide 31 (Summary 4/4)
        ui.updateTimeline(31, { metadata: { section: 'final' } });
        expect(ui.timelineFillEls[6].style.width).toBe('100%');
    });

    test('should handle onboarding slides (Slide 1-3)', () => {
        ui.updateTimeline(1, { metadata: { section: 'onboarding' } });
        expect(ui.timelineFillEls[0].style.width).toBe('0%');
        
        ui.updateTimeline(3, { metadata: { section: 'onboarding' } });
        expect(ui.timelineFillEls[0].style.width).toBe('0%');
    });

    test('should handle edge cases and non-numeric input', () => {
        ui.updateTimeline('welcome', { metadata: { section: 'onboarding' } });
        expect(ui.stationLabelEl.textContent).toBe('INTRO');
        expect(ui.stationTextEl.textContent).toBe('FELTÖLTÉS');
        // Widths should remain unchanged or stay at 0
        expect(ui.timelineFillEls[0].style.width).toBe('0%');
    });
});
