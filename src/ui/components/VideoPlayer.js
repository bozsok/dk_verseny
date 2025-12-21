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
            if (!this.hasWatched && this.videoElement.currentTime > this.lastTime + 1) {
                // Visszadobjuk oda, ahol tartott
                this.videoElement.currentTime = this.lastTime;
            }
        });

        // Ha vége a videónak
        this.videoElement.addEventListener('ended', () => {
            this.hasWatched = true;
            this.onComplete();
            this.element.classList.add('dkv-video-completed');
        });
    }

    /**
     * Lejátszás indítása
     */
    play() {
        if (this.videoElement) {
            this.videoElement.play().catch(e => console.log('Autoplay prevented', e));
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
