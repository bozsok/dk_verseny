import GameLogger from '../../../../core/logging/GameLogger.js';
import Typewriter from '../../../../utils/Typewriter.js';
import './IslandTask.css';

/**
 * IslandTask - Anomáliák Szigete feladat (Station 4)
 * Végtelenített rúnaszalag, 5 körös nehézségi skálázással.
 */
export class IslandTask {
    /**
     * @param {HTMLElement} container - A befoglaló DOM elem
     * @param {Object} options - Feladat beállítások
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = options;
        this.onComplete = options.onComplete || (() => { });
        this.logger = options.logger || new GameLogger({ level: 'INFO', enableConsole: true });

        this.element = null;
        this.typewriter = new Typewriter();
        this.timeouts = [];
        this.animationId = null;
        this.lastTime = 0;

        // Játék állapot
        this.currentStage = 1;
        this.maxStages = 10;
        this.isTransitioning = false;
        this.selectedRune = null;
        this.beltOffset = 0;
        this.runes = []; // A szalag elemei
        this.beltRunesCount = 10;
        this.anomalyIndex = -1;
        this.totalPoints = 0;
        this.startTime = Date.now();
        this.assetManifest = { rune: [], crystal: [], core: [] };
        this.isScanning = true;
        this.lastRotationTime = 0; // Utolsó dinamikus rotáció ideje

        // Sebességek körönként (ms / pixel vagy másodperc / képernyő)
        // A felhasználó kérte: 10, 8, 6, 6, 6, 6, 6, 6, 5, 4 másodperc / képernyő szélesség (1200px)
        this.stageSpeeds = [0, 10, 8, 6, 6, 6, 6, 6, 6, 5, 4];

        this.init();
    }

    async init() {
        this.logger.info('IslandTask initialized (Station 4)');

        // Először megvárjuk az assetek beolvasását
        await this.scanAssets();

        // Csak ha megvan a lista, akkor rajzolunk és indítjuk a fázisokat
        this.render();
    }

    render() {
        this.container.innerHTML = '';

        this.element = document.createElement('div');
        this.element.className = 'dkv-island-container';

        // Fix szövegek (ezeket nem írógéppel írjuk a fejlécben, de a súgóban igen)
        const titleText = `RENDSZER FELÜLÍRÁS ELINDÍTVA: <span style="color: var(--isl-cyan);">ANOMÁLIA ANALÍZIS</span>`;
        const subtitleText = `A szigetről kimenő adatfolyam anomáliákat tartalmaz. A feladatod azonosítani azt az egyetlen rúnát, amely nem illik a sorozatba.`;

        this.element.innerHTML = `
            <div class="glass-panel">
                <div class="scanline"></div>
                
                <div class="dkv-island__header">
                    <span class="dkv-island__header-label">RENDSZERSZINTŰ KIVÉTEL // ANOMÁLIA PROTOKOLL</span>
                    <h1 class="dkv-island__title"></h1>
                    <p class="dkv-island__subtitle"></p>
                    <button class="dkv-island__help-btn">?</button>
                </div>

                <!-- HELP OVERLAY -->
                <div class="dkv-island__help-overlay">
                    <div class="dkv-island__help-content">
                        <div class="dkv-island__help-header">
                            <span class="dkv-island__help-label">RENDSZER SEGÉDLET // ANOMÁLIA PROTOKOLL</span>
                            <button class="dkv-island__help-close">×</button>
                        </div>
                        <div class="dkv-island__help-text">
                            <!-- Ide kerül az írógép tartalom -->
                        </div>
                    </div>
                </div>

                <div class="dkv-island__viewport-container" style="position: relative; flex: 1; display: flex; flex-direction: column;">
                    <div class="dkv-island__stage-tracker">
                        <span>ADAT CIKLUS:</span>
                        <div class="dkv-island__stage-dots"></div>
                        <span class="dkv-island__stage-text">1/10</span>
                    </div>
                    <div class="dkv-island__main-viewport">
                        <div class="dkv-island__telemetry dkv-island__telemetry--top"></div>
                        <div class="dkv-island__rune-belt"></div>
                        <div class="dkv-island__telemetry dkv-island__telemetry--bottom"></div>
                        <div class="dkv-island__interference-layer"></div>
                    </div>
                </div>

                <div class="dkv-island__footer">
                    <div class="dkv-island__system-status">
                        <div><span class="status-dot status-dot--green"></span> NEURÁLIS KAPCSOLAT: AKTÍV</div>
                        <div><span class="status-dot status-dot--magenta" style="background: #ff51fa; animation: pulse 1s infinite;"></span> SZKENNER ÁLLAPOT: ONLINE</div>
                    </div>
                    <button class="dkv-island__execute-btn" disabled>ELLENŐRZÉS</button>
                </div>
            </div>
        `;

        this.container.appendChild(this.element);

        this.viewport = this.element.querySelector('.dkv-island__main-viewport');
        this.beltElement = this.element.querySelector('.dkv-island__rune-belt');
        this.interferenceLayer = this.element.querySelector('.dkv-island__interference-layer');
        this.executeBtn = this.element.querySelector('.dkv-island__execute-btn');
        this.stageLabel = this.element.querySelector('.dkv-island__header-label');
        this.stageDotsContainer = this.element.querySelector('.dkv-island__stage-dots');
        this.stageText = this.element.querySelector('.dkv-island__stage-text');
        this.telemetryTop = this.element.querySelector('.dkv-island__telemetry--top');
        this.telemetryBottom = this.element.querySelector('.dkv-island__telemetry--bottom');

        // Pöttyök inicializálása
        this.renderStageDots();

        this.setupHelpLogic();
        this.setupInteractions();
        this.startIntro(titleText, subtitleText);
    }

    startIntro(titleText, subtitleText) {
        const titleEl = this.element.querySelector('.dkv-island__title');
        const subtitleEl = this.element.querySelector('.dkv-island__subtitle');
        this.isIntroSkipped = false;

        // Skip intro on click anywhere on the container
        this.element.addEventListener('click', () => {
            if (!this.isIntroSkipped) this.skipIntro(titleText, subtitleText);
        }, { once: true });

        this.typewriter.type(titleEl, titleText, {
            speed: 20,
            hideCursorOnComplete: true, // User kérése: a cím végén ne maradjon kurzor
            onComplete: () => {
                if (this.isIntroSkipped) return;
                this.typewriter.type(subtitleEl, subtitleText, {
                    speed: 10,
                    onComplete: () => {
                        if (!this.isIntroSkipped) {
                            this.isIntroSkipped = true;
                            this.startStage(1);
                        }
                    }
                });
            }
        });
    }

    skipIntro(titleText, subtitleText) {
        if (this.isIntroSkipped) return;
        this.isIntroSkipped = true;
        this.typewriter.stop();

        const titleEl = this.element.querySelector('.dkv-island__title');
        const subtitleEl = this.element.querySelector('.dkv-island__subtitle');

        if (titleEl) titleEl.innerHTML = titleText;
        if (subtitleEl) subtitleEl.innerHTML = subtitleText;

        this.startStage(1);
    }

    /**
     * Egy adott kör elindítása.
     */
    startStage(stage) {
        // Best Practice: Központi állapot-reset minden kör elején
        this.resetRoundState();

        this.currentStage = stage;
        this.isTransitioning = false;
        this.lastRotationTime = performance.now();

        // Fixen rúnákat használunk (User kérése)
        this.currentCategory = 'rune';

        // Viewport megjelenítése az első körnél
        if (stage === 1) {
            this.viewport.classList.add('visible');
        }

        this.updateStageDots();
        this.generateRunes();
        this.renderRunes();
        this.initInterference();

        // Animációs loop indítása, ha még nem fut
        if (!this.animationId) {
            this.lastTime = performance.now();
            this.animate(this.lastTime);
        }
    }

