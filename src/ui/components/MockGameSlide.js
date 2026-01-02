/**
 * MockGameSlide - Helyőrző a prototípus teszteléséhez
 */
class MockGameSlide {
    constructor(slideIndex) {
        this.slideIndex = slideIndex;
        this.element = null;
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.style.width = '100%';
        this.element.style.height = '100%';
        this.element.style.display = 'flex';
        this.element.style.flexDirection = 'column';
        this.element.style.alignItems = 'center';
        this.element.style.justifyContent = 'center';
        this.element.style.color = '#fff';

        // Nagy szöveg
        const text = document.createElement('h1');
        text.style.fontSize = '8rem';
        text.style.margin = '0';
        text.style.textShadow = '0 0 20px rgba(0,0,0,0.8)';
        text.textContent = `DIA ${this.slideIndex}`;

        // Kis leírás
        const sub = document.createElement('p');
        sub.style.fontSize = '2rem';
        sub.textContent = 'Prototípus tartalom';

        this.element.appendChild(text);
        this.element.appendChild(sub);

        return this.element;
    }
}

export default MockGameSlide;
