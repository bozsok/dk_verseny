/**
 * TutorialManager - Interaktív kezelőfelület bemutató rendszer
 *
 * Kiemelési módszer: az elem KLÓNJÁT helyezzük a document.body-ba
 * position:fixed stílussal, pontosan az eredeti elem pozíciójára.
 * Az eredeti elem az overlay alatt marad, a klón fölötte jelenik meg
 * z-index:2601-gyel (overlay: 2600, tooltip: 2602).
 * A klón pointer-events:none, tehát csak vizuálisan jelenik meg.
 *
 * Adaptálva a SELL architektúrához, project-context.md szabályai szerint.
 */
class TutorialManager {
    /**
     * @param {Object} app - Az alkalmazás fő példánya
     */
    constructor(app) {
        this.app = app;
        this.isActive = false;
        this.currentStepIndex = 0;
        this.isLoading = false;

        // DOM elemek
        this.overlay = null;
        this.tooltip = null;
        this.currentClone = null; // Aktuálisan megjelenített elem-klón
        this.currentAudio = null;
        this.activeStepTimeout = null; // Aktív lépésváltási időzítő
        this.activeAudioPromise = null; // Aktív audió lejátszási Promise

        // Tutorial lépések konfigurációja (sorrend: karakterkép, becenév, pont, idővonal,
        // hanglejátszó, eltelt idő, küldetésnapló, narráció, inventory, jobbra nyíl)
        this.steps = [
            {
                element: '.dkv-avatar-circle',
                text: 'Itt láthatod a kiválasztott karaktered képét.',
                position: 'bottom',
                audio: 'assets/audio/tutorial/tut_01.mp3'
            },
            {
                element: '.dkv-username',
                text: 'Itt pedig a megadott beceneved láthatod.',
                position: 'bottom',
                audio: 'assets/audio/tutorial/tut_02.mp3'
            },
            {
                element: '.dkv-points',
                text: 'Itt láthatod a játék során szerzett pontjaidat. Gyűjts minél többet!',
                position: 'bottom',
                audio: 'assets/audio/tutorial/tut_03.mp3'
            },
            {
                element: '.dkv-hud-timeline',
                text: 'Ez az idővonal mutatja a haladásodat.',
                position: 'bottom',
                audio: 'assets/audio/tutorial/tut_04.mp3'
            },
            {
                element: '.dkv-btn-settings',
                text: 'Ezekkel a gombokkal vezérelheted a küldetés leírásának hanglejátszását és a hangeffekteket.',
                position: 'bottom-right',
                audio: 'assets/audio/tutorial/tut_05.mp3'
            },
            {
                element: '.dkv-timer-display',
                text: 'Ez pedig az eltelt időt mutatja. Figyelj rá, mert számít a végén!',
                position: 'bottom-right',
                audio: 'assets/audio/tutorial/tut_06.mp3'
            },
            {
                element: '.dkv-btn-journal',
                text: 'Erre a fülre kattintva éred el a Küldetésnaplót, ahová minden fontos feljegyzést begépelhetsz. Használd bátran a játék során!',
                position: 'top-left',
                audio: 'assets/audio/tutorial/tut_07.mp3'
            },
            {
                element: '.dkv-btn-narrator',
                text: 'Itt olvashatod az aktuális küldetés leírását.',
                position: 'top-left',
                audio: 'assets/audio/tutorial/tut_08.mp3'
            },
            {
                element: '.dkv-game-sidebar',
                text: 'Itt gyűlnek majd össze a megszerzett varázskulcsaid.',
                position: 'left',
                audio: 'assets/audio/tutorial/tut_09.mp3'
            },
            {
                element: '.dkv-btn-next',
                text: 'Használd mindig ezt a gombot a játék során. Ez biztosítja a továbbhaladásodat. Kalandra fel!',
                position: 'top-right',
                audio: 'assets/audio/tutorial/tut_10.mp3'
            }
        ];
    }

    /**
     * Tutorial DOM elemeinek létrehozása és a document.body-ba fűzése.
     */
    init() {
        if (this.overlay) return;

        this.overlay = document.createElement('div');
        this.overlay.className = 'dkv-tutorial-overlay';

        this.tooltip = document.createElement('div');
        this.tooltip.className = 'dkv-tutorial__tooltip';

        document.body.appendChild(this.overlay);
        document.body.appendChild(this.tooltip);

        this.overlay.onclick = (e) => e.stopPropagation();
    }

    /**
     * Tutorial indítása
     */
    start() {
        if (this.isActive) return;

        this.isActive = true;
        this.currentStepIndex = 0;
        this.init();

        this.overlay.classList.add('dkv-is-visible');
        this.showStep(0);

        if (this.app.logger) {
            this.app.logger.info('Tutorial elindítva');
        }
    }

