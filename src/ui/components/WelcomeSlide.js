/**
 * WelcomeSlide - Üdvözlő képernyő
 * 
 * Funkciók:
 * - Hangulatkeltő háttér (Grade-specifikus kép)
 * - Fix konténer (1100x740)
 * - Bevezető szöveg
 * - START gomb: Ez indítja a globális időmérést!
 */
class WelcomeSlide {
    constructor(slideData, options = {}) {
        this.slideData = slideData;
        this.onNext = options.onNext || (() => { });
        this.timeManager = options.timeManager; // Fontos!

        this.element = null;
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'dkv-slide-container dkv-welcome-slide';

        // Háttérképet már a wrapper kezeli globálisan!

        // Fix méretű konténer
        const container = document.createElement('div');
        container.className = 'dkv-onboarding-container';

        // Cím
        const title = document.createElement('h1');
        title.className = 'dkv-slide-title dkv-welcome-title';
        title.textContent = this.slideData.title;

        // Szöveg
        const desc = document.createElement('p');
        desc.className = 'dkv-slide-description';
        desc.textContent = this.slideData.description;

        // Start gomb (jobb alul)
        const startBtn = document.createElement('button');
        startBtn.className = 'dkv-button dkv-start-button dkv-onboarding-next-btn';
        startBtn.textContent = this.slideData.content.buttonText || 'INDITÁS';

        // START gomb logika
        startBtn.onclick = () => {
            this.handleStart();
        };

        container.appendChild(title);
        container.appendChild(desc);
        container.appendChild(startBtn);

        this.element.appendChild(container);

        return this.element;
    }

    handleStart() {
        // 1. Időmérés indítása
        if (this.timeManager) {
            this.timeManager.startCompetition();
            console.log('Verseny időmérés elindítva!');
        } else {
            console.warn('TimeManager hiányzik, az idő nem indult el!');
        }

        // 2. Tovább lépés
        this.onNext();
    }
}

export default WelcomeSlide;
