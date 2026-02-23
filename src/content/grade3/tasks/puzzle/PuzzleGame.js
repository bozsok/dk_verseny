import { PuzzleGenerator } from './puzzleGenerator.js';
import { PolyPiece } from './PolyPiece.js';
import { mmax, mmin } from './puzzleGeometry.js';

export class PuzzleGame {
    constructor(container, options) {
        this.container = container;
        this.options = options || {};
        this.numPieces = this.options.numPieces || 16;
        this.timeLimit = this.options.timeLimit || 600;
        this.imagePath = this.options.imagePath || 'assets/images/grade3/puzzle/puzzle.jpg';
        this.onComplete = this.options.onComplete;

        this.pieces = [];
        this.polyPieces = []; // { id, pieces, position, zIndex, instance }
        this.puzzleObj = null;
        this.containerRect = { left: 0, top: 0 };

        this.gameState = 'loading'; // loading, playing, won, lost
        this.timer = 0;
        this.timerInterval = null;
        this.timerStarted = false;
        this.gameStartTime = null;
        this.isCompleted = false;

        this._onResize = this.updateContainerRect.bind(this);
        window.addEventListener('resize', this._onResize);
        window.addEventListener('scroll', this._onResize, true);

        this.initDOM();
        this.loadImage();
    }

