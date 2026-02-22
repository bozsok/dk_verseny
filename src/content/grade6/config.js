import { SLIDE_TYPES } from '../../core/engine/slides-config.js';
import './styles/main.css';
import './styles/Registration.css';
import './styles/Welcome.css';
import './styles/Character.css';
import videoConfig from './video-config.json';

const TYPING_SPEED = 2; // Gyors gépelés (Sci-Fi)

/**
 * Video config merge helper
 * @param {Object} slideConfig - Slide content object
 * @param {string} slideKey - Slide key (e.g., 'slide_01')
 */
const applyVideoConfig = (slideConfig, slideKey) => {
    const videoSettings = videoConfig.slides?.[slideKey];
    if (videoSettings) {
        if (videoSettings.videoDelay !== undefined) {
            slideConfig.videoDelay = videoSettings.videoDelay;
        }
        if (videoSettings.videoLoop !== undefined) {
            slideConfig.videoLoop = videoSettings.videoLoop;
        }
    }
};

export const createConfig = () => {
    const slides = [];
    let idCounter = 1;

    const addSlide = (type, title, description, content = {}, metadata = {}) => {
        const enrichedContent = {
            ...content,
            typingSpeed: TYPING_SPEED
        };
        slides.push({
            id: idCounter++,
            type,
            title,
            description,
            content: enrichedContent,
            metadata,
            isLocked: true,
            completed: false
        });
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const bgImage = 'assets/images/grade6/onboarding_bg.jpg';

    addSlide(SLIDE_TYPES.WELCOME, 'Üdvözöllek a Fedélzeten!', 'Te lettél az egyik <b>Űrhajós</b>, aki részt vesz a galaxis legnagyobb felfedező küldetésén.\nCélunk a titokzatos <b>Kristály Bolygó</b> elérése és az ott rejtőző energiaforrások felkutatása. A hajód navigálásához különböző <b>Csillagtérképeket</b> kell megszerezned.\nIndítsd be a hajtóműveket, és készülj a felszállásra!', {
        buttonText: 'Indítás',
        backgroundUrl: bgImage,
        audioSrc: 'assets/audio/grade6/welcome.mp3'
    }, { section: 'onboarding', step: 0 });

    addSlide(SLIDE_TYPES.REGISTRATION, 'Azonosítás: Kérlek, add meg a nevedet a hajónaplóhoz!\nEzt követően add meg a hívójeledet (becenév) és a rajt (osztály)!', '', {
        fields: ['name', 'nickname', 'classId'],
        buttonText: 'Rögzítés',
        backgroundUrl: bgImage,
        validation: {
            allowedClasses: ['6.a', '6.b', '6.c']
        },
        scoring: {
            name: 1,
            nick: 1,
            classId: 1
        },
        audioSrc: 'assets/audio/grade6/registration.mp3'
    }, { section: 'onboarding', step: 1 });

    addSlide(SLIDE_TYPES.CHARACTER, 'Válassz karaktert a küldetéshez!\nA profilképek kattintással nagyíthatók.', '', {
        characters: {
            boy: [
                { id: 'b1', card: 'assets/images/grade6/karakter/boy_1.jpg', zoom: 'assets/images/grade6/karakter/large/boy_1_n.jpg', icon: 'assets/images/grade6/karakter/small/boy_1_k.jpg' },
                { id: 'b2', card: 'assets/images/grade6/karakter/boy_2.jpg', zoom: 'assets/images/grade6/karakter/large/boy_2_n.jpg', icon: 'assets/images/grade6/karakter/small/boy_2_k.jpg' },
                { id: 'b3', card: 'assets/images/grade6/karakter/boy_3.jpg', zoom: 'assets/images/grade6/karakter/large/boy_3_n.jpg', icon: 'assets/images/grade6/karakter/small/boy_3_k.jpg' },
                { id: 'b4', card: 'assets/images/grade6/karakter/boy_4.jpg', zoom: 'assets/images/grade6/karakter/large/boy_4_n.jpg', icon: 'assets/images/grade6/karakter/small/boy_4_k.jpg' }
            ],
            girl: [
                { id: 'g1', card: 'assets/images/grade6/karakter/girl_1.jpg', zoom: 'assets/images/grade6/karakter/large/girl_1_n.jpg', icon: 'assets/images/grade6/karakter/small/girl_1_k.jpg' },
                { id: 'g2', card: 'assets/images/grade6/karakter/girl_2.jpg', zoom: 'assets/images/grade6/karakter/large/girl_2_n.jpg', icon: 'assets/images/grade6/karakter/small/girl_2_k.jpg' },
                { id: 'g3', card: 'assets/images/grade6/karakter/girl_3.jpg', zoom: 'assets/images/grade6/karakter/large/girl_3_n.jpg', icon: 'assets/images/grade6/karakter/small/girl_3_k.jpg' },
                { id: 'g4', card: 'assets/images/grade6/karakter/girl_4.jpg', zoom: 'assets/images/grade6/karakter/large/girl_4_n.jpg', icon: 'assets/images/grade6/karakter/small/girl_4_k.jpg' }
            ]
        },
        buttonText: 'Kiválasztás',
        backgroundUrl: bgImage,
        scoring: {
            selection: 1
        },
        audioSrc: 'assets/audio/grade6/character.mp3'
    }, { section: 'onboarding', step: 2 });

    // === 1. BEVEZETÉS (FIX 1-4) ===
    for (let i = 1; i <= 4; i++) {
        const slideNum = String(i).padStart(2, '0');
        const title = `Bevezetés ${i}. (Világűr)`;
        const narrationText = `<b>${title}</b><br><br>Helyőrző történet a Grade 6 (${i}.) diánál.<br>Űrutazás kezdete...`;

        addSlide(SLIDE_TYPES.STORY, title, 'Navigációs rendszerek élesítve...', {
            imageUrl: `assets/images/grade6/slides/slide_${slideNum}.jpg`,
            narration: narrationText,
            audioSrc: `assets/audio/grade6/slide_${slideNum}.mp3`
        }, { section: 'intro', step: i - 1 });
    }

    // === 2. ÁLLOMÁSOK (KEVERT 5-24) ===
    const stationIndices = [0, 1, 2, 3, 4];
    shuffleArray(stationIndices);

    for (let slot = 0; slot < 5; slot++) {
        const originalStationIdx = stationIndices[slot];
        const startSlideNum = 5 + (originalStationIdx * 4);

        for (let step = 0; step < 4; step++) {
            const originalNum = startSlideNum + step;
            const fileNumStr = String(originalNum).padStart(2, '0');

            const displayedStationNum = slot + 1;
            let title = `${displayedStationNum}. Bolygó: `;
            if (step === 0 || step === 1) title += "Megközelítés";
            else if (step === 2) title += "Landolás";
            else title += "Siker";

            let storyContent = `<b>${title}</b><br><br>Helyőrző szöveg az eredeti Grade 6 #${originalNum}. diához.`;
            let narrationText = `${storyContent}<br><br><span style="font-size:0.8em; opacity:0.7;">(Debug: Eredeti Dia #${originalNum} | Hely #${slot + 1})</span>`;

            addSlide(SLIDE_TYPES.STORY, title, 'Szenzorok adatgyűjtése...', {
                imageUrl: `assets/images/grade6/slides/slide_${fileNumStr}.jpg`,
                narration: narrationText,
                audioSrc: `assets/audio/grade6/slide_${fileNumStr}.mp3`
            }, { section: `station_${originalStationIdx + 1}`, step });
        }
    }

    // === 3. FINÁLÉ (FIX 25-28) ===
    for (let i = 25; i <= 28; i++) {
        const slideNum = String(i).padStart(2, '0');
        const title = "Küldetés Teljesítve";
        const narrationText = `<b>${title}</b><br><br>Helyőrző szöveg az Grade 6 fináléjához (${i}. dia).`;

        addSlide(SLIDE_TYPES.STORY, title, 'Hazatérés...', {
            imageUrl: `assets/images/grade6/slides/slide_${slideNum}.jpg`,
            narration: narrationText,
            audioSrc: `assets/audio/grade6/slide_${slideNum}.mp3`
        }, { section: 'final', step: i - 25 });
    }

    return slides;
};
