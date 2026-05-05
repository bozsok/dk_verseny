/**
 * PuzzleService.js
 * Központi szolgáltatás a kódfal generálásához és a puzzle darabok kezeléséhez.
 *
 * „Egy fal, sok ablak" koncepció:
 * - Egyetlen összefüggő kódfalat generálunk (a tools/puzzle-generator paramétereiből).
 * - Minden puzzle-darab ennek a falnak egy jigsaw formájú kivágata.
 */

/**
 * A puzzle-generator eszközből exportált beállítások (TELJES).
 * @const
 */
const MASTER_CONFIG = {
    // Elrendezés
    padding: 10,
    density: 26,
    blocksPerColumn: 3,
    blockGap: 23,
    fontSize: 30,
    lineHeight: 1.3,
    scanlineOpacity: 0,
    bgColor: '#050505',

    // Színenkénti beállítások
    colors: {
        cyan:   { color: '#00f2ff', weight: 17,  glow: 5,  sizeOffset: -5, opacity: 0.9 },
        dim:    { color: '#444444', weight: 100, glow: 0,  sizeOffset: -5, opacity: 1.0 },
        yellow: { color: '#ffdd00', weight: 10,  glow: 5,  sizeOffset: -5, opacity: 0.8 },
        purple: { color: '#bd00ff', weight: 57,  glow: 10, sizeOffset: -5, opacity: 0.8 },
        green:  { color: '#39ff14', weight: 19,  glow: 10, sizeOffset: -5, opacity: 0.8 }
    },

    // Fejléc szövegek (blokkonként 1-1)
    infoTexts: [
        '*** NAGY FRISSÍTÉS PROTOKOLL v9.2 - A KÓD KIRÁLYSÁG HIBAJAVÍTÁSA ***',
        '*** HOSSZÚTÁVÚ MEMÓRIA POOL FOGLALÁSA ***',
        '*** LOGIKAI ALAPKONFIGURÁCIÓ INICIALIZÁLÁSA ***'
    ]
};

// ─── Geometriai segédosztályok ───

class SeededRandom {
    constructor(seed = 'dkv_default_seed') {
        this.seed = seed;
        this.state = this._hash(seed);
    }

    _hash(str) {
        let h = 2166136261 >>> 0;
        for (let i = 0; i < str.length; i++) {
            h = Math.imul(h ^ str.charCodeAt(i), 16777619);
        }
        return h >>> 0;
    }

    next() {
        this.state |= 0;
        this.state = (this.state + 0x6D2B79F5) | 0;
        let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) | 0;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    alea(min, max) { return this.next() * (max - min) + min; }
    intAlea(max) { return Math.floor(this.next() * max); }
}


class Point {
    constructor(x, y) { this.x = x; this.y = y; }
    clone() { return new Point(this.x, this.y); }
}

class Segment {
    constructor(p0, p1, p2, p3) {
        this.p0 = p0; this.p1 = p1; this.p2 = p2; this.p3 = p3;
    }
    reversed() {
        return new Segment(this.p3.clone(), this.p2.clone(), this.p1.clone(), this.p0.clone());
    }
}

class Side {
    constructor(p1, p2) {
        this.points = [p1.clone(), p2.clone()];
        this.segments = [];
        this.type = "d"; // default straight
    }
    reversed() {
        const rs = new Side(this.points[1], this.points[0]);
        rs.segments = this.segments.map(s => s.reversed()).reverse();
        rs.type = this.type;
        return rs;
    }
}

class Piece {
    constructor(kx, ky) {
        this.kx = kx; this.ky = ky;
        this.ts = new Side(new Point(0,0), new Point(1,0));
        this.rs = new Side(new Point(1,0), new Point(1,1));
        this.bs = new Side(new Point(1,1), new Point(0,1));
        this.ls = new Side(new Point(0,1), new Point(0,0));
    }
}

// ─── Fő szolgáltatás ───