    destroy() {
        window.removeEventListener('resize', this._onResize);
        window.removeEventListener('scroll', this._onResize, true);
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.polyPieces.forEach(pp => {
            if (pp.instance) pp.instance.destroy();
        });

        if (this.overlayEl && this.overlayEl.parentNode) {
            this.overlayEl.parentNode.removeChild(this.overlayEl);
        }

        // Timer elem eltávolítása a headerből, ha oda tettük
        if (this.timerTimeEl) {
            const timerBar = this.timerTimeEl.closest('.puzzle-timer-bar');
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
            <div class="puzzle-loading-container" style="display: flex; justify-content: center; align-items: center; height: 100%; color: white; font-family: 'Source Code Pro', monospace; font-size: 20px;">
                <div>Puzzle betöltése...</div>
            </div>
            
            <div class="puzzle-ui" style="display: none;">
                <!-- Ide kerülhetnének extra UI elemek, a timer kikerült a fejlécbe -->
            </div>

            <div class="puzzle-canvas-container" style="display: none; width: 100%; height: 100%; justify-content: center; align-items: center;">
                <div class="puzzle-playfield" style="width: 764px; height: 540px; background-color: var(--secondary-bg, #1a1a2e); position: relative;">
                    <div class="puzzle-container-box" style="position: absolute; width: 100%; height: 100%; pointer-events: auto;">
                        <canvas class="full-image-canvas" width="764" height="540" style="opacity: 0; transition: opacity 1.5s ease;"></canvas>
                    </div>
                </div>
            </div>
        `;

        this.loadingEl = this.container.querySelector('.puzzle-loading-container');
        this.uiEl = this.container.querySelector('.puzzle-ui');
        this.canvasContainerEl = this.container.querySelector('.puzzle-canvas-container');
        this.playfieldEl = this.container.querySelector('.puzzle-playfield');
        this.containerBoxEl = this.container.querySelector('.puzzle-container-box');
        this.fullImageCanvas = this.container.querySelector('.full-image-canvas');

        // Timer sáv dinamikus generálása a modal fejlécébe
        const timerBar = document.createElement('div');
        timerBar.className = 'puzzle-timer-bar';
        timerBar.innerHTML = `
            <span class="puzzle-timer-icon">⏱️</span>
            <span class="puzzle-timer-time">00:00</span>
        `;

        const modalHeader = this.container.closest('.dkv-task-modal-overlay')?.querySelector('.dkv-task-modal-header');
        if (modalHeader) {
            modalHeader.appendChild(timerBar);
        } else {
            this.container.appendChild(timerBar);
        }
        this.timerTimeEl = timerBar.querySelector('.puzzle-timer-time');

        this.overlayEl = document.createElement('div');
        this.overlayEl.className = 'puzzle-overlay';
        this.overlayEl.style.display = 'none';
        this.overlayEl.style.position = 'fixed';
        this.overlayEl.style.top = '0';
        this.overlayEl.style.left = '0';
        this.overlayEl.style.width = '100vw';
        this.overlayEl.style.height = '100vh';
        this.overlayEl.style.pointerEvents = 'none';
        this.overlayEl.style.zIndex = '10000';
        document.body.appendChild(this.overlayEl);
    }

    updateContainerRect() {
        if (!this.containerBoxEl) return;
        const rect = this.containerBoxEl.getBoundingClientRect();
        this.containerRect = { left: rect.left, top: rect.top };

        // Notify all PolyPieces
        this.polyPieces.forEach(pp => {
            if (pp.instance) {
                pp.instance.updateData(null, null, null, this.containerRect);
            }
        });
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    startTimer() {
        if (this.timerStarted || this.gameState !== 'playing') return;
        this.timerStarted = true;
        this.gameStartTime = Date.now();

        this.timerInterval = setInterval(() => {
            this.timer++;
            this.timerTimeEl.textContent = this.formatTime(this.timer);

            if (this.timer >= this.timeLimit) {
                this.handleLose();
            }
        }, 1000);
    }

    loadImage() {
        const img = new Image();
        img.onload = () => {
            setTimeout(() => {
                if (img) this.startGameWithImage(img);
            }, 100);
        };
        img.src = this.imagePath;
    }

    startGameWithImage(img) {
        this.updateContainerRect();

        const { nx, ny } = PuzzleGenerator.computeGridSize(img.naturalWidth, img.naturalHeight, this.numPieces);
        const generatedPieces = PuzzleGenerator.generatePieces(nx, ny);
        const flatPieces = generatedPieces.flat();

        this.pieces = flatPieces;

        const scaling = PuzzleGenerator.calculateScaling(
            img.naturalWidth, img.naturalHeight, 764, 540, nx, ny
        );

        this.puzzleObj = {
            nx, ny,
            scalex: scaling.scalex,
            scaley: scaling.scaley,
            offsx: scaling.offsx,
            offsy: scaling.offsy,
            gameWidth: scaling.gameWidth,
            gameHeight: scaling.gameHeight,
            gameCanvas: this.fullImageCanvas,
            dConnect: mmax(10, mmin(scaling.scalex, scaling.scaley) / 10),
            embossThickness: mmin(2 + scaling.scalex / 200 * 3, 5)
        };

        const ctx = this.fullImageCanvas.getContext('2d');
        ctx.clearRect(0, 0, this.fullImageCanvas.width, this.fullImageCanvas.height);
        ctx.drawImage(
            img,
            0, 0, img.naturalWidth, img.naturalHeight,
            scaling.offsx, scaling.offsy, scaling.gameWidth, scaling.gameHeight
        );

        flatPieces.forEach(piece => piece.scale(this.puzzleObj));

        const W = 764, H = 540;
        const N = flatPieces.length;
        const cols = Math.max(1, Math.ceil(Math.sqrt(N * (W / H))));
        const rows = Math.max(1, Math.ceil(N / cols));
        const cellW = W / cols;
        const cellH = H / rows;

        const cellIndices = Array.from({ length: rows * cols }, (_, i) => i);
        const shuffledCells = PuzzleGenerator.shuffleArray(cellIndices).slice(0, N);

        const initialList = flatPieces.map((piece, index) => {
            const sx = scaling.scalex, sy = scaling.scaley;
            const w = sx, h = sy;

            const cellIdx = shuffledCells[index] ?? index;
            const c = cellIdx % cols;
            const r = Math.floor(cellIdx / cols);
            const cellX = c * cellW;
            const cellY = r * cellH;

            const marginX = Math.min(20, cellW * 0.15);
            const marginY = Math.min(20, cellH * 0.15);
            const randX = cellX + marginX + Math.random() * Math.max(1, (cellW - 2 * marginX));
            const randY = cellY + marginY + Math.random() * Math.max(1, (cellH - 2 * marginY));

            let px = randX - w / 2;
            let py = randY - h / 2;
            px = Math.max(0, Math.min(px, W - w));
            py = Math.max(0, Math.min(py, H - h));

            return {
                id: `piece-${index}`,
                pieces: [piece],
                position: { x: px, y: py },
                zIndex: index + 10
            };
        });

        // Center cluster
        try {
            const vv = window.visualViewport;
            const vw = (vv && vv.width) || window.innerWidth;
            const vh = (vv && vv.height) || window.innerHeight;
            const vOffL = (vv && vv.offsetLeft) || 0;
            const vOffT = (vv && vv.offsetTop) || 0;

            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            initialList.forEach(pp => {
                const w = scaling.scalex;
                const h = scaling.scaley;
                minX = Math.min(minX, pp.position.x);
                minY = Math.min(minY, pp.position.y);
                maxX = Math.max(maxX, pp.position.x + w);
                maxY = Math.max(maxY, pp.position.y + h);
            });

            if (isFinite(minX) && isFinite(minY) && isFinite(maxX) && isFinite(maxY)) {
                const clusterW = maxX - minX;
                const clusterH = maxY - minY;
                const viewportCx = vOffL + vw / 2;
                const viewportCy = vOffT + vh / 2;

                const desiredLeftCanvas = viewportCx - clusterW / 2;
                const desiredTopCanvas = viewportCy - clusterH / 2;
                const desiredLeft = desiredLeftCanvas - (this.containerRect.left || 0);
                const desiredTop = desiredTopCanvas - (this.containerRect.top || 0);

                const dx = desiredLeft - minX;
                const dy = desiredTop - minY;

                const margin = 16;
                const maxShiftLeft = (vOffL + vw - margin) - (this.containerRect.left || 0) - maxX;
                const minShiftLeft = (vOffL + margin) - (this.containerRect.left || 0) - minX;
                const maxShiftTop = (vOffT + vh - margin) - (this.containerRect.top || 0) - maxY;
                const minShiftTop = (vOffT + margin) - (this.containerRect.top || 0) - minY;
                const sdx = Math.min(Math.max(dx, minShiftLeft), maxShiftLeft);
                const sdy = Math.min(Math.max(dy, minShiftTop), maxShiftTop);

                initialList.forEach(pp => { pp.position = { x: pp.position.x + sdx, y: pp.position.y + sdy }; });
            }
        } catch (e) { console.warn(e); }

        const shuffled = PuzzleGenerator.shuffleArray(initialList);

        // Hide loading, show game
        this.loadingEl.style.display = 'none';
        this.uiEl.style.display = 'block';
        this.canvasContainerEl.style.display = 'flex';
        this.overlayEl.style.display = 'block';

        this.gameState = 'playing';
        this.timer = 0;
        this.timerStarted = false;

        // Create PolyPieces
        this.polyPieces = shuffled.map(data => {
            const pp = new PolyPiece(this.overlayEl, {
                id: data.id,
                pieces: data.pieces,
                puzzle: this.puzzleObj,
                position: data.position,
                viewportOffset: this.containerRect,
                zIndex: data.zIndex,
                onMove: this.handlePieceMove.bind(this),
                onDragStart: this.handleDragStart.bind(this),
                onDragEnd: this.handlePieceDragEnd.bind(this)
            });
            return { ...data, instance: pp };
        });
    }

    handleDragStart(polyPieceId) {
        if (!this.timerStarted) {
            this.startTimer();
        }

        const maxZ = this.polyPieces.reduce((m, p) => Math.max(m, p.zIndex || 0), 0);
        const piece = this.polyPieces.find(p => p.id === polyPieceId);
        if (piece) {
            piece.zIndex = maxZ + 1;
            if (piece.instance) piece.instance.updateData(null, null, piece.zIndex);
        }
    }

    handlePieceMove(polyPieceId, newPosition) {
        const piece = this.polyPieces.find(p => p.id === polyPieceId);
        if (piece) {
            piece.position = newPosition;
        }
    }

    getIndexBounds(pp) {
        let minKx = Infinity, minKy = Infinity;
        let maxKx = -Infinity, maxKy = -Infinity;
        pp.pieces.forEach(pc => {
            if (pc == null) return;
            minKx = Math.min(minKx, pc.kx);
            minKy = Math.min(minKy, pc.ky);
            maxKx = Math.max(maxKx, pc.kx);
            maxKy = Math.max(maxKy, pc.ky);
        });
        return { minKx, minKy, maxKx, maxKy };
    }

    getPieceCenter(pp, pc) {
        const { minKx, minKy } = this.getIndexBounds(pp);
        const cx = pp.position.x + (pc.kx - minKx + 0.5) * (this.puzzleObj?.scalex || 1);
        const cy = pp.position.y + (pc.ky - minKy + 0.5) * (this.puzzleObj?.scaley || 1);
        return { x: cx, y: cy };
    }

    handlePieceDragEnd(polyPieceId, newPosition) {
        if (!this.puzzleObj) return;

        const movedIndex = this.polyPieces.findIndex(pp => pp.id === polyPieceId);
        if (movedIndex === -1) return;

        const moved = this.polyPieces[movedIndex];
        moved.position = newPosition || moved.position;

        const others = this.polyPieces.filter(pp => pp.id !== polyPieceId);

        const neighborsDirs = [
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
        ];

        let didMerge = false;
        let movedPosition = { ...moved.position };
        let mergedPieces = [...moved.pieces];
        let mergedZ = moved.zIndex;

        const tryOnePass = (currentList, currentPieces, currentPosition, currentZ) => {
            for (const other of currentList) {
                const otherMap = new Map();
                other.pieces.forEach(p => {
                    otherMap.set(`${p.kx},${p.ky}`, p);
                });
                const otherBounds = this.getIndexBounds(other);

                for (const a of currentPieces) {
                    for (const dir of neighborsDirs) {
                        const key = `${a.kx + dir.dx},${a.ky + dir.dy}`;
                        const b = otherMap.get(key);
                        if (!b) continue;

                        const centerA = this.getPieceCenter({ pieces: currentPieces, position: currentPosition }, a);
                        const centerB = this.getPieceCenter(other, b);
                        const expectedDx = dir.dx * this.puzzleObj.scalex;
                        const expectedDy = dir.dy * this.puzzleObj.scaley;
                        const shiftX = centerB.x - centerA.x - expectedDx;
                        const shiftY = centerB.y - centerA.y - expectedDy;
                        const dist = Math.hypot(shiftX, shiftY);

                        if (dist <= (this.puzzleObj.dConnect || 12)) {
                            const snappedPosition = {
                                x: currentPosition.x + shiftX,
                                y: currentPosition.y + shiftY
                            };
                            const movedBounds = this.getIndexBounds({ pieces: currentPieces });
                            const mergedMinKx = Math.min(movedBounds.minKx, otherBounds.minKx);
                            const mergedMinKy = Math.min(movedBounds.minKy, otherBounds.minKy);

                            const adjustedPosition = {
                                x: snappedPosition.x - (movedBounds.minKx - mergedMinKx) * (this.puzzleObj.scalex || 1),
                                y: snappedPosition.y - (movedBounds.minKy - mergedMinKy) * (this.puzzleObj.scaley || 1)
                            };

                            const mergedGroup = {
                                pieces: [...currentPieces, ...other.pieces],
                                position: adjustedPosition,
                                zIndex: Math.max(currentZ, other.zIndex) + 1
                            };

                            const remainder = currentList.filter(pp => pp.id !== other.id);
                            didMerge = true;
                            return { newList: remainder, newGroup: mergedGroup, mergedOtherId: other.id };
                        }
                    }
                }
            }
            return null;
        };

        let workingList = others;
        let toDestroy = [];

        while (true) {
            const res = tryOnePass(workingList, mergedPieces, movedPosition, mergedZ);
            if (!res) break;
            mergedPieces = res.newGroup.pieces;
            movedPosition = res.newGroup.position;
            mergedZ = res.newGroup.zIndex;
            toDestroy.push(res.mergedOtherId);
            workingList = res.newList;
        }

        if (didMerge) {
            if (moved.instance) moved.instance.destroy();
            toDestroy.forEach(id => {
                const old = this.polyPieces.find(p => p.id === id);
                if (old && old.instance) old.instance.destroy();
            });

            const newId = `merged-final-${Date.now()}`;
            const newPolyPiece = new PolyPiece(this.overlayEl, {
                id: newId,
                pieces: mergedPieces,
                puzzle: this.puzzleObj,
                position: movedPosition,
                viewportOffset: this.containerRect,
                zIndex: mergedZ,
                onMove: this.handlePieceMove.bind(this),
                onDragStart: this.handleDragStart.bind(this),
                onDragEnd: this.handlePieceDragEnd.bind(this)
            });

            const mergedData = {
                id: newId,
                pieces: mergedPieces,
                position: movedPosition,
                zIndex: mergedZ,
                instance: newPolyPiece
            };

            this.polyPieces = [...workingList, mergedData];

            if (this.polyPieces.length === 1) {
                this.handleWin();
            }
        }
    }

    handleWin() {
        clearInterval(this.timerInterval);
        this.gameState = 'won';
        this.isCompleted = true;

        // Hide overlay, fade in full image
        this.overlayEl.style.display = 'none';
        this.fullImageCanvas.style.opacity = '1';

        if (this.onComplete) {
            this.onComplete({
                success: true,
                timeElapsed: this.timer,
                points: 5,
                maxPoints: 5
            });
        }
    }

    handleLose() {
        clearInterval(this.timerInterval);
        this.gameState = 'lost';
        this.isCompleted = true;

        this.overlayEl.style.pointerEvents = 'none';

        if (this.onComplete) {
            this.onComplete({
                success: false,
                timeElapsed: this.timeLimit,
                points: 0,
                maxPoints: 5
            });
        }
    }
}
