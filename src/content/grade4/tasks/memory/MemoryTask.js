import './MemoryTask.css';
import Typewriter from '../../../../utils/Typewriter.js';
import GameLogger from '../../../../core/logging/GameLogger.js';

/**
 * Fázisok definíciója
 */
const PHASES = {
    OBSERVATION: 'observation',
    ANALYSIS: 'analysis',
    SELECTION: 'selection'
};

const AVAILABLE_ICONS = [
    'battery.jpg', 'cable.jpg', 'camera.jpg', 'chip.jpg', 'cloud.jpg',
    'cpu.jpg', 'crystal.jpg', 'data_sphere.jpg', 'drone.jpg', 'fan.jpg',
    'frequency.jpg', 'fusion_core.jpg', 'hologram.jpg', 'keyboard.jpg', 'laser.jpg',
    'lens.jpg', 'mouse.jpg', 'neural_link.jpg', 'particles.jpg', 'ram.jpg',
    'router.jpg', 'scanner.jpg', 'server.jpg', 'shield.jpg', 'stellite_dish.jpg',
    'tool.jpg', 'vr.jpg', 'watch.jpg', 'wifi.jpg', 'wrench.jpg'
];

const ICON_NAMES_HU = {
    'battery.jpg': 'Akkumulátor',
    'cable.jpg': 'Adatkábel',
    'camera.jpg': 'Optikai szenzor',
    'chip.jpg': 'Mikrochip',
    'cloud.jpg': 'Felhőalapú tároló',
    'cpu.jpg': 'Központi processzor',
    'crystal.jpg': 'Kvarckristály',
    'data_sphere.jpg': 'Adat-gömb',
    'drone.jpg': 'Felderítő drón',
    'fan.jpg': 'Hűtőventilátor',
    'frequency.jpg': 'Frekvencia-modul',
    'fusion_core.jpg': 'Fúziós mag',
    'hologram.jpg': 'Hologram-projektor',
    'keyboard.jpg': 'Beviteli egység',
    'laser.jpg': 'Lézer-emitter',
    'lens.jpg': 'Fókuszlencse',
    'mouse.jpg': 'Mutatóeszköz',
    'neural_link.jpg': 'Neurális csatoló',
    'particles.jpg': 'Nanoreszecskék',
    'ram.jpg': 'Rendszermemória',
    'router.jpg': 'Hálózati elosztó',
    'scanner.jpg': 'Bioszkenner',
    'server.jpg': 'Adatközpont',
    'shield.jpg': 'Védelmi pajzs',
    'stellite_dish.jpg': 'Műholdvevő',
    'tool.jpg': 'Szervizszerszám',
    'vr.jpg': 'Virtuális szemüveg',
    'watch.jpg': 'Időmérő egység',
    'wifi.jpg': 'Vezeték nélküli adó',
    'wrench.jpg': 'Szerkezeti kulcs'
};

/**
 * @class MemoryTask
 * @description A memóriafeladatot vezérlő osztály háromfázisú megfigyeléssel és választással.
 */
