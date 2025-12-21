/**
 * TimeManager - Precíz időmérés a versenyhez
 * 
 * Kezeli:
 * - A verseny teljes bruttó idejét (Global Timer), ami ELŐRE számlál.
 * - Védelmet a manipuláció ellen (performance.now használata)
 */
class TimeManager {
    constructor(options = {}) {
        this.eventBus = options.eventBus || null;
        this.logger = options.logger || null;
        this.stateManager = options.stateManager || null;

        // Globális verseny időzítő (előre számlál)
        this.globalTimer = {
            startTime: null,
            elapsed: 0,
            isRunning: false,
            intervalId: null
        };

        // Állapot helyreállítása (Crash Recovery)
        this._restoreState();

        if (this.logger) {
            this.logger.info('TimeManager initialized - Global Forward Timer', {
                restoredElapsed: this.globalTimer.elapsed
            });
        }
    }

    /**
     * Állapot helyreállítása mentésből
     */
    _restoreState() {
        if (this.stateManager) {
            // Megnézzük, van-e mentett idő a progressben
            const progress = this.stateManager.getStateValue('progress') || {};
            const savedTime = progress.timeSpent || 0;

            if (savedTime > 0) {
                // ms-be konvertálás (ha a stateben sec-ben van) vagy direkt ms használat
                // A state-ben sec-ben tároljuk a specifikáció szerint, de itt ms kell
                this.globalTimer.elapsed = savedTime * 1000;
            }
        }
    }

    /**
     * Verseny indítása (előre számlálás)
     */
    startCompetition() {
        if (this.globalTimer.isRunning) return;

        // Ha folytatjuk a versenyt, a startTime-ot úgy állítjuk be, 
        // mintha a múltban indult volna (jelenlegi idő - eddig eltelt idő)
        this.globalTimer.startTime = performance.now() - this.globalTimer.elapsed;
        this.globalTimer.isRunning = true;

        this._startGlobalTicker();

        if (this.eventBus) {
            this.eventBus.emit('timer:competition-started', { timestamp: Date.now() });
        }

        if (this.logger) {
            this.logger.info('Competition timer started/resumed');
        }
    }

    /**
     * Verseny leállítása
     */
    stopCompetition() {
        if (!this.globalTimer.isRunning) return Math.floor(this.globalTimer.elapsed);

        this._stopGlobalTicker();

        // Végső állapot mentése
        this._saveState();

        this.globalTimer.isRunning = false;

        if (this.eventBus) {
            this.eventBus.emit('timer:competition-ended', {
                duration: Math.floor(this.globalTimer.elapsed)
            });
        }

        return Math.floor(this.globalTimer.elapsed);
    }

    /**
     * Visszaadja az eltelt időt (ms)
     */
    getElapsedTime() {
        if (!this.globalTimer.isRunning) {
            return Math.floor(this.globalTimer.elapsed);
        }
        const current = performance.now() - this.globalTimer.startTime;
        return Math.floor(current);
    }

    /**
     * Belső ticker a UI frissítéshez (Global)
     */
    _startGlobalTicker() {
        if (this.globalTimer.intervalId) clearInterval(this.globalTimer.intervalId);

        this.globalTimer.intervalId = setInterval(() => {
            const elapsed = this.getElapsedTime();

            // Idő mentése a StateManagerbe (másodpercenként)
            // Ez biztosítja a "Crash Recovery"-t
            this._updateStateTime(elapsed);

            if (this.eventBus) {
                this.eventBus.emit('timer:tick', { elapsed });
            }
        }, 1000);
    }

    /**
     * Idő mentése a központi állapotba
     */
    _updateStateTime(elapsedMs) {
        if (this.stateManager) {
            // Csak a progress.timeSpent mezőt frissítjük (másodpercben)
            const currentProgress = this.stateManager.getStateValue('progress') || {};
            const elapsedSec = Math.floor(elapsedMs / 1000);

            // Optimalizálás: Csak akkor hívjuk a state update-et, ha változott a másodperc
            if (currentProgress.timeSpent !== elapsedSec) {
                this.stateManager.updateState({
                    progress: {
                        ...currentProgress,
                        timeSpent: elapsedSec
                    }
                });
            }
        }
    }

    _saveState() {
        this._updateStateTime(this.getElapsedTime());
    }

    _stopGlobalTicker() {
        if (this.globalTimer.intervalId) {
            clearInterval(this.globalTimer.intervalId);
            this.globalTimer.intervalId = null;
        }
    }
}

export default TimeManager;
