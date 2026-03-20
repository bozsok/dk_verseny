/**
 * VideoPlayer - Szigorú videó lejátszó
 * 
 * Funkciók:
 * - Videó lejátszása
 * - Tekerés (seeking) letiltása
 * - 'Ended' esemény kezelése
 */
class VideoPlayer {
    constructor(options = {}) {
        this.src = options.src;
        this.poster = options.poster || '';
        this.onComplete = options.onComplete || (() => { });
        this.isPreview = options.isPreview || false;
        this.logger = options.logger;
        this.element = null;
        this.videoElement = null;

        // Állapot követés
        this.hasWatched = false;
        this.lastTime = 0;
    }

    /**
     * DOM elem létrehozása
     */
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'dkv-video-container';

        // Videó element
        this.videoElement = document.createElement('video');
        this.videoElement.className = 'dkv-video-player';
        this.videoElement.src = this.src;
        this.videoElement.poster = this.poster;
        this.videoElement.controls = true; // Kell controls, de korlátozzuk

        // Security: letiltjuk a jobb klikket (context menu) a videón
        this.videoElement.addEventListener('contextmenu', e => e.preventDefault());

        this.element.appendChild(this.videoElement);

        this.setupListeners();

        return this.element;
    }

    /**
     * Eseménykezelők
     */
    setupListeners() {
        // Seeking prevention (Tekerés gátlás)
        this.videoElement.addEventListener('timeupdate', () => {
            if (!this.videoElement.seeking) {
                this.lastTime = this.videoElement.currentTime;
            }
        });

        this.videoElement.addEventListener('seeking', () => {
            // Ha előre próbál tekerni és még nem látta a videót
            if (!this.hasWatched && this.videoElement.currentTime > this.lastTime + 1.5) {
                if (this.logger) this.logger.info('[VideoPlayer] Seeking prevented', { 
                    from: this.lastTime, 
                    to: this.videoElement.currentTime 
                });
                // Visszadobjuk oda, ahol tartott
                this.videoElement.currentTime = this.lastTime;
            }
        });

        // Ha vége a videónak
        this.videoElement.addEventListener('ended', () => {
            if (this.logger) this.logger.info(`[VideoPlayer] Completed: ${this.src}`);
            this.hasWatched = true;
            this.onComplete();
            this.element.classList.add('dkv-video-completed');
        });

        // Hiba kezelés
        this.videoElement.addEventListener('error', (e) => {
            if (this.logger) this.logger.error('[VideoPlayer] Video error', { 
                src: this.src, 
                error: this.videoElement.error ? this.videoElement.error.message : 'Unknown error' 
            });
        });
    }

    /**
     * Lejátszás indítása
     */
    play() {
        if (this.videoElement) {
            if (this.logger) this.logger.info(`[VideoPlayer] play() call: ${this.src}`);
            
            // Csak akkor töltünk újra, ha nincs readyState vagy hiba van
            if (this.videoElement.readyState === 0) {
                this.videoElement.load();
            }

            const playPromise = this.videoElement.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    if (this.logger) this.logger.warn('[VideoPlayer] Playback failed/prevented', { 
                        error: e.name, 
                        msg: e.message 
                    });
                });
            }
        } else {
            if (this.logger) this.logger.error('[VideoPlayer] Cannot play: videoElement is null');
        }
    }

    /**
     * Lejátszó eltávolítása
     */
    destroy() {
        if (this.videoElement) {
            this.videoElement.pause();
            this.videoElement.removeAttribute('src');
            this.videoElement.load();
        }
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

export default VideoPlayer;