export class MemoryTask {
    /**
     * @constructor
     * @param {HTMLElement} container - A befoglaló DOM elem.
     * @param {Object} [options={}] - Konfigurációs opciók.
     */
    constructor(container, options = {}) {
        /** @type {HTMLElement} */
        this.container = container;
        /** @type {Function} */
        this.onComplete = options.onComplete || (() => { });
        /** @type {Object|null} */
        this.eventBus = options.eventBus || null;

        /** @type {string} - Aktuális fázis */
        this.phase = PHASES.OBSERVATION;
        /** @type {Array<Object>} - Aktuális objektumok adatai */
        this.activeObjects = [];
        /** @type {Array<Object>} - Elhelyezett, de a 2. fázistól eltűnt objektumok */
        this.removedObjects = [];
        /** @type {Array<string>} - Félrevezető (csali) ikonok listája */
        this.distractionIcons = [];
        /** @type {Array<string>} - A kiválasztásnál használt ikonok */
        this.selectionOptions = [];
        /** @type {Set<string>} - A felhasználó által kiválasztott ikonok */
        this.selectedIcons = new Set();
        /** @type {number} - Tárgyak száma */
        this.objectCount = 20;

        /** @type {HTMLElement|null} */
        this.element = null;
        /** @type {HTMLElement|null} */
        this.executeBtn = null;
        /** @type {HTMLElement|null} */
        this.objectsLayer = null;
        /** @type {HTMLElement|null} */
        this.selectionLayer = null;

        /** @type {boolean} - Folyamatban van-e művelet */
        this.isProcessing = false;
        /** @type {Typewriter} */
        this.typewriter = new Typewriter();

        /** @type {number} - A feladat elindításának időpontja */
        this.startTime = Date.now();

        /** @type {GameLogger} */
        this.logger = options.logger || new GameLogger({ level: 'INFO', enableConsole: true });

        // Osztályspecifikus alapértékek
        const gradeDefaults = {
            4: { items: 6, removed: 2, options: 3 },
            5: { items: 8, removed: 2, options: 3 },
            6: { items: 10, removed: 3, options: 4 }
        };

        const currentGrade = options.stateManager?.state?.currentGrade || 4;
        const defaults = gradeDefaults[currentGrade] || gradeDefaults[4];

        // Konfiguráció betöltése (Debug Panel prioritás)
        const debugTasks = options.debugManager?.tasksConfig || {};
        this.config = {
            objectCount: debugTasks.qmItems || defaults.items,
            removedCount: debugTasks.qmRemoved || defaults.removed,
            selectionCount: debugTasks.qmOptions || defaults.options
        };

        // Többciklusos (Multi-stage) rendszer inicializálása
        this.currentStage = 1;
        this.maxStages = 3;
        this.totalScore = 0;
        this.totalMaxPoints = 0;

        /** @type {number[]} - Aktív időzítők listája a takarításhoz */
        this.timeouts = [];

        this.init();
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

    /**
     * Inicializálás.
     */
    init() {
        this.generateGameObjects();
        this.render();
    }

    /**
     * Game objektumok generálása az aspect-ratio torzítást kiküszöbölő ütközésvizsgálattal.
     * VERZIÓ 3.0 - 3-Phase Logic Initialized
     */
    generateGameObjects() {
        console.log("%c MemoryTask v3.0: 3-Phase Logic Initialized", "color: #00ffff; font-weight: bold;");
        const icons = this.shuffle([...AVAILABLE_ICONS]);
        const objects = [];

        const minDistanceX = 14;
        const minDistanceY = 20;
        const MAX_ATTEMPTS = 5000;

        for (let i = 0; i < this.config.objectCount; i++) {
            let found = false;
            let attempts = 0;

            while (!found && attempts < MAX_ATTEMPTS) {
                const x = 10 + Math.random() * 80;
                const y = 10 + Math.random() * 80;

                const collision = objects.some(other => {
                    const dx = Math.abs(x - other.x);
                    const dy = Math.abs(y - other.y);
                    return dx < minDistanceX && dy < minDistanceY;
                });

                if (!collision) {
                    objects.push({ id: `obj_${i}`, type: icons[i % icons.length], x, y });
                    found = true;
                }
                attempts++;
            }

            if (!found) {
                this.logger.warn(`MemoryTask: Nem sikerült helyet találni a(z) ${i}. tárgynak.`);
            }
        }

        this.activeObjects = objects;

        // 3. fázis előkészítése: hiányzó elemek kiválasztása
        const shuffledObjects = this.shuffle([...objects]);
        this.removedObjects = shuffledObjects.slice(0, this.config.removedCount);

        // Csali ikon kiválasztása
        const activeIconTypes = new Set(objects.map(o => o.type));
        const possibleDistractors = AVAILABLE_ICONS.filter(icon => !activeIconTypes.has(icon));
        const distractCount = Math.max(0, this.config.selectionCount - this.config.removedCount);
        this.distractionIcons = this.shuffle(possibleDistractors).slice(0, distractCount);

        // Keverjük össze a választási lehetőségeket (hiányzó + csalik)
        this.selectionOptions = this.shuffle([
            ...this.removedObjects.map(o => o.type),
            ...this.distractionIcons
        ]);
    }

    /**
     * UI Renderelés.
     */
    render() {
        this.container.innerHTML = '';

        this.element = document.createElement('div');
        this.element.className = 'dkv-memory-container';

        this.element.innerHTML = `
            <div class="glass-panel">
                <div class="scanline"></div>
                
                <div style="padding: 3rem 3rem 1rem 3rem; position: relative; z-index: 5;">
                    <span class="dkv-memory__header-label">RENDSZERSZINTŰ KIVÉTEL // MEMÓRIA MODUL</span>
                    <h1 class="dkv-memory__title"></h1>
                    <p class="dkv-memory__subtitle"></p>
                    <button class="dkv-memory__help-btn">?</button>
                </div>

                <!-- HELP OVERLAY -->
                <div class="dkv-memory__help-overlay">
                    <div class="dkv-memory__help-content">
                        <div class="dkv-memory__help-header">
                            <span class="dkv-memory__help-label">RENDSZER SEGÉDLET // MEMÓRIA PROTOKOLL</span>
                            <button class="dkv-memory__help-close">×</button>
                        </div>
                        <p class="dkv-memory__help-text">
                            Nagyíts a képre és próbáld megjegyezni a nevét, vagy a kinézetét, vagy a színét. Ezek mindegyike segíthet felismerni a hiányzó képeket.
                        </p>
                    </div>
                </div>

                <div class="dkv-memory__main-viewport" style="position: relative; z-index: 5;">
                    <div class="dkv-memory__stage-tracker">
                        <span>ADAT CIKLUS:</span>
                        <div class="dkv-memory__stage-dots">
                            <div class="stage-dot"></div>
                            <div class="stage-dot"></div>
                            <div class="stage-dot"></div>
                        </div>
                        <span class="stage-text">1/3</span>
                    </div>
                    <div class="dkv-memory__grid-overlay"></div>
                    <div class="dkv-memory__objects-layer"></div>
                    <div class="dkv-memory__selection-layer"></div>
                </div>

                <div class="dkv-memory__footer" style="position: relative; z-index: 5;">
                    <div class="dkv-memory__system-status">
                        <div><span class="status-dot status-dot--green"></span> NEURÁLIS KAPCSOLAT: AKTÍV</div>
                        <div><span class="status-dot status-dot--magenta"></span> MEMÓRIA FOLYAMAT: <span class="phase-label"></span></div>
                    </div>
                    <button class="dkv-memory__execute-btn">TOVÁBB</button>
                </div>
            </div>
        `;

        this.container.appendChild(this.element);

        this.objectsLayer = this.element.querySelector('.dkv-memory__objects-layer');
        this.selectionLayer = this.element.querySelector('.dkv-memory__selection-layer');
        this.executeBtn = this.element.querySelector('.dkv-memory__execute-btn');
        this.phaseLabel = this.element.querySelector('.phase-label');

        this.updateUI();
        this.setupHelpLogic();

        this.executeBtn.addEventListener('click', () => this.handleExecute());
    }

    /**
     * Végrehajtás/Tovább gomb kezelése.
     */
    handleExecute() {
        if (this.isProcessing) return;

        if (this.phase === PHASES.OBSERVATION) {
            this.phase = PHASES.ANALYSIS;
            this.updateUI();
        } else if (this.phase === PHASES.ANALYSIS) {
            this.phase = PHASES.SELECTION;
            this.updateUI();
        } else {
            if (this.currentStage < this.maxStages) {
                this.nextStage();
            } else {
                this.finishTask();
            }
        }
    }

    /**
     * Átvezetés a következő ciklusra (kiértékelés -> glitch effekt -> reset).
     */
    nextStage() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        // 1. Vizsgálat / Kiértékelés fázis
        this.executeBtn.disabled = true;
        this.executeBtn.textContent = 'KIÉRTÉKELÉS...';

        const correctOnes = new Set(this.removedObjects.map(o => o.type));
        const cards = this.selectionLayer.querySelectorAll('.dkv-memory__selection-card');

        let stageScore = 0;

        cards.forEach(card => {
            const icon = card.querySelector('img').alt;
            if (card.classList.contains('selected')) {
                card.classList.add('revealed');
                if (correctOnes.has(icon)) {
                    card.classList.add('correct');
                    stageScore++;
                } else {
                    card.classList.add('incorrect');
                }
            } else if (correctOnes.has(icon)) {
                // Megmutatjuk, mit hibázott el (opcionális, de hasznos)
                card.classList.add('revealed', 'missed');
            }
        });

        this.totalScore += stageScore;
        this.totalMaxPoints += this.config.removedCount;

        this.logger.info(`Stage ${this.currentStage} revealed. Stage Score: ${stageScore}/${this.config.removedCount}`);

        // Várás 3 másodpercig a kiértékelés után
        const t1 = setTimeout(() => {
            // 2. Vizuális átvezetés (Glitch)
            const viewport = this.element.querySelector('.dkv-memory__main-viewport');
            viewport.classList.add('transitioning', 'glitch-anim');

            const t2 = setTimeout(() => {
                // Adatok resetelése
                this.currentStage++;
                this.phase = PHASES.OBSERVATION;
                this.selectedIcons.clear();

                // UI ürítése
                this.objectsLayer.innerHTML = '';
                this.selectionLayer.innerHTML = '';
                this.selectionLayer.classList.remove('visible');
                this.objectsLayer.style.opacity = '1';
                viewport.classList.remove('no-grid');

                // Új tárgyak
                this.generateGameObjects();

                const t3 = setTimeout(() => {
                    viewport.classList.remove('transitioning', 'glitch-anim');
                    this.updateUI();
                    this.isProcessing = false;
                }, 600);
                this.timeouts.push(t3);
            }, 800);
            this.timeouts.push(t2);
        }, 3000);
        this.timeouts.push(t1);
    }

