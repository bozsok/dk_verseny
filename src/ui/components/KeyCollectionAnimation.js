/**
 * KeyCollectionAnimation - Kulcsgyűjtés vizuális animációja a 4. dián
 * 
 * FÁZIS A: Felvillantja a nagy kulcsot középen (glow effect + sparkle layerek), 
 * FÁZIS B: Kicsinyítve bemozgatja a DKV Game Sidebar-ba.
 */
class KeyCollectionAnimation {
    /**
     * @param {Object} options 
     * @param {string} options.stationId - A kulcs azonosítása (pl. 'station_1')
     * @param {HTMLElement} options.targetSlot - A HUD-ban cél slot, ahova repülnie kell
     */
    constructor(options = {}) {
        this.stationId = options.stationId;
        this.targetSlot = options.targetSlot;

        // Kulcs fájlnév prefix térkép
        this.keyMap = {
            'station_1': { drop: 'keyA_drop', large: 'keyA_large_part1' },
            'station_2': { drop: 'keyB_drop', large: 'keyB_large_part2' },
            'station_3': { drop: 'keyC_drop', large: 'keyC_large_part3' },
            'station_4': { drop: 'keyD_drop', large: 'keyD_large_part4' },
            'station_5': { drop: 'keyE_drop', large: 'keyE_large_part5' }
        };

        this.keyNames = this.keyMap[this.stationId] || { drop: 'keyA_drop', large: 'keyA_large_part1' }; // Fallback

        // DOM Elemek
        this.overlay = null;
        this.largeKey = null;
        this.dropKey = null;
        this.sparkle1 = null;
        this.sparkle2 = null;
        this.container = null;

        // Stílus konténer animációkhoz
        this.styleTag = document.getElementById('dkv-key-animation-styles');
        if (!this.styleTag) {
            this.styleTag = document.createElement('style');
            this.styleTag.id = 'dkv-key-animation-styles';
            this.styleTag.innerHTML = `
                @keyframes pulseSparkle {
                    0% { transform: translate(-50%, -50%) rotate(0deg) scale(0.8); opacity: 0.6; }
                    50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.1); opacity: 1; }
                    100% { transform: translate(-50%, -50%) rotate(360deg) scale(0.8); opacity: 0.6; }
                }
                @keyframes pulseSparkleReverse {
                    0% { transform: translate(-50%, -50%) rotate(360deg) scale(1); opacity: 0.8; }
                    50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.2); opacity: 0.4; }
                    100% { transform: translate(-50%, -50%) rotate(0deg) scale(1); opacity: 0.8; }
                }
                @keyframes floatKey {
                    0% { transform: translate(-50%, -50%) translateY(0px) scale(1); filter: drop-shadow(0 0 30px rgba(255, 235, 59, 0.9)); }
                    50% { transform: translate(-50%, -50%) translateY(-5px) scale(1.02); filter: drop-shadow(0 0 40px rgba(255, 235, 59, 1)); }
                    100% { transform: translate(-50%, -50%) translateY(0px) scale(1); filter: drop-shadow(0 0 30px rgba(255, 235, 59, 0.9)); }
                }
            `;
            document.head.appendChild(this.styleTag);
        }
    }

    /**
     * FÁZIS A: Megjelenítés és Ragyogás
     */
    playPhaseA() {
        if (this.container) return; // Már fut

        this.container = document.createElement('div');
        this.container.className = 'key-animation-container';
        Object.assign(this.container.style, {
            position: 'fixed', top: '0', left: '0',
            width: '100vw', height: '100vh',
            pointerEvents: 'none', // FONTOS: Átengedje a kattintásokat a Tovább gombra!
            zIndex: '9998',
            overflow: 'hidden' // Meggátolja a csillogás kilógását (scrollbar megelőzése)
        });

        // Overlay elsötétítéshez
        this.overlay = document.createElement('div');
        Object.assign(this.overlay.style, {
            position: 'absolute', top: '0', left: '0',
            width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            opacity: '0',
            transition: 'opacity 0.2s ease-out'
        });

        // Csillogás 1 (hátsó)
        this.sparkle1 = document.createElement('img');
        this.sparkle1.src = 'assets/images/grade3/sparkle/01.png';
        Object.assign(this.sparkle1.style, {
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '80vh', maxHeight: '80vh',
            zIndex: '9999', pointerEvents: 'none',
            opacity: '0', transition: 'opacity 1s ease-in',
            filter: 'hue-rotate(30deg) sepia(100%) saturate(300%) opacity(0.8)', // Aranysárgásítás
            animation: 'pulseSparkle 8s infinite linear'
        });

        // Csillogás 2 (elülső)
        this.sparkle2 = document.createElement('img');
        this.sparkle2.src = 'assets/images/grade3/sparkle/02.png';
        Object.assign(this.sparkle2.style, {
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '90vh', maxHeight: '90vh',
            zIndex: '9999', pointerEvents: 'none',
            opacity: '0', transition: 'opacity 1s ease-in',
            filter: 'hue-rotate(20deg) sepia(100%) saturate(400%) blur(2px)',
            animation: 'pulseSparkleReverse 10s infinite linear'
        });

        // Nagy Kulcs
        this.largeKey = document.createElement('img');
        this.largeKey.src = `assets/images/grade3/keys/${this.keyNames.large}.png`;
        Object.assign(this.largeKey.style, {
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%) scale(0.1)', // Kezdeti kicsinyítés
            maxHeight: '60vh', maxWidth: '60vw',
            objectFit: 'contain', zIndex: '10000',
            opacity: '0',
            filter: 'drop-shadow(0 0 30px rgba(255, 235, 59, 1))', // Fény azonnal, a pop-in alatt is!
            transition: 'all 0.8s ease-out' // Sima, overshoot nélküli pop-in
        });

