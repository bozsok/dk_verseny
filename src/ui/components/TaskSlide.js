/**
 * TaskSlide - Feladat megjelenítése
 * 
 * Jelenleg egy egyszerű placeholder, ami szimulálja a feladatmegoldást.
 * Később ide jön a valódi feladat logika (kódolás, kvíz, stb.)
 */
class TaskSlide {
    constructor(slideData, options = {}) {
        this.slideData = slideData;
        this.onComplete = options.onComplete || (() => { });
        this.onNext = options.onNext || (() => { });
        this.apiService = options.apiService;

        this.element = null;
        this.submitButton = null;
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'dkv-slide-container';

        // Cím
        const title = document.createElement('h2');
        title.className = 'dkv-slide-title';
        title.style.color = '#fbbf24'; // Warning color for tasks
        title.textContent = `⚡ ${this.slideData.title}`;

        const desc = document.createElement('p');
        desc.className = 'dkv-slide-description';
        desc.textContent = this.slideData.description;

        // Feladat helye (Placeholder)
        const taskArea = document.createElement('div');
        taskArea.style.background = 'rgba(255,255,255,0.05)';
        taskArea.style.padding = '2rem';
        taskArea.style.borderRadius = '12px';
        taskArea.style.margin = '2rem 0';
        taskArea.style.border = '1px dashed #666';
        taskArea.innerHTML = `
      <h3>Feladat azonosító: ${this.slideData.content.taskId}</h3>
      <p>Itt fog megjelenni a feladat editor vagy kvíz.</p>
      <p style="color: #4ade80">Típus: ${this.slideData.content.taskType}</p>
      <p>Pontérték: ${this.slideData.content.points} pont</p>
    `;

        // Beküldés gomb
        this.submitButton = document.createElement('button');
        this.submitButton.className = 'dkv-button';
        this.submitButton.textContent = 'Megoldás Beküldése';

        this.submitButton.onclick = () => this.handleSubmit();

        this.element.appendChild(title);
        this.element.appendChild(desc);
        this.element.appendChild(taskArea);
        this.element.appendChild(this.submitButton);

        return this.element;
    }

    async handleSubmit() {
        this.submitButton.disabled = true;
        this.submitButton.textContent = 'Beküldés...';

        // API hívás szimuláció
        try {
            if (this.apiService) {
                await this.apiService.submitScore({
                    taskId: this.slideData.content.taskId,
                    score: this.slideData.content.points,
                    totalTimeSpent: 120, // Fake time check
                    integrityHash: 'mock-hash'
                });
            }

            this.submitButton.textContent = 'Sikeres beküldés! ✅';
            this.submitButton.style.background = '#10b981';

            // Rövid várakozás után tovább
            setTimeout(() => {
                this.onComplete(); // Slide kész
                this.onNext();     // Tovább
            }, 1000);

        } catch (error) {
            console.error('Task submit failed:', error);
            this.submitButton.textContent = 'Hiba! Próbáld újra.';
            this.submitButton.disabled = false;
        }
    }

    destroy() {
        this.element.remove();
    }
}

export default TaskSlide;
