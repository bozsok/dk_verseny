import VideoPlayer from './VideoPlayer.js';

/**
 * VideoSlide - Videós tartalom megjelenítése
 */
class VideoSlide {
    constructor(slideData, options = {}) {
        this.slideData = slideData;
        this.onComplete = options.onComplete || (() => { });
        this.onNext = options.onNext || (() => { });

        this.element = null;
        this.nextButton = null;
        this.videoPlayer = null;
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'dkv-slide-container';

        // Cím és leírás
        const title = document.createElement('h2');
        title.className = 'dkv-slide-title';
        title.textContent = this.slideData.title;

        const desc = document.createElement('p');
        desc.className = 'dkv-slide-description';
        desc.textContent = this.slideData.description;

        this.element.appendChild(title);
        this.element.appendChild(desc);

        // Videó lejátszó
        this.videoPlayer = new VideoPlayer({
            src: this.slideData.content.videoUrl,
            onComplete: () => this.handleVideoComplete()
        });

        this.element.appendChild(this.videoPlayer.createElement());

        // Tovább gomb (kezdetben inaktív/rejtett)
        this.nextButton = document.createElement('button');
        this.nextButton.className = 'dkv-button';
        this.nextButton.textContent = 'Tovább a következőre';
        this.nextButton.disabled = true; // Csak a videó végén válik aktívvá
        this.nextButton.style.marginTop = '2rem';

        this.nextButton.onclick = () => this.onNext();

        this.element.appendChild(this.nextButton);

        return this.element;
    }

    handleVideoComplete() {
        // Videó vége: feloldjuk a tovább gombot
        if (this.nextButton) {
            this.nextButton.disabled = false;
            this.nextButton.textContent = 'Tovább a következőre ✨';
            // Itt hívhatnánk az onComplete-et is, ha automatikusan menteni akarunk
            this.onComplete();
        }
    }

    destroy() {
        if (this.videoPlayer) {
            this.videoPlayer.destroy();
        }
        this.element.remove();
    }
}

export default VideoSlide;
