/**
 * MazeGame - Labirintus feladat logika (Vanilla JS port)
 * 
 * Ez az osztály kezeli a labirintus generálását, a Canvas-on történő megjelenítést
 * és a játékos mozgását.
 */
class MazeGame {
    constructor(container, options = {}) {
        this.container = container;
        this.onComplete = options.onComplete || (() => { });
        this.onScoreUpdate = options.onScoreUpdate || (() => { });
        this.difficulty = options.difficulty || 10;
        this.timeLimit = options.timeLimit !== undefined ? options.timeLimit : 600; // mp, 0 = nincs korlát
        this.cellSize = 0;
        this.canvasSize = 700; // Kisebb méret, hogy elférjen görgetés nélkül

        // Állapot (State)
        this.gameState = 'loading'; // loading, playing, won, lost
        this.timeElapsed = 0;
        this.timerStarted = false;
        this.stepCount = 0;
        this.timerInterval = null;

        // Maze adatok
        this.mazeMap = null;
        this.startCoord = { x: 0, y: 0 };
        this.endCoord = { x: 0, y: 0 };
        this.playerPosition = { x: 0, y: 0 };

        // Grafika
        this.canvas = null;
        this.ctx = null;
        this.playerSprite = new Image();
        this.targetSprite = new Image();
        this.spritesLoaded = 0;

        this.init();
    }

    async init() {
        this.createLayout();
        await this.loadSprites();
        this.generateMaze();
        this.setupEventListeners();
        this.draw();
        this.gameState = 'playing';
    }

    createLayout() {
        this.container.innerHTML = `
            <div class="maze-game-wrapper">
                <div class="maze-header">
                    <div class="maze-timer">
                        <span class="timer-icon">⏱️</span>
                        <span class="timer-time">00:00</span>
                    </div>
                    <div class="maze-instructions-header">
                        Juss el a kulcsig a W, A, S, D vagy a navigációs gombokkal!
                    </div>
                    <div class="maze-steps">
                        Lépések: <span class="step-count">0</span>
                    </div>
                </div>
                <div class="maze-canvas-container">
                    <canvas id="mazeCanvas"></canvas>
                </div>
            </div>
        `;

        this.canvas = this.container.querySelector('#mazeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.canvasSize;
        this.canvas.height = this.canvasSize;

        this.timerEl = this.container.querySelector('.timer-time');
        this.stepsEl = this.container.querySelector('.step-count');
    }

    loadSprites() {
        return new Promise((resolve) => {
            const checkReady = () => {
                this.spritesLoaded++;
                if (this.spritesLoaded === 2) resolve();
            };

            this.playerSprite.onload = checkReady;
            this.playerSprite.onerror = checkReady;
            this.playerSprite.src = 'assets/images/grade3/maze/player.png';

            this.targetSprite.onload = checkReady;
            this.targetSprite.onerror = checkReady;
            this.targetSprite.src = 'assets/images/grade3/maze/target.png';

            // Backup ha nem töltődnek be
            setTimeout(() => resolve(), 2000);
        });
    }

    generateMaze() {
        const width = this.difficulty;
        const height = this.difficulty;
        this.cellSize = Math.floor(this.canvasSize / this.difficulty);

        // Map inicializálása
        this.mazeMap = new Array(height);
        for (let y = 0; y < height; y++) {
            this.mazeMap[y] = new Array(width);
            for (let x = 0; x < width; ++x) {
                this.mazeMap[y][x] = { n: false, s: false, e: false, w: false, visited: false, priorPos: null };
            }
        }

        // Start/End meghatározása (átlóban véletlenszerűen)
        const corner = Math.floor(Math.random() * 4);
        switch (corner) {
            case 0: this.startCoord = { x: 0, y: 0 }; this.endCoord = { x: width - 1, y: height - 1 }; break;
            case 1: this.startCoord = { x: 0, y: height - 1 }; this.endCoord = { x: width - 1, y: 0 }; break;
            case 2: this.startCoord = { x: width - 1, y: 0 }; this.endCoord = { x: 0, y: height - 1 }; break;
            case 3: this.startCoord = { x: width - 1, y: height - 1 }; this.endCoord = { x: 0, y: 0 }; break;
        }

        this.playerPosition = { ...this.startCoord };

        // Generálás DFS algoritmussal
        let pos = { ...this.startCoord };
        let cellsVisited = 1;
        const numCells = width * height;
        const dirs = ["n", "s", "e", "w"];
        const modDir = {
            n: { y: -1, x: 0, o: "s" },
            s: { y: 1, x: 0, o: "n" },
            e: { y: 0, x: 1, o: "w" },
            w: { y: 0, x: -1, o: "e" }
        };

        while (cellsVisited < numCells) {
            this.mazeMap[pos.y][pos.x].visited = true;
            let neighbors = [];

            for (const d of dirs) {
                const nx = pos.x + modDir[d].x;
                const ny = pos.y + modDir[d].y;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height && !this.mazeMap[ny][nx].visited) {
                    neighbors.push({ x: nx, y: ny, d });
                }
            }

            if (neighbors.length > 0) {
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                this.mazeMap[pos.y][pos.x][next.d] = true;
                this.mazeMap[next.y][next.x][modDir[next.d].o] = true;
                this.mazeMap[next.y][next.x].priorPos = { ...pos };
                pos = { x: next.x, y: next.y };
                cellsVisited++;
            } else {
                pos = this.mazeMap[pos.y][pos.x].priorPos;
            }
        }
    }

