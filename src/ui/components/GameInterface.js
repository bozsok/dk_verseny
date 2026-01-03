/**
 * GameInterface - Egységes Játékfelület Keretrendszer
 * 
 * Ez a komponens biztosítja az állandó keretet (HUD, Oldalsáv, Navigáció)
 * a 3-6. osztályos játékmenethez.
 */
class GameInterface {
    constructor(options = {}) {
        this.options = options;

        // Callback-ek
        this.onNext = options.onNext || (() => { });
        this.onPrev = options.onPrev || (() => { });
        this.onOpenJournal = options.onOpenJournal || (() => { });
        this.onOpenNarrator = options.onOpenNarrator || (() => { });
        this.onOpenSettings = options.onOpenSettings || (() => { });

        // State
        this.totalSlides = options.totalSlides || 28;
        this.currentSlideIndex = options.currentSlideIndex || 1;
        this.currentDisplayedScore = 0;

        this.element = null;
        this.timelineBar = null;
        this.timelineText = null;
        this.contentContainer = null;
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'dkv-game-interface';

        // 1. FELSŐ SÁV (HUD)
        const hud = document.createElement('div');
        hud.className = 'dkv-game-hud';

        // Bal: Avatar + Név + PONT
        const leftGroup = document.createElement('div');
        leftGroup.className = 'dkv-hud-left-group';

        // Kezdeti placeholder - updateHUD fogja frissíteni
        leftGroup.innerHTML = `
            <div class="dkv-avatar-circle"></div>
            <div class="dkv-user-info">
                <span class="dkv-username">Játékos</span>
                <span class="dkv-points">0 Pont</span>
            </div>
        `;

        // Referenciák a frissítéshez
        this.avatarEl = leftGroup.querySelector('.dkv-avatar-circle');
        this.usernameEl = leftGroup.querySelector('.dkv-username');
        this.pointsEl = leftGroup.querySelector('.dkv-points');

        // Ha van már adat a State-ben, töltsük be (opcionális inicializálás)
        if (this.options.stateManager) {
            const state = this.options.stateManager.getState();
            // Kicsit késleltetve vagy manuálisan hívjuk, de itt még lehet üres.
        }

        // Közép: Idővonal (Timeline)
        const timeline = document.createElement('div');
        timeline.className = 'dkv-hud-timeline';
        timeline.innerHTML = `
            <div class="dkv-timeline-circle"><span id="dkv-timeline-pct">0%</span></div>
            <div class="dkv-timeline-track">
                <div class="dkv-timeline-progress" id="dkv-timeline-bar" style="width: 0%"></div>
            </div>
        `;

        // Jobb: Beállítások gomb (a globális időzítő mellett/alatt)
        const rightGroup = document.createElement('div');
        rightGroup.className = 'dkv-hud-right-group';

        // Beállítások gomb átmozgatása fentre
        const topSettingsBtn = document.createElement('button');
        topSettingsBtn.className = 'dkv-func-btn dkv-btn-settings';
        topSettingsBtn.title = 'Hangbeállítások';
        topSettingsBtn.innerHTML = '🔊';
        // zIndex maradhat, hogy kattintható legyen, de position nem kell
        topSettingsBtn.style.zIndex = '2001';
        topSettingsBtn.onclick = () => this.onOpenSettings();

        rightGroup.appendChild(topSettingsBtn);

        hud.appendChild(leftGroup);
        hud.appendChild(timeline);
        hud.appendChild(rightGroup);
        this.element.appendChild(hud);

        // Referencia a név frissítéséhez
        this.usernameDisplay = leftGroup.querySelector('.dkv-username');

        // 2. JOBB OLDALI SÁV (Varázstárgyak)
        const sidebar = document.createElement('div');
        sidebar.className = 'dkv-game-sidebar';
        sidebar.innerHTML = `
            <div class="dkv-inventory-slot"></div>
            <div class="dkv-inventory-slot"></div>
            <div class="dkv-inventory-slot"></div>
            <div class="dkv-inventory-slot"></div>
            <div class="dkv-inventory-slot"></div>
        `;
        this.element.appendChild(sidebar);

        // 3. FŐ TARTALMI TERÜLET (Content)
        this.contentContainer = document.createElement('div');
        this.contentContainer.className = 'dkv-game-content-area';
        // Ide kerül majd a Slide tartalma (Mock vagy Valódi)
        this.element.appendChild(this.contentContainer);

        // 4. ALSÓ SÁV (Bottom Bar)
        const bottomBar = document.createElement('div');
        bottomBar.className = 'dkv-game-bottom-bar';

        // Bal alul: Funkció gombok (Már csak Napló és Narráció)
        const funcButtons = document.createElement('div');
        funcButtons.className = 'dkv-func-buttons';

        const journalBtn = document.createElement('button');
        journalBtn.className = 'dkv-func-btn dkv-btn-journal';
        journalBtn.title = 'Napló';
        journalBtn.innerHTML = '📓';
        journalBtn.onclick = () => this.onOpenJournal();

        const narratorBtn = document.createElement('button');
        narratorBtn.className = 'dkv-func-btn dkv-btn-narrator';
        narratorBtn.title = 'Narráció';
        narratorBtn.innerHTML = '📜';
        narratorBtn.onclick = () => this.onOpenNarrator();

        // Settings gomb innen eltávolítva

        funcButtons.appendChild(journalBtn);
        funcButtons.appendChild(narratorBtn);

        // Közép: Navigáció
        const navControls = document.createElement('div');
        navControls.className = 'dkv-nav-controls';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'dkv-nav-arrow dkv-nav-prev dkv-btn-prev';
        // SVG Icon (Chevron Left)
        prevBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;
        prevBtn.onclick = () => this.onPrev();

        const nextBtn = document.createElement('button');
        nextBtn.className = 'dkv-nav-arrow dkv-nav-next dkv-btn-next';
        // SVG Icon (Chevron Right)
        nextBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;
        nextBtn.onclick = () => this.onNext();

        navControls.appendChild(prevBtn);
        navControls.appendChild(nextBtn);

        bottomBar.appendChild(funcButtons); // Bal csoport
        bottomBar.appendChild(navControls); // Közép csoport (CSS-sel pozícionálva)

        this.element.appendChild(bottomBar);

        // Cache referenciák
        this.timelineBar = this.element.querySelector('#dkv-timeline-bar');
        this.timelineText = this.element.querySelector('#dkv-timeline-pct');
        this.timelineCircle = this.element.querySelector('.dkv-timeline-circle');

        return this.element;
    }

