/**
 * TaskSlide - Helyőrző a Játékfelület Prototípusához
 * 
 * Ez a komponens most "becsomagolja" az új GameInterface-t
 * és szimulálja a diák közötti navigációt.
 */
import GameInterface from './GameInterface.js';
import MockGameSlide from './MockGameSlide.js';

class TaskSlide {
    constructor(slideData, options = {}) {
        this.slideData = slideData;
        this.onComplete = options.onComplete || (() => { });
        this.apiService = options.apiService;

        this.gameInterface = null;
        this.currentMockIndex = 1;
        this.totalMockSlides = 28;
    }

    createElement() {
        // Inicializáljuk a keretrendszert
        this.gameInterface = new GameInterface({
            totalSlides: this.totalMockSlides,
            currentSlideIndex: this.currentMockIndex,
            onNext: () => this.handleNext(),
            onPrev: () => this.handlePrev(),
            onOpenJournal: () => this.toggleJournal(),
            onOpenNarrator: () => this.toggleNarrator(),
            onOpenSettings: () => this.openSettings()
        });

        const interfaceElement = this.gameInterface.createElement();

        // Első tartalom betöltése
        this.updateContent();

        // Modális ablakok konténere (egyszerűsített demo)
        this.modalContainer = document.createElement('div');
        this.modalContainer.className = 'dkv-modal-overlay';
        this.modalContainer.style.display = 'none'; // Kezdetben rejtett

        // Overlay bezárása kattintásra (ha nem a tartalomra kattint)
        this.modalContainer.onclick = (e) => {
            if (e.target === this.modalContainer) {
                this.modalContainer.style.display = 'none';

                // Reset styles
                this.modalContainer.style.justifyContent = '';
                this.modalContainer.style.alignItems = '';
                this.modalContainer.style.padding = '';
            }
        };

        interfaceElement.appendChild(this.modalContainer);

        return interfaceElement;
    }

    // Külön metódusok a különböző felületek kezelésére
    toggleJournal() {
        let journalPanel = document.querySelector('.dkv-journal-panel');

        // Ha nem létezik, létrehozzuk és a gameInterface-hez adjuk
        if (!journalPanel) {
            journalPanel = document.createElement('div');
            journalPanel.className = 'dkv-journal-panel';
            journalPanel.innerHTML = `
                <h2 style="color: #fff; border-bottom: 1px solid #444; padding-bottom: 10px;">📓 Küldetésnapló</h2>
                <textarea style="width: 100%; height: 300px; background: #222; color: #eee; border: 1px solid #555; padding: 10px; resize: none;" placeholder="Írd ide a jegyzeteidet..."></textarea>
                <button class="dkv-button" style="margin-top: 20px;">Bezárás</button>
            `;
            // Bezárás gomb
            journalPanel.querySelector('button').onclick = () => journalPanel.classList.remove('open');

            document.body.appendChild(journalPanel);

            // Bezárás ha mellé kattintunk
            document.addEventListener('mousedown', (e) => {
                if (journalPanel.classList.contains('open') &&
                    !journalPanel.contains(e.target) &&
                    !e.target.closest('button[title="Napló"]')) {
                    journalPanel.classList.remove('open');
                }
            });

            // Kényszerítjük a böngészőt, hogy számolja újra a stílusokat (Reflow)
            // Mielőtt rátennénk az 'open' osztályt.
            void journalPanel.offsetWidth;
        }

        // Toggle class
        journalPanel.classList.toggle('open');
    }

    toggleNarrator() {
        let narratorBox = document.querySelector('.dkv-narrator-box');

        if (!narratorBox) {
            narratorBox = document.createElement('div');
            narratorBox.className = 'dkv-narrator-box';
            // Placeholder tartalom
            narratorBox.innerHTML = `
                <h3 style="text-align: center; border-bottom: 2px solid #5d4037; padding-bottom: 10px; margin-bottom: 15px;">Történet</h3>
                <p><i>"A digitális szél süvített a szervertermek között, ahogy közeledtél a központi egységhez..."</i></p>
                <p>Ezen a lapon mindig visszaolvashatod az aktuális helyzethez tartozó leírást.</p>
                <div style="text-align: center; margin-top: 20px;">
                    <button class="dkv-button" style="font-size: 0.8rem; padding: 5px 15px; background: #8d6e63;">Lap bezárása</button>
                </div>
            `;

            narratorBox.querySelector('button').onclick = () => narratorBox.classList.remove('open');

            // Hozzáadjuk a game interface-hez
            this.gameInterface.element.appendChild(narratorBox);
        }

        narratorBox.classList.toggle('open');
    }

    openSettings() {
        // Ez marad modal, de áthelyezzük (CSS intézi a középre igazítást, de a gomb már fent van)
        // A kérés szerint "jobb felső sarokba" kerüljön a modal tartalom? 
        // A kérés pontosan: "legyen eltartással a globális időzítőtől".
        // Mivel a .dkv-modal-overlay center-t használ, ezt felülírjuk inline style-al ennél a hívásnál vagy módosítjuk a CSS-t.
        // Egyszerűbb, ha a modal content-et igazítjuk.

        this.modalContainer.style.display = 'flex';
        this.modalContainer.style.justifyContent = 'flex-end'; // Jobbra igazítás
        this.modalContainer.style.alignItems = 'flex-start'; // Fentre igazítás
        this.modalContainer.style.padding = '100px 50px'; // Eltartás a HUD-tól és a szélektől

        this.modalContainer.innerHTML = ''; // Reset

        const content = document.createElement('div');
        content.className = 'dkv-modal-content dkv-settings-content';
        content.style.width = '300px'; // Keskenyebb

        content.innerHTML = `
            <h2>⚙️ Beállítások</h2>
            
            <div class="dkv-setting-row">
                <label>Zene Hangerő</label>
                <input type="range" min="0" max="100" value="50">
            </div>
            
            <div class="dkv-setting-row">
                <label>Narrátor Hangerő</label>
                <input type="range" min="0" max="100" value="80">
            </div>

            <button class="dkv-button">Bezárás</button>
        `;

        content.querySelector('button').onclick = () => {
            this.modalContainer.style.display = 'none';
            // Visszaállítjuk az alap stílust, ha más modal használná
            this.modalContainer.style.justifyContent = '';
            this.modalContainer.style.alignItems = '';
            this.modalContainer.style.padding = '';
        };

        this.modalContainer.appendChild(content);
    }

    updateContent() {
        // Létrehozunk egy Mock diát az aktuális sorszámmal
        const mockSlide = new MockGameSlide(this.currentMockIndex);
        this.gameInterface.setContent(mockSlide.createElement());

        // Frissítjük az idővonalat
        this.gameInterface.updateTimeline(this.currentMockIndex);
    }

    handleNext() {
        if (this.currentMockIndex < this.totalMockSlides) {
            this.currentMockIndex++;
            this.updateContent();
        } else {
            alert('Vége a demónak!');
            this.onComplete();
        }
    }

    handlePrev() {
        if (this.currentMockIndex > 1) {
            this.currentMockIndex--;
            this.updateContent();
        }
    }

    destroy() {
        // Globális időzítő visszaállítása
        const globalTimer = document.getElementById('dkv-timer-display');
        if (globalTimer) globalTimer.style.display = '';

        if (this.gameInterface) {
            this.gameInterface.element.remove();
        }
    }
}

export default TaskSlide;