    /**
     * UI frissítése az aktuális fázisnak megfelelően.
     */
    updateUI() {
        const titleEl = this.element.querySelector('.dkv-memory__title');
        const subtitleEl = this.element.querySelector('.dkv-memory__subtitle');
        const viewport = this.element.querySelector('.dkv-memory__main-viewport');
        const footer = this.element.querySelector('.dkv-memory__footer');

        let subtitleText, phaseStatus;

        this.executeBtn.disabled = true;
        this.isProcessing = true;

        if (this.phase === PHASES.OBSERVATION) {
            const titleText = `RENDSZER FELÜLÍRÁS ELINDÍTVA: <span style="color: var(--memory-cyan);">MEGFIGYELÉS INICIALIZÁLVA</span>`;
            subtitleText = `Figyeld meg a terminálon megjelenő képeket! Legyél nagyon alapos, mert a követlező lépésnél ezekből el fognak tűnni. A képek kattintással nagyíthatók.`;
            phaseStatus = `MEGFIGYELÉS`;

            // Csak az első Stage-nél írjuk le karakterenként a főcímet
            if (this.currentStage === 1) {
                titleEl.innerHTML = '';
                subtitleEl.innerHTML = '';
                this.typewriter.stop();
                this.typewriter.type(titleEl, titleText, {
                    speed: 25,
                    hideCursorOnComplete: true,
                    onComplete: () => {
                        const t4 = setTimeout(() => {
                            this.typewriter.type(subtitleEl, subtitleText, {
                                speed: 15,
                                onComplete: () => {
                                    viewport.classList.add('visible');
                                    footer.classList.add('visible');
                                    this.renderObjects();
                                    this.isProcessing = false;
                                    this.executeBtn.disabled = false;
                                }
                            });
                        }, 200);
                        this.timeouts.push(t4);
                    }
                });
            } else {
                // Stage 2+ esetén a főcím azonnali, csak az alcím Typewriter
                titleEl.innerHTML = titleText;
                subtitleEl.innerHTML = '';
                this.typewriter.stop();
                this.typewriter.type(subtitleEl, subtitleText, {
                    speed: 15,
                    onComplete: () => {
                        viewport.classList.add('visible');
                        footer.classList.add('visible');
                        this.renderObjects();
                        this.isProcessing = false;
                        this.executeBtn.disabled = false;
                    }
                });
            }
        } else if (this.phase === PHASES.ANALYSIS) {
            subtitleText = `Most vedd észre, hogy pár kép eltűnik a terminál kijelzőjéről. A képek továbbra is nagyíthatók kattintással.`;
            phaseStatus = `ELLENŐRZÉS`;

            subtitleEl.innerHTML = '';
            this.typewriter.stop();
            this.typewriter.type(subtitleEl, subtitleText, {
                speed: 15,
                onComplete: () => {
                    this.renderObjects();
                    this.isProcessing = false;
                    this.executeBtn.disabled = false;
                }
            });
        } else {
            const countText = this.config.removedCount === 2 ? 'kettő' : 'három';
            subtitleText = `Mely képek tűntek el előbb? Válassz ki ${countText} képet!`;
            phaseStatus = `KIVÁLASZTÁS`;

            subtitleEl.innerHTML = '';
            this.typewriter.stop();
            this.typewriter.type(subtitleEl, subtitleText, {
                speed: 15,
                onComplete: () => {
                    viewport.classList.add('no-grid');
                    this.renderSelectionUI();
                    this.isProcessing = false;
                    this.executeBtn.disabled = true; // Kezdetben disabled, amíg nincs kiválasztás
                }
            });
        }

        this.phaseLabel.textContent = phaseStatus;

        // Gomb felirat és állapot
        if (this.phase === PHASES.SELECTION) {
            this.executeBtn.textContent = this.currentStage < this.maxStages ? 'KÖVETKEZŐ CIKLUS' : 'MŰVELET BEFEJEZÉSE';
        } else {
            this.executeBtn.textContent = 'TOVÁBB';
        }

        // Stage indikátor frissítése
        const dots = this.element.querySelectorAll('.stage-dot');
        dots.forEach((dot, idx) => {
            if (idx < this.currentStage) dot.classList.add('active');
            else dot.classList.remove('active');
        });
        this.element.querySelector('.stage-text').textContent = `${this.currentStage}/${this.maxStages}`;
    }