        // DOM felépítés
        this.container.appendChild(this.overlay);
        this.container.appendChild(this.sparkle1);
        this.container.appendChild(this.sparkle2);
        this.container.appendChild(this.largeKey);
        document.body.appendChild(this.container);

        // Megjelenés indítása deferrel
        requestAnimationFrame(() => {
            this.overlay.style.opacity = '1';
            this.sparkle1.style.opacity = '1';
            this.sparkle2.style.opacity = '1';
            this.largeKey.style.opacity = '1';
            this.largeKey.style.transform = 'translate(-50%, -50%) scale(1)';

            // Azonnal hívjuk a callbacket, hogy a HUD frissüljön és a gomb engedélyezve legyen
            if (this.onComplete) {
                this.onComplete();
            }

            // Ha a pop-in befejeződött, töröljük a transition-t és indítjuk a float-ot
            // 900ms: kicsit tovább várunk a 0.8s transition lefutásánál, hogy ne ugorjon!
            setTimeout(() => {
                if (this.largeKey) {
                    this.largeKey.style.transition = 'none'; // Animáció előtt töröljük!
                    this.largeKey.style.animation = 'floatKey 5s infinite ease-in-out';
                }
            }, 900);

            // A sötétítő réteg halványuljon el 5 másodperc után, de a kulcs maradjon!
            setTimeout(() => {
                if (this.overlay) this.overlay.style.opacity = '0';
            }, 5000);
        });
    }

    /**
     * FÁZIS B: Berepülés a Slot-ba (a "Tovább" gomb gombnyomása után)
     * @returns {Promise}
     */
    playPhaseB() {
        return new Promise((resolve) => {
            if (!this.container || !this.largeKey) {
                // Ha nem fut A fázis, de meg lett hívva (pl egy elakadás matt)
                resolve();
                return;
            }

            // Állítsuk le a css animációkat
            this.largeKey.style.animation = 'none';
            this.sparkle1.style.transition = 'opacity 0.4s';
            this.sparkle2.style.transition = 'opacity 0.4s';
            this.sparkle1.style.opacity = '0';
            this.sparkle2.style.opacity = '0';

            this.largeKey.style.transition = 'opacity 0.3s ease-in, transform 0.3s ease-in';
            this.largeKey.style.opacity = '0';
            this.largeKey.style.transform = 'translate(-50%, -50%) scale(0.7)';

            if (!this.targetSlot) {
                this.overlay.style.opacity = '0';
                setTimeout(() => {
                    this._cleanup();
                    resolve();
                }, 500);
                return;
            }

            // B Fázis Kis (Drop) Kulcs
            this.dropKey = document.createElement('img');
            this.dropKey.src = `assets/images/grade3/keys/${this.keyNames.drop}.png`;

            const largeRect = this.largeKey.getBoundingClientRect();

            Object.assign(this.dropKey.style, {
                position: 'fixed',
                top: `${largeRect.top}px`,
                left: `${largeRect.left}px`,
                width: `${largeRect.width}px`,
                height: `${largeRect.height}px`,
                objectFit: 'contain',
                zIndex: '10000',
                transition: 'all 0.8s ease-in-out',
                filter: 'drop-shadow(0 0 20px rgba(255, 235, 59, 1))'
            });

            this.container.appendChild(this.dropKey);

            const slotRect = this.targetSlot.getBoundingClientRect();

            // Repülés elindítása
            requestAnimationFrame(() => {
                this.dropKey.style.top = `${slotRect.top}px`;
                this.dropKey.style.left = `${slotRect.left}px`;
                this.dropKey.style.width = `${slotRect.width}px`;
                this.dropKey.style.height = `${slotRect.height}px`;
                this.dropKey.style.filter = 'drop-shadow(0 0 0px rgba(255, 235, 59, 0))';

                this.overlay.style.opacity = '0';

                // Repülés vége
                setTimeout(() => {
                    this._cleanup();
                    resolve();
                }, 800);
            });
        });
    }

    /**
     * Bónusz: Lejátsza egyben a kettőt (visszafelé kompatibilitás vagy kényszer futtatás esetén)
     */
    play() {
        return new Promise((resolve) => {
            this.playPhaseA();
            setTimeout(() => {
                this.playPhaseB().then(resolve);
            }, 1500);
        });
    }

    _cleanup() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.overlay = null;
        this.largeKey = null;
        this.dropKey = null;
        this.sparkle1 = null;
        this.sparkle2 = null;
    }

    /**
     * Manuális eltávolítás megszakítás esetén (pl animáció közben elnavigál)
     */
    destroy() {
        this._cleanup();
    }
}

export default KeyCollectionAnimation;