    /**
     * Best Practice: Állapot és UI teljes alaphelyzetbe állítása a körök között.
     */
    resetRoundState() {
        // 1. Időzítők takarítása (Project Context Rule 105)
        this.timeouts.forEach(clearTimeout);
        this.timeouts = [];

        // 2. Logikai állapot reset
        this.selectedRune = null;
        this.isTransitioning = false;
        this.beltOffset = 0;

        // 3. UI elemek takarítása
        if (this.executeBtn) {
            this.executeBtn.disabled = true;
            this.executeBtn.textContent = 'TOVÁBB';
        }

        if (this.viewport) {
            this.viewport.classList.remove('shake');
        }

        // 4. Szalag (Belt) és rúnák explicit ürítése
        if (this.beltElement) {
            this.beltElement.innerHTML = '';
        }

        this.runes = [];
    }

    renderStageDots() {
        if (!this.stageDotsContainer) return;
        this.stageDotsContainer.innerHTML = '';
        for (let i = 0; i < this.maxStages; i++) {
            const dot = document.createElement('div');
            dot.className = 'stage-dot';
            this.stageDotsContainer.appendChild(dot);
        }
    }

    updateStageDots() {
        if (!this.stageDotsContainer) return;
        const dots = this.stageDotsContainer.querySelectorAll('.stage-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active', 'completed');
            if (index < this.currentStage - 1) {
                dot.classList.add('completed');
            } else if (index === this.currentStage - 1) {
                dot.classList.add('active');
            }
        });

        if (this.stageText) {
            this.stageText.textContent = `${this.currentStage}/${this.maxStages}`;
        }
    }

    /**
     * Pásztázza a mappákat a létező képek sorszámai után (1-30 tartományban).
     */
    async scanAssets() {
        this.logger.info('Scanning assets...');

        // 1. Megpróbáljuk a profi utat: lekérdezzük a Vite szervertől az API-n keresztül
        try {
            const response = await fetch('/__api/island-assets');
            if (response.ok) {
                const data = await response.json();
                this.assetManifest = data;
                this.logger.info('Assets scanned successfully via API:', this.assetManifest);
                this.isScanning = false;
                return;
            }
        } catch (err) {
            this.logger.warn('Island Assets API not available, falling back to probing.', err);
        }

        // 2. Fallback: Ha az API nem elérhető (pl. éles buildben), marad a robusztus ujjlenyomat-ellenőrzés
        const categories = ['rune', 'crystal', 'core'];
        const probeLimit = 30;

        const scanPromises = categories.map(async (cat) => {
            const foundIds = [];
            const probes = [];

            for (let i = 1; i <= probeLimit; i++) {
                const id = i.toString().padStart(2, '0');
                const url = `assets/images/grade4/island/${cat}/${id}.png`;

                probes.push(
                    fetch(url)
                        .then(async (res) => {
                            if (res.ok) {
                                const blob = await res.blob();
                                if (blob.type.includes('image') || blob.size > 1000) {
                                    const buffer = await blob.slice(0, 4).arrayBuffer();
                                    const view = new Uint8Array(buffer);
                                    if (view[0] === 0x89 && view[1] === 0x50 && view[2] === 0x4E && view[3] === 0x47) {
                                        foundIds.push(id);
                                    }
                                }
                            }
                        })
                        .catch(() => { })
                );
            }

            await Promise.all(probes);
            this.assetManifest[cat] = foundIds.sort();
        });

        await Promise.all(scanPromises);
        this.isScanning = false;
        this.logger.info('Assets scanned via fallback probing:', this.assetManifest);
    }

    /**
     * Rúnák generálása a körhöz.
     */
    generateRunes() {
        this.runes = [];

        // Elérhető ID-k az aktuális kategóriából
        const availableIds = this.assetManifest[this.currentCategory] || [];

        // Biztonsági ellenőrzés: ha nincs elég kép, hiba
        if (availableIds.length < 2) {
            this.logger.error(`HIBA: Nem található elegendő kép a(z) ${this.currentCategory} kategóriában! Ellenőrizd a public/assets/images/grade4/island/ mappát.`);
            // Fallback csak a legvégső esetben, de nem találgatunk 15-ig
            if (availableIds.length === 0) {
                availableIds.push('03'); // Legalább egy létezőt adjunk hozzá, amit láttam a mappádban
                availableIds.push('04');
            }
        }

        // Alap rúnák kiválasztása a létezők közül
        const baseRuneId = availableIds[this.getRandomInt(0, availableIds.length - 1)];
        const anomalyRuneId = this.getDifferentRuneId(baseRuneId);

        this.anomalyIndex = this.getRandomInt(0, this.beltRunesCount - 1);

        // Telemetria frissítése kategória alapján
        this.updateTelemetryContent();

        for (let i = 0; i < this.beltRunesCount; i++) {
            const isAnomaly = i === this.anomalyIndex;
            const runeId = isAnomaly ? anomalyRuneId : baseRuneId;

            this.runes.push({
                id: runeId,
                isAnomaly: isAnomaly,
                startX: i * (380 + 64), // 380px szélesség + 64px (4rem) gap
                element: null,
                // A 9-10. körben szándékosan levesszük az anomália-forgatást (User kérése)
                rotation: (isAnomaly && this.currentStage >= 4 && this.currentStage <= 8) ? 90 : 0
            });
        }
    }

    /**
     * Telemetria szövegek beállítása kategória alapján (Következetes magyar feliratokkal).
     */
    updateTelemetryContent() {
        const telemetryData = {
            rune: {
                top: '[ RENDSZER-SZINTŰ ÁTÍRÁS ] [ MATERIA-KÓD: AKTÍV ] [ SZIMBÓLUM-INTEGRITÁS: MAX ] [ NEURÁLIS CSATOLÁS: ONLINE ]',
                bottom: 'ANOMÁLIA DETEKTOR: X: 000 Y: 000 | ÁLLAPOT: SZAKRÁLIS INTEGRITÁS ELLENŐRZÉSE... | KÓD: 0xAF'
            },
            crystal: {
                top: '[ REZONANCIA-ANALÍZIS ] [ FREKVENCIA: 432.12 THZ ] [ TÖRÉSMUTATÓ: STABIL ] [ OSZCILLÁCIÓ: ÉSZLELVE ]',
                bottom: 'ANOMÁLIA DETEKTOR: X: 000 Y: 000 | ÁLLAPOT: KRISTÁLYSZERKEZETI VIZSGÁLAT... | KÓD: 0xBC'
            },
            core: {
                top: '[ PLAZMA-STABILIZÁCIÓ ] [ HŐMÉRSÉKLET: 4500K ] [ FLUXUS-SZINT: KRITIKUS ] [ MAG-INTEGRITÁS: 88.2% ]',
                bottom: 'ANOMÁLIA DETEKTOR: X: 000 Y: 000 | ÁLLAPOT: TERMIKUS SZIGNATÚRA ANALÍZIS... | KÓD: 0xEE'
            }
        };

        const data = telemetryData[this.currentCategory] || telemetryData.rune;

        // Garantáljuk, hogy a szöveg elég hosszú legyen (min. 3000 pixel szélesség érzet)
        const repeatCount = 6;
        const topStr = (data.top + ' | ').repeat(repeatCount);
        const bottomStr = (data.bottom + ' | ').repeat(repeatCount);

        const topContent = `<span>${topStr}</span><span>${topStr}</span>`;
        const bottomContent = `<span>${bottomStr}</span><span>${bottomStr}</span>`;

        this.telemetryTop.innerHTML = `<div class="marquee">${topContent}</div>`;
        this.telemetryBottom.innerHTML = `<div class="marquee-reverse">${bottomContent}</div>`;

        // Eltároljuk az eredeti szöveget a zaj-frissítéshez
        this.baseBottomText = data.bottom;
    }

    getDifferentRuneId(baseId) {
        const availableIds = this.assetManifest[this.currentCategory] || [];
        if (availableIds.length < 2) return baseId === '01' ? '02' : '01';

        let newId;
        do {
            newId = availableIds[this.getRandomInt(0, availableIds.length - 1)];
        } while (newId === baseId);
        return newId;
    }

    /**
     * Rúnák kirajzolása a belt-re.
     */
    renderRunes() {
        this.beltElement.innerHTML = '';
        this.runes.forEach((rune, index) => {
            const runeDiv = document.createElement('div');
            runeDiv.className = 'dkv-island__rune';
            // Kezdeti pozíció (az animate fogja frissíteni)
            runeDiv.style.left = `0px`;

            if (rune.rotation) {
                runeDiv.style.transform = `rotate(${rune.rotation}deg)`;
            }

            const img = document.createElement('img');

            // Rule 117: Image Cache Safety hívásrend
            img.onload = () => { img.dataset.loaded = 'true'; };
            img.onerror = () => {
                this.logger.error(`Asset loading failed: ${img.src}`);
                // Megpróbáljuk a rúnát fallback-nek, ha a crystal/core még nincs kész
                if (this.currentCategory !== 'rune') {
                    img.src = `assets/images/grade4/island/rune/${rune.id}.png`;
                }
            };

            img.src = `assets/images/grade4/island/${this.currentCategory}/${rune.id}.png`;

            // Cache check
            if (img.complete && img.naturalWidth > 0) {
                img.dataset.loaded = 'true';
            }

            runeDiv.appendChild(img);

            runeDiv.addEventListener('click', () => this.selectRune(index));

            rune.element = runeDiv;
            this.beltElement.appendChild(runeDiv);
        });
    }

    /**
     * Rúna kijelölése.
     */
    selectRune(index) {
        if (this.isTransitioning) return;

        // Előző kijelölés törlése
        if (this.selectedRune !== null) {
            this.runes[this.selectedRune].element.classList.remove('selected');
        }

        this.selectedRune = index;
        this.runes[index].element.classList.add('selected');
        this.executeBtn.disabled = false;

        this.logger.info(`Rune ${index} selected (Anomaly: ${this.runes[index].isAnomaly})`);
    }

    /**
     * Interakciók beállítása (VÉGREHAJTÁS gomb).
     */
    setupInteractions() {
        this.executeBtn.addEventListener('click', () => {
            this.evaluate();
        });
    }

    /**
     * Kiértékelés.
     */
    evaluate() {
        if (this.selectedRune === null || this.isTransitioning) return;

        this.isTransitioning = true;
        this.executeBtn.disabled = true;

        const selectedRuneObj = this.runes[this.selectedRune];
        const isCorrect = selectedRuneObj.isAnomaly;

        if (isCorrect) {
            selectedRuneObj.element.classList.add('correct');
            this.totalPoints += 1; // Minden helyes találat 1 pont
        } else {
            selectedRuneObj.element.classList.add('incorrect');
            // Megmutatjuk a helyeset egy diszkrét pöttyel (LibraryTask stílus)
            this.runes[this.anomalyIndex].element.classList.add('actual-correct');
        }

        // 2,5 mp várakozás a visszajelzéssel
        const feedbackTimeout = setTimeout(() => {
            if (this.currentStage < this.maxStages) {
                this.nextStage();
            } else {
                this.finishTask();
            }
        }, 2500);
        this.timeouts.push(feedbackTimeout);
    }

    /**
     * Következő körre váltás (shake effekttel).
     */
    nextStage() {
        // Mielőtt rázkódni kezd, már levehetjük a jelöléseket (Best Practice UX)
        if (this.beltElement) {
            const runes = this.beltElement.querySelectorAll('.dkv-island__rune');
            runes.forEach(r => r.classList.remove('correct', 'incorrect', 'selected', 'actual-correct'));
        }

        this.viewport.classList.add('shake');

        const shakeTimeout = setTimeout(() => {
            this.viewport.classList.remove('shake');
            this.startStage(this.currentStage + 1);
        }, 1400); // 1.4s shake (Station 2 mintájára)
        this.timeouts.push(shakeTimeout);
    }

    /**
     * Feladat befejezése.
     */
    finishTask() {
        const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.onComplete({
            success: this.totalPoints > 0,
            points: this.totalPoints,
            maxPoints: this.maxStages, // A maximum elérhető pont 10
            timeElapsed: timeElapsed
        });
    }

    /**
     * Animációs ciklus a rúnák mozgatásához és zavaró effektekhez.
     */
    animate(currentTime) {
        if (!this.element) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        if (!this.isTransitioning) {
            // Mozgás sebesség: viewport szélesség (1200) / stageSpeed másodperc alatt
            const speed = 1200 / (this.stageSpeeds[this.currentStage] * 1000);
            const moveStep = speed * deltaTime;

            this.beltOffset -= moveStep;

            // Rúnák pozicionálása és végtelenítése (Seamless loop)
            const totalWidth = this.beltRunesCount * (380 + 64);

            this.runes.forEach((rune) => {
                // Sima modulo számítás, ami kezeli a negatív offsetet is
                let currentX = (rune.startX + this.beltOffset) % totalWidth;
                if (currentX < -380) currentX += totalWidth;
                if (currentX > totalWidth - 380) currentX -= totalWidth;

                // Dinamikus rotáció nehezítés (Stage 5-től felfelé)
                if (this.currentStage >= 5) {
                    let rotationInterval = 0;
                    if (this.currentStage === 5) rotationInterval = 6000;
                    else if (this.currentStage >= 6 && this.currentStage <= 8) rotationInterval = 4000;
                    else if (this.currentStage >= 9) rotationInterval = 3000;

                    if (rotationInterval > 0 && currentTime - this.lastRotationTime >= rotationInterval) {
                        this.lastRotationTime = currentTime;
                        this.runes.forEach(r => {
                            r.rotation = (r.rotation || 0) + 90;
                        });
                    }
                }

                // Csak a pozíciót állítjuk a konténeren
                rune.element.style.transform = `translateX(${currentX}px)`;

                // A forgatást csak a belső képre alkalmazzuk, hogy a szöveg (::after) álló maradjon
                const img = rune.element.querySelector('img');
                if (img) {
                    img.style.transform = rune.rotation ? `rotate(${rune.rotation}deg)` : 'none';
                }
            });
        }

        // Zavaró effektek frissítése - ezeknek mindig futniuk kell, akkor is ha a szalag áll!
        this.updateInterference(deltaTime);
        this.updateTelemetryNoise();

        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }

    /**
     * Dinamikus zaj generálása a telemetriába (Ugráló, színes, glitchy stílusban)
     */
    updateTelemetryNoise() {
        // Véletlenszerű remegés (Jitter) - még durvább rángatózás
        const jitterX = (Math.random() - 0.5) * 30;
        const jitterY = (Math.random() - 0.5) * 8;

        if (this.telemetryTop) this.telemetryTop.style.transform = `translate(${jitterX}px, ${jitterY}px)`;
        if (this.telemetryBottom) this.telemetryBottom.style.transform = `translate(${-jitterX}px, ${-jitterY}px)`;

        // Szín-glitch és villódzás
        const glitchRoll = Math.random();
        let activeColor = 'var(--isl-cyan)';
        let bgColor = 'rgba(0, 0, 0, 0.7)';

        if (glitchRoll > 0.95) {
            activeColor = '#ff0000'; // Zéró-szekvencia támadás (Vörös)
            bgColor = 'rgba(255, 0, 0, 0.2)';
        } else if (glitchRoll < 0.02) {
            activeColor = '#00ff00'; // Ritka zöld glitch
            bgColor = 'rgba(0, 255, 0, 0.2)';
        }

        if (this.telemetryTop) {
            this.telemetryTop.style.color = activeColor;
            this.telemetryTop.style.background = bgColor;
        }
        if (this.telemetryBottom) {
            this.telemetryBottom.style.color = (glitchRoll > 0.95) ? '#ff0000' : 'var(--isl-magenta)';
            this.telemetryBottom.style.background = bgColor;
        }

        if (Math.random() > 0.85) {
            const x = this.getRandomInt(100, 999);
            const y = this.getRandomInt(100, 999);
            const codes = ['ADAT-SZAKADÁS', 'SZINKRON-HIBA', 'VEKTOR-ELTÉRÉS', 'PUFFER-OVERFLOW', 'MINTA-ANOMÁLIA', 'KRITIKUS-ZAJ', 'ZÉRÓ-SZEKVENCIA'];
            const randomCode = codes[this.getRandomInt(0, codes.length - 1)];

            const updatedText = this.baseBottomText
                .replace(/X: \d+/, `X: ${x}`)
                .replace(/Y: \d+/, `Y: ${y}`)
                .replace(/KÓD: 0x[A-Z0-0]+/, `KÓD: 0x${this.getRandomInt(10, 99).toString(16).toUpperCase()}`);

            let displayStr = updatedText;
            if (Math.random() > 0.5) {
                const label = (glitchRoll > 0.95) ? '!!! TÁMADÁS !!!' : randomCode;
                displayStr = ` >>> [ ${label} ] <<< ` + updatedText;
            }

            const repeatCount = 6;
            const fullStr = (displayStr + ' | ').repeat(repeatCount);

            const marqueeTop = this.telemetryTop.querySelector('.marquee');
            const marqueeBottom = this.telemetryBottom.querySelector('.marquee-reverse');

            if (marqueeTop && Math.random() > 0.7) {
                marqueeTop.querySelectorAll('span').forEach(s => s.style.opacity = Math.random() > 0.3 ? '1' : '0.1');
            }

            if (marqueeBottom) {
                marqueeBottom.querySelectorAll('span').forEach(s => {
                    s.innerHTML = fullStr;
                    s.style.opacity = Math.random() > 0.2 ? '1' : '0.3';
                });
            }
        }
    }

    /**
     * Interferencia réteg inicializálása.
     */
    initInterference() {
        this.interferenceLayer.innerHTML = '';
        this.particles = [];

        const particleCount = 20 + (this.currentStage * 5); // Körönként több részecske
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.className = 'dkv-island__particle';

            const particleObj = {
                element: p,
                x: Math.random() * 1200,
                y: Math.random() * 400,
                vx: (Math.random() - 0.5) * 0.1,
                vy: (Math.random() - 0.5) * 0.1,
                life: Math.random() * 100
            };

            p.style.left = `${particleObj.x}px`;
            p.style.top = `${particleObj.y}px`;
            p.style.opacity = Math.random().toString();

            this.interferenceLayer.appendChild(p);
            this.particles.push(particleObj);
        }
    }

    /**
     * Interferencia frissítése (mozgás és véletlen glitch).
     */
    updateInterference(dt) {
        this.particles.forEach(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            if (p.x < 0) p.x = 1200;
            if (p.x > 1200) p.x = 0;
            if (p.y < 0) p.y = 400;
            if (p.y > 400) p.y = 0;

            p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
        });

        // Véletlen glitch-box (ritkábban)
        if (Math.random() < 0.02 * this.currentStage) {
            this.createGlitchBox();
        }

        // Véletlen vörös bevillanás (még ritkábban, a Zéró-szekvencia támadását jelzi)
        if (Math.random() < 0.005 * this.currentStage) {
            this.triggerRedFlash();
        }
    }

    createGlitchBox() {
        const box = document.createElement('div');
        box.className = 'dkv-island__glitch-box';

        const w = 50 + Math.random() * 150;
        const h = 20 + Math.random() * 50;
        const x = Math.random() * (1200 - w);
        const y = Math.random() * (400 - h);

        box.style.width = `${w}px`;
        box.style.height = `${h}px`;
        box.style.left = `${x}px`;
        box.style.top = `${y}px`;

        this.interferenceLayer.appendChild(box);

        setTimeout(() => {
            box.remove();
        }, 100 + Math.random() * 200);
    }

    /**
     * Vörös bevillanás (Zéró-szekvencia interferencia).
     */
    triggerRedFlash() {
        const viewport = this.element.querySelector('.dkv-library__main-viewport') || this.element.querySelector('.dkv-island__main-viewport');
        if (!viewport) return;

        viewport.classList.add('dkv-island__main-viewport--flash-red');
        const flashTimeout = setTimeout(() => {
            viewport.classList.remove('dkv-island__main-viewport--flash-red');
        }, 150);
        this.timeouts.push(flashTimeout);
    }

    /**
     * Súgó panel kezelése írógéppel.
     */
    setupHelpLogic() {
        const helpBtn = this.element.querySelector('.dkv-island__help-btn');
        const helpOverlay = this.element.querySelector('.dkv-island__help-overlay');
        const closeBtn = this.element.querySelector('.dkv-island__help-close');
        const helpTextContainer = this.element.querySelector('.dkv-island__help-text');

        const helpContent = `
            Keresd meg az egyetlen rejtett anomáliát az adatfolyamban! Jelöld ki a hibás elemet és kattints a TOVÁBB gombra az ellenőrzéshez!<br>
            Tíz cikluson keresztül kell az éleslátásodat tesztelve megtalálni az eltérést a rúnák között. Vigyázz, a rendszer instabil: a sebesség körönként nő, és az interferencia egyre erősebb!
        `;

        if (helpBtn && helpOverlay) {
            helpBtn.addEventListener('click', () => {
                helpOverlay.classList.add('open');
                if (helpTextContainer) helpTextContainer.innerHTML = helpContent;
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

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    destroy() {
        this.typewriter.stop();
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.timeouts.forEach(clearTimeout);
        this.timeouts = [];

        if (this.element) {
            this.element.remove();
        }
    }
}
