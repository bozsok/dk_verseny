/**
 * WelcomeSlide - Üdvözlő képernyő
 * 
 * Funkciók:
 * - Hangulatkeltő háttér (Grade-specifikus kép).
 * - Fix konténer (1100x740).
 * - UNIVERZÁLIS, Configból vezérelt stílusok.
 * - Bármilyen JS stílus tulajdonság (pl. textAlign, fontSize) működik.
 */
class WelcomeSlide {
    constructor(slideData, options = {}) {
        this.slideData = slideData;
        this.onNext = options.onNext || (() => { });
        this.timeManager = options.timeManager;

        this.element = null;
    }

    // Segédfüggvény a stílusok dinamikus alkalmazásához
    _applyStyles(element, styles) {
        if (!styles) return;
        Object.keys(styles).forEach(key => {
            // Kizárjuk a speciális, nem-stílus kulcsokat (pl. gap a konténernél kezeltük külön, de itt is működhetne)
            // Közvetlenül átadjuk az értéket az elem style objektumának
            // A JS automatikusan kezeli a camelCase konverziót, ha helyesen van írva a configban (pl. textAlign)
            try {
                element.style[key] = styles[key];
            } catch (e) {
                console.warn(`Nem sikerült alkalmazni a stílust: ${key}`, e);
            }
        });
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'dkv-slide-container dkv-welcome-slide';

        // Stílusok betöltése configból
        const customStyle = (this.slideData.content && this.slideData.content.style) || {};

        // Fix méretű konténer
        const container = document.createElement('div');
        container.className = 'dkv-onboarding-container';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.justifyContent = 'center';
        container.style.textAlign = 'center';

        // === CÍM (Title) ===
        const title = document.createElement('h1');
        title.className = 'dkv-slide-title';
        title.textContent = this.slideData.title;

        // Alapértelmezések (Fallback)
        title.style.color = 'white';
        title.style.marginBottom = '2rem';

        // Univerzális stílusalkalmazás (felülírja az alapokat)
        this._applyStyles(title, customStyle.title);

        // Külön kezelés: Impact esetén alapból normal súly, ha nincs felülírva
        if (customStyle.title && customStyle.title.fontFamily && customStyle.title.fontFamily.includes('Impact')) {
            if (!customStyle.title.fontWeight) title.style.fontWeight = 'normal';
        }


        // === LEÍRÁS (Description) Konténer ===
        const descContainer = document.createElement('div');
        descContainer.style.display = 'flex';
        descContainer.style.flexDirection = 'column';
        descContainer.style.maxWidth = '940px'; // Felhasználó által módosított érték
        descContainer.style.margin = '0 auto 2rem auto';

        // Gap kezelése (ez nem öröklődik a p-re, ez a konténeré)
        if (customStyle.description && customStyle.description.gap) {
            descContainer.style.gap = customStyle.description.gap;
        } else {
            descContainer.style.gap = '1rem';
        }

        const descLines = this.slideData.description.split('\n');

        // A description stílus objektumból kivesszük a gap-et, hogy ne próbálja ráhúzni a <p>-re (bár nem okozna gondot)
        const pStyles = { ...customStyle.description };
        delete pStyles.gap;

        descLines.forEach(line => {
            if (!line.trim()) return;

            const p = document.createElement('p');
            p.textContent = line;
            p.className = 'dkv-slide-description';
            p.style.margin = '0';

            // Univerzális stílusalkalmazás minden sorra
            this._applyStyles(p, pStyles);

            descContainer.appendChild(p);
        });


        // === START GOMB ===
        const startBtn = document.createElement('button');
        startBtn.className = 'dkv-button dkv-start-button dkv-onboarding-next-btn';
        startBtn.textContent = (this.slideData.content && this.slideData.content.buttonText) || 'INDÍTÁS';

        // Univerzális stílusalkalmazás
        this._applyStyles(startBtn, customStyle.button);

        startBtn.onclick = () => {
            this.handleStart();
        };

        container.appendChild(title);
        container.appendChild(descContainer);
        container.appendChild(startBtn);

        this.element.appendChild(container);

        return this.element;
    }

    handleStart() {
        if (this.timeManager) {
            this.timeManager.startCompetition();
            console.log('Verseny időmérés elindítva!');
        } else {
            console.warn('TimeManager hiányzik, az idő nem indult el!');
        }
        this.onNext();
    }
}

export default WelcomeSlide;
