/**
 * Adat-tenger - Tudás Torony (Kvíz Feladat - Grade 3)
 */
class QuizGame {
    constructor(container, options = {}) {
        this.container = container;
        this.onComplete = options.onComplete || (() => { });
        this.onScoreUpdate = options.onScoreUpdate || (() => { });

        // Beállítások
        this.quizFile = options.quizFile || 'assets/data/grade3/quiz/3.txt';
        this.timeLimit = options.timeLimit !== undefined ? options.timeLimit : 600; // 10 perc
        this.questionsPerPage = 1; // Oldalanként 1 kérdés, hogy kiférjen a modal ablakba

        // Állapot
        this.questions = [];
        this.currentPage = 0;
        this.userAnswers = {}; // Kérdés index -> Válasz betű (pl. 0: 'A')
        this.gameState = 'loading'; // loading, playing, won, lost

        // Pontmozgás valós időben
        this.currentScore = 0;

        // Timer
        this.timeElapsed = 0;
        this.timerStarted = false;
        this.timerInterval = null;
        this.timerEl = null;

        this.init();
    }

    async init() {
        this.container.innerHTML = '<div class="quiz-loading">Kvíz betöltése...</div>';
        try {
            await this.loadQuestions();
            this.render();
            this.startTimer();
            this.gameState = 'playing';
        } catch (error) {
            console.error('Kvíz betöltési hiba:', error);
            this.container.innerHTML = '<div class="quiz-error">Hiba történt a kvíz betöltésekor. Próbálja újra!</div>';
        }
    }

    async loadQuestions() {
        const response = await fetch(this.quizFile);
        if (!response.ok) throw new Error('Nem sikerült betölteni a fájlt: ' + this.quizFile);

        const text = await response.text();
        this.questions = this.parseQuizText(text);

        // Kérdések sorrendjének véletlenszerű keverése (Fisher-Yates)
        // Ezzel megakadályozzuk, hogy két egymás mellett ülő diák ugyanazt a tesztsort kapja
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }

