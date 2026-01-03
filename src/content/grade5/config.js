import { SLIDE_TYPES } from '../../core/engine/slides-config.js';
import './styles/main.css';
import './styles/Registration.css';
import './styles/Welcome.css';
import './styles/Character.css';

const TYPING_SPEED = 2; // Gyors gépelés (Cyberpunk)

export const createConfig = () => {
    const slides = [];
    let idCounter = 1;

    const addSlide = (type, title, description, content = {}) => {
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

    const bgImage = 'assets/images/grade5/onboarding_bg.png';

    addSlide(SLIDE_TYPES.WELCOME, 'Üdvözöllek, Ügynök!', 'Te lettél az egyik <b>Kiválasztott</b>, aki beléphet a szigorúan védett <b>Mátrix</b> rendszerbe.\nFeladatod a rendszer integritásának helyreállítása és a <b>Vírus</b> semlegesítése. A művelethez különböző digitális <b>Kódokat</b> kell megszerezned.\nCsatlakozz a csapathoz, és hajtsd végre a küldetést!', {
        buttonText: 'Belépés',
        backgroundUrl: bgImage,
        audioSrc: 'assets/audio/grade5/welcome.mp3'
    });

    addSlide(SLIDE_TYPES.REGISTRATION, 'Identifikáció szükséges! Írd be a teljes nevedet!\nEzt követően add meg a fedőnevedet (becenév) és az egységedet (osztály)!', '', {
        fields: ['name', 'nickname', 'classId'],
        buttonText: 'Identifikáció',
        backgroundUrl: bgImage,
        validation: {
            allowedClasses: ['5.a', '5.b', '5.c']
        },
        scoring: {
            name: 1,
            nick: 1,
            classId: 1
        },
        audioSrc: 'assets/audio/grade5/registration.mp3'
    });

    addSlide(SLIDE_TYPES.CHARACTER, 'Válassz avatárt a digitális megjelenésedhez!\nA képre kattintva nagyítható a nézet.', '', {
        characters: {
            boy: [
                { id: 'b1', card: 'assets/images/grade5/karakter/boy_1.jpg', zoom: 'assets/images/grade5/karakter/large/boy_1_n.jpg', icon: 'assets/images/grade5/karakter/small/boy_1_k.jpg' },
                { id: 'b2', card: 'assets/images/grade5/karakter/boy_2.jpg', zoom: 'assets/images/grade5/karakter/large/boy_2_n.jpg', icon: 'assets/images/grade5/karakter/small/boy_2_k.jpg' },
                { id: 'b3', card: 'assets/images/grade5/karakter/boy_3.jpg', zoom: 'assets/images/grade5/karakter/large/boy_3_n.jpg', icon: 'assets/images/grade5/karakter/small/boy_3_k.jpg' },
                { id: 'b4', card: 'assets/images/grade5/karakter/boy_4.jpg', zoom: 'assets/images/grade5/karakter/large/boy_4_n.jpg', icon: 'assets/images/grade5/karakter/small/boy_4_k.jpg' }
            ],
            girl: [
                { id: 'g1', card: 'assets/images/grade5/karakter/girl_1.jpg', zoom: 'assets/images/grade5/karakter/large/girl_1_n.jpg', icon: 'assets/images/grade5/karakter/small/girl_1_k.jpg' },
                { id: 'g2', card: 'assets/images/grade5/karakter/girl_2.jpg', zoom: 'assets/images/grade5/karakter/large/girl_2_n.jpg', icon: 'assets/images/grade5/karakter/small/girl_2_k.jpg' },
                { id: 'g3', card: 'assets/images/grade5/karakter/girl_3.jpg', zoom: 'assets/images/grade5/karakter/large/girl_3_n.jpg', icon: 'assets/images/grade5/karakter/small/girl_3_k.jpg' },
                { id: 'g4', card: 'assets/images/grade5/karakter/girl_4.jpg', zoom: 'assets/images/grade5/karakter/large/girl_4_n.jpg', icon: 'assets/images/grade5/karakter/small/girl_4_k.jpg' }
            ]
        },
        buttonText: 'Kiválasztás',
        backgroundUrl: bgImage,
        scoring: {
            selection: 1
        },
        audioSrc: 'assets/audio/grade5/character.mp3'
    });

    // === 1. BEVEZETÉS (FIX 1-4) ===
    for (let i = 1; i <= 4; i++) {
        const slideNum = String(i).padStart(2, '0');
        const title = `Bevezetés ${i}. (Mátrix)`;
        const narrationText = `<b>${title}</b><br><br>Helyőrző történet a Grade 5 (${i}.) diánál.<br>Az ügynökök eligazítása...`;

        addSlide(SLIDE_TYPES.STORY, title, 'Figyelem, adatátvitel...', {
            imageUrl: `assets/images/grade5/slides/slide_${slideNum}.jpg`,
            narration: narrationText,
            audioSrc: `assets/audio/grade5/slide_${slideNum}.mp3`
        });
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
            let title = `${displayedStationNum}. Szektor: `;
            if (step === 0 || step === 1) title += "Elemzés";
            else if (step === 2) title += "Behatolás";
            else title += "Siker";

            let storyContent = `<b>${title}</b><br><br>Helyőrző szöveg az eredeti Grade 5 #${originalNum}. diához.`;
            let narrationText = `${storyContent}<br><br><span style="font-size:0.8em; opacity:0.7;">(Debug: Eredeti Dia #${originalNum} | Hely #${slot + 1})</span>`;

            addSlide(SLIDE_TYPES.STORY, title, 'Hackelés folyamatban...', {
                imageUrl: `assets/images/grade5/slides/slide_${fileNumStr}.jpg`,
                narration: narrationText,
                audioSrc: `assets/audio/grade5/slide_${fileNumStr}.mp3`
            });
        }
    }

    // === 3. FINÁLÉ (FIX 25-28) ===
    for (let i = 25; i <= 28; i++) {
        const slideNum = String(i).padStart(2, '0');
        const title = "Rendszer Visszaállítva";
        const narrationText = `<b>${title}</b><br><br>Helyőrző szöveg az Grade 5 fináléjához (${i}. dia).`;

        addSlide(SLIDE_TYPES.STORY, title, 'Küldetés vége...', {
            imageUrl: `assets/images/grade5/slides/slide_${slideNum}.jpg`,
            narration: narrationText,
            audioSrc: `assets/audio/grade5/slide_${slideNum}.mp3`
        });
    }

    return slides;
};
