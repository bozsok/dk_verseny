/**
 * AssetLoader - Univerzális eszköz az erőforrások (képek, audió) előtöltéséhez és dekódolásához.
 * Segít elkerülni a "gray flash" (szürke villanás) jelenséget és a sávos betöltődést.
 */
export class AssetLoader {
    /**
     * Képek előtöltése és memóriába történő dekódolása.
     * @param {string[]} sources - A betöltendő képek elérési útjainak listája.
     * @returns {Promise<HTMLImageElement[]>} - A betöltött kép-objektumok listája.
     */
    static async preloadImages(sources) {
        if (!Array.isArray(sources) || sources.length === 0) return [];

        const promises = sources.map(src => {
            return new Promise((resolve) => {
                const img = new Image();
                
                img.onload = () => {
                    // Ha a böngésző támogatja az img.decode() metódust, 
                    // akkor a memóriában is kicsomagoljuk a képet a megjelenítés előtt.
                    if (typeof img.decode === 'function') {
                        img.decode()
                            .then(() => resolve(img))
                            .catch(() => resolve(img)); // Hiba esetén is resolve, hogy ne álljon meg a betöltés
                    } else {
                        resolve(img);
                    }
                };

                img.onerror = () => {
                    console.warn(`[AssetLoader] Failed to load image: ${src}`); // eslint-disable-line no-console
                    resolve(null); // Nem fagyasztjuk le a folyamatot hiba miatt
                };

                img.src = src;
            });
        });

        return Promise.all(promises);
    }
}

export default AssetLoader;
