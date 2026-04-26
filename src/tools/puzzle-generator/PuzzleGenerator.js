/**
 * 'Ismeretlen' Kód-generátor Logika - Színválasztókkal bővítve
 */

class PuzzleGenerator {
    constructor() {
        this.container = document.getElementById('code-content');
        this.controlsPanel = document.getElementById('controls-panel');
        
        this.controls = {
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
                o: document.getElementById('o-yellow') 
            },
            purple: { 
                c: document.getElementById('c-purple'),
                w: document.getElementById('p-purple'), 
                g: document.getElementById('g-purple'), 
                o: document.getElementById('o-purple') 
            },
            green: { 
                c: document.getElementById('c-green'),
                w: document.getElementById('p-green'), 
                g: document.getElementById('g-green'), 
                o: document.getElementById('o-green') 
            }
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
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                const config = JSON.parse(saved);
                this.applyConfig(config);
            } catch (e) {}
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
        const totalLines = parseInt(this.controls.density.value);
        const colCount = parseInt(this.controls.columns.value);
        const blocksPerCol = parseInt(this.controls.blocksPerColumn.value);
        
        const charWidth = parseInt(this.controls.fontSize.value) * 0.5;
        const totalWidth = window.innerWidth - (colCount - 1) * parseInt(this.controls.columnGap.value);
        const colWidthPx = totalWidth / colCount;
        const targetLength = Math.floor(colWidthPx / charWidth) - 2;

        const w = {
            cyan: parseInt(this.controls.cyan.w.value),
            dim: parseInt(this.controls.dim.w.value),
            yellow: parseInt(this.controls.yellow.w.value),
            purple: parseInt(this.controls.purple.w.value),
            green: parseInt(this.controls.green.w.value)
        };
        const totalW = w.cyan + w.dim + w.yellow + w.purple + w.green || 1;

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
                    const variance = Math.floor(Math.random() * 6);
                    blockDiv.appendChild(this.createLine(targetLength - variance, w, totalW, isHeader));
                }
                colDiv.appendChild(blockDiv);
                if (remainingLines <= 0) break;
            }
            this.container.appendChild(colDiv);
        }
    }

    createLine(targetLength, w, totalW, isHeader = false) {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'pg-line';
        
        if (isHeader) {
            let header = this.blockHeaders[Math.floor(Math.random() * this.blockHeaders.length)];
            
            // Szigorúbb ellenőrzés: ha eléri a targetLength-et, már vágunk
            if (header.length >= targetLength) {
                header = header.substring(0, Math.max(5, targetLength - 5)) + '...*/';
            }

            this.addToken(lineDiv, header, 'white');
            
            const remaining = targetLength - header.length;
            if (remaining > 0) {
                this.addToken(lineDiv, this.generateNoise(remaining), 'dim');
            }
            return lineDiv;
        }

        let currentLength = 0;
        const indentLevels = [0, 0, 2, 4, 8];
        const indent = indentLevels[Math.floor(Math.random() * indentLevels.length)];
        if (indent > 0) {
            this.addToken(lineDiv, ' '.repeat(indent), 'white');
            currentLength += indent;
        }
        
        const colorW = w.cyan + w.yellow + w.purple + w.green;
        while (currentLength < targetLength) {
            const rand = Math.random() * totalW;
            if (rand < colorW) {
                const snippet = this.baseSnippets[Math.floor(Math.random() * this.baseSnippets.length)];
                if (currentLength + snippet.length <= targetLength) {
                    currentLength += this.renderGranularSnippet(lineDiv, snippet, w, totalW);
                } else {
                    currentLength += this.addToken(lineDiv, this.generateNoise(targetLength - currentLength), 'dim');
                    break;
                }
            } else if (w.dim > 0) {
                const len = Math.min(3 + Math.floor(Math.random() * 8), targetLength - currentLength);
                currentLength += this.addToken(lineDiv, this.generateNoise(len), 'dim');
            } else {
                currentLength += this.addToken(lineDiv, this.generateNoise(Math.min(2, targetLength - currentLength)), 'cyan');
            }
            if (currentLength < targetLength && w.cyan > 0) {
                currentLength += this.addToken(lineDiv, this.generateNoise(1), 'cyan');
            }
        }
        return lineDiv;
    }

    renderGranularSnippet(container, text, w, totalW) {
        const tokens = text.split(/(\/\*.*?\*\/|\/\/.*|0x[0-9A-F]+|0b[01_]+|\s+|[{}()\[\]]|[:;,.=><!&|+\-*\/%^]+|\w+)/gi).filter(t => t);
        let len = 0;
        tokens.forEach(token => {
            let type = 'cyan';
            if (token.match(/\/\*|\/\/|::/)) type = 'purple';
            else if (token.match(/0x|0b|[{}()\[\]]|[:;,.=><!&|+\-*\/%^]+/)) type = 'yellow';
            else if (token.match(/if|for|while|function|return|struct|var|case|default|else/i)) type = 'green';
            const weight = w[type] || 0;
            const colorW = w.cyan + w.yellow + w.purple + w.green;
            const chance = weight / colorW;
            if (type !== 'cyan' && Math.random() > chance) type = 'cyan';
            len += this.addToken(container, token, type);
        });
        return len;
    }

    addToken(container, text, type) {
        if (!text) return 0;
        if (type !== 'white' && type !== 'cyan' && this.controls[type] && parseInt(this.controls[type].w.value) === 0) type = 'cyan';
        const span = document.createElement('span');
        span.textContent = text;
        span.className = `token-${type}`;
        container.appendChild(span);
        return text.length;
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

        htmlToImage.toPng(document.body, {
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
            console.error('Hiba a mentés során:', error);
            panel.style.display = 'block';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => { new PuzzleGenerator(); });
