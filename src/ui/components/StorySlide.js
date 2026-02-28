/**
 * StorySlide - Képes és Videós történet/prezentáció dia megjelenítése
 * 
 * Ez a komponens statikus képeket VAGY képről-videóra váltó (seamless transition)
 * tartalmakat jelenít meg. Támogatja a 'Poster Image' -> 'Video' átmenetet.
 */
class StorySlide {
    constructor(slideData, options = {}) {
        this.slideData = slideData;
        this.options = options;
        this.element = null;
        this.videoElement = null;
        this.imageLayer = null;
    }

    /**
     * Létrehozza a DOM elemet
     */
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'dkv-story-slide';

        // Alapértelmezett pozicionálás (mindig teljes képernyő, háttérben)
        Object.assign(this.element.style, {
            position: 'fixed', top: '0', left: '0',
            width: '100vw', height: '100vh', zIndex: '-1',
            backgroundColor: '#1a1a1a', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Impact, sans-serif', color: '#ffffff', fontSize: '3rem'
        });

        const content = this.slideData.content || {};
        const imgUrl = content.imageUrl;
        const videoUrl = content.videoUrl;

        // Video config from content (configurable via Debug Panel)
        const videoDelay = content.videoDelay ?? 1000; // Default: 1s (backwards compatible)
        const videoLoop = content.videoLoop ?? true;   // Default: true (backwards compatible)

        // 1. VIDEÓ RÉTEG (Alul) - Csak akkor, ha nincs előnézeti (portal) módban!
        if (videoUrl && !this.options.isPreview) {
            const video = document.createElement('video');
            video.src = videoUrl;
            video.muted = true; // Ambient háttérvideó
            video.loop = videoLoop;
            video.playsInline = true;
            video.preload = 'auto';

            // Ha nem loop, akkor az utolsó képkockánál megállunk
            if (!videoLoop) {
                video.addEventListener('ended', () => {
                    // Pause at last frame (no seeking needed, video stays at end)
                    video.pause();
                });
            }

            Object.assign(video.style, {
                position: 'absolute', top: '0', left: '0',
                width: '100%', height: '100%', objectFit: 'cover',
                zIndex: '1'
            });

            this.videoElement = video;
            this.element.appendChild(video);
        }

        // 2. KÉP RÉTEG (Felül - Poster / Fallback)
        if (imgUrl) {
            const imgLayer = document.createElement('div');
            Object.assign(imgLayer.style, {
                position: 'absolute', top: '0', left: '0',
                width: '100%', height: '100%',
                backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                zIndex: '2', // Videó felett
                transition: 'opacity 0.1s ease-out', // Gyors átmenet - szellemkép elkerülése
                backgroundColor: 'transparent'
            });

            this.imageLayer = imgLayer;
            this.element.appendChild(imgLayer);

            // Kép betöltése és hibakezelés (Placeholder)
            const img = new Image();
            img.src = imgUrl;

            img.onload = () => {
                imgLayer.style.backgroundImage = `url('${imgUrl}')`;
                // Ha nincs videó, a háttérszínt átlátszóra váltjuk (ha esetleg fedné)
            };

            img.onerror = () => {
                this._renderPlaceholder(imgUrl);
            };
        } else if (!videoUrl) {
            // Ha SE kép, SE videó
            this.element.textContent = this.slideData.title || 'DIA (Üres)';
        }

        // 3. LOGIKA (Seamless Transition with canplaythrough)
        if (videoUrl && imgUrl) {
            // Késleltetett indítás - megvárjuk a canplaythrough-t is!
            this.transitionTimer = setTimeout(() => {
                if (this.videoElement) {
                    // Megvárjuk, hogy a videó tényleg lejátszásra kész legyen
                    const startPlayback = () => {
                        this.videoElement.play().then(() => {
                            // SIKER: Ha elindult és már renderel, eltűntetjük a fedő képet
                            if (this.imageLayer) {
                                this.imageLayer.style.opacity = '0'; // Kép eltűnik (CSS transition: 1.5s)
                            }
                        }).catch(e => {
                            console.warn('Video autoplay blocked or failed', e);
                            // Hiba esetén marad a kép (fallback)
                        });
                    };

                    // Ha már betöltődött (canplaythrough), azonnal indítunk
                    if (this.videoElement.readyState >= 4) {
                        startPlayback();
                    } else {
                        // Különben megvárjuk
                        this.videoElement.addEventListener('canplaythrough', startPlayback, { once: true });
                    }
                }
            }, videoDelay); // Configurable delay (default: 1000ms)
        } else if (videoUrl && !imgUrl) {
            // Csak videó: Delay utáni indítás
            this.transitionTimer = setTimeout(() => {
                if (this.videoElement) {
                    if (this.videoElement.readyState >= 4) {
                        this.videoElement.play().catch(console.warn);
                    } else {
                        this.videoElement.addEventListener('canplaythrough', () => {
                            this.videoElement.play().catch(console.warn);
                        }, { once: true });
                    }
                }
            }, videoDelay);
        }

        return this.element;
    }

    _renderPlaceholder(missingUrl) {
        const urlParts = missingUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        let titleText = 'DIA';
        if (this.slideData.content && this.slideData.content.title) titleText = this.slideData.content.title;
        else if (this.slideData.title) titleText = this.slideData.title;

        // A placeholder a content div-be kerül (ami a video/image layer felett lehetne, de most az elementbe írjuk)
        // Mivel a layerek absolute-ok, ez a szöveg mögöttük lenne, ezért z-index figyelés kell.
        // Inkább egy külön divet hozunk létre z-index 3-mal.

        const placeholder = document.createElement('div');
        Object.assign(placeholder.style, {
            position: 'absolute', zIndex: '10',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '20px', background: 'rgba(0,0,0,0.8)', borderRadius: '15px'
        });

        placeholder.innerHTML = `
            <div style="font-size: 4rem; text-transform: uppercase; color: #00d2d3; margin-bottom: 20px;">${titleText}</div>
            <div style="font-size: 1.5rem; color: #ffeb3b;">HELYŐRZŐ</div>
            <div style="font-size: 1rem; color: #aaa; margin-top: 10px; font-family: monospace;">Hiányzó fájl: ${fileName}</div>
        `;

        this.element.appendChild(placeholder);
    }

    /**
     * Takarítás
     */
    destroy() {
        if (this.transitionTimer) {
            clearTimeout(this.transitionTimer);
            this.transitionTimer = null;
        }
        if (this.videoElement) {
            this.videoElement.pause();
            this.videoElement.src = ""; // Load unload
            this.videoElement.load();
            this.videoElement = null;
        }
        if (this.element) {
            this.element.remove();
        }
        this.element = null;
        this.imageLayer = null;
    }
}

export default StorySlide;
