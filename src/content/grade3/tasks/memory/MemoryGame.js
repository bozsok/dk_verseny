/**
 * Adat-tenger - Memória Játék (Grade 3)
 */
class MemoryGame {
    constructor(container, options = {}) {
        this.container = container;
        this.onComplete = options.onComplete || (() => { });
        this.onScoreUpdate = options.onScoreUpdate || (() => { });

        // Játék beállítások
        this.difficulty = options.difficulty || 16; // Összes kártya száma
        this.REWARD_POINTS = 5; // Fix 5 pont a befejezéskor (mint a maze)
        this.timeLimit = options.timeLimit !== undefined ? options.timeLimit : 600; // mp, 0 = nincs korlát

        // Állapot
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.totalPairs = this.difficulty / 2;
        this.canFlip = true;
        this.attempts = 0;
        this.gameState = 'playing';

        // Timer állapot
        this.timeElapsed = 0;
        this.timerStarted = false;
        this.timerInterval = null;
        this.timerEl = null;

        this.init();
    }

    init() {
        this.container.innerHTML = '';
        this.generateCards();
        this.render();
    }

    generateCards() {
        const availableImagesCount = 28;
        const basePath = 'assets/images/grade3/memory/';

        // Véletlenszerű képek kiválasztása
        const allIndexes = Array.from({ length: availableImagesCount }, (_, i) => i + 1);
        this.shuffleArray(allIndexes);

        const selectedIndexes = allIndexes.slice(0, this.totalPairs);
        const gameImages = [...selectedIndexes, ...selectedIndexes];
        this.shuffleArray(gameImages);

        this.cards = gameImages.map((imgIndex, i) => ({
            id: i,
            image: `${basePath}${imgIndex.toString().padStart(2, '0')}.png`,
            isFlipped: false,
            isMatched: false
        }));
    }

    render() {
        // Timer fejléc (mint a maze-ben, de a modal igazi fejlécébe próbáljuk tenni)
        const timerBar = document.createElement('div');
        timerBar.className = 'memory-timer-bar';
        timerBar.innerHTML = `
            <span class="memory-timer-icon">⏱️</span>
            <span class="memory-timer-time">00:00</span>
        `;

        // Megkeressük a modal fejlécét
        const modalHeader = this.container.closest('.dkv-task-modal-overlay')?.querySelector('.dkv-task-modal-header');
        if (modalHeader) {
            modalHeader.appendChild(timerBar);
        } else {
            this.container.appendChild(timerBar);
        }

        this.timerEl = timerBar.querySelector('.memory-timer-time');

        // Kártya rács
        const grid = document.createElement('div');
        grid.className = 'memory-grid';

        // Rács oszlopok dinamikus beállítása (pl. 4x4, 4x6 stb.)
        const cols = this.totalPairs <= 8 ? 4 : 6;
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        this.cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'memory-card-wrapper';
            cardEl.dataset.id = card.id;

            cardEl.innerHTML = `
                <div class="memory-card">
                    <div class="card-face card-back"></div>
                    <div class="card-face card-front" style="background-image: url('${card.image}')"></div>
                </div>
            `;

            cardEl.addEventListener('click', () => this.handleCardClick(card));
            grid.appendChild(cardEl);
            card.element = cardEl;
        });

        this.container.appendChild(grid);
    }

    handleCardClick(card) {
        if (!this.canFlip || card.isFlipped || card.isMatched || this.flippedCards.length >= 2) return;

        // Timer indítása az első kattintáskor (mint maze-ben az első lépésnél)
        if (!this.timerStarted) {
            this.startTimer();
        }

        this.flipCard(card);
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.canFlip = false;
            this.attempts++;
            this.checkForMatch();
        }
    }

    flipCard(card) {
        card.isFlipped = true;
        card.element.querySelector('.memory-card').classList.add('flipped');
    }

    unflipCards() {
        this.flippedCards.forEach(card => {
            card.isFlipped = false;
            card.element.querySelector('.memory-card').classList.remove('flipped');
        });
        this.flippedCards = [];
        this.canFlip = true;
    }

    checkForMatch() {
        const [card1, card2] = this.flippedCards;
        const isMatch = card1.image === card2.image;

        if (isMatch) {
            this.handleMatch();
        } else {
            setTimeout(() => this.unflipCards(), 1000);
        }
    }

    handleMatch() {
        const [card1, card2] = this.flippedCards;
        card1.isMatched = true;
        card2.isMatched = true;

        setTimeout(() => {
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            this.matchedPairs++;

            this.flippedCards = [];
            this.canFlip = true;
            this.checkWin();
        }, 500);
    }

    checkWin() {
        if (this.matchedPairs === this.totalPairs) {
            this.endGame(true);
        }
    }

    startTimer() {
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
                this.endGame(false);
            }
        }, 1000);
    }

    endGame(success) {
        if (this.gameState === 'won' || this.gameState === 'lost') return; // dupla hívás védelem
        this.gameState = success ? 'won' : 'lost';
        this.canFlip = false;
        clearInterval(this.timerInterval);

        const result = {
            success,
            timeElapsed: this.timeElapsed,
            attempts: this.attempts,
            points: success ? this.REWARD_POINTS : 0
        };

        setTimeout(() => {
            this.onComplete(result);
        }, success ? 1000 : 300);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    destroy() {
        clearInterval(this.timerInterval);

        // Timer eltávolítása a fejlécből (vagy bárhonnan ahol van)
        const timerBar = document.querySelector('.memory-timer-bar');
        if (timerBar && timerBar.parentNode) {
            timerBar.parentNode.removeChild(timerBar);
        }

        this.container.innerHTML = '';
    }
}

export default MemoryGame;
