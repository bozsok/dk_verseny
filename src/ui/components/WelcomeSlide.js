import Typewriter from '../../utils/Typewriter.js';

/**
 * WelcomeSlide - Üdvözlő képernyő
 * 
 * Funkciók:
 * - Hangulatkeltő háttér (Grade-specifikus kép).
 * - Fix konténer (1100x740).
 * - UNIVERZÁLIS, Configból vezérelt stílusok.
 * - HTML tartalom támogatása (innerHTML).
 * - TYPEWRITER EFFECT: A description szövege írógépszerűen jelenik meg.
 *   (HTML tagek kezelésével: tagek azonnal, szöveg késleltetve)
 */
class WelcomeSlide {
    constructor(slideData, options = {}) {
        this.slideData = slideData;
        this.onNext = options.onNext || (() => { });
        this.timeManager = options.timeManager;

        this.element = null;
        this.typewriter = new Typewriter();
        this.isAudioLocked = false;
        this.handleStart = this.handleStart.bind(this);
    }



    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'dkv-slide-container dkv-welcome-slide';



        const container = document.createElement('div');
        container.className = 'dkv-onboarding-container';

        const typingSpeed = (this.slideData.content && this.slideData.content.typingSpeed) || 0;
        const titleSpeed = typingSpeed;

        // === CÍM (Title) ===
        const title = document.createElement('h1');
        title.className = 'dkv-slide-title';

        // Ha van gépelés, akkor előkészítjük (init), hogy a layout meglegyen, de láthatatlan legyen.
        if (typingSpeed > 0) {
            this.typewriter.init(title, this.slideData.title);
        } else {
            title.innerHTML = this.slideData.title;
        }




        // === LEÍRÁS (Description) Konténer ===
        const descContainer = document.createElement('div');
        descContainer.className = 'dkv-slide-description-container';

        // Configból olvasott style logika törölve, CSS kezeli.

        const descLines = this.slideData.description.split('\n');



        // Sorok létrehozása
        const paragraphs = [];
        descLines.forEach(line => {
            if (!line.trim()) return;

            const p = document.createElement('p');
            p.className = 'dkv-slide-description';

            // Ha van gépelés, INIT.
            if (typingSpeed > 0) {
                this.typewriter.init(p, line);
            } else {
                p.innerHTML = line;
            }

            // this._applyStyles(p, pStyles); TÖRÖLVE

            descContainer.appendChild(p);
            paragraphs.push({ element: p, text: line });
        });


        // === START GOMB ===
        const startBtn = document.createElement('button');
        startBtn.className = 'dkv-button dkv-start-button dkv-onboarding-next-btn';
        startBtn.textContent = (this.slideData.content && this.slideData.content.buttonText) || 'INDÍTÁS';

        if (typingSpeed > 0) {
            startBtn.style.opacity = '0';
        }
        // startBtn.style.transition = ... CSS-ben van

        // this._applyStyles(startBtn, customStyle.button); // Törölve
        // this._applyHoverEffects(startBtn, customStyle.button); // Törölve (CSS hover)

        startBtn.onclick = () => {
            this.handleStart();
        };

        container.appendChild(title);
        container.appendChild(descContainer);
        container.appendChild(startBtn);

        this.element.appendChild(container);

        // === TYPEWRITER INDÍTÁSA ===
        if (typingSpeed > 0) {
            // Cím indítása (null tartalommal, mert már initeltük)
            this.typewriter.type(
                title,
                null,
                {
                    speed: titleSpeed,
                    showCursor: true,
                    onComplete: () => {
                        // Címről levesszük a kurzort, mert indul a leírás
                        const activeSpan = title.querySelector('.dkv-cursor-active');
                        if (activeSpan) activeSpan.classList.remove('dkv-cursor-active');

                        // Cím kész -> Jöhetnek a bekezdések
                        this._startTypewriterSequence(paragraphs, typingSpeed, startBtn);
                    }
                }
            );
        }

        return this.element;
    }

    _startTypewriterSequence(paragraphs, speed, btn) {
        let currentParagraphIndex = 0;

        const typeNextParagraph = () => {
            if (currentParagraphIndex >= paragraphs.length) {
                // VÉGE: Kurzor maradjon az utolsón (User kérése) -> NEM VESSZÜK LE.
                // Ha blokkolva van a hang miatt, akkor csak 0.5 opacity
                btn.style.opacity = this.isAudioLocked ? '0.5' : '1';
                return;
            }

            // Indul a következő:
            // Ha nem az első elem, akkor az előzőről most vesszük le a kurzort
            if (currentParagraphIndex > 0) {
                const prevP = paragraphs[currentParagraphIndex - 1].element;
                const activeSpan = prevP.querySelector('.dkv-cursor-active');
                if (activeSpan) activeSpan.classList.remove('dkv-cursor-active');
            }

            const pData = paragraphs[currentParagraphIndex];

            // Itt is null tartalommal hívjuk, mert már initeltük
            this.typewriter.type(pData.element, null, {
                speed: speed,
                showCursor: true,
                onComplete: () => {
                    currentParagraphIndex++;
                    typeNextParagraph();
                }
            });
        };

        // Azonnali indítás (nem kell timeout, mert a Cím után vagyunk)
        typeNextParagraph();
    }


    handleStart() {
        this.typewriter.stop();
        // Azonnali megjelenítés, ha megszakítják?
        // this.paragraphs.forEach... de most már mindegy, megyünk tovább.

        if (this.timeManager) {
            this.timeManager.startCompetition();
            console.log('Verseny időmérés elindítva!');
        } else {
            console.warn('TimeManager hiányzik, az idő nem indult el!');
        }
        this.onNext();
    }
    /**
     * Tovább gomb vezérlése kívülről (pl. audio miatt).
     * @param {boolean} enabled 
     */
    setNextButtonState(enabled) {
        this.isAudioLocked = !enabled;
        const btn = this.element ? this.element.querySelector('.dkv-start-button') : null;
        if (btn) {
            btn.disabled = !enabled;
            // Ha a Typewriter miatt még 0 az opacity, ne írjuk felül 0.5-tel!

            if (btn.style.opacity !== '0') {
                btn.style.opacity = enabled ? '1' : '0.5';
            }
            btn.style.cursor = enabled ? 'pointer' : 'default';
        }
    }
    destroy() {
        if (this.typewriter) {
            this.typewriter.stop();
        }
        if (this.element) {
            this.element.remove();
        }
        this.element = null;
    }
}

export default WelcomeSlide;