export class PuzzleService {
    constructor() {
        this.rng = new SeededRandom();
        /** @type {Array<Array<{text:string,type:string}>>[]|null} Blokkok tömbje, blokkonként sorok */
        this.masterWall = null;
        this.config = {
            nx: 5,
            ny: 3
        };

        this.baseSnippets = [
            'IF (x9A > 0xFF) {', '0x7F3E: <DATA> / --- init --- / ===', ':: group_INFO = { .usage = ATOMIC_INIT(2) };',
            '[0x1A3B] >> <<< 0b1101_0110 1010_0011', 'for (i = 0; i < nBlocks; i++) {', '++pChild -> next = NULL; /* load sequence */',
            'while (count--) { *++p = *--q;', 'buf[i] = (char *) get_free_page(GFP_USER);', '0xBEEF : == === === ==> >> ÷>> ÷>>>',
            'struct node *p = NULL;', 'return -EFAULT;', 'case 0x2A:', 'if (!b', 'default: --- ===',
            '1011_1100 0101_0011 1110_0001 0001_1010 f0a8', '<meta charset="utf-8" />', 'function parse() {',
            'var q = a.split(" ");', 'q.reverse(); // checksum', '[--] { } < > ( ) --- crc32 = (crc32 ^ table(crc32 ^ b',
            '!==! = + !==== && -:tco. 2a2 >>-!! >> >> >>>', '== --- TODO: fixme_optimize >> > ===',
            '0xDEAD : + - * / % ^ & ! << <> <> >>> :: end ::'
        ];

        this.blockHeaders = [
            '/* RENDSZER-ANALÍZIS FOLYAMATBAN... */', '/* ADATBÁZIS SZINKRONIZÁCIÓ KÉRÉSE */',
            '/* ZÉRÓ-SZEKVENCIA DETEKTÁLVA A 4-ES SZEKTORBAN */', '/* QUANTUM-HUROK INICIALIZÁLÁSA */',
            '/* PROTOKOLL 0x7F VÉGREHAJTÁSA */', '/* TITKOSÍTOTT ADATFOLYAM DEKÓDOLÁSA */',
            '/* INTEGRITÁS ELLENŐRZÉSE: 99.8% */', '/* SZERVER-KERESÉS: STATION_05... */',
            '/* ANOMÁLIA-DETEKTOR AKTIVÁLVA */', '/* MAG-REAKTOR STABILIZÁLÁSA */',
            '/* MEMÓRIA-SZEGMENS ÚJRAOSZTÁSA... */', '/* BIZTONSÁGI ZSILIP FELOLDÁSA */',
            '/* ADAT-SZIVÁRGÁS ELHÁRÍTÁSA */', '/* KRITIKUS HIBA JAVÍTÁSA: 0xDEADBEEF */',
            '/* HÁLÓZATI CSOMÓPONT VIZSGÁLATA */'
        ];

        /** @type {number} Egy darab pixel-méretei (a PuzzlePiece rendereléshez) */
        this.pieceW = 400;
        this.pieceH = 360; // 1080 / 3 = 360 (hogy a kódfal tartalom beleférjen)
    }

    /**
     * Inicializálás: kódfal, geometria és sorsolt darabok legenerálása.
     * @param {string} seed - A véletlenszám mag.
     */
    init(seed) {
        this.rng = new SeededRandom(seed);
        this.masterWall = this.generateMasterWall();
        this.earnedIndices = this.generateEarnedIndices();
        this.cachedGeometry = this.generateGeometry();
    }

    /**
     * Legenerál 5 egyedi indexet (0-14) a 15 darabból a seed alapján.
     */
    generateEarnedIndices() {
        const indices = Array.from({ length: 15 }, (_, i) => i);
        const earned = [];
        const tempRng = new SeededRandom(this.rng.seed); // Külön RNG a sorsoláshoz
        
        for (let i = 0; i < 5; i++) {
            const idx = tempRng.intAlea(indices.length);
            earned.push(indices.splice(idx, 1)[0]);
        }
        return earned;
    }

    setStateManager(stateManager) {
        this.stateManager = stateManager;
    }

