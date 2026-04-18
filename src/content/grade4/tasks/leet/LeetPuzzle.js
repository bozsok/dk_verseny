/**
 * @module LeetPuzzle
 * @description 4. osztályos "Quantum Terminál" állomás feladat. Informatikai szavak dekódolása 'leet' kódolással.
 */

import './LeetPuzzle.css';
import Typewriter from '../../../../utils/Typewriter.js';
import GameLogger from '../../../../core/logging/GameLogger.js';

/** @constant {string[]} BASE_WORDS - Az alapértelmezett szókészlet a dekódoláshoz */
const BASE_WORDS = [
    'HARDVER', 'SZOFTVER', 'ALGORITMUS', 'SZEKVENCIA', 'PROGRAM',
    'MONITOR', 'RENDSZERMAG', 'KRIPTA', 'BIRODALOM', 'ADAT'
];

/** @constant {Object} LEET_MAP - A karakterek és 'leet' kódolt párjaik leképezése (teljes ábécé) */
const LEET_MAP = {
    'A': '4', 'B': 'I3', 'C': '[', 'D': ')', 'E': '3',
    'F': '|=', 'G': '6', 'H': '#', 'I': '1', 'J': ',_|',
    'K': '>|', 'L': '|_', 'M': '/\\/\\', 'N': '^/', 'O': '0',
    'P': '|*', 'Q': '(_,)', 'R': 'I2', 'S': '5', 'T': '7',
    'U': '(_)', 'V': '\\/', 'W': '\\/\\/', 'X': '><', 'Y': 'j', 'Z': '2'
};

/** @constant {string[]} CONSONANTS - Mássalhangzók a fokozatos nehézséghez */
const CONSONANTS = [
    'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'
];

/** @constant {string[]} VOWELS - Magánhangzók a fokozatos nehézséghez */
const VOWELS = ['A', 'E', 'I', 'O', 'U'];

/** @constant {string[]} SCRAMBLE_CHARS - Az animációhoz használt karakterkészlet (Leet.txt alapján) */
const SCRAMBLE_CHARS = [
    '4', 'I3', '[', ')', '3', '|=', '6', '#', '1', ',_|', '>|', '|_',
    '0', '|*', '5', '7', '2', '><', 'j', 'V', 'Z', 'X', 'Y'
];

/**
 * @class LeetPuzzle
 * @description A Leet dekódolási feladatot vezérlő osztály.
 */
export class LeetPuzzle {
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

        /** @type {number} - Aktuális osztályfok (a nehézséghez) */
        this.currentGrade = options.stateManager?.state?.currentGrade || 4;

        /** @type {string[]} - Megkevert szókészlet */
        this.words = this.shuffle([...BASE_WORDS]);

        /** @type {number} - Aktuális szó indexe */
        this.currentIndex = 0;
        /** @type {string} - Aktuális dekódolandó szó */
        this.currentWord = '';
        /** @type {string} - Aktuális kódolt megjelenítés */
        this.encodedWord = '';
        /** @type {Array<string|null>} - Megfejtett szavak tárolója */
        this.decodedWords = new Array(this.words.length).fill(null);
        /** @type {Array<string|null>} - Szavak állapota ('correct', 'failed', null) */
        this.wordStates = new Array(this.words.length).fill(null);

        /** @type {HTMLElement|null} */
        this.element = null;
        /** @type {HTMLElement|null} */
        this.slotsContainer = null;
        /** @type {HTMLElement|null} */
        this.sidebarList = null;
        /** @type {HTMLElement|null} */
        this.executeBtn = null;
        /** @type {boolean} - Folyamatban van-e művelet (spam védelem) */
        this.isProcessing = false;
        /** @type {Typewriter} */
        this.typewriter = new Typewriter();

        /** @type {number} - A feladat elindításának időpontja */
        this.startTime = Date.now(); // Újrabezdeni az időmérést az új szónál
        this.startScrambleAnimation();

        /** @type {boolean} - Az animáció futásának állapota */
        this.isAnimating = false;

        /** @type {GameLogger} */
        this.logger = options.logger || new GameLogger({
            level: 'INFO',
            enableConsole: true
        });

