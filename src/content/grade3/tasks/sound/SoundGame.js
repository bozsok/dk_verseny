/**
 * SoundGame osztály a Hangerdő (5. állomás) logikájának megvalósítására.
 */
export class SoundGame {
    constructor(container, options) {
        this.container = container;
        this.options = options || {};
        this.timeLimit = this.options.timeLimit || 900;
        this.onComplete = this.options.onComplete;

        // Csomagoljuk ki az adatstruktúrát (a json.txt alapján a grade 3-as adatokat)
        this.taskData = this.options.taskData || {
            taskType: "audioAdventure",
            audioSrc: "assets/audio/grade3/sonora_3osztaly.mp3",
            parts: [
                {
                    id: "whisperedWords_3",
                    question: "Hallottál halk suttogást is. Milyen szavakat suttogtak el a fák?",
                    fields: [
                        { id: "whisper1_3", label: "1. suttogott szó:", type: "text", correctAnswer: "sötét", points: 1 },
                        { id: "whisper2_3", label: "2. suttogott szó:", type: "text", correctAnswer: "vírus", points: 1 }
                    ]
                },
                {
                    id: "hiddenNumbers_3",
                    question: "Kettő furcsa hangjelzés kettő számot rejtett. Melyek voltak azok?",
                    fields: [
                        { id: "hiddenNum1_3", label: "1. rejtett szám:", type: "number", correctAnswer: 1, points: 1 },
                        { id: "hiddenNum2_3", label: "2. rejtett szám:", type: "number", correctAnswer: 2, points: 1 }
                    ]
                }
            ],
            totalPointsOnSuccess: 6, // 4 pont ebből a parts-ból, +2 a fő üzenetből jön tipikusan? Az json szerint itt csak ez a két block van definiálva a "parts" tömbben a 3. osztályra. Vagy a commonAudioParts is bejön? Igen, a commonAudioParts-ot is hozzáfűzzük.
            caseSensitive: false,
            trimWhitespace: true
        };

        // Kiegészítjük a common (közös) részekkel
        const commonParts = [
            {
                id: "mainMessages",
                question: "Milyen szavakat mondott Sonora a torzított részekben?",
                fields: [
                    { id: "mainMsg1", label: "Lassított üzenet:", type: "text", correctAnswer: "számítunk rád", points: 1 },
                    { id: "mainMsg2", label: "Gyorsított üzenet:", type: "text", correctAnswer: "a megoldás a varázskulcsokban rejlik", points: 1 }
                ],
                isCommon: true
            }
        ];

        this.taskParts = [...commonParts, ...this.taskData.parts];

        this.audioElement = null;
        this.timer = 0;
        this.timerInterval = null;
        this.gameStarted = false;
        this.audioEnded = false;
        this.allInputs = [];

        this.initDOM();
    }

