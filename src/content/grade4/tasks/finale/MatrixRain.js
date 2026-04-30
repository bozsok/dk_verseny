/* === MatrixRain.js === */

/**
 * @class MatrixRain
 * @description Mátrix-eső effektus kétfázisú indítással (statikus -> egyedi lehullás).
 * - Az oszlopok a rácsban indulnak a tökéletes illeszkedésért.
 */
export class MatrixRain {
    constructor(container, options = {}) {
        this.version = "0.43.0";
        this.container = container;
        this.onCharClick = options.onCharClick || (() => { });
        this.columnCount = 100; // Optimalizált sűrűség
        this.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>/? ÷";
        this.columns = [];
        this.neededChars = [];
        this.intervals = [];
        this.timeouts = [];

        this.init();
    }

    /**
     * Inicializálja a rácsot és a statikus fázist.
     */
    init() {
        this.container.innerHTML = '';
        
        for (let i = 0; i < this.columnCount; i++) {
            this.createColumn(i);
        }
    }

    /**
     * Létrehoz egy oszlopot a rácsban.
     */
    createColumn(index) {
        const col = document.createElement('div');
        col.className = 'dkv-finale-task__matrix-column';
        
        const opacity = Math.random() * 0.6 + 0.2;
        const fontSize = Math.floor(Math.random() * 7) + 18;
        
        col.style.opacity = opacity;
        col.style.fontSize = `${fontSize}px`;

        // Kezdeti feltöltés (statikus fázis)
        this.fillColumn(col, true);
        this.container.appendChild(col);
        this.columns.push(col);

        // Egyedi időzítő az eső indításához
        const triggerDelay = 500 + Math.random() * 3000;
        const t = setTimeout(() => {
            this.switchToFalling(col);
        }, triggerDelay);
        this.timeouts.push(t);
    }

    /**
     * Átváltja az oszlopot statikusból lehullóba.
     */
    switchToFalling(col) {
        // Hirtelen kikapcsolás
        col.innerHTML = '';
        
        // Rövid várakozás után (vagy azonnal) elindul fentről
        const t = setTimeout(() => {
            if (!col.parentNode) return;
            
            const duration = Math.random() * 15 + 20;
            col.style.animationDuration = `${duration}s`;
            col.classList.add('is-falling');
            
            this.fillColumn(col, false);

            // Folyamatos karakterfrissítés a hullás alatt
            const intervalId = setInterval(() => {
                if (Math.random() > 0.9) this.fillColumn(col);
            }, 3000 + Math.random() * 2000);
            this.intervals.push(intervalId);
        }, 50);
        this.timeouts.push(t);
    }

    setNeededChars(charList) {
        this.neededChars = [...charList];
    }

    /**
     * Feltölti az oszlopot karakterekkel.
     */
    fillColumn(col, isStatic = false) {
        const length = isStatic ? 80 : Math.floor(Math.random() * 20) + 35;
        let html = '';

        for (let i = 0; i < length; i++) {
            const isTarget = !isStatic && this.neededChars.length > 0 && Math.random() > 0.96;
            const char = isTarget 
                ? this.neededChars[Math.floor(Math.random() * this.neededChars.length)] 
                : this.chars.charAt(Math.floor(Math.random() * this.chars.length));

            if (isTarget) {
                html += `<span class="dkv-finale-task__matrix-char dkv-finale-task__matrix-char--target" data-char="${char}">${char}</span>`;
            } else {
                html += `<span class="dkv-finale-task__matrix-char">${char}</span>`;
            }
        }

        col.innerHTML = html;

        if (!isStatic) {
            col.querySelectorAll('.dkv-finale-task__matrix-char--target').forEach(span => {
                span.onclick = (e) => {
                    e.stopPropagation();
                    const char = span.getAttribute('data-char');
                    this.onCharClick(char);
                    span.classList.remove('dkv-finale-task__matrix-char--target');
                    span.style.opacity = '0';
                    span.style.pointerEvents = 'none';
                };
            });
        }
    }

    destroy() {
        this.intervals.forEach(id => clearInterval(id));
        this.timeouts.forEach(id => clearTimeout(id));
        this.intervals = [];
        this.timeouts = [];
        this.container.innerHTML = '';
        this.columns = [];
    }
}
