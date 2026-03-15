/**
 * FinaleGame - Nagy Zár Feladat (Grade 3)
 * 5 kulcs sorrendbe rakása + Varázsszó megadása
 */
class FinaleGame {
    constructor(container, options = {}) {
        this.container = container;
        this.options = options;
        this.onComplete = options.onComplete || (() => { });
        
        // Helyes értékek a help_json.txt alapján
        this.CORRECT_WORD = "5kulcskell";
        this.CORRECT_ORDER = ["keyA", "keyB", "keyC", "keyD", "keyE"];
        
        // Pontozás
        this.POINTS_WORD = 5;
        this.POINTS_ORDER = 5;

        // Állapot
        this.placedKeys = [null, null, null, null, null]; // Slotok tartalma (keyA, keyB, etc.)
        this.userWord = "";
        
        // Időzítő
        this.timerElapsed = 0;
        this.timerStarted = false;
        this.timerInterval = null;
        this.timerTimeEl = null;

        this.init();
    }

    init() {
        this.container.innerHTML = '';
        this.render();
        this.setupInventoryDraggable(true);
        this.setupTimerUI();
        
        // Sidebar és Alsó sáv kiemelése
        const sidebar = document.querySelector('.dkv-game-sidebar');
        const bottomBar = document.querySelector('.dkv-game-bottom-bar');
        const journalBtn = document.querySelector('.dkv-btn-journal');

        if (sidebar) sidebar.classList.add('finale-active');
        if (bottomBar) bottomBar.classList.add('finale-active');
        if (journalBtn) journalBtn.classList.add('finale-active');
    }

    setupTimerUI() {
        // Időmérő sáv dinamikus generálása a modal fejlécébe (mint a Sound feladatnál)
        const timerBar = document.createElement('div');
        timerBar.className = 'finale-timer-bar';
        timerBar.innerHTML = `
            <span class="finale-timer-icon">⏱️</span>
            <span class="finale-timer-time">00:00</span>
        `;

        const modalHeader = this.container.closest('.dkv-task-modal-overlay')?.querySelector('.dkv-task-modal-header');
        if (modalHeader) {
            // Töröljük az esetlegesen ott maradt régi időzítőt
            const oldTimer = modalHeader.querySelector('.finale-timer-bar');
            if (oldTimer) oldTimer.remove();
            
            modalHeader.appendChild(timerBar);
        } else {
            this.container.appendChild(timerBar);
        }
        this.timerTimeEl = timerBar.querySelector('.finale-timer-time');
    }