        this.init();
    }

    /**
     * Kódfeltörő (Scramble) animáció futtatása a kódolt szón.
     * @description A karakterek leet készletből pörögnek, majd sorban beállnak a kódolt értékre.
     */
    startScrambleAnimation() {
        const wordEl = this.element ? this.element.querySelector('#dkv-leet-word') : null;
        if (!wordEl) return;

        const originalText = this.encodedWord;
        const length = originalText.length;
        this.isAnimating = true;

        const duration = 3000; // 3 másodperc teljes tartam
        const startTime = Date.now();

        const animate = () => {
            if (!this.isAnimating) return;

            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            let currentDisplay = "";

            for (let i = 0; i < length; i++) {
                const threshold = (i / length) * 0.7 + 0.15;

                if (progress > threshold) {
                    currentDisplay += originalText[i];
                } else {
                    currentDisplay += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
                }
            }

            wordEl.textContent = currentDisplay;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                wordEl.textContent = originalText;
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Tömb elemeinek véletlenszerű megkeverése (Fisher-Yates algoritmus).
     * @param {Array} array - A megkeverendő tömb.
     * @returns {Array} A megkevert tömb.
     */
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * A feladat állapotának inicializálása az aktuális szó alapján.
     */
    init() {
        if (this.currentIndex < this.words.length) {
            this.currentWord = this.words[this.currentIndex];
            this.encodedWord = this.encode(this.currentWord);

            if (this.element) {
                this.updateCurrentWordDisplay();
            } else {
                this.render();
            }
        }
    }

    /**
     * Karakteralapú kódolás elvégzése az osztályfoknak megfelelően.
     * @param {string} word - A kódolandó szó.
     * @returns {string} A kódolt szó.
     */
    encode(word) {
        let result = '';
        const allowedToEncode = this.getEncodedCharsForGrade();

        for (const char of word.toUpperCase()) {
            if (allowedToEncode.has(char)) {
                result += LEET_MAP[char] || char;
            } else {
                result += char;
            }
        }
        return result;
    }

    /**
     * Az adott osztályfokon kódolandó karakterek halmazának lekérése.
     * @returns {Set<string>}
     */
    getEncodedCharsForGrade() {
        if (this.currentGrade <= 4) {
            return new Set(VOWELS);
        } else if (this.currentGrade === 5) {
            // Magánhangzók + mássalhangzók fele
            const halfConsonants = CONSONANTS.slice(0, Math.ceil(CONSONANTS.length / 2));
            return new Set([...VOWELS, ...halfConsonants]);
        } else {
            // Teljes ábécé
            return new Set([...VOWELS, ...CONSONANTS]);
        }
    }

    /**
     * A teljes UI struktúra felépítése és a bevezető animációk indítása.
     */
    render() {
        this.container.innerHTML = '';

        this.element = document.createElement('div');
        this.element.className = 'dkv-leet-container';

        const titleText = `RENDSZER FELÜLÍRÁS ELINDÍTVA: <span style="color: var(--leet-cyan);">KÓDFEJTÉS INICIALIZÁLVA</span>`;
        const subtitleText = `Fejtsd meg az alábbi szavak jelentését! Használd a moduláris beviteli slotokat a dekódoláshoz.`;

        this.element.innerHTML = `
            <div class="glass-panel">
                <div class="scanline"></div>
                
                <div style="padding: 3rem 3rem 1rem 3rem; position: relative; z-index: 5;">
                    <span class="dkv-leet__header-label">RENDSZERSZINTŰ KIVÉTEL // KIEMELT FONTOSSÁGÚ</span>
                    <h1 class="dkv-leet__title"></h1>
                    <p class="dkv-leet__subtitle"></p>
                    <button class="dkv-leet__help-btn">?</button>
                </div>

                <!-- HELP OVERLAY -->
                <div class="dkv-leet__help-overlay">
                    <div class="dkv-leet__help-content">
                        <div class="dkv-leet__help-header">
                            <span class="dkv-leet__help-label">RENDSZER SEGÉDLET // ADATBÁZIS LEKÉRÉS</span>
                            <button class="dkv-leet__help-close">×</button>
                        </div>
                        <p class="dkv-leet__help-text">
                            A karakterek átalakítása az alábbi táblázat alapján történik. Keresd meg a kódolt szimbólumhoz tartozó eredeti karaktert a sikeres dekódoláshoz.
                        </p>
                        <div class="dkv-leet__help-grid">
                            ${this.renderHelpGrid()}
                        </div>
                    </div>
                </div>

                <div class="dkv-leet__main-grid" style="position: relative; z-index: 5;">
                    <div class="dkv-leet__word-display">
                        <span class="glitch-text" id="dkv-leet-word"></span>
                    </div>

                    <div class="dkv-leet__sidebar">
                        <div class="dkv-leet__sidebar-title">STATUS_DECODED</div>
                        <div class="dkv-leet__list">
                            ${this.renderList()}
                        </div>
                    </div>

                    <div class="dkv-leet__input-section">
                        ${this.renderSlots()}
                    </div>
                </div>

                <div class="dkv-leet__footer" style="position: relative; z-index: 5;">
                    <div class="dkv-leet__system-status">
                        <div><span class="status-dot status-dot--green"></span> NEURÁLIS KAPCSOLAT: AKTÍV</div>
                        <div><span class="status-dot status-dot--magenta"></span> KÓDOLÁSI FOLYAMAT: AKTÍV</div>
                    </div>
                    <button class="dkv-leet__execute-btn" disabled>VÉGREHAJTÁS</button>
                </div>
            </div>
        `;

        this.container.appendChild(this.element);

        this.slotsContainer = this.element.querySelector('.dkv-leet__input-section');
        this.executeBtn = this.element.querySelector('.dkv-leet__execute-btn');
        this.sidebarList = this.element.querySelector('.dkv-leet__list');

        const titleEl = this.element.querySelector('.dkv-leet__title');
        const subtitleEl = this.element.querySelector('.dkv-leet__subtitle');
        const mainGrid = this.element.querySelector('.dkv-leet__main-grid');
        const footer = this.element.querySelector('.dkv-leet__footer');

        // Szekvenciális írógép effekt
        this.typewriter.type(titleEl, titleText, {
            speed: 25,
            hideCursorOnComplete: true,
            onComplete: () => {
                setTimeout(() => {
                    this.typewriter.type(subtitleEl, subtitleText, {
                        speed: 15,
                        onComplete: () => {
                            mainGrid.classList.add('visible');
                            footer.classList.add('visible');
                            this.setupInputLogic();
                            this.startScrambleAnimation();
                            this.setupHelpLogic();
                        }
                    });
                }, 300);
            }
        });

        this.executeBtn.addEventListener('click', () => this.handleExecute());
    }

    /**
     * Súgó panel eseménykezelőinek beállítása.
     */
    setupHelpLogic() {
        const helpBtn = this.element.querySelector('.dkv-leet__help-btn');
        const helpOverlay = this.element.querySelector('.dkv-leet__help-overlay');
        const closeBtn = this.element.querySelector('.dkv-leet__help-close');

        if (helpBtn && helpOverlay) {
            helpBtn.addEventListener('click', () => {
                helpOverlay.classList.add('open');
            });

            closeBtn?.addEventListener('click', () => {
                helpOverlay.classList.remove('open');
            });

            // Kattintás az overlay-re is bezárja (ha nem a tartalomra kattintunk)
            helpOverlay.addEventListener('click', (e) => {
                if (e.target === helpOverlay) {
                    helpOverlay.classList.remove('open');
                }
            });
        }
    }

    /**
     * A súgó ábécé rács generálása a Leet.txt adatai alapján.
     * @returns {string} HTML string a rácshoz.
     */
    renderHelpGrid() {
        const fullAlphabet = [
            { char: 'A', leet: '4' }, { char: 'B', leet: 'I3' }, { char: 'C', leet: '[' },
            { char: 'D', leet: ')' }, { char: 'E', leet: '3' }, { char: 'F', leet: '|=' },
            { char: 'G', leet: '6' }, { char: 'H', leet: '#' }, { char: 'I', leet: '1' },
            { char: 'J', leet: ',_|' }, { char: 'K', leet: '>|' }, { char: 'L', leet: '|_' },
            { char: 'M', leet: '/\\/\\' }, { char: 'N', leet: '^/' }, { char: 'O', leet: '0' },
            { char: 'P', leet: '|*' }, { char: 'Q', leet: '(_,)' }, { char: 'R', leet: 'I2' },
            { char: 'S', leet: '5' }, { char: 'T', leet: '7' }, { char: 'U', leet: '(_)' },
            { char: 'V', leet: '\\/' }, { char: 'W', leet: '\\/\\/' }, { char: 'X', leet: '><' },
            { char: 'Y', leet: 'j' }, { char: 'Z', leet: '2' }
        ];

        return fullAlphabet.map(item => `
            <div class="dkv-leet__help-item">
                <span class="dkv-leet__help-leet">${item.leet}</span>
                <span class="dkv-leet__help-arrow">→</span>
                <span class="dkv-leet__help-char">${item.char}</span>
            </div>
        `).join('');
    }

    /**
     * Csak az aktuális szóra vonatkozó UI elemek frissítése (szócsere esetén).
     */
    updateCurrentWordDisplay() {
        const wordDisplay = this.element.querySelector('#dkv-leet-word');
        if (wordDisplay) {
            wordDisplay.textContent = ""; // Törlés az animáció előtt
            this.startScrambleAnimation();
        }
        this.sidebarList.innerHTML = this.renderList();
        this.slotsContainer.innerHTML = this.renderSlots();
        this.setupInputLogic();
    }

    /**
     * A dekódolt szavak listájának generálása.
     * @returns {string} HTML string a listához.
     */
    renderList() {
        return this.words.map((word, index) => {
            const state = this.wordStates[index];
            const isActive = index === this.currentIndex;
            const displayWord = state ? word : '__________';

            let statusClass = '';
            if (state === 'correct') statusClass = 'dkv-leet__list-word--done';
            else if (state === 'failed') statusClass = 'dkv-leet__list-word--failed';
            else if (isActive) statusClass = 'dkv-leet__list-word--active';

            return `
                <div class="dkv-leet__list-item">
                    <span class="dkv-leet__list-num">${String(index + 1).padStart(2, '0')}</span>
                    <span class="dkv-leet__list-word ${statusClass}">${displayWord}</span>
                </div>
            `;
        }).join('');
    }

    /**
     * A beviteli mezők (slotok) generálása az aktuális szó hossza alapján.
     * @returns {string} HTML string a slotokhoz.
     */
    renderSlots() {
        let html = '';
        if (this.currentIndex < this.words.length) {
            for (let i = 0; i < this.currentWord.length; i++) {
                html += `
                    <div class="dkv-leet__slot" data-index="${i}">
                        <input type="text" maxlength="1" autocomplete="off">
                    </div>
                `;
            }
        }
        return html;
    }

    /**
     * Eseménykezelők beállítása a beviteli mezőkhöz (automatikus fókuszváltás).
     */
    setupInputLogic() {
        const inputs = this.slotsContainer.querySelectorAll('input');

        inputs.forEach((input, idx) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && idx < inputs.length - 1) {
                    inputs[idx + 1].focus();
                }
                this.checkSolution();
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && idx > 0) {
                    inputs[idx - 1].focus();
                }
            });

            input.addEventListener('focus', () => input.parentElement.classList.add('dkv-leet__slot--active'));
            input.addEventListener('blur', () => input.parentElement.classList.remove('dkv-leet__slot--active'));
        });

        if (inputs[0]) inputs[0].focus();
    }

    /**
     * Annak ellenőrzése, hogy minden mező ki van-e töltve a gomb aktiválásához.
     */
    checkSolution() {
        if (this.isProcessing) {
            this.executeBtn.disabled = true;
            return;
        }

        const inputs = this.slotsContainer.querySelectorAll('input');
        const value = Array.from(inputs).map(i => i.value).join('');

        this.executeBtn.disabled = (value.length !== this.currentWord.length);
    }

    /**
     * A beírt megoldás kiértékelése.
     */
    handleExecute() {
        if (this.isProcessing) return;
        this.isProcessing = true;
        this.executeBtn.disabled = true;

        const inputs = this.slotsContainer.querySelectorAll('input');
        const value = Array.from(inputs).map(i => i.value).join('').toUpperCase();

        if (value === this.currentWord) {
            this.wordStates[this.currentIndex] = 'correct';
            if (this.eventBus) this.eventBus.emit('leet:word-correct', { word: this.currentWord });
            this.handleProgression();
        } else {
            this.handleFailure();
        }
    }

    /**
     * Haladás vezérlése a következő szóra vagy a lezáráshoz.
     */
    handleProgression() {
        this.currentIndex++;

        if (this.currentIndex >= this.words.length) {
            this.finishTask();
        } else {
            setTimeout(() => {
                this.isProcessing = false;
                this.init();
            }, 600);
        }
    }

    /**
     * Hibás megoldás kezelése: vizuális visszacsatolás és automatikus továbblépés.
     */
    handleFailure() {
        this.logger.info('LeetPuzzle: Hibás megoldás', { word: this.currentWord, index: this.currentIndex });

        this.element.style.animation = 'none';
        void this.element.offsetWidth;
        this.element.style.animation = 'leet-shake 0.5s';

        this.wordStates[this.currentIndex] = 'failed';
        this.handleProgression();
    }

    /**
     * Feladat befejezése és eredmények jelentése a StateManager felé.
     */
    finishTask() {
        const correctCount = this.wordStates.filter(s => s === 'correct').length;
        this.logger.info('LeetPuzzle: Feladat befejezve', { score: correctCount, total: this.words.length });

        this.sidebarList.innerHTML = this.renderList();

        setTimeout(() => {
            this.onComplete({
                success: true,
                points: correctCount,
                maxPoints: this.words.length,
                timeElapsed: Math.floor((Date.now() - this.startTime) / 1000)
            });
        }, 1000);
    }

    /**
     * Takarítás az objektum megsemmisítésekor.
     */
    destroy() {
        this.typewriter.stop();
        if (this.element) {
            this.element.remove();
        }
    }
}
