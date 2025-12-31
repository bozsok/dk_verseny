/**
 * RegistrationSlide - Adatbekérő űrlap
 * 
 * Funkciók:
 * - 3 Input: Név, Becenév, Osztály
 * - Real-time validáció és formázás (onBlur)
 * - Tovább gomb csak akkor aktív, ha minden helyes 
 * - Hibaüzenetek saját Modalban
 * - Modal Lock: Egyszerre csak egy hiba lehet aktív!
 * - Dinamikus Validáció: Configból tölti be az engedélyezett osztályokat!
 * - Focus Trap: Modal megjelenésekor fogja a billentyűzet-fókuszt (A11y)
 * - Auto-fókusz: Megnyitáskor a Név mezőre ugrik
 * - Dinamikus Stílus (Configból)
 */
import Typewriter from '../../utils/Typewriter.js';

class RegistrationSlide {
    constructor(slideData, options = {}) {
        this.slideData = slideData;
        this.onNext = options.onNext || (() => { });
        this.stateManager = options.stateManager;
        this.typewriter = new Typewriter(); // Ha kellene

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

        // Cím és Instrukciók Konténer
        const infoContainer = document.createElement('div');
        infoContainer.className = 'dkv-slide-description-container';

        const rawTitle = this.slideData.title || '';
        const titleLines = rawTitle.split('\n');

        // Typing Config
        const typingSpeed = (this.slideData.content && this.slideData.content.typingSpeed) || 0;
        const paragraphs = [];

        titleLines.forEach((line, index) => {
            if (!line.trim()) return;

            // Az első sor legyen h2, a többi p (vagy mind h2 style?)
            // A User configjában egyetlen 'title' style van. Alkalmazzuk mindegyikre.
            const el = document.createElement(index === 0 ? 'h2' : 'p');
            el.className = index === 0 ? 'dkv-slide-title' : 'dkv-slide-description';

            if (index === 0) {
            }
            // else ág törölve, CSS kezeli az algímet

            // Typewriter INIT
            if (typingSpeed > 0) {
                this.typewriter.init(el, line);
            } else {
                el.innerHTML = line;
            }

            if (index > 0) {
                // ...
            }

            infoContainer.appendChild(el);
            paragraphs.push({ element: el, text: line });
        });

        // Form létrehozása
        const form = document.createElement('div');
        form.className = 'dkv-form-container';

        // Ha van gépelés, a formot elrejthetjük, amíg ki nem íródik? 
        // Vagy megjelenhet azonnal? A User nem kérte a form rejtését.
        // De az "onboarding" élmény miatt szebb, ha a szöveg után jön.
        if (typingSpeed > 0) {
            form.style.opacity = '0';
            form.style.transition = 'opacity 1s ease';
        }

        // Inputok létrehozása (validációs callbackkel)
        this.nameInput = this._createInput('Mi a teljes neved?', 'Kiss Pál', 'name');
        this.nickInput = this._createInput('Hogyan szólíthatunk?', 'Zseni', 'nick');
        this.classIdInput = this._createInput('Melyik osztályba jársz?', '4.b', 'classId');

        // Tovább Gomb
        this.nextBtn = document.createElement('button');
        this.nextBtn.className = 'dkv-button dkv-onboarding-next-btn';
        this.nextBtn.textContent = (this.slideData.content && this.slideData.content.buttonText) || 'Tovább';

        if (typingSpeed > 0) {
            this.nextBtn.style.opacity = '0';
            this.nextBtn.style.transition = 'opacity 1s ease';
        }

        // Gomb stílus alkalmazása (ITT A LÉNYEG!)
        // CSS kezeli (.dkv-button)

        this.nextBtn.onclick = () => this.handleSubmit();

        form.appendChild(this.nameInput.container);
        form.appendChild(this.nickInput.container);
        form.appendChild(this.classIdInput.container);

        container.appendChild(infoContainer);
        container.appendChild(form);
        container.appendChild(this.nextBtn);

        this.element.appendChild(container);

        // Modal előkészítése (rejtve)
        this._createModal();

        // Typewriter Sequence
        if (typingSpeed > 0) {
            this._startTypewriterSequence(paragraphs, typingSpeed, [form, this.nextBtn]);
        } else {
            // Ha nincs gépelés, auto-fókusz
            setTimeout(() => {
                if (this.nameInput && this.nameInput.input) {
                    this.nameInput.input.focus();
                }
            }, 100);
        }

        return this.element;
    }