    startTimer() {
        if (this.timerStarted) return;
        this.timerStarted = true;
        this.timerInterval = setInterval(() => {
            this.timerElapsed++;
            if (this.timerTimeEl) {
                const mins = Math.floor(this.timerElapsed / 60).toString().padStart(2, '0');
                const secs = (this.timerElapsed % 60).toString().padStart(2, '0');
                this.timerTimeEl.textContent = `${mins}:${secs}`;
            }
        }, 1000);
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'finale-game-container';

        // 1. Instrukciók
        const instructions = document.createElement('div');
        instructions.className = 'finale-instructions';
        instructions.innerHTML = `
            <ol>
                <li>Nézd meg a kulcsokat!</li>
                <li>Kattints egy kulcsra, hogy megjelenjen a kulcs kinagyított képe!</li>
                <li>Gyűjts betűcsoportokat!</li>
                <li>Jegyezd fel a Küldetésnaplódba a kulcsokon lévő összes betűcsoportot!</li>
                <li>Alkoss értelmes szöveget! A kulcsokon található betűcsoportokból alkoss egy értelmes magyar szöveget!</li>
                <li>Határozd meg a helyes sorrendet! A szövegben lévő betűcsoportok helye megmutatja, hogy a kulcsokat milyen sorrendben kell elhelyezni.</li>
                <li>Írd be a szöveget és helyezd el a kulcsokat! Szorosan illeszd össze a betűcsoportokat szóközök nélkül és írd be a beviteli mezőbe! A kulcsokat pedig a betűcsoportok összeillesztése alapján helyezd egymás mellé!</li>
            </ol>
        `;
        wrapper.appendChild(instructions);

        // 2. Varázsszó beviteli mező
        const wordSection = document.createElement('div');
        wordSection.className = 'finale-word-section';
        const tooltipText = "Írd be a Küldetésnaplóba a kulcsokon található betűcsoportokat. Például az első kulcson azt olvasod: '<b>tó</b>', a másodikon azt olvasod: '<b>au</b>' stb. Ezután ezekből állíts össze értelmes szöveget, például '<b>autó</b>'.<br><br>Amelyik betűcsoporttal kezdődik a szöveg ('au'), az a kulcs lesz az első kulcshelyen, ezt követi a második betűcsoport kulcsa ('tó') a második kulcshelyen és így tovább.";
        
        wordSection.innerHTML = `
            <div class="finale-input-wrapper">
                <input type="text" id="finale-word-input" placeholder="A varázsszó..." autocomplete="off">
                <span class="finale-tooltip-icon" data-tooltip="${tooltipText}">?</span>
            </div>
        `;
        const tooltipIcon = wordSection.querySelector('.finale-tooltip-icon');
        this.setupTooltip(tooltipIcon);

        wrapper.appendChild(wordSection);

        this.wordInput = wordSection.querySelector('input');
        this.wordInput.addEventListener('input', (e) => {
            this.startTimer(); // Időzítő indítása gépelésre
            this.userWord = e.target.value.trim();
            this.updateButtonState();
        });

        // 3. Kulcs foglalatok (Slots)
        const slotsRow = document.createElement('div');
        slotsRow.className = 'finale-slots-row';
        
        for (let i = 0; i < 5; i++) {
            const slot = document.createElement('div');
            slot.className = 'finale-key-slot';
            slot.dataset.index = i;
            slot.innerHTML = `<span class="slot-number">${i + 1}.</span>`;
            
            // Drag and Drop események a slotra
            slot.addEventListener('dragover', (e) => this.handleDragOver(e));
            slot.addEventListener('dragenter', (e) => slot.classList.add('drag-over'));
            slot.addEventListener('dragleave', (e) => slot.classList.remove('drag-over'));
            slot.addEventListener('drop', (e) => this.handleDrop(e, i));
            
            slotsRow.appendChild(slot);
        }
        wrapper.appendChild(slotsRow);
        this.slots = slotsRow.querySelectorAll('.finale-key-slot');

        this.container.appendChild(wrapper);
        this.updateButtonState();
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDrop(e, slotIndex) {
        e.preventDefault();
        const slot = this.slots[slotIndex];
        slot.classList.remove('drag-over');

        this.startTimer(); // Időzítő indítása drop-ra

        const keyId = e.dataTransfer.getData('text/plain'); // Pl. "keyA", "keyB"...
        if (!keyId || !keyId.startsWith('key')) return;

        // Ha már máshol ott volt a kulcs, onnan töröljük
        const prevIndex = this.placedKeys.indexOf(keyId);
        if (prevIndex !== -1) {
            this.placedKeys[prevIndex] = null;
            this.renderSlot(prevIndex);
        }

        // Új helyre tesszük
        this.placedKeys[slotIndex] = keyId;
        this.renderSlot(slotIndex);
        this.updateButtonState();
    }

    renderSlot(index) {
        const slot = this.slots[index];
        const keyId = this.placedKeys[index];
        
        slot.innerHTML = `<span class="slot-number">${index + 1}.</span>`;
        
        if (keyId) {
            const img = document.createElement('img');
            img.src = `assets/images/grade3/keys/${keyId}_drop.png`;
            img.className = 'placed-key-img';
            img.draggable = true;
            img.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', keyId);
            });
            slot.appendChild(img);
            
            img.onclick = () => {
                this.placedKeys[index] = null;
                this.renderSlot(index);
                this.updateButtonState();
            };
        }
    }

    updateButtonState() {
        const allKeysPlaced = this.placedKeys.every(k => k !== null);
        const wordEntered = this.userWord.length > 0;
        const isReady = allKeysPlaced && wordEntered;
        
        if (this.options.gameInterface) {
            this.options.gameInterface.setTaskOkButtonState(isReady);
        }
    }

    evaluate() {
        const wordCorrect = this.userWord.toLowerCase() === this.CORRECT_WORD.toLowerCase();
        const orderCorrect = JSON.stringify(this.placedKeys) === JSON.stringify(this.CORRECT_ORDER);
        
        let points = 0;
        if (wordCorrect) points += this.POINTS_WORD;
        if (orderCorrect) points += this.POINTS_ORDER;
        
        const success = wordCorrect && orderCorrect;
        
        let feedback = "";
        if (success) {
            feedback = "Szuper vagy, Kódmester! Megoldottad a végső rejtélyt!";
        } else if (wordCorrect) {
            feedback = "A szó helyes, de a kulcsok sorrendje még nem az igazi!";
        } else if (orderCorrect) {
            feedback = "A kulcsok sorrendje tökéletes, de a szó még nem stimmel!";
        } else {
            feedback = "Ez nem a helyes megoldás. Talán legközelebb jobban teljesítesz.";
        }

        // Timer leállítása
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        return {
            success,
            points,
            wordCorrect,
            orderCorrect,
            feedback,
            title: feedback,
            maxPoints: this.POINTS_WORD + this.POINTS_ORDER,
            timeElapsed: this.timerElapsed
        };
    }

    setupInventoryDraggable(enabled) {
        const sidebar = document.querySelector('.dkv-game-sidebar');
        if (!sidebar) return;

        const keyImgs = sidebar.querySelectorAll('.dkv-inventory-slot img');
        keyImgs.forEach(img => {
            img.draggable = enabled;
            if (enabled) {
                // Meglévő listeners törlése (opcionális, de biztonságosabb ha újrakötjük)
                const newImg = img.cloneNode(true);
                img.parentNode.replaceChild(newImg, img);

                newImg.addEventListener('dragstart', (e) => {
                    this.startTimer(); // Időzítő indítása drag-re
                    const src = newImg.src;
                    let keyId = "";
                    if (src.includes('keyA')) keyId = "keyA";
                    else if (src.includes('keyB')) keyId = "keyB";
                    else if (src.includes('keyC')) keyId = "keyC";
                    else if (src.includes('keyD')) keyId = "keyD";
                    else if (src.includes('keyE')) keyId = "keyE";
                    
                    e.dataTransfer.setData('text/plain', keyId);
                });

                // Kattintásra is indítsuk el az időmérőt (lightbox megnyitása)
                newImg.addEventListener('click', () => {
                    this.startTimer();
                    const src = newImg.src;
                    let keyId = "";
                    if (src.includes('keyA')) keyId = "keyA";
                    else if (src.includes('keyB')) keyId = "keyB";
                    else if (src.includes('keyC')) keyId = "keyC";
                    else if (src.includes('keyD')) keyId = "keyD";
                    else if (src.includes('keyE')) keyId = "keyE";
                    
                    if (keyId && this.options.gameInterface) {
                        this.options.gameInterface.showKeyLightbox(keyId);
                    }
                });
            }
        });
    }

    setupTooltip(icon) {
        if (!icon) return;
        
        const tooltipBox = document.createElement('div');
        tooltipBox.className = 'finale-custom-tooltip';
        tooltipBox.style.display = 'none';
        tooltipBox.innerHTML = icon.dataset.tooltip;
        document.body.appendChild(tooltipBox);

        icon.addEventListener('mouseenter', () => {
            tooltipBox.style.display = 'block';
        });

        icon.addEventListener('mousemove', (e) => {
            tooltipBox.style.left = (e.pageX + 15) + 'px';
            tooltipBox.style.top = (e.pageY + 15) + 'px';
        });

        icon.addEventListener('mouseleave', () => {
            tooltipBox.style.display = 'none';
        });

        this.tooltipBox = tooltipBox;
    }

    destroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        if (this.timerTimeEl) {
            const timerBar = this.timerTimeEl.closest('.finale-timer-bar');
            if (timerBar && timerBar.parentNode) {
                timerBar.parentNode.removeChild(timerBar);
            }
        }

        if (this.tooltipBox) {
            this.tooltipBox.remove();
        }

        const sidebar = document.querySelector('.dkv-game-sidebar');
        const bottomBar = document.querySelector('.dkv-game-bottom-bar');
        const journalBtn = document.querySelector('.dkv-btn-journal');

        if (sidebar) sidebar.classList.remove('finale-active');
        if (bottomBar) bottomBar.classList.remove('finale-active');
        if (journalBtn) journalBtn.classList.remove('finale-active');

        this.container.innerHTML = '';
        this.setupInventoryDraggable(false);
    }
}

export default FinaleGame;