    /**
     * Tartalom cseréje a középső területen
     */
    setContent(element) {
        if (this.contentContainer) {
            this.contentContainer.innerHTML = '';
            this.contentContainer.appendChild(element);
        }
    }

    /**
     * Idővonal frissítése
     * @param {number} currentSlide - Aktuális dia sorszáma (1-től)
     */
    updateTimeline(currentSlide) {
        // Az első dia (Welcome) nem számít, az összes többi (30 db) adja a 100%-ot.
        const offset = 1;
        const current = Math.max(0, currentSlide - offset);

        // A totalSlides értékét a main.js-ből kapjuk (30)
        const pct = Math.min(100, Math.floor((current / this.totalSlides) * 100));

        if (this.timelineBar) {
            this.timelineBar.style.width = `${pct}%`;
        }
        if (this.timelineText) {
            this.timelineText.textContent = `${pct}%`;
        }
        if (this.timelineCircle) {
            // Dinamikus körkörös progresszió (Radial Mask + Conic Gradient)
            // 88% belső mag ~ 3px vastag gyűrű (50px esetén)
            this.timelineCircle.style.background = `radial-gradient(closest-side, rgba(0, 21, 30, 0.9) 88%, transparent 89%),
                conic-gradient(#00d2d3 ${pct}%, rgba(0, 210, 211, 0.2) 0%)`;
        }
    }

