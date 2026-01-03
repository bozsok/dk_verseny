/**
 * TimerDisplay - Versenyidő kijelző komponens
 * 
 * Megjeleníti az eltelt versenyidőt a jobb felső sarokban.
 * Formátum: MM:SS
 */
class TimerDisplay {
    constructor(options = {}) {
        this.element = null;
        this.timeManager = options.timeManager;
        this.eventBus = options.eventBus;
        this.parentElement = options.parentElement || document.body;

        // Alapértelmezett állapot
        this.isVisible = false;

        this.init();
    }

    init() {
        this.createElement();
        this.setupListeners();
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'dkv-timer-display';
        this.element.id = 'dkv-timer-display';

        // Ikon + Idő
        this.element.innerHTML = `
      <svg class="dkv-timer-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span class="dkv-timer-value">00:00</span>
    `;

        this.parentElement.appendChild(this.element);
    }

    setupListeners() {
        if (this.eventBus) {
            // Frissítés minden másodpercben
            this.eventBus.on('timer:tick', (data) => {
                this.updateDisplay(data.elapsed);
            });

            // Verseny indulásakor megjelenítés
            this.eventBus.on('timer:competition-started', () => {
                this.show();
            });

            // Verseny végén (opcionális kiemelés)
            this.eventBus.on('timer:competition-ended', () => {
                this.element.classList.add('dkv-timer-finished');
            });
        }
    }

    updateDisplay(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const formattedTime = `${this.pad(minutes)}:${this.pad(seconds)}`;

        const valueSpan = this.element.querySelector('.dkv-timer-value');
        if (valueSpan) {
            valueSpan.textContent = formattedTime;
        }
    }

    pad(num) {
        return num.toString().padStart(2, '0');
    }

    show() {
        this.element.style.display = 'flex';
        this.isVisible = true;
    }

    hide() {
        this.element.style.display = 'none';
        this.isVisible = false;
    }
}

export default TimerDisplay;
