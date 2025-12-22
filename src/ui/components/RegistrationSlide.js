/**
 * RegistrationSlide - Adatbekérő űrlap
 * 
 * Funkciók:
 * - 3 Input: Név, Becenév, Osztály
 * - Real-time validáció és formázás (onBlur)
 * - Tovább gomb csak akkor aktív, ha minden helyes (de alapból kattintható a validációhoz)
 * - Hibaüzenetek saját Modalban
 * - Modal Lock: Egyszerre csak egy hiba lehet aktív!
 * - Dinamikus Validáció: Configból tölti be az engedélyezett osztályokat!
 * - Focus Trap: Modal megjelenésekor fogja a billentyűzet-fókuszt (A11y)
 * - Auto-fókusz: Megnyitáskor a Név mezőre ugrik
 */
class RegistrationSlide {
    constructor(slideData, options = {}) {
        this.slideData = slideData;
        this.onNext = options.onNext || (() => { });
        this.stateManager = options.stateManager;

        // Állapotkövetés
        this.isValid = {
            name: false,
            nick: false,
            classId: false
        };

        this.isModalActive = false; // Kizárólagosság kezelése
        this.element = null;
        this.nextBtn = null;
        this.modal = null;
        this.lastFocusedElement = null; // Ide mentjük a fókuszt nyitáskor
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'dkv-slide-container dkv-registration-slide';

        // Belső konténer
        const container = document.createElement('div');
        container.className = 'dkv-onboarding-container';

        const title = document.createElement('h2');
        title.className = 'dkv-slide-title';
        title.textContent = this.slideData.title;

        const form = document.createElement('div');
        form.className = 'dkv-form-container';
        form.style.width = '100%';
        form.style.maxWidth = '600px';

        // Inputok létrehozása (validációs callbackkel)
        this.nameInput = this._createInput('Mi a teljes neved?', 'Kiss Pál', 'name');
        this.nickInput = this._createInput('Hogyan szólíthatunk?', 'Zseni', 'nick');
        this.classIdInput = this._createInput('Melyik osztályba jársz?', '4.b', 'classId');

        // Tovább Gomb (mindig aktív, de a klikk ellenőrzi a validitást)
        this.nextBtn = document.createElement('button');
        this.nextBtn.className = 'dkv-button dkv-onboarding-next-btn';
        this.nextBtn.textContent = (this.slideData.content && this.slideData.content.buttonText) || 'Tovább';
        this.nextBtn.onclick = () => this.handleSubmit();

        form.appendChild(this.nameInput.container);
        form.appendChild(this.nickInput.container);
        form.appendChild(this.classIdInput.container);

        container.appendChild(title);
        container.appendChild(form);
        container.appendChild(this.nextBtn);

        this.element.appendChild(container);

        // Modal előkészítése (rejtve)
        this._createModal();

        // Auto-fókusz az első mezőre (kis késleltetéssel, hogy a DOM-ba kerülés után fusson)
        setTimeout(() => {
            if (this.nameInput && this.nameInput.input) {
                this.nameInput.input.focus();
            }
        }, 100);

        return this.element;
    }

    _createInput(label, placeholder, type) {
        const container = document.createElement('div');
        container.className = 'dkv-input-group';
        container.style.marginBottom = '20px';

        const lbl = document.createElement('label');
        lbl.textContent = label;
        lbl.className = 'dkv-input-label';
        lbl.style.display = 'block';
        lbl.style.marginBottom = '8px';

        const inp = document.createElement('input');
        inp.type = 'text';
        inp.placeholder = placeholder;
        inp.className = 'dkv-input-field';
        inp.style.width = '100%';
        inp.style.padding = '12px';
        inp.style.borderRadius = '8px';
        inp.style.border = '1px solid rgba(255,255,255,0.2)';
        inp.style.background = 'rgba(0,0,0,0.3)';
        inp.style.color = '#fff';

        if (type === 'classId') {
            inp.maxLength = 3;
        } else if (type === 'nick') {
            inp.maxLength = 15; // Max 15 karakter
        }

        // onBlur esemény - Validáció és Formázás
        inp.onblur = () => {
            this._validateField(type, inp);
        };

        // onInput - Karakterek szűrése gépelés közben
        inp.oninput = () => {
            const start = inp.selectionStart;
            let originalValue = inp.value;
            let filteredValue = originalValue;

            if (type === 'name') {
                filteredValue = filteredValue.replace(/[^a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s-]/g, '');
            } else if (type === 'nick') {
                filteredValue = filteredValue.replace(/[^a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ-]/g, '');
            } else if (type === 'classId') {
                filteredValue = filteredValue.replace(/[^0-9a-zA-Z.]/g, '');
            }

            if (originalValue !== filteredValue) {
                inp.value = filteredValue;
                inp.setSelectionRange(Math.max(0, start - 1), Math.max(0, start - 1));
            }
        };

        container.appendChild(lbl);
        container.appendChild(inp);

        return { container, input: inp };
    }

