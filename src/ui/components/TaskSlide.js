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
        this.stateManager = options.stateManager; // State elmentése

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
            onOpenSettings: () => this.openSettings(),
            stateManager: this.stateManager // Opcionálisan átadjuk lefelé is
        });

        const interfaceElement = this.gameInterface.createElement();

        // HUD frissítése a State-ből (Avatar, Név, Pontszám)
        if (this.stateManager) {
            this.gameInterface.updateHUD(this.stateManager.getState());
        }

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
        let journalPanel = this.gameInterface.element.querySelector('.dkv-journal-panel');

        // Ha nem létezik, létrehozzuk és a gameInterface-hez adjuk
        if (!journalPanel) {
            journalPanel = document.createElement('div');
            journalPanel.className = 'dkv-journal-panel';
            journalPanel.innerHTML = `
                <div class="dkv-panel-header">
                    <h2>Küldetésnapló</h2>
                </div>
                <div class="dkv-panel-body">
                    <textarea placeholder="Írd ide a jegyzeteidet..."></textarea>
                </div>
                <div class="dkv-panel-footer">
                    <button class="dkv-button">Bezárás</button>
                </div>
            `;
            // Bezárás gomb
            journalPanel.querySelector('button').onclick = () => journalPanel.classList.remove('open');

            this.gameInterface.element.appendChild(journalPanel);

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
        // 1. Megpróbáljuk megkeresni a MEGLÉVŐ dobozt a container-ben
        let narratorBox = this.gameInterface.element.querySelector('.dkv-narrator-box');

        // Biztonsági ellenőrzés: Ha véletlenül a body-ban maradt volna egy árva példány (korábbi hibából), töröljük
        const orphanBox = document.body.querySelector(':scope > .dkv-narrator-box');
        if (orphanBox) orphanBox.remove();

        if (!narratorBox) {
            // LÉTREHOZÁS
            narratorBox = document.createElement('div');
            narratorBox.className = 'dkv-narrator-box';

            // Tartalom (X ikonnal, footer gomb nélkül)
            narratorBox.innerHTML = `
                <div class="dkv-panel-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h2>Történet</h2>
                    <div class="dkv-close-icon" style="cursor: pointer; font-size: 24px; line-height: 1;">✕</div>
                </div>
                <div class="dkv-panel-body">
                    <p><i>"A digitális szél süvített a szervertermek között, ahogy közeledtél a központi egységhez..."</i></p>
                    <p>Ezen a lapon mindig visszaolvashatod az aktuális helyzethez tartozó leírást.</p>
                </div>
            `;

            // GameInterface-hez adjuk (Fontos a Scope miatt!)
            this.gameInterface.element.appendChild(narratorBox);

            // X ikon Eseménykezelő (Csak létrehozáskor kell bekötni, mert az innerHTML nem változik később)
            const closeIcon = narratorBox.querySelector('.dkv-close-icon');
            if (closeIcon) {
                // Fontos: Arrow function, hogy a "narratorBox" variable-t zárja magába (closure)
                closeIcon.onclick = (e) => {
                    e.stopPropagation(); // Ne buborékoljon fel (bár itt mindegy)
                    narratorBox.classList.remove('open');
                };
            }
        }

        // TOGGLE MŰKÖDÉS (Megnyitás/Bezárás)
        // Kicsit trükkös: Ha épp most hoztuk létre, akkor nincs 'open' class-a, tehát a toggle hozzáadja -> Megnyílik. Helyes.
        // Ha már ott volt és nyitva van -> Bezáródik. Helyes.
        // Ha már ott volt és csukva van -> Megnyílik. Helyes.

        // Kényszerítsünk egy reflow-t a biztonság kedvéért animáció előtt
        void narratorBox.offsetWidth;

        narratorBox.classList.toggle('open');
    }

    openSettings() {
        let settingsPanel = this.gameInterface.element.querySelector('.dkv-settings-panel');

        if (!settingsPanel) {
            settingsPanel = document.createElement('div');
            settingsPanel.className = 'dkv-settings-panel'; // Új osztály

            // Fix pozíció jobb felül (inline style VAGY CSS class, de itt most megadjuk a struktúrát)
            // A CSS fogja a helyére tenni (.dkv-settings-panel { position: fixed; top: ... right: ... })

            settingsPanel.innerHTML = `
                <div class="dkv-panel-header">
                    <h2>Beállítások</h2>
                </div>
                <div class="dkv-panel-body" style="padding-bottom: 30px;">
                    <div class="dkv-setting-row" style="margin-bottom: 20px;">
                        <label style="display:block; margin-bottom:5px;">Zene hangerő</label>
                        <input type="range" min="0" max="100" value="50" style="width:100%;">
                    </div>
                    
                    <div class="dkv-setting-row">
                        <label style="display:block; margin-bottom:5px;">Narrátor hangerő</label>
                        <input type="range" min="0" max="100" value="80" style="width:100%;">
                    </div>
                </div>
            `;

            // Body-hoz adjuk, hogy a HUD felett lehessen (vagy gameInterface-be)
            this.gameInterface.element.appendChild(settingsPanel);

            // Click-outside
            document.addEventListener('mousedown', (e) => {
                if (settingsPanel.classList.contains('open') &&
                    !settingsPanel.contains(e.target) &&
                    !e.target.closest('button[title="Beállítások"]')) {
                    settingsPanel.classList.remove('open');
                }
            });

            void settingsPanel.offsetWidth;
        }

        settingsPanel.classList.toggle('open');
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
