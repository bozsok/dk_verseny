import GameLogger from '../../../../core/logging/GameLogger.js';
import Typewriter from '../../../../utils/Typewriter.js';
import { LIBRARY_DATA, METADATA_CATEGORIES } from './LibraryData.js';
import './LibraryTask.css';

/**
 * LibraryTask - Logikai Könyvtár feladat (Station 3)
 */
export class LibraryTask {
    /**
     * @param {HTMLElement} container - A befoglaló DOM elem
     * @param {Object} options - Feladat beállítások
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = options;
        this.onComplete = options.onComplete || (() => { });
        this.logger = options.logger || new GameLogger({ level: 'INFO', enableConsole: true });
        this.stateManager = options.stateManager;
        this.typewriter = new Typewriter();

        // Évfolyam lekérése és feladatszám meghatározása
        this.currentGrade = this.stateManager?.getState('currentGrade') || 4;
        this.taskCount = this.getTaskCountForGrade(this.currentGrade);

        // Játék állapot
        this.currentIndex = 0;
        this.score = 0;
        this.selectedMetadataIndex = null;
        this.isProcessing = false;
        this.isIntroSkipped = false;
        this.startTime = Date.now();
        this.timeouts = [];

        // Feladatsor generálása
        this.rounds = this.generateRounds();

        this.element = null;
        this.init();
    }

    /**
     * Feladatszám meghatározása évfolyam alapján.
     * @param {number} grade 
     * @returns {number}
     */
    getTaskCountForGrade(grade) {
        if (grade === 5) return 8;
        if (grade === 6) return 10;
        return 6; // Alapértelmezett (4. osztály)
    }

    /**
     * Feladatsor összeállítása: véletlenszerű képek és kategóriák.
     */
    generateRounds() {
        // Képek véletlenszerű sorrendbe rakása
        const shuffledImages = this.shuffle([...LIBRARY_DATA]);
        const selectedImages = shuffledImages.slice(0, this.taskCount);

        return selectedImages.map(image => {
            // Véletlenszerű kategória választása
            const categories = Object.keys(METADATA_CATEGORIES);
            const categoryKey = categories[Math.floor(Math.random() * categories.length)].toLowerCase();

            // 2 disztraktor választása ugyanabból a kategóriából
            const otherImages = LIBRARY_DATA.filter(img => img.id !== image.id);
            const shuffledOthers = this.shuffle([...otherImages]);
            const distractors = shuffledOthers.slice(0, 2).map(img => img.metadata[categoryKey]);

            // Opciók összeállítása és keverése
            const options = this.shuffle([
                { text: image.metadata[categoryKey], isCorrect: true },
                { text: distractors[0], isCorrect: false },
                { text: distractors[1], isCorrect: false }
            ]);

            return {
                image: image.image,
                categoryName: METADATA_CATEGORIES[categoryKey.toUpperCase()],
                options: options
            };
        });
    }

    /**
     * Fisher-Yates keverés.
     */
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    init() {
        this.logger.info(`LibraryTask initialized (Grade: ${this.currentGrade}, Tasks: ${this.taskCount})`);
        this.render();
    }