    _validateField(type, inputElement, silent = false) {
        if (this.isModalActive && !silent) {
            return { isValid: false, error: null };
        }

        const value = inputElement.value;
        let isValid = false;
        let error = null;
        let formattedValue = value;

        if (type === 'name') {
            const result = this._validateName(value);
            if (result.valid) formattedValue = result.formatted;
            isValid = result.valid;
            error = result.error;
        } else if (type === 'nick') {
            const result = this._validateNick(value);
            if (result.valid) formattedValue = result.formatted;
            isValid = result.valid;
            error = result.error;
        } else if (type === 'classId') {
            const result = this._validateClass(value);
            if (result.valid) formattedValue = result.formatted;
            isValid = result.valid;
            error = result.error;
        }

        if (isValid) {
            inputElement.value = formattedValue;
            inputElement.style.borderColor = '#4ade80';
            this.isValid[type] = true;
        } else {
            inputElement.style.borderColor = '#ef4444';
            this.isValid[type] = false;
            if (!silent && error) {
                this.showErrorModal(error, () => {
                    inputElement.focus();
                    inputElement.select();
                });
            }
        }
        return { isValid, error };
    }

    _validateName(raw) {
        let formatted = raw.trim().toLowerCase().replace(/(?:^|\s|-)\S/g, function (a) { return a.toUpperCase(); });

        if (formatted.length === 0) return { valid: false, error: 'Kérlek add meg a teljes nevedet!' };

        if (formatted.split(' ').length < 2) {
            return { valid: false, error: 'A nevednek legalább két szóból kell állnia!\nKérlek, ellenőrizd a helyesírást és a szóközöket!' };
        }

        if (formatted.includes('-')) {
            if ((formatted.match(/-/g) || []).length > 1) {
                return { valid: false, error: 'A névben legfeljebb egy kötőjel szerepelhet!\nÜgyelj a helyesírásra, pl. Kiss-Nagy Anna.' };
            }
            if (formatted.startsWith('-') || formatted.endsWith('-')) {
                return { valid: false, error: 'A kötőjel nem állhat a név elején vagy végén!\nKét név közé kell írni, pl. Kiss-Nagy Anna.' };
            }
            if (formatted.includes(' -') || formatted.includes('- ')) {
                return { valid: false, error: 'A kötőjel előtt és után nem lehet szóköz!\nHelyes példa: Kiss-Nagy Anna' };
            }
            if (!/[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]-[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]/.test(formatted)) {
                return { valid: false, error: 'A kötőjelnek két név (betűk) között kell állnia!' };
            }
        }

        if (!/^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s-]+$/.test(formatted)) {
            return { valid: false, error: 'A név csak betűket és kötőjelet tartalmazhat!\nÜgyelj a helyesírásra!' };
        }
        return { valid: true, formatted };
    }

    _validateNick(raw) {
        let formatted = raw.trim();
        if (formatted.length === 0) {
            return { valid: false, error: 'Kérlek add meg a becenevedet!' };
        }

        if (formatted.length < 3) {
            return { valid: false, error: 'A becenévnek legalább 3 karakterből kell állnia!\nÜgyelj arra, hogy csak betűket használj!' };
        }

        if (formatted.length > 15) {
            return { valid: false, error: 'A becenév legfeljebb 15 karakter hosszú lehet!\nÜgyelj arra, hogy csak betűket használj!' };
        }

        if (formatted.length > 0) {
            formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
        }

        if (formatted.includes(' ')) {
            return { valid: false, error: 'A becenév csak egy szóból állhat!\nÜgyelj arra, hogy csak betűket használj!' };
        }

        if (formatted.includes('-')) {
            if ((formatted.match(/-/g) || []).length > 1) {
                return { valid: false, error: 'A becenévben legfeljebb egy kötőjel szerepelhet!' };
            }
            if (formatted.startsWith('-') || formatted.endsWith('-')) {
                return { valid: false, error: 'A kötőjel nem állhat a becenév elején vagy végén!' };
            }
            if (!/[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]-[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]/.test(formatted)) {
                return { valid: false, error: 'A kötőjelnek két betű között kell állnia!' };
            }
        }

        return { valid: true, formatted };
    }

    _validateClass(raw) {
        let formatted = raw.replace(/\s+/g, '').toLowerCase();

        if (formatted.length === 0) return { valid: false, error: 'Kérlek add meg az osztályodat!' };

        if (!/^\d\.[a-z]$/.test(formatted)) {
            return { valid: false, error: 'Az osztály formátuma helytelen!\nHelyes példa: 4.b (szám, pont, betű)' };
        }

        // DINAMIKUS VALIDÁCIÓ CONFIGBÓL
        const allowed = (this.slideData.content &&
            this.slideData.content.validation &&
            this.slideData.content.validation.allowedClasses)
            || ['3.a', '3.b', '3.c', '4.a', '4.b', '4.c', '4.d', '5.a', '5.b', '5.c', '6.a', '6.b', '6.c'];

        if (!allowed.includes(formatted)) {
            return { valid: false, error: `Érvénytelen osztály: "${formatted}".\nCsak a megadott osztályok fogadhatóak el:\n${allowed.join(', ')}` };
        }
        return { valid: true, formatted };
    }

    // === Modal Logika ===
    _createModal() {
        this.modal = document.createElement('div');
        this.modal.style.position = 'absolute';
        this.modal.style.top = '0';
        this.modal.style.left = '0';
        this.modal.style.width = '100%';
        this.modal.style.height = '100%';
        this.modal.style.background = 'rgba(0,0,0,0.8)';
        this.modal.style.display = 'none';
        this.modal.style.alignItems = 'center';
        this.modal.style.justifyContent = 'center';
        this.modal.style.zIndex = '1000';

        // Accessibility
        this.modal.setAttribute('role', 'dialog');
        this.modal.setAttribute('aria-modal', 'true');

        const content = document.createElement('div');
        content.style.background = '#1f2937';
        content.style.border = '2px solid #ef4444';
        content.style.padding = '2rem';
        content.style.borderRadius = '12px';
        content.style.maxWidth = '400px';
        content.style.textAlign = 'center';
        content.style.color = 'white';

        this.modalMsg = document.createElement('p');
        this.modalMsg.style.marginBottom = '1.5rem';
        this.modalMsg.style.fontSize = '1.1rem';
        this.modalMsg.style.whiteSpace = 'pre-line';
        this.modalMsg.style.lineHeight = '1.5';

        this.okBtn = document.createElement('button');
        this.okBtn.className = 'dkv-button';
        this.okBtn.textContent = 'OK';

        this.okBtn.onclick = () => {
            this._closeModal();
        };

        this.modal.addEventListener('keydown', (e) => this._handleTrapFocus(e));

        content.appendChild(this.modalMsg);
        content.appendChild(this.okBtn);
        this.modal.appendChild(content);

        this.element.appendChild(this.modal);
        this.currentModalCallback = null;
    }

    _closeModal() {
        this.modal.style.display = 'none';
        this.isModalActive = false;

        if (this.currentModalCallback) {
            setTimeout(() => {
                this.currentModalCallback();
                this.currentModalCallback = null;
            }, 50);
        } else if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
            this.lastFocusedElement = null;
        }
    }

    _handleTrapFocus(e) {
        const isTab = (e.key === 'Tab' || e.keyCode === 9);
        if (!isTab) return;

        const focusable = this.modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else { // Tab
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    showErrorModal(msg, onClose = null) {
        if (this.isModalActive) return;

        this.isModalActive = true;
        this.lastFocusedElement = document.activeElement; // Fókusz mentése

        this.modalMsg.textContent = msg;
        this.currentModalCallback = onClose;
        this.modal.style.display = 'flex';

        setTimeout(() => {
            this.okBtn.focus();
        }, 50);
    }

    handleSubmit() {
        if (this.isModalActive) return;

        const nameCheck = this._validateField('name', this.nameInput.input, true);
        if (!nameCheck.isValid) {
            this.showErrorModal(nameCheck.error, () => {
                this.nameInput.input.focus();
                this.nameInput.input.select();
            });
            return;
        }

        const nickCheck = this._validateField('nick', this.nickInput.input, true);
        if (!nickCheck.isValid) {
            this.showErrorModal(nickCheck.error, () => {
                this.nickInput.input.focus();
                this.nickInput.input.select();
            });
            return;
        }

        const classCheck = this._validateField('classId', this.classIdInput.input, true);
        if (!classCheck.isValid) {
            this.showErrorModal(classCheck.error, () => {
                this.classIdInput.input.focus();
                this.classIdInput.input.select();
            });
            return;
        }

        const userProfile = {
            name: this.nameInput.input.value,
            nickname: this.nickInput.input.value,
            classId: this.classIdInput.input.value
        };

        if (this.stateManager) {
            this.stateManager.updateState({ userProfile });
            console.log('Sending user data to server...', userProfile);
        }

        this.onNext();
    }
}

export default RegistrationSlide;