    /**
     * HUD Adatok (Avatar, Név, Pont) frissítése
     * @param {Object} state - A teljes Application State vagy { userProfile, score, avatar }
     */
    updateHUD(state = {}) {
        if (!state) return;

        // Avatar
        if (this.avatarEl && state.avatar) {
            this.avatarEl.style.backgroundImage = `url('${state.avatar}')`;
            this.avatarEl.style.backgroundSize = 'cover';
            this.avatarEl.style.backgroundPosition = 'center';
        }

        // Név (Becenév preferált)
        if (this.usernameEl) {
            const nick = (state.userProfile && state.userProfile.nickname) || state.nickname || 'Játékos';
            this.usernameEl.textContent = nick;
        }

        // Pontszám Animált frissítése
        if (this.pointsEl) {
            const targetScore = (state.score !== undefined) ? state.score : 0;

            if (targetScore !== this.currentDisplayedScore || this.pointsEl.textContent === '') {
                this._animateScore(this.currentDisplayedScore, targetScore);
                this.currentDisplayedScore = targetScore;
            }
        }
    }

    _animateScore(start, end) {
        const duration = 1500;
        const startTime = performance.now();
        const element = this.pointsEl;

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = progress * (2 - progress);

            const current = Math.floor(start + (end - start) * ease);
            element.textContent = `${current} Pont`;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = `${end} Pont`;
            }
        };
        requestAnimationFrame(step);
    }

    // --- PANELEK KEZELÉSE (Átemelve TaskSlide.js-ből) ---

    toggleJournal() {
        let journalPanel = this.element.querySelector('.dkv-journal-panel');

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
            this.element.appendChild(journalPanel);

            // Click outside
            document.addEventListener('mousedown', (e) => {
                if (journalPanel.classList.contains('open') &&
                    !journalPanel.contains(e.target) &&
                    !e.target.closest('button[title="Napló"]')) {
                    journalPanel.classList.remove('open');
                }
            });

            void journalPanel.offsetWidth;
        }
        journalPanel.classList.toggle('open');
    }

    toggleNarrator(text = null) {
        let narratorBox = this.element.querySelector('.dkv-narrator-box');

        // Árva elemek tisztítása
        const orphanBox = document.body.querySelector(':scope > .dkv-narrator-box');
        if (orphanBox) orphanBox.remove();

        if (!narratorBox) {
            narratorBox = document.createElement('div');
            narratorBox.className = 'dkv-narrator-box';
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
            this.element.appendChild(narratorBox);

            const closeIcon = narratorBox.querySelector('.dkv-close-icon');
            if (closeIcon) {
                closeIcon.onclick = (e) => {
                    e.stopPropagation();
                    narratorBox.classList.remove('open');
                };
            }
        }

        if (text) {
            const body = narratorBox.querySelector('.dkv-panel-body');
            if (body) body.innerHTML = `<p>${text}</p>`;
            narratorBox.classList.add('open');
        } else {
            void narratorBox.offsetWidth;
            narratorBox.classList.toggle('open');
        }
    }

    toggleSettings() {
        let settingsPanel = this.element.querySelector('.dkv-settings-panel');

        if (!settingsPanel) {
            settingsPanel = document.createElement('div');
            settingsPanel.className = 'dkv-settings-panel';

            settingsPanel.innerHTML = `
                <div class="dkv-panel-header">
                    <h2>Hangbeállítások</h2>
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

            this.element.appendChild(settingsPanel);

            document.addEventListener('mousedown', (e) => {
                if (settingsPanel.classList.contains('open') &&
                    !settingsPanel.contains(e.target) &&
                    !e.target.closest('button[title="Hangbeállítások"]')) {
                    settingsPanel.classList.remove('open');
                }
            });

            void settingsPanel.offsetWidth;
        }
        settingsPanel.classList.toggle('open');
    }
}

export default GameInterface;
