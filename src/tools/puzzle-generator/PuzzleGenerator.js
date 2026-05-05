/**
 * 'Ismeretlen' Kód-generátor Logika - Színválasztókkal bővítve
 */

class PuzzleGenerator {
    constructor() {
        this.container = document.getElementById('code-content');
        this.controlsPanel = document.getElementById('controls-panel');

        this.controls = {
            padding: document.getElementById('padding'),
            density: document.getElementById('density'),
            columns: document.getElementById('columns'),
            columnGap: document.getElementById('columnGap'),
            blocksPerColumn: document.getElementById('blocksPerColumn'),
            blockGap: document.getElementById('blockGap'),
            fontSize: document.getElementById('fontSize'),
            lineHeight: document.getElementById('lineHeight'),
            scanlineOpacity: document.getElementById('scanlineOpacity'),
            bgColor: document.getElementById('bgColor'),
            regenerate: document.getElementById('regenerate'),
            save: document.getElementById('save-image'),
            cyan: {
                c: document.getElementById('c-cyan'),
                w: document.getElementById('p-cyan'),
                g: document.getElementById('g-cyan'),
                s: document.getElementById('s-cyan'),
                o: document.getElementById('o-cyan')
            },
            dim: {
                c: document.getElementById('c-dim'),
                w: document.getElementById('p-dim'),
                g: document.getElementById('g-dim'),
                s: document.getElementById('s-dim'),
                o: document.getElementById('o-dim')
            },
            yellow: {
                c: document.getElementById('c-yellow'),
                w: document.getElementById('p-yellow'),
                g: document.getElementById('g-yellow'),
                s: document.getElementById('s-yellow'),
                o: document.getElementById('o-yellow')
            },
            purple: {
                c: document.getElementById('c-purple'),
                w: document.getElementById('p-purple'),
                g: document.getElementById('g-purple'),
                s: document.getElementById('s-purple'),
                o: document.getElementById('o-purple')
            },
            green: {
                c: document.getElementById('c-green'),
                w: document.getElementById('p-green'),
                g: document.getElementById('g-green'),
                s: document.getElementById('s-green'),
                o: document.getElementById('o-green')
            },
            infoText: document.getElementById('infoText')
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
            '/* RENDSZER-ANALÍZIS FOLYAMATBAN... */',
            '/* ADATBÁZIS SZINKRONIZÁCIÓ KÉRÉSE */',
            '/* ZÉRÓ-SZEKVENCIA DETEKTÁLVA A 4-ES SZEKTORBAN */',
            '/* QUANTUM-HUROK INICIALIZÁLÁSA */',
            '/* PROTOKOLL 0x7F VÉGREHAJTÁSA */',
            '/* TITKOSÍTOTT ADATFOLYAM DEKÓDOLÁSA */',
            '/* INTEGRITÁS ELLENŐRZÉSE: 99.8% */',
            '/* SZERVER-KERESÉS: STATION_05... */',
            '/* ANOMÁLIA-DETEKTOR AKTIVÁLVA */',
            '/* MAG-REAKTOR STABILIZÁLÁSA */',
            '/* MEMÓRIA-SZEGMENS ÚJRAOSZTÁSA... */',
            '/* BIZTONSÁGI ZSILIP FELOLDÁSA */',
            '/* ADAT-SZIVÁRGÁS ELHÁRÍTÁSA */',
            '/* KRITIKUS HIBA JAVÍTÁSA: 0xDEADBEEF */',
            '/* HÁLÓZATI CSOMÓPONT VIZSGÁLATA */'
        ];

        this.STORAGE_KEY = 'pg_settings_v4';
        this.init();
    }