    // ─── Kódfal generálás (a tools/puzzle-generator logikája alapján) ───

    /**
     * Egyetlen összefüggő kódfalat generál.
     * A kimenet blokkok tömbje, blokkonként sorok tömbje, soronként tokenek.
     * @returns {Array<Array<Array<{text:string,type:string}>>>}
     */
    generateMasterWall() {
        const blocks = [];
        const weights = {};
        for (const [key, val] of Object.entries(MASTER_CONFIG.colors)) {
            weights[key] = val.weight;
        }
        const totalW = Object.values(weights).reduce((a, b) => a + b, 0);

        // Célszélesség karakterben: a teljes fal szélessége / becsült karakter-szélesség
        const wallWidth = this.pieceW * this.config.nx;
        const effectiveFontSize = MASTER_CONFIG.fontSize - 5; // sizeOffset mindenhol -5
        const charWidth = effectiveFontSize * 0.6; // monospace arány
        const targetLen = Math.ceil((wallWidth - 2 * MASTER_CONFIG.padding) / charWidth);

        let remainingLines = MASTER_CONFIG.density;
        let infoIdx = 0;

        for (let b = 0; b < MASTER_CONFIG.blocksPerColumn; b++) {
            const blockLines = [];
            let linesInBlock;

            if (b === MASTER_CONFIG.blocksPerColumn - 1) {
                linesInBlock = remainingLines;
            } else {
                const avgLines = Math.max(2, Math.floor(remainingLines / (MASTER_CONFIG.blocksPerColumn - b)));
                linesInBlock = Math.max(2, Math.floor(avgLines * (0.5 + this.rng.next())));
                if (linesInBlock > remainingLines - (MASTER_CONFIG.blocksPerColumn - b - 1) * 2) {
                    linesInBlock = remainingLines - (MASTER_CONFIG.blocksPerColumn - b - 1) * 2;
                }
            }
            remainingLines -= linesInBlock;

            for (let l = 0; l < linesInBlock; l++) {
                const isHeader = (l === 0);
                let customHeader = null;
                if (isHeader && infoIdx < MASTER_CONFIG.infoTexts.length) {
                    customHeader = MASTER_CONFIG.infoTexts[infoIdx++];
                }
                blockLines.push(this.createWallLine(isHeader, customHeader, weights, totalW, targetLen));
            }

            blocks.push(blockLines);
            if (remainingLines <= 0) break;
        }

        return blocks;
    }

    /**
     * Egy kódfal-sor generálása (a puzzle-generator createLine logikája alapján).
     * @param {boolean} isHeader - Fejlécsor-e
     * @param {string|null} customHeader - Egyedi fejléc szöveg
     * @param {Object} weights - Színenkénti súlyok
     * @param {number} totalW - Összsúly
     * @param {number} targetLen - Célszélesség karakterben
     * @returns {Array<{text:string,type:string}>}
     */
    createWallLine(isHeader, customHeader, weights, totalW, targetLen) {
        if (isHeader) {
            const header = customHeader || this.blockHeaders[this.rng.intAlea(this.blockHeaders.length)];
            const tokens = [{ text: header, type: 'white' }];
            // Kitöltés a sor végéig dim zajjal (ahogy a tool teszi)
            const remaining = targetLen - header.length;
            for (let i = 0; i < remaining; i++) {
                tokens.push({ text: this.generateNoise(1), type: 'dim' });
            }
            return tokens;
        }

        const tokens = [];
        let currentLen = 0;

        // Behúzás (a tool 5 szintű: [0, 0, 2, 4, 8])
        const indentLevels = [0, 0, 2, 4, 8];
        const indent = indentLevels[this.rng.intAlea(indentLevels.length)];
        if (indent > 0) {
            tokens.push({ text: ' '.repeat(indent), type: 'white' });
            currentLen += indent;
        }

        const colorW = weights.cyan + weights.yellow + weights.purple + weights.green;

        while (currentLen < targetLen) {
            const rand = this.rng.next() * totalW;
            if (rand < colorW) {
                const snippet = this.baseSnippets[this.rng.intAlea(this.baseSnippets.length)];
                if (currentLen + snippet.length <= targetLen) {
                    tokens.push(...this.tokenizeSnippet(snippet, weights));
                    currentLen += snippet.length;
                } else {
                    // A snippet nem fér be – kitöltjük a maradékot dim zajjal
                    while (currentLen < targetLen) {
                        tokens.push({ text: this.generateNoise(1), type: (this.rng.next() > 0.3) ? 'dim' : 'cyan' });
                        currentLen++;
                    }
                    break;
                }
            } else {
                // Zaj generálása (dim vagy cyan)
                const type = (this.rng.next() > 0.3) ? 'dim' : 'cyan';
                tokens.push({ text: this.generateNoise(1), type });
                currentLen++;
            }
        }

        return tokens;
    }

