/**
 * StorySlide - Képes történet/prezentáció dia megjelenítése
 * 
 * Ez a komponens statikus képeket (diákat) jelenít meg a tartalomterületen.
 * Elsősorban a Grade 3 "képregény/prezentáció" stílusú történetmeséléséhez.
 */
class StorySlide {
    constructor(slideData) {
        this.slideData = slideData;
        this.element = null;
    }

    /**
     * Létrehozza a DOM elemet
     */
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'dkv-story-slide';

        // Alapértelmezett pozicionálás (mindig teljes képernyő, háttérben)
        this.element.style.position = 'fixed';
        this.element.style.top = '0';
        this.element.style.left = '0';
        this.element.style.width = '100vw';
        this.element.style.height = '100vh';
        this.element.style.zIndex = '-1';

        // Placeholder alapállapot (Sötét háttér, szöveg középen)
        this.element.style.backgroundColor = '#1a1a1a';
        this.element.style.color = '#ffffff';
        this.element.style.display = 'flex';
        this.element.style.alignItems = 'center';
        this.element.style.justifyContent = 'center';
        this.element.style.fontFamily = 'Impact, sans-serif';
        this.element.style.fontSize = '3rem';
        this.element.style.textAlign = 'center';

        // Kezdeti tartalom (Betöltés alatt...)
        this.element.textContent = 'Betöltés...';

        // Kép betöltésének megkísérlése
        if (this.slideData.content && this.slideData.content.imageUrl) {
            const imgUrl = this.slideData.content.imageUrl;
            const img = new Image();
            img.src = imgUrl;

            img.onload = () => {
                // SIKER: Kép megjelenítése
                this.element.textContent = ''; // Szöveg törlése
                this.element.style.backgroundImage = `url('${imgUrl}')`;
                this.element.style.backgroundSize = 'cover';
                this.element.style.backgroundPosition = 'center';
                this.element.style.backgroundRepeat = 'no-repeat';
                this.element.style.backgroundColor = 'transparent'; // Háttérszín törlése
            };

            img.onerror = () => {
                // HIBA: Placeholder megjelenítése részletes infókkal
                const urlParts = imgUrl.split('/');
                const fileName = urlParts[urlParts.length - 1];

                // Cím kinyerése
                let titleText = 'DIA';
                if (this.slideData.content.title) titleText = this.slideData.content.title;
                else if (this.slideData.title) titleText = this.slideData.title;

                this.element.innerHTML = `
                    <div style="display:flex; flex-direction:column; align-items:center; padding: 20px; background: rgba(0,0,0,0.5); border-radius: 15px;">
                        <div style="font-size: 4rem; text-transform: uppercase; color: #00d2d3; margin-bottom: 20px;">${titleText}</div>
                        <div style="font-size: 1.5rem; color: #ffeb3b;">HELYŐRZŐ</div>
                        <div style="font-size: 1rem; color: #aaa; margin-top: 10px; font-family: monospace;">Hiányzó fájl: ${fileName}</div>
                    </div>
                `;
            };
        } else {
            // Ha nincs URL megadva
            this.element.textContent = this.slideData.title || 'DIA (Kép nélkül)';
        }

        return this.element;
    }

    /**
     * Takarítás
     */
    destroy() {
        if (this.element) {
            this.element.remove();
        }
        this.element = null;
    }
}

export default StorySlide;