    /**
     * Tárgyak kirajzolása.
     */
    renderObjects() {
        this.objectsLayer.innerHTML = '';

        const removedIds = new Set(this.removedObjects.map(o => o.id));
        const objectsToRender = this.phase === PHASES.ANALYSIS
            ? this.activeObjects.filter(obj => !removedIds.has(obj.id))
            : this.activeObjects;

        objectsToRender.forEach(obj => {
            const el = document.createElement('div');
            el.className = 'dkv-memory__object';
            el.style.left = `${obj.x}%`;
            el.style.top = `${obj.y}%`;

            const img = document.createElement('img');
            img.src = `assets/images/grade4/memory/${obj.type}`;
            img.alt = obj.type;

            el.appendChild(img);
            this.objectsLayer.appendChild(el);

            // Nagyítás funkció
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showLightbox(obj.type, { x: obj.x, y: obj.y });
            });

            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 50 * Math.random());
        });
    }

    /**
     * Kiválasztó felület kirajzolása a 3. fázishoz.
     */
    renderSelectionUI() {
        this.objectsLayer.style.opacity = '0';
        this.selectionLayer.innerHTML = '';
        this.selectionLayer.classList.add('visible');

        this.selectionOptions.forEach(icon => {
            const card = document.createElement('div');
            card.className = 'dkv-memory__selection-card';

            const img = document.createElement('img');
            img.src = `assets/images/grade4/memory/${icon}`;
            img.alt = icon;

            card.appendChild(img);
            card.onclick = () => {
                if (card.classList.contains('selected')) {
                    card.classList.remove('selected');
                    this.selectedIcons.delete(icon);
                } else {
                    if (this.selectedIcons.size < this.config.removedCount) {
                        card.classList.add('selected');
                        this.selectedIcons.add(icon);
                    }
                }
                this.executeBtn.disabled = (this.selectedIcons.size !== this.config.removedCount);
            };

            this.selectionLayer.appendChild(card);
        });
    }

    /**
     * Feladat befejezése és pontozás (kiértékeléssel együtt).
     */
    finishTask() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        // 1. Vizsgálat / Kiértékelés fázis
        this.executeBtn.disabled = true;
        this.executeBtn.textContent = 'KIÉRTÉKELÉS...';

        const correctOnes = new Set(this.removedObjects.map(o => o.type));
        const cards = this.selectionLayer.querySelectorAll('.dkv-memory__selection-card');

        let finalStageScore = 0;

        cards.forEach(card => {
            const icon = card.querySelector('img').alt;
            if (card.classList.contains('selected')) {
                card.classList.add('revealed');
                if (correctOnes.has(icon)) {
                    card.classList.add('correct');
                    finalStageScore++;
                } else {
                    card.classList.add('incorrect');
                }
            } else if (correctOnes.has(icon)) {
                card.classList.add('revealed', 'missed');
            }
        });

        const finalScore = this.totalScore + finalStageScore;
        const finalMaxPoints = this.totalMaxPoints + this.config.removedCount;

        this.logger.info(`MemoryTask final analysis. Total Score: ${finalScore}/${finalMaxPoints}`);

        // Várás 3 másodpercig a végső kiértékelés után
        const t5 = setTimeout(() => {
            this.executeBtn.textContent = 'ADATOK KÜLDÉSE...';

            const t6 = setTimeout(() => {
                this.onComplete({
                    success: true,
                    points: finalScore,
                    maxPoints: finalMaxPoints,
                    timeElapsed: Math.floor((Date.now() - this.startTime) / 1000)
                });
            }, 1000);
            this.timeouts.push(t6);
        }, 3000);
        this.timeouts.push(t5);
    }

    /**
     * Elem vizsgáló (Lightbox) megjelenítése technikai adatokkal.
     * @param {string} iconType - Az ikon azonosítója.
     * @param {Object} pos - Az elem pozíciója.
     */
    showLightbox(iconType, pos) {
        const overlay = document.createElement('div');
        overlay.className = 'memory-lightbox-overlay';

        const hash = iconType.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
        const uid = `NODE-${Math.abs(hash).toString(16).toUpperCase()}-${iconType.length}`;
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

        overlay.innerHTML = `
            <div class="memory-lightbox-content">
                <button class="memory-lightbox-close">×</button>
                <div class="memory-lightbox-image-wrapper">
                    <img src="assets/images/grade4/memory/${iconType}" class="memory-lightbox-image" alt="analyzed object">
                </div>
                <div class="memory-lightbox-data">
                    <div class="memory-data-label">Rendszer elem kiértékelés</div>
                    <h3>${ICON_NAMES_HU[iconType] || iconType.replace(/_/g, ' ').replace('.jpg', '')}</h3>
                    
                    <div class="memory-data-row">
                        <span class="memory-data-label">Egyedi azonosító (UID)</span>
                        <span class="memory-data-value">${uid}</span>
                    </div>
                    <div class="memory-data-row">
                        <span class="memory-data-label">Hálózati koordináták</span>
                        <span class="memory-data-value">X: ${pos.x.toFixed(2)} | Y: ${pos.y.toFixed(2)}</span>
                    </div>
                    <div class="memory-data-row">
                        <span class="memory-data-label">Utolsó észlelt állapot</span>
                        <span class="memory-data-value">${timestamp}</span>
                    </div>
                    <div class="memory-data-row">
                        <span class="memory-data-label">Státusz</span>
                        <span class="memory-data-value" style="color: #00ff00;">STABIL // ELEMZÉS KÉSZ</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('open'));

        const close = () => {
            overlay.classList.remove('open');
            setTimeout(() => overlay.remove(), 400);
        };

        overlay.querySelector('.memory-lightbox-close').onclick = close;
        overlay.onclick = (e) => { if (e.target === overlay) close(); };
    }

    /**
     * Segítség panel kezelése.
     */
    setupHelpLogic() {
        const helpBtn = this.element.querySelector('.dkv-memory__help-btn');
        const helpOverlay = this.element.querySelector('.dkv-memory__help-overlay');
        const closeBtn = this.element.querySelector('.dkv-memory__help-close');

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

    destroy() {
        // Időzítők megállítása a memóriaszivárgás ellen
        this.timeouts.forEach(t => clearTimeout(t));
        this.timeouts = [];
        
        this.typewriter.stop();
        if (this.element) {
            this.element.remove();
        }
    }
}
