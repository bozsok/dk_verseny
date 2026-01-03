
import { SLIDE_TYPES } from '../../core/engine/slides-config.js';
import './styles/main.css';
import './styles/Welcome.css';
import './styles/Registration.css';
import './styles/Character.css';

// === GLOBÁLIS KONFIGURÁCIÓ (Grade 4) ===
// Téma: "Várkastély / Lovagi"

const GRADE_PATH = 'grade4';
const SHARED_BUTTON_STYLE = 'dkv-grade-4-button';

export const createConfig = () => {
    const slides = [];
    let idCounter = 1;

    // Helper függvény
    const addSlide = (type, title, description, content = {}) => {
        slides.push({
            id: `g4_slide_${idCounter++}`,
            type,
            title,
            description,
            content: {
                ...content,
                typingSpeed: 0 // Grade 4 default
            },
            isLocked: true,
            completed: false
        });
    };

    // Shuffle helper (Fisher-Yates)
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    // === ONBOARDING ===
    const bgImage = 'assets/images/grade4/onboarding_bg_placeholder.jpg';

    // 1. Welcome
    addSlide(SLIDE_TYPES.WELCOME, 'Üdvözöllek, 4. osztályos Kódlovag!', 'Te már tapasztalt utazó vagy a <b>Kód Királyságban</b>.<br>Meg kell védened a várat a digitális ostromtól.', {
        buttonText: 'Kalandra fel!',
        backgroundUrl: bgImage
    });

    // 2. Registration
    addSlide(SLIDE_TYPES.REGISTRATION, 'A Lovagi Tornához\nAdd meg az adataidat!', '', {
        fields: ['name', 'nickname', 'classId'],
        buttonText: 'Tovább',
        backgroundUrl: bgImage,
        validation: { allowedClasses: ['4.a', '4.b', '4.c'] },
        scoring: { name: 1, nick: 1, classId: 1 }
    });

    // 3. Character
    addSlide(SLIDE_TYPES.CHARACTER, 'Válaszd ki a hősödet!', 'Ki vezesse a seregeket?', {
        backgroundUrl: bgImage,
        scoring: { selection: 1 },
        characters: {
            boy: [
                { id: 'b1', icon: 'assets/images/grade3/karakter/small/boy_1_k.jpg', card: 'assets/images/grade3/characters/boy1_card.png', zoom: 'assets/images/grade3/characters/boy1_zoom.png' },
                { id: 'b2', icon: 'assets/images/grade3/karakter/small/boy_2_k.jpg', card: 'assets/images/grade3/characters/boy2_card.png', zoom: 'assets/images/grade3/characters/boy2_zoom.png' },
                { id: 'b3', icon: 'assets/images/grade3/karakter/small/boy_3_k.jpg', card: 'assets/images/grade3/characters/boy3_card.png', zoom: 'assets/images/grade3/characters/boy3_zoom.png' },
                { id: 'b4', icon: 'assets/images/grade3/karakter/small/boy_4_k.jpg', card: 'assets/images/grade3/characters/boy4_card.png', zoom: 'assets/images/grade3/characters/boy4_zoom.png' }
            ],
            girl: [
                { id: 'g1', icon: 'assets/images/grade3/karakter/small/girl_1_k.jpg', card: 'assets/images/grade3/characters/girl1_card.png', zoom: 'assets/images/grade3/characters/girl1_zoom.png' },
                { id: 'g2', icon: 'assets/images/grade3/karakter/small/girl_2_k.jpg', card: 'assets/images/grade3/characters/girl2_card.png', zoom: 'assets/images/grade3/characters/girl2_zoom.png' },
                { id: 'g3', icon: 'assets/images/grade3/karakter/small/girl_3_k.jpg', card: 'assets/images/grade3/characters/girl3_card.png', zoom: 'assets/images/grade3/characters/girl3_zoom.png' },
                { id: 'g4', icon: 'assets/images/grade3/karakter/small/girl_4_k.jpg', card: 'assets/images/grade3/characters/girl4_card.png', zoom: 'assets/images/grade3/characters/girl4_zoom.png' }
            ]
        }
    });

    // === 1. BEVEZETÉS (FIX 1-4) ===
    for (let i = 1; i <= 4; i++) {
        const slideNum = String(i).padStart(2, '0');
        const title = `Bevezetés ${i}. (Kontextus)`;
        let narrationText = `<b>${title}</b><br><br>Lovag, figyelem! Ez a bevezető szakasz.<br>(Helyőrző szöveg a ${i}. diánál)`;

        addSlide(SLIDE_TYPES.STORY, title, 'Kövessétek a lovagi utasításokat...', {
            imageUrl: `assets/images/grade4/slides/slide_${slideNum}.jpg`,
            narration: narrationText
        });
    }

    // === 2. ÁLLOMÁSOK (KEVERT 5-24) ===
    const stationIndices = [0, 1, 2, 3, 4];
    shuffleArray(stationIndices);
    console.log("[DKV Grade 4] Station Order:", stationIndices);

    for (let slot = 0; slot < 5; slot++) {
        const originalStationIdx = stationIndices[slot];
        const startSlideNum = 5 + (originalStationIdx * 4);

        for (let step = 0; step < 4; step++) {
            const originalNum = startSlideNum + step;
            const fileNumStr = String(originalNum).padStart(2, '0');

            const displayedStationNum = slot + 1;
            let title = `${displayedStationNum}. Állomás: `;
            if (step === 0 || step === 1) title += "Kontextus";
            else if (step === 2) title += "Feladat";
            else title += "Siker, Öröm";

            let storyContent = `<b>${title}</b><br><br>Helyőrző szöveg az eredeti ${originalNum}. diához.`;

            // === 1. ÁLLOMÁS: GÉPTEREM KAZAMATA (5-8) ===
            if (originalNum === 5) { storyContent = `[Gépterem Kazamata - Dia 1] Ide írd a bevezetőt...`; }
            else if (originalNum === 6) { storyContent = `[Gépterem Kazamata - Dia 2] ...`; }
            else if (originalNum === 7) { storyContent = `[Gépterem Kazamata - Dia 3] (Feladat)...`; }
            else if (originalNum === 8) { storyContent = `[Gépterem Kazamata - Dia 4] (Siker)...`; }

            // === 2. ÁLLOMÁS: ALGORITMUS BÁSTYA (9-12) ===
            else if (originalNum === 9) { storyContent = `[Algoritmus Bástya - Dia 1] Ide írd a bevezetőt...`; }
            else if (originalNum === 10) { storyContent = `[Algoritmus Bástya - Dia 2] ...`; }
            else if (originalNum === 11) { storyContent = `[Algoritmus Bástya - Dia 3] (Feladat)...`; }
            else if (originalNum === 12) { storyContent = `[Algoritmus Bástya - Dia 4] (Siker)...`; }

            // === 3. ÁLLOMÁS: PROGRAMOZÓK CSARNOKA (13-16) ===
            else if (originalNum === 13) { storyContent = `[Programozók Csarnoka - Dia 1] Ide írd a bevezetőt...`; }
            else if (originalNum === 14) { storyContent = `[Programozók Csarnoka - Dia 2] ...`; }
            else if (originalNum === 15) { storyContent = `[Programozók Csarnoka - Dia 3] (Feladat)...`; }
            else if (originalNum === 16) { storyContent = `[Programozók Csarnoka - Dia 4] (Siker)...`; }

            // === 4. ÁLLOMÁS: SÁRKÁNYTŰZ KOVÁCSMŰHELY (17-20) ===
            else if (originalNum === 17) { storyContent = `[Sárkánytűz Kovácsműhely - Dia 1] Ide írd a bevezetőt...`; }
            else if (originalNum === 18) { storyContent = `[Sárkánytűz Kovácsműhely - Dia 2] ...`; }
            else if (originalNum === 19) { storyContent = `[Sárkánytűz Kovácsműhely - Dia 3] (Feladat)...`; }
            else if (originalNum === 20) { storyContent = `[Sárkánytűz Kovácsműhely - Dia 4] (Siker)...`; }

            // === 5. ÁLLOMÁS: TITKOS KÓDKÖNYVTÁR (21-24) ===
            else if (originalNum === 21) { storyContent = `[Titkos Kódkönyvtár - Dia 1] Ide írd a bevezetőt...`; }
            else if (originalNum === 22) { storyContent = `[Titkos Kódkönyvtár - Dia 2] ...`; }
            else if (originalNum === 23) { storyContent = `[Titkos Kódkönyvtár - Dia 3] (Feladat)...`; }
            else if (originalNum === 24) { storyContent = `[Titkos Kódkönyvtár - Dia 4] (Siker)...`; }

            let narrationText = `${storyContent}<br><br><span style="font-size:0.8em; opacity:0.7;">(Debug: Eredeti Dia #${originalNum} | Hely #${slot + 1} | Order: ${stationIndices.map(n => n + 1).join('-')})</span>`;

            addSlide(SLIDE_TYPES.STORY, title, 'Teljesítsétek a lovagi kihívást...', {
                imageUrl: `assets/images/grade4/slides/slide_${fileNumStr}.jpg`,
                narration: narrationText
            });
        }
    }

    // === 3. FINÁLÉ (FIX 25-28) ===
    for (let i = 25; i <= 28; i++) {
        const slideNum = String(i).padStart(2, '0');
        let title = "Finálé: ";
        if (i === 25) title += "Kontextus";
        else if (i === 26) title += "Feladat";
        else if (i === 27) title += "Siker, Öröm";
        else title += "Összefoglaló";

        let narrationText = `<b>${title}</b><br><br>Lovag, elérted a célodat!<br>(Dia #${i})`;

        addSlide(SLIDE_TYPES.STORY, title, 'A végső megmérettetés...', {
            imageUrl: `assets/images/grade4/slides/slide_${slideNum}.jpg`,
            narration: narrationText
        });
    }

    return slides;
};