    /**
     * Adott lépés megjelenítése – a tooltip kibukkanása és eltűnése animálva.
     * @param {number} index - A lépés sorszáma
     */
    showStep(index) {
        if (index < 0 || index >= this.steps.length) return;

        // Korábbi időzítő törlése ha maradt (gyors kattintás védelem)
        if (this.activeStepTimeout) {
            clearTimeout(this.activeStepTimeout);
            this.activeStepTimeout = null;
        }

        // Ha a tooltip már látható, előbb fade-out, majd az új tartalom fade-in
        const isFirstStep = !this.tooltip.classList.contains('dkv-is-visible');
        const transitionDelay = isFirstStep ? 0 : 280;

        // Tooltip fade-out indítása
        this.tooltip.classList.remove('dkv-is-visible');

        this.activeStepTimeout = setTimeout(() => {
            this.activeStepTimeout = null;

            // Előző klón animált eltávolítása
            this.removeClone();

            this.currentStepIndex = index;
            const step = this.steps[index];

            const el = document.querySelector(step.element);
            if (!el) {
                if (this.app.logger) {
                    this.app.logger.warn(`Tutorial elem nem található: ${step.element}`);
                }
                this.showStep(index + 1);
                return;
            }

            // Klón létrehozása – fade-in animációval jelenik meg
            this.createClone(el, step);

            // Tooltip tartalom és pozíció frissítése, majd fade-in
            this.updateTooltip(step, el);

            // Audio lejátszása
            this.playAudio(step.audio);
        }, transitionDelay);
    }

    /**
     * Az elem klónjának létrehozása és elhelyezése a document.body-ban,
     * pontosan az eredeti elem képernyőpozícióján, az overlay felett.
     * @param {HTMLElement} el - A kiemelendő elem
     * @param {Object} step - Az aktuális lépés konfig (türkiz border miatt)
     */
    createClone(el) {
        const rect = el.getBoundingClientRect();

        // Mélységi klón – minden gyermekelem is klónozódik
        const clone = el.cloneNode(true);

        // Rögzítés az eredeti pixelpozícióra és méretére.
        // FONTOS: transform, right, bottom nullázása – a klón örökli ezeket
        // az eredeti CSS osztályból (pl. sidebar: translateY(-50%), timer: right:1.5rem),
        // de a getBoundingClientRect() már a transform utáni vizuális pozíciót adja,
        // így ha a transform újra alkalmazódik, dupla eltolás keletkezik.
        Object.assign(clone.style, {
            position: 'fixed',
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            margin: '0',
            zIndex: '2601',
            pointerEvents: 'none',
            boxSizing: 'border-box',
            // Konfliktusos örökölt CSS tulajdonságok nullázása
            transform: 'none',
            transition: 'none', // Ne animáljon az eredeti helyére ha volt transition
            right: 'auto',
            bottom: 'auto',
            display: window.getComputedStyle(el).display
        });

        // Türkiz border szín kényszerítése – a timer és az inventory slotok
        // esetén az eredeti ID-alapú CSS gradiens kiesik a klónon, ezért
        // explicit borderColor beállítás szükséges.
        clone.style.borderColor = 'var(--th-accent-color, #00eaff)';

        // Az inventory slot-ok belső border színe is legyen türkiz
        clone.querySelectorAll('.dkv-inventory-slot').forEach(slot => {
            slot.style.borderColor = 'var(--th-accent-color, #00eaff)';
        });

        // Egyedi ID ütközés elkerülése
        clone.removeAttribute('id');
        clone.querySelectorAll('[id]').forEach(child => child.removeAttribute('id'));

        // Animált megjelenés: opacity:0-ról indítva CSS animáció veszi át
        clone.classList.add('dkv-tutorial-clone');

        document.body.appendChild(clone);
        this.currentClone = clone;
    }

    /**
     * Aktuális klón animált eltávolítása a DOM-ból
     */
    removeClone() {
        if (!this.currentClone) return;
        const el = this.currentClone;
        this.currentClone = null;
        el.classList.add('dkv-tutorial-clone--out');
        el.addEventListener('animationend', () => el.remove(), { once: true });
        // Fallback ha az animáció nem fut le (pl. reduzált mozgás)
        setTimeout(() => { if (el.parentNode) el.remove(); }, 400);
    }