    /**
     * Kódrészlet tokenizálása színtípusok szerint.
     * @param {string} text - A tokenizálandó szöveg
     * @param {Object} weights - Színenkénti súlyok
     * @returns {Array<{text:string,type:string}>}
     */
    tokenizeSnippet(text, weights) {
        const parts = text.split(/(\/\*.*?\*\/|\/\/.*|0x[0-9A-F]+|0b[01_]+|\s+|[{}()[\]]|[:;,.=><!&|+*/%^-]+|\w+)/gi).filter(t => t);
        const colorW = weights.cyan + weights.yellow + weights.purple + weights.green;
        return parts.map(token => {
            let type = 'cyan';
            if (token.match(/\/\*|\/\/|::/)) type = 'purple';
            else if (token.match(/0x|0b|[{}()[\]]|[:;,.=><!&|+*/%^-]+/)) type = 'yellow';
            else if (token.match(/if|for|while|function|return|struct|var|case|default|else/i)) type = 'green';
            const weight = weights[type] || 0;
            if (type !== 'cyan' && this.rng.next() > (weight / colorW)) type = 'cyan';
            return { text: token, type };
        });
    }

    /**
     * Véletlenszerű zaj-karakter generálása.
     * @param {number} length - Karakterszám
     * @returns {string}
     */
    generateNoise(length) {
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>/? ';
        let noise = '';
        for (let i = 0; i < length; i++) noise += symbols[this.rng.intAlea(symbols.length)];
        return noise;
    }

    // ─── Jigsaw geometria (változatlan) ───

    generateGeometry() {
        const nx = this.config.nx;
        const ny = this.config.ny;
        const coeffDecentr = 0.12;

        const corners = [];
        for (let ky = 0; ky <= ny; ++ky) {
            corners[ky] = [];
            for (let kx = 0; kx <= nx; ++kx) {
                corners[ky][kx] = new Point(
                    kx + this.rng.alea(-coeffDecentr, coeffDecentr),
                    ky + this.rng.alea(-coeffDecentr, coeffDecentr)
                );
                if (kx === 0) corners[ky][kx].x = 0;
                if (kx === nx) corners[ky][kx].x = nx;
                if (ky === 0) corners[ky][kx].y = 0;
                if (ky === ny) corners[ky][kx].y = ny;
            }
        }

        const pieces = [];
        for (let ky = 0; ky < ny; ++ky) {
            for (let kx = 0; kx < nx; ++kx) {
                const piece = new Piece(kx, ky);
                
                // Top side
                if (ky === 0) {
                    piece.ts.points = [corners[ky][kx].clone(), corners[ky][kx + 1].clone()];
                } else {
                    piece.ts = pieces[(ky-1)*nx + kx].bs.reversed();
                }

                // Right side
                piece.rs.points = [corners[ky][kx+1].clone(), corners[ky+1][kx+1].clone()];
                if (kx < nx - 1) this.twist0(piece.rs);

                // Bottom side
                piece.bs.points = [corners[ky+1][kx+1].clone(), corners[ky+1][kx].clone()];
                if (ky < ny - 1) this.twist0(piece.bs);

                // Left side
                if (kx === 0) {
                    piece.ls.points = [corners[ky+1][kx].clone(), corners[ky][kx].clone()];
                } else {
                    piece.ls = pieces[ky*nx + (kx-1)].rs.reversed();
                }

                pieces.push(piece);
            }
        }
        return pieces;
    }