    init() {
        const tabBtns = document.querySelectorAll('.pg-tab-btn');
        const tabContents = document.querySelectorAll('.pg-tab-content');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
            });
        });

        this.loadFromLocalStorage();

        this.controls.padding.addEventListener('input', () => {
            const valSpan = document.getElementById('padding-val');
            if (valSpan) valSpan.textContent = this.controls.padding.value;
            this.updateStyles();
            this.generate();
            this.saveToLocalStorage();
        });
        const allInputs = document.querySelectorAll('.pg-controls input');
        allInputs.forEach(input => {
            input.addEventListener('input', () => {
                const valSpan = document.getElementById(`${input.id}-val`);
                if (valSpan) valSpan.textContent = input.value;
                this.updatePercentages();
                this.updateStyles();
                this.saveToLocalStorage();
            });
        });

        this.controls.infoText.addEventListener('input', () => {
            this.saveToLocalStorage();
        });

        this.controls.regenerate.addEventListener('click', () => this.generate());
        this.controls.save.addEventListener('click', () => this.saveAsImage());

        document.getElementById('save-config').addEventListener('click', () => this.exportConfig());
        document.getElementById('load-config').addEventListener('click', () => document.getElementById('config-file').click());
        document.getElementById('config-file').addEventListener('change', (e) => this.importConfig(e));

        window.addEventListener('resize', () => this.generate());
        this.updatePercentages();
        this.generate();
        this.updateStyles();
    }

    saveToLocalStorage() {
        const config = {};
        document.querySelectorAll('.pg-controls input').forEach(input => {
            config[input.id] = input.value;
        });
        config.infoText = this.controls.infoText.value;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                const config = JSON.parse(saved);
                this.applyConfig(config);
            } catch (e) { /* ignore */ }
        }
    }

    applyConfig(config) {
        Object.keys(config).forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.value = config[id];
                const valSpan = document.getElementById(`${id}-val`);
                if (valSpan) valSpan.textContent = input.value;
            }
        });
        if (config.infoText !== undefined) {
            this.controls.infoText.value = config.infoText;
        }
    }

    updatePercentages() {
        const weights = {
            cyan: parseInt(this.controls.cyan.w.value),
            dim: parseInt(this.controls.dim.w.value),
            yellow: parseInt(this.controls.yellow.w.value),
            purple: parseInt(this.controls.purple.w.value),
            green: parseInt(this.controls.green.w.value)
        };
        const total = weights.cyan + weights.dim + weights.yellow + weights.purple + weights.green || 1;
        ['cyan', 'dim', 'yellow', 'purple', 'green'].forEach(key => {
            const pct = Math.round((weights[key] / total) * 100);
            const pctSpan = document.getElementById(`p-${key}-pct`);
            if (pctSpan) pctSpan.textContent = pct;
        });
    }

    updateStyles() {
        const root = document.documentElement;
        root.style.setProperty('--content-padding', `${this.controls.padding.value}px`);
        root.style.setProperty('--global-font-size', `${this.controls.fontSize.value}px`);
        root.style.setProperty('--global-line-height', this.controls.lineHeight.value);
        root.style.setProperty('--column-gap', `${this.controls.columnGap.value}px`);
        root.style.setProperty('--block-gap', `${this.controls.blockGap.value}px`);
        root.style.setProperty('--scanline-opacity', this.controls.scanlineOpacity.value);
        root.style.setProperty('--bg-color', this.controls.bgColor.value);

        ['cyan', 'dim', 'yellow', 'purple', 'green'].forEach(key => {
            const ctrl = this.controls[key];
            root.style.setProperty(`--code-${key}`, ctrl.c.value);
            root.style.setProperty(`--${key}-glow`, `${ctrl.g.value}px`);
            root.style.setProperty(`--${key}-opacity`, ctrl.o.value);
            if (ctrl.s) root.style.setProperty(`--${key}-size-offset`, `${ctrl.s.value}px`);
        });
    }

    generate() {
        this.container.innerHTML = '';

        // Mérési logika a pontos szélességhez
        this.charWidths = {};
        const measure = (type) => {
            const tempLine = document.createElement('div');
            tempLine.className = 'pg-line';
            tempLine.style.visibility = 'hidden';
            tempLine.style.position = 'absolute';
            const span = document.createElement('span');
            span.className = `token-${type}`;
            span.textContent = 'M'; // Széles karakter a méréshez
            tempLine.appendChild(span);
            document.body.appendChild(tempLine);
            const width = span.getBoundingClientRect().width;
            document.body.removeChild(tempLine);
            return width;
        };

        ['white', 'cyan', 'dim', 'yellow', 'purple', 'green'].forEach(t => {
            this.charWidths[t] = measure(t);
        });

        const totalLines = parseInt(this.controls.density.value);
        const colCount = parseInt(this.controls.columns.value);
        const blocksPerCol = parseInt(this.controls.blocksPerColumn.value);

        const globalFontSize = parseInt(this.controls.fontSize.value);
        
        // Pontos belső szélesség mérése a padding levonásával
        const style = window.getComputedStyle(this.container);
        const paddingLeft = parseFloat(style.paddingLeft) || 0;
        const paddingRight = parseFloat(style.paddingRight) || 0;
        const totalWidth = this.container.clientWidth - paddingLeft - paddingRight;
        
        const gapSize = parseInt(this.controls.columnGap.value);
        const totalGap = (colCount - 1) * gapSize;
        const colWidthPx = ((totalWidth - totalGap) / colCount) - 1; 

        const w = {
            cyan: parseInt(this.controls.cyan.w.value),
            dim: parseInt(this.controls.dim.w.value),
            yellow: parseInt(this.controls.yellow.w.value),
            purple: parseInt(this.controls.purple.w.value),
            green: parseInt(this.controls.green.w.value)
        };
        const totalW = w.cyan + w.dim + w.yellow + w.purple + w.green || 1;

        // Felhasználói infó sorok előkészítése
        const infoLines = this.controls.infoText.value.split('\n').filter(l => l.trim() !== '');
        let infoIdx = 0;

        for (let c = 0; c < colCount; c++) {
            const colDiv = document.createElement('div');
            colDiv.className = 'pg-column';

            let remainingLines = totalLines;
            for (let b = 0; b < blocksPerCol; b++) {
                const blockDiv = document.createElement('div');
                blockDiv.className = 'pg-block';

                let linesInBlock;
                if (b === blocksPerCol - 1) {
                    linesInBlock = remainingLines;
                } else {
                    const avgLines = Math.max(2, Math.floor(remainingLines / (blocksPerCol - b)));
                    linesInBlock = Math.max(2, Math.floor(avgLines * (0.5 + Math.random())));
                    if (linesInBlock > remainingLines - (blocksPerCol - b - 1) * 2) {
                        linesInBlock = remainingLines - (blocksPerCol - b - 1) * 2;
                    }
                }
                remainingLines -= linesInBlock;

                for (let l = 0; l < linesInBlock; l++) {
                    const isHeader = (l === 0);

                    let customHeader = null;
                    if (isHeader && infoIdx < infoLines.length) {
                        customHeader = infoLines[infoIdx++];
                    }

                    blockDiv.appendChild(this.createLine(colWidthPx, w, totalW, isHeader, customHeader, globalFontSize));
                }
                colDiv.appendChild(blockDiv);
                if (remainingLines <= 0) break;
            }
            this.container.appendChild(colDiv);
        }
    }
    createLine(targetWidthPx, w, totalW, isHeader = false, customHeader = null, globalFontSize) {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'pg-line';

        const getCharWidth = (type) => this.charWidths[type] || (globalFontSize * 0.6);

        if (isHeader) {
            let header = customHeader || this.blockHeaders[Math.floor(Math.random() * this.blockHeaders.length)];
            const charW = getCharWidth('white');

            if (header.length * charW > targetWidthPx) {
                header = header.substring(0, Math.floor(targetWidthPx / charW));
            }

            let currentWidth = this.addToken(lineDiv, header, 'white', globalFontSize);

            // Kitöltés a végéig
            const dimW = getCharWidth('dim');
            while (currentWidth + dimW <= targetWidthPx) {
                currentWidth += this.addToken(lineDiv, this.generateNoise(1), 'dim', globalFontSize);
            }
            return lineDiv;
        }

        let currentWidth = 0;
        const indentLevels = [0, 0, 2, 4, 8];
        const indent = indentLevels[Math.floor(Math.random() * indentLevels.length)];
        if (indent > 0) {
            currentWidth += this.addToken(lineDiv, ' '.repeat(indent), 'white', globalFontSize);
        }

        const colorW = w.cyan + w.yellow + w.purple + w.green;
        while (currentWidth < targetWidthPx) {
            const rand = Math.random() * totalW;
            if (rand < colorW) {
                const snippet = this.baseSnippets[Math.floor(Math.random() * this.baseSnippets.length)];

                // Megkeressük a legszélesebb karaktert a snippetben a pontosabb becsléshez
                const maxOffset = Math.max(
                    (this.controls.cyan.s ? parseInt(this.controls.cyan.s.value) : 0),
                    (this.controls.yellow.s ? parseInt(this.controls.yellow.s.value) : 0),
                    (this.controls.purple.s ? parseInt(this.controls.purple.s.value) : 0),
                    (this.controls.green.s ? parseInt(this.controls.green.s.value) : 0)
                );
                const snippetEstimatedWidth = snippet.length * (globalFontSize + maxOffset) * 0.61;

                if (currentWidth + snippetEstimatedWidth <= targetWidthPx) {
                    currentWidth += this.renderGranularSnippet(lineDiv, snippet, w, totalW, globalFontSize);
                } else {
                    // Ha a snippet nem fér be, zajjal töltjük ki a maradékot a legvégéig
                    const dimW = getCharWidth('dim');
                    while (currentWidth + dimW <= targetWidthPx) {
                        currentWidth += this.addToken(lineDiv, this.generateNoise(1), 'dim', globalFontSize);
                    }
                    break;
                }
            } else {
                // Zaj generálása (dim vagy cyan)
                const type = (w.dim > 0 && Math.random() > 0.3) ? 'dim' : 'cyan';
                const charW = getCharWidth(type);
                if (currentWidth + charW <= targetWidthPx) {
                    currentWidth += this.addToken(lineDiv, this.generateNoise(1), type, globalFontSize);
                } else {
                    break;
                }
            }
        }
        return lineDiv;
    }

    renderGranularSnippet(container, text, w, totalW, globalFontSize) {
        const tokens = text.split(/(\/\*.*?\*\/|\/\/.*|0x[0-9A-F]+|0b[01_]+|\s+|[{}()[\]]|[:;,.=><!&|+*/%^-]+|\w+)/gi).filter(t => t);
        let totalTokenWidth = 0;
        tokens.forEach(token => {
            let type = 'cyan';
            if (token.match(/\/\*|\/\/|::/)) type = 'purple';
            else if (token.match(/0x|0b|[{}()[\]]|[:;,.=><!&|+*/%^-]+/)) type = 'yellow';
            else if (token.match(/if|for|while|function|return|struct|var|case|default|else/i)) type = 'green';
            const weight = w[type] || 0;
            const colorW = w.cyan + w.yellow + w.purple + w.green;
            const chance = weight / colorW;
            if (type !== 'cyan' && Math.random() > chance) type = 'cyan';
            totalTokenWidth += this.addToken(container, token, type, globalFontSize);
        });
        return totalTokenWidth;
    }

    addToken(container, text, type, globalFontSize) {
        if (!text) return 0;
        if (type !== 'white' && type !== 'cyan' && this.controls[type] && parseInt(this.controls[type].w.value) === 0) type = 'cyan';
        const span = document.createElement('span');
        span.textContent = text;
        span.className = `token-${type}`;
        container.appendChild(span);

        return text.length * (this.charWidths[type] || (globalFontSize * 0.6));
    }

    generateNoise(length) {
        if (length <= 0) return '';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>/? ';
        let noise = '';
        for (let i = 0; i < length; i++) noise += symbols[Math.floor(Math.random() * symbols.length)];
        return noise;
    }

    exportConfig() {
        const config = {};
        document.querySelectorAll('.pg-controls input').forEach(input => { config[input.id] = input.value; });
        config.infoText = this.controls.infoText.value;
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'beallitasok.json';
        link.href = url;
        link.click();
    }

    importConfig(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                this.applyConfig(config);
                this.updatePercentages(); this.updateStyles(); this.generate();
                this.saveToLocalStorage();
            } catch (err) { alert('Hiba!'); }
        };
        reader.readAsText(file);
    }

    saveAsImage() {
        const panel = this.controlsPanel;
        const bgColor = this.controls.bgColor.value;
        panel.style.display = 'none';

        window.htmlToImage.toPng(document.body, {
            backgroundColor: bgColor,
            pixelRatio: 2
        })
            .then(dataUrl => {
                const link = document.createElement('a');
                link.download = 'ismeretlen_kod_generator.png';
                link.href = dataUrl;
                link.click();
                panel.style.display = 'block';
            })
            .catch(error => {
                console.error('Hiba a mentés során:', error); // eslint-disable-line no-console
                panel.style.display = 'block';
            });
    }
}

document.addEventListener('DOMContentLoaded', () => { new PuzzleGenerator(); });