    /**
     * Tooltip tartalom frissítése és megjelenítése az elem mellé pozícionálva.
     * @param {Object} step
     * @param {HTMLElement} targetEl - Az eredeti elem (pozíciószámításhoz)
     */
    updateTooltip(step, targetEl) {
        const isFirst = this.currentStepIndex === 0;
        const isLast = this.currentStepIndex === this.steps.length - 1;

        this.tooltip.innerHTML = `
            <div class="dkv-tutorial__text">${step.text}</div>
            <div class="dkv-tutorial__actions">
                <button class="dkv-tutorial__btn dkv-tutorial__btn--skip">${isLast ? 'Bezárás' : 'Kihagyás'}</button>
                <div style="display:flex;gap:10px;">
                    <button class="dkv-tutorial__btn dkv-tutorial__btn--prev" ${isFirst ? 'disabled' : ''}>Vissza</button>
                    <button class="dkv-tutorial__btn ${isLast ? 'dkv-tutorial__btn--finish' : 'dkv-tutorial__btn--next'}">
                        ${isLast ? 'Kezdjük!' : 'Tovább'}
                    </button>
                </div>
            </div>
        `;

        this.tooltip.querySelector('.dkv-tutorial__btn--skip').onclick = () => this.end();
        this.tooltip.querySelector('.dkv-tutorial__btn--prev').onclick = () => this.showStep(this.currentStepIndex - 1);

        const nextBtn = this.tooltip.querySelector('.dkv-tutorial__btn--next, .dkv-tutorial__btn--finish');
        if (nextBtn) {
            nextBtn.onclick = () => isLast ? this.end() : this.showStep(this.currentStepIndex + 1);
        }

        // Pozíció beállítása ELŐBB (tooltip még rejtett, de visibility:hidden esetén
        // offsetWidth/offsetHeight már mérhető) – így nem villan fel az előző koordinátán
        this.positionTooltip(targetEl, step.position);

        // Pozícionálás után tesszük láthatóvá → fade-in az új helyen indul
        this.tooltip.classList.add('dkv-is-visible');
    }

    /**
     * Tooltip pozícionálása az elemhez képest (az eredeti elem rect-je alapján)
     * @param {HTMLElement} targetEl
     * @param {string} position
     */
    positionTooltip(targetEl, position) {
        const r = targetEl.getBoundingClientRect();
        const tw = this.tooltip.offsetWidth || 450;
        const th = this.tooltip.offsetHeight || 150;
        const m = 20;

        let top, left;

        switch (position) {
            case 'bottom': top = r.bottom + m; left = r.left + r.width / 2 - tw / 2; break;
            case 'top': top = r.top - th - m; left = r.left + r.width / 2 - tw / 2; break;
            case 'left': top = r.top + r.height / 2 - th / 2; left = r.left - tw - m; break;
            case 'right': top = r.top + r.height / 2 - th / 2; left = r.right + m; break;
            case 'bottom-right': top = r.bottom + m; left = r.right - tw; break;
            case 'top-left': top = r.top - th - m; left = r.left; break;
            case 'top-right': top = r.top - th - m; left = r.right - tw; break;
            default: top = r.bottom + m; left = r.left;
        }

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        left = Math.max(12, Math.min(left, vw - tw - 12));
        top = Math.max(12, Math.min(top, vh - th - 12));

        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
    }

    /**
     * Audio lejátszása – projekt boilerplate szerint (project-context.md Rule 39)
     * @param {string} src
     */
    async playAudio(src) {
        if (!src) return;

        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }

        try {
            this.isLoading = true;
            this.currentAudio = new Audio(src);
            this.currentAudio.volume = this.app.narrationVolume || 1.0;
            
            // Promise mentése a tisztításhoz
            this.activeAudioPromise = this.currentAudio.play();
            await this.activeAudioPromise;
            this.activeAudioPromise = null;
        } catch (e) {
            if (this.app.logger) {
                this.app.logger.warn(`Tutorial audio lejátszás sikertelen: ${src}`);
            }
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Tutorial befejezése – cleanup
     */
    end() {
        this.isActive = false;

        this.removeClone();

        if (this.overlay) this.overlay.classList.remove('dkv-is-visible');
        if (this.tooltip) this.tooltip.classList.remove('dkv-is-visible');

        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.src = ''; // Force cleanup
            this.currentAudio = null;
        }
        
        if (this.activeStepTimeout) {
            clearTimeout(this.activeStepTimeout);
            this.activeStepTimeout = null;
        }

        this.app.onTutorialFinished();

        if (this.app.logger) {
            this.app.logger.info('Tutorial befejezve');
        }
    }

    /**
     * Explicit cleanup – destroy pattern (project-context.md)
     */
    destroy() {
        this.end();
        [this.overlay, this.tooltip].forEach(el => {
            if (el && el.parentNode) el.parentNode.removeChild(el);
        });
        this.overlay = this.tooltip = null;
    }
}

export default TutorialManager;