    destroy() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.src = "";
        }

        // Timer elem eltávolítása a headerből, ha oda tettük
        if (this.timerTimeEl) {
            const timerBar = this.timerTimeEl.closest('.sound-timer-bar');
            if (timerBar && timerBar.parentNode) {
                timerBar.parentNode.removeChild(timerBar);
            }
        }

        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    initDOM() {
        this.container.innerHTML = `
            <div class="sound-game-container">
                <div class="sound-content-grid">
                    <div class="audio-player-wrapper">
                        <audio id="sound-game-audio" src="${this.taskData.audioSrc}" preload="metadata"></audio>
                        <div class="audio-controls-compact">
                            <button id="audio-play-btn" class="audio-btn">▶</button>
                            <button id="audio-stop-btn" class="audio-btn">⏹</button>
                            <div class="progress-container-compact">
                                <span id="audio-current-time">0:00</span>
                                <input type="range" id="audio-progress" value="0" min="0" max="100" step="0.1">
                                <span id="audio-duration">0:00</span>
                            </div>
                            <select id="audio-speed-select" class="audio-select">
                                <option value="0.5">0.5x</option>
                                <option value="1.0" selected>1x</option>
                                <option value="1.5">1.5x</option>
                                <option value="2.0">2x</option>
                            </select>
                        </div>
                    </div>

                    <div class="task-parts-wrapper" style="display: none; opacity: 0;">
                        <!-- Dinamikusan ide generálódnak be az elemek -->
                    </div>
                </div>
                
                <div class="evaluate-wrapper" style="display: none;">
                    <button id="sound-evaluate-btn" class="dkv-btn dkv-btn-primary" disabled>Kiértékelés</button>
                </div>
            </div>
        `;

        this.timerTimeEl = this.container.querySelector('.timer-time');
        this.audioElement = this.container.querySelector('#sound-game-audio');
        this.playBtn = this.container.querySelector('#audio-play-btn');
        this.stopBtn = this.container.querySelector('#audio-stop-btn');
        this.progressRange = this.container.querySelector('#audio-progress');
        this.currentTimeEl = this.container.querySelector('#audio-current-time');
        this.durationEl = this.container.querySelector('#audio-duration');
        this.speedSelect = this.container.querySelector('#audio-speed-select');
        this.taskPartsWrapper = this.container.querySelector('.task-parts-wrapper');
        this.evaluateWrapper = this.container.querySelector('.evaluate-wrapper');
        this.evaluateBtn = this.container.querySelector('#sound-evaluate-btn');

        // Timer sáv dinamikus generálása a modal fejlécébe
        const timerBar = document.createElement('div');
        timerBar.className = 'sound-timer-bar';
        timerBar.innerHTML = `
            <span class="sound-timer-icon">⏱️</span>
            <span class="sound-timer-time">00:00</span>
        `;

        const modalHeader = this.container.closest('.dkv-task-modal-overlay')?.querySelector('.dkv-task-modal-header');
        if (modalHeader) {
            modalHeader.appendChild(timerBar);
        } else {
            this.container.appendChild(timerBar);
        }
        this.timerTimeEl = timerBar.querySelector('.sound-timer-time');

        this.setupAudioListeners();
        this.setupEventListeners();
    }

    setupAudioListeners() {
        this.audioElement.addEventListener('loadedmetadata', () => {
            this.durationEl.textContent = this.formatAudioTime(this.audioElement.duration);
        });

        this.audioElement.addEventListener('timeupdate', () => {
            if (this.audioElement.duration) {
                this.progressRange.value = (this.audioElement.currentTime / this.audioElement.duration) * 100;
                this.currentTimeEl.textContent = this.formatAudioTime(this.audioElement.currentTime);
            }
        });

        this.audioElement.addEventListener('play', () => {
            if (!this.gameStarted) this.startGame();
            this.playBtn.innerHTML = '⏸';
        });

        this.audioElement.addEventListener('pause', () => {
            this.playBtn.innerHTML = '▶';
        });

        this.audioElement.addEventListener('ended', () => {
            this.playBtn.innerHTML = '▶';
            if (!this.audioEnded) {
                this.audioEnded = true;
                this.revealTasks();
            }
        });
    }

    setupEventListeners() {
        this.playBtn.addEventListener('click', () => {
            if (this.audioElement.paused || this.audioElement.ended) {
                this.audioElement.play();
            } else {
                this.audioElement.pause();
            }
        });

        this.stopBtn.addEventListener('click', () => {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
            this.progressRange.value = 0;
            this.currentTimeEl.textContent = "0:00";
        });

        this.progressRange.addEventListener('input', () => {
            if (this.audioElement.duration) {
                this.audioElement.currentTime = (this.progressRange.value / 100) * this.audioElement.duration;
            }
        });

        this.speedSelect.addEventListener('change', () => {
            this.audioElement.playbackRate = parseFloat(this.speedSelect.value);
            // Ha a böngésző támogatja (hogy a pitch is torzuljon, bár manapság default a preservesPitch = true)
            // Itt most hagyjuk alapértelmezetten (vagy false, ha a "robotos" hang a cél). A quiz logic szerint: preservesPitch = true
            this.audioElement.preservesPitch = true;
        });

        this.evaluateBtn.addEventListener('click', () => this.evaluateTask());
    }

    formatAudioTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    startGame() {
        this.gameStarted = true;
        this.timerInterval = setInterval(() => {
            this.timer++;
            if (this.timerTimeEl) {
                this.timerTimeEl.textContent = this.formatTime(this.timer);
            }
            if (this.timer >= this.timeLimit) {
                this.handleTimeUp();
            }
        }, 1000);
    }

    revealTasks() {
        this.taskPartsWrapper.style.display = 'flex';

        let html = '';
        this.taskParts.forEach((part, index) => {
            html += `
                <div class="sound-task-part" style="animation: slideUp 0.4s ease forwards; animation-delay: ${index * 0.15}s; opacity: 0; transform: translateY(10px);">
                    <div class="sound-task-question">
                        ${part.question}
                        ${part.isCommon ? '<span class="sound-tooltip" data-title="Sonora üzenetének sebessége ingadozik. Használd a lejátszó sebességállítását!">?</span>' : ''}
                    </div>
                    <div class="sound-task-fields">
                        ${part.fields.map(f => `
                            <div class="sound-field-item">
                                <label for="${f.id}">${f.label}</label>
                                <input type="${f.type}" id="${f.id}" class="sound-input" autocomplete="off" ${f.type === 'number' ? 'min="0"' : ''}>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        this.taskPartsWrapper.innerHTML = html;
        this.evaluateWrapper.style.display = 'block';

        // Add listeners for empty check
        this.allInputs = Array.from(this.taskPartsWrapper.querySelectorAll('.sound-input'));
        this.allInputs.forEach(input => {
            input.addEventListener('input', () => this.checkFormReady());
        });

        // Trigger reflow
        void this.taskPartsWrapper.offsetWidth;
        this.taskPartsWrapper.style.opacity = '1';
    }

    checkFormReady() {
        const allFilled = this.allInputs.every(input => input.value.trim() !== '');
        this.evaluateBtn.disabled = !allFilled;
    }

    evaluateTask() {
        // Leállítjuk a lejátszót és a timert
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.audioElement.pause();

        let totalCorrect = 0;
        let isPerfect = true;

        this.taskParts.forEach(part => {
            if (part.id.startsWith("whisperedWords") || part.id.startsWith("hiddenNumbers")) {
                // Sorrendfüggetlen ellenőrzés
                const userValues = part.fields.map(f => {
                    const val = document.getElementById(f.id).value.trim().toLowerCase();
                    return f.type === 'number' ? parseFloat(val) : val;
                });

                const correctValuesPool = part.fields.map(f => {
                    const val = String(f.correctAnswer).toLowerCase();
                    return f.type === 'number' ? parseFloat(val) : val;
                });

                userValues.forEach(uVal => {
                    const idx = correctValuesPool.indexOf(uVal);
                    if (idx !== -1) {
                        totalCorrect++;
                        correctValuesPool.splice(idx, 1);
                    } else {
                        isPerfect = false;
                    }
                });

            } else {
                // Sorrendfüggő ellenőrzés (mainMessages)
                part.fields.forEach(f => {
                    const uVal = document.getElementById(f.id).value.trim().toLowerCase().replace(/[.!?]$/, "");
                    const cVal = String(f.correctAnswer).toLowerCase();
                    if (uVal === cVal) {
                        totalCorrect++;
                    } else {
                        isPerfect = false;
                    }
                });
            }
        });

        // Pontszámítás - Minden helyes válaszért 1 pont, maximum 6.
        const success = totalCorrect > 0;

        if (this.timerInterval) clearInterval(this.timerInterval);

        if (typeof this.onComplete === 'function') {
            this.onComplete({
                success: success,
                points: totalCorrect, // Valós pontszám: ahány jó válasz (max. 6)
                maxPoints: 6,         // Beállítjuk a helyes max pontot a modalnak
                timeElapsed: this.timer
            });
        }
    }

    handleTimeUp() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.audioElement.pause();
        if (typeof this.onComplete === 'function') {
            this.onComplete({
                success: false,
                points: 0,
                maxPoints: 6,
                isTimeout: true
            });
        }
    }
}
