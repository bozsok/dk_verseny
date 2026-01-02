/**
 * Typewriter Utility - DOM RECURSIVE REVEAL EDITION
 * 
 * Javított működés:
 * 1. `init(element, htmlContent)`: Felépíti a teljes DOM fát.
 * 2. Rekurzívan bejárja, és csak a SZÖVEGES tartalmakat bontja `span`-okra.
 * 3. A formázások (pl <b>, <i>) megmaradnak befoglaló elemként.
 * 4. `play()`: Elindítja a felfedést.
 */
class Typewriter {
    constructor() {
        this.timeouts = [];
        this.cursorElement = null;
        this.activeSpans = []; // Az éppen animált elemek spanjei
        this.currentTarget = null;
    }

    /**
     * Előkészíti az elemet a gépelésre.
     * Azonnal beállítja a tartalmat rejtett spanekkel, így a layout stabil.
     */
    init(element, htmlContent) {
        element.innerHTML = '';

        // Ideiglenes konténer a HTML parsolásához
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        // Rekurzív feldolgozás és tartalom áthelyezése
        this._processNodes(tempDiv, element);

        // Elmentjük a targetet későbbi hivatkozáshoz (opcionális, ha play-nek átadjuk)
    }

    /**
     * Rekurzívan bejárja a forrás node-jait, és átmásolja a célba.
     * A szöveges node-okat karakterenként span-ba csomagolja.
     */
    _processNodes(sourceParent, targetParent) {
        sourceParent.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                // Szöveg -> Spanekre bontás
                const text = node.textContent;
                for (let i = 0; i < text.length; i++) {
                    const span = document.createElement('span');
                    span.textContent = text[i];
                    span.style.opacity = '0'; // Rejtett
                    span.className = 'dkv-tw-char'; // Jelölő osztály
                    targetParent.appendChild(span);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Elem (pl <b>) -> Klónozás (attribútumokkal) és rekurzió
                const newElem = node.cloneNode(false); // Csak a tag, tartalom nélkül
                targetParent.appendChild(newElem);
                this._processNodes(node, newElem); // Tartalom feldolgozása bele
            }
        });
    }

    /**
     * Elindítja az animációt egy már előkészített elemen, VAGY előkészíti és indítja.
     */
    type(element, htmlContent, options = {}) {
        // Ha kapunk HTML contentet, akkor újra-initelünk.
        // Ha a WelcomeSlide-ban szétválasztjuk, akkor itt htmlContent lehet null.
        if (htmlContent) {
            this.init(element, htmlContent);
        }

        const speed = (options.speed !== undefined && options.speed !== null) ? options.speed : 30;
        const showCursor = options.showCursor !== false;
        const onComplete = options.onComplete || (() => { });

        // Összes rejtett span összegyűjtése az elemen belül
        const charsToReveal = element.querySelectorAll('.dkv-tw-char');

        // --- INSTANT DISPLAY CHECK ---
        if (speed === 0) {
            charsToReveal.forEach(span => {
                span.style.opacity = '1';
            });
            // If cursor is requested, add to the last char
            if (showCursor && charsToReveal.length > 0) {
                charsToReveal[charsToReveal.length - 1].classList.add('dkv-cursor-active');
                this._ensureCursorStyle(); // Ensure style is present for cursor
            }
            onComplete();
            return;
        }

        let index = 0;
        let lastSpan = null;

        // CSS Stílus biztosítása
        if (showCursor) {
            this._ensureCursorStyle();
        }

        this.currentTarget = element; // Kurzorhoz

        const revealNext = () => {
            // Csak akkor vegyük le az előzőről, ha van még hátra karakter (tehát nem a legvége)
            // VAGY: Ha ez az utolsó lépés (index >= length), akkor NE vegyük le.

            if (index >= charsToReveal.length) {
                // Kész. Itt NEM vesszük le a lastSpan-ról (ha van).
                // Így ott marad villogni az utolsó karakteren.
                onComplete();
                return;
            }

            // Ha nem a legvége, akkor az előzőről levesszük, mielőtt az újra rátesszük
            if (lastSpan) {
                lastSpan.classList.remove('dkv-cursor-active');
            }

            const span = charsToReveal[index];
            span.style.opacity = '1';

            if (showCursor) {
                span.classList.add('dkv-cursor-active');
                lastSpan = span;
            }

            index++;
            const timeoutId = setTimeout(revealNext, speed);
            this.timeouts.push(timeoutId);
        };

        const timeoutId = setTimeout(revealNext, speed);
        this.timeouts.push(timeoutId);
    }

    _ensureCursorStyle() {
        if (!document.getElementById('dkv-cursor-style')) {
            const style = document.createElement('style');
            style.id = 'dkv-cursor-style';
            style.textContent = `
                .dkv-cursor-active {
                    position: relative;
                }
                .dkv-cursor-active::after {
                    content: '_';
                    position: absolute;
                    /* A karakter után közvetlenül */
                    left: 100%; 
                    bottom: 0; /* Baseline-hoz igazítva szövegnél */
                    margin-left: 1px;
                    
                    font-family: inherit;
                    font-weight: bold;
                    line-height: 1;
                    
                    color: rgba(255,255,255,0.8);
                    animation: dkv-blink 1s step-end infinite;
                    pointer-events: none;
                }
                @keyframes dkv-blink { 50% { opacity: 0; } }
            `;
            document.head.appendChild(style);
        }
    }

    stop() {
        this.timeouts.forEach(clearTimeout);
        this.timeouts = [];
        if (this.cursorElement) {
            this.cursorElement.remove();
            this.cursorElement = null;
        }
    }
}

export default Typewriter;
