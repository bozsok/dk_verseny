import { SLIDE_TYPES } from './slides-config.js'; // Csak a típusok kellenek

/**
 * SlideManager - A lineáris történet vezérlője
 * 
 * Felelős:
 * - A 30 dia állapotának kezeléséért
 * - Navigációért (előre lépés)
 * - Zárolások kezeléséért (csak akkor léphetsz tovább, ha kész a jelenlegi)
 */
class SlideManager {
    constructor(options = {}) {
        this.stateManager = options.stateManager;
        this.eventBus = options.eventBus;
        this.logger = options.logger;

        this.slides = [];
        this.currentIndex = 0; // 0-based index (0-29)
        this.currentSlide = null;
    }

    /**
     * Inicializálás egy adott évfolyamhoz (Async!)
     */
    async initForGrade(grade) {
        try {
            // Dinamikus import a megfelelő mappából
            const module = await import(`../../content/grade${grade}/config.js`);
            this.slides = module.createConfig();

            this.logger && this.logger.info(`Loaded config for grade ${grade}`, { slides: this.slides.length });
        } catch (error) {
            console.error(`Failed to load config for grade ${grade}:`, error);
            alert(`Hiba: A ${grade}. osztály anyaga még nem elérhető!`);
            throw error;
        }

        // 2. Mentett állapot betöltése (ha van)
        const savedIndex = this.stateManager.getStateValue('currentSlideIndex');

        if (savedIndex !== null && savedIndex >= 0 && savedIndex < this.slides.length) {
            this.currentIndex = savedIndex;
            this.logger && this.logger.info(`Restored slide index: ${this.currentIndex}`);
        } else {
            this.currentIndex = 0;
        }

        // 3. Jelenlegi dia beállítása
        this.updateCurrentSlide();

        // 4. Első dia feloldása
        this.slides[this.currentIndex].isLocked = false;

        return this.getCurrentSlide();
    }

    /**
     * Jelenlegi dia lekérése
     */
    getCurrentSlide() {
        return this.slides[this.currentIndex];
    }

    /**
     * Tovább lépés a következő diára
     * Csak akkor sikeres, ha a jelenlegi dia 'completed' vagy nem blokkoló
     */
    nextSlide() {
        // Ellenőrzés: Van-e következő?
        if (this.currentIndex >= this.slides.length - 1) {
            this.logger && this.logger.info('End of slides reached');
            this.eventBus && this.eventBus.emit('story:finished');
            return false;
        }

        // Lépés
        this.currentIndex++;
        this.updateCurrentSlide();

        // Következő feloldása
        this.slides[this.currentIndex].isLocked = false;

        // Állapot mentése
        this.stateManager.updateState({
            currentSlideIndex: this.currentIndex
        });

        // Event küldése
        this.eventBus && this.eventBus.emit('slide:changed', {
            slide: this.currentSlide,
            index: this.currentIndex,
            total: this.slides.length
        });

        return this.currentSlide;
    }

    /**
     * Jelenlegi dia megjelölése teljesítettként
     * (Pl. videó vége vagy feladat beküldése után hívjuk meg)
     */
    completeCurrentSlide() {
        if (this.currentSlide) {
            this.currentSlide.completed = true;
            this.eventBus && this.eventBus.emit('slide:completed', { slide: this.currentSlide });

            // Automatikus továbblépés (opcionális, de a folyamatosság miatt jó lehet)
            // A UI dönthet úgy, hogy csak feloldja a "Tovább" gombot
        }
    }

    /**
     * Belső helper a dia frissítéshez
     */
    updateCurrentSlide() {
        this.currentSlide = this.slides[this.currentIndex];
    }

    /**
     * Visszaadja az összes dia állapotát (pl. progress barhoz)
     */
    getSlidesStatus() {
        return this.slides.map(s => ({
            id: s.id,
            type: s.type,
            completed: s.completed,
            isCurrent: s === this.currentSlide
        }));
    }
}

export default SlideManager;