    twist0(side) {
        const p0 = side.points[0];
        const p3 = side.points[1];
        const dx = p3.x - p0.x;
        const dy = p3.y - p0.y;
        const ux = -dy;
        const uy = dx;

        const depth = this.rng.alea(0.15, 0.25);
        const width = this.rng.alea(0.4, 0.6);
        const signx = this.rng.next() > 0.5 ? 1 : -1;

        const mid1 = new Point(p0.x + dx * (0.5 - width/2), p0.y + dy * (0.5 - width/2));
        const mid2 = new Point(p0.x + dx * (0.5 + width/2), p0.y + dy * (0.5 + width/2));

        const cp1 = new Point(
            mid1.x + ux * depth * signx * this.rng.alea(0.8, 1.2),
            mid1.y + uy * depth * signx * this.rng.alea(0.8, 1.2)
        );
        const cp2 = new Point(
            mid2.x + ux * depth * signx * this.rng.alea(0.8, 1.2),
            mid2.y + uy * depth * signx * this.rng.alea(0.8, 1.2)
        );

        side.segments = [
            new Segment(p0.clone(), p0.clone(), mid1.clone(), mid1.clone()),
            new Segment(mid1.clone(), cp1.clone(), cp2.clone(), mid2.clone()),
            new Segment(mid2.clone(), p3.clone(), p3.clone(), p3.clone())
        ];
        side.type = signx > 0 ? "o" : "i";
    }

    // ─── Publikus interfész ───

    /**
     * A kódfal DOM elemének egyszeri felépítése és gyorsítótárazása.
     * Visszaad egy kész DOM klónt, amelyet a PuzzlePiece azonnal felhasználhat.
     * @returns {HTMLElement}
     */
    getWallDOMClone() {
        if (!this._cachedWallDOM) {
            const mc = MASTER_CONFIG;
            const wallContainer = document.createElement('div');
            wallContainer.className = 'dkv-puzzle-wall';

            this.masterWall.forEach((block, blockIdx) => {
                const blockDiv = document.createElement('div');
                blockDiv.className = 'dkv-puzzle-block';
                if (blockIdx > 0) {
                    blockDiv.style.marginTop = `${mc.blockGap}px`;
                }

                block.forEach(line => {
                    const lineDiv = document.createElement('div');
                    lineDiv.className = 'dkv-puzzle-line';
                    line.forEach(token => {
                        const span = document.createElement('span');
                        span.className = `dkv-token-${token.type}`;
                        span.textContent = token.text;
                        lineDiv.appendChild(span);
                    });
                    blockDiv.appendChild(lineDiv);
                });

                wallContainer.appendChild(blockDiv);
            });

            this._cachedWallDOM = wallContainer;
        }

        return this._cachedWallDOM.cloneNode(true);
    }

    /**
     * Egy konkrét darabka adatainak lekérése.
     * A teljes kódfal-adatot adja vissza (a PuzzlePiece maga végzi a kivágást).
     * @param {number} index - A darabka indexe (0-14), vagy állomás száma (1-5)
     * @param {boolean} isStation - Ha true, az earnedIndices-ből veszi az indexet
     * @returns {Object|null}
     */
    getPiece(index, isStation = false) {
        if (!this.masterWall || !this.cachedGeometry) return null;
        
        let actualIndex = index;
        if (isStation) {
            actualIndex = this.earnedIndices[index - 1];
        }

        const pieceGeo = this.cachedGeometry[actualIndex];
        return {
            index: actualIndex,
            col: pieceGeo.kx,
            row: pieceGeo.ky,
            pieceW: this.pieceW,
            pieceH: this.pieceH,
            masterConfig: MASTER_CONFIG,
            config: this.config,
            geometry: pieceGeo
        };
    }
}

export const puzzleService = new PuzzleService();