    render() {
        this.container.innerHTML = '';

        this.element = document.createElement('div');
        this.element.className = 'dkv-library-container';

        const titleText = `RENDSZER FELÜLÍRÁS ELINDÍTVA: <span style="color: var(--lib-cyan);">LOGIKAI KÖNYVTÁR INICIALIZÁLVA</span>`;
        const subtitleText = `Rendszerezd a könyvtár adatait! Válaszd ki a képhez tartozó helyes metaadat leírást. A kép kattintással nagyítható.`;

        this.element.innerHTML = `
            <div class="glass-panel">
                <div class="scanline"></div>
                
                <div class="dkv-library__header">
                    <span class="dkv-library__header-label">RENDSZERSZINTŰ KIVÉTEL // KÖNYVTÁRI PROTOKOLL</span>
                    <h1 class="dkv-library__title"></h1>
                    <p class="dkv-library__subtitle"></p>
                    <button class="dkv-library__help-btn">?</button>
                </div>

                <!-- HELP OVERLAY -->
                <div class="dkv-library__help-overlay">
                    <div class="dkv-library__help-content">
                        <div class="dkv-library__help-header">
                            <span class="dkv-library__help-label">RENDSZER SEGÉDLET // KÖNYVTÁRI ADATBÁZIS</span>
                            <button class="dkv-library__help-close">×</button>
                        </div>
                        <p class="dkv-library__help-text">
                            A könyvtár metaadatainak helyreállításához párosítsd össze a megjelenő képet a hozzá tartozó leírással. 
                            Válassz egyet a három kártya közül, majd nyomd meg a TOVÁBB gombot. 
                            A rendszer 2.5 másodperc alatt kiértékeli a döntésedet.
                        </p>
                    </div>
                </div>

                <div class="dkv-library__main-viewport">
                    <div class="dkv-library__stage-tracker">
                        <span>METAADAT CIKLUS:</span>
                        <div class="dkv-library__stage-dots">
                            ${Array(this.taskCount).fill('<div class="stage-dot"></div>').join('')}
                        </div>
                        <span class="stage-text">1/${this.taskCount}</span>
                    </div>
                    <div class="dkv-library__content-wrapper">
                        <div class="dkv-library__image-container">
                             <img class="dkv-library__task-image" src="" alt="Task image">
                        </div>
                        <div class="dkv-library__cards-container">
                            <!-- Cards will be injected here -->
                        </div>
                    </div>
                </div>

                <div class="dkv-library__footer">
                    <div class="dkv-library__system-status">
                        <div><span class="status-dot status-dot--green"></span> NEURÁLIS KAPCSOLAT: AKTÍV</div>
                        <div><span class="status-dot status-dot--magenta" style="background: #ff51fa; animation: pulse 1s infinite;"></span> KÖNYVTÁR ANALÍZIS: <span class="phase-label">FOLYAMATBAN</span></div>
                    </div>
                    <button class="dkv-library__execute-btn" disabled>TOVÁBB</button>
                </div>
            </div>
        `;

        this.container.appendChild(this.element);

        this.imageEl = this.element.querySelector('.dkv-library__task-image');
        this.cardsContainer = this.element.querySelector('.dkv-library__cards-container');

        // Lightbox trigger a képre
        this.imageEl.addEventListener('click', () => {
            if (this.isProcessing || !this.rounds[this.currentIndex]) return;
            const round = this.rounds[this.currentIndex];
            this.showLightbox(round.image);
        });
        this.executeBtn = this.element.querySelector('.dkv-library__execute-btn');
        this.stageDots = this.element.querySelectorAll('.stage-dot');
        this.stageText = this.element.querySelector('.stage-text');

        const titleEl = this.element.querySelector('.dkv-library__title');
        const subtitleEl = this.element.querySelector('.dkv-library__subtitle');

        this.setupHelpLogic();

        // Átugrás funkció kattintásra (ha még az intrónál tartunk)
        this.element.addEventListener('click', () => {
            if (this.currentIndex === 0 && !this.isIntroSkipped && !this.isProcessing) {
                this.logger.info('Intro skipped by user click');
                this.skipIntro();
            }
        });

        // Bevezető animáció
        this.logger.info('Starting intro typewriter sequence');
        this.typewriter.type(titleEl, titleText, {
            speed: 20,
            hideCursorOnComplete: true,
            onComplete: () => {
                if (this.isIntroSkipped) return;
                this.typewriter.type(subtitleEl, subtitleText, {
                    speed: 10,
                    onComplete: () => {
                        if (this.isIntroSkipped) return;
                        this.logger.info('Intro sequences completed successfully');
                        this.isIntroSkipped = true; // Megakadályozzuk, hogy a későbbi kattintás skipIntro-t hívjon
                        this.startRound();
                    }
                });
            }
        });

        // Biztonsági időzítő: ha 5mp-en belül nem indulna el a feladat, kényszerítjük
        this.introFallback = setTimeout(() => {
            if (this.currentIndex === 0 && !this.isIntroSkipped && !this.element.querySelector('.dkv-library__main-viewport').classList.contains('visible')) {
                this.logger.warn('Intro sequence fallback triggered - starting round automatically');
                this.skipIntro();
            }
        }, 5000);
        this.timeouts.push(this.introFallback);

        this.executeBtn.addEventListener('click', () => this.handleNext());
    }