        // Max 10 kérdés levágása a *megkevert* listából
        if (this.questions.length > 10) {
            this.questions = this.questions.slice(0, 10);
        }
    }

    parseQuizText(text) {
        const blocks = text.split('---').map(b => b.trim()).filter(b => b.length > 0);
        const parsed = [];

        blocks.forEach((block, index) => {
            const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            if (lines.length < 3) return;

            const questionText = lines[0];
            let options = [];
            let correctAnswerStr = null;

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i];
                if (line.startsWith('HELYES:')) {
                    correctAnswerStr = line.substring(7).trim();
                } else {
                    const match = line.match(/^\((.)\)\s*(.+)$/);
                    if (match) {
                        options.push({ originalLetter: match[1], text: match[2].trim() });
                    }
                }
            }

            // Válaszlehetőségek megkeverése, hogy még a betűk is máshol legyenek emberenként
            for (let i = options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [options[i], options[j]] = [options[j], options[i]];
            }

            // Betűk újraosztása (A, B, C, D) a megkevert sorrend szerint
            const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
            options = options.map((opt, idx) => ({
                letter: letters[idx] || opt.originalLetter,
                text: opt.text
            }));

            // Helyes betű megkeresése (a szöveg alapján, így a keverés után is a helyes opciót fogja mutatni)
            let correctLetter = null;
            if (correctAnswerStr) {
                const found = options.find(o => o.text.toLowerCase() === correctAnswerStr.toLowerCase());
                if (found) correctLetter = found.letter;
            }

            parsed.push({
                id: index,
                question: questionText,
                options,
                correctLetter
            });
        });

        return parsed;
    }

    render() {
        this.container.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'quiz-wrapper';

        // Timer és Progress sáv a fejlécben
        const timerBar = document.createElement('div');
        timerBar.className = 'quiz-timer-bar';
        timerBar.innerHTML = `
            <span class="quiz-timer-icon">⏱️</span>
            <span class="quiz-timer-time">00:00</span>
        `;

        const progressBar = document.createElement('div');
        progressBar.className = 'quiz-header-progress';
        progressBar.textContent = '0/0. feladat';
        this.progressEl = progressBar;

        // Ha van modal fejléc, oda tesszük
        const modalHeader = this.container.closest('.dkv-task-modal-overlay')?.querySelector('.dkv-task-modal-header');
        if (modalHeader) {
            const oldTimer = modalHeader.querySelector('.quiz-timer-bar') || modalHeader.querySelector('.memory-timer-bar');
            if (oldTimer) modalHeader.removeChild(oldTimer);

            const oldProgress = modalHeader.querySelector('.quiz-header-progress');
            if (oldProgress) modalHeader.removeChild(oldProgress);

            modalHeader.appendChild(progressBar);
            modalHeader.appendChild(timerBar);
        } else {
            wrapper.appendChild(progressBar);
            wrapper.appendChild(timerBar);
        }
        this.timerEl = timerBar.querySelector('.quiz-timer-time');

        // Tartalom terület
        this.contentArea = document.createElement('div');
        this.contentArea.className = 'quiz-content-area';

        // Navigációs sáv alul
        this.navArea = document.createElement('div');
        this.navArea.className = 'quiz-nav-area';

        wrapper.appendChild(this.contentArea);
        wrapper.appendChild(this.navArea);
        this.container.appendChild(wrapper);

        this.renderPage();
    }

    renderPage() {
        this.contentArea.innerHTML = '';

        const startIndex = this.currentPage * this.questionsPerPage;
        const endIndex = Math.min(startIndex + this.questionsPerPage, this.questions.length);
        const currentQuestions = this.questions.slice(startIndex, endIndex);

        currentQuestions.forEach((q, idx) => {
            const actualIndex = startIndex + idx;
            const qContainer = document.createElement('div');
            qContainer.className = 'quiz-question-container';

            const title = document.createElement('div');
            title.className = 'quiz-question-title';
            title.textContent = `${actualIndex + 1}. ${q.question}`;
            qContainer.appendChild(title);

            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'quiz-options-container';

            q.options.forEach(opt => {
                const optEl = document.createElement('label');
                optEl.className = 'quiz-option';

                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `question_${actualIndex}`;
                radio.value = opt.letter;

                // Ha már korábban kiválasztotta, beállítjuk
                if (this.userAnswers[actualIndex] === opt.letter) {
                    radio.checked = true;
                }

                radio.addEventListener('change', () => {
                    this.userAnswers[actualIndex] = opt.letter;
                    this.updateNavButtons();
                });

                const letterSpan = document.createElement('span');
                letterSpan.className = 'quiz-option-letter';
                letterSpan.textContent = opt.letter;

                const textSpan = document.createElement('span');
                textSpan.className = 'quiz-option-text';
                textSpan.textContent = opt.text;

                optEl.appendChild(radio);
                optEl.appendChild(letterSpan);
                optEl.appendChild(textSpan);
                optionsContainer.appendChild(optEl);
            });

            qContainer.appendChild(optionsContainer);
            this.contentArea.appendChild(qContainer);
        });

        this.renderNav();
    }

    renderNav() {
        this.navArea.innerHTML = '';
        const pages = Math.ceil(this.questions.length / this.questionsPerPage);

        // Fejléc progress frissítése
        if (this.progressEl) {
            // Since questionsPerPage is 1, maxQs will be (this.currentPage + 1)
            this.progressEl.textContent = `${this.currentPage + 1}/${this.questions.length}. feladat`;
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = 'quiz-nav-btn';

        if (this.currentPage === pages - 1) {
            nextBtn.textContent = 'Befejezés és Értékelés';
            nextBtn.classList.add('quiz-finish-btn');
            nextBtn.onclick = () => {
                this.evaluateCurrentPage();
                setTimeout(() => this.evaluateQuiz(), 800); // Vár egy picit az animációra
            };
        } else {
            nextBtn.textContent = 'Kiértékelés';
            nextBtn.onclick = () => {
                if (this.currentPage < pages - 1) {
                    this.evaluateCurrentPage();

                    // Késleltetett lapozás az animáció miatt
                    setTimeout(() => {
                        this.contentArea.classList.add('fade-out');
                        setTimeout(() => {
                            this.currentPage++;
                            this.renderPage();
                            this.contentArea.classList.remove('fade-out');
                        }, 400); // transition
                    }, 800); // 800ms hogy látszódjon a +1
                }
            };
        }

        this.navArea.appendChild(nextBtn);

        this.nextBtnRef = nextBtn;
        this.updateNavButtons();
    }

    updateNavButtons() {
        if (!this.nextBtnRef) return;

        // Ellenőrizzük, hogy a jelenlegi oldal minden kérdésére van-e válasz
        const startIndex = this.currentPage * this.questionsPerPage;
        const endIndex = Math.min(startIndex + this.questionsPerPage, this.questions.length);

        let allAnswered = true;
        for (let i = startIndex; i < endIndex; i++) {
            if (!this.userAnswers[i]) {
                allAnswered = false;
                break;
            }
        }

        this.nextBtnRef.disabled = !allAnswered;
    }

    startTimer() {
        if (this.timerStarted) return;
        this.timerStarted = true;

        this.timerInterval = setInterval(() => {
            this.timeElapsed++;
            const mins = Math.floor(this.timeElapsed / 60).toString().padStart(2, '0');
            const secs = (this.timeElapsed % 60).toString().padStart(2, '0');
            if (this.timerEl) {
                this.timerEl.textContent = `${mins}:${secs}`;
            }

            // Időlimit ellenőrzése (0 = nincs korlát)
            if (this.timeLimit > 0 && this.timeElapsed >= this.timeLimit) {
                this.endGame(false, 0); // Időtúllépés = 0 pont
            }
        }, 1000);
    }

    evaluateCurrentPage() {
        // Mivel questionsPerPage = 1, csak az ezen az oldalon levő 1 db kérdést nézzük
        const startIndex = this.currentPage * this.questionsPerPage;
        const q = this.questions[startIndex];

        let earnedPont = 0;
        if (this.userAnswers[startIndex] === q.correctLetter) {
            earnedPont = 1;
            this.currentScore += 1;
        }

        // Keresünk az oldalon bejelölt rádiógombot
        // Biztonsági okokból parent-re megyünk a teljes quiz-option-re
        const checkedId = `question_${startIndex}`;
        const selectedInput = this.contentArea.querySelector(`input[name="${checkedId}"]:checked`);
        let targetEl = selectedInput ? selectedInput.closest('.quiz-option') : null;

        // Ha véletlenül nincs találat, essünk vissza a konténerre
        if (!targetEl) targetEl = this.contentArea;

        // Pont animáció megjelenítése
        this.showScoreAnimation(earnedPont, targetEl);

        // Küldjük ki a frissült pontot a HUD-nak a callbacken keresztül
        this.onScoreUpdate(earnedPont, this.currentScore);
    }

    showScoreAnimation(points, element) {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const floatEl = document.createElement('div');
        floatEl.className = 'quiz-floating-point';
        floatEl.textContent = `+${points}`;

        // Mivel a kvízben lehet rossz válaszra is +0 pont, ezt módosíthatjuk vizuálisan színnel
        // Ha nem 1 (azaz 0 pont), adunk neki egy egyedi színt, vagy piros feliratot - de a feladat kérése szerint
        // maradjon az onboarding stílusa "pontosan ugyanolyan" (+0 is ugyanolyan stílusban jelenik meg).
        if (points === 0) {
            floatEl.style.color = '#ff4d4d'; // Hibásnál picit más szín az onboarding sárgája helyett
        }

        // Pozicionálás: az elem jobb oldalához igazítva, kicsit feljebb
        // Fixed pozicionálás esetén (z-index miatt fixáltuk) CSUPA rect értéket használunk, scroll nélkül
        floatEl.style.left = `${rect.right - 40}px`; // Jobb szélétől kicsit beljebb
        floatEl.style.top = `${rect.top - 20}px`;

        document.body.appendChild(floatEl);

        // Takarítás a RegistrationSlide.js alapján
        setTimeout(() => {
            if (floatEl.parentNode) floatEl.parentNode.removeChild(floatEl);
        }, 1600);
    }

    evaluateQuiz() {
        // A pontokat már folyamatosan adtuk hozzá (evaluateCurrentPage)
        // Befejezés, minimum 0 pont, ha végigment. 
        // score == max pontszám. 1 pont minden jó válaszért. (Már kiszámoltuk: this.currentScore)
        // A feladat success=true lesz, ha végigment időn belül, függetlenül a ponttól (vagy lehet kritérium).
        // Jelenleg úgy tekintjük, hogy success=true ha beküldte, és a score a pontszám.
        this.endGame(true, this.currentScore);
    }

    endGame(success, points) {
        if (this.gameState === 'won' || this.gameState === 'lost') return;
        this.gameState = success ? 'won' : 'lost';
        clearInterval(this.timerInterval);

        const result = {
            success,
            timeElapsed: this.timeElapsed,
            points: points,
            maxPoints: this.questions.length
        };

        this.onComplete(result);
    }

    destroy() {
        clearInterval(this.timerInterval);

        const timerBar = document.querySelector('.quiz-timer-bar');
        if (timerBar && timerBar.parentNode) {
            timerBar.parentNode.removeChild(timerBar);
        }

        const progBar = document.querySelector('.quiz-header-progress');
        if (progBar && progBar.parentNode) {
            progBar.parentNode.removeChild(progBar);
        }

        this.container.innerHTML = '';
    }
}

export default QuizGame;