    setupEventListeners() {
        this.handleKeyDown = (e) => this.move(e);
        window.addEventListener('keydown', this.handleKeyDown);
    }

    move(e) {
        if (this.gameState !== 'playing') return;

        let moved = false;
        const { x, y } = this.playerPosition;
        const map = this.mazeMap[y][x];

        // Start timer on first move
        if (!this.timerStarted) {
            this.startTimer();
        }

        switch (e.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                if (map.n) { this.playerPosition.y--; moved = true; }
                break;
            case 'arrowdown':
            case 's':
                if (map.s) { this.playerPosition.y++; moved = true; }
                break;
            case 'arrowleft':
            case 'a':
                if (map.w) { this.playerPosition.x--; moved = true; }
                break;
            case 'arrowright':
            case 'd':
                if (map.e) { this.playerPosition.x++; moved = true; }
                break;
        }

        if (moved) {
            e.preventDefault();
            this.stepCount++;
            this.stepsEl.textContent = this.stepCount;
            this.draw();
            this.checkWin();
        }
    }

    startTimer() {
        this.timerStarted = true;
        this.timerInterval = setInterval(() => {
            this.timeElapsed++;
            const mins = Math.floor(this.timeElapsed / 60).toString().padStart(2, '0');
            const secs = (this.timeElapsed % 60).toString().padStart(2, '0');
            this.timerEl.textContent = `${mins}:${secs}`;

            // Időlimit ellenőrzése (0 = nincs korlát)
            if (this.timeLimit > 0 && this.timeElapsed >= this.timeLimit) {
                this.endGame(false);
            }
        }, 1000);
    }

    checkWin() {
        if (this.playerPosition.x === this.endCoord.x && this.playerPosition.y === this.endCoord.y) {
            this.endGame(true);
        }
    }

    endGame(success) {
        this.gameState = success ? 'won' : 'lost';
        clearInterval(this.timerInterval);
        window.removeEventListener('keydown', this.handleKeyDown);

        const points = success ? 5 : 0;
        const result = {
            success,
            timeElapsed: this.timeElapsed,
            stepCount: this.stepCount,
            points
        };

        if (success) {
            this.onScoreUpdate(points);
        }
        this.onComplete(result);
    }

    reset() {
        this.timeElapsed = 0;
        this.stepCount = 0;
        this.timerStarted = false;
        this.gameState = 'playing';
        this.timerEl.textContent = '00:00';
        this.stepsEl.textContent = '0';
        this.generateMaze();
        this.setupEventListeners();
        this.draw();
    }

    draw() {
        const { ctx, canvas, mazeMap, cellSize } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Labirintus falak rajzolása
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#00eaff'; // Cián
        ctx.lineCap = 'round';

        ctx.beginPath();

        for (let y = 0; y < mazeMap.length; y++) {
            for (let x = 0; x < mazeMap[y].length; x++) {
                const cell = mazeMap[y][x];
                const px = x * cellSize;
                const py = y * cellSize;

                if (!cell.n) { ctx.moveTo(px, py); ctx.lineTo(px + cellSize, py); }
                if (!cell.s) { ctx.moveTo(px, py + cellSize); ctx.lineTo(px + cellSize, py + cellSize); }
                if (!cell.e) { ctx.moveTo(px + cellSize, py); ctx.lineTo(px + cellSize, py + cellSize); }
                if (!cell.w) { ctx.moveTo(px, py); ctx.lineTo(px, py + cellSize); }
            }
        }
        ctx.stroke();

        // Célpont rajzolása
        const targetX = this.endCoord.x * cellSize + cellSize * 0.1;
        const targetY = this.endCoord.y * cellSize + cellSize * 0.1;
        const targetSize = cellSize * 0.8;

        if (this.targetSprite.complete && this.targetSprite.naturalWidth !== 0) {
            ctx.drawImage(this.targetSprite, targetX, targetY, targetSize, targetSize);
        } else {
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(targetX, targetY, targetSize, targetSize);
        }

        // Játékos rajzolása
        const playerX = this.playerPosition.x * cellSize + cellSize * 0.1;
        const playerY = this.playerPosition.y * cellSize + cellSize * 0.1;
        const playerSize = cellSize * 0.8;

        if (this.playerSprite.complete && this.playerSprite.naturalWidth !== 0) {
            ctx.drawImage(this.playerSprite, playerX, playerY, playerSize, playerSize);
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(playerX + playerSize / 2, playerY + playerSize / 2, playerSize / 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    destroy() {
        clearInterval(this.timerInterval);
        window.removeEventListener('keydown', this.handleKeyDown);
    }
}

export default MazeGame;