    /**
     * Bevezető animáció átugrása.
     */
    skipIntro() {
        if (this.isIntroSkipped) return;
        this.isIntroSkipped = true;
        this.typewriter.stop();
        if (this.introFallback) clearTimeout(this.introFallback);

        const titleEl = this.element.querySelector('.dkv-library__title');
        const subtitleEl = this.element.querySelector('.dkv-library__subtitle');

        const titleText = `RENDSZER FELÜLÍRÁS ELINDÍTVA: <span style="color: var(--lib-cyan);">LOGIKAI KÖNYVTÁR INICIALIZÁLVA</span>`;
        const subtitleText = `Rendszerezd a könyvtár adatait! Válaszd ki a képhez tartozó helyes metaadat leírást. A kép kattintással nagyítható.`;

        if (titleEl) titleEl.innerHTML = titleText;
        if (subtitleEl) subtitleEl.innerHTML = subtitleText;

        this.startRound();
    }

    /**
     * Aktuális kör indítása.
     */
    startRound() {
        if (this.currentIndex >= this.taskCount) {
            this.finishTask();
            return;
        }

        // Viewport megjelenítése az első körnél
        if (this.currentIndex === 0) {
            this.logger.info('Starting first round, making viewport visible');
            const viewport = this.element.querySelector('.dkv-library__main-viewport');
            viewport?.classList.add('visible');
        }

        // Biztonsági overlay bezárás, ha nyitva maradt volna egy timeout lejárta miatt
        const helpOverlay = this.element.querySelector('.dkv-library__help-overlay');
        if (helpOverlay) helpOverlay.classList.remove('open');

        this.isProcessing = false;
        this.selectedMetadataIndex = null;
        this.executeBtn.disabled = true;
        this.executeBtn.textContent = 'TOVÁBB';

        const round = this.rounds[this.currentIndex];

        // UI frissítése képletöltés védelemmel (Cache-biztos)
        this.imageEl.style.transition = 'none';
        this.imageEl.style.opacity = '0';
        this.imageEl.style.transform = 'scale(0.95)';

        // Kényszerített renderelés a DOM-ban a kezdőállapothoz
        void this.imageEl.offsetWidth;

        this.imageEl.onload = () => {
            this.imageEl.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            this.imageEl.style.opacity = '1';
            this.imageEl.style.transform = 'scale(1)';
        };

        // Ráhegesztjük a requestAnimationFrame-re, hogy gyors internet (Cache) 
        // esetén is érvényesüljön a 0 opacity fázis.
        requestAnimationFrame(() => {
            this.imageEl.src = round.image;
        });

        this.updateStageTracker();
        this.renderCards(round.options, round.categoryName);
    }

    /**
     * Kártyák renderelése.
     */
    renderCards(options, categoryName) {
        this.cardsContainer.innerHTML = '';

        options.forEach((option, index) => {
            const card = document.createElement('div');
            card.className = 'dkv-library__card';

            // Egyszerű fade-in start állapota
            card.style.opacity = '0';
            card.style.transition = 'opacity 0.4s ease';

            card.innerHTML = `
                <div class="dkv-library__card-header">
                    <span class="dkv-library__card-category">${categoryName}</span>
                    <span class="dkv-library__card-id">#ID-0${index + 1}</span>
                </div>
                <div class="dkv-library__card-text">${option.text}</div>
            `;

            card.addEventListener('click', () => {
                if (this.isProcessing) return;
                this.selectCard(index);
            });

            this.cardsContainer.appendChild(card);

            // Sima fade-in minden kártyánál egyszerre
            const cardAnimTimeout = setTimeout(() => {
                if (!this.element) return;
                card.style.opacity = '1';

                setTimeout(() => {
                    if (card) card.style.transition = '';
                }, 400);

            }, 50);
            this.timeouts.push(cardAnimTimeout);
        });
    }

    /**
     * Kártya kiválasztása.
     */
    selectCard(index) {
        const cards = this.cardsContainer.querySelectorAll('.dkv-library__card');
        cards.forEach((card, i) => {
            if (i === index) card.classList.add('selected');
            else card.classList.remove('selected');
        });

        this.selectedMetadataIndex = index;
        this.executeBtn.disabled = false;
    }