    _startTypewriterSequence(paragraphs, speed, elementsToShow) {
        let currentIndex = 0;

        const typeNext = () => {
            if (currentIndex >= paragraphs.length) {
                // KÉSZ -> Form és Gomb megjelenítése
                elementsToShow.forEach(el => el.style.opacity = '1');
                // Fókusz
                setTimeout(() => {
                    if (this.nameInput && this.nameInput.input) {
                        this.nameInput.input.focus();
                    }
                }, 500);
                return;
            }

            // Előző kurzor levétele
            if (currentIndex > 0) {
                const prevEl = paragraphs[currentIndex - 1].element;
                const activeSpan = prevEl.querySelector('.dkv-cursor-active');
                if (activeSpan) activeSpan.classList.remove('dkv-cursor-active');
            }

            const pData = paragraphs[currentIndex];
            this.typewriter.type(pData.element, null, {
                speed: speed,
                showCursor: true,
                onComplete: () => {
                    currentIndex++;
                    setTimeout(typeNext, 300); // Kis szünet a sorok között
                }
            });
        };

        typeNext();
    }

    _createInput(label, placeholder, type) {
        const container = document.createElement('div');
        container.className = 'dkv-input-group';

        const lbl = document.createElement('label');
        lbl.textContent = label;
        lbl.className = 'dkv-input-label';

        // Config stílusok alkalmazása a labelre
        // Config stílusok alkalmazása már nem szükséges (CSS kezeli)

        const inp = document.createElement('input');
        inp.type = 'text';
        inp.placeholder = placeholder;
        inp.className = 'dkv-input-field';

        if (type === 'classId') {
            inp.maxLength = 3;
        } else if (type === 'nick') {
            inp.maxLength = 15;
        }

        // onBlur esemény - Validáció és Formázás
        inp.onblur = () => {
            // Ha a mező üres, akkor 'csendes' (silent) validációt futtatunk (NINCS Modal).
            // Ha van benne adat, de hibás, akkor 'hangos' (Modal).
            const isEmpty = inp.value.trim().length === 0;
            this._validateField(type, inp, isEmpty);
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
            inputElement.classList.remove('dkv-input-error');
            inputElement.classList.add('dkv-input-success');
            this.isValid[type] = true;
        } else {
            inputElement.classList.remove('dkv-input-success');
            inputElement.classList.add('dkv-input-error');
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

        const allowed = (this.slideData.content &&
            this.slideData.content.validation &&
            this.slideData.content.validation.allowedClasses)
            || ['3.a', '3.b', '3.c', '4.a', '4.b', '4.c', '4.d', '5.a', '5.b', '5.c', '6.a', '6.b', '6.c'];

        if (!allowed.includes(formatted)) {
            return { valid: false, error: `Érvénytelen osztály: "${formatted}".\nCsak a megadott osztályok fogadhatóak el:\n${allowed.join(', ')}` };
        }
        return { valid: true, formatted };
    }

    _createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'dkv-registration-modal-overlay';
        this.modal.style.display = 'none'; // Inicializálás

        this.modal.setAttribute('role', 'dialog');
        this.modal.setAttribute('aria-modal', 'true');

        const content = document.createElement('div');
        content.className = 'dkv-registration-modal-content';

        this.modalMsg = document.createElement('p');
        this.modalMsg.className = 'dkv-registration-modal-message';

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
        this.lastFocusedElement = document.activeElement;

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
