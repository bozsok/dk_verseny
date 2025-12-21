/**
 * MockApiService - Szerver kommunikáció szimuláció
 * 
 * Ez a modul szimulálja a backend API-t.
 * A fejlesztés ezen szakaszában csak logolja az eseményeket és véletlenszerű késleltetést ad,
 * mintha valós hálózati kérés történne.
 */
class MockApiService {
    constructor(options = {}) {
        this.logger = options.logger || console;
        this.sessionToken = null;
        this.studentId = null;

        // Szimulált hálózati késleltetés (min-max ms)
        this.latency = { min: 200, max: 800 };

        // Szimulált hibaarány (0.0 = nincs hiba, 0.1 = 10% hiba)
        this.errorRate = 0.05;
    }

    /**
     * Verseny munkamenet indítása (Bejelentkezés szimuláció)
     */
    async initSession(studentId) {
        await this._simulateNetworkDelay();

        // Hiba szimuláció
        if (this._shouldFail()) {
            throw new Error('Network Error: Failed to initialize session');
        }

        this.studentId = studentId;
        this.sessionToken = `SESSION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        this.logger.info(`[API] Session initialized for student: ${studentId}`, { token: this.sessionToken });

        return {
            success: true,
            token: this.sessionToken,
            serverTime: new Date().toISOString()
        };
    }

    /**
     * Pontszám beküldése
     * Fontos: A szerver mindig a szerver oldali időt tekinti hivatalosnak
     */
    async submitScore(payload) {
        const { taskId, score, totalTimeSpent, integrityHash } = payload;

        await this._simulateNetworkDelay();

        if (!this.sessionToken) {
            throw new Error('Unauthorized: No active session');
        }

        if (this._shouldFail()) {
            this.logger.warn(`[API] Score submission failed (Simulated Error) for Task: ${taskId}`);
            throw new Error('Network Error: Score submission timed out');
        }

        this.logger.info(`[API] Score SUCCESS submitted -> Task: ${taskId}, Score: ${score}, Time: ${totalTimeSpent}ms`);

        return {
            success: true,
            receivedAt: new Date().toISOString(),
            newTotalScore: score // Itt a szerver adná vissza az összesített pontot
        };
    }

    /**
     * Verseny befejezése (Final submit)
     */
    async finishCompetition(finalData) {
        await this._simulateNetworkDelay();

        this.logger.info(`[API] Competition FINISHED. Final Data received. Student: ${this.studentId}`);

        return {
            success: true,
            rank: Math.floor(Math.random() * 10) + 1, // Szimulált helyezés
            certificateUrl: '/certificates/dummy.pdf'
        };
    }

    // --- Privát segédfüggvények ---

    /**
     * Hálózati késleltetés szimulálása Promise-szal
     */
    _simulateNetworkDelay() {
        const delay = Math.floor(Math.random() * (this.latency.max - this.latency.min + 1)) + this.latency.min;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    /**
     * Véletlenszerű hálózati hiba generálása
     */
    _shouldFail() {
        return Math.random() < this.errorRate;
    }
}

export default MockApiService;