    /**
     * Stage tracker frissítése.
     */
    updateStageTracker() {
        this.stageDots.forEach((dot, idx) => {
            if (idx < this.currentIndex) dot.classList.add('completed');
            else if (idx === this.currentIndex) dot.classList.add('active');
            else dot.classList.remove('active', 'completed');
        });
        this.stageText.textContent = `${this.currentIndex + 1}/${this.taskCount}`;
    }

    /**
     * Tovább gomb kezelése (kiértékelés).
     */
    handleNext() {
        if (this.isProcessing || this.selectedMetadataIndex === null) return;
        this.isProcessing = true;
        this.executeBtn.disabled = true;

        const round = this.rounds[this.currentIndex];
        const selectedOption = round.options[this.selectedMetadataIndex];
        const cards = this.cardsContainer.querySelectorAll('.dkv-library__card');

        // Kiértékelés mód
        this.executeBtn.textContent = 'KIÉRTÉKELÉS...';

        cards.forEach((card, i) => {
            const option = round.options[i];

            // Csak a kiválasztott kártyát színezzük kerettel
            if (i === this.selectedMetadataIndex) {
                card.classList.add('revealed');
                if (option.isCorrect) {
                    card.classList.add('correct');
                } else {
                    card.classList.add('incorrect');
                }
            }

            // Ha elrontotta, a ténylegesen helyes kártyára teszünk egy pici jelzést
            if (option.isCorrect && !selectedOption.isCorrect) {
                card.classList.add('actual-correct');
            }
        });

        if (selectedOption.isCorrect) {
            this.score++;
        }

        // 4 másodperces várakozás a visszajelzés után, időzítő regisztrálása
        const evalTimeout = setTimeout(() => {
            this.currentIndex++;
            this.startRound();
        }, 4000);
        this.timeouts.push(evalTimeout);
    }

    /**
     * Feladat befejezése.
     */
    finishTask() {
        this.logger.info('LibraryTask completed', { score: this.score, max: this.taskCount });
        this.onComplete({
            success: true,
            points: this.score,
            maxPoints: this.taskCount,
            timeElapsed: Math.floor((Date.now() - this.startTime) / 1000)
        });
    }

    /**
     * Súgó panel kezelése.
     */
    setupHelpLogic() {
        const helpBtn = this.element.querySelector('.dkv-library__help-btn');
        const helpOverlay = this.element.querySelector('.dkv-library__help-overlay');
        const closeBtn = this.element.querySelector('.dkv-library__help-close');

        if (helpBtn && helpOverlay) {
            helpBtn.addEventListener('click', () => {
                helpOverlay.classList.add('open');
            });

            closeBtn?.addEventListener('click', () => {
                helpOverlay.classList.remove('open');
            });

            helpOverlay.addEventListener('click', (e) => {
                if (e.target === helpOverlay) {
                    helpOverlay.classList.remove('open');
                }
            });
        }
    }

    /**
     * Kép megjelenítése Lightbox-ban.
     * @param {string} imageSrc - A kép elérési útja
     */
    showLightbox(imageSrc) {
        if (!this.element) return;

        const overlay = document.createElement('div');
        overlay.className = 'dkv-library__lightbox-overlay';

        overlay.innerHTML = `
            <div class="dkv-library__lightbox-content">
                <button class="dkv-library__lightbox-close">×</button>
                <div class="dkv-library__lightbox-image-wrapper">
                    <img src="${imageSrc}" class="dkv-library__lightbox-image" alt="Nagyított kép">
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Kényszerített renderelés az animációhoz
        void overlay.offsetWidth;
        overlay.classList.add('open');

        const close = () => {
            overlay.classList.remove('open');
            setTimeout(() => overlay.remove(), 300);
        };

        overlay.querySelector('.dkv-library__lightbox-close').addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
    }

    destroy() {
        this.timeouts.forEach(t => clearTimeout(t));
        this.timeouts = [];
        this.typewriter.stop();
        if (this.introFallback) clearTimeout(this.introFallback);
        if (this.element) {
            this.element.remove();
        }
    }
}
